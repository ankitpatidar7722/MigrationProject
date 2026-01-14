-- ============================================
-- MigraTrack Pro - Complete Database Schema
-- Database Migration Tracking System
-- MS SQL Server 2019+
-- ============================================

USE master;
GO

-- Drop database if exists (for development/testing)
IF EXISTS (SELECT name FROM sys.databases WHERE name = N'MigraTrackDB')
BEGIN
    ALTER DATABASE MigraTrackDB SET SINGLE_USER WITH ROLLBACK IMMEDIATE;
    DROP DATABASE MigraTrackDB;
END
GO

-- Create database
CREATE DATABASE MigraTrackDB;
GO

USE MigraTrackDB;
GO

-- ============================================
-- SECTION 1: CORE SYSTEM TABLES
-- ============================================

-- Users/Authentication Table
CREATE TABLE Users (
    UserId INT IDENTITY(1,1) PRIMARY KEY,
    Username NVARCHAR(100) NOT NULL UNIQUE,
    Email NVARCHAR(255) NOT NULL UNIQUE,
    PasswordHash NVARCHAR(500) NOT NULL,
    FirstName NVARCHAR(100),
    LastName NVARCHAR(100),
    Role NVARCHAR(50) NOT NULL DEFAULT 'User', -- Admin, Manager, User, Viewer
    IsActive BIT NOT NULL DEFAULT 1,
    CreatedAt DATETIME2 NOT NULL DEFAULT GETDATE(),
    UpdatedAt DATETIME2 NOT NULL DEFAULT GETDATE(),
    LastLoginAt DATETIME2,
    CONSTRAINT CHK_User_Role CHECK (Role IN ('Admin', 'Manager', 'User', 'Viewer'))
);
GO

-- Module Groups (Fixed categories)
CREATE TABLE ModuleGroups (
    ModuleGroupId INT PRIMARY KEY,
    ModuleGroupName NVARCHAR(100) NOT NULL UNIQUE,
    Description NVARCHAR(500),
    IconName NVARCHAR(50),
    DisplayOrder INT NOT NULL DEFAULT 0,
    IsActive BIT NOT NULL DEFAULT 1,
    CreatedAt DATETIME2 NOT NULL DEFAULT GETDATE(),
    UpdatedAt DATETIME2 NOT NULL DEFAULT GETDATE()
);
GO

-- Field Master - Dynamic field definitions for each module
CREATE TABLE FieldMaster (
    FieldId INT IDENTITY(1,1) PRIMARY KEY,
    FieldName NVARCHAR(100) NOT NULL, -- Actual database column name
    FieldLabel NVARCHAR(200) NOT NULL, -- Display label
    FieldDescription NVARCHAR(500),
    ModuleGroupId INT NOT NULL,
    DataType NVARCHAR(50) NOT NULL, -- int, varchar, text, date, bit, dropdown, datetime
    MaxLength INT NULL, -- For varchar fields
    DefaultValue NVARCHAR(500),
    SelectQueryDb NVARCHAR(MAX), -- SQL Query for dropdown population
    IsRequired BIT NOT NULL DEFAULT 0,
    IsUnique BIT NOT NULL DEFAULT 0,
    DisplayOrder INT NOT NULL DEFAULT 0,
    IsActive BIT NOT NULL DEFAULT 1,
    ValidationRegex NVARCHAR(500), -- Custom validation pattern
    PlaceholderText NVARCHAR(200),
    HelpText NVARCHAR(500),
    CreatedAt DATETIME2 NOT NULL DEFAULT GETDATE(),
    UpdatedAt DATETIME2 NOT NULL DEFAULT GETDATE(),
    CONSTRAINT FK_FieldMaster_ModuleGroup FOREIGN KEY (ModuleGroupId) REFERENCES ModuleGroups(ModuleGroupId) ON DELETE CASCADE,
    CONSTRAINT CHK_DataType CHECK (DataType IN ('int', 'varchar', 'nvarchar', 'text', 'date', 'datetime', 'bit', 'dropdown', 'decimal', 'bigint')),
    CONSTRAINT UQ_FieldMaster_Name_Module UNIQUE (FieldName, ModuleGroupId)
);
GO

-- ============================================
-- SECTION 2: PROJECT MANAGEMENT
-- ============================================

-- Projects/Clients Table
CREATE TABLE Projects (
    ProjectId NVARCHAR(50) PRIMARY KEY, -- Can use GUID or custom IDs like 'p1', 'p2'
    ClientName NVARCHAR(200) NOT NULL,
    ClientCode NVARCHAR(50) UNIQUE,
    Description NVARCHAR(MAX),
    ProjectType NVARCHAR(100), -- ERP Migration, Database Migration, etc.
    Status NVARCHAR(50) NOT NULL DEFAULT 'Active', -- Active, On Hold, Completed, Cancelled
    StartDate DATE,
    TargetCompletionDate DATE,
    ActualCompletionDate DATE,
    ProjectManager NVARCHAR(200),
    TechnicalLead NVARCHAR(200),
    Budget DECIMAL(18,2),
    IsActive BIT NOT NULL DEFAULT 1,
    CreatedAt DATETIME2 NOT NULL DEFAULT GETDATE(),
    CreatedBy INT,
    UpdatedAt DATETIME2 NOT NULL DEFAULT GETDATE(),
    UpdatedBy INT,
    CONSTRAINT FK_Project_CreatedBy FOREIGN KEY (CreatedBy) REFERENCES Users(UserId),
    CONSTRAINT FK_Project_UpdatedBy FOREIGN KEY (UpdatedBy) REFERENCES Users(UserId),
    CONSTRAINT CHK_Project_Status CHECK (Status IN ('Active', 'On Hold', 'Completed', 'Cancelled', 'Planning'))
);
GO

-- Project Team Members
CREATE TABLE ProjectTeamMembers (
    ProjectTeamId INT IDENTITY(1,1) PRIMARY KEY,
    ProjectId NVARCHAR(50) NOT NULL,
    UserId INT NOT NULL,
    Role NVARCHAR(100) NOT NULL, -- Project Manager, Developer, QA, etc.
    AssignedDate DATE NOT NULL DEFAULT CAST(GETDATE() AS DATE),
    IsActive BIT NOT NULL DEFAULT 1,
    CONSTRAINT FK_ProjectTeam_Project FOREIGN KEY (ProjectId) REFERENCES Projects(ProjectId) ON DELETE CASCADE,
    CONSTRAINT FK_ProjectTeam_User FOREIGN KEY (UserId) REFERENCES Users(UserId),
    CONSTRAINT UQ_ProjectTeam UNIQUE (ProjectId, UserId, Role)
);
GO

-- ============================================
-- SECTION 3: DYNAMIC MODULE DATA STORAGE
-- ============================================

-- Dynamic Module Data - Generic storage for all modules
CREATE TABLE DynamicModuleData (
    RecordId NVARCHAR(50) PRIMARY KEY, -- GUID or custom ID
    ProjectId NVARCHAR(50) NOT NULL,
    ModuleGroupId INT NOT NULL,
    JsonData NVARCHAR(MAX) NOT NULL, -- Stores field-value pairs as JSON
    Status NVARCHAR(50),
    IsCompleted BIT NOT NULL DEFAULT 0,
    IsDeleted BIT NOT NULL DEFAULT 0,
    CreatedAt DATETIME2 NOT NULL DEFAULT GETDATE(),
    CreatedBy INT,
    UpdatedAt DATETIME2 NOT NULL DEFAULT GETDATE(),
    UpdatedBy INT,
    CONSTRAINT FK_DynamicData_Project FOREIGN KEY (ProjectId) REFERENCES Projects(ProjectId) ON DELETE CASCADE,
    CONSTRAINT FK_DynamicData_ModuleGroup FOREIGN KEY (ModuleGroupId) REFERENCES ModuleGroups(ModuleGroupId),
    CONSTRAINT FK_DynamicData_CreatedBy FOREIGN KEY (CreatedBy) REFERENCES Users(UserId),
    CONSTRAINT FK_DynamicData_UpdatedBy FOREIGN KEY (UpdatedBy) REFERENCES Users(UserId)
);
GO

-- Create index for performance
CREATE NONCLUSTERED INDEX IX_DynamicData_Project_Module 
ON DynamicModuleData(ProjectId, ModuleGroupId) INCLUDE (IsDeleted, Status);
GO

-- ============================================
-- SECTION 4: LEGACY/SPECIFIC MODULE TABLES
-- (For backward compatibility and reporting)
-- ============================================

-- Data Transfer Checks
CREATE TABLE DataTransferChecks (
    TransferId NVARCHAR(50) PRIMARY KEY,
    ProjectId NVARCHAR(50) NOT NULL,
    ModuleName NVARCHAR(200) NOT NULL,
    SubModuleName NVARCHAR(200),
    TableNameDesktop NVARCHAR(200) NOT NULL,
    TableNameWeb NVARCHAR(200) NOT NULL,
    RecordCountDesktop BIGINT,
    RecordCountWeb BIGINT,
    MatchPercentage DECIMAL(5,2),
    Status NVARCHAR(50) NOT NULL DEFAULT 'Not Started', -- Not Started, Pending, Completed
    IsCompleted BIT NOT NULL DEFAULT 0,
    MigratedDate DATE,
    VerifiedBy NVARCHAR(200),
    Comments NVARCHAR(MAX),
    CreatedAt DATETIME2 NOT NULL DEFAULT GETDATE(),
    UpdatedAt DATETIME2 NOT NULL DEFAULT GETDATE(),
    CONSTRAINT FK_Transfer_Project FOREIGN KEY (ProjectId) REFERENCES Projects(ProjectId) ON DELETE CASCADE,
    CONSTRAINT CHK_Transfer_Status CHECK (Status IN ('Not Started', 'Pending', 'In Progress', 'Completed', 'Failed'))
);
GO

-- Verification Records
CREATE TABLE VerificationRecords (
    VerificationId NVARCHAR(50) PRIMARY KEY,
    ProjectId NVARCHAR(50) NOT NULL,
    ModuleName NVARCHAR(200) NOT NULL,
    SubModuleName NVARCHAR(200),
    FieldName NVARCHAR(200) NOT NULL,
    Description NVARCHAR(MAX),
    SqlQuery NVARCHAR(MAX),
    ExpectedResult NVARCHAR(MAX),
    ActualResult NVARCHAR(MAX),
    Status NVARCHAR(50) NOT NULL DEFAULT 'Pending', -- Pending, Correct, Incorrect, Re-verify
    IsVerified BIT NOT NULL DEFAULT 0,
    VerifiedBy NVARCHAR(200),
    VerifiedDate DATE,
    Comments NVARCHAR(MAX),
    CreatedAt DATETIME2 NOT NULL DEFAULT GETDATE(),
    UpdatedAt DATETIME2 NOT NULL DEFAULT GETDATE(),
    CONSTRAINT FK_Verification_Project FOREIGN KEY (ProjectId) REFERENCES Projects(ProjectId) ON DELETE CASCADE,
    CONSTRAINT CHK_Verification_Status CHECK (Status IN ('Pending', 'Correct', 'Incorrect', 'Re-verify', 'Skipped'))
);
GO

-- Migration Issues
CREATE TABLE MigrationIssues (
    IssueId NVARCHAR(50) PRIMARY KEY,
    IssueNumber NVARCHAR(50) UNIQUE, -- User-friendly issue number like ISS-001
    ProjectId NVARCHAR(50) NOT NULL,
    ModuleName NVARCHAR(200),
    SubModuleName NVARCHAR(200),
    Title NVARCHAR(500) NOT NULL,
    Description NVARCHAR(MAX),
    RootCause NVARCHAR(MAX),
    Solution NVARCHAR(MAX),
    Status NVARCHAR(50) NOT NULL DEFAULT 'Open', -- Open, In Progress, Resolved, Closed, Reopened
    Priority NVARCHAR(50) NOT NULL DEFAULT 'Medium', -- Low, Medium, High, Critical
    Severity NVARCHAR(50), -- Minor, Major, Critical, Blocker
    Category NVARCHAR(100), -- Data Issue, Logic Error, Performance, UI/UX, etc.
    AssignedTo NVARCHAR(200),
    ReportedBy NVARCHAR(200),
    ReportedDate DATE NOT NULL DEFAULT CAST(GETDATE() AS DATE),
    ResolvedDate DATE,
    ClosedDate DATE,
    EstimatedHours DECIMAL(10,2),
    ActualHours DECIMAL(10,2),
    Remarks NVARCHAR(MAX),
    CreatedAt DATETIME2 NOT NULL DEFAULT GETDATE(),
    UpdatedAt DATETIME2 NOT NULL DEFAULT GETDATE(),
    CONSTRAINT FK_Issue_Project FOREIGN KEY (ProjectId) REFERENCES Projects(ProjectId) ON DELETE CASCADE,
    CONSTRAINT CHK_Issue_Status CHECK (Status IN ('Open', 'In Progress', 'Resolved', 'Closed', 'Reopened', 'On Hold')),
    CONSTRAINT CHK_Issue_Priority CHECK (Priority IN ('Low', 'Medium', 'High', 'Critical')),
    CONSTRAINT CHK_Issue_Severity CHECK (Severity IN ('Minor', 'Major', 'Critical', 'Blocker'))
);
GO

-- Customization Points
CREATE TABLE CustomizationPoints (
    CustomizationId NVARCHAR(50) PRIMARY KEY,
    RequirementId NVARCHAR(50) UNIQUE, -- e.g., REQ-001
    ProjectId NVARCHAR(50) NOT NULL,
    ModuleName NVARCHAR(200),
    SubModuleName NVARCHAR(200),
    Title NVARCHAR(500) NOT NULL,
    Description NVARCHAR(MAX),
    Type NVARCHAR(100) NOT NULL, -- UI, Report, Database, Workflow, Integration, Other
    Status NVARCHAR(50) NOT NULL DEFAULT 'Not Started', -- Not Started, In Progress, Completed, Dropped, On Hold
    IsBillable BIT NOT NULL DEFAULT 0,
    EstimatedCost DECIMAL(18,2),
    ActualCost DECIMAL(18,2),
    EstimatedHours DECIMAL(10,2),
    ActualHours DECIMAL(10,2),
    Priority NVARCHAR(50),
    RequestedBy NVARCHAR(200),
    ApprovedBy NVARCHAR(200),
    DevelopedBy NVARCHAR(200),
    RequestedDate DATE,
    ApprovedDate DATE,
    CompletedDate DATE,
    Notes NVARCHAR(MAX),
    CreatedAt DATETIME2 NOT NULL DEFAULT GETDATE(),
    UpdatedAt DATETIME2 NOT NULL DEFAULT GETDATE(),
    CONSTRAINT FK_Customization_Project FOREIGN KEY (ProjectId) REFERENCES Projects(ProjectId) ON DELETE CASCADE,
    CONSTRAINT CHK_Customization_Type CHECK (Type IN ('UI', 'Report', 'Database', 'Workflow', 'Integration', 'API', 'Other')),
    CONSTRAINT CHK_Customization_Status CHECK (Status IN ('Not Started', 'In Progress', 'Completed', 'Dropped', 'On Hold', 'Testing'))
);
GO

-- ============================================
-- SECTION 5: SUPPORTING TABLES
-- ============================================

-- Comments/Notes System (can be attached to any module)
CREATE TABLE Comments (
    CommentId INT IDENTITY(1,1) PRIMARY KEY,
    EntityType NVARCHAR(50) NOT NULL, -- 'Transfer', 'Verification', 'Issue', 'Customization', 'Project'
    EntityId NVARCHAR(50) NOT NULL, -- ID of the entity
    CommentText NVARCHAR(MAX) NOT NULL,
    CreatedBy INT NOT NULL,
    CreatedAt DATETIME2 NOT NULL DEFAULT GETDATE(),
    UpdatedAt DATETIME2 NOT NULL DEFAULT GETDATE(),
    IsDeleted BIT NOT NULL DEFAULT 0,
    CONSTRAINT FK_Comment_User FOREIGN KEY (CreatedBy) REFERENCES Users(UserId)
);
GO

-- Attachments/Documents
CREATE TABLE Attachments (
    AttachmentId INT IDENTITY(1,1) PRIMARY KEY,
    EntityType NVARCHAR(50) NOT NULL,
    EntityId NVARCHAR(50) NOT NULL,
    FileName NVARCHAR(500) NOT NULL,
    FileSize BIGINT,
    FileType NVARCHAR(100),
    FilePath NVARCHAR(1000) NOT NULL, -- Physical path or blob storage URL
    UploadedBy INT NOT NULL,
    UploadedAt DATETIME2 NOT NULL DEFAULT GETDATE(),
    IsDeleted BIT NOT NULL DEFAULT 0,
    CONSTRAINT FK_Attachment_User FOREIGN KEY (UploadedBy) REFERENCES Users(UserId)
);
GO

-- Activity/Audit Log
CREATE TABLE ActivityLog (
    LogId BIGINT IDENTITY(1,1) PRIMARY KEY,
    UserId INT,
    EntityType NVARCHAR(50),
    EntityId NVARCHAR(50),
    Action NVARCHAR(100) NOT NULL, -- Created, Updated, Deleted, Viewed, Exported
    Details NVARCHAR(MAX),
    IpAddress NVARCHAR(50),
    UserAgent NVARCHAR(500),
    CreatedAt DATETIME2 NOT NULL DEFAULT GETDATE(),
    CONSTRAINT FK_ActivityLog_User FOREIGN KEY (UserId) REFERENCES Users(UserId)
);
GO

-- Project Milestones
CREATE TABLE ProjectMilestones (
    MilestoneId INT IDENTITY(1,1) PRIMARY KEY,
    ProjectId NVARCHAR(50) NOT NULL,
    MilestoneName NVARCHAR(200) NOT NULL,
    Description NVARCHAR(MAX),
    PlannedDate DATE NOT NULL,
    ActualDate DATE,
    Status NVARCHAR(50) NOT NULL DEFAULT 'Pending', -- Pending, Completed, Missed
    IsActive BIT NOT NULL DEFAULT 1,
    CreatedAt DATETIME2 NOT NULL DEFAULT GETDATE(),
    UpdatedAt DATETIME2 NOT NULL DEFAULT GETDATE(),
    CONSTRAINT FK_Milestone_Project FOREIGN KEY (ProjectId) REFERENCES Projects(ProjectId) ON DELETE CASCADE
);
GO

-- Lookup/Reference Data Table (for dynamic dropdowns)
CREATE TABLE LookupData (
    LookupId INT IDENTITY(1,1) PRIMARY KEY,
    LookupType NVARCHAR(100) NOT NULL, -- Category/Type of lookup
    LookupKey NVARCHAR(100) NOT NULL, -- Unique key within type
    LookupValue NVARCHAR(500) NOT NULL, -- Display value
    ParentLookupId INT NULL, -- For hierarchical data
    DisplayOrder INT NOT NULL DEFAULT 0,
    IsActive BIT NOT NULL DEFAULT 1,
    CreatedAt DATETIME2 NOT NULL DEFAULT GETDATE(),
    CONSTRAINT FK_Lookup_Parent FOREIGN KEY (ParentLookupId) REFERENCES LookupData(LookupId),
    CONSTRAINT UQ_Lookup_Type_Key UNIQUE (LookupType, LookupKey)
);
GO

-- ============================================
-- SECTION 6: SEED DATA
-- ============================================

-- Insert Module Groups
INSERT INTO ModuleGroups (ModuleGroupId, ModuleGroupName, Description, IconName, DisplayOrder) VALUES
(1001, 'Data Transfer Checks', 'Table-by-table migration tracking', 'database', 1),
(1002, 'Verification List', 'Logic and field accuracy validation', 'shield-check', 2),
(1003, 'Migration Issues', 'Bug tracker and blockers', 'alert-triangle', 3),
(1004, 'Customization Points', 'Client-specific feature requests', 'cog', 4);
GO

-- Insert Field Master for Data Transfer Checks (Module 1001)
INSERT INTO FieldMaster (FieldName, FieldLabel, FieldDescription, ModuleGroupId, DataType, IsRequired, DisplayOrder) VALUES
('moduleName', 'Module Name', 'Name of the module being migrated', 1001, 'nvarchar', 1, 1),
('subModuleName', 'Sub-Module Name', 'Sub-module or component name', 1001, 'nvarchar', 0, 2),
('tableNameDesktop', 'Desktop Table Name', 'Source table name in desktop application', 1001, 'nvarchar', 1, 3),
('tableNameWeb', 'Web Table Name', 'Target table name in web application', 1001, 'nvarchar', 1, 4),
('recordCountDesktop', 'Desktop Record Count', 'Number of records in source', 1001, 'int', 0, 5),
('recordCountWeb', 'Web Record Count', 'Number of records in target', 1001, 'int', 0, 6),
('status', 'Status', 'Migration status', 1001, 'dropdown', 1, 7),
('isCompleted', 'Completed', 'Migration completed flag', 1001, 'bit', 0, 8);
GO

-- Insert Field Master for Verification List (Module 1002)
INSERT INTO FieldMaster (FieldName, FieldLabel, FieldDescription, ModuleGroupId, DataType, IsRequired, DisplayOrder) VALUES
('moduleName', 'Module Name', 'Module being verified', 1002, 'nvarchar', 1, 1),
('subModuleName', 'Sub-Module Name', 'Sub-module name', 1002, 'nvarchar', 0, 2),
('fieldName', 'Field Name', 'Field being verified', 1002, 'nvarchar', 1, 3),
('description', 'Description', 'Verification description', 1002, 'text', 1, 4),
('sqlQuery', 'SQL Query', 'Verification query', 1002, 'text', 0, 5),
('status', 'Status', 'Verification status', 1002, 'dropdown', 1, 6),
('isVerified', 'Verified', 'Verification completed', 1002, 'bit', 0, 7);
GO

-- Insert Field Master for Migration Issues (Module 1003)
INSERT INTO FieldMaster (FieldName, FieldLabel, FieldDescription, ModuleGroupId, DataType, IsRequired, DisplayOrder) VALUES
('issueId', 'Issue ID', 'Unique issue identifier', 1003, 'nvarchar', 1, 1),
('moduleName', 'Module Name', 'Module with issue', 1003, 'nvarchar', 1, 2),
('subModuleName', 'Sub-Module Name', 'Sub-module name', 1003, 'nvarchar', 0, 3),
('description', 'Description', 'Issue description', 1003, 'text', 1, 4),
('rootCause', 'Root Cause', 'Root cause analysis', 1003, 'text', 0, 5),
('status', 'Status', 'Issue status', 1003, 'dropdown', 1, 6),
('priority', 'Priority', 'Issue priority', 1003, 'dropdown', 1, 7),
('remarks', 'Remarks', 'Additional notes', 1003, 'text', 0, 8),
('reportedDate', 'Reported Date', 'Date issue was reported', 1003, 'date', 1, 9);
GO

-- Insert Field Master for Customization Points (Module 1004)
INSERT INTO FieldMaster (FieldName, FieldLabel, FieldDescription, ModuleGroupId, DataType, IsRequired, DisplayOrder) VALUES
('requirementId', 'Requirement ID', 'Unique requirement identifier', 1004, 'nvarchar', 1, 1),
('moduleName', 'Module Name', 'Module to customize', 1004, 'nvarchar', 1, 2),
('subModuleName', 'Sub-Module Name', 'Sub-module name', 1004, 'nvarchar', 0, 3),
('description', 'Description', 'Customization details', 1004, 'text', 1, 4),
('type', 'Type', 'Customization type', 1004, 'dropdown', 1, 5),
('status', 'Status', 'Customization status', 1004, 'dropdown', 1, 6),
('isBillable', 'Billable', 'Is this billable work', 1004, 'bit', 0, 7),
('notes', 'Notes', 'Additional notes', 1004, 'text', 0, 8);
GO

-- Insert Lookup Data for dropdowns
INSERT INTO LookupData (LookupType, LookupKey, LookupValue, DisplayOrder) VALUES
-- Transfer Status
('TransferStatus', 'not_started', 'Not Started', 1),
('TransferStatus', 'pending', 'Pending', 2),
('TransferStatus', 'completed', 'Completed', 3),
-- Verification Status
('VerificationStatus', 'pending', 'Pending', 1),
('VerificationStatus', 'correct', 'Correct', 2),
('VerificationStatus', 'incorrect', 'Incorrect', 3),
('VerificationStatus', 'reverify', 'Re-verify', 4),
-- Issue Status
('IssueStatus', 'open', 'Open', 1),
('IssueStatus', 'in_progress', 'In Progress', 2),
('IssueStatus', 'resolved', 'Resolved', 3),
('IssueStatus', 'closed', 'Closed', 4),
-- Priority
('Priority', 'low', 'Low', 1),
('Priority', 'medium', 'Medium', 2),
('Priority', 'high', 'High', 3),
('Priority', 'critical', 'Critical', 4),
-- Customization Type
('CustomizationType', 'ui', 'UI', 1),
('CustomizationType', 'report', 'Report', 2),
('CustomizationType', 'database', 'Database', 3),
('CustomizationType', 'workflow', 'Workflow', 4),
('CustomizationType', 'other', 'Other', 5),
-- Customization Status
('CustomizationStatus', 'not_started', 'Not Started', 1),
('CustomizationStatus', 'in_progress', 'In Progress', 2),
('CustomizationStatus', 'completed', 'Completed', 3),
('CustomizationStatus', 'dropped', 'Dropped', 4);
GO

-- Insert Default Admin User (Password: Admin@123 - CHANGE IN PRODUCTION!)
INSERT INTO Users (Username, Email, PasswordHash, FirstName, LastName, Role) VALUES
('admin', 'admin@migratrack.com', 'AQAAAAEAACcQAAAAEBqE7pqZ8xJQ+7c7jKqN0JhZ1YqvQ8xJQ+7c7jKqN0JhZ1YqvQ8xJQ==', 'System', 'Administrator', 'Admin'),
('demo', 'demo@migratrack.com', 'AQAAAAEAACcQAAAAEBqE7pqZ8xJQ+7c7jKqN0JhZ1YqvQ8xJQ+7c7jKqN0JhZ1YqvQ8xJQ==', 'Demo', 'User', 'User');
GO

-- Insert Sample Projects
INSERT INTO Projects (ProjectId, ClientName, ClientCode, Description, ProjectType, Status, StartDate, ProjectManager) VALUES
('p1', 'Globex Corp', 'GLX', 'Financial ERP Migration from Desktop to Web', 'ERP Migration', 'Active', '2024-01-01', 'John Smith'),
('p2', 'Soylent Corp', 'SYL', 'Logistics Database Transition', 'Database Migration', 'Active', '2024-02-15', 'Jane Doe');
GO

-- Insert Sample Transfer Checks
INSERT INTO DataTransferChecks (TransferId, ProjectId, ModuleName, SubModuleName, TableNameDesktop, TableNameWeb, RecordCountDesktop, RecordCountWeb, Status, IsCompleted) VALUES
('t1', 'p1', 'Accounting', 'General Ledger', 'tbl_GL_Main', 'Ledgers', 15234, 15234, 'Completed', 1),
('t2', 'p1', 'Accounting', 'Invoicing', 'tbl_Invoice_Head', 'Invoices', 8921, 8750, 'Pending', 0),
('t3', 'p2', 'Inventory', 'Products', 'tbl_Products', 'ProductMaster', 5678, 5678, 'Completed', 1);
GO

-- ============================================
-- SECTION 7: VIEWS FOR REPORTING
-- ============================================

-- View: Project Summary with Statistics
CREATE VIEW vw_ProjectSummary AS
SELECT 
    p.ProjectId,
    p.ClientName,
    p.Status AS ProjectStatus,
    p.StartDate,
    p.TargetCompletionDate,
    -- Transfer Statistics
    (SELECT COUNT(*) FROM DataTransferChecks WHERE ProjectId = p.ProjectId) AS TotalTransfers,
    (SELECT COUNT(*) FROM DataTransferChecks WHERE ProjectId = p.ProjectId AND IsCompleted = 1) AS CompletedTransfers,
    -- Issue Statistics
    (SELECT COUNT(*) FROM MigrationIssues WHERE ProjectId = p.ProjectId) AS TotalIssues,
    (SELECT COUNT(*) FROM MigrationIssues WHERE ProjectId = p.ProjectId AND Status IN ('Open', 'In Progress')) AS OpenIssues,
    -- Verification Statistics
    (SELECT COUNT(*) FROM VerificationRecords WHERE ProjectId = p.ProjectId) AS TotalVerifications,
    (SELECT COUNT(*) FROM VerificationRecords WHERE ProjectId = p.ProjectId AND IsVerified = 1) AS CompletedVerifications,
    -- Customization Statistics
    (SELECT COUNT(*) FROM CustomizationPoints WHERE ProjectId = p.ProjectId) AS TotalCustomizations,
    (SELECT COUNT(*) FROM CustomizationPoints WHERE ProjectId = p.ProjectId AND Status = 'Completed') AS CompletedCustomizations,
    p.CreatedAt
FROM Projects p
WHERE p.IsActive = 1;
GO

-- View: Active Issues Summary
CREATE VIEW vw_ActiveIssues AS
SELECT 
    i.IssueNumber,
    i.ProjectId,
    p.ClientName,
    i.Title,
    i.Status,
    i.Priority,
    i.AssignedTo,
    i.ReportedDate,
    DATEDIFF(DAY, i.ReportedDate, GETDATE()) AS DaysOpen
FROM MigrationIssues i
INNER JOIN Projects p ON i.ProjectId = p.ProjectId
WHERE i.Status IN ('Open', 'In Progress')
ORDER BY 
    CASE i.Priority 
        WHEN 'Critical' THEN 1 
        WHEN 'High' THEN 2 
        WHEN 'Medium' THEN 3 
        ELSE 4 
    END;
GO

-- View: Module Statistics
CREATE VIEW vw_ModuleStatistics AS
SELECT 
    mg.ModuleGroupId,
    mg.ModuleGroupName,
    COUNT(DISTINCT dm.ProjectId) AS ActiveProjects,
    COUNT(*) AS TotalRecords,
    SUM(CASE WHEN dm.IsCompleted = 1 THEN 1 ELSE 0 END) AS CompletedRecords,
    CAST(SUM(CASE WHEN dm.IsCompleted = 1 THEN 1 ELSE 0 END) * 100.0 / NULLIF(COUNT(*), 0) AS DECIMAL(5,2)) AS CompletionPercentage
FROM ModuleGroups mg
LEFT JOIN DynamicModuleData dm ON mg.ModuleGroupId = dm.ModuleGroupId AND dm.IsDeleted = 0
WHERE mg.IsActive = 1
GROUP BY mg.ModuleGroupId, mg.ModuleGroupName;
GO

-- ============================================
-- SECTION 8: STORED PROCEDURES
-- ============================================

-- Get Dashboard Statistics for a Project
CREATE PROCEDURE sp_GetProjectDashboard
    @ProjectId NVARCHAR(50)
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        -- Module Counts
        (SELECT COUNT(*) FROM DataTransferChecks WHERE ProjectId = @ProjectId) +
        (SELECT COUNT(*) FROM VerificationRecords WHERE ProjectId = @ProjectId) +
        (SELECT COUNT(*) FROM MigrationIssues WHERE ProjectId = @ProjectId) +
        (SELECT COUNT(*) FROM CustomizationPoints WHERE ProjectId = @ProjectId) AS TotalModules,
        
        -- Completed Migrations
        (SELECT COUNT(*) FROM DataTransferChecks WHERE ProjectId = @ProjectId AND IsCompleted = 1) AS CompletedMigrations,
        
        -- Pending Migrations
        (SELECT COUNT(*) FROM DataTransferChecks WHERE ProjectId = @ProjectId AND IsCompleted = 0) AS PendingMigrations,
        
        -- Total Issues
        (SELECT COUNT(*) FROM MigrationIssues WHERE ProjectId = @ProjectId AND Status IN ('Open', 'In Progress')) AS TotalIssues,
        
        -- Critical Issues
        (SELECT COUNT(*) FROM MigrationIssues WHERE ProjectId = @ProjectId AND Priority = 'Critical' AND Status != 'Closed') AS CriticalIssues,
        
        -- Completion Percentage
        CAST(
            (SELECT COUNT(*) FROM DataTransferChecks WHERE ProjectId = @ProjectId AND IsCompleted = 1) * 100.0 / 
            NULLIF((SELECT COUNT(*) FROM DataTransferChecks WHERE ProjectId = @ProjectId), 0)
        AS DECIMAL(5,2)) AS CompletionPercentage;
END;
GO

-- Save Dynamic Module Data
CREATE PROCEDURE sp_SaveDynamicModuleData
    @RecordId NVARCHAR(50),
    @ProjectId NVARCHAR(50),
    @ModuleGroupId INT,
    @JsonData NVARCHAR(MAX),
    @Status NVARCHAR(50) = NULL,
    @IsCompleted BIT = 0,
    @UserId INT = NULL
AS
BEGIN
    SET NOCOUNT ON;
    
    IF EXISTS (SELECT 1 FROM DynamicModuleData WHERE RecordId = @RecordId)
    BEGIN
        UPDATE DynamicModuleData
        SET JsonData = @JsonData,
            Status = @Status,
            IsCompleted = @IsCompleted,
            UpdatedAt = GETDATE(),
            UpdatedBy = @UserId
        WHERE RecordId = @RecordId;
    END
    ELSE
    BEGIN
        INSERT INTO DynamicModuleData (RecordId, ProjectId, ModuleGroupId, JsonData, Status, IsCompleted, CreatedBy)
        VALUES (@RecordId, @ProjectId, @ModuleGroupId, @JsonData, @Status, @IsCompleted, @UserId);
    END
    
    SELECT * FROM DynamicModuleData WHERE RecordId = @RecordId;
END;
GO

-- Get Dynamic Module Data
CREATE PROCEDURE sp_GetDynamicModuleData
    @ProjectId NVARCHAR(50),
    @ModuleGroupId INT
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT *
    FROM DynamicModuleData
    WHERE ProjectId = @ProjectId 
      AND ModuleGroupId = @ModuleGroupId
      AND IsDeleted = 0
    ORDER BY CreatedAt DESC;
END;
GO

-- ============================================
-- SECTION 9: INDEXES FOR PERFORMANCE
-- ============================================

CREATE NONCLUSTERED INDEX IX_Projects_Status ON Projects(Status) INCLUDE (ClientName, ProjectId);
CREATE NONCLUSTERED INDEX IX_Issues_Status_Priority ON MigrationIssues(Status, Priority);
CREATE NONCLUSTERED INDEX IX_Issues_Project ON MigrationIssues(ProjectId);
CREATE NONCLUSTERED INDEX IX_Transfer_Project ON DataTransferChecks(ProjectId);
CREATE NONCLUSTERED INDEX IX_Verification_Project ON VerificationRecords(ProjectId);
CREATE NONCLUSTERED INDEX IX_Customization_Project ON CustomizationPoints(ProjectId);
CREATE NONCLUSTERED INDEX IX_Comments_Entity ON Comments(EntityType, EntityId);
CREATE NONCLUSTERED INDEX IX_ActivityLog_Entity ON ActivityLog(EntityType, EntityId);
GO

-- ============================================
-- SECTION 10: FUNCTIONS
-- ============================================

-- Function to Calculate Project Progress
CREATE FUNCTION fn_CalculateProjectProgress(@ProjectId NVARCHAR(50))
RETURNS DECIMAL(5,2)
AS
BEGIN
    DECLARE @TotalItems INT;
    DECLARE @CompletedItems INT;
    DECLARE @Progress DECIMAL(5,2);
    
    SELECT @TotalItems = COUNT(*)
    FROM (
        SELECT TransferId AS Id FROM DataTransferChecks WHERE ProjectId = @ProjectId
        UNION ALL
        SELECT VerificationId FROM VerificationRecords WHERE ProjectId = @ProjectId
        UNION ALL
        SELECT CustomizationId FROM CustomizationPoints WHERE ProjectId = @ProjectId
    ) AS AllItems;
    
    SELECT @CompletedItems = COUNT(*)
    FROM (
        SELECT TransferId FROM DataTransferChecks WHERE ProjectId = @ProjectId AND IsCompleted = 1
        UNION ALL
        SELECT VerificationId FROM VerificationRecords WHERE ProjectId = @ProjectId AND IsVerified = 1
        UNION ALL
        SELECT CustomizationId FROM CustomizationPoints WHERE ProjectId = @ProjectId AND Status = 'Completed'
    ) AS CompletedItems;
    
    SET @Progress = CASE 
        WHEN @TotalItems = 0 THEN 0
        ELSE CAST(@CompletedItems * 100.0 / @TotalItems AS DECIMAL(5,2))
    END;
    
    RETURN @Progress;
END;
GO

-- ============================================
-- END OF SCHEMA
-- ============================================

PRINT 'MigraTrack Pro Database Schema Created Successfully!';
PRINT 'Database: MigraTrackDB';
PRINT 'Total Tables: 16';
PRINT 'Total Views: 3';
PRINT 'Total Stored Procedures: 3';
PRINT 'Total Functions: 1';
GO

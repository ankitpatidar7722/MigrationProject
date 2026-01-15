-- UpdateMigrationIssuesSchema.sql
-- Adds all missing columns to the MigrationIssues table to match the C# model

-- 1. IsResolved
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[MigrationIssues]') AND name = 'IsResolved')
BEGIN
    ALTER TABLE [dbo].[MigrationIssues] ADD IsResolved BIT NOT NULL DEFAULT 0;
END

-- 2. IsDeletedTransaction (Soft Delete)
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[MigrationIssues]') AND name = 'IsDeletedTransaction')
BEGIN
    ALTER TABLE [dbo].[MigrationIssues] ADD IsDeletedTransaction INT NOT NULL DEFAULT 0;
END

-- 3. Category
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[MigrationIssues]') AND name = 'Category')
BEGIN
    ALTER TABLE [dbo].[MigrationIssues] ADD Category NVARCHAR(100) NULL;
END

-- 4. AssignedTo
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[MigrationIssues]') AND name = 'AssignedTo')
BEGIN
    ALTER TABLE [dbo].[MigrationIssues] ADD AssignedTo NVARCHAR(200) NULL;
END

-- 5. ReportedBy
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[MigrationIssues]') AND name = 'ReportedBy')
BEGIN
    ALTER TABLE [dbo].[MigrationIssues] ADD ReportedBy NVARCHAR(200) NULL;
END

-- 6. ReportedDate
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[MigrationIssues]') AND name = 'ReportedDate')
BEGIN
    ALTER TABLE [dbo].[MigrationIssues] ADD ReportedDate DATETIME2 NOT NULL DEFAULT GETDATE();
END

-- 7. ResolvedDate
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[MigrationIssues]') AND name = 'ResolvedDate')
BEGIN
    ALTER TABLE [dbo].[MigrationIssues] ADD ResolvedDate DATETIME2 NULL;
END

-- 8. ClosedDate
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[MigrationIssues]') AND name = 'ClosedDate')
BEGIN
    ALTER TABLE [dbo].[MigrationIssues] ADD ClosedDate DATETIME2 NULL;
END

-- 9. EstimatedHours
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[MigrationIssues]') AND name = 'EstimatedHours')
BEGIN
    ALTER TABLE [dbo].[MigrationIssues] ADD EstimatedHours DECIMAL(10,2) NULL;
END

-- 10. ActualHours
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[MigrationIssues]') AND name = 'ActualHours')
BEGIN
    ALTER TABLE [dbo].[MigrationIssues] ADD ActualHours DECIMAL(10,2) NULL;
END

-- 11. Remarks
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[MigrationIssues]') AND name = 'Remarks')
BEGIN
    ALTER TABLE [dbo].[MigrationIssues] ADD Remarks NVARCHAR(MAX) NULL;
END

-- 12. CreatedAt
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[MigrationIssues]') AND name = 'CreatedAt')
BEGIN
    ALTER TABLE [dbo].[MigrationIssues] ADD CreatedAt DATETIME2 NOT NULL DEFAULT GETDATE();
END

-- 13. UpdatedAt
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[MigrationIssues]') AND name = 'UpdatedAt')
BEGIN
    ALTER TABLE [dbo].[MigrationIssues] ADD UpdatedAt DATETIME2 NOT NULL DEFAULT GETDATE();
END

GO

-- Verify columns
SELECT name FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[MigrationIssues]');

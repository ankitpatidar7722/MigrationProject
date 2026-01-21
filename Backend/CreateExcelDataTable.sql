USE MigraTrackDB;
GO

-- 1. Add MigrationType to Projects table if it doesn't exist
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Projects' AND COLUMN_NAME = 'MigrationType')
BEGIN
    ALTER TABLE Projects
    ADD MigrationType NVARCHAR(50) NULL;
END
GO

-- 2. Create ExcelData table if it doesn't exist
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'ExcelData')
BEGIN
    CREATE TABLE ExcelData (
        Id INT IDENTITY(1,1) PRIMARY KEY,
        ProjectId BIGINT NOT NULL,
        ModuleName NVARCHAR(200) NOT NULL,
        SubModuleName NVARCHAR(200) NOT NULL,
        Description NVARCHAR(MAX),
        FilePath NVARCHAR(500) NOT NULL,
        FileName NVARCHAR(255) NOT NULL,
        UploadedBy INT NULL,
        UploadedAt DATETIME2 DEFAULT GETUTCDATE(),
        CONSTRAINT FK_ExcelData_Projects FOREIGN KEY (ProjectId) REFERENCES Projects(ProjectId) ON DELETE CASCADE
    );
END
GO

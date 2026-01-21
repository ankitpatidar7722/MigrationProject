-- Create ManualConfiguration Table
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'ManualConfiguration')
BEGIN
    CREATE TABLE ManualConfiguration (
        Id INT IDENTITY(1,1) PRIMARY KEY,
        ProjectId BIGINT NOT NULL,
        ModuleName NVARCHAR(200) NOT NULL,
        SubModuleName NVARCHAR(200) NOT NULL,
        Description NVARCHAR(MAX) NULL,
        CreatedAt DATETIME2 NOT NULL DEFAULT GETDATE(),
        UpdatedAt DATETIME2 NULL,
        CONSTRAINT FK_ManualConfiguration_Project FOREIGN KEY (ProjectId) REFERENCES Projects(ProjectId) ON DELETE CASCADE
    );
END
GO

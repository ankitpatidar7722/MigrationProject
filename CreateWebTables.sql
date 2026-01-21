IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'WebTables')
BEGIN
    CREATE TABLE WebTables (
        WebTableId INT IDENTITY(1,1) PRIMARY KEY,
        TableName NVARCHAR(200) NOT NULL,
        Description NVARCHAR(MAX) NULL,
        CreatedAt DATETIME2 DEFAULT GETDATE()
    );
END

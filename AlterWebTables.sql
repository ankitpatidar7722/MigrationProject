IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[WebTables]') AND name = 'DesktopTableName')
BEGIN
    ALTER TABLE WebTables ADD DesktopTableName NVARCHAR(200) NULL;
END

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[WebTables]') AND name = 'ModuleName')
BEGIN
    ALTER TABLE WebTables ADD ModuleName NVARCHAR(200) NULL;
END

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[WebTables]') AND name = 'GroupIndex')
BEGIN
    ALTER TABLE WebTables ADD GroupIndex INT NULL;
END

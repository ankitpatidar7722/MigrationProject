IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[FieldMaster]') AND name = 'IsDisplay')
BEGIN
    ALTER TABLE [dbo].[FieldMaster]
    ADD [IsDisplay] BIT NOT NULL DEFAULT 1;
    
    PRINT 'Column IsDisplay added to FieldMaster table successfully.';
END
ELSE
BEGIN
    PRINT 'Column IsDisplay already exists in FieldMaster table.';
END
GO

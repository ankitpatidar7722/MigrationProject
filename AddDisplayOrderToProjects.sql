IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[Projects]') AND name = 'DisplayOrder')
BEGIN
    ALTER TABLE [dbo].[Projects]
    ADD [DisplayOrder] INT NOT NULL DEFAULT 0;
    
    PRINT 'Column DisplayOrder added to Projects table successfully.';
END
ELSE
BEGIN
    PRINT 'Column DisplayOrder already exists in Projects table.';
END
GO

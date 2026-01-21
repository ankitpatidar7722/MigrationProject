-- AddSoftDeleteColumn.sql
-- Run this script to enable Soft Delete across all tables

DECLARE @TableName NVARCHAR(256)
DECLARE @Sql NVARCHAR(MAX)

DECLARE table_cursor CURSOR FOR
SELECT t.name 
FROM sys.tables t
WHERE t.name NOT LIKE 'sys%' -- Exclude system tables

OPEN table_cursor
FETCH NEXT FROM table_cursor INTO @TableName

WHILE @@FETCH_STATUS = 0
BEGIN
    -- Check if column exists, if not add it
    IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(@TableName) AND name = 'IsDeletedTransaction')
    BEGIN
        SET @Sql = 'ALTER TABLE ' + QUOTENAME(@TableName) + ' ADD IsDeletedTransaction INT NOT NULL DEFAULT 0;'
        PRINT 'Adding IsDeletedTransaction to ' + @TableName
        EXEC sp_executesql @Sql
    END
    ELSE
    BEGIN
        PRINT 'IsDeletedTransaction already exists in ' + @TableName
    END

    FETCH NEXT FROM table_cursor INTO @TableName
END

CLOSE table_cursor
DEALLOCATE table_cursor

PRINT 'Soft Delete columns added successfully!'


DECLARE @ConstraintName NVARCHAR(200);

-- Find the constraint name for the UNIQUE constraint on RequirementId
SELECT TOP 1 @ConstraintName = KC.name
FROM sys.key_constraints KC
INNER JOIN sys.index_columns IC ON KC.parent_object_id = IC.object_id AND KC.unique_index_id = IC.index_id
INNER JOIN sys.columns C ON IC.object_id = C.object_id AND IC.column_id = C.column_id
WHERE KC.parent_object_id = OBJECT_ID('CustomizationPoints')
AND KC.type = 'UQ'
AND C.name = 'RequirementId';

IF @ConstraintName IS NOT NULL
BEGIN
    DECLARE @SQL NVARCHAR(MAX);
    SET @SQL = 'ALTER TABLE CustomizationPoints DROP CONSTRAINT ' + @ConstraintName;
    EXEC sp_executesql @SQL;
    PRINT 'Dropped global unique constraint: ' + @ConstraintName;
END
ELSE
BEGIN
    PRINT 'No global unique constraint found to drop.';
END

-- Add composite unique constraint if not exists
IF NOT EXISTS (SELECT * FROM sys.key_constraints WHERE name = 'UQ_Customization_Project_Requirement')
BEGIN
    ALTER TABLE CustomizationPoints
    ADD CONSTRAINT UQ_Customization_Project_Requirement UNIQUE (ProjectId, RequirementId);
    PRINT 'Added composite unique constraint on (ProjectId, RequirementId)';
END
ELSE
BEGIN
    PRINT 'Composite constraint already exists.';
END

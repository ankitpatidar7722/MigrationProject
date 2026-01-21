-- Check current GroupIndex values in ModuleMaster
SELECT ModuleId, ModuleName, SubModuleName, GroupIndex FROM ModuleMaster;

-- Check current GroupIndex values in WebTables
SELECT WebTableId, TableName, DesktopTableName, ModuleName, GroupIndex FROM WebTables;

-- If GroupIndex is NULL in ModuleMaster, update them
-- Assign GroupIndex 1 to first unique module, 2 to second, etc.
/*
UPDATE ModuleMaster SET GroupIndex = 1 WHERE ModuleName = 'Category Master';
UPDATE ModuleMaster SET GroupIndex = 2 WHERE ModuleName = 'Item Master';
-- Add more as needed...
*/

-- Update WebTables to have matching GroupIndex based on ModuleName
UPDATE w
SET w.GroupIndex = m.GroupIndex
FROM WebTables w
INNER JOIN (
    SELECT DISTINCT ModuleName, GroupIndex
    FROM ModuleMaster
    WHERE GroupIndex IS NOT NULL
) m ON w.ModuleName = m.ModuleName
WHERE w.GroupIndex IS NULL OR w.GroupIndex <> m.GroupIndex;

-- Verify the update
SELECT w.WebTableId, w.TableName, w.ModuleName, w.GroupIndex, m.GroupIndex as ModuleMaster_GroupIndex
FROM WebTables w
LEFT JOIN ModuleMaster m ON w.ModuleName = m.ModuleName;

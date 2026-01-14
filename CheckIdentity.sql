SELECT 
    c.name,
    t.name as type_name,
    c.is_identity
FROM sys.columns c
JOIN sys.types t ON c.user_type_id = t.user_type_id
WHERE c.object_id = OBJECT_ID('CustomizationPoints')
AND c.name = 'CustomizationId';

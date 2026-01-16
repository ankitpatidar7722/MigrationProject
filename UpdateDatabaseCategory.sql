-- Add DatabaseCategory column if it doesn't exist
IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'DatabaseDetail' AND COLUMN_NAME = 'DatabaseCategory')
BEGIN
    ALTER TABLE DatabaseDetail
    ADD DatabaseCategory NVARCHAR(10) NULL;
    PRINT 'Added DatabaseCategory column to DatabaseDetail table.'
END
ELSE
BEGIN
    PRINT 'DatabaseCategory column already exists.'
END

GO

-- Update Logic for Server 4 and 5
-- Priority: Web ('WT') > Desktop ('DT')

-- 1. Mark 'WT' (Web Database) - Contains 'IndusEnterprise'
UPDATE DatabaseDetail
SET DatabaseCategory = 'WT'
WHERE ServerId IN (4, 5)
  AND DatabaseName LIKE '%IndusEnterprise%' 
  AND DatabaseCategory IS NULL; -- Only update if not already set (or remove this condition to force update)

-- 2. Mark 'DT' (Desktop Database) - Contains '_' BUT NOT 'IndusEnterprise'
-- Ensuring we don't overwrite WT if logic overlaps (though LIKE above prevents it)
UPDATE DatabaseDetail
SET DatabaseCategory = 'DT'
WHERE ServerId IN (4, 5)
  AND DatabaseName LIKE '%_%'
  AND DatabaseName NOT LIKE '%IndusEnterprise%'
  AND (DatabaseCategory IS NULL OR DatabaseCategory != 'WT');

-- 3. Mark 'OFFICE' (Specific IDs manually overrides)
UPDATE DatabaseDetail
SET DatabaseCategory = 'OFFICE'
WHERE DatabaseId IN (60, 61, 169, 254);

-- Verification
PRINT 'Updated DatabaseCategory for Server 4 and 5.'
SELECT DatabaseName, ServerId, DatabaseCategory 
FROM DatabaseDetail 
WHERE ServerId IN (4, 5) 
ORDER BY DatabaseCategory DESC, DatabaseName;

-- Check if TableNameDesktop and TableNameWeb columns exist in VerificationRecords
SELECT COLUMN_NAME, DATA_TYPE, CHARACTER_MAXIMUM_LENGTH
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_NAME = 'VerificationRecords'
AND COLUMN_NAME IN ('TableNameDesktop', 'TableNameWeb');

-- If columns don't exist, add them:
/*
ALTER TABLE VerificationRecords
ADD TableNameDesktop NVARCHAR(200) NULL;

ALTER TABLE VerificationRecords
ADD TableNameWeb NVARCHAR(200) NULL;
*/

-- Verify after adding
SELECT * FROM VerificationRecords;

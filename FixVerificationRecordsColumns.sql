-- ================================================
-- FIX: Add TableNameDesktop and TableNameWeb columns to VerificationRecords
-- RUN THIS SCRIPT IN SQL SERVER MANAGEMENT STUDIO
-- ================================================

-- Check if columns already exist
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS 
               WHERE TABLE_NAME = 'VerificationRecords' 
               AND COLUMN_NAME = 'TableNameDesktop')
BEGIN
    ALTER TABLE VerificationRecords
    ADD TableNameDesktop NVARCHAR(200) NULL;
    PRINT 'Added TableNameDesktop column';
END
ELSE
BEGIN
    PRINT 'TableNameDesktop column already exists';
END

IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS 
               WHERE TABLE_NAME = 'VerificationRecords' 
               AND COLUMN_NAME = 'TableNameWeb')
BEGIN
    ALTER TABLE VerificationRecords
    ADD TableNameWeb NVARCHAR(200) NULL;
    PRINT 'Added TableNameWeb column';
END
ELSE
BEGIN
    PRINT 'TableNameWeb column already exists';
END

-- Verify the columns were added
SELECT COLUMN_NAME, DATA_TYPE, CHARACTER_MAXIMUM_LENGTH
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_NAME = 'VerificationRecords'
ORDER BY ORDINAL_POSITION;

-- FixSoftDeleteColumns.sql
-- Run this to ensure Soft Delete columns exist on specific tables causing 500 errors

-- 1. DataTransferChecks
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[DataTransferChecks]') AND name = 'IsDeletedTransaction')
BEGIN
    ALTER TABLE [dbo].[DataTransferChecks] ADD IsDeletedTransaction INT NOT NULL DEFAULT 0;
    PRINT 'Added IsDeletedTransaction to DataTransferChecks';
END

-- 2. MigrationIssues
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[MigrationIssues]') AND name = 'IsDeletedTransaction')
BEGIN
    ALTER TABLE [dbo].[MigrationIssues] ADD IsDeletedTransaction INT NOT NULL DEFAULT 0;
    PRINT 'Added IsDeletedTransaction to MigrationIssues';
END

-- 3. VerificationRecords
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[VerificationRecords]') AND name = 'IsDeletedTransaction')
BEGIN
    ALTER TABLE [dbo].[VerificationRecords] ADD IsDeletedTransaction INT NOT NULL DEFAULT 0;
    PRINT 'Added IsDeletedTransaction to VerificationRecords';
END

-- 4. CustomizationPoints
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[CustomizationPoints]') AND name = 'IsDeletedTransaction')
BEGIN
    ALTER TABLE [dbo].[CustomizationPoints] ADD IsDeletedTransaction INT NOT NULL DEFAULT 0;
    PRINT 'Added IsDeletedTransaction to CustomizationPoints';
END

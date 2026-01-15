-- FixDataTransferSchema.sql
-- Add missing IsTransferSuccessful column to DataTransferChecks table

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[DataTransferChecks]') AND name = 'IsTransferSuccessful')
BEGIN
    ALTER TABLE [dbo].[DataTransferChecks] ADD IsTransferSuccessful BIT NOT NULL DEFAULT 0;
    PRINT 'Added IsTransferSuccessful column to DataTransferChecks';
END

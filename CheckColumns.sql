-- CheckColumns.sql
SELECT name FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[DataTransferChecks]');

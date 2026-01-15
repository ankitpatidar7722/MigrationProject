-- CheckTransferChecks.sql
SELECT TOP 20 * FROM [dbo].[DataTransferChecks] WHERE ProjectId = 3;
SELECT COUNT(*) as TotalRecords FROM [dbo].[DataTransferChecks];
SELECT COUNT(*) as DeletedRecords FROM [dbo].[DataTransferChecks] WHERE IsDeletedTransaction = 1;
SELECT COUNT(*) as ActiveRecords FROM [dbo].[DataTransferChecks] WHERE IsDeletedTransaction = 0;

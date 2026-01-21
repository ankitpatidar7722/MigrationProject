IF NOT EXISTS (
  SELECT * FROM sys.columns
  WHERE object_id = OBJECT_ID(N'[dbo].[MigrationIssues]') AND name = 'IsDeletedTransaction'
)
BEGIN
  ALTER TABLE [dbo].[MigrationIssues] ADD IsDeletedTransaction INT NOT NULL DEFAULT 0;
END
GO

UPDATE [dbo].[MigrationIssues] SET IsDeletedTransaction = 0;

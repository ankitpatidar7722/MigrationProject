-- Create ServerData Table
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[ServerData]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[ServerData](
        [ServerId] [int] IDENTITY(1,1) NOT NULL,
        [ServerName] [varchar](200) NOT NULL,
        [HostName] [varchar](200) NOT NULL,
        [ServerIndex] [varchar](50) NOT NULL,
        CONSTRAINT [PK_ServerData] PRIMARY KEY CLUSTERED 
        (
            [ServerId] ASC
        )
    )
END
GO

-- Create DatabaseDetail Table
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[DatabaseDetail]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[DatabaseDetail](
        [DatabaseId] [int] IDENTITY(1,1) NOT NULL,
        [DatabaseName] [varchar](200) NOT NULL,
        [ServerId] [int] NOT NULL,
        [ServerIndex] [varchar](50) NOT NULL,
        [ClientName] [varchar](200) NOT NULL,
        CONSTRAINT [PK_DatabaseDetail] PRIMARY KEY CLUSTERED 
        (
            [DatabaseId] ASC
        )
    )

    -- Add Foreign Key
    ALTER TABLE [dbo].[DatabaseDetail]  WITH CHECK ADD  CONSTRAINT [FK_DatabaseDetail_ServerData] FOREIGN KEY([ServerId])
    REFERENCES [dbo].[ServerData] ([ServerId])
    ON DELETE CASCADE

    ALTER TABLE [dbo].[DatabaseDetail] CHECK CONSTRAINT [FK_DatabaseDetail_ServerData]
END
GO

-- Seed some sample data for ServerData if empty
IF NOT EXISTS (SELECT * FROM [dbo].[ServerData])
BEGIN
    INSERT INTO [dbo].[ServerData] (ServerName, HostName, ServerIndex)
    VALUES 
    ('Development Server', 'DEV-SQL-01', 'SRV-001'),
    ('Staging Server', 'STG-SQL-01', 'SRV-002'),
    ('Production Server', 'PROD-SQL-01', 'SRV-003')
END
GO

-- FixUsersTable.sql
-- Run this script in SQL Server Management Studio (SSMS) against your MigraTrackDB database

-- Step 1: Check if table exists and has wrong structure, drop it
IF EXISTS (SELECT * FROM sysobjects WHERE name='Users' AND xtype='U')
BEGIN
    -- Check if Password column is missing
    IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[Users]') AND name = 'Password')
    BEGIN
        PRINT 'Users table exists but has wrong structure. Dropping and recreating...';
        DROP TABLE [dbo].[Users];
    END
END

-- Step 2: Create the Users table if it doesn't exist
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Users' AND xtype='U')
BEGIN
    CREATE TABLE [dbo].[Users] (
        [UserId] INT IDENTITY(1,1) PRIMARY KEY,
        [Username] NVARCHAR(50) NOT NULL UNIQUE,
        [Password] NVARCHAR(100) NOT NULL,
        [Role] NVARCHAR(20) DEFAULT 'Admin'
    );
    PRINT 'Users table created successfully!';
END
ELSE
BEGIN
    PRINT 'Users table already exists with correct structure.';
END

-- Step 3: Ensure admin user exists
IF NOT EXISTS (SELECT 1 FROM [dbo].[Users] WHERE Username = 'admin')
BEGIN
    INSERT INTO [dbo].[Users] (Username, Password, Role) VALUES ('admin', 'admin123', 'Admin');
    PRINT 'Admin user created with password admin123';
END
ELSE
BEGIN
    -- Reset admin password to admin123
    UPDATE [dbo].[Users] SET Password = 'admin123' WHERE Username = 'admin';
    PRINT 'Admin user password reset to admin123';
END

-- Step 4: Verify the table
SELECT * FROM [dbo].[Users];

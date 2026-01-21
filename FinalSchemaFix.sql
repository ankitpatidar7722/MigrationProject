-- FinalSchemaFix.sql
-- Run this script to guarantee all tables have the IsDeletedTransaction column

-- 1. WebTables (Confirmed Missing)
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[WebTables]') AND name = 'IsDeletedTransaction')
BEGIN
    ALTER TABLE [dbo].[WebTables] ADD IsDeletedTransaction INT NOT NULL DEFAULT 0;
    PRINT 'Added IsDeletedTransaction to WebTables';
END

-- 2. Projects
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[Projects]') AND name = 'IsDeletedTransaction')
BEGIN
    ALTER TABLE [dbo].[Projects] ADD IsDeletedTransaction INT NOT NULL DEFAULT 0;
    PRINT 'Confirmed Projects';
END

-- 3. Users
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[Users]') AND name = 'IsDeletedTransaction')
BEGIN
    ALTER TABLE [dbo].[Users] ADD IsDeletedTransaction INT NOT NULL DEFAULT 0;
    PRINT 'Confirmed Users';
END

-- 4. ModuleGroups
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[ModuleGroups]') AND name = 'IsDeletedTransaction')
BEGIN
    ALTER TABLE [dbo].[ModuleGroups] ADD IsDeletedTransaction INT NOT NULL DEFAULT 0;
    PRINT 'Confirmed ModuleGroups';
END

-- 5. FieldMaster
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[FieldMaster]') AND name = 'IsDeletedTransaction')
BEGIN
    ALTER TABLE [dbo].[FieldMaster] ADD IsDeletedTransaction INT NOT NULL DEFAULT 0;
    PRINT 'Confirmed FieldMaster';
END

-- 6. DynamicModuleData
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[DynamicModuleData]') AND name = 'IsDeletedTransaction')
BEGIN
    ALTER TABLE [dbo].[DynamicModuleData] ADD IsDeletedTransaction INT NOT NULL DEFAULT 0;
    PRINT 'Confirmed DynamicModuleData';
END

-- 7. ProjectEmails
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[ProjectEmails]') AND name = 'IsDeletedTransaction')
BEGIN
    ALTER TABLE [dbo].[ProjectEmails] ADD IsDeletedTransaction INT NOT NULL DEFAULT 0;
    PRINT 'Confirmed ProjectEmails';
END

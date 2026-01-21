-- Add columns for Desktop connection
IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Projects' AND COLUMN_NAME = 'ServerIdDesktop')
BEGIN
    ALTER TABLE Projects ADD ServerIdDesktop INT NULL;
    ALTER TABLE Projects ADD CONSTRAINT FK_Projects_ServerDesktop FOREIGN KEY (ServerIdDesktop) REFERENCES ServerData(ServerId);
    PRINT 'Added ServerIdDesktop column';
END

IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Projects' AND COLUMN_NAME = 'DatabaseIdDesktop')
BEGIN
    ALTER TABLE Projects ADD DatabaseIdDesktop INT NULL;
    ALTER TABLE Projects ADD CONSTRAINT FK_Projects_DatabaseDesktop FOREIGN KEY (DatabaseIdDesktop) REFERENCES DatabaseDetail(DatabaseId);
    PRINT 'Added DatabaseIdDesktop column';
END

-- Add columns for Web connection
IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Projects' AND COLUMN_NAME = 'ServerIdWeb')
BEGIN
    ALTER TABLE Projects ADD ServerIdWeb INT NULL;
    ALTER TABLE Projects ADD CONSTRAINT FK_Projects_ServerWeb FOREIGN KEY (ServerIdWeb) REFERENCES ServerData(ServerId);
    PRINT 'Added ServerIdWeb column';
END

IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Projects' AND COLUMN_NAME = 'DatabaseIdWeb')
BEGIN
    ALTER TABLE Projects ADD DatabaseIdWeb INT NULL;
    ALTER TABLE Projects ADD CONSTRAINT FK_Projects_DatabaseWeb FOREIGN KEY (DatabaseIdWeb) REFERENCES DatabaseDetail(DatabaseId);
    PRINT 'Added DatabaseIdWeb column';
END
GO

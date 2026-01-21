-- Bulk Insert Databases for ServerId 4, ServerIndex 3

-- Ensure Server 4 exists (Optional safety check - assumes user created it)
IF NOT EXISTS (SELECT 1 FROM ServerData WHERE ServerId = 4)
BEGIN
    PRINT 'Warning: ServerId 4 does not exist. Please create it first or the inserts will fail due to Foreign Key constraint.'
    -- You can uncomment the below block to force create it if needed, but better to let user manage servers
    -- SET IDENTITY_INSERT ServerData ON
    -- INSERT INTO ServerData (ServerId, ServerName, HostName, ServerIndex) VALUES (4, 'Indus Server', 'INDUS-SQL', '3')
    -- SET IDENTITY_INSERT ServerData OFF
END

-- Temporary table to hold names for processing
CREATE TABLE #TempDatabases (DbName NVARCHAR(200))

INSERT INTO #TempDatabases (DbName) VALUES
('Indus_ArtOPrint'),
('Indus_ArtOPrintLabels'),
('Indus_Kalpavruksha'),
('Indus_Manali'),
('Indus_nextgenkolkata'),
('Indus_NextgenSikkim'),
('Indus_Pearl1'),
('Indus_Pearl2'),
('Indus_Surigraphic'),
('IndusEnterpriseAjooni'),
('IndusEnterpriseAmarUjala'),
('IndusEnterpriseAmarUjalaBkp'),
('IndusEnterpriseAmit'),
('IndusEnterpriseAnaswara'),
('IndusEnterpriseAnaswaraDemo'),
('IndusEnterpriseArihant'),
('IndusEnterpriseArtOPrint'),
('IndusEnterpriseArtOPrintFlexo'),
('IndusEnterpriseAvantika'),
('IndusEnterpriseBhagini'),
('IndusEnterpriseDesignPlus'),
('IndusEnterpriseDigiprint'),
('IndusEnterpriseGeetaPress'),
('IndusEnterpriseHarshal'),
('IndusEnterpriseKhosla'),
('IndusEnterpriseKnitCity'),
('IndusEnterpriseLaxmiPharma'),
('IndusEnterpriseLokenath'),
('IndusEnterpriseMaxCreation'),
('IndusEnterpriseMytecprocess'),
('IndusEnterpriseNextgenKolKata'),
('IndusEnterpriseNextgenSikkim'),
('IndusEnterpriseNextGentesting'),
('IndusEnterpriseOkhla'),
('IndusEnterpriseOrangePrinters'),
('IndusEnterpriseOrangePrintersBkp'),
('IndusEnterpriseOrientPack'),
('IndusEnterpriseOxford'),
('IndusEnterprisePacklabs'),
('IndusEnterprisePackOPrint'),
('IndusEnterpriseParksonsDemo'),
('IndusEnterprisePearlPrintService'),
('IndusEnterprisePeramount'),
('IndusEnterprisePrinceGraphics'),
('IndusEnterpriseRGPack'),
('IndusEnterpriseSakuraOffset'),
('IndusEnterpriseSarojprintbkp'),
('IndusEnterpriseSBM'),
('IndusEnterpriseShreeGanesh'),
('IndusEnterpriseSilverline'),
('IndusEnterpriseSkyPrint'),
('IndusEnterpriseSurigraphic'),
('IndusEnterpriseTechno'),
('IndusEnterpriseTesting'),
('IndusEnterpriseTucsonpac'),
('IndusEnterpriseUGSTransmen'),
('IndusEnterpriseVijayPrinting'),
('IndusEnterpriseVijayshri'),
('IndusEnterpriseVikasOffset')

-- Insert into DatabaseDetail
-- Logic to extract ClientName:
-- 1. If starts with 'IndusEnterprise', remove it.
-- 2. If starts with 'Indus_', remove it.
-- 3. Otherwise use full name.

INSERT INTO DatabaseDetail (DatabaseName, ServerId, ServerIndex, ClientName)
SELECT 
    DbName,
    4, -- ServerId
    '3', -- ServerIndex (as string)
    CASE 
        WHEN DbName LIKE 'IndusEnterprise%' THEN SUBSTRING(DbName, 16, LEN(DbName))
        WHEN DbName LIKE 'Indus_%' THEN SUBSTRING(DbName, 7, LEN(DbName))
        ELSE DbName 
    END
FROM #TempDatabases
WHERE NOT EXISTS (SELECT 1 FROM DatabaseDetail WHERE DatabaseName = #TempDatabases.DbName AND ServerId = 4)

-- Cleanup
DROP TABLE #TempDatabases

PRINT 'Databases inserted successfully.'
SELECT * FROM DatabaseDetail WHERE ServerId = 4

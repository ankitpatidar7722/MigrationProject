-- SQL Script to Insert Web Servers and Databases

-- Format: ServerName, HostName, ServerIndex
-- Databases are inserted with Category 'WT'

BEGIN TRANSACTION;

DECLARE @ServerId INT;
DECLARE @ServerName NVARCHAR(200);
DECLARE @ServerIndex NVARCHAR(50);

---------------------------------------------------
-- 1. 43.205.155.159,1433
---------------------------------------------------
SET @ServerName = '43.205.155.159,1433';
SET @ServerIndex = '43';

IF NOT EXISTS (SELECT 1 FROM ServerData WHERE ServerName = @ServerName)
BEGIN
    INSERT INTO ServerData (ServerName, HostName, ServerIndex)
    VALUES (@ServerName, @ServerName, @ServerIndex);
    SET @ServerId = SCOPE_IDENTITY();
END
ELSE
BEGIN
    SELECT @ServerId = ServerId FROM ServerData WHERE ServerName = @ServerName;
END

-- Databases
IF NOT EXISTS (SELECT 1 FROM DatabaseDetail WHERE DatabaseName = 'IndusEnterprisePragatiMain' AND ServerId = @ServerId)
    INSERT INTO DatabaseDetail (DatabaseName, ServerId, ServerIndex, ClientName, DatabaseCategory) VALUES ('IndusEnterprisePragatiMain', @ServerId, @ServerIndex, 'IndusEnterprisePragatiMain', 'WT');

IF NOT EXISTS (SELECT 1 FROM DatabaseDetail WHERE DatabaseName = 'IndusEnterprisePragatiLabel' AND ServerId = @ServerId)
    INSERT INTO DatabaseDetail (DatabaseName, ServerId, ServerIndex, ClientName, DatabaseCategory) VALUES ('IndusEnterprisePragatiLabel', @ServerId, @ServerIndex, 'IndusEnterprisePragatiLabel', 'WT');


---------------------------------------------------
-- 2. 13.245.140.14,1433
---------------------------------------------------
SET @ServerName = '13.245.140.14,1433';
SET @ServerIndex = '13';

IF NOT EXISTS (SELECT 1 FROM ServerData WHERE ServerName = @ServerName)
BEGIN
    INSERT INTO ServerData (ServerName, HostName, ServerIndex)
    VALUES (@ServerName, @ServerName, @ServerIndex);
    SET @ServerId = SCOPE_IDENTITY();
END
ELSE
BEGIN
    SELECT @ServerId = ServerId FROM ServerData WHERE ServerName = @ServerName;
END

-- Databases
IF NOT EXISTS (SELECT 1 FROM DatabaseDetail WHERE DatabaseName = 'IndusEnterpriseGraphicSystem' AND ServerId = @ServerId)
    INSERT INTO DatabaseDetail (DatabaseName, ServerId, ServerIndex, ClientName, DatabaseCategory) VALUES ('IndusEnterpriseGraphicSystem', @ServerId, @ServerIndex, 'IndusEnterpriseGraphicSystem', 'WT');


---------------------------------------------------
-- 3. 3.7.53.165,1534
---------------------------------------------------
SET @ServerName = '3.7.53.165,1534';
SET @ServerIndex = '3';

IF NOT EXISTS (SELECT 1 FROM ServerData WHERE ServerName = @ServerName)
BEGIN
    INSERT INTO ServerData (ServerName, HostName, ServerIndex)
    VALUES (@ServerName, @ServerName, @ServerIndex);
    SET @ServerId = SCOPE_IDENTITY();
END
ELSE
BEGIN
    SELECT @ServerId = ServerId FROM ServerData WHERE ServerName = @ServerName;
END

-- Databases
IF NOT EXISTS (SELECT 1 FROM DatabaseDetail WHERE DatabaseName = 'IndusEnterpriseSaroj' AND ServerId = @ServerId)
    INSERT INTO DatabaseDetail (DatabaseName, ServerId, ServerIndex, ClientName, DatabaseCategory) VALUES ('IndusEnterpriseSaroj', @ServerId, @ServerIndex, 'IndusEnterpriseSaroj', 'WT');


---------------------------------------------------
-- 4. 122.179.141.229,1433
---------------------------------------------------
SET @ServerName = '122.179.141.229,1433';
SET @ServerIndex = '122';

IF NOT EXISTS (SELECT 1 FROM ServerData WHERE ServerName = @ServerName)
BEGIN
    INSERT INTO ServerData (ServerName, HostName, ServerIndex)
    VALUES (@ServerName, @ServerName, @ServerIndex);
    SET @ServerId = SCOPE_IDENTITY();
END
ELSE
BEGIN
    SELECT @ServerId = ServerId FROM ServerData WHERE ServerName = @ServerName;
END

-- Databases
IF NOT EXISTS (SELECT 1 FROM DatabaseDetail WHERE DatabaseName = 'Boxpool' AND ServerId = @ServerId)
    INSERT INTO DatabaseDetail (DatabaseName, ServerId, ServerIndex, ClientName, DatabaseCategory) VALUES ('Boxpool', @ServerId, @ServerIndex, 'Boxpool', 'WT');


---------------------------------------------------
-- 5. 115.246.83.250,1534
---------------------------------------------------
SET @ServerName = '115.246.83.250,1534';
SET @ServerIndex = '115';

IF NOT EXISTS (SELECT 1 FROM ServerData WHERE ServerName = @ServerName)
BEGIN
    INSERT INTO ServerData (ServerName, HostName, ServerIndex)
    VALUES (@ServerName, @ServerName, @ServerIndex);
    SET @ServerId = SCOPE_IDENTITY();
END
ELSE
BEGIN
    SELECT @ServerId = ServerId FROM ServerData WHERE ServerName = @ServerName;
END

-- Databases
IF NOT EXISTS (SELECT 1 FROM DatabaseDetail WHERE DatabaseName = 'Arihant Printers' AND ServerId = @ServerId)
    INSERT INTO DatabaseDetail (DatabaseName, ServerId, ServerIndex, ClientName, DatabaseCategory) VALUES ('Arihant Printers', @ServerId, @ServerIndex, 'Arihant Printers', 'WT');


---------------------------------------------------
-- 6. 45.116.113.115,1534
---------------------------------------------------
SET @ServerName = '45.116.113.115,1534';
SET @ServerIndex = '45';

IF NOT EXISTS (SELECT 1 FROM ServerData WHERE ServerName = @ServerName)
BEGIN
    INSERT INTO ServerData (ServerName, HostName, ServerIndex)
    VALUES (@ServerName, @ServerName, @ServerIndex);
    SET @ServerId = SCOPE_IDENTITY();
END
ELSE
BEGIN
    SELECT @ServerId = ServerId FROM ServerData WHERE ServerName = @ServerName;
END

-- Databases
IF NOT EXISTS (SELECT 1 FROM DatabaseDetail WHERE DatabaseName = 'SFAPRINT' AND ServerId = @ServerId)
    INSERT INTO DatabaseDetail (DatabaseName, ServerId, ServerIndex, ClientName, DatabaseCategory) VALUES ('SFAPRINT', @ServerId, @ServerIndex, 'SFAPRINT', 'WT');

IF NOT EXISTS (SELECT 1 FROM DatabaseDetail WHERE DatabaseName = 'Orient coloe Art Printer' AND ServerId = @ServerId)
    INSERT INTO DatabaseDetail (DatabaseName, ServerId, ServerIndex, ClientName, DatabaseCategory) VALUES ('Orient coloe Art Printer', @ServerId, @ServerIndex, 'Orient coloe Art Printer', 'WT');


---------------------------------------------------
-- 7. 150.242.14.6,1433
---------------------------------------------------
SET @ServerName = '150.242.14.6,1433';
SET @ServerIndex = '150';

IF NOT EXISTS (SELECT 1 FROM ServerData WHERE ServerName = @ServerName)
BEGIN
    INSERT INTO ServerData (ServerName, HostName, ServerIndex)
    VALUES (@ServerName, @ServerName, @ServerIndex);
    SET @ServerId = SCOPE_IDENTITY();
END
ELSE
BEGIN
    SELECT @ServerId = ServerId FROM ServerData WHERE ServerName = @ServerName;
END

-- Databases
IF NOT EXISTS (SELECT 1 FROM DatabaseDetail WHERE DatabaseName = 'Jayant Printery LLP' AND ServerId = @ServerId)
    INSERT INTO DatabaseDetail (DatabaseName, ServerId, ServerIndex, ClientName, DatabaseCategory) VALUES ('Jayant Printery LLP', @ServerId, @ServerIndex, 'Jayant Printery LLP', 'WT');


---------------------------------------------------
-- 8. 65.2.64.18, 1433
---------------------------------------------------
SET @ServerName = '65.2.64.18, 1433';
SET @ServerIndex = '65';

IF NOT EXISTS (SELECT 1 FROM ServerData WHERE ServerName = @ServerName)
BEGIN
    INSERT INTO ServerData (ServerName, HostName, ServerIndex)
    VALUES (@ServerName, @ServerName, @ServerIndex);
    SET @ServerId = SCOPE_IDENTITY();
END
ELSE
BEGIN
    SELECT @ServerId = ServerId FROM ServerData WHERE ServerName = @ServerName;
END

-- Databases
IF NOT EXISTS (SELECT 1 FROM DatabaseDetail WHERE DatabaseName = 'IndusEnterpriseThomson' AND ServerId = @ServerId)
    INSERT INTO DatabaseDetail (DatabaseName, ServerId, ServerIndex, ClientName, DatabaseCategory) VALUES ('IndusEnterpriseThomson', @ServerId, @ServerIndex, 'IndusEnterpriseThomson', 'WT');

IF NOT EXISTS (SELECT 1 FROM DatabaseDetail WHERE DatabaseName = 'IndusEnterpriseParksons' AND ServerId = @ServerId)
    INSERT INTO DatabaseDetail (DatabaseName, ServerId, ServerIndex, ClientName, DatabaseCategory) VALUES ('IndusEnterpriseParksons', @ServerId, @ServerIndex, 'IndusEnterpriseParksons', 'WT');

IF NOT EXISTS (SELECT 1 FROM DatabaseDetail WHERE DatabaseName = 'IndusEnterpriseMonarch' AND ServerId = @ServerId)
    INSERT INTO DatabaseDetail (DatabaseName, ServerId, ServerIndex, ClientName, DatabaseCategory) VALUES ('IndusEnterpriseMonarch', @ServerId, @ServerIndex, 'IndusEnterpriseMonarch', 'WT');

IF NOT EXISTS (SELECT 1 FROM DatabaseDetail WHERE DatabaseName = 'IndusEnterpriseGoodLuck' AND ServerId = @ServerId)
    INSERT INTO DatabaseDetail (DatabaseName, ServerId, ServerIndex, ClientName, DatabaseCategory) VALUES ('IndusEnterpriseGoodLuck', @ServerId, @ServerIndex, 'IndusEnterpriseGoodLuck', 'WT');

IF NOT EXISTS (SELECT 1 FROM DatabaseDetail WHERE DatabaseName = 'IndusEnterpriseDemoThomson' AND ServerId = @ServerId)
    INSERT INTO DatabaseDetail (DatabaseName, ServerId, ServerIndex, ClientName, DatabaseCategory) VALUES ('IndusEnterpriseDemoThomson', @ServerId, @ServerIndex, 'IndusEnterpriseDemoThomson', 'WT');


COMMIT;

PRINT 'Web Servers and Databases inserted successfully.';

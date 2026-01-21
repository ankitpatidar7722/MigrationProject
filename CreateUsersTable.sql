IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Users' AND xtype='U')
BEGIN
    CREATE TABLE Users (
        UserId INT IDENTITY(1,1) PRIMARY KEY,
        Username NVARCHAR(50) NOT NULL UNIQUE,
        Password NVARCHAR(100) NOT NULL,
        Role NVARCHAR(20) DEFAULT 'Admin'
    );
    
    -- Insert default admin user if table was just created
    INSERT INTO Users (Username, Password, Role) VALUES ('admin', 'admin123', 'Admin');
END
ELSE
BEGIN
    -- Ensure default user exists even if table existed
    IF NOT EXISTS (SELECT 1 FROM Users WHERE Username = 'admin')
    BEGIN
        INSERT INTO Users (Username, Password, Role) VALUES ('admin', 'admin123', 'Admin');
    END
END

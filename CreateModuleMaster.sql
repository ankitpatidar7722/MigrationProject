-- Create ModuleMaster Table
CREATE TABLE ModuleMaster (
    ModuleId INT PRIMARY KEY,
    SubModuleName NVARCHAR(200) NOT NULL,
    ModuleName NVARCHAR(200) NOT NULL,
    GroupIndex INT
);
GO

-- Insert Data from Image
INSERT INTO ModuleMaster (ModuleId, SubModuleName, ModuleName, GroupIndex) VALUES
(1, 'RM QC Parameter Setting', 'Masters', 10),
(2, 'Client Wise Priting Rate Setting', 'Masters', 10),
(3, 'Client Wise Operation Rate Settings', 'Masters', 10),
(4, 'Maintenance Services', 'Masters', 10),
(5, 'Production Unit Master', 'Masters', 10),
(6, 'SapIntegration Item Masters', 'Masters', 10),
(7, 'Break Down Type Master', 'Masters', 10),
(8, 'Item Masters', 'Masters', 10),
(9, 'Ledger Master', 'Masters', 10),
(10, 'Process Master', 'Masters', 10),
(11, 'Machine Master', 'Masters', 10),
(12, 'Category Master', 'Masters', 10),
(13, 'Department Master', 'Masters', 10),
(14, 'User Master', 'Masters', 10),
(15, 'Product Group Master', 'Masters', 10),
(16, 'Warehouse Master', 'Masters', 10),
(17, 'Tool Master', 'Masters', 10),
(18, 'Material Group Master', 'Masters', 10),
(19, 'Spare Part Master', 'Masters', 10),
(20, 'Unit Master', 'Masters', 10),
(21, 'Estimation', 'Estimation', 2),
(22, 'Quote Panel', 'Quote Panel', 3),
(26, 'Order Booking', 'Order Booking', 6),
(27, 'Item Sales Order Booking', 'Order Booking', 6),
(28, 'Sales Order Approval', 'Order Booking', 6),
(32, 'Product Catalog', 'Product Catalog', 7),
(35, 'Production Work Order', 'Production Work Order', 8);
GO

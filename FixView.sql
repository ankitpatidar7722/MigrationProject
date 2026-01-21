USE MigraTrackDB;
GO

IF OBJECT_ID('vw_ActiveIssues', 'V') IS NOT NULL 
    DROP VIEW vw_ActiveIssues;
GO

CREATE VIEW vw_ActiveIssues AS
SELECT 
    i.IssueNumber,
    i.ProjectId,
    p.ClientName,
    i.Title,
    i.Status,
    i.Priority,
    i.AssignedTo,
    i.ReportedDate,
    DATEDIFF(DAY, i.ReportedDate, GETDATE()) AS DaysOpen
FROM MigrationIssues i
INNER JOIN Projects p ON i.ProjectId = p.ProjectId
WHERE i.Status IN ('Open', 'In Progress');
GO

using MigraTrackAPI.Data;
using MigraTrackAPI.Models;
using Microsoft.EntityFrameworkCore;
using System;

namespace MigraTrackAPI.Services;

public interface IProjectService
{
    Task<IEnumerable<Project>> GetAllProjectsAsync();
    Task<Project?> GetProjectByIdAsync(long id);
    Task<Project> CreateProjectAsync(Project project);
    Task<Project?> UpdateProjectAsync(Project project);
    Task<bool> DeleteProjectAsync(long id);
    Task<object> GetProjectDashboardAsync(long projectId);
    Task<bool> CloneProjectDataAsync(long sourceProjectId, long targetProjectId);
}

public class ProjectService : IProjectService
{
    private readonly MigraTrackDbContext _context;

    public ProjectService(MigraTrackDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Project>> GetAllProjectsAsync()
    {
        return await _context.Projects
            .Where(p => p.IsActive)
            .OrderByDescending(p => p.CreatedAt)
            .ToListAsync();
    }

    public async Task<Project?> GetProjectByIdAsync(long id)
    {
        return await _context.Projects.FindAsync(id);
    }

    public async Task<Project> CreateProjectAsync(Project project)
    {
        project.CreatedAt = DateTime.Now;
        project.UpdatedAt = DateTime.Now;
        
        _context.Projects.Add(project);
        await _context.SaveChangesAsync();
        
        return project;
    }

    public async Task<Project?> UpdateProjectAsync(Project project)
    {
        var existing = await _context.Projects.FindAsync(project.ProjectId);
        if (existing == null)
            return null;

        existing.ClientName = project.ClientName;
        existing.Description = project.Description;
        existing.Status = project.Status;
        existing.ProjectType = project.ProjectType;
        existing.StartDate = project.StartDate;
        existing.TargetCompletionDate = project.TargetCompletionDate;
        existing.LiveDate = project.LiveDate;
        existing.ProjectManager = project.ProjectManager;
        existing.TechnicalLead = project.TechnicalLead;
        existing.ImplementationCoordinator = project.ImplementationCoordinator;
        existing.CoordinatorEmail = project.CoordinatorEmail;
        existing.UpdatedAt = DateTime.Now;

        await _context.SaveChangesAsync();
        return existing;
    }

    public async Task<bool> DeleteProjectAsync(long id)
    {
        var project = await _context.Projects.FindAsync(id);
        if (project == null)
            return false;

        project.IsActive = false;
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<object> GetProjectDashboardAsync(long projectId)
    {
        var totalTransfers = await _context.DataTransferChecks
            .CountAsync(d => d.ProjectId == projectId);

        var completedTransfers = await _context.DataTransferChecks
            .CountAsync(d => d.ProjectId == projectId && d.IsCompleted);

        var totalIssues = await _context.MigrationIssues
            .CountAsync(i => i.ProjectId == projectId && 
                           (i.Status == "Open" || i.Status == "In Progress"));

        var totalVerifications = await _context.VerificationRecords
            .CountAsync(v => v.ProjectId == projectId);

        var completedVerifications = await _context.VerificationRecords
            .CountAsync(v => v.ProjectId == projectId && v.IsVerified);

        return new
        {
            totalModules = totalTransfers + totalVerifications,
            completedMigrations = completedTransfers,
            pendingMigrations = totalTransfers - completedTransfers,
            totalIssues = totalIssues,
            completionPercentage = totalTransfers > 0 
                ? Math.Round((double)completedTransfers / totalTransfers * 100, 2) 
                : 0,
            // Detailed stats
            totalTransfers,
            completedTransfers,
            transferProgress = totalTransfers > 0 
                ? Math.Round((double)completedTransfers / totalTransfers * 100, 2) 
                : 0,
            totalVerifications,
            completedVerifications,
            verificationProgress = totalVerifications > 0 
                ? Math.Round((double)completedVerifications / totalVerifications * 100, 2) 
                : 0
        };
    }

    public async Task<bool> CloneProjectDataAsync(long sourceProjectId, long targetProjectId)
    {
        var sourceProject = await _context.Projects.FindAsync(sourceProjectId);
        var targetProject = await _context.Projects.FindAsync(targetProjectId);

        if (sourceProject == null || targetProject == null)
            return false;

        using var transaction = await _context.Database.BeginTransactionAsync();
        try
        {
            // 1. Clone DataTransferChecks
            var checks = await _context.DataTransferChecks
                .Where(x => x.ProjectId == sourceProjectId)
                .AsNoTracking()
                .ToListAsync();
            
            foreach (var check in checks)
            {
                check.TransferId = 0; // Reset ID for new insertion
                check.ProjectId = targetProjectId;
                check.CreatedAt = DateTime.Now;
                check.UpdatedAt = DateTime.Now;
                _context.DataTransferChecks.Add(check);
            }

            // 2. Clone VerificationRecords
            var verifications = await _context.VerificationRecords
                .Where(x => x.ProjectId == sourceProjectId)
                .AsNoTracking()
                .ToListAsync();

            foreach (var ver in verifications)
            {
                ver.VerificationId = 0;
                ver.ProjectId = targetProjectId;
                ver.CreatedAt = DateTime.Now;
                ver.UpdatedAt = DateTime.Now;
                _context.VerificationRecords.Add(ver);
            }

            // 3. Clone CustomizationPoints
            var customizations = await _context.CustomizationPoints
                .Where(x => x.ProjectId == sourceProjectId)
                .AsNoTracking()
                .ToListAsync();

            foreach (var cust in customizations)
            {
                cust.CustomizationId = 0;
                cust.ProjectId = targetProjectId;
                cust.CreatedAt = DateTime.Now;
                cust.UpdatedAt = DateTime.Now;
                _context.CustomizationPoints.Add(cust);
            }

            // 4. Clone MigrationIssues
            var issues = await _context.MigrationIssues
                .Where(x => x.ProjectId == sourceProjectId)
                .AsNoTracking()
                .ToListAsync();

            var timestamp = DateTime.Now.ToString("HHmmss");
            var idx = 0;
            foreach (var issue in issues)
            {
                idx++;
                var newId = $"ISS-{targetProjectId}-{timestamp}-{idx:D3}";
                issue.IssueId = newId;
                issue.IssueNumber = newId;
                issue.ProjectId = targetProjectId;
                issue.CreatedAt = DateTime.Now;
                issue.UpdatedAt = DateTime.Now;
                _context.MigrationIssues.Add(issue);
            }

            await _context.SaveChangesAsync();
            await transaction.CommitAsync();
            return true;
        }
        catch (Exception ex)
        {
            await transaction.RollbackAsync();
            // Log exception here conceptually
            throw; 
        }
    }
}

public interface IDataTransferService
{
    Task<IEnumerable<DataTransferCheck>> GetByProjectIdAsync(long projectId);
    Task<DataTransferCheck?> GetByIdAsync(long id);
    Task<DataTransferCheck> CreateAsync(DataTransferCheck item);
    Task<DataTransferCheck?> UpdateAsync(DataTransferCheck item);
    Task<bool> DeleteAsync(long id);
}

public class DataTransferService : IDataTransferService
{
    private readonly MigraTrackDbContext _context;

    public DataTransferService(MigraTrackDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<DataTransferCheck>> GetByProjectIdAsync(long projectId)
    {
        // 1. Fetch existing checks
        var existingChecks = await _context.DataTransferChecks
            .Where(d => d.ProjectId == projectId)
            .ToListAsync();

        // 2. Fetch Master Fields for Data Transfer (ModuleGroupId = 1001)
        var masterFields = await _context.FieldMaster
            .Where(f => f.ModuleGroupId == 1001 && f.IsActive)
            .ToListAsync();

        bool newAdded = false;

        foreach (var field in masterFields)
        {
            // Check if this master field is already tracked in this project
            // Matching logic: TableNameDesktop == FieldName
            if (!existingChecks.Any(c => c.TableNameDesktop == field.FieldName))
            {
                var newCheck = new DataTransferCheck
                {
                    ProjectId = projectId,
                    ModuleName = !string.IsNullOrEmpty(field.DefaultValue) ? field.DefaultValue : "General",
                    SubModuleName = "Standard",
                    TableNameDesktop = field.FieldName,
                    TableNameWeb = !string.IsNullOrEmpty(field.FieldLabel) ? field.FieldLabel : field.FieldName,
                    Status = "Not Started",
                    CreatedAt = DateTime.Now,
                    UpdatedAt = DateTime.Now,
                    Comments = field.FieldDescription
                };
                
                _context.DataTransferChecks.Add(newCheck);
                existingChecks.Add(newCheck); // Add to local list to return
                newAdded = true;
            }
        }

        if (newAdded)
        {
            await _context.SaveChangesAsync();
        }

        return existingChecks.OrderByDescending(d => d.CreatedAt);
    }

    public async Task<DataTransferCheck?> GetByIdAsync(long id)
    {
        return await _context.DataTransferChecks.FindAsync(id);
    }

    public async Task<DataTransferCheck> CreateAsync(DataTransferCheck item)
    {
        item.CreatedAt = DateTime.Now;
        item.UpdatedAt = DateTime.Now;
        
        _context.DataTransferChecks.Add(item);
        await _context.SaveChangesAsync();
        
        return item;
    }

    public async Task<DataTransferCheck?> UpdateAsync(DataTransferCheck item)
    {
        var existing = await _context.DataTransferChecks.FindAsync(item.TransferId);
        if (existing == null)
            return null;

        existing.ModuleName = item.ModuleName;
        existing.SubModuleName = item.SubModuleName;
        existing.TableNameDesktop = item.TableNameDesktop;
        existing.TableNameWeb = item.TableNameWeb;
        existing.RecordCountDesktop = item.RecordCountDesktop;
        existing.RecordCountWeb = item.RecordCountWeb;
        existing.Status = item.Status;
        existing.IsCompleted = item.IsCompleted;
        existing.Comments = item.Comments;
        existing.UpdatedAt = DateTime.Now;

        await _context.SaveChangesAsync();
        return existing;
    }

    public async Task<bool> DeleteAsync(long id)
    {
        var item = await _context.DataTransferChecks.FindAsync(id);
        if (item == null)
            return false;

        _context.DataTransferChecks.Remove(item);
        await _context.SaveChangesAsync();
        return true;
    }
}

public interface IVerificationService
{
    Task<IEnumerable<VerificationRecord>> GetByProjectIdAsync(long projectId);
    Task<VerificationRecord?> GetByIdAsync(long id);
    Task<VerificationRecord> CreateAsync(VerificationRecord item);
    Task<VerificationRecord?> UpdateAsync(VerificationRecord item);
    Task<bool> DeleteAsync(long id);
}

public class VerificationService : IVerificationService
{
    private readonly MigraTrackDbContext _context;

    public VerificationService(MigraTrackDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<VerificationRecord>> GetByProjectIdAsync(long projectId)
    {
        return await _context.VerificationRecords
            .Where(v => v.ProjectId == projectId)
            .OrderByDescending(v => v.CreatedAt)
            .ToListAsync();
    }

    public async Task<VerificationRecord?> GetByIdAsync(long id)
    {
        return await _context.VerificationRecords.FindAsync(id);
    }

    public async Task<VerificationRecord> CreateAsync(VerificationRecord item)
    {
        item.CreatedAt = DateTime.Now;
        item.UpdatedAt = DateTime.Now;
        
        _context.VerificationRecords.Add(item);
        await _context.SaveChangesAsync();
        
        return item;
    }

    public async Task<VerificationRecord?> UpdateAsync(VerificationRecord item)
    {
        var existing = await _context.VerificationRecords.FindAsync(item.VerificationId);
        if (existing == null)
            return null;

        existing.ModuleName = item.ModuleName;
        existing.SubModuleName = item.SubModuleName;
        existing.FieldName = item.FieldName;
        existing.Description = item.Description;
        existing.SqlQuery = item.SqlQuery;
        existing.Status = item.Status;
        existing.IsVerified = item.IsVerified;
        existing.Comments = item.Comments;
        existing.UpdatedAt = DateTime.Now;

        await _context.SaveChangesAsync();
        return existing;
    }

    public async Task<bool> DeleteAsync(long id)
    {
        var item = await _context.VerificationRecords.FindAsync(id);
        if (item == null)
            return false;

        _context.VerificationRecords.Remove(item);
        await _context.SaveChangesAsync();
        return true;
    }
}

public interface IIssueService
{
    Task<IEnumerable<MigrationIssue>> GetByProjectIdAsync(long projectId);
    Task<MigrationIssue?> GetByIdAsync(string id);
    Task<MigrationIssue> CreateAsync(MigrationIssue item);
    Task<MigrationIssue?> UpdateAsync(MigrationIssue item);
}

public class IssueService : IIssueService
{
    private readonly MigraTrackDbContext _context;

    public IssueService(MigraTrackDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<MigrationIssue>> GetByProjectIdAsync(long projectId)
    {
        return await _context.MigrationIssues
            .Where(i => i.ProjectId == projectId)
            .OrderByDescending(i => i.CreatedAt)
            .ToListAsync();
    }

    public async Task<MigrationIssue?> GetByIdAsync(string id)
    {
        return await _context.MigrationIssues.FindAsync(id);
    }

    public async Task<MigrationIssue> CreateAsync(MigrationIssue item)
    {
        item.CreatedAt = DateTime.Now;
        item.UpdatedAt = DateTime.Now;
        
        _context.MigrationIssues.Add(item);
        await _context.SaveChangesAsync();
        
        return item;
    }

    public async Task<MigrationIssue?> UpdateAsync(MigrationIssue item)
    {
        var existing = await _context.MigrationIssues.FindAsync(item.IssueId);
        if (existing == null)
            return null;

        existing.Title = item.Title;
        existing.Description = item.Description;
        existing.Status = item.Status;
        existing.Priority = item.Priority;
        existing.RootCause = item.RootCause;
        existing.Remarks = item.Remarks;
        existing.UpdatedAt = DateTime.Now;

        await _context.SaveChangesAsync();
        return existing;
    }
}

// End of existing services

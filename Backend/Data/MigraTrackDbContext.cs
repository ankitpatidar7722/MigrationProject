using Microsoft.EntityFrameworkCore;
using MigraTrackAPI.Models;

namespace MigraTrackAPI.Data;

public class MigraTrackDbContext : DbContext
{
    public MigraTrackDbContext(DbContextOptions<MigraTrackDbContext> options) : base(options)
    {
    }

    // Core Tables
    public DbSet<User> Users { get; set; }
    public DbSet<ModuleGroup> ModuleGroups { get; set; }
    public DbSet<FieldMaster> FieldMaster { get; set; }
    
    // Project Management
    public DbSet<Project> Projects { get; set; }
    public DbSet<ProjectTeamMember> ProjectTeamMembers { get; set; }
    
    // Dynamic Module Data
    public DbSet<DynamicModuleData> DynamicModuleData { get; set; }
    
    // Specific Module Tables
    public DbSet<DataTransferCheck> DataTransferChecks { get; set; }
    public DbSet<VerificationRecord> VerificationRecords { get; set; }
    public DbSet<MigrationIssue> MigrationIssues { get; set; }
    public DbSet<CustomizationPoint> CustomizationPoints { get; set; }
    public DbSet<ProjectEmail> ProjectEmails { get; set; }
    
    // Supporting Tables
    public DbSet<Comment> Comments { get; set; }
    public DbSet<Attachment> Attachments { get; set; }
    public DbSet<ActivityLog> ActivityLog { get; set; }
    public DbSet<ProjectMilestone> ProjectMilestones { get; set; }
    public DbSet<LookupData> LookupData { get; set; }
    public DbSet<ModuleMaster> ModuleMasters { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Configure table names to match database schema
        modelBuilder.Entity<User>().ToTable("Users");
        modelBuilder.Entity<ModuleGroup>().ToTable("ModuleGroups");
        modelBuilder.Entity<FieldMaster>().ToTable("FieldMaster");
        modelBuilder.Entity<Project>().ToTable("Projects");
        modelBuilder.Entity<ProjectTeamMember>().ToTable("ProjectTeamMembers");
        modelBuilder.Entity<DynamicModuleData>().ToTable("DynamicModuleData");
        modelBuilder.Entity<DataTransferCheck>().ToTable("DataTransferChecks");
        modelBuilder.Entity<VerificationRecord>().ToTable("VerificationRecords");
        modelBuilder.Entity<MigrationIssue>().ToTable("MigrationIssues");
        modelBuilder.Entity<CustomizationPoint>().ToTable("CustomizationPoints");
        modelBuilder.Entity<ProjectEmail>().ToTable("ProjectEmails");
        modelBuilder.Entity<Comment>().ToTable("Comments");
        modelBuilder.Entity<Attachment>().ToTable("Attachments");
        modelBuilder.Entity<ActivityLog>().ToTable("ActivityLog");
        modelBuilder.Entity<ProjectMilestone>().ToTable("ProjectMilestones");
        modelBuilder.Entity<LookupData>().ToTable("LookupData");
        modelBuilder.Entity<ModuleMaster>().ToTable("ModuleMaster");

        // Configure relationships and constraints
        modelBuilder.Entity<Project>()
            .HasKey(p => p.ProjectId);

        modelBuilder.Entity<DataTransferCheck>()
            .HasOne<Project>()
            .WithMany()
            .HasForeignKey(d => d.ProjectId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<VerificationRecord>()
            .HasOne<Project>()
            .WithMany()
            .HasForeignKey(v => v.ProjectId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<MigrationIssue>()
            .HasOne<Project>()
            .WithMany()
            .HasForeignKey(i => i.ProjectId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<CustomizationPoint>()
            .HasOne<Project>()
            .WithMany()
            .HasForeignKey(c => c.ProjectId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<ProjectEmail>()
            .HasOne<Project>()
            .WithMany()
            .HasForeignKey(e => e.ProjectId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}

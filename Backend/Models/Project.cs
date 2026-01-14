using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MigraTrackAPI.Models;

public class Project
{
    [Key]
    [Column("ProjectId")]
    public long ProjectId { get; set; }

    [Required]
    [MaxLength(200)]
    public string ClientName { get; set; } = string.Empty;

    [MaxLength(50)]
    public string? ClientCode { get; set; }

    public string? Description { get; set; }

    [MaxLength(100)]
    public string? ProjectType { get; set; }

    [Required]
    [MaxLength(50)]
    public string Status { get; set; } = "Active";

    public DateTime? StartDate { get; set; }

    public DateTime? TargetCompletionDate { get; set; }

    public DateTime? ActualCompletionDate { get; set; }

    public DateTime? LiveDate { get; set; }

    [MaxLength(200)]
    public string? ProjectManager { get; set; }

    [MaxLength(200)]
    public string? TechnicalLead { get; set; }

    [Column(TypeName = "decimal(18,2)")]
    public decimal? Budget { get; set; }

    [MaxLength(200)]
    public string? ImplementationCoordinator { get; set; }

    [MaxLength(200)]
    public string? CoordinatorEmail { get; set; }

    public bool IsActive { get; set; } = true;

    public DateTime CreatedAt { get; set; } = DateTime.Now;

    public int? CreatedBy { get; set; }

    public DateTime UpdatedAt { get; set; } = DateTime.Now;

    public int? UpdatedBy { get; set; }
}

public class User
{
    [Key]
    public int UserId { get; set; }

    [Required]
    [MaxLength(100)]
    public string Username { get; set; } = string.Empty;

    [Required]
    [MaxLength(255)]
    public string Email { get; set; } = string.Empty;

    [Required]
    [MaxLength(500)]
    public string PasswordHash { get; set; } = string.Empty;

    [MaxLength(100)]
    public string? FirstName { get; set; }

    [MaxLength(100)]
    public string? LastName { get; set; }

    [Required]
    [MaxLength(50)]
    public string Role { get; set; } = "User";

    public bool IsActive { get; set; } = true;

    public DateTime CreatedAt { get; set; } = DateTime.Now;

    public DateTime UpdatedAt { get; set; } = DateTime.Now;

    public DateTime? LastLoginAt { get; set; }
}

public class ModuleGroup
{
    [Key]
    public int ModuleGroupId { get; set; }

    [Required]
    [MaxLength(100)]
    public string ModuleGroupName { get; set; } = string.Empty;

    [MaxLength(500)]
    public string? Description { get; set; }

    [MaxLength(50)]
    public string? IconName { get; set; }

    public int DisplayOrder { get; set; }

    public bool IsActive { get; set; } = true;

    public DateTime CreatedAt { get; set; } = DateTime.Now;

    public DateTime UpdatedAt { get; set; } = DateTime.Now;
}

public class FieldMaster
{
    [Key]
    public int FieldId { get; set; }

    [Required]
    [MaxLength(100)]
    public string FieldName { get; set; } = string.Empty;

    [Required]
    [MaxLength(200)]
    public string FieldLabel { get; set; } = string.Empty;

    [MaxLength(500)]
    public string? FieldDescription { get; set; }

    [Required]
    public int ModuleGroupId { get; set; }

    [Required]
    [MaxLength(50)]
    public string DataType { get; set; } = string.Empty;

    public int? MaxLength { get; set; }

    [MaxLength(500)]
    public string? DefaultValue { get; set; }

    public string? SelectQueryDb { get; set; }

    public bool IsRequired { get; set; }

    public bool IsUnique { get; set; }

    public int DisplayOrder { get; set; }

    public bool IsActive { get; set; } = true;

    [MaxLength(500)]
    public string? ValidationRegex { get; set; }

    [MaxLength(200)]
    public string? PlaceholderText { get; set; }

    [MaxLength(500)]
    public string? HelpText { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.Now;

    public DateTime UpdatedAt { get; set; } = DateTime.Now;
}

public class ProjectTeamMember
{
    [Key]
    public int ProjectTeamId { get; set; }

    [Required]
    public long ProjectId { get; set; }

    [Required]
    public int UserId { get; set; }

    [Required]
    [MaxLength(100)]
    public string Role { get; set; } = string.Empty;

    public DateTime AssignedDate { get; set; } = DateTime.Now;

    public bool IsActive { get; set; } = true;
}

public class DynamicModuleData
{
    [Key]
    [MaxLength(50)]
    public string RecordId { get; set; } = string.Empty;

    [Required]
    public long ProjectId { get; set; }

    [Required]
    public int ModuleGroupId { get; set; }

    [Required]
    public string JsonData { get; set; } = string.Empty;

    [MaxLength(50)]
    public string? Status { get; set; }

    public bool IsCompleted { get; set; }

    public bool IsDeleted { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.Now;

    public int? CreatedBy { get; set; }

    public DateTime UpdatedAt { get; set; } = DateTime.Now;

    public int? UpdatedBy { get; set; }
}

public class Comment
{
    [Key]
    public int CommentId { get; set; }

    [Required]
    [MaxLength(50)]
    public string EntityType { get; set; } = string.Empty;

    [Required]
    [MaxLength(50)]
    public string EntityId { get; set; } = string.Empty;

    [Required]
    public string CommentText { get; set; } = string.Empty;

    [Required]
    public int CreatedBy { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.Now;

    public DateTime UpdatedAt { get; set; } = DateTime.Now;

    public bool IsDeleted { get; set; }
}

public class Attachment
{
    [Key]
    public int AttachmentId { get; set; }

    [Required]
    [MaxLength(50)]
    public string EntityType { get; set; } = string.Empty;

    [Required]
    [MaxLength(50)]
    public string EntityId { get; set; } = string.Empty;

    [Required]
    [MaxLength(500)]
    public string FileName { get; set; } = string.Empty;

    public long? FileSize { get; set; }

    [MaxLength(100)]
    public string? FileType { get; set; }

    [Required]
    [MaxLength(1000)]
    public string FilePath { get; set; } = string.Empty;

    [Required]
    public int UploadedBy { get; set; }

    public DateTime UploadedAt { get; set; } = DateTime.Now;

    public bool IsDeleted { get; set; }
}

public class ActivityLog
{
    [Key]
    public long LogId { get; set; }

    public int? UserId { get; set; }

    [MaxLength(50)]
    public string? EntityType { get; set; }

    [MaxLength(50)]
    public string? EntityId { get; set; }

    [Required]
    [MaxLength(100)]
    public string Action { get; set; } = string.Empty;

    public string? Details { get; set; }

    [MaxLength(50)]
    public string? IpAddress { get; set; }

    [MaxLength(500)]
    public string? UserAgent { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.Now;
}

public class ProjectMilestone
{
    [Key]
    public int MilestoneId { get; set; }

    [Required]
    public long ProjectId { get; set; }

    [Required]
    [MaxLength(200)]
    public string MilestoneName { get; set; } = string.Empty;

    public string? Description { get; set; }

    [Required]
    public DateTime PlannedDate { get; set; }

    public DateTime? ActualDate { get; set; }

    [Required]
    [MaxLength(50)]
    public string Status { get; set; } = "Pending";

    public bool IsActive { get; set; } = true;

    public DateTime CreatedAt { get; set; } = DateTime.Now;

    public DateTime UpdatedAt { get; set; } = DateTime.Now;
}

public class LookupData
{
    [Key]
    public int LookupId { get; set; }

    [Required]
    [MaxLength(100)]
    public string LookupType { get; set; } = string.Empty;

    [Required]
    [MaxLength(100)]
    public string LookupKey { get; set; } = string.Empty;

    [Required]
    [MaxLength(500)]
    public string LookupValue { get; set; } = string.Empty;

    public int? ParentLookupId { get; set; }

    public int DisplayOrder { get; set; }

    public bool IsActive { get; set; } = true;

    public DateTime CreatedAt { get; set; } = DateTime.Now;
}



export type DataType = 'int' | 'varchar' | 'text' | 'date' | 'bit' | 'dropdown' | 'textarea' | 'number' | 'email' | 'select' | 'checkbox';

/**
 * Maps directly to FieldMaster table in MS SQL Server
 */
export interface FieldMaster {
  fieldId: number;         // Primary Key
  fieldName: string;       // Actual column name
  fieldLabel: string;
  fieldDescription?: string;
  moduleGroupId: number;   // 1001, 1002, etc.
  dataType: DataType;      // DataTypes column in SQL
  defaultValue?: string;
  selectQueryDb?: string;   // SQL Query for dropdown population
  validationRegex?: string;
  placeholderText?: string;
  helpText?: string;
  isRequired: boolean;
  isUnique?: boolean;
  isActive?: boolean;
  displayOrder: number;
  maxLength?: number;
}

export interface Project {
  projectId: number;
  clientName: string;
  clientCode?: string;
  description: string;
  projectType?: string;
  status: string;
  startDate?: string;
  targetCompletionDate?: string;
  actualCompletionDate?: string;
  liveDate?: string;
  projectManager?: string;
  technicalLead?: string;
  budget?: number;
  implementationCoordinator?: string;
  coordinatorEmail?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface ModuleGroup {
  id: number;
  name: string;
  description: string;
}

/**
 * Dynamically rendered module data
 */
export interface DynamicModuleData {
  recordId: string;
  projectId: number;
  moduleGroupId: number;
  jsonData: string; // JSON String from backend
  status: string;
  isCompleted: boolean;
  createdAt?: string;
}

export interface DashboardStats {
  totalModules: number;
  completedMigrations: number;
  pendingMigrations: number;
  totalIssues: number;
}

// Added missing module-specific interfaces
export interface DataTransferCheck {
  transferId?: number;  // Changed from string to number to match backend long
  projectId: number;
  moduleName: string;
  subModuleName: string;
  condition?: string;
  tableNameDesktop: string;
  tableNameWeb: string;
  recordCountDesktop?: number;
  recordCountWeb?: number;
  matchPercentage?: number;
  status: Status;
  isCompleted: boolean;
  migratedDate?: string;
  verifiedBy?: string;
  comments?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface VerificationRecord {
  verificationId?: number; // Changed from string to number
  projectId: number;
  moduleName: string;
  subModuleName: string;
  fieldName: string;
  description: string;
  sqlQuery: string;
  expectedResult: string;
  actualResult: string;
  status: Status;
  isVerified: boolean;
  verifiedBy?: string;
  verifiedDate?: string;
  comments?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface MigrationIssue {
  issueId: string;
  issueNumber: string;
  projectId: number;
  title: string;
  moduleName: string;
  subModuleName: string;
  description: string;
  rootCause: string;
  status: IssueStatus;
  remarks: string;
  reportedDate: string;
  resolvedDate?: string;
  priority: Priority;
}

export interface CustomizationPoint {
  customizationId: number;  // Changed from string to match backend bigint
  requirementId: string;
  projectId: number;
  moduleName: string;
  subModuleName: string;
  title: string;
  description: string;
  type: CustomizationType;
  status: CustomizationStatus;
  isBillable: boolean;
  notes: string;
}

// Legacy types preserved for compatibility
export type Status = 'Not Started' | 'Pending' | 'Completed';
export type VerificationStatus = 'Pending' | 'Correct' | 'Incorrect' | 'Re-verify';
export type IssueStatus = 'Open' | 'In Progress' | 'Resolved' | 'Closed';
export type Priority = 'Low' | 'Medium' | 'High' | 'Critical';
export type CustomizationType = 'UI' | 'Report' | 'Database' | 'Workflow' | 'Other';
export type CustomizationStatus = 'Not Started' | 'In Progress' | 'Completed' | 'Dropped';

export interface ModuleMaster {
  moduleId: number;
  subModuleName: string;
  moduleName: string;
  groupIndex?: number;
}


export interface ProjectEmail {
  emailId: number;
  projectId: number;
  subject: string;
  sender: string;
  receivers: string;
  emailDate: string;
  bodyContent: string;
  category: EmailCategory;
  attachmentPath?: string;
  relatedModule?: string;
  createdAt?: string;
}

export type EmailCategory = 'Approval' | 'Clarification' | 'Issue' | 'Completion' | 'Rejection' | 'Follow-up' | 'General';

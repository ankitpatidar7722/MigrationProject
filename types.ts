
export type DataType = 'int' | 'varchar' | 'text' | 'date' | 'bit' | 'dropdown';

/**
 * Maps directly to FieldMaster table in MS SQL Server
 */
export interface FieldMaster {
  fieldId: number;         // Primary Key
  fieldName: string;       // Actual column name
  fieldDescription: string;
  moduleGroupId: number;   // 1001, 1002, etc.
  dataType: DataType;      // DataTypes column in SQL
  defaultValue: string;
  selectQueryDb: string;   // SQL Query for dropdown population
  isRequired: boolean;
}

export interface Project {
  projectId: number;  // Changed from string to number to match backend long
  clientName: string;
  description: string;
  createdAt: string;
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
  id: string;
  projectId: number;
  moduleGroupId: number;
  data: Record<string, any>; // Map of FieldName -> Value
  createdAt: string;
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
  issueId: string;  // Already correct - removed duplicate 'id'
  projectId: number;
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


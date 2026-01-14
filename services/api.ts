
import {
  FieldMaster,
  Project,
  DynamicModuleData,
  DataTransferCheck,
  VerificationRecord,
  MigrationIssue,
  CustomizationPoint,
  ModuleMaster,
  ProjectEmail
} from '../types';

/**
 * Complete API Service for MigraTrack Pro
 * Connects React Frontend to .NET Core Backend API
 * Backend URL: http://localhost:5000/api
 */
const BASE_URL = 'http://localhost:5000/api';

const handleResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || `API Error: ${response.status}`);
  }

  // Handle 204 No Content responses
  if (response.status === 204) {
    return null as T;
  }

  return response.json();
};

export const api = {
  // ==================== PROJECTS ====================
  projects: {
    getAll: async (): Promise<Project[]> => {
      const response = await fetch(`${BASE_URL}/Projects`);
      return handleResponse<Project[]>(response);
    },

    getById: async (id: number): Promise<Project> => {
      const response = await fetch(`${BASE_URL}/Projects/${id}`);
      return handleResponse<Project>(response);
    },

    create: async (project: Project): Promise<Project> => {
      const response = await fetch(`${BASE_URL}/Projects`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(project),
      });
      return handleResponse<Project>(response);
    },

    update: async (id: number, project: Project): Promise<Project> => {
      const response = await fetch(`${BASE_URL}/Projects/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(project),
      });
      return handleResponse<Project>(response);
    },

    delete: async (id: number): Promise<void> => {
      const response = await fetch(`${BASE_URL}/Projects/${id}`, {
        method: 'DELETE'
      });
      return handleResponse<void>(response);
    },

    getDashboard: async (id: number): Promise<any> => {
      const response = await fetch(`${BASE_URL}/Projects/${id}/dashboard`);
      return handleResponse<any>(response);
    },

    clone: async (sourceId: number, targetId: number): Promise<void> => {
      const response = await fetch(`${BASE_URL}/Projects/${sourceId}/clone/${targetId}`, {
        method: 'POST'
      });
      return handleResponse<void>(response);
    },
  },

  // ==================== DATA TRANSFER CHECKS ====================
  dataTransfer: {
    getByProject: async (projectId: number): Promise<DataTransferCheck[]> => {
      const response = await fetch(`${BASE_URL}/DataTransfer/project/${projectId}`);
      return handleResponse<DataTransferCheck[]>(response);
    },

    get: async (id: number): Promise<DataTransferCheck> => {
      const response = await fetch(`${BASE_URL}/DataTransfer/${id}`);
      return handleResponse<DataTransferCheck>(response);
    },

    create: async (data: DataTransferCheck): Promise<DataTransferCheck> => {
      const response = await fetch(`${BASE_URL}/DataTransfer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return handleResponse<DataTransferCheck>(response);
    },

    update: async (id: number, data: DataTransferCheck): Promise<DataTransferCheck> => {
      const response = await fetch(`${BASE_URL}/DataTransfer/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return handleResponse<DataTransferCheck>(response);
    },

    delete: async (id: number): Promise<void> => {
      const response = await fetch(`${BASE_URL}/DataTransfer/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete record');
      }
    },
  },

  // ==================== VERIFICATION RECORDS ====================
  verification: {
    getByProject: async (projectId: number): Promise<VerificationRecord[]> => {
      const response = await fetch(`${BASE_URL}/Verification/project/${projectId}`);
      return handleResponse<VerificationRecord[]>(response);
    },

    getById: async (id: number): Promise<VerificationRecord> => {
      const response = await fetch(`${BASE_URL}/Verification/${id}`);
      return handleResponse<VerificationRecord>(response);
    },

    create: async (data: VerificationRecord): Promise<VerificationRecord> => {
      const response = await fetch(`${BASE_URL}/Verification`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return handleResponse<VerificationRecord>(response);
    },

    update: async (id: number, data: VerificationRecord): Promise<VerificationRecord> => {
      const response = await fetch(`${BASE_URL}/Verification/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return handleResponse<VerificationRecord>(response);
    },

    delete: async (id: number): Promise<void> => {
      const response = await fetch(`${BASE_URL}/Verification/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete record');
      }
    },
  },

  // ==================== MIGRATION ISSUES ====================
  issues: {
    getByProject: async (projectId: number): Promise<MigrationIssue[]> => {
      const response = await fetch(`${BASE_URL}/Issues/project/${projectId}`);
      return handleResponse<MigrationIssue[]>(response);
    },

    getById: async (id: string): Promise<MigrationIssue> => {
      const response = await fetch(`${BASE_URL}/Issues/${id}`);
      return handleResponse<MigrationIssue>(response);
    },

    create: async (item: MigrationIssue): Promise<MigrationIssue> => {
      const response = await fetch(`${BASE_URL}/Issues`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item),
      });
      return handleResponse<MigrationIssue>(response);
    },

    update: async (id: string, item: MigrationIssue): Promise<MigrationIssue> => {
      const response = await fetch(`${BASE_URL}/Issues/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item),
      });
      return handleResponse<MigrationIssue>(response);
    },

    delete: async (id: string): Promise<void> => {
      const response = await fetch(`${BASE_URL}/Issues/${id}`, {
        method: 'DELETE',
      });
      return handleResponse<void>(response);
    },
  },

  // ==================== CUSTOMIZATION POINTS ====================
  customization: {
    getByProject: async (projectId: number): Promise<CustomizationPoint[]> => {
      const response = await fetch(`${BASE_URL}/Customization/project/${projectId}`);
      return handleResponse<CustomizationPoint[]>(response);
    },

    getById: async (id: number): Promise<CustomizationPoint> => {
      const response = await fetch(`${BASE_URL}/Customization/${id}`);
      return handleResponse<CustomizationPoint>(response);
    },

    create: async (item: CustomizationPoint): Promise<CustomizationPoint> => {
      const response = await fetch(`${BASE_URL}/Customization`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item),
      });
      return handleResponse<CustomizationPoint>(response);
    },

    update: async (id: number, item: CustomizationPoint): Promise<CustomizationPoint> => {
      const response = await fetch(`${BASE_URL}/Customization/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item),
      });
      return handleResponse<CustomizationPoint>(response);
    },

    delete: async (id: number): Promise<void> => {
      const response = await fetch(`${BASE_URL}/Customization/${id}`, {
        method: 'DELETE',
      });
      return handleResponse<void>(response);
    },
  },

  // ==================== FIELD MASTER ====================
  fieldMaster: {
    getAll: async (): Promise<FieldMaster[]> => {
      const response = await fetch(`${BASE_URL}/FieldMaster`);
      return handleResponse<FieldMaster[]>(response);
    },

    getByModuleGroup: async (moduleGroupId: number): Promise<FieldMaster[]> => {
      const response = await fetch(`${BASE_URL}/FieldMaster/group/${moduleGroupId}`);
      return handleResponse<FieldMaster[]>(response);
    },

    getById: async (id: number): Promise<FieldMaster> => {
      const response = await fetch(`${BASE_URL}/FieldMaster/${id}`);
      return handleResponse<FieldMaster>(response);
    },

    create: async (field: FieldMaster): Promise<FieldMaster> => {
      const response = await fetch(`${BASE_URL}/FieldMaster`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(field),
      });
      return handleResponse<FieldMaster>(response);
    },

    update: async (id: number, field: FieldMaster): Promise<FieldMaster> => {
      const response = await fetch(`${BASE_URL}/FieldMaster/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(field),
      });
      return handleResponse<FieldMaster>(response);
    },

    delete: async (id: number): Promise<void> => {
      const response = await fetch(`${BASE_URL}/FieldMaster/${id}`, {
        method: 'DELETE'
      });
      return handleResponse<void>(response);
    },

    getLookupValues: async (type: string): Promise<{ lookupKey: string; lookupValue: string }[]> => {
      const response = await fetch(`${BASE_URL}/FieldMaster/lookup/${type}`);
      return handleResponse<{ lookupKey: string; lookupValue: string }[]>(response);
    },
  },

  // ==================== DYNAMIC MODULE DATA ====================
  moduleData: {
    get: async (projectId: number, moduleGroupId: number): Promise<DynamicModuleData[]> => {
      const response = await fetch(
        `${BASE_URL}/ModuleData?projectId=${projectId}&moduleGroupId=${moduleGroupId}`
      );
      return handleResponse<DynamicModuleData[]>(response);
    },

    getById: async (id: string): Promise<DynamicModuleData> => {
      const response = await fetch(`${BASE_URL}/ModuleData/${id}`);
      return handleResponse<DynamicModuleData>(response);
    },

    create: async (data: DynamicModuleData): Promise<DynamicModuleData> => {
      const response = await fetch(`${BASE_URL}/ModuleData`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return handleResponse<DynamicModuleData>(response);
    },

    update: async (id: string, data: DynamicModuleData): Promise<DynamicModuleData> => {
      const response = await fetch(`${BASE_URL}/ModuleData/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return handleResponse<DynamicModuleData>(response);
    },

    delete: async (id: string): Promise<void> => {
      const response = await fetch(`${BASE_URL}/ModuleData/${id}`, {
        method: 'DELETE'
      });
      return handleResponse<void>(response);
    },
  },

  // ==================== MODULE MASTER ====================
  moduleMaster: {
    getAll: async (): Promise<ModuleMaster[]> => {
      const response = await fetch(`${BASE_URL}/ModuleMaster`);
      return handleResponse<ModuleMaster[]>(response);
    },
  },

  // ==================== PROJECT EMAILS ====================
  emails: {
    getAll: async (): Promise<ProjectEmail[]> => {
      const response = await fetch(`${BASE_URL}/Emails`);
      return handleResponse<ProjectEmail[]>(response);
    },

    getByProject: async (projectId: number): Promise<ProjectEmail[]> => {
      const response = await fetch(`${BASE_URL}/Emails/project/${projectId}`);
      return handleResponse<ProjectEmail[]>(response);
    },

    getById: async (id: number): Promise<ProjectEmail> => {
      const response = await fetch(`${BASE_URL}/Emails/${id}`);
      return handleResponse<ProjectEmail>(response);
    },

    create: async (data: FormData): Promise<ProjectEmail> => {
      const response = await fetch(`${BASE_URL}/Emails`, {
        method: 'POST',
        body: data,
      });
      return handleResponse<ProjectEmail>(response);
    },

    update: async (id: number, data: ProjectEmail): Promise<ProjectEmail> => {
      const response = await fetch(`${BASE_URL}/Emails/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return handleResponse<ProjectEmail>(response);
    },

    delete: async (id: number): Promise<void> => {
      const response = await fetch(`${BASE_URL}/Emails/${id}`, {
        method: 'DELETE',
      });
      return handleResponse<void>(response);
    },
  },
};

// Legacy API for backward compatibility
export const legacyApi = {
  getFields: api.fieldMaster.getByModuleGroup,
  saveField: api.fieldMaster.create,
  deleteField: api.fieldMaster.delete,
  getProjects: api.projects.getAll,
  saveProject: api.projects.create,
  getModuleData: api.moduleData.get,
  saveModuleData: api.moduleData.create,
  deleteModuleData: api.moduleData.delete,
};

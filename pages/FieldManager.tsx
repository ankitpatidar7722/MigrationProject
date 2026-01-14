
import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { FieldMaster, DataType } from '../types';
import { Plus, Trash2, Edit3, Layers, Hash, Type, Calendar, CheckSquare, List, X } from 'lucide-react';

const FieldManager: React.FC = () => {
  const [fields, setFields] = useState<FieldMaster[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingField, setEditingField] = useState<FieldMaster | null>(null);

  const moduleGroups = [
    { id: 1001, name: 'Data Transfer Checklist' },
    { id: 1002, name: 'Verification List' },
    { id: 1003, name: 'Migration Issues' },
    { id: 1004, name: 'Customization Points' },
  ];

  useEffect(() => {
    loadFields();
  }, []);

  const loadFields = async () => {
    try {
      setLoading(true);
      const data = await api.getFields();
      setFields(data);
    } catch (err) {
      console.error("Failed to load fields from SQL backend:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    
    const field: FieldMaster = {
      fieldId: editingField?.fieldId || 0,
      fieldName: formData.get('fieldName') as string,
      fieldDescription: formData.get('fieldDescription') as string,
      moduleGroupId: parseInt(formData.get('moduleGroupId') as string),
      dataType: formData.get('dataType') as DataType,
      defaultValue: formData.get('defaultValue') as string,
      selectQueryDb: formData.get('selectQueryDb') as string,
      isRequired: formData.get('isRequired') === 'on'
    };

    try {
      await api.saveField(field);
      await loadFields();
      setShowModal(false);
    } catch (err) {
      alert("Error saving to SQL Server: " + err);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure? Removing a field from SQL FieldMaster will cause it to disappear from all module UI immediately.')) {
      try {
        await api.deleteField(id);
        await loadFields();
      } catch (err) {
        alert("Error deleting from SQL Server: " + err);
      }
    }
  };

  const getTypeIcon = (type: DataType) => {
    switch (type) {
      case 'int': return <Hash size={14} />;
      case 'varchar': return <Type size={14} />;
      case 'date': return <Calendar size={14} />;
      case 'bit': return <CheckSquare size={14} />;
      case 'dropdown': return <List size={14} />;
      default: return <Type size={14} />;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">FieldMaster Management</h1>
          <p className="text-slate-500 dark:text-zinc-400 mt-1">Configure the dynamic SQL schema for all application modules.</p>
        </div>
        <button 
          onClick={() => { setEditingField(null); setShowModal(true); }}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium shadow-sm"
        >
          <Plus size={18} />
          Add Metadata Field
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {moduleGroups.map(group => (
          <div key={group.id} className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 overflow-hidden shadow-sm">
            <div className="px-6 py-4 bg-slate-50 dark:bg-zinc-800/50 border-b border-slate-200 dark:border-zinc-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Layers className="text-indigo-500" size={20} />
                <h2 className="font-bold text-slate-900 dark:text-white">{group.name}</h2>
                <span className="text-xs font-mono bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 px-2 py-0.5 rounded">Group ID: {group.id}</span>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-[10px] font-bold uppercase tracking-widest text-slate-400 border-b border-slate-100 dark:border-zinc-800">
                    <th className="px-6 py-4">Field Name</th>
                    <th className="px-6 py-4">Type</th>
                    <th className="px-6 py-4">Description</th>
                    <th className="px-6 py-4">Default</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-zinc-800">
                  {fields.filter(f => f.moduleGroupId === group.id).map(field => (
                    <tr key={field.fieldId} className="hover:bg-slate-50 dark:hover:bg-zinc-800/30 transition-colors">
                      <td className="px-6 py-4">
                        <span className="font-semibold text-sm">{field.fieldName}</span>
                        {field.isRequired && <span className="ml-1 text-red-500 text-xs">*</span>}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-zinc-400">
                          {getTypeIcon(field.dataType)}
                          {field.dataType.toUpperCase()}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-500">{field.fieldDescription}</td>
                      <td className="px-6 py-4">
                        <code className="text-[10px] bg-slate-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded text-slate-600">{field.defaultValue || 'NULL'}</code>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => { setEditingField(field); setShowModal(true); }} className="p-2 text-slate-400 hover:text-indigo-500 transition-colors">
                            <Edit3 size={16} />
                          </button>
                          <button onClick={() => handleDelete(field.fieldId)} className="p-2 text-slate-400 hover:text-red-500 transition-colors">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {fields.filter(f => f.moduleGroupId === group.id).length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-6 py-8 text-center text-slate-400 text-sm italic">No dynamic fields defined for this module group in SQL Server.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white dark:bg-zinc-900 w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-slate-100 dark:border-zinc-800 flex items-center justify-between">
              <h2 className="text-xl font-bold">{editingField ? 'Edit SQL Field' : 'Create New SQL Field'}</h2>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-lg transition-colors">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSave}>
              <div className="p-8 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase mb-1.5">Module Group</label>
                    <select name="moduleGroupId" defaultValue={editingField?.moduleGroupId || 1001} className="w-full px-4 py-2 bg-slate-50 dark:bg-zinc-800 border-none rounded-xl outline-none focus:ring-2 focus:ring-indigo-500">
                      {moduleGroups.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase mb-1.5">Data Type</label>
                    <select name="dataType" defaultValue={editingField?.dataType || 'varchar'} className="w-full px-4 py-2 bg-slate-50 dark:bg-zinc-800 border-none rounded-xl outline-none focus:ring-2 focus:ring-indigo-500">
                      <option value="varchar">Varchar (Short Text)</option>
                      <option value="text">Text (Long Text)</option>
                      <option value="int">Integer (Number)</option>
                      <option value="bit">Bit (Boolean/Checkbox)</option>
                      <option value="date">Date</option>
                      <option value="dropdown">Dropdown (Dynamic Query)</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase mb-1.5">Field Name (Actual SQL Column)</label>
                  <input name="fieldName" defaultValue={editingField?.fieldName} required className="w-full px-4 py-2 bg-slate-50 dark:bg-zinc-800 border-none rounded-xl outline-none focus:ring-2 focus:ring-indigo-500" placeholder="e.g. GSTNumber" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase mb-1.5">Display Description</label>
                  <input name="fieldDescription" defaultValue={editingField?.fieldDescription} className="w-full px-4 py-2 bg-slate-50 dark:bg-zinc-800 border-none rounded-xl outline-none focus:ring-2 focus:ring-indigo-500" placeholder="e.g. Client Tax Registration Number" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase mb-1.5">SQL Query (For Dropdowns)</label>
                  <textarea name="selectQueryDb" defaultValue={editingField?.selectQueryDb} className="w-full px-4 py-2 bg-slate-900 text-emerald-400 font-mono text-xs border-none rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 min-h-[60px]" placeholder='SELECT "Option1", "Option2"...' />
                </div>
                <div className="flex items-center gap-3">
                  <input type="checkbox" name="isRequired" defaultChecked={editingField?.isRequired} id="isRequired" className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500" />
                  <label htmlFor="isRequired" className="text-sm font-medium">This field is mandatory</label>
                </div>
              </div>
              <div className="p-6 bg-slate-50 dark:bg-zinc-800/50 flex gap-3">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-3 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-xl font-medium">Cancel</button>
                <button type="submit" className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-lg shadow-indigo-500/20">Apply Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FieldManager;

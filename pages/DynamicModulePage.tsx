
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../services/api';
import { FieldMaster, DynamicModuleData } from '../types';
import DynamicForm from '../components/DynamicForm';
import { Plus, Search, Download, Trash2, Edit3, CheckCircle, Clock, AlertCircle } from 'lucide-react';

interface Props {
  moduleGroupId: number;
  title: string;
  subtitle: string;
}

const DynamicModulePage: React.FC<Props> = ({ moduleGroupId, title, subtitle }) => {
  const { projectId: projectIdStr } = useParams<{ projectId: string }>();
  const projectId = projectIdStr ? parseInt(projectIdStr, 10) : 0;

  const [fields, setFields] = useState<FieldMaster[]>([]);
  const [items, setItems] = useState<DynamicModuleData[]>([]);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<DynamicModuleData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (projectId) {
      loadPageData();
    }
  }, [projectId, moduleGroupId]);

  const loadPageData = async () => {
    setLoading(true);
    try {
      const [fieldData, moduleData] = await Promise.all([
        api.fieldMaster.getByModuleGroup(moduleGroupId),
        api.moduleData.get(projectId, moduleGroupId)
      ]);
      setFields(fieldData);
      setItems(moduleData);
    } catch (error) {
      console.error('Error loading page data:', error);
      setFields([]);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (data: Record<string, any>) => {
    try {
      const entry: DynamicModuleData = {
        id: editingItem?.id || crypto.randomUUID(),
        projectId: projectId,
        moduleGroupId,
        data,
        createdAt: editingItem?.createdAt || new Date().toISOString()
      };

      if (editingItem) {
        await api.moduleData.update(entry.id, entry);
      } else {
        await api.moduleData.create(entry);
      }

      await loadPageData();
      setShowModal(false);
      setEditingItem(null);
    } catch (error) {
      console.error('Error saving data:', error);
      alert('Failed to save data. Please try again.');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Permanently delete this record?')) {
      try {
        await api.moduleData.delete(id);
        await loadPageData();
      } catch (error) {
        console.error('Error deleting data:', error);
        alert('Failed to delete record. Please try again.');
      }
    }
  };

  const filtered = items.filter(item => {
    const searchString = Object.values(item.data).join(' ').toLowerCase();
    return searchString.includes(search.toLowerCase());
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': case 'Correct': case 'Resolved': return 'bg-emerald-500 text-white';
      case 'Pending': case 'In Progress': return 'bg-orange-500 text-white';
      case 'Incorrect': case 'Open': return 'bg-red-500 text-white';
      default: return 'bg-slate-300 text-slate-700';
    }
  };

  const exportCSV = () => {
    if (fields.length === 0) return;
    const headers = fields.map(f => f.fieldName);
    const rows = filtered.map(i => fields.map(f => i.data[f.fieldName] ?? ''));
    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${title.replace(/\s/g, '_')}_export.csv`;
    link.click();
  };

  if (loading) return <div className="p-20 text-center animate-pulse text-slate-400">Loading dynamic module context...</div>;

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-2 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">{title}</h1>
          <p className="text-slate-500 dark:text-zinc-400 mt-1">{subtitle}</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={exportCSV} className="inline-flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-lg font-medium text-slate-700 dark:text-white hover:bg-slate-50 dark:hover:bg-zinc-800 transition-all">
            <Download size={18} />
            Export
          </button>
          <button
            onClick={() => { setEditingItem(null); setShowModal(true); }}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all shadow-sm"
          >
            <Plus size={18} />
            New Entry
          </button>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
        <input
          type="text"
          placeholder={`Search ${title.toLowerCase()}...`}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20"
        />
      </div>

      <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto notion-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-zinc-800/50 border-b border-slate-200 dark:border-zinc-800">
                {fields.map(field => (
                  <th key={field.fieldId} className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-zinc-400 whitespace-nowrap">
                    {field.fieldName}
                  </th>
                ))}
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-zinc-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-zinc-800">
              {filtered.map(item => (
                <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-zinc-800/30 transition-colors group">
                  {fields.map(field => {
                    const value = item.data[field.fieldName];
                    return (
                      <td key={field.fieldId} className="px-6 py-4 text-sm max-w-xs truncate">
                        {field.dataType === 'bit' ? (
                          <div className={`w-5 h-5 rounded flex items-center justify-center ${value ? 'bg-emerald-500 text-white' : 'bg-slate-100 dark:bg-zinc-800 text-transparent'}`}>
                            <CheckCircle size={14} />
                          </div>
                        ) : field.fieldName === 'Status' ? (
                          <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${getStatusColor(value)}`}>
                            {value}
                          </span>
                        ) : (
                          <span className={field.dataType === 'text' ? 'line-clamp-1' : ''}>
                            {value || <span className="text-slate-300 italic">N/A</span>}
                          </span>
                        )}
                      </td>
                    );
                  })}
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => { setEditingItem(item); setShowModal(true); }}
                        className="p-1.5 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                      >
                        <Edit3 size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-1.5 text-slate-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={fields.length + 1} className="px-6 py-20 text-center text-slate-400 italic">
                    No records found for this view.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <DynamicForm
          fields={fields}
          initialData={editingItem?.data}
          title={editingItem ? `Edit ${title}` : `New ${title}`}
          onSave={handleSave}
          onCancel={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default DynamicModulePage;

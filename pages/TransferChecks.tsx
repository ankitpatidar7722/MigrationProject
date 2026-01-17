
import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../services/AuthContext';
import { DataTransferCheck, Status, ModuleMaster, WebTable, FieldMaster } from '../types';
import { Plus, Search, Filter, Trash2, Edit3, Download, Check, Loader2, ArrowLeft } from 'lucide-react';
import { LoadingOverlay } from '../components/LoadingOverlay';
import { useRefresh } from '../services/RefreshContext';
import { useLanguage } from '../services/LanguageContext';

const TransferChecks: React.FC = () => {
  const { projectId: projectIdStr } = useParams<{ projectId: string }>();
  const projectId = projectIdStr ? parseInt(projectIdStr, 10) : 0;
  const { hasPermission } = useAuth();
  const { t } = useLanguage();

  const [items, setItems] = useState<DataTransferCheck[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<Status | 'All'>('All');
  const [editingItem, setEditingItem] = useState<DataTransferCheck | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<{ show: boolean; id: number | null }>({ show: false, id: null });

  // Module Master State
  const [moduleMasters, setModuleMasters] = useState<ModuleMaster[]>([]);
  const [webTables, setWebTables] = useState<WebTable[]>([]);
  const [selectedModule, setSelectedModule] = useState<string>('');

  // Field Master State
  const [fields, setFields] = useState<FieldMaster[]>([]);

  // Refresh Context
  const { registerRefresh } = useRefresh();

  const loadItems = async () => {
    if (!projectId) return;
    try {
      const [data, modules, tables, fieldData] = await Promise.all([
        api.dataTransfer.getByProject(projectId),
        api.moduleMaster.getAll(),
        api.webTables.getAll(),
        api.fieldMaster.getAll()
      ]);
      setItems(data);
      setModuleMasters(modules);
      setWebTables(tables);
      setFields(fieldData);
    } catch (err) {
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadItems();
    registerRefresh(loadItems);
    return () => registerRefresh(() => { });
  }, [projectId, registerRefresh]);

  // Check if fields are required based on FieldMaster
  const isDesktopTableRequired = useMemo(() => {
    const field = fields.find(f => f.fieldName === 'tableNameDesktop');
    return field ? field.isRequired : true; // Default to true if not found
  }, [fields]);

  const isWebTableRequired = useMemo(() => {
    const field = fields.find(f => f.fieldName === 'tableNameWeb');
    return field ? field.isRequired : true;
  }, [fields]);

  useEffect(() => {
    if (editingItem) {
      setSelectedModule(editingItem.moduleName);
    } else {
      setSelectedModule('');
    }
  }, [editingItem]);

  const uniqueModules = Array.from(new Set(moduleMasters.map(m => m.moduleName)));
  const availableSubModules = moduleMasters
    .filter(m => m.moduleName === selectedModule)
    .map(m => m.subModuleName);

  // Filter Web Tables based on selected Module's GroupIndex
  const availableTables = useMemo(() => {
    if (!selectedModule) return [];

    // Find the group index of the selected module (using the first match as module names should group together)
    const moduleInfo = moduleMasters.find(m => m.moduleName === selectedModule);
    if (!moduleInfo || moduleInfo.groupIndex === undefined) return [];

    return webTables.filter(t => t.groupIndex === moduleInfo.groupIndex);
  }, [selectedModule, moduleMasters, webTables]);

  const distinctDesktopTables = Array.from(new Set(availableTables.map(t => t.desktopTableName).filter(Boolean)));
  const distinctWebTables = Array.from(new Set(availableTables.map(t => t.tableName).filter(Boolean)));

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const form = e.target as HTMLFormElement;
      const formData = new FormData(form);

      const itemData: DataTransferCheck = {
        transferId: editingItem?.transferId, // Undefined for new items
        projectId: projectId,
        moduleName: formData.get('moduleName') as string,
        subModuleName: formData.get('subModuleName') as string,
        condition: formData.get('condition') as string,
        tableNameDesktop: formData.get('tableNameDesktop') as string,
        tableNameWeb: formData.get('tableNameWeb') as string,
        recordCountDesktop: Number(formData.get('recordCountDesktop')) || 0,
        recordCountWeb: Number(formData.get('recordCountWeb')) || 0,
        status: formData.get('status') as Status,
        isCompleted: formData.get('status') === 'Completed',
        comments: formData.get('comments') as string
      };

      if (editingItem?.transferId) {
        await api.dataTransfer.update(editingItem.transferId, itemData);
      } else {
        await api.dataTransfer.create(itemData);
      }

      await loadItems();
      setShowModal(false);
      setEditingItem(null);
    } catch (err) {
      console.error('Error saving transfer check:', err);
      alert('Failed to save transfer check. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveAs = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setSaving(true);
    try {
      const button = e.currentTarget;
      const form = button.closest('form');
      if (!form) throw new Error('Form not found');

      const formData = new FormData(form);

      const newItem: DataTransferCheck = {
        // ID generated by backend
        projectId: projectId,
        moduleName: formData.get('moduleName') as string,
        subModuleName: formData.get('subModuleName') as string,
        condition: formData.get('condition') as string,
        tableNameDesktop: formData.get('tableNameDesktop') as string,
        tableNameWeb: formData.get('tableNameWeb') as string,
        recordCountDesktop: Number(formData.get('recordCountDesktop')) || 0,
        recordCountWeb: Number(formData.get('recordCountWeb')) || 0,
        status: formData.get('status') as Status,
        isCompleted: formData.get('status') === 'Completed',
        comments: formData.get('comments') as string
      };

      await api.dataTransfer.create(newItem);
      await loadItems();
      setShowModal(false);
      setEditingItem(null);
    } catch (err) {
      console.error('Error saving as new transfer check:', err);
      alert('Failed to save as new record. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (id: number) => {
    setDeleteConfirm({ show: true, id });
  };

  const confirmDelete = async () => {
    if (!deleteConfirm.id) return;

    try {
      await api.dataTransfer.delete(deleteConfirm.id);
      await loadItems();
      setDeleteConfirm({ show: false, id: null });
    } catch (err) {
      console.error('Error deleting transfer check:', err);
      alert('Failed to delete record. Please try again.');
    }
  };

  const toggleStatus = async (item: DataTransferCheck) => {
    if (!item.transferId) return;
    const nextStatus: Record<Status, Status> = {
      'Not Started': 'Pending',
      'Pending': 'Completed',
      'Completed': 'Not Started'
    };
    const updated = { ...item, status: nextStatus[item.status], isCompleted: nextStatus[item.status] === 'Completed' };
    try {
      await api.dataTransfer.update(item.transferId, updated);
      await loadItems();
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  const filtered = items.filter(i => {
    const matchesSearch = i.moduleName.toLowerCase().includes(search.toLowerCase()) ||
      i.tableNameDesktop.toLowerCase().includes(search.toLowerCase()) ||
      i.tableNameWeb.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'All' || i.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const exportCSV = () => {
    const headers = ['Module', 'Sub Module', 'Desktop Table', 'Web Table', 'Status'];
    const rows = filtered.map(i => [i.moduleName, i.subModuleName, i.tableNameDesktop, i.tableNameWeb, i.status]);
    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `transfer_checks_${projectId}.csv`);
    link.click();
  };

  const getStatusColor = (status: Status) => {
    switch (status) {
      case 'Completed': return 'bg-emerald-500 text-white';
      case 'Pending': return 'bg-orange-500 text-white';
      default: return 'bg-slate-300 dark:bg-zinc-700 text-slate-700 dark:text-zinc-300';
    }
  };

  if (loading) {
    return <LoadingOverlay isVisible={true} message="Loading Transfer Checks..." />;
  }

  // Calculate Difference Logic
  const calculateDiff = (desktop: number, web: number) => {
    return desktop - web;
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{t('data_transfer_checks')}</h1>
          <p className="text-slate-500 dark:text-zinc-400 mt-1">Compare record counts between desktop and web databases.</p>
        </div>
        <div className="flex items-center gap-2">
          {hasPermission('Data Transfer Checks', 'Create') && (
            <button
              onClick={() => {
                setEditingItem(null);
                setShowModal(true);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm hover:shadow active:scale-95"
            >
              <Plus size={18} />
              <span className="font-medium">{t('new_check')}</span>
            </button>
          )}
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-900 rounded-xl border border-slate-200 dark:border-zinc-800 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 dark:border-zinc-800 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder={t('search_records')}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-zinc-800 border-none rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            />
          </div>
          <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as Status | 'All')}
              className="px-3 py-2 bg-slate-50 dark:bg-zinc-800 border-none rounded-lg text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="All">{t('all_statuses')}</option>
              <option value="Running">Running</option>
              <option value="Completed">Completed</option>
              <option value="Failed">Failed</option>
            </select>
            <button className="flex items-center gap-2 px-3 py-2 text-slate-600 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-800 rounded-lg transition-colors border border-slate-200 dark:border-zinc-800">
              <Download size={18} />
              <span className="hidden sm:inline text-sm font-medium">{t('export_csv')}</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-zinc-800/50 border-b border-slate-200 dark:border-zinc-800 text-xs uppercase text-slate-500 font-semibold tracking-wider">
                <th className="px-6 py-4 rounded-tl-lg">{t('module_name')}</th>
                <th className="px-6 py-4">{t('sub_module')}</th>
                <th className="px-6 py-4">{t('condition')}</th>
                <th className="px-6 py-4 text-center">{t('source_table')}</th>
                <th className="px-6 py-4 text-center">{t('target_table')}</th>
                <th className="px-6 py-4 text-center bg-blue-50/50 dark:bg-blue-900/10 text-blue-700 dark:text-blue-400">{t('desktop_count')}</th>
                <th className="px-6 py-4 text-center bg-purple-50/50 dark:bg-purple-900/10 text-purple-700 dark:text-purple-400">{t('web_count')}</th>
                <th className="px-6 py-4 text-center">{t('difference')}</th>
                <th className="px-6 py-4 text-center">{t('status')}</th>
                <th className="px-6 py-4 text-right rounded-tr-lg">{t('actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-zinc-800">
              {items.length === 0 ? (
                <tr>
                  <td colSpan={10} className="px-6 py-12 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <div className="w-16 h-16 rounded-full bg-slate-50 dark:bg-zinc-800 flex items-center justify-center">
                        <Search size={24} className="opacity-50" />
                      </div>
                      <p>{t('no_records_found')}</p>
                    </div>
                  </td>
                </tr>
              ) : (
                items.map((item) => {
                  const diff = calculateDiff(item.recordCountDesktop, item.recordCountWeb);
                  const isMatch = diff === 0 && item.recordCountDesktop > 0;

                  return (
                    <tr key={item.transferId} className="group hover:bg-slate-50 dark:hover:bg-zinc-800/50 transition-colors">
                      <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">{item.moduleName}</td>
                      <td className="px-6 py-4 text-slate-600 dark:text-zinc-400">{item.subModuleName}</td>
                      <td className="px-6 py-4 text-slate-600 dark:text-zinc-400 font-mono text-xs overflow-hidden max-w-[150px] truncate" title={item.condition}>{item.condition || '-'}</td>
                      <td className="px-6 py-4 text-center font-mono text-xs">{item.tableNameDesktop}</td>
                      <td className="px-6 py-4 text-center font-mono text-xs">{item.tableNameWeb}</td>
                      <td className="px-6 py-4 text-center font-bold text-slate-700 dark:text-zinc-300 bg-blue-50/30 dark:bg-blue-900/5">{item.recordCountDesktop.toLocaleString()}</td>
                      <td className="px-6 py-4 text-center font-bold text-slate-700 dark:text-zinc-300 bg-purple-50/30 dark:bg-purple-900/5">{item.recordCountWeb.toLocaleString()}</td>
                      <td className="px-6 py-4 text-center">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${diff === 0
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                          : 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400'
                          }`}>
                          {diff > 0 ? `+${diff}` : diff}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${isMatch
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                          : item.status === 'Running'
                            ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                            : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                          }`}>
                          {isMatch && <Check size={12} />}
                          {isMatch ? t('completed') : item.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          {hasPermission('Data Transfer Checks', 'Edit') && (
                            <button
                              onClick={() => {
                                setEditingItem(item);
                                setShowModal(true);
                              }}
                              className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                              title={t('edit')}
                            >
                              <Edit3 size={16} />
                            </button>
                          )}
                          {hasPermission('Data Transfer Checks', 'Delete') && (
                            <button
                              onClick={() => setDeleteConfirm({ show: true, id: item.transferId! })}
                              className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                              title={t('delete')}
                            >
                              <Trash2 size={16} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit/Create Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200">
            <div className="sticky top-0 z-10 flex items-center justify-between p-6 border-b border-slate-100 dark:border-zinc-800 bg-white dark:bg-zinc-900">
              <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
                {editingItem ? t('edit_check') : t('add_new_check')}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-zinc-300 rounded-full hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
              >
                <ArrowLeft size={20} />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 dark:text-zinc-300">
                    {t('module_name')} <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="moduleName"
                    required
                    value={selectedModule}
                    onChange={(e) => setSelectedModule(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  >
                    <option value="">Select Module</option>
                    {uniqueModules.map(m => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 dark:text-zinc-300">
                    {t('sub_module')} <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="subModuleName"
                    required
                    defaultValue={editingItem?.subModuleName}
                    className="w-full px-3 py-2.5 bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  >
                    <option value="">Select Sub Module</option>
                    {availableSubModules.map(sm => (
                      <option key={sm} value={sm}>{sm}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2 col-span-2">
                  <label className="text-sm font-semibold text-slate-700 dark:text-zinc-300">
                    {t('condition')}
                  </label>
                  <input
                    name="condition"
                    defaultValue={editingItem?.condition}
                    placeholder="e.g. IsActive = 1"
                    className="w-full px-3 py-2.5 bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all font-mono text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 dark:text-zinc-300">
                    {t('source_table')} {isDesktopTableRequired && <span className="text-red-500">*</span>}
                  </label>
                  <select
                    name="tableNameDesktop"
                    required={isDesktopTableRequired}
                    defaultValue={editingItem?.tableNameDesktop}
                    className="w-full px-3 py-2.5 bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all font-mono text-sm"
                  >
                    <option value="">Select Table</option>
                    {distinctDesktopTables.map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 dark:text-zinc-300">
                    {t('target_table')} {isWebTableRequired && <span className="text-red-500">*</span>}
                  </label>
                  <select
                    name="tableNameWeb"
                    required={isWebTableRequired}
                    defaultValue={editingItem?.tableNameWeb}
                    className="w-full px-3 py-2.5 bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all font-mono text-sm"
                  >
                    <option value="">Select Table</option>
                    {distinctWebTables.map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 dark:text-zinc-300">
                    {t('desktop_count')}
                  </label>
                  <input
                    type="number"
                    name="recordCountDesktop"
                    defaultValue={editingItem?.recordCountDesktop}
                    className="w-full px-3 py-2.5 bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 dark:text-zinc-300">
                    {t('web_count')}
                  </label>
                  <input
                    type="number"
                    name="recordCountWeb"
                    defaultValue={editingItem?.recordCountWeb}
                    className="w-full px-3 py-2.5 bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 dark:text-zinc-300">
                    {t('status')}
                  </label>
                  <select
                    name="status"
                    defaultValue={editingItem?.status || 'Pending'}
                    className="w-full px-3 py-2.5 bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Running">Running</option>
                    <option value="Completed">Completed</option>
                    <option value="Failed">Failed</option>
                  </select>
                </div>

                <div className="space-y-2 col-span-2">
                  <label className="text-sm font-semibold text-slate-700 dark:text-zinc-300">
                    {t('comments')}
                  </label>
                  <textarea
                    name="comments"
                    rows={3}
                    defaultValue={editingItem?.comments}
                    className="w-full px-3 py-2.5 bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none"
                  ></textarea>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-slate-600 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-lg font-medium transition-colors"
                >
                  {t('cancel')}
                </button>

                {hasPermission('Data Transfer Checks', 'Create') && editingItem && (
                  <button
                    type="button"
                    onClick={handleSaveAs}
                    disabled={saving}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors shadow-sm disabled:opacity-50 flex items-center gap-2"
                  >
                    {saving ? <Loader2 size={18} className="animate-spin" /> : <Plus size={18} />}
                    {t('save_as_new')}
                  </button>
                )}

                {(hasPermission('Data Transfer Checks', 'Edit') || !editingItem) && (
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors shadow-sm disabled:opacity-50 flex items-center gap-2"
                  >
                    {saving && <Loader2 size={18} className="animate-spin" />}
                    {editingItem ? t('update_record') : t('save')}
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm.show && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-xl max-w-sm w-full mx-4 border border-slate-100 dark:border-zinc-800 animate-in zoom-in-95 duration-200">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{t('confirm_delete')}</h3>
            <p className="text-slate-500 dark:text-zinc-400 mb-6 text-sm">This action cannot be undone.</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteConfirm({ show: false, id: null })}
                className="px-4 py-2 text-slate-600 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-lg font-medium transition-colors"
              >
                {t('cancel')}
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm.id!)}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors shadow-sm"
              >
                {t('delete')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const XIcon = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
);

export default TransferChecks;

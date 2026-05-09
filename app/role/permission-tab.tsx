"use client";
import { useEffect, useMemo, useState } from "react";
import { permissionService } from "@/services/permission.service";
import { Permission } from "@/types/role-type";
import { ChevronDown, ChevronRight, Plus } from "lucide-react";

const emptyForm = {
  name: "",
  apiPath: "",
  method: "GET",
  module: "",
};

export default function PermissionTab() {
  const [list, setList] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState<number | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [showFormModal, setShowFormModal] = useState(false);

  // Accordion state
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set());

  /* ================= FETCH ================= */
  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await permissionService.getAll();
      setList(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  /* ================= CREATE / UPDATE ================= */
  const handleSubmit = async () => {
    try {
      if (!form.name || !form.apiPath) return;

      if (editId) {
        await permissionService.update(editId, form);
      } else {
        await permissionService.create(form);
      }

      setForm(emptyForm);
      setEditId(null);
      setShowFormModal(false);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const openCreateModal = () => {
    setForm(emptyForm);
    setEditId(null);
    setShowFormModal(true);
  };

  const onEdit = (p: Permission) => {
    setForm({
      name: p.name,
      apiPath: p.apiPath,
      method: p.method,
      module: p.module,
    });
    setEditId(p.id);
    setShowFormModal(true);
  };

  /* ================= DELETE ================= */
  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      await permissionService.remove(deleteId);
      setList((prev) => prev.filter((p) => p.id !== deleteId));
    } catch (err) {
      console.error(err);
    } finally {
      setDeleteId(null);
    }
  };

  /* ================= GROUP ================= */
  const grouped = useMemo(() => {
    return list.reduce((acc: Record<string, Permission[]>, item) => {
      const key = item.module || "UNKNOWN";
      if (!acc[key]) acc[key] = [];
      acc[key].push(item);
      return acc;
    }, {});
  }, [list]);

  const toggleModule = (module: string) => {
    setExpandedModules((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(module)) newSet.delete(module);
      else newSet.add(module);
      return newSet;
    });
  };

  return (
    <div className="bg-background text-xs! text-foreground px-2 md:p-6 rounded-xl">
      <div className="flex md:justify-between md:items-center items-start flex-col md:flex-row mb-6">
        <h2 className="text-2xl font-bold">Permission Management</h2>
        <button
          onClick={openCreateModal}
          className="flex mt-2 md:mt-0 items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-xl hover:opacity-90 transition font-medium"
        >
          <Plus className="w-5 h-5" />
          Create New Permission
        </button>
      </div>

      {/* LIST - Accordion */}
      {loading ? (
        <p className="text-center py-10">Loading permissions...</p>
      ) : (
        <div className="space-y-4">
          {Object.entries(grouped).map(([module, items]) => {
            const isExpanded = expandedModules.has(module);
            return (
              <div key={module} className="border border-border rounded-xl overflow-hidden bg-card">
                {/* Header */}
                <button
                  onClick={() => toggleModule(module)}
                  className="w-full px-6 py-4 flex items-center justify-between hover:bg-accent transition-colors"
                >
                  <div className="flex items-center gap-3">
                    {isExpanded ? (
                      <ChevronDown className="w-5 h-5 text-primary" />
                    ) : (
                      <ChevronRight className="w-5 h-5" />
                    )}
                    <h3 className="font-semibold  text-primary">{module}</h3>
                  </div>
                  <span className="  text-muted-foreground bg-muted px-3 py-1 rounded-full">
                    {items.length} permissions
                  </span>
                </button>

                {/* Content */}
                {isExpanded && (
                  <div className="px-6 pb-6 space-y-3">
                    {items.map((p, index) => (
                      <div
                        key={p.id}
                        className="flex overflow-hidden flex-col md:flex-row justify-between items-start gap-1 md:items-center border border-border rounded-lg p-4 hover:bg-accent/50 transition"
                      >
                        <div>
                          <div className="font-medium">
                            {index + 1}. {p.name}
                          </div>
                          <div className="  text-muted-foreground mt-1.5 flex items-start md:items-center gap-1 ">
                            <span className="font-mono bg-muted px-2 py-0.5 rounded">{p.method}</span> {p.apiPath}
                          </div>
                        </div>

                        <div className="flex gap-2 self-center">
                          <button
                            onClick={() => onEdit(p)}
                            className="px-4 py-2   border border-border rounded-lg hover:bg-accent transition"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => setDeleteId(p.id)}
                            className="px-4 py-2   text-red-500 border border-border rounded-lg hover:bg-red-50 transition"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}

          {Object.keys(grouped).length === 0 && (
            <p className="text-center text-muted-foreground py-10">No permissions found.</p>
          )}
        </div>
      )}

      {/* ================= CREATE / EDIT MODAL ================= */}
      {showFormModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-card border border-border rounded-2xl p-6 w-full max-w-md mx-4">
            <h3 className="text-xl font-bold mb-5">{editId ? "Edit Permission" : "Create New Permission"}</h3>

            <div className="space-y-4">
              <input
                className="w-full px-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Permission name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />

              <input
                className="w-full px-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="API Path (e.g. /api/users)"
                value={form.apiPath}
                onChange={(e) => setForm({ ...form, apiPath: e.target.value })}
              />

              <select
                className="w-full  dark:bg-card  px-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                value={form.method}
                onChange={(e) => setForm({ ...form, method: e.target.value })}
              >
                <option>GET</option>
                <option>POST</option>
                <option>PUT</option>
                <option>DELETE</option>
              </select>

              <input
                className="w-full px-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Module (e.g. User, Role, ...)"
                value={form.module}
                onChange={(e) => setForm({ ...form, module: e.target.value })}
              />
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => {
                  setShowFormModal(false);
                  setForm(emptyForm);
                  setEditId(null);
                }}
                className="px-5 py-2.5 border border-border rounded-xl hover:bg-accent transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="px-5 py-2.5 bg-primary text-primary-foreground rounded-xl hover:opacity-90 transition font-medium"
              >
                {editId ? "Update Permission" : "Create Permission"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= DELETE CONFIRM MODAL ================= */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-card border border-border rounded-2xl p-6 w-85">
            <h3 className="font-bold text-xl mb-2">Confirm Delete</h3>
            <p className="text-muted-foreground mb-6">
              Are you sure you want to delete this permission? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="px-5 py-2 border border-border rounded-xl hover:bg-accent"
              >
                Cancel
              </button>
              <button onClick={confirmDelete} className="px-5 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700">
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

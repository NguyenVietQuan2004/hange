"use client";

import { useEffect, useMemo, useState } from "react";
import { roleService } from "@/services/role.service";
import { permissionService } from "@/services/permission.service";
import { Permission, Role } from "@/types/role-type";
import { Plus, Edit, Trash2, ChevronDown, ChevronRight } from "lucide-react";

const emptyForm = {
  name: "",
  description: "",
  permissionIds: [] as number[],
};

export default function RoleTab() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState<number | null>(null);
  const [showFormModal, setShowFormModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  // State cho accordion trong modal
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

  /* ================= FETCH ================= */
  const fetchData = async () => {
    try {
      setLoading(true);
      const [r, p] = await Promise.all([roleService.getAll(), permissionService.getAll()]);
      setRoles(r);
      setPermissions(p);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  /* ================= GROUP PERMISSIONS BY MODULE ================= */
  const groupedPermissions = useMemo(() => {
    return permissions.reduce((acc: Record<string, Permission[]>, p) => {
      const key = p.module || "UNKNOWN";
      if (!acc[key]) acc[key] = [];
      acc[key].push(p);
      return acc;
    }, {});
  }, [permissions]);

  /* ================= CREATE ================= */
  const openCreateModal = () => {
    setForm(emptyForm);
    setEditId(null);
    setShowFormModal(true);

    setExpandedGroups(new Set()); // Mở tất cả group khi tạo mới
  };

  /* ================= EDIT ================= */
  const openEditModal = (role: Role) => {
    setForm({
      name: role.name,
      description: role.description || "",
      permissionIds: role.permissions.map((p) => p.id),
    });
    setEditId(role.id);
    setShowFormModal(true);
    setExpandedGroups(new Set());
  };

  /* ================= TOGGLE SINGLE PERMISSION ================= */
  const togglePermission = (id: number) => {
    setForm((prev) => {
      const exists = prev.permissionIds.includes(id);
      return {
        ...prev,
        permissionIds: exists ? prev.permissionIds.filter((x) => x !== id) : [...prev.permissionIds, id],
      };
    });
  };

  /* ================= TOGGLE WHOLE GROUP (MODULE) ================= */
  const toggleGroup = (module: string) => {
    const groupPerms = groupedPermissions[module] || [];
    const groupIds = groupPerms.map((p) => p.id);

    setForm((prev) => {
      const allSelected = groupIds.every((id) => prev.permissionIds.includes(id));

      return {
        ...prev,
        permissionIds: allSelected
          ? prev.permissionIds.filter((id) => !groupIds.includes(id)) // Bỏ hết
          : [...new Set([...prev.permissionIds, ...groupIds])], // Thêm hết
      };
    });
  };

  /* ================= CHECK GROUP STATUS ================= */
  const getGroupStatus = (module: string) => {
    const groupPerms = groupedPermissions[module] || [];
    if (groupPerms.length === 0) return { checked: false, indeterminate: false };

    const selectedCount = groupPerms.filter((p) => form.permissionIds.includes(p.id)).length;

    return {
      checked: selectedCount === groupPerms.length,
      indeterminate: selectedCount > 0 && selectedCount < groupPerms.length,
    };
  };

  const toggleGroupExpand = (module: string) => {
    setExpandedGroups((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(module)) newSet.delete(module);
      else newSet.add(module);
      return newSet;
    });
  };

  /* ================= CREATE / UPDATE ================= */
  const handleSubmit = async () => {
    try {
      if (!form.name) return;

      if (editId) {
        await roleService.update(editId, form);
      } else {
        await roleService.create(form);
      }

      setForm(emptyForm);
      setEditId(null);
      setShowFormModal(false);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  /* ================= DELETE ================= */
  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      await roleService.remove(deleteId);
      setRoles((prev) => prev.filter((r) => r.id !== deleteId));
    } catch (err) {
      console.error(err);
    } finally {
      setDeleteId(null);
    }
  };

  return (
    <div className="bg-background text-foreground text-xs! px-2 md:p-6 rounded-xl">
      <div className="flex md:justify-between md:items-center items-start flex-col md:flex-row mb-6">
        <h2 className="text-2xl font-bold">Role Management</h2>
        <button
          onClick={openCreateModal}
          className="flex mt-2 md:mt-0 items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-xl hover:opacity-90 transition font-medium"
        >
          <Plus className="w-5 h-5" />
          Create New Role
        </button>
      </div>

      {/* ROLE LIST */}
      {loading ? (
        <p className="text-center py-10">Loading roles...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {roles.map((role) => (
            <div key={role.id} className="border border-border rounded-2xl p-5 bg-card hover:shadow-md transition-all">
              <div>
                <h3 className="font-semibold    ">{role.name}</h3>
                {role.description && <p className="   text-muted-foreground mt-1 line-clamp-2">{role.description}</p>}
              </div>

              <div className="mt-4    text-muted-foreground">
                <span className="font-medium text-foreground">{role.permissions.length}</span> permissions assigned
              </div>

              <div className="flex gap-2 mt-6">
                <button
                  onClick={() => openEditModal(role)}
                  className="flex-1 flex items-center justify-center gap-2 border border-border hover:bg-accent py-2.5 rounded-xl transition"
                >
                  <Edit className="w-4 h-4" />
                  Edit
                </button>
                <button
                  onClick={() => setDeleteId(role.id)}
                  className="flex-1 flex items-center justify-center gap-2 text-red-500 border border-border hover:bg-red-50 py-2.5 rounded-xl transition"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            </div>
          ))}

          {roles.length === 0 && (
            <p className="col-span-full text-center text-muted-foreground py-10">No roles found.</p>
          )}
        </div>
      )}

      {/* ================= CREATE / EDIT MODAL ================= */}
      {showFormModal && (
        <div className="fixed inset-0 tex-xs! bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-card border border-border rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-6 border-b">
              <h3 className="text-xl font-bold">{editId ? "Edit Role" : "Create New Role"}</h3>
            </div>

            <div className="p-6 space-y-5 overflow-auto flex-1">
              <div>
                <label className="   font-medium block mb-1">
                  Role Name <span className="text-red-500">*</span>
                </label>
                <input
                  className="w-full px-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Enter role name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>

              <div>
                <label className="   font-medium block mb-1">Description</label>
                <input
                  className="w-full px-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Role description (optional)"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
              </div>

              {/* GROUPED PERMISSIONS */}
              <div>
                <label className="   font-medium block mb-3">Assign Permissions</label>
                <div className="border border-border rounded-xl overflow-hidden">
                  {Object.entries(groupedPermissions).map(([module, items]) => {
                    const status = getGroupStatus(module);
                    const isExpanded = expandedGroups.has(module);

                    return (
                      <div key={module} className="border-b border-border last:border-none">
                        {/* Group Header */}
                        <div
                          className="flex items-center justify-between px-4 py-3 bg-muted/50 hover:bg-muted cursor-pointer"
                          onClick={() => toggleGroupExpand(module)}
                        >
                          <div className="flex items-center gap-3">
                            {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                            <input
                              type="checkbox"
                              checked={status.checked}
                              ref={(el) => {
                                if (el) el.indeterminate = status.indeterminate;
                              }}
                              onChange={() => toggleGroup(module)}
                              className="accent-primary"
                            />
                            <span className="font-medium">{module}</span>
                          </div>
                          <span className="text-xs text-muted-foreground">{items.length} permissions</span>
                        </div>

                        {/* Group Content */}
                        {isExpanded && (
                          <div className="px-2 md:px-8 py-3 space-y-2 bg-card">
                            {items.map((p) => (
                              <label
                                key={p.id}
                                className="flex items-center gap-3 p-2 hover:bg-accent rounded-lg cursor-pointer"
                              >
                                <input
                                  type="checkbox"
                                  checked={form.permissionIds.includes(p.id)}
                                  onChange={() => togglePermission(p.id)}
                                  className="accent-primary"
                                />
                                <div className="flex-1">
                                  <div className="font-medium   ">{p.name}</div>
                                  <div className="text-xs text-muted-foreground font-mono">
                                    {p.method} {p.apiPath}
                                  </div>
                                </div>
                              </label>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="p-6 border-t flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowFormModal(false);
                  setForm(emptyForm);
                  setEditId(null);
                }}
                className="px-6 py-2.5 border border-border rounded-xl hover:bg-accent transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="px-6 py-2.5 bg-primary text-primary-foreground rounded-xl hover:opacity-90 transition font-medium"
              >
                {editId ? "Update Role" : "Create Role"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE MODAL */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-card border border-border rounded-2xl p-6 w-85">
            <h3 className="font-bold text-xl mb-2">Confirm Delete</h3>
            <p className="text-muted-foreground mb-6">
              Are you sure you want to delete this role? This action cannot be undone.
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

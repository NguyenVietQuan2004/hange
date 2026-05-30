export type Permission = {
  id: number;
  name: string;
  apiPath: string;
  method: string;
  module: string;
};

export type Role = {
  id: number;
  name: string;
  description: string;
  permissions: Permission[];
};

export type RoleCreateRequest = {
  name: string;
  description: string;
  permissionIds: number[];
};

export type RoleUpdateRequest = RoleCreateRequest;

export interface CreateUserWithoutOrganizationInterface {
  domain: string;
  name: string;
  email: string;
  password: string;
}

export enum Role {
  ADMIN = 'ADMIN',
  MEMBER = 'MEMBER',
  BILLING = 'BILLING',
  MANAGER = 'MANAGER',
}

export interface CreateUserWithOrganizationInterface {
  name: string;
  role: Role;
  email: string;
  password: string;
  organizationId: string;
}

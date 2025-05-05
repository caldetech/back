import { AbilityBuilder } from '@casl/ability';

import { AppAbility } from './types/casl.types';
import { User } from './models/user';
import { Role } from '../../schemas/role';

type PermissionsByRole = (
  user: User,
  builder: AbilityBuilder<AppAbility>,
) => void;

export const permissions: Record<Role, PermissionsByRole> = {
  ADMIN(_, { can, cannot }) {
    can('manage', 'all');
    cannot(['transfer_ownership', 'update'], 'Organization');
    can(['transfer_ownership', 'update'], 'Organization');
  },
  MEMBER(_, { can }) {
    can(['create', 'get'], 'Project');
    can(['update', 'delete'], 'Project');
    can('manage', 'Order');
    can('get', 'Order');
    can('get', ['Product', 'Service', 'User']);
    can('manage', 'Bling');
    can('manage', 'Commission');
  },
  BILLING(_, { can, cannot }) {
    can('manage', 'Billing');
    cannot('manage', [
      'Payment',
      'Commission',
      'Dashboard',
      'Report',
      'Order',
      'Product',
      'Service',
    ]);
    can('get', 'User');
    can('manage', 'Bling');
  },
  MANAGER(_, { can }) {
    can('manage', [
      'Payment',
      'Commission',
      'User',
      'Order',
      'Product',
      'Service',
      'Bling',
    ]);
  },
};

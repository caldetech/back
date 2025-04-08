import { AbilityBuilder } from '@casl/ability';

import { AppAbility } from './types/casl.types';
import { User } from './models/user';
import { Role } from '../../schemas/role';

type PermissionsByRole = (
  user: User,
  builder: AbilityBuilder<AppAbility>,
) => void;

export const permissions: Record<Role, PermissionsByRole> = {
  ADMIN(user, { can, cannot }) {
    can('manage', 'all');
    cannot(['transfer_ownership', 'update'], 'Organization');
    can(['transfer_ownership', 'update'], 'Organization', {
      ownerId: { $eq: user.id },
    });
  },
  MEMBER(user, { can }) {
    can('get', 'User');
    can(['create', 'get'], 'Project');
    can(['update', 'delete'], 'Project', { ownerId: { $eq: user.id } });
    can('manage', 'Order', {
      ownerId: { $eq: user.id },
    });
    can('get', 'Order', {
      isHidden: false,
    });
    can('get', ['Product', 'Service']);
  },
  BILLING(_, { can, cannot }) {
    can('manage', 'Billing');
    cannot('manage', [
      'Payment',
      'Comission',
      'Dashboard',
      'Report',
      'Order',
      'Product',
      'Service',
    ]);
    can('get', 'User');
  },
  MANAGER(_, { can }) {
    can('manage', [
      'Payment',
      'Comission',
      'User',
      'Order',
      'Product',
      'Service',
    ]);
  },
};

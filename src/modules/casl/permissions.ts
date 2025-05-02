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
    const { organizationRole } = user;

    can('manage', 'all');
    cannot(['transfer_ownership', 'update'], 'Organization');
    can(['transfer_ownership', 'update'], 'Organization', {
      ownerId: { $eq: organizationRole.id },
    });
  },
  MEMBER(user, { can }) {
    const { organizationRole } = user;

    can(['create', 'get'], 'Project');
    can(['update', 'delete'], 'Project', {
      ownerId: { $eq: organizationRole.id },
    });
    can('manage', 'Order', {
      ownerId: { $eq: organizationRole.id },
    });
    can('get', 'Order', {
      isHidden: false,
    });
    can('get', ['Product', 'Service', 'User']);
    can('manage', 'Bling');
    can('manage', 'Commission', {
      memberId: { $eq: organizationRole.id },
    });
  },
  BILLING(user, { can, cannot }) {
    const { organizationRole } = user;

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
  MANAGER(user, { can }) {
    const { organizationRole } = user;

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

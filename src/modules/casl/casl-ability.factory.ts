import { AbilityBuilder, createMongoAbility } from '@casl/ability';
import { Injectable } from '@nestjs/common';
import { permissions } from './permissions';
import { AppAbility } from './types/casl.types';

@Injectable()
export class CaslAbilityFactory {
  createForUser(user): AppAbility {
    const builder = new AbilityBuilder<AppAbility>(createMongoAbility);

    const rolePermissions = permissions[user.organizationRole.role];

    if (typeof rolePermissions !== 'function') {
      throw new Error(
        `No permissions defined for role: ${user.organizationRole.role}`,
      );
    }

    rolePermissions(user, builder);

    return builder.build({
      detectSubjectType: (item) =>
        typeof item === 'string' ? item : item.__typename,
    });
  }
}

import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { CaslAbilityFactory } from 'src/modules/casl/casl-ability.factory';
import { PolicyHandler } from '../interfaces/policy-handler.interface';
import { CHECK_POLICIES_KEY } from '../decorators/check-policies-from-role.decorator';

@Injectable()
export class PoliciesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private caslAbilityFactory: CaslAbilityFactory,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const handlers =
      this.reflector.get<PolicyHandler[]>(
        CHECK_POLICIES_KEY,
        context.getHandler(),
      ) || [];

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    const ability = this.caslAbilityFactory.createForUser(user);

    const isAllowed = handlers.every((handler) =>
      typeof handler === 'function' ? handler(ability) : false,
    );

    if (!isAllowed) {
      throw new ForbiddenException('Você não pode executar esta ação!');
    }

    return true;
  }
}

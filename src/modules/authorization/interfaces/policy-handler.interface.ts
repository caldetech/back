import { AppAbility } from 'src/modules/casl/types/casl.types';

export type PolicyHandlerCallback = (ability: AppAbility) => boolean;

export interface PolicyHandler {
  (ability: AppAbility): boolean;
}

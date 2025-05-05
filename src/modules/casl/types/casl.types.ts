import { z } from 'zod';
import { createMongoAbility, MongoAbility, CreateAbility } from '@casl/ability';
import { projectSubject } from '../subjects/project';
import { billingSubject } from '../subjects/billing';
import { commissionSubject } from '../subjects/commission';
import { dashboardSubject } from '../subjects/dashboard';
import { paymentSubject } from '../subjects/payment';
import { productSubject } from '../subjects/product';
import { reportSubject } from '../subjects/report';
import { serviceSubject } from '../subjects/service';
import { systemSubject } from '../subjects/system';
import { orderSubject } from '../subjects/order';
import { userSubject } from '../subjects/user';
import { organizationSubject } from '../subjects/organization';
import { inviteSubject } from '../subjects/invite';
import { attachmentSubject } from '../subjects/attachment';
import { blingSubject } from '../subjects/bling';

export const appAbilitiesSchema = z.union([
  projectSubject,
  billingSubject,
  commissionSubject,
  dashboardSubject,
  paymentSubject,
  productSubject,
  reportSubject,
  serviceSubject,
  systemSubject,
  orderSubject,
  userSubject,
  organizationSubject,
  inviteSubject,
  attachmentSubject,
  blingSubject,
  z.tuple([z.literal('manage'), z.literal('all')]),
]);

export type AppAbilities = z.infer<typeof appAbilitiesSchema>;

export type AppAbility = MongoAbility<AppAbilities>;
export const createAppAbility = createMongoAbility as CreateAbility<AppAbility>;

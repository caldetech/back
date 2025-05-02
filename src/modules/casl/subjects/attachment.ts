import { z } from 'zod';

export const attachmentSubject = z.tuple([
  z.union([z.literal('manage'), z.literal('get')]),
  z.literal('Attachment'),
]);

export type AttachmentSubject = z.infer<typeof attachmentSubject>;

import { z } from 'zod';

const amountSchema = z.object({
  amount: z
    .number()
    .min(1, 'Amount must be greater than 0'),
});

const sendMoneyZodSchema = z.object({
  body: z.object({
    amount: z
      .number()
      .min(1, 'Amount must be greater than 0'),
    receiverPhone: z
      .string()
      .min(11, 'Phone number must be 11 digits'),
  }),
});

export const WalletValidation = {
  addMoneyZodSchema: amountSchema,
  withdrawMoneyZodSchema: amountSchema,
  sendMoneyZodSchema,
  cashInZodSchema: sendMoneyZodSchema,
  cashOutZodSchema: sendMoneyZodSchema,
};

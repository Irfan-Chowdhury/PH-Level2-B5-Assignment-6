"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletValidation = void 0;
const zod_1 = require("zod");
const amountSchema = zod_1.z.object({
    amount: zod_1.z
        .number()
        .min(1, 'Amount must be greater than 0'),
});
const sendMoneyZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        amount: zod_1.z
            .number()
            .min(1, 'Amount must be greater than 0'),
        receiverPhone: zod_1.z
            .string()
            .min(11, 'Phone number must be 11 digits'),
    }),
});
exports.WalletValidation = {
    addMoneyZodSchema: amountSchema,
    withdrawMoneyZodSchema: amountSchema,
    sendMoneyZodSchema,
    cashInZodSchema: sendMoneyZodSchema,
    cashOutZodSchema: sendMoneyZodSchema,
};

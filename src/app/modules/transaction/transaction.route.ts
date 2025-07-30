import express from 'express';
// import auth from '../middlewares/auth';
import { getMyTransactions } from './transaction.controller';

const router = express.Router();

router.get('/my-transactions', getMyTransactions);

export const TransactionRoutes = router;

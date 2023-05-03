import { Router } from "express";
import { cancelSubscription, createSubscription, oneTimePayment } from "../controllers/payments.controllers";
const router = Router();

router.post('/onetime', oneTimePayment);

router.post('/subscription', createSubscription);

router.delete('/subscription/cancel/:id', cancelSubscription);


export default router;
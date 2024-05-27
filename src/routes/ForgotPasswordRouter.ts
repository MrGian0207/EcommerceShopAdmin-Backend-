import ForgotPasswordController from '../admin/controllers/Authorization/ForgotPasswordController';
import { Router } from 'express';

const forgotPasswordController = new ForgotPasswordController();
const forgotPasswordRouter = Router();

forgotPasswordRouter.post(
  '/auth/forgot-password',
  forgotPasswordController.forgotPassword,
);

export default forgotPasswordRouter;

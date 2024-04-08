import DashboardController from '../admin/controllers/Dashboard/DashboardController';
import { Router } from 'express';
import authenToken from '../middlewares/authenToken';

const dashboardController = new DashboardController();
const dashboardRouter = Router();

dashboardRouter.get('/dashboard', authenToken, dashboardController.index);

export default dashboardRouter;

import RefreshTokenController from '../admin/controllers/Token/RefreshTokenController';
import { Router } from 'express';

const refreshTokenController = new RefreshTokenController();
const refreshTokenRouter = Router();

refreshTokenRouter.post('/refreshToken', refreshTokenController.refreshToken);

export default refreshTokenRouter;

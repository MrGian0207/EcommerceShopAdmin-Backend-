import RefreshTokenController from '../admin/controllers/RefreshTokenController';
import { Router } from 'express';

const refreshTokenController = new RefreshTokenController();
const refreshTokenRouter = Router();

refreshTokenRouter.post('/refreshToken', refreshTokenController.refreshToken);

export default refreshTokenRouter;

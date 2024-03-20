import { Request, Response } from 'express';
import UserRefreshToken from '../models/UserRefreshTokenModel';
import dotenv from 'dotenv';

dotenv.config();

class LogoutController {
    async logout(req: Request, res: Response) {
        const { refreshToken } = req.body;
        const userRefreshToken = await UserRefreshToken.findOne({
            refreshToken: refreshToken,
        });

        try {
            if (userRefreshToken) {
                await UserRefreshToken.deleteOne({
                    refreshToken: refreshToken,
                });
                res.status(200).json({ status: 'Logout' });
            } else {
                res.status(200).json({
                    status: 'Error',
                    message: 'RefreshToken Not Exitsted',
                });
            }
        } catch (err) {
            res.status(500).json({
                status: 'Error',
                message: 'Internal server error',
            });
        }
    }
}

export default LogoutController;

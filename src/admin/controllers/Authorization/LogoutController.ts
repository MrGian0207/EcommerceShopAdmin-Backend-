import { Request, Response } from 'express';
import UserRefreshToken from '../../models/UserRefreshTokenModel';
import dotenv from 'dotenv';

dotenv.config();

class LogoutController {
    async logout(req: Request, res: Response) {
        const RefreshToken = req.cookies.refreshToken;
        const userRefreshToken = await UserRefreshToken.findOne({
            refreshToken: RefreshToken,
        });
        if (userRefreshToken) {
            await UserRefreshToken.deleteOne({
                refreshToken: RefreshToken,
            });
            res.clearCookie('refreshToken', { httpOnly: true });
            res.status(200).json({ status: 'Logout' });
        } else {
            res.status(200).json({
                status: 'Error',
                message: 'RefreshToken Not Exitsted',
            });
        }
    }
}

export default LogoutController;

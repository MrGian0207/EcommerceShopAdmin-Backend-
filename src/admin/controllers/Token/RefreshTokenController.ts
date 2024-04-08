import { Request, Response } from 'express';
import UserRefreshToken from '../../models/UserRefreshTokenModel';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

class RefreshTokenController {
    async refreshToken(req: Request, res: Response) {
        const RefreshToken = req.cookies.refreshToken;
        const userRefreshToken = await UserRefreshToken.findOne({
            refreshToken: RefreshToken,
        });

        try {
            if (!userRefreshToken) {
                res.status(401).json({
                    status: 'Error',
                    message: 'Refresh token is invalid',
                });
            } else {
                const accessToken = jwt.sign(
                    {
                        id: userRefreshToken.userId,
                    },
                    process.env.ACCESS_TOKEN_SECRET_KEY as string,
                    {
                        expiresIn: '30s',
                    },
                );
                res.status(200).json({
                    status: 'success',
                    message: 'New AccessToken was created successfully',
                    accessToken: accessToken,
                });
            }
        } catch (e) {
            res.status(500).json({
                status: 'Error',
                message: 'Internal server error',
            });
        }
    }
}

export default RefreshTokenController;

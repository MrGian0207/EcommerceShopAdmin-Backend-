import { Request, Response } from 'express';
import UserRefreshToken from '../../models/UserRefreshTokenModel';

class LogoutController {
  async logout(req: Request, res: Response) {
    const RefreshToken = req.cookies.refreshToken;
    console.log(RefreshToken);
    const userRefreshToken = await UserRefreshToken.findOne({
      refreshToken: RefreshToken,
    });
    console.log(userRefreshToken);
    if (userRefreshToken) {
      await UserRefreshToken.deleteOne({
        refreshToken: RefreshToken,
      });
      res.clearCookie('refreshToken', { httpOnly: true });
      res
        .status(200)
        .json({ status: 'Success', message: 'Logout successfully' });
    } else {
      res.status(400).json({
        status: 'Error',
        message: 'RefreshToken Not Exitsted',
      });
    }
  }
}

export default LogoutController;

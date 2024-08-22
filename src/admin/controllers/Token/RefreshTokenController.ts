import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'

import UserModel from '../../models/UserModel'
import UserRefreshToken from '../../models/UserRefreshTokenModel'

class RefreshTokenController {
  async refreshToken(req: Request, res: Response) {
    const RefreshToken = req.cookies.refreshToken
    const userRefreshToken = await UserRefreshToken.findOne({
      refreshToken: RefreshToken,
    })

    const userRole = await UserModel.findById(userRefreshToken?.userId).select('role').exec()

    try {
      if (!userRefreshToken) {
        res.status(401).json({
          status: 'Error',
          message: 'Refresh token is invalid',
        })
      } else {
        const accessToken = jwt.sign(
          {
            id: userRefreshToken.userId,
            role: userRole ? userRole : '',
          },
          process.env.ACCESS_TOKEN_SECRET_KEY as string,
          {
            expiresIn: '2592000s',
          }
        )
        res.status(200).json({
          status: 'success',
          message: 'New AccessToken was created successfully',
          accessToken: accessToken,
        })
      }
    } catch (e) {
      res.status(500).json({
        status: 'Error',
        message: 'Internal server error',
      })
    }
  }
}

export default RefreshTokenController

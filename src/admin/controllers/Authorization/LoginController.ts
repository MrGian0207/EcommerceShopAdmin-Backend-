import bcrypt from 'bcrypt'
import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'

import UserModel from '../../models/UserModel'
import UserRefreshTokenModel from '../../models/UserRefreshTokenModel'

class LoginController {
  async login(req: Request, res: Response) {
    let { email, password } = req.body
    email = email.trim()
    password = password.trim()

    //JsonWebToken
    const accessToken = jwt.sign(
      { email, password },
      process.env.ACCESS_TOKEN_SECRET_KEY as string,
      {
        expiresIn: '2592000s',
      }
    )

    const refreshToken = jwt.sign(
      { email, password },
      process.env.REFRESH_TOKEN_SECRET_KEY as string
    )

    const currentDate = new Date()
    currentDate.setDate(currentDate.getDate() + 365)

    const existed_User = await UserModel.findOne({
      email,
    })

    if (existed_User) {
      // Kiểm tra password chỉ khi existed_User tồn tại
      const ValidatePassword: boolean = bcrypt.compareSync(password, existed_User.password!)

      if (ValidatePassword) {
        const newUserRefreshToken = new UserRefreshTokenModel({
          userId: existed_User.id,
          refreshToken: refreshToken,
          createdAt: Date.now(),
        })

        await newUserRefreshToken.save()

        res.cookie('refreshToken', refreshToken, {
          httpOnly: true,
          secure: true,
          path: '/',
          sameSite: 'none',
          expires: currentDate,
        })

        res.status(200).json({
          message: 'Login successful',
          accessToken,
          idUser: existed_User._id,
        })
      } else {
        res.status(406).json({ message: 'Password is incorrect' })
      }
    } else {
      res.status(406).json({
        message: 'Email has not already been registered',
      })
    }
  }

  index(req: Request, res: Response) {
    res.status(200).json({
      status: 'Success',
    })
  }
}

export default LoginController

import { Request, Response } from 'express';
import UserModel from '../../models/UserModel';
import UserRefreshTokenModel from '../../models/UserRefreshTokenModel';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const User = {
  Success: {
    status: 'Success',
    message: 'Login successful',
  },
  Error: {
    Email_isNotRegisterd: {
      status: 'Error Email',
      message: 'Email has not already been registered',
    },
    Password_Incorrect: {
      status: 'Error Password',
      message: 'Password is incorrect',
    },
  },
};

class LoginController {
  async login(req: Request, res: Response) {
    const { emailAddress, password } = req.body;
    const data = req.body;

    //JsonWebToken
    const accessToken = jwt.sign(
      data,
      process.env.ACCESS_TOKEN_SECRET_KEY as string,
      {
        expiresIn: '2592000s',
      },
    );
    
    const refreshToken = jwt.sign(
      data,
      process.env.REFRESH_TOKEN_SECRET_KEY as string,
    );

    //Clear whitespace
    const Email = emailAddress ? emailAddress.trim() : '';
    const Password = password ? password?.trim() : '';

    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() + 365);

    const existed_User = await UserModel.findOne({
      emailAddress: Email,
    });

    if (existed_User) {
      // Kiểm tra password chỉ khi existed_User tồn tại
      const ValidatePassword: boolean = await bcrypt.compareSync(
        Password,
        existed_User.password!,
      );

      if (ValidatePassword) {
        const newUserRefreshToken = new UserRefreshTokenModel({
          userId: existed_User.id,
          refreshToken: refreshToken,
          createdAt: Date.now(),
        });

        await newUserRefreshToken.save();

        res.cookie('refreshToken', refreshToken, {
          httpOnly: true,
          secure: false,
          path: '/',
          sameSite: 'strict',
          expires: currentDate,
        });

        res.status(200).json({
          response: User.Success,
          accessToken,
          idUser: existed_User._id,
        });
      } else {
        res.status(406).json(User.Error.Password_Incorrect);
      }
    } else {
      res.status(406).json(User.Error.Email_isNotRegisterd);
    }
  }

  index(req: Request, res: Response) {
    const RefreshToken = req.cookies.refreshToken;
    res.send(RefreshToken);
  }
}

export default LoginController;

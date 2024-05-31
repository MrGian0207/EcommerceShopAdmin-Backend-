import { Request, Response, NextFunction } from 'express';
import UserModel from '../../models/UserModel';
import bcrypt from 'bcrypt';
import sendEmail from '../../../services/email';
import { User } from '../../../types/UserType';

const saltRounds = 10;
function generateRandomString(length: number = 12) {
   const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
   let randomString = '';
   for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      randomString += characters[randomIndex];
   }
   return randomString;
}

class ForgotPasswordController {
   async forgotPassword(req: Request, res: Response, next: NextFunction) {
      const { email } = req.body;
      const newPassword = generateRandomString();
      const hashPassword = await bcrypt.hash(newPassword, saltRounds);

      const user: User = (await UserModel.findOneAndUpdate(
         { emailAddress: email },
         { $set: { password: hashPassword } },
      )) as User;

      if (user) {
         sendEmail(res, next, `${email}`, 'Reset Password', 'anotherMessage', {
            accessCode: `${newPassword}`,
         });
         res.status(200).json({
            status: 'Success',
            message:
               'New password has been sent to your email address! Please check your password',
         });
      } else {
         res.status(404).json({
            status: 'Error',
            message: 'Email not found',
         });
      }
   }
}

export default ForgotPasswordController;

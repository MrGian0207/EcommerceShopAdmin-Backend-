import bcrypt from 'bcrypt'
import { NextFunction, Request, Response } from 'express'

import sendEmail from '../../../services/email'
import UserModel from '../../models/UserModel'

const saltRounds = 10
function generateRandomString(length: number = 12) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let randomString = ''
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length)
    randomString += characters[randomIndex]
  }
  return randomString
}

class ForgotPasswordController {
  async forgotPassword(req: Request, res: Response, next: NextFunction) {
    const { email } = req.body
    console.log(email)
    const newPassword = generateRandomString()
    const hashPassword = await bcrypt.hash(newPassword, saltRounds)

    await UserModel.findOneAndUpdate({ email: email }, { $set: { password: hashPassword } }).then(
      async (user) => {
        if (user) {
          await sendEmail(res, next, `${email}`, 'Reset Password', 'anotherMessage', {
            accessCode: `${newPassword}`,
          })
          res.status(200).json({
            message: 'New password has been sent to your email address! Please check your password',
          })
        } else {
          res.status(404).json({
            message: 'Email not found',
          })
        }
      }
    )
  }
}

export default ForgotPasswordController

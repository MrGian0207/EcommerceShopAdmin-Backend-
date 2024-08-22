import bcrypt from 'bcrypt'
import { Request, Response } from 'express'

import UserModel from '../../models/UserModel'

class RegisterController {
  async store(req: Request, res: Response) {
    const saltRounds = 10
    let { name, gender, email, phone, password } = req.body

    name = name.trim()
    gender = gender.trim()
    email = email.trim()
    phone = phone.trim()
    password = password.trim()

    // Bcrypt password
    const hashPassword = bcrypt.hashSync(password, saltRounds)
    await UserModel.findOne({
      $or: [{ emailAddress: email }, { phoneNumber: phone }],
    })
      .then((existed_User) => {
        if (!existed_User) {
          const newUser = new UserModel({
            name,
            gender,
            phone,
            email,
            statusUser: 'Not-verified',
            role: 'Staff',
            password: hashPassword,
          })

          newUser
            .save()
            .then(() => res.status(200).json({ message: 'Registration successful' }))
            .catch((err) => {
              console.log(err)
              return res.status(400).json({ message: 'Registration failed' })
            })
        }
      })
      .catch((_) =>
        res.status(500).json({
          message: 'User not found',
        })
      )
  }
}

export default RegisterController

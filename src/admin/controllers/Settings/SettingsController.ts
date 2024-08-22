import bcrypt from 'bcrypt'
import { Request, Response } from 'express'

import { User } from '../../../types/UserType'
import UserModel from '../../models/UserModel'

const saltRounds = 10

class SettingsController {
  async getUser(req: Request, res: Response) {
    try {
      const page: string = (req.query?.page as string) ? (req.query?.page as string) : '1'
      const brandsPerPage: number = 10
      let numberOfUsers: number = 0
      await UserModel.countDocuments({}).then((countDocuments) => {
        numberOfUsers = Math.ceil(countDocuments / brandsPerPage)
      })
      await UserModel.find()
        .skip((parseInt(page) - 1) * brandsPerPage)
        .limit(brandsPerPage)
        .then((users) => {
          return res.status(200).json({ data: users, numbers: numberOfUsers })
        })
    } catch (error) {
      return res.status(500).json({
        status: 'Error',
        message: 'Could not find User',
      })
    }
  }

  async addUserWithRole(req: Request, res: Response) {
    const { name, gender, email, phone, password, role } = req.body
    try {
      const hashPassword = bcrypt.hashSync(password, saltRounds)
      await UserModel.findOne({ email }).then(async (user) => {
        if (user?.role) {
          user.role = role
          await user.save().then(() => {
            return res.status(200).json({
              status: 'Success',
              message: 'User updated successfully',
            })
          })
        }

        if (!user) {
          const newUser = new UserModel({
            name,
            gender,
            phone,
            email,
            statusUser: 'Not-verified',
            role: role,
            password: hashPassword,
          })
          await newUser.save().then(() => {
            return res.status(200).json({
              status: 'Success',
              message: 'User added successfully',
            })
          })
        }
      })
    } catch (err) {
      return res.status(500).json({
        status: 'Error',
        message: 'Could not add User',
      })
    }
  }

  async changePassword(req: Request, res: Response) {
    try {
      const { oldPassword, newPassword, id } = req.body

      await UserModel.findOne({ _id: id }).then(async (user) => {
        if (user) {
          const ValidatePassword: boolean = bcrypt.compareSync(oldPassword, user.password)

          if (ValidatePassword) {
            const hashPassword = bcrypt.hashSync(String(newPassword).trim(), saltRounds)

            await UserModel.findOneAndUpdate(
              { _id: id },
              {
                password: hashPassword,
              }
            ).then((user) => {
              if (!user) {
                return res.status(404).json({
                  status: 'Error',
                  message: 'User not updated',
                })
              }
              return res.status(200).json({
                status: 'Success',
                message: 'Password changed successfully',
              })
            })
          } else {
            return res.status(401).json({
              status: 'Error',
              message: 'Old password is incorrect',
            })
          }
        }

        if (!user) {
          return res.status(404).json({
            status: 'Error',
            message: 'User not found',
          })
        }
      })
    } catch (error) {
      return res.status(500).json({
        status: 'Error',
        message: 'Internal server error',
      })
    }
  }
}

export default SettingsController

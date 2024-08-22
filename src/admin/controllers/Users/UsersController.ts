import { Request, Response } from 'express'

import cloudinary from '../../../utils/cloudinary'
import UserModel from '../../models/UserModel'

class UsersController {
  async getAll(req: Request, res: Response) {
    try {
      const page: string = (req.query?.page as string) ? (req.query?.page as string) : '1'
      const brandsPerPage: number = 10
      const search: string = req.query?.search as string
      let numberOfUsers: number = 0
      await UserModel.countDocuments({}).then((countDocuments) => {
        numberOfUsers = Math.ceil(countDocuments / brandsPerPage)
      })
      await UserModel.find({
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { emailAddress: { $regex: search, $options: 'i' } },
          { phone: { $regex: search, $options: 'i' } },
        ],
      })
        .skip((parseInt(page) - 1) * brandsPerPage)
        .limit(brandsPerPage)
        .then((users) => {
          return res.status(200).json({ data: users, numbers: numberOfUsers })
        })
    } catch (error) {
      console.log(error)
      return res.status(404).json({
        status: 'Error',
        message: 'Users have not been found',
      })
    }
  }

  async getOne(req: Request, res: Response) {
    try {
      const id = req.params.id
      UserModel.findOne({ _id: id })
        .then((user) => {
          res.status(200).json(user)
        })
        .catch((error) => {
          res.status(404).json({
            status: 'Error',
            message: error.message,
          })
        })
    } catch (error) {
      console.log(error)
      res.status(404).json({
        status: 'Error',
        message: 'User have not been found',
      })
    }
  }

  async update(req: Request, res: Response) {
    try {
      const { id } = req.params
      const { name, email, phone, gender, about } = req.body
      const image = req.file

      console.log({ id, ...req.body, image })
      // res.status(200).json({ message: 'ok' });
      await UserModel.findById(id).then(async (user) => {
        if (image) {
          await cloudinary.uploader
            .upload(image.path, {
              folder: 'users',
            })
            .then(async (imageUrl) => {
              if (user) {
                user.name = name
                user.email = email
                user.phone = phone
                user.gender = gender
                user.about = about
                user.image = imageUrl?.secure_url
                await user.save().then(() => {
                  return res.status(200).json({
                    status: 'Success',
                    message: 'User have been updated successfully !!!',
                  })
                })
              }
            })
            .catch((error) => {
              return res.status(404).json({
                status: 'Error',
                message: 'User have not been updated',
              })
            })
        } else {
          if (user) {
            user.name = name
            user.email = email
            user.phone = phone
            user.gender = gender
            user.about = about
            await user.save().then(() => {
              return res.status(200).json({
                status: 'Success',
                message: 'User have been updated successfully !!!',
              })
            })
          }
        }
      })
    } catch (error) {
      return res.status(404).json({
        status: 'Error',
        message: 'User have not been updated',
      })
    }
  }
}

export default UsersController

import { Request, Response } from 'express'

import NewletterModel from '../../models/NewletterModel'

class NewletterController {
  async store(req: Request, res: Response) {
    try {
      const { email } = req.body

      const newletter = new NewletterModel({
        emailNewletter: email,
      })

      await newletter.save()
      return res.status(200).json({
        status: 'Success',
        data: newletter,
      })
    } catch (error) {
      console.log(error)
      return res.status(500).json({
        status: 'Error',
        message: 'Error Creating Newletter',
      })
    }
  }

  async getAll(req: Request, res: Response) {
    try {
      const page: string = (req.query?.page as string) ? (req.query?.page as string) : '1'
      const search: string = req.query?.search as string
      const brandsPerPage: number = 10
      let numberOfNewletters: number = 0
      await NewletterModel.countDocuments({}).then((countDocuments) => {
        numberOfNewletters = Math.ceil(countDocuments / brandsPerPage)
      })
      const newletters = await NewletterModel.find({
        email: {
          $regex: search,
          $options: 'i',
        },
      })
        .skip((parseInt(page) - 1) * brandsPerPage)
        .limit(brandsPerPage)

      console.log(newletters)
      if (newletters) {
        return res.status(200).json({ data: newletters, numbers: numberOfNewletters })
      }
    } catch (error) {
      console.log(error)
      res.status(500).json({
        status: 'Error',
        message: 'Error Get Newletters',
      })
    }
  }
}

export default NewletterController

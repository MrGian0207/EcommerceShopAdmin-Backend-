import { Request, Response } from 'express';
import NewletterModel from '../../models/NewletterModel';

class NewletterController {
  async store(req: Request, res: Response) {
    try {
      const { email } = req.body;

      const newletter = new NewletterModel({
        emailNewletter: email,
      });

      await newletter.save();
      return res.status(200).json({
        status: 'Success',
        data: newletter,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        status: 'Error',
        message: 'Error Creating Newletter',
      });
    }
  }

  async getAll(req: Request, res: Response) {
    try {
      const newletters = await NewletterModel.find();
      if (newletters) {
        return res.status(200).json({
          status: 'Success',
          data: newletters,
        });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({
        status: 'Error',
        message: 'Error Get Newletters',
      });
    }
  }
}

export default NewletterController;

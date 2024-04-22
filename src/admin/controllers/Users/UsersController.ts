import { Request, Response } from 'express';
import UserModel from '../../models/UserModel';

class UsersController {
  async getAll(req: Request, res: Response) {
    try {
      const users = await UserModel.find();
      return res.status(200).json({
        status: 'Success',
        data: users,
      });
    } catch (error) {
      console.log(error);
      return res.status(404).json({
        status: 'Error',
        message: 'Users have not been found',
      });
    }
  }

  async getOne(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const user = await UserModel.findOne({ _id: id });
      if (user) {
        res.status(200).json({
          status: 'Success',
          data: user,
        });
      }
    } catch (error) {
      console.log(error);
      res.status(404).json({
        status: 'Error',
        message: 'User have not been found',
      });
    }
  }
}

export default UsersController;

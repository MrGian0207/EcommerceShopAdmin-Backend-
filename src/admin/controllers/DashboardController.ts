import { Request, Response } from 'express';
// import UserModel from '../models/UserModel';

class DashboardController {
    async index(req: Request, res: Response) {
        res.status(200).json({ status: 'Authortication', message: 'Nice!' });
    }
}

export default DashboardController;

import { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();

const authenToken = (req: Request, res: Response, next: NextFunction) => {
    const authorizationHeader = req.headers['authorization'];

    const token = (authorizationHeader as string).split(' ')[1];
    if (!token) res.sendStatus(401).json({ status: 'Error Token' });

    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET_KEY as string,
        (err, data) => {
            console.log(err, data);
            if (err) res.sendStatus(403).json({ status: 'Error Token' });
            next();
        },
    );
};

export default authenToken;

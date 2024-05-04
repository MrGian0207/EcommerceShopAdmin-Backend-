import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const authenToken = (req: Request, res: Response, next: NextFunction) => {
  const authorizationHeader = req.headers['authorization'];

  const token = (authorizationHeader as string).split(' ')[1];
  if (!token) res.status(401).json({ status: 'Error Token' });

  jwt.verify(
    token,
    process.env.ACCESS_TOKEN_SECRET_KEY as string,
    (err, data) => {
      if (err) {
        res.status(403).json({ status: 'Error' });
      } else {
        next();
      }
    },
  );
};

export default authenToken;

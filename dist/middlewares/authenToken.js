"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
dotenv_1.default.config();
const authenToken = (req, res, next) => {
    const authorizationHeader = req.headers['authorization'];
    const token = authorizationHeader.split(' ')[1];
    if (!token)
        res.sendStatus(401).json({ status: 'Error Token' });
    jsonwebtoken_1.default.verify(token, process.env.ACCESS_TOKEN_SECRET_KEY, (err, data) => {
        console.log(err, data);
        if (err)
            res.sendStatus(403).json({ status: 'Error Token' });
        next();
    });
};
exports.default = authenToken;

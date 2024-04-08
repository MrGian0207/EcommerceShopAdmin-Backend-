import { Request, Response } from 'express';
import UserModel from '../../models/UserModel';
import bcrypt from 'bcrypt';

const saltRounds = 10;
const User = {
    Success: {
        status: 'OK',
        message: 'Registration successful',
    },
    Error: {
        isNotEmail: {
            status: 'Error Email',
            message: 'Email is not valid',
        },
        hasEmail_Existed: {
            status: 'Error Email',
            message: 'Email has already been registered',
        },
        password_notEnoughLength: {
            status: 'Error Password',
            message: 'Password is too short',
        },
        hasPhoneNumber_Existed: {
            status: 'Error Phone Number',
            message: 'Phone Number has already been registered',
        },
    },
};

class RegisterController {
    async store(req: Request, res: Response) {
        const { fullName, gender, emailAddress, phoneNumber, password } =
            req.body;

        // Clear whitespace
        const FullName = fullName.trim();
        const Email = emailAddress.trim();
        const Password = password.trim();

        // Bcrypt password
        const hashPassword = bcrypt.hashSync(Password, saltRounds);

        // Check if it's already email address
        const validateEmail = (emailAddress: string) => {
            return emailAddress.match(
                /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            );
        };

        // Authentication
        if (!validateEmail(Email)) {
            res.status(406).json(User.Error.isNotEmail);
        } else if (Password.length < 8) {
            res.status(406).json(User.Error.password_notEnoughLength);
        } else {
            // Authortication
            // Email has already been registered
            const existed_Email = await UserModel.findOne({
                emailAddress: Email,
            });

            // Phone Number has already been registered
            const existed_PhoneNumber = await UserModel.findOne({
                phoneNumber: phoneNumber,
            });

            if (existed_Email) {
                res.status(406).json(User.Error.hasEmail_Existed);
            } else if (existed_PhoneNumber) {
                res.status(406).json(User.Error.hasPhoneNumber_Existed);
            } else {
                const newUser = new UserModel({
                    fullName: FullName,
                    gender,
                    phoneNumber,
                    emailAddress: Email,
                    password: hashPassword,
                });

                await newUser
                    .save()
                    .then(() => res.status(200).json(User.Success))
                    .catch((err) => console.log(err));
            }
        }
    }
}

export default RegisterController;

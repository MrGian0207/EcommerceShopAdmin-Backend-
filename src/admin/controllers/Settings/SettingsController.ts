import { Request, Response } from 'express';
import UserModel from '../../models/UserModel';
import bcrypt from 'bcrypt';

const saltRounds = 10;

interface User {
  fullName?: string;
  gender?: string;
  phoneNumber?: number;
  emailAddress?: string;
  password?: string;
  status?: string;
  role?: string;
  about?: string;
  image?: string;
}

class SettingsController {
  async getUser(req: Request, res: Response) {
    try {
      const page: string = (req.query?.page as string)
        ? (req.query?.page as string)
        : '1';
      const brandsPerPage: number = 10;
      let numberOfUsers: number = 0;
      await UserModel.countDocuments({}).then((countDocuments) => {
        numberOfUsers = Math.ceil(countDocuments / brandsPerPage);
      });
      const user = await UserModel.find()
        .skip((parseInt(page) - 1) * brandsPerPage)
        .limit(brandsPerPage);
      return res.status(200).json({
        status: 'Success',
        data: user,
        numbers: numberOfUsers,
      });
    } catch (error) {
      return res.status(500).json({
        status: 'Error',
        message: 'Could not find User',
      });
    }
  }

  async addUserWithRole(req: Request, res: Response) {
    try {
      const { fullName, gender, emailAddress, phoneNumber, password, role } =
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
        res.status(406).json({
          status: 'Error',
          message: 'Email is not valid',
        });
      } else if (Password && Password.length < 8) {
        res.status(406).json({
          status: 'Error',
          message: 'Password must be at least 8 characters',
        });
      } else {
        // Authortication
        // Email has already been registered
        const existed_Email = await UserModel.findOne({
          emailAddress: Email,
        });

        // Phone Number has already been registered
        const existed_PhoneNumber = await UserModel.findOne({
          phoneNumber: phoneNumber ? phoneNumber : '0',
        });

        if (existed_Email) {
          if (role) {
            const user = (await UserModel.findOneAndUpdate(
              { emailAddress },
              {
                role: role,
              },
            )) as User;

            if (user) {
              return res.status(200).json({
                status: 'Success',
                message: 'Role Updated successfully',
              });
            } else {
              return res.status(404).json({
                status: 'Error',
                message: 'User not found',
              });
            }
          } else {
            res.status(406).json({
              status: 'Error',
              message: 'No role Updated',
            });
          }
        } else if (existed_PhoneNumber) {
          res.status(406).json({
            status: 'Error',
            message: 'Phone Number has already been registered',
          });
        } else {
          const newUser = new UserModel({
            fullName: FullName,
            gender,
            phoneNumber,
            emailAddress: Email,
            status: 'Not-verified',
            role: role,
            password: hashPassword,
          });

          await newUser
            .save()
            .then(() =>
              res.status(200).json({
                status: 'Success',
                message: 'User have been added successfully !!!',
              }),
            )
            .catch((err) => console.log(err));
        }
      }
    } catch (error) {}
  }

  async changePassword(req: Request, res: Response) {
    try {
      const { oldPassword, newPassword, confirmNewPassword, id } = req.body;

      // Clear whitespace
      const OldPassword = oldPassword?.trim();
      const NewPassword = newPassword?.trim();
      const ConfirmNewPassword = confirmNewPassword?.trim();
      console.log(req.body);
      console.log({ OldPassword, NewPassword, ConfirmNewPassword });

      if (!oldPassword || !newPassword || !confirmNewPassword) {
        return res.status(400).json({
          status: 'Error',
          message: 'Missing required fields',
        });
      }

      const user = (await UserModel.findOne({ _id: id })) as User;
      console.log(user);
      const ValidatePassword: boolean = await bcrypt.compareSync(
        OldPassword,
        user.password as string,
      );

      if (ValidatePassword) {
        if (NewPassword === ConfirmNewPassword) {
          const hashPassword = bcrypt.hashSync(NewPassword, saltRounds);
          const user = await UserModel.findOneAndUpdate(
            { _id: id },
            {
              password: hashPassword,
            },
          );
          if (user) {
            return res.status(200).json({
              status: 'Success',
              message: 'Password changed successfully',
            });
          } else {
            return res.status(404).json({
              status: 'Error',
              message: 'User not updated',
            });
          }
        } else {
          return res.status(400).json({
            status: 'Error',
            message: 'New password and confirm new password do not match',
          });
        }
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        status: 'Error',
        message: 'Internal server error',
      });
    }
  }
}

export default SettingsController;

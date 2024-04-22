"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const UserModel_1 = __importDefault(require("../../models/UserModel"));
class UsersController {
    getAll(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const users = yield UserModel_1.default.find();
                return res.status(200).json({
                    status: 'Success',
                    data: users,
                });
            }
            catch (error) {
                console.log(error);
                return res.status(404).json({
                    status: 'Error',
                    message: 'Users have not been found',
                });
            }
        });
    }
    getOne(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.params.id;
                const user = yield UserModel_1.default.findOne({ _id: id });
                if (user) {
                    res.status(200).json({
                        status: 'Success',
                        data: user,
                    });
                }
            }
            catch (error) {
                console.log(error);
                res.status(404).json({
                    status: 'Error',
                    message: 'User have not been found',
                });
            }
        });
    }
}
exports.default = UsersController;

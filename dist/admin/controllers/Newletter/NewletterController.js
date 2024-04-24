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
const NewletterModel_1 = __importDefault(require("../../models/NewletterModel"));
class NewletterController {
    store(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email } = req.body;
                const newletter = new NewletterModel_1.default({
                    emailNewletter: email,
                });
                yield newletter.save();
                return res.status(200).json({
                    status: 'Success',
                    data: newletter,
                });
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({
                    status: 'Error',
                    message: 'Error Creating Newletter',
                });
            }
        });
    }
    getAll(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newletters = yield NewletterModel_1.default.find();
                if (newletters) {
                    return res.status(200).json({
                        status: 'Success',
                        data: newletters,
                    });
                }
            }
            catch (error) {
                console.log(error);
                res.status(500).json({
                    status: 'Error',
                    message: 'Error Get Newletters',
                });
            }
        });
    }
}
exports.default = NewletterController;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
function ConnectMongoDB() {
    mongoose_1.default
        .connect(process.env.MONGODB_URL)
        .then(() => {
        console.log('Connected to MongoDB successfully');
    })
        .catch((e) => {
        console.log(e);
        console.log('Failed to connect to MongoDB');
    });
}
exports.default = ConnectMongoDB;

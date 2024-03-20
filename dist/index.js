"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const method_override_1 = __importDefault(require("method-override"));
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const index_1 = __importDefault(require("./routes/index"));
const connectionDB_1 = __importDefault(require("./config/connectionDB"));
const app = (0, express_1.default)();
//Connect to MongoDB
(0, connectionDB_1.default)();
app.use((0, cors_1.default)());
//When be submitted by form
app.use(express_1.default.urlencoded({ extended: true }));
//for fetch, Https, exios when submitted
app.use(express_1.default.json());
//methodOverride
app.use((0, method_override_1.default)('_method'));
(0, connectionDB_1.default)();
(0, index_1.default)(app);
app.listen(8000, () => {
    console.log('Example app listening on port 8000!');
});

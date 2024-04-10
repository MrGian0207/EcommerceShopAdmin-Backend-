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
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const app = (0, express_1.default)();
//Connect to MongoDB
(0, connectionDB_1.default)();
app.use((0, cors_1.default)({ credentials: true, origin: 'http://localhost:3000' }));
app.use((0, cookie_parser_1.default)());
//When be submitted by form
app.use(express_1.default.urlencoded({ extended: false }));
//for fetch, Https, exios when submitted
app.use(express_1.default.json({ limit: '50mb' }));
//methodOverride
app.use((0, method_override_1.default)());
(0, connectionDB_1.default)();
(0, index_1.default)(app);
app.listen(8000, () => {
    console.log('Example app listening on port 8000!');
});

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const PORT = process.env.PORT || 8080;
function default_1(app) {
    mongoose_1.default.connect(process.env.MONGODB_URI || "mongodb://localhost/karenwebapp-database");
    const server = app.listen(PORT, () => {
        console.log("Server is on PORT: ", PORT);
    });
    return server;
}
exports.default = default_1;

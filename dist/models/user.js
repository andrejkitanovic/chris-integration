"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
    name: {
        type: String,
    },
    email: {
        type: String,
        required: true,
    },
    clientId: {
        type: String,
        required: true,
    },
    refreshToken: {
        type: String,
        required: true,
    },
}, { timestamps: true });
const objectModel = (0, mongoose_1.model)('User', userSchema);
exports.default = objectModel;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const headers = (req, res, next) => {
    req.headers.origin = req.headers.origin || req.headers.host;
    next();
};
exports.default = headers;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const defineRoutes_1 = __importDefault(require("helpers/defineRoutes"));
const views_1 = require("controllers/views");
const router = (0, express_1.Router)();
(0, defineRoutes_1.default)(router, [
    {
        method: 'get',
        route: '/',
        controller: views_1.getHomepage,
    },
]);
exports.default = router;

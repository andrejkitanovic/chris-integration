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
Object.defineProperty(exports, "__esModule", { value: true });
const writeInFile_1 = require("helpers/writeInFile");
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const error = (err, req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    yield (0, writeInFile_1.writeInFile)({ path: 'logs/error.log', context: JSON.stringify(err) });
    const status = err.statusCode || 500;
    if ((_a = err === null || err === void 0 ? void 0 : err.response) === null || _a === void 0 ? void 0 : _a.data) {
        res.status(status).json(err.response.data);
    }
    else {
        const { message, data } = err;
        res.status(status).json({ message, data });
    }
});
exports.default = error;

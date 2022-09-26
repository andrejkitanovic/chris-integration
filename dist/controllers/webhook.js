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
exports.postWebhookLog = void 0;
const writeInFile_1 = require("helpers/writeInFile");
const postWebhookLog = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, writeInFile_1.writeInFile)({ path: 'logs/request.log', context: JSON.stringify(req.body) });
        res.json({
            message: 'Logged',
        });
    }
    catch (err) {
        next(err);
    }
});
exports.postWebhookLog = postWebhookLog;

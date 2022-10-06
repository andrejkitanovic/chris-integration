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
exports.writeInFile = void 0;
const fs_1 = __importDefault(require("fs"));
const dayjs_1 = __importDefault(require("dayjs"));
const writeInFile = ({ path, context, req }) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { method, baseUrl } = req;
        if (!context)
            return;
        let parsedContext = '****************\n';
        parsedContext += `[${method}] ${baseUrl}\n`;
        parsedContext += `[${(0, dayjs_1.default)().format('HH:mm:ss DD/MM/YYYY')}]\n`;
        parsedContext += JSON.stringify(context) + '\n';
        parsedContext += '****************\n';
        fs_1.default.appendFile(path, parsedContext, (err) => {
            if (err) {
                console.error(err);
                return;
            }
        });
    }
    catch (err) {
        console.log(err);
    }
});
exports.writeInFile = writeInFile;

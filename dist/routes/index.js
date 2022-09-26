"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const require_dir_1 = __importDefault(require("require-dir"));
const dir = (0, require_dir_1.default)(__dirname);
function default_1(app) {
    Object.keys(dir).forEach((camelCaseName) => {
        const name = camelCaseName
            .split(/(?=[A-Z])/)
            .join('-')
            .toLowerCase();
        if (name !== 'views') {
            app.use(`/api/${name}`, dir[camelCaseName].default);
        }
        else {
            app.use('', dir[camelCaseName].default);
        }
    });
}
exports.default = default_1;

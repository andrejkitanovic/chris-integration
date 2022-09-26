"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const PORT = process.env.PORT || 8080;
function default_1(app) {
    const server = app.listen(PORT, () => {
        console.log('Server is on PORT: ', PORT);
    });
    return server;
}
exports.default = default_1;

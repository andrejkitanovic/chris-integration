"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// import mongoose from "mongoose";
const PORT = process.env.PORT || 8080;
function default_1(app) {
    // mongoose.connect(
    //   process.env.MONGODB_URI || "mongodb://localhost/karenwebapp-database"
    // );
    const server = app.listen(PORT, () => {
        console.log("Server is on PORT: ", PORT);
    });
    return server;
}
exports.default = default_1;

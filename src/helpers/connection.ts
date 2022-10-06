import { Express } from "express";
// import mongoose from "mongoose";

const PORT: number | string = process.env.PORT || 8080;

export default function (app: Express) {
  // mongoose.connect(
  //   process.env.MONGODB_URI || "mongodb://localhost/karenwebapp-database"
  // );

  const server = app.listen(PORT, () => {
    console.log("Server is on PORT: ", PORT);
  });

  return server;
}

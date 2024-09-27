import mongoose from "mongoose";

const DB_URL = process.env.DB_URL!;

export const connect = () => {
    mongoose.connect(DB_URL)
    .then(res => console.log("Connected to db"))
    .catch(err => console.log("Error connecting to db: ", err));
}
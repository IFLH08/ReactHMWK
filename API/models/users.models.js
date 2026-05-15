import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    name:String,
    username: {type: String, unique: true},
    password: String,
    salt: String
    
 }, {timestamps: true})

export default mongoose.model("User", userSchema)

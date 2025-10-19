import mongoose from "mongoose";


const UserSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true,
            minlength: 6,
        },
    

    }
);

const Adminmodel =  mongoose.model("Admin", UserSchema);

export default Adminmodel;
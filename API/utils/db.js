import mongoose from 'mongoose';

export const connectDB = async ()=> {
    try {
        await mongoose.connect(process.env.URI);
        console.log("DB Connected")
    } catch (error) {
        console.error(error);
        throw error
    }
}

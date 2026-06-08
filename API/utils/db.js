import mongoose from 'mongoose';

export const connectDB = async ()=> {
    try {
        if (!process.env.URI) {
            throw new Error('URI no esta configurado en variables de entorno')
        }

        await mongoose.connect(process.env.URI);
        console.log("DB Connected")
    } catch (error) {
        console.error(error);
        throw error
    }
}

import mongoose from 'mongoose';


//connect to the MongoDB database
const connectDB = async () => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URL}/LMS`);
        console.log('Connect successfully!!!');
    } catch (error) {
        console.log('Connect failure!!!')
    }
}

export default connectDB;
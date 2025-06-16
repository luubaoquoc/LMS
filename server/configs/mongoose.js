import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URl}/LMS`);
        console.log('Connect successfully!!!');
    } catch (error) {
        console.log('Connect failure!!!')
    }
}

export default connectDB;
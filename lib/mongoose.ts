import mongoose from 'mongoose';

let isConnected = false;

export const connectToDB = async () => {
   mongoose.set('strict', true);

   if (!process.env.MONGODB_URL) {
      console.log('MONGODB_URL not found');
      return;
   }

   if (isConnected) {
      console.log("Already connected to DB");
      return;
   }

   try {
      await mongoose.connect(process.env.MONGODB_URL);
      isConnected = true;
      console.log("Connected to MongoDB");
   } catch (error) {
      console.error(error);
   }
};

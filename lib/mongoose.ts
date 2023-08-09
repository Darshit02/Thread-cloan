import mongoose from 'mongoose'

let isConnected = false;

export const connectToDB = async () => {
   mongoose.set('strictQuery' , true)

   if(!process.env.MONGODB_URL) return console.log('MONGODV_URL not found');
   if(isConnected) return console.log("Alredy connected to DB");
   try {
    await mongoose.connect(process.env.MONGODB_URL)
    isConnected = true 
    console.log("connected to mongodb");
   } catch (error) {
    console.log(error);
   }
}
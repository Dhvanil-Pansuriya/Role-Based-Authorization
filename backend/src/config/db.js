import { connect } from "mongoose";


const connectDB = async () => {
  try {
    const conn = await connect(process.env.MONGODB_CONNECTION_STRING);
    console.log("| - MongoDB connected");
    console.log("| - Connection Host :", conn.connection.host);
    console.log("| - Collection Name :", conn.connection.name);
    console.log("---------------------------------------------------------------");

  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

export default connectDB;
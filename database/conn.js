import mongoose from "mongoose";
import dotenv from "dotenv"

dotenv.config({ path: "./config.env" })

let conn =async () =>{
    try{

        await mongoose.connect(process.env.DATABASE_STRING)

        console.log("connection with database was successfull !")

    }catch(err){
        console.log("error while connecting to database ! :- ",err)
    }
}

conn()
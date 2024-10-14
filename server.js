import express from "express"
import dotenv from "dotenv"
import {router} from "./routers/router.js"
import "./database/conn.js"
import cors from "cors"

dotenv.config({ path: "./config.env" })
const app = express()
let port = process.env.PORT || 5502

let corsOption = {
    origin: "*",
    methods: "*"
}

app.use(cors(corsOption))
app.use(express.static("/courseUploads"))
app.use('/courseUploads', express.static('courseUploads'));
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

// use router for commans
app.use(router)

app.listen(port, () => {
    console.log(`server is running on port ${port} | http://localhost:${port} !`)
})
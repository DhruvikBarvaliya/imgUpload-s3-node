const dotenv = require("dotenv")
dotenv.config()
const express = require("express")
const multer = require("multer")
const { v4: uuidv4, v4 } = require("uuid");
const AWS = require("aws-sdk")
const app = express()
const PORT = process.env.PORT || 3000

const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ID,
    secretAccessKey: process.env.AWS_SECRET
})

const storage = multer.memoryStorage({
    destination: function (req, file, callback) {
        callback(null, '')
    }
})

const upload = multer({ storage }).single('image')
app.post("/upload", upload, (req, res) => {
    const myFile = req.file.originalname.split(".")
    const fileType = myFile[myFile.length - 1]
    // console.log(req.file);
    // res.send("Welcome To The App")

    const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: `${uuidv4()}.${fileType}`,
        Body: req.file.buffer
    }
    s3.upload(params, (error, data) => {
        if (error) {
            res.status(500).send(error)
        }
        res.status(200).send(data)

    })
})


app.listen(PORT, console.log("Server Is Running on Port No 3000"))
const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const nodemailer = require('nodemailer');
require('dotenv').config();


const PORT = process.env.PORT

// Creating uploads directory if not present
const uploadDir = path.join(__dirname, "uploads");

if(!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir);
}

// Create the Express App
const app = express(); 

// Mount all the middleware
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(uploadDir));


// Create multer storage
const storage = multer.diskStorage({
    destination : function(req, file, cb){
        cb(null, uploadDir)
    },

    filename : function(req, file, cb){
        cb(null, Date.now() + "-" + file.originalname)
    }
});

const upload = multer({
    storage
});

app.get('/data', (req, res)=>{
    res.send("Backend Working...");
    res.end();
})

app.post("/upload", upload.single("file"), (req, res)=>{
    try{
        if(!req.file){
            return res.status(400).json({
                message:"No File uploaded"
            })
        }

        return res.status(200).json({
            message : "File uploaded successfully",
            filePath : `/uploads/${req.file.filename}`
        })
    }
    catch(err){
        console.error("Image Upload Error : ", err);
        return res.status(500).json({
            message : "Upload Failed on Server"
        })
    }
})

app.listen(PORT, (error)=>{
    if(error){
        console.error("Server problem", error);
    }
    else{
        console.log(`Server running on ${PORT}`);
    }
})
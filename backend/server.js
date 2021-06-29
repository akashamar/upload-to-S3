const express = require('express')
const fs = require('fs')
const util = require('util')
const multer = require('multer')
const cors = require('cors');
// const { uploadFile, getFileStream } = require('./awsdkS3.js')  //manual upload to s3
const multerS3 = require('multer-s3');
const S3 = require('aws-sdk/clients/s3')
require('dotenv').config()

const unlinkFile = util.promisify(fs.unlink)
const app = express()
app.use(cors());

const bucketName = process.env.AWS_BUCKET_NAME
const region = process.env.AWS_BUCKET_REGION
const accessKeyId = process.env.AWS_ACCESS_KEY
const secretAccessKey = process.env.AWS_SECRET_KEY

const s3 = new S3({
  region,
  accessKeyId,
  secretAccessKey
})

const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: bucketName,
        key: function (req, file, cb) {
            console.log(file);
            cb(null, file.originalname); //use Date.now() for unique file keys
        }
    })
});

app.post('/images', upload.single('image'), async (req, res) => {
  const file = req.file
  console.log(file)
  console.log('uploaded')
  res.send(file)
})

app.listen(8080, () => console.log("listening on port 8080"))
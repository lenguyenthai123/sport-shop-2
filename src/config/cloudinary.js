// Trong file uploadToCloudinary.js
require("dotenv").config()

const express = require('express')
const multer = require("multer");

const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");

const uploadToCloudinary = (file, width, height) => {
    return new Promise((resolve, reject) => {

        let transformation = {
            width: width,
            height: height,
            crop: "scale",
        };

        let stream = cloudinary.uploader.upload_stream(
            {
                transformation: transformation,
            },
            (error, result) => {
                if (result) {
                    resolve(result);
                } else {
                    reject(error);
                }
            }
        );

        streamifier.createReadStream(file.buffer).pipe(stream);
    });
};

module.exports = uploadToCloudinary;

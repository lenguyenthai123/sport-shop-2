// Trong file uploadToCloudinary.js
require("dotenv").config()

const express = require('express')
const multer = require("multer");

const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");

const uploadToCloudinary = (file) => {
    return new Promise((resolve, reject) => {
        let stream = cloudinary.uploader.upload_stream((error, result) => {
            if (result) {
                resolve(result);
            } else {
                reject(error);
            }
        });

        streamifier.createReadStream(file.buffer).pipe(stream);
    });
};

module.exports = uploadToCloudinary;

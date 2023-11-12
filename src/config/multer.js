const multer = require("multer");

const multerConfig = multer({
    storage: multer.memoryStorage(),
    fileFilter: (req, file, callback) => {
        // Chỉ chấp nhận các file ảnh (định dạng: jpeg, jpg, png, gif)
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
            return callback(new Error("Chỉ chấp nhận file ảnh"));
        }
        callback(null, true);
    },
    limits: {
        // Giới hạn kích thước mỗi file là 5MB
        fileSize: 5 * 1024 * 1024,
    },
});

module.exports = multerConfig;
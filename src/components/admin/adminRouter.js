const express = require("express")
const router = express.Router();
const passport = require("passport");
require("../../middlewares/passportAccessToken");

const Controllers = require("./adminController.js");


const multerConfig = require("../../config/multer.js")
const multer = require("multer");


const upload = multerConfig;

const UploadProduct = upload.fields([
    { name: 'thumbnail', maxCount: 1 },
    { name: 'gallery', maxCount: 8 },
]);

const checkAdmin = (req, res, next) => {
    if (req.user.role === `admin`) {
        return next();
    }
    else {
        return res.status(403).json({ message: 'Permission denied' });
    }
}

router.get("/admin/home-page", passport.authenticate('jwt', { session: false }), checkAdmin, Controllers.getHomePage);

router.get("/admin/product", passport.authenticate('jwt', { session: false }), checkAdmin, Controllers.getFormCreateNewProduct)
router.post("/admin/product", passport.authenticate('jwt', { session: false }), checkAdmin, UploadProduct, Controllers.postANewProduct)

router.get("/admin/products", passport.authenticate('jwt', { session: false }), checkAdmin, Controllers.getProductList)
router.get("/admin/dashboard", passport.authenticate('jwt', { session: false }), checkAdmin, Controllers.getDashBoard)
router.get("/admin/accountlist", passport.authenticate('jwt', { session: false }), checkAdmin, Controllers.getAccountList)
router.get("/admin/accountdetail", passport.authenticate('jwt', { session: false }), checkAdmin, Controllers.getAccountDetail)
router.get("/admin/profile", passport.authenticate('jwt', { session: false }), checkAdmin, Controllers.getAdminProfile)

router.get("/admin/products/:productId", passport.authenticate('jwt', { session: false }), checkAdmin, Controllers.getProductDetail)


module.exports = router;

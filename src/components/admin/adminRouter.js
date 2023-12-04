const express = require("express")
const router = express.Router();
const passport = require("passport");
require("../../middlewares/passport.js");

const Controllers = require("./adminController.js");

const middleware = require("./adminMiddleware.js");

const { checkTokenAndActivationValidate } = require("../auth/authMiddleware.js");

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
router.get("/admin/home-page", passport.authenticate('jwt', { session: false, failureRedirect: '/login' }), checkTokenAndActivationValidate, checkAdmin, Controllers.getHomePage);

router.get("/admin/product", passport.authenticate('jwt', { session: false, failureRedirect: '/login' }), checkTokenAndActivationValidate, checkAdmin, Controllers.getFormCreateNewProduct)
router.post("/admin/product", passport.authenticate('jwt', { session: false, failureRedirect: '/login' }), checkTokenAndActivationValidate, checkAdmin, UploadProduct, Controllers.postANewProduct)

router.get("/admin/update-product/:productId", passport.authenticate('jwt', { session: false, failureRedirect: '/login' }), checkTokenAndActivationValidate, checkAdmin, Controllers.getFormUpdateProduct)
router.patch("/admin/update-product/:productId", passport.authenticate('jwt', { session: false, failureRedirect: '/login' }), checkTokenAndActivationValidate, checkAdmin, UploadProduct, Controllers.patchAProduct)

router.get("/admin/products", passport.authenticate('jwt', { session: false, failureRedirect: '/login' }), checkTokenAndActivationValidate, checkAdmin, Controllers.getProductList)
router.get("/admin/products/paging", passport.authenticate('jwt', { session: false, failureRedirect: '/login' }), checkTokenAndActivationValidate, checkAdmin, Controllers.getProductsForPaging)

router.get("/admin/dashboard", passport.authenticate('jwt', { session: false, failureRedirect: '/login' }), checkTokenAndActivationValidate, checkAdmin, Controllers.getDashBoard)

router.get("/admin/accountlist", passport.authenticate('jwt', { session: false, failureRedirect: '/login' }), checkTokenAndActivationValidate, checkAdmin, Controllers.getAccountList)
router.get("/admin/accountlist/paging", passport.authenticate('jwt', { session: false, failureRedirect: '/login' }), checkTokenAndActivationValidate, checkAdmin, Controllers.getAccountPaging)


router.patch("/admin/profile/avatar", passport.authenticate('jwt', { session: false, failureRedirect: '/login' }), checkTokenAndActivationValidate, checkAdmin, upload.single("avatar"), Controllers.patchAvatarProfile);
router.get("/admin/profile", passport.authenticate('jwt', { session: false, failureRedirect: '/login' }), checkTokenAndActivationValidate, checkAdmin, Controllers.getAdminProfile);
router.patch("/admin/profile", passport.authenticate('jwt', { session: false, failureRedirect: '/login' }), checkTokenAndActivationValidate, checkAdmin, Controllers.patchAdminProfile);


router.get("/admin/products/:productId", passport.authenticate('jwt', { session: false, failureRedirect: '/login' }), checkTokenAndActivationValidate, checkAdmin, Controllers.getProductDetail)
router.get("/admin/accountlist/:userId", passport.authenticate('jwt', { session: false, failureRedirect: '/login' }), checkTokenAndActivationValidate, checkAdmin, Controllers.getAccountDetail)
router.patch("/admin/accountlist/:userId/ban", passport.authenticate('jwt', { session: false, failureRedirect: '/login' }), checkTokenAndActivationValidate, checkAdmin, Controllers.patchBanAnUser);





// fix database

router.get("/admin/updateCatalogName", passport.authenticate('jwt', { session: false }), checkAdmin, Controllers.updateCatalogName);

router.get("/admin/updateCatalogName", passport.authenticate('jwt', { session: false }), checkAdmin, Controllers.updateCatalogName);

router.get("/admin/updateUserAddress", passport.authenticate('jwt', { session: false }), checkAdmin, Controllers.updateUserAddress);

module.exports = router;

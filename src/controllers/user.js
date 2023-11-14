const getAccountDetail = (req, res, next) => {
    try {
        res.render("AccountProfile.ejs");
    } catch (error) {
        next(error);
    }

}

module.exports = {
    getAccountDetail,
}
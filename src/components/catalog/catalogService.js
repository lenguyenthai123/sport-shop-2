const Catalog = require("./catalogModel.js");
const s = require("../admin/adminMiddleware.js");
const getAllCatalog = async function () {
    try {
        const result = await Catalog.find({});
        return result;
    } catch (error) {
        throw error;
    }
}

module.exports = {
    getAllCatalog,
}
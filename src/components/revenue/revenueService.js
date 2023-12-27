const Product = require("../product/productModel")
const Order = require("../order/orderModel")
const Revenue = require("./revenueModel");
const moongose = require("mongoose")


const create = async function (orderId) {

    try {
        if (moongose.isValidObjectId(orderId)) {

            const order = await Order.findById(orderId);
            // Only Completed order
            if (order.status === `Completed`) {

                if (order.listItem.length > 0) {
                    for (let i = 0; i < order.listItem.length; i++) {
                        const data = order.listItem[i];
                        const productId = data.productId;
                        const quantity = data.quantity;

                        // if (moongose.isValidObjectId(productId)) {
                        const product = await Product.findById(productId);

                        const price = product.price;
                        const total = quantity * price;

                        const newRevenue = {
                            orderId,
                            productId,
                            quantity,
                            total,
                            date: order.date,
                        }
                        const revenue = await Revenue.create(newRevenue);
                        console.log(revenue);
                        // }
                    }
                }
                return true;
            }
            else {
                return false;
            }
        }
        else {
            return false;
        }
    }
    catch (e) {
        throw e;
    }
}

const getRevenueValueForChart = async function (type, startTime, endTime) {
    try {

        const filter = {
            date: {
                $gte: startTime,
                $lte: endTime,
            },
            status: {
                $eq: "Completed",
            }
        }
        const group = {};
        let sort = {};
        if (type === 'day') {
            group._id = {
                year: { $year: '$date' },
                month: { $month: '$date' },
                day: { $dayOfMonth: '$date' }
            }
            sort = {
                '_id.year': 1,
                '_id.month': 1,
                '_id.day': 1,
            }
        }
        if (type === 'month') {
            group._id = {
                year: { $year: '$date' },
                month: { $month: '$date' },
            }
            sort = {
                '_id.year': 1,
                '_id.month': 1,
            }
        }
        if (type === 'year') {
            group._id = {
                year: { $year: '$date' },
            }
            sort = {
                '_id.year': 1,
            }
        }
        group.total = { $sum: '$subTotal' };


        console.log("Group: " + group);
        console.log("Filter: " + filter);

        const data = await Order.aggregate([
            { $match: filter },
            { $group: group },
            { $sort: sort },
        ]);
        console.log(data);
        return data;

    }
    catch (e) {
        throw e;
    }
}

const getTopRevenueProduct = async function (startTime, endTime) {
    try {
        console.log("getTopRevenueProduct");
        const data = await Revenue.aggregate([
            {
                $match: {
                    date: { $gte: startTime, $lte: endTime }
                }
            },
            {
                $group: {
                    _id: "$productId",
                    totalRevenue: { $sum: "$total" }
                }
            },
            {
                $sort: {
                    totalRevenue: -1
                }
            },
            {
                $limit: 10
            },
            {
                $lookup: {
                    from: "products",  // Tên của collection "Product"
                    localField: "_id",
                    foreignField: "_id",
                    as: "productInfo"
                }
            },
            {
                $unwind: "$productInfo"
            },
            {
                $project: {
                    _id: 0,  // Loại bỏ trường _id của kết quả
                    productId: "$productInfo._id",
                    productName: "$productInfo.name",
                    catalogName: '$productInfo.catalogName',
                    totalRevenue: 1
                }
            }
        ])
        console.log(data);
        return data;

    }
    catch (e) {
        throw e;
    }
}

module.exports = {
    create,
    getRevenueValueForChart,
    getTopRevenueProduct
}
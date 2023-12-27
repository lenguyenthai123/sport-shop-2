const Order = require("./orderModel")
const Product = require("../product/productModel")
const Revenue = require("./revenueModel");
const moongose = require("mongoose")


const create = async (orderId) => {

    try {
        if (mongoose.isValidObjectId(orderId)) {
            const order = await Order.findById(orderId);
            // Only Completed order
            if (order.status === "Completed") {
                for (let i = 0; i < order.listItem.length; i++) {
                    const data = order.listItem[i];
                    const productId = data.productId;
                    const quantity = data.quanitty;

                    if (mongoose.isValidObjectId(productId)) {
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
        if (type === 'day') {
            group = {
                id: {
                    year: { $year: date },
                    month: { $month: date },
                    day: { $dayOfMonth: date }
                },
            }
        }
        if (type === 'month') {
            group = {
                id: {
                    year: { $year: date },
                    month: { $month: date },
                },
            }
        }
        if (type === 'year') {
            group = {
                id: {
                    year: { $year: date },
                },
            }
        }
        group.total = { $sum: total };


        const data = await Order.aggregate([{
            $match: filter,
            $group: group,
        }]);

        return data;

    }
    catch (e) {
        throw e;
    }
}


module.exports = {
    create,
}
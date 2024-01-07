const Order = require("./orderModel")
const Product = require("../product/productModel")
const moongose = require("mongoose")
const RevenueService = require("../revenue/revenueService")

const createOrder = async (order) => {
  return await Order.create(order);
}

const getOrderList = async (id) => {
  return await Order.find({ userId: new moongose.Types.ObjectId(id) });
}

const getAllOrder = async () => {
  return await Order.find({});
}

const getOrderDetail = async (orderId) => {
  return await Order.findById(orderId);
}

const deleteOrder = async (orderId) => {
  await Order.findByIdAndDelete(orderId);
}

const updateOrderPaymentMethod = async (orderId, method) => {
  await Order.findByIdAndUpdate(orderId, {
    paymentMethod: method
  })
}


const FilteredAndSortedOrder = async function (page, status, sortByOrderTime, sortByField, sortByOrder) {
  try {
    const filter = {};
    const sort = {};

    // Fliter
    if (status !== `None` && status) {
      filter.status = { $regex: status, $options: "i" };
    }



    // Sort
    if (sortByField !== `None` && sortByField) {
      sort[sortByField] = sortByOrder === `desc` ? -1 : 1;
    }
    if (sortByOrderTime !== `None`) {
      sort["registrationDate"] = sortByOrderTime === `desc` ? -1 : 1;
    }

    const options = {
      page: page,
      limit: 10,
      sort: sort,
    }

    const result = await Order.paginate(filter, options);
    // console.log(result)
    return result;
  } catch (error) {
    console.log("Error in filteredAndSortedProducts of User Services", error);
    throw error;
  }
}


const updateState = async (orderId, state) => {
  try {

    const order = await Order.findById(orderId);

    if (order.status !== state) {
      const result = await Order.findByIdAndUpdate(orderId, {
        status: state
      });

      // Update next to revenue if there the "Completed" state
      if (state === "Completed") {
        const rs = await RevenueService.create(orderId);

        for (let i = 0; i < order.listItem.length; i++) {
          const data = order.listItem[i];
          try {
            const product = await Product.findById(data.productId);
            product.totalPurchase += Number.parseInt(data.quantity);
            await product.save();
            console.log(product.totalPurchase);
          }
          catch (err) {
            console.log(err);
          }
        }

      }
      return result;
    }
    return null;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  createOrder,
  getAllOrder,
  getOrderList,
  getOrderDetail,
  deleteOrder,
  updateOrderPaymentMethod,
  FilteredAndSortedOrder,
  updateState,
}
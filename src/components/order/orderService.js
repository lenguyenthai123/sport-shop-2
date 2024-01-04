const Order = require("./orderModel")
const Product = require("../product/productModel")
const moongose = require("mongoose")

const createOrder = async (order) => {
    return Order.create(order);
}

const getOrderList = async (id) => {
    await Order.updateMany(
        { paymentMethod: { $exists: false } },
        { $set: { paymentMethod: 'CashOnDeli' } },
        { multi: true }
    )
    return await Order.find({userId: new moongose.Types.ObjectId(id)});
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


const FilteredAndSortedOrder = async function (page, fullname, paymentMethod, sortByOrderTime, sortByField, sortByOrder) {
    try {
      const filter = {};
      const sort = {};
        
      // Fliter
      if (fullname !== `None` && fullname) {
        filter.fullname = { $regex: fullname, $options: "i" };
      }
  
      if (paymentMethod !== `None` && paymentMethod) {
        filter.paymentMethod = { $regex: paymentMethod, $options: "i" };
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

module.exports = {
    createOrder,
    getAllOrder,
    getOrderList,
    getOrderDetail,
    deleteOrder,
    updateOrderPaymentMethod,
    FilteredAndSortedOrder,
}
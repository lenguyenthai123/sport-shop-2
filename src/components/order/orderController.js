const Jwt = require("jsonwebtoken")
const moongose = require("mongoose")
const orderService = require('./orderService');
const userService = require('../user/userService')
const productService = require('../product/productService');
const User = require('../user/userModel');
require("dotenv").config();

const createOrder = async (req, res, next) => {
    try{
        //userService.updateAProductToCart(user, "6551ed9affd25c65836c66e0", 2);

        const token = req.cookies['token'];
        const decode = Jwt.verify(token, process.env.JWT_SECRET);
        const userId = new moongose.Types.ObjectId(decode.id);
        const user = await User.findById(decode.id);

        const cartData = await userService.getDetailCartById(decode.id);
        const listItem = cartData.detailCart;
        if(listItem.length == 0){
            res.status(401).json({"message": "Cannot create order because your cart is empty"});
            return;
        }

        let subTotal = cartData.subTotal;
        const total = cartData.total;
        let discount = subTotal - total;
        const shipping = 0;
        const phoneNumber = req.body.phoneNumber;
        const fullname = req.body.fullName;
        const address = req.body.address;

    
        await orderService.createOrder({userId, listItem, subTotal, shipping, discount, total, phoneNumber, fullname, address})
        
        
        res.status(201).json({"message": "Create order successfully"});
    }
    catch(error){
        next(error)
    }
}

const getOrderListByUser = async (req, res, next) => {
    try {
        
        const token = req.cookies['token'];
        const decode = Jwt.verify(token, process.env.JWT_SECRET);

        const orderData = await orderService.getOrderList(decode.id);

        for(let i = 0; i < orderData.length; i++){
            for (let j = 0; j < (orderData[i].listItem).length; j++){
                orderData[i].listItem[j].productId = (await productService.getAnProductDetail((orderData[i].listItem[j]).productId)).productInfo;
            }
        }
        
        // res.status(201).json({orderList: orderData}); 
        res.render("OrderList.ejs", {orderList: orderData});
        //Render with 'orderData' variable
    } catch (error) {
        console.log(error);
        next(error);
    }
}

const getOrderByUser = async (req, res, next) => {
    try {
        const orderId = req.params.orderId;
        const orderData = await orderService.getOrderDetail(orderId);

        const token = req.cookies['token'];
        const decode = Jwt.verify(token, process.env.JWT_SECRET);

        if(orderData.userId != decode.id){
            res.status(400).json({"message": "You cannot access this order"});
            return;
        }
        res.render("orderDetail.ejs", {"orderDetail": orderData});

        //Render with 'orderData' variable
    } catch (error) {
        console.log(error);
        next(error);
    }
}

const deleteOrderByAdmin = async (req, res, next) => {
    try {
        const orderId = req.params.orderId;
        await orderService.deleteOrder(orderId);
        
        res.status(201).json({"message": "Delete order successfully"});
    } catch (error) {
        res.status(401).json({"message": "Delete order unsuccessfully"});
        next(error);
    }
}



module.exports = {
    createOrder,
    getOrderListByUser,
    getOrderByUser,
    deleteOrderByAdmin,
}
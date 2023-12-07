
const jwt = require("jsonwebtoken");
const { sendMail } = require("../../utils/mailApi.js")

//Model
const User = require("./userModel.js");
const Product = require("../product/productModel.js");

const crypto = require('crypto');

const mongoose = require("mongoose");

require("dotenv").config();

const uploadToCloudinary = require("../../config/cloudinary.js");
const { nextTick } = require("process");


const getAnUser = async function (condition) {
  try {
    return await User.findOne(condition);
  } catch (error) {
    throw error;
  }
}


const generateResetToken = async function (user) {
  const secret = process.env.JWT_SECRET + user.password;
  return jwt.sign({ id: user._id, email: user.email }, secret, { expiresIn: "30m" });
}
const verifyResetToken = function (user, token) {

  try {
    const secret = process.env.JWT_SECRET + user.password;
    const payload = jwt.verify(token, secret);

    return payload;
  } catch (error) {
    throw error;
  }
}

const generateToken = async function (user) {
  try {
    return await jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET, { expiresIn: "1h" });
  } catch (error) {
    throw error;
  }
}

const sendResetEmail = async function (user) {
  try {
    const token = await generateResetToken(user);

    const resetLink = `${process.env.WEBSITE_URL}/reset-password?id=${user._id}&token=${token}`;
    const mailOptions = {
      from: `Admin Le Nguyen Thai <lnthai21@clc.fitus.edu.vn>`,
      to: user.email,
      subject: "Reset Your Password",
      html: `
              <html>
                <head>
                  <style>
                    body {
                      font-family: 'Arial', sans-serif;
                      line-height: 1.6;
                      color: #333;
                    }
                    .container {
                      max-width: 600px;
                      margin: 0 auto;
                    }
                    .header {
                      background-color: #4CAF50;
                      color: white;
                      padding: 20px;
                      text-align: center;
                    }
                    .content {
                      padding: 20px;
                    }
                    .footer {
                      background-color: #f1f1f1;
                      padding: 10px;
                      text-align: center;
                    }
                  </style>
                </head>
                <body>
                  <div class="container">
                    <div class="header">
                      <h1>Reset Your Password</h1>
                    </div>
                    <div class="content">
                      <p>Dear ${user.username},</p>
                      <p>We received a request to reset your password. To reset your password, please click the link below:</p>
                      <a href="${resetLink}">${resetLink}</a>
                      <p>This link will expire in 1 hour for security reasons.</p>
                      <p>If you did not request a password reset, you can ignore this email.</p>
                      <p>Regards,</p>
                      <p>Admin Le Nguyen Thai</p>
                    </div>
                    <div class="footer">
                      <p>© 2023 SportiqueBliss</p>
                    </div>
                  </div>
                </body>
              </html>
            `,
    };

    return sendMail(mailOptions);
  } catch (error) {
    throw error;
  }

}

const FilteredAndSortedUser = async function (page, fullname, email, sortByField, sortByOrder) {
  try {
    const filter = {};
    const sort = {};

    // Fliter
    if (fullname !== `None` && fullname) {
      filter.fullname = { $regex: fullname, $options: "i" };
    }

    if (email !== `None` && email) {
      filter.email = { $regex: email, $options: "i" };
    }

    // Sort
    if (sortByField !== `None` && sortByField) {
      sort[sortByField] = sortByOrder === `desc` ? -1 : 1;
    }

    const options = {
      page: page,
      limit: 10,
      sort: sort,
    }

    const result = await User.paginate(filter, options);

    return result;
  } catch (error) {
    console.log("Error in filteredAndSortedProducts of User Services", error);
    throw error;
  }
}

const updateAProductToCart = async function (user, productId, quantity) {
  try {

    if (mongoose.isValidObjectId(productId) && !isNaN(quantity)) {
      const objectProductId = new mongoose.Types.ObjectId(productId);
      let pos = -1;
      for (let i = 0; i < user["cart"].length; i++) {

        if (user["cart"][i]["productId"].equals(objectProductId)) {
          user["cart"][i]["quantity"] += parseInt(quantity, 10);
          user["cart"][i]["quantity"] = Math.max(user["cart"][i]["quantity"], 0);
          pos = i;
          break;
        }
      }

      // Delete
      for (let i = user["cart"].length - 1; i >= 0; i--) {
        if (user["cart"][i]["quantity"] === 0) {
          user["cart"].splice(i, 1);
        }
      }

      // Add
      if (pos === -1 && parseInt(quantity, 10) > 0) {
        user.cart.push({ productId: objectProductId, quantity: parseInt(quantity, 10) });
      }

      let subTotal = 0;
      for (let i = 0; i < user.cart.length; i++) {
        try {
          const product = await Product.findById(user.cart[i][`productId`]);
          const quantity = user.cart[i][`quantity`];
          subTotal += product.price * quantity;
        } catch (error) {
          console.log("Not found product");
        }
      }

      await user.save();
      return { cart: user.cart, subTotal };
    }
    else {
      return null;
    }

  } catch (error) {
    throw error;
  }
}

const getDetailCart = async function (cart) {
  try {
    const detailCart = [];
    let subTotal = 0;
    for (let i = 0; i < cart.length; i++) {
      try {
        const product = await Product.findById(cart[i][`productId`]);
        const quantity = cart[i][`quantity`];
        subTotal += product.price * quantity;
        detailCart.push({ product, quantity });
      } catch (error) {
        console.log("Not found product");
      }
    }
    return { detailCart, subTotal };
  } catch (error) {
    throw error;
  }
}

const getDetailCart1 = async function (cart) {
  try {
    const detailCart = [];
    let subTotal = 0;
    let total = 0;
    for (let i = 0; i < cart.length; i++) {
      try {
        const product = await Product.findById(cart[i][`productId`]);
        const quantity = cart[i][`quantity`];
        subTotal += product.price * quantity;
        total += product.price * (1 - product.discount/100) * quantity; 
        detailCart.push({ productId : new mongoose.Types.ObjectId(cart[i]['productId']) , quantity });
      } catch (error) {
        console.log(error);
        console.log("Not found product");
      }
    }
    return { detailCart, subTotal, total };
  } catch (error) {
    throw error;
  }
}


const getDetailCartById = async (id) =>{
  try{
    const userData = await User.findById(id);
    const cart = userData.cart;
    return getDetailCart1(cart);
  }
  catch(error){
    throw error;
  }
}
 
const sendActiveTokenToMail = async function (user) {
  try {
    const randomActivation = await crypto.randomBytes(20);
    user.activeToken = user._id + randomActivation.toString("hex");
    user.activeExpires = Date.now() + 24 * 3600 * 1000;

    await user.save();
    const linkActive = `${process.env.WEBSITE_URL}/account/active/` + user.activeToken;

    const mailOptions = {
      from: `Admin Le Nguyen Thai <lnthai21@clc.fitus.edu.vn>`,
      to: user.email,
      subject: "Activate Your Account",
      html: `
              <html>
                <head>
                  <style>
                    body {
                      font-family: 'Arial', sans-serif;
                      line-height: 1.6;
                      color: #333;
                    }
                    .container {
                      max-width: 600px;
                      margin: 0 auto;
                    }
                    .header {
                      background-color: #4CAF50;
                      color: white;
                      padding: 20px;
                      text-align: center;
                    }
                    .content {
                      padding: 20px;
                    }
                    .footer {
                      background-color: #f1f1f1;
                      padding: 10px;
                      text-align: center;
                    }
                  </style>
                </head>
                <body>
                  <div class="container">
                    <div class="header">
                      <h1>Activate Your Account</h1>
                    </div>
                    <div class="content">
                      <p>Dear <b> ${user.fullname} <b>,</p>
                      <p>Welcome to our platform! To activate your account, please click the link below:</p>
                      <a href="${linkActive}">${linkActive}</a>
                      <p>This link will expire in 24 hours for security reasons.</p>
                      <p>If you did not sign up for an account, you can ignore this email.</p>
                      <p>Regards,</p>
                      <p>Admin Le Nguyen Thai</p>
                    </div>
                    <div class="footer">
                      <p>© 2023 SportiqueBliss </p>
                    </div>
                  </div>
                </body>
              </html>
            `,
    };

    return sendMail(mailOptions);
  } catch (error) {
    throw error
  }

}

const takeAccountProfileData = async function (id) {
  try {
    let profile = await User.findById(id);
    return profile;
  } catch (error) {
    throw error;
  }
}

const updateProfileData = async function (id, updateData) {
  try {
    const result = await User.findByIdAndUpdate(id, updateData);
    return "Update successfully";
  } catch (error) {
    throw error;
  }
}

const updateAvatar = async function (user, avatarFile) {
  try {
    const avatar = await uploadToCloudinary(avatarFile, 300, 300);
    user.avatar = avatar.url;
    await user.save();
    return user;
  } catch (error) {
    throw error;
  }
}

const getUserByConditions = async function (conditions) {
  try {
    const user = await User.findOne(conditions);
    return user;
  }
  catch (error) {
    throw error;
  }
}

const getUserById = async function (id) {
  try {
    if (mongoose.isValidObjectId(id)) {
      const user = await User.findById(id);
      return user;
    }
    else {
      return null;
    }
  }
  catch (error) {
    throw error;
  }
}

const setBanAnUser = async function (user, ban) {
  try {
    user.ban = ban;
    const result = await User.findByIdAndUpdate(user._id, user);
    return result;
  }
  catch (error) {
    throw error;
  }
}

const save = async (user) => {
  try {
    await user.save();
  }
  catch (error) {
    throw error;
  }
}

module.exports = {
  generateResetToken,
  sendResetEmail,
  generateToken,
  verifyResetToken,
  FilteredAndSortedUser,
  updateAProductToCart,
  getDetailCart,
  getDetailCartById,
  sendActiveTokenToMail,
  getAnUser,
  takeAccountProfileData,
  updateProfileData,
  updateAvatar,
  save,
  getUserByConditions,
  getUserById,
  setBanAnUser,
}
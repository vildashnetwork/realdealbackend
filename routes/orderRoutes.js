import express from "express";
import SibApiV3Sdk from "sib-api-v3-sdk";
import Order from "../models/Orders.js";
import { protect } from "../middleware/authMiddleware.js";
import Users from "../models/NormaluserLogin.js";
import Adminmodel from "../models/Admin.js";
import dotenv from "dotenv";
import mongoose from "mongoose";
dotenv.config();

const router = express.Router();

const defaultClient = SibApiV3Sdk.ApiClient.instance;

// Set API key from environment variable
defaultClient.authentications["api-key"].apiKey = process.env.BREVO_API_KEY;

// Use this instance for sending emails
const brevoClient = new SibApiV3Sdk.TransactionalEmailsApi();

router.post("/deletecard", protect, async (req, res) => {
  try {
    await Users.findByIdAndUpdate(req.user._id, { UserCard: [] });
    res.status(201).json({ message: "cart deleted" })
  } catch (error) {
    console.log('====================================');
    console.log(error);
    console.log('====================================');
  }
})

// router.post("/", protect, async (req, res) => {
//   try {
//     const { cartItems, totalPrice, paymentmethod } = req.body;

//     if (!cartItems || cartItems.length === 0) {
//       return res.status(400).json({ message: "No items in cart" });
//     }

//     const formattedItems = cartItems.map(item => ({
//       ProductName: item.ProductName,
//       SKU: item.SKU,
//       Description: item.Description,
//       Specifications: item.Specifications,
//       Price: item.Price,
//       CompareatPrice: item.CompareatPrice,
//       Weight: item.Weight,
//       Category: item.Category,
//       StockQuantity: item.StockQuantity,
//       img3: item.img3
//     }));

//     const order = new Order({
//       user: {
//         _id: req.user._id,
//         name: req.user.name,
//         number: req.user.number,
//         address: req.user.address,
//         location: req.user.location,
//         country: req.user.country,
//         email: req.user.email,
//       },
//       cartItems: formattedItems,
//       totalPrice,
//       paymentmethod
//     });

//     const createdOrder = await order.save();
//     await Users.findByIdAndUpdate(req.user._id, { UserCard: [] });
//     res.status(201).json(createdOrder);

//     // Email generation helper
//     const generateOrderEmail = ({ recipientName, recipientProfile, isAdmin }) => `
// <!DOCTYPE html>
// <html lang="en">
// <head>
//   <meta charset="UTF-8" />
//   <meta name="viewport" content="width=device-width, initial-scale=1" />
//   <title>New Order Notification</title>
// </head>
// <body style="margin:0; padding:0; background:#f5f7fa; font-family:Arial, Helvetica, sans-serif; color:#333;">
//   <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
//     <tr>
//       <td align="center" style="padding:40px 20px;">
//         <table width="600" style="background:#ffffff; border-radius:12px; overflow:hidden; box-shadow:0 4px 20px rgba(0,0,0,0.1);">
//           <!-- Header -->
//           <tr>
//             <td align="center" style="background:#0a2540; padding:30px;">
//               <img src="${recipientProfile}" alt="Recipient Image" style="width:80px; height:80px; border-radius:50%; object-fit:cover; margin-bottom:15px;" />
//               <h1 style="margin:0; font-size:26px; font-weight:600; color:#ffffff;">${isAdmin ? 'New Order Alert' : 'Your Order Confirmation'}</h1>
//             </td>
//           </tr>

//           <!-- Body -->
//           <tr>
//             <td style="padding:30px;">
//               <p style="font-size:18px; margin:0 0 15px;">Hello <strong>${recipientName}</strong>,</p>
//               <p style="font-size:16px; margin:0 0 25px;">
//                 ${isAdmin
//         ? `A new order has been placed by <strong>${order.user.name}</strong>.`
//         : `You just placed an order on Wheelstone. Below are your order details: (please check your email after 15mins for the transaction link)`}
//               </p>

//               ${order.user.profile ? `
//               <div style="text-align:center; margin-bottom:25px;">
//                 <img src="${order.user.profile}" alt="Customer Image" width="100" height="100" style="border-radius:50%; object-fit:cover;" />
//                 <p style="margin-top:10px; font-size:14px; color:#666;">Customer</p>
//               </div>` : ''}

//               <h2 style="font-size:20px; margin-bottom:15px; color:#0a2540;">Order Summary</h2>
//               ${order.cartItems.map(item => `
//                 <div style="display:flex; align-items:center; border:1px solid #e0e0e0; border-radius:8px; padding:10px 15px; margin-bottom:12px;">

//                   <div style="flex:1;">
//                     <h3 style="margin:0 0 5px; font-size:16px; color:#333;">${item.ProductName}</h3>
//                     <p style="margin:0; font-size:14px; color:#555;">Quantity: ${item.StockQuantity}</p>
//                     <p style="margin:0; font-size:14px; color:#555;">Price: $${item.Price}</p>
//                   </div>
//                 </div>
//               `).join('')}

//               <div style="margin-top:25px; padding:15px; background:#f0fdf4; border:1px solid #bbf7d0; border-radius:8px;">
//                 <h2 style="margin:0; font-size:18px; color:#166534;">Total Price: $${order.totalPrice}</h2>
//                 <p style="margin:5px 0 0; font-size:15px; color:#166534;">Payment Method: ${order.paymentmethod}</p>
//               </div>
//             </td>
//           </tr>

//           <!-- Footer -->
//           <tr>
//             <td align="center" style="background:#0a2540; padding:20px; color:#ffffff; font-size:13px;">
//               <p style="margin:0;">ReelDeal &copy; 2025 | All rights reserved</p>
//               <p style="margin:5px 0 0;"></p>
//             </td>
//           </tr>
//         </table>
//       </td>
//     </tr>
//   </table>
// </body>
// </html>
// `;

//     // Send email to admins
//     const admins = await Adminmodel.find();
//     for (const admin of admins) {
//       try {
//         const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
//         sendSmtpEmail.sender = { email: "vildashnetwork@gmail.com", name: "ZOZAC" };
//         sendSmtpEmail.to = [{ email: admin.email }];
//         sendSmtpEmail.subject = `🚀 New Order from ${order.user.name}`;
//         sendSmtpEmail.htmlContent = generateOrderEmail({ recipientName: admin.name, recipientProfile: admin.profile, isAdmin: true });
//         const result = await brevoClient.sendTransacEmail(sendSmtpEmail);
//         console.log(`📧 Email sent to admin: ${admin.email} | MessageId: ${result.messageId}`);
//       } catch (err) {
//         console.error(`❌ Failed to email admin ${admin.email}:`, err.message);
//       }
//     }

//     // Send email to normal users (optional)
//     const normalUsers = await Users.find();
//     for (const user of normalUsers) {
//       try {
//         const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
//         sendSmtpEmail.sender = { email: "vildashnetwork@gmail.com", name: "ZOZAC" };
//         sendSmtpEmail.to = [{ email: user.email }];
//         sendSmtpEmail.subject = `✅ Your Order Confirmation`;
//         sendSmtpEmail.htmlContent = generateOrderEmail({ recipientName: user.name, recipientProfile: user.profile, isAdmin: false });
//         const result = await brevoClient.sendTransacEmail(sendSmtpEmail);
//         console.log(`📧 Email sent to user: ${user.email} | MessageId: ${result.messageId}`);
//       } catch (err) {
//         console.error(`❌ Failed to email user ${user.email}:`, err.message);
//       }
//     }

//   } catch (error) {
//     console.error("Create order error:", error);
//     res.status(500).json({ message: error.message });
//   }
// });

// orders router - POST /api/orders


router.post("/", protect, async (req, res) => {
  try {
    const { cartItems, totalPrice, paymentmethod, ZIPCode, State } = req.body;

    if (!Array.isArray(cartItems) || cartItems.length === 0)
      return res.status(400).json({ message: "No items in cart" });
    if (typeof totalPrice === "undefined" || isNaN(Number(totalPrice)))
      return res.status(400).json({ message: "totalPrice is required and must be a number" });
    if (!paymentmethod || typeof paymentmethod !== "string")
      return res.status(400).json({ message: "paymentmethod is required" });
    if (!ZIPCode || !State)
      return res.status(400).json({ message: "ZIPCode and State are required" });

    // Map items and validate
    const formattedItems = cartItems.map((item, idx) => {
      const candidateId = item.SKU ?? item.productId ?? item.product?._id ?? item._id ?? null;
      const productId = candidateId && mongoose.Types.ObjectId.isValid(String(candidateId))
        ? new mongoose.Types.ObjectId(String(candidateId))  // ✅ fixed
        : null;

      const name = item.ProductName ?? item.name ?? item.title ?? null;
      const quantity = Number(item.StockQuantity ?? item.quantity ?? 1);
      const price = Number(item.Price ?? item.price ?? 0);

      return { productId, name, quantity, price, _sourceIndex: idx };
    });

    // Validate each item
    for (const it of formattedItems) {
      if (!it.productId)
        return res.status(400).json({ message: "Every cart item must include a valid productId", itemIndex: it._sourceIndex });
      if (!it.name)
        return res.status(400).json({ message: "Every cart item must include a name", itemIndex: it._sourceIndex });
      if (isNaN(it.price) || it.price < 0)
        return res.status(400).json({ message: "Every cart item must include a valid numeric price", itemIndex: it._sourceIndex });
      if (!Number.isInteger(it.quantity) || it.quantity <= 0)
        return res.status(400).json({ message: "Every cart item must include a valid integer quantity > 0", itemIndex: it._sourceIndex });

      delete it._sourceIndex;
    }

    // Build user payload
    const userFromReq = req.user || {};
    const userPayload = {
      _id: userFromReq._id,
      name: userFromReq.name,
      number: userFromReq.number,
      address: userFromReq.address,
      location: userFromReq.location,
      country: userFromReq.country,
      email: userFromReq.email,
    };

    const missingUserFields = ["_id", "name", "number", "address", "location", "country", "email"]
      .filter(k => !userPayload[k]);
    if (missingUserFields.length > 0)
      return res.status(400).json({ message: "User profile missing required fields for order creation", missing: missingUserFields });

    // Create order
    const orderDoc = new Order({
      user: userPayload,
      cartItems: formattedItems,
      paymentmethod,
      totalPrice: Number(totalPrice),
      ZIPCode,
      State
    });

    const createdOrder = await orderDoc.save();

    // Clear user cart
    await Users.findByIdAndUpdate(req.user._id, { UserCard: [] }).catch(err => console.warn("Failed to clear UserCard:", err.message));

    res.status(201).json(createdOrder);
    try {
      const generateOrderEmail = ({ recipientName, recipientProfile, isAdmin }) => `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>New Order Notification</title>
</head>
<body style="margin:0; padding:0; background:#f5f7fa; font-family:Arial, Helvetica, sans-serif; color:#333;">
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
    <tr>
      <td align="center" style="padding:40px 20px;">
        <table width="600" style="background:#ffffff; border-radius:12px; overflow:hidden; box-shadow:0 4px 20px rgba(0,0,0,0.1);">
          <tr>
            <td align="center" style="background:#0a2540; padding:30px;">
              <img src="${recipientProfile}" alt="Recipient Image" style="width:80px; height:80px; border-radius:50%; object-fit:cover; margin-bottom:15px;" />
              <h1 style="margin:0; font-size:26px; font-weight:600; color:#ffffff;">${isAdmin ? 'New Order Alert' : 'Your Order Confirmation'}</h1>
            </td>
          </tr>
          <tr>
            <td style="padding:30px;">
              <p style="font-size:18px; margin:0 0 15px;">Hello <strong>${recipientName}</strong>,</p>
              <p style="font-size:16px; margin:0 0 25px;">
                ${isAdmin
          ? `A new order has been placed by <strong>${createdOrder.user.name}</strong>.`
          : `You just placed an order on Wheelstone. Below are your order details: (please check your email after 15mins for the transaction link)`}
              </p>
              <h2 style="font-size:20px; margin-bottom:15px; color:#0a2540;">Order Summary</h2>
              ${createdOrder.cartItems.map(item => `
                <div style="display:flex; align-items:center; border:1px solid #e0e0e0; border-radius:8px; padding:10px 15px; margin-bottom:12px;">
                  <div style="flex:1;">
                    <h3 style="margin:0 0 5px; font-size:16px; color:#333;">${item.name}</h3>
                    <p style="margin:0; font-size:14px; color:#555;">Quantity: ${item.quantity}</p>
                    <p style="margin:0; font-size:14px; color:#555;">Price: $${item.price}</p>
                  </div>
                </div>
              `).join('')}
              <div style="margin-top:25px; padding:15px; background:#f0fdf4; border:1px solid #bbf7d0; border-radius:8px;">
                <h2 style="margin:0; font-size:18px; color:#166534;">Total Price: $${createdOrder.totalPrice}</h2>
                <p style="margin:5px 0 0; font-size:15px; color:#166534;">Payment Method: ${createdOrder.paymentmethod}</p>
              </div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

      // Send emails to admins
      const admins = await Adminmodel.find();
      for (const admin of admins) {
        try {
          const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
          sendSmtpEmail.sender = { email: "vildashnetwork@gmail.com", name: "ReelDeal" };
          sendSmtpEmail.to = [{ email: admin.email }];
          sendSmtpEmail.subject = `🚀 New Order from ${createdOrder.user.name}`;
          sendSmtpEmail.htmlContent = generateOrderEmail({ recipientName: admin.name, recipientProfile: admin.profile, isAdmin: true });
          await brevoClient.sendTransacEmail(sendSmtpEmail);
        } catch (err) {
          console.error(`❌ Failed to email admin ${admin.email}:`, err.message);
        }
      }

      // Send emails to normal users
      const normalUsers = await Users.find();
      for (const user of normalUsers) {
        try {
          const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
          sendSmtpEmail.sender = { email: "vildashnetwork@gmail.com", name: "ZOZAC" };
          sendSmtpEmail.to = [{ email: user.email }];
          sendSmtpEmail.subject = `✅ Your Order Confirmation`;
          sendSmtpEmail.htmlContent = generateOrderEmail({ recipientName: user.name, recipientProfile: user.profile, isAdmin: false });
          await brevoClient.sendTransacEmail(sendSmtpEmail);
        } catch (err) {
          console.error(`❌ Failed to email user ${user.email}:`, err.message);
        }
      }

    } catch (emailErr) {
      console.error("Order created but email sending failed:", emailErr);
    }

  } catch (error) {
    console.error("Create order error:", error);

    if (error && error.name === "ValidationError") {
      return res.status(400).json({ message: "Order validation failed", errors: error.errors });
    }

    return res.status(500).json({ message: error.message || "Server error" });
  }
});

// router.post("/", protect, async (req, res) => {
//   try {
//     const { cartItems, totalPrice, paymentmethod, ZIPCode, State } = req.body;

//     // -------------------
//     // 1️⃣ Validate top-level fields
//     // -------------------
//     if (!Array.isArray(cartItems) || cartItems.length === 0)
//       return res.status(400).json({ message: "No items in cart" });
//     if (typeof totalPrice === "undefined" || isNaN(Number(totalPrice)))
//       return res.status(400).json({ message: "totalPrice is required and must be a number" });
//     if (!paymentmethod || typeof paymentmethod !== "string")
//       return res.status(400).json({ message: "paymentmethod is required" });
//     if (!ZIPCode || !State)
//       return res.status(400).json({ message: "ZIPCode and State are required" });

//     // -------------------
//     // 2️⃣ Map and validate items
//     // -------------------
//     const formattedItems = cartItems.map((item, idx) => {
//       const candidateId = item.SKU ?? item.productId ?? item.product?._id ?? item._id ?? null;
//       const productId = candidateId && mongoose.Types.ObjectId.isValid(String(candidateId))
//         ? mongoose.Types.ObjectId(String(candidateId))
//         : null;
//       const name = item.ProductName ?? item.name ?? item.title ?? null;
//       const quantity = Number(item.StockQuantity ?? item.quantity ?? 1);
//       const price = Number(item.Price ?? item.price ?? 0);

//       return { productId, name, quantity, price, _sourceIndex: idx };
//     });

//     for (const it of formattedItems) {
//       if (!it.productId)
//         return res.status(400).json({ message: "Every cart item must include a valid productId (SKU)", itemIndex: it._sourceIndex });
//       if (!it.name)
//         return res.status(400).json({ message: "Every cart item must include a name", itemIndex: it._sourceIndex });
//       if (isNaN(it.price) || it.price < 0)
//         return res.status(400).json({ message: "Every cart item must include a valid numeric price", itemIndex: it._sourceIndex });
//       if (!Number.isInteger(it.quantity) || it.quantity <= 0)
//         return res.status(400).json({ message: "Every cart item must include a valid integer quantity > 0", itemIndex: it._sourceIndex });

//       delete it._sourceIndex;
//     }

//     // -------------------
//     // 3️⃣ Build user payload
//     // -------------------
//     const userFromReq = req.user || {};
//     const userPayload = {
//       _id: userFromReq._id,
//       name: userFromReq.name,
//       number: userFromReq.number,
//       address: userFromReq.address,
//       location: userFromReq.location,
//       country: userFromReq.country,
//       email: userFromReq.email,
//     };

//     const missingUserFields = ["_id", "name", "number", "address", "location", "country", "email"]
//       .filter(k => !userPayload[k]);
//     if (missingUserFields.length > 0)
//       return res.status(400).json({
//         message: "User profile missing required fields for order creation.",
//         missing: missingUserFields
//       });

//     // -------------------
//     // 4️⃣ Create order
//     // -------------------
//     const orderDoc = new Order({
//       user: userPayload,
//       cartItems: formattedItems.map(it => ({
//         productId: it.productId,
//         name: it.name,
//         quantity: it.quantity,
//         price: it.price
//       })),
//       paymentmethod,
//       totalPrice: Number(totalPrice),
//       ZIPCode,
//       State
//     });

//     const createdOrder = await orderDoc.save();

//     // -------------------
//     // 5️⃣ Clear user's cart
//     // -------------------
//     await Users.findByIdAndUpdate(req.user._id, { UserCard: [] }).catch(err => {
//       console.warn("Failed to clear UserCard:", err.message);
//     });

//     // -------------------
//     // 6️⃣ Return created order
//     // -------------------
//     res.status(201).json(createdOrder);

//     // -------------------
//     // 7️⃣ Send emails asynchronously (non-blocking)
//     // -------------------
//     try {
//       const generateOrderEmail = ({ recipientName, recipientProfile, isAdmin }) => `
// <!DOCTYPE html>
// <html lang="en">
// <head>
// <meta charset="UTF-8" />
// <meta name="viewport" content="width=device-width, initial-scale=1" />
// <title>New Order Notification</title>
// </head>
// <body style="margin:0; padding:0; background:#f5f7fa; font-family:Arial, Helvetica, sans-serif; color:#333;">
//   <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
//     <tr>
//       <td align="center" style="padding:40px 20px;">
//         <table width="600" style="background:#ffffff; border-radius:12px; overflow:hidden; box-shadow:0 4px 20px rgba(0,0,0,0.1);">
//           <tr>
//             <td align="center" style="background:#0a2540; padding:30px;">
//               <img src="${recipientProfile}" alt="Recipient Image" style="width:80px; height:80px; border-radius:50%; object-fit:cover; margin-bottom:15px;" />
//               <h1 style="margin:0; font-size:26px; font-weight:600; color:#ffffff;">${isAdmin ? 'New Order Alert' : 'Your Order Confirmation'}</h1>
//             </td>
//           </tr>
//           <tr>
//             <td style="padding:30px;">
//               <p style="font-size:18px; margin:0 0 15px;">Hello <strong>${recipientName}</strong>,</p>
//               <p style="font-size:16px; margin:0 0 25px;">
//                 ${isAdmin
//           ? `A new order has been placed by <strong>${createdOrder.user.name}</strong>.`
//           : `You just placed an order on Wheelstone. Below are your order details: (please check your email after 15mins for the transaction link)`}
//               </p>
//               <h2 style="font-size:20px; margin-bottom:15px; color:#0a2540;">Order Summary</h2>
//               ${createdOrder.cartItems.map(item => `
//                 <div style="display:flex; align-items:center; border:1px solid #e0e0e0; border-radius:8px; padding:10px 15px; margin-bottom:12px;">
//                   <div style="flex:1;">
//                     <h3 style="margin:0 0 5px; font-size:16px; color:#333;">${item.name}</h3>
//                     <p style="margin:0; font-size:14px; color:#555;">Quantity: ${item.quantity}</p>
//                     <p style="margin:0; font-size:14px; color:#555;">Price: $${item.price}</p>
//                   </div>
//                 </div>
//               `).join('')}
//               <div style="margin-top:25px; padding:15px; background:#f0fdf4; border:1px solid #bbf7d0; border-radius:8px;">
//                 <h2 style="margin:0; font-size:18px; color:#166534;">Total Price: $${createdOrder.totalPrice}</h2>
//                 <p style="margin:5px 0 0; font-size:15px; color:#166534;">Payment Method: ${createdOrder.paymentmethod}</p>
//               </div>
//             </td>
//           </tr>
//         </table>
//       </td>
//     </tr>
//   </table>
// </body>
// </html>`;

//       // Send emails to admins
//       const admins = await Adminmodel.find();
//       for (const admin of admins) {
//         try {
//           const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
//           sendSmtpEmail.sender = { email: "vildashnetwork@gmail.com", name: "ZOZAC" };
//           sendSmtpEmail.to = [{ email: admin.email }];
//           sendSmtpEmail.subject = `🚀 New Order from ${createdOrder.user.name}`;
//           sendSmtpEmail.htmlContent = generateOrderEmail({ recipientName: admin.name, recipientProfile: admin.profile, isAdmin: true });
//           await brevoClient.sendTransacEmail(sendSmtpEmail);
//         } catch (err) {
//           console.error(`❌ Failed to email admin ${admin.email}:`, err.message);
//         }
//       }

//       // Send emails to normal users
//       const normalUsers = await Users.find();
//       for (const user of normalUsers) {
//         try {
//           const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
//           sendSmtpEmail.sender = { email: "vildashnetwork@gmail.com", name: "ZOZAC" };
//           sendSmtpEmail.to = [{ email: user.email }];
//           sendSmtpEmail.subject = `✅ Your Order Confirmation`;
//           sendSmtpEmail.htmlContent = generateOrderEmail({ recipientName: user.name, recipientProfile: user.profile, isAdmin: false });
//           await brevoClient.sendTransacEmail(sendSmtpEmail);
//         } catch (err) {
//           console.error(`❌ Failed to email user ${user.email}:`, err.message);
//         }
//       }

//     } catch (emailErr) {
//       console.error("Order created but email sending failed:", emailErr);
//     }

//   } catch (error) {
//     console.error("Create order error:", error);

//     if (error && error.name === "ValidationError") {
//       return res.status(400).json({ message: "Order validation failed", errors: error.errors });
//     }

//     return res.status(500).json({ message: error.message || "Server error" });
//   }
// });


// Get all orders for logged in user


router.get("/myorders", protect, async (req, res) => {
  try {
    const orders = await Order.find({ "user._id": req.user._id });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin: Get all orders
router.get("/", async (req, res) => {
  try {
    const orders = await Order.find({});
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/delete', async (req, res) => {
  try {
    await Order.deleteMany()
    res.status(200).json(
      { message: "orders deleted" }
    );
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
export default router;

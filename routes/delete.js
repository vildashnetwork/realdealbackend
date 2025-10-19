import Adminmodel from '../models/Admin.js';
import Orders from "../models/Orders.js"
import Payment from "../models/Payment.js"
import Users from "../models/NormaluserLogin.js"
import e from 'express';
const router = e.Router();


router.delete("/deleteall", async(req, res)=>{
    try{
        await Adminmodel.deleteMany({});
        await Orders.deleteMany({});
        await Payment.deleteMany({})
        await Users.deleteMany({})
        res.status(200).json({message: "All everything data deleted"});

    }
    catch(err)
    {
        console.log("error in deleting all admin data", err);
        res.status(500).json({message: "Server error"});
    }
})
export default router;
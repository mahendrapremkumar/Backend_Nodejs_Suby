const Vendor = require('../models/Vendor');
const jwt = require('jsonwebtoken');
const dotEnv = require('dotenv');

dotEnv.config();

const secretKey = process.env.WhatIsYourName;

const verifyToken = async(req, res, next)=>{  
    const token = req.headers.token;

    if(!token)
    {
        return res.status(401).json({error: "Token is required"});
    }
    try{
        const decoded = jwt.verify(token , secretKey)
        console.log(decoded);
        const vendor = await Vendor.findById(decoded.VendorId);

        if(!vendor)
        {
            return res.status(404).json({error:"vendor not found"});
        }
        req.vendorId = vendor._id

        next()
    }
    catch(err)
    {
        console.error(err);
        return res.status(500).json({error:"invaild token "})
    }
}

module.exports = verifyToken;
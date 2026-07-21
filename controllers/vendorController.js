const bcrypt = require('bcryptjs');
const Vendor = require('../models/Vendor');
const jwt = require("jsonwebtoken")
const dotEnv = require("dotenv")

dotEnv.config()
const secretKey = process.env.WhatIsYourName;

// console.log("bcrypt =", bcrypt);
// console.log("hash =", bcrypt.hash);

const vendorRegister = async(req , res) =>{
    const {username , email , password} = req.body;
    try{

        const vendorEmail = await Vendor.findOne({email})
        if(vendorEmail)
        {
            return res.status(400).json("Email already taken");
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newVendor = new Vendor({
            username ,
            email ,
            password: hashedPassword
        });

        await newVendor.save()

        res.status(200).json({message : "vendor registered successfully"})
        console.log('registered')
    }
    catch(err)
    {
        console.error(err)
        res.status(500).json({error: "Internal server error"})
    }
}

const vendorLogin = async(req , res) =>{
    const {email , password} = req.body;
    try{
        const vendor = await Vendor.findOne({email});
        if(!vendor || !(await bcrypt.compare(password , vendor.password)))
        {
            return res.status(401).json({error : "invaild user name or password"})
        }

        const token = jwt.sign({VendorId: vendor._id}, secretKey, {expiresIn:"1h"} )

        res.status(200).json({success:"Login successful", token})
        console.log(email, "this is token :", token);
    }
    catch(err)
    {
        console.error(err)
        res.status(500).json({error: "Internal server error"})
    }
}

const getAllVendors = async(req,res)=>{
    try{
        const vendors = await Vendor.find().populate('firm')
        res.json(vendors)
    }
    catch(err)
    {
        console.error(err);
         res.status(500).json({error: "Internal server error"})
    }
}

const getVendorById = async(req,res)=>{
     
    const vendorId = req.params.id;
    try{
        const vendor = await Vendor.findById(vendorId);
        if(!vendor)
        {
            return res.status(404).json({error:"vendor not found"})
        }
        res.status(200).json({vendor})
    }
    catch(err)
    {
        console.log(err);
        res.status(500).json({error:"Internal server error"});
    }
}


module.exports = {vendorRegister, vendorLogin , getAllVendors , getVendorById}
const Firm = require('../models/Firm');
const Vendor = require('../models/Vendor');
const multer = require('multer');
const path = require("path");

    const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/");
    },

    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
    });

    const upload = multer({storage: storage});

const addFirm = async(req , res) =>{
    try
    {
        const {firmName , area , category ,region , offer} = req.body
        const  image = req.file? req.file.filename: undefined;    

        const vendor = await Vendor.findById(req.vendorId);
        if(!vendor){
            return res.status(404).json({message: "vendor not found"})
        }

        const firm = new Firm({
        firmName, area, category, region, offer, image, vendor: vendor._id
        })

        const savedFirm = await firm.save();
        vendor.firm.push(savedFirm);
        await vendor.save()

        return res.status(200).json({message:"firm added succesfully"})
    }
    catch(err)
    {
        console.error(err);
        res.status(500).json({message:"Internal server error"})
    }
}

const deleteFirmById = async(req,res)=>{
    try {
        const firmId = req.params.firmId;
        const deletedFirm= await Firm.findByIdAndDelete(firmId)

        if(!deletedFirm)
        {
            return res.status(404).json({error:"No Firm Found"});
        }
        
    } catch (error) {
        console.error(error);
        res.status(500).json({error:"internal server error"});
    }
}

module.exports = {addFirm:[upload.single('image'),addFirm],deleteFirmById}
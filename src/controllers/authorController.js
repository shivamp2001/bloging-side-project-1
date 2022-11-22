const authorModel = require('../models/authorModel.js');
const { isValidEmail} = require('../util/valitor.js');
const jwt=require('jsonwebtoken')


const createAuthor = async (req, res) => {
    try {
        const reqBody = req.body;
        const { fname, lname, title, email, password } = reqBody;

        if (Object.keys(reqBody).length === 0) return res.status(400).send({ status: false, message: 'Please enter data.' });
        if (!fname) return res.status(400).send({ status: false, message: 'fname is required.' });
        if (!lname) return res.status(400).send({ status: false, message: 'lname is required.' });
        if (!title) return res.status(400).send({ status: false, message: 'title is required.' });
        if (!email) return res.status(400).send({ status: false, message: 'email is required.' });
        if (!password) return res.status(400).send({ status: false, message: 'password is required.' });

        if (!isValidEmail(email)) return res.status(400).send({ status: false, message: 'email is not valid.' });
        const saveData = await authorModel.create(reqBody);
        return res.status(201).send({ status: true, data: saveData})
    }
    catch (err) {
        return res.status(500).send({ status: false, error: err.message })
    }
};

const login=async(req,res)=>{

    try{
    const reqBody=req.body
    const {email,password}=reqBody
        if (Object.keys(reqBody).length === 0) return res.status(400).send({ status: false, message: 'Please enter data.' });
        if(!email)return res.status(400).send({status:false,message:"email is required"});
        if(!password) return res.status(400).send({status:false,message:"password is required"});

        const authorId=await authorModel.findOne({email,password}).select("_id")
        if(!authorId) return res.status(400).send({status:false,message:"please enter valid email and password"})
        const token=jwt.sign({authorId},"functionUP")
        return res.status(200).send({status:true,message:"Successful login",data:token})
    }
     catch(err){
         return res.status(500).send({ status: false, error: err.message })
    }
};

module.exports = { createAuthor,login }


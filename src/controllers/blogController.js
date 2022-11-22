
const blogModel = require('../models/blogModel.js');
const { isValidObjectId } = require('../util/valitor.js');

const createBlog = async (req, res) => {
    try {
        const reqBody = req.body;
        const { title, body, authorId, category } = reqBody;

        if (Object.keys(reqBody).length === 0) return res.status(400).send({ status: false, message: 'Please enter data.' });
        if (!title) return res.status(400).send({ status: false, message: 'title is required.' });
        if (!body) return res.status(400).send({ status: false, message: 'body is required.' })
        if (!authorId) return res.status(400).send({ status: false, message: 'authorId is required.' });
        if (!category) return res.status(400).send({ status: false, message: 'category is required.' });

        if (!isValidObjectId(authorId)) return res.status(400).send({ status: false, message: 'authorId is not valid.' });

        const saveData = await blogModel.create(reqBody);
        return res.status(201).send({ status: true, data: saveData })
    }
    catch (err) {
        console.log(err)
        return res.status(500).send({ status: false, error: err.message })
    }
};


const getBlog = async (req, res) => {
    try {
        const data = req.query
        const { authorId, category, tags, subcategory } = data
        const saveData = await blogModel.find({ $and: [{ isDeleted: false, isPublished: true }, data] });
        if (!saveData) {
            return res.status(404).send({ status: false, data: 'Blog not found.' })
        }
        return res.status(200).send({ status: true, message: saveData })
    }
    catch (err) {
        console.log(err)
        return res.status(500).send({ status: false, error: err.message })
    }
}


const updatedata = async (req, res)=> {
    try {
       
        const blogId = req.params.blogId
        const {title,body,tags,subcategory,authorId} =req.body
       

        if (!isValidObjectId(blogId)) return res.status(404).send({ status: false, message: 'blogId is not valid.' });
        
        const validBlogId = await blogModel.findById(blogId)
        if (!validBlogId) return res.status(400).send({ status: false, message: 'Blog doesnt exist.' })
         
       //uthorization
        if( req.user!= validBlogId.authorId) return res.status(403).send({status:false,message:"you are not authorise"})

        console.log(authorId,validBlogId.authorId)
        
        
              let update = await blogModel.findOneAndUpdate({ _id: blogId},
                 { $set: {title,body,isPublished: true,publishedAt: new Date()},$addToSet: {tags,subcategory}}, { new: true });
        return res.status(200).send({ status: true, data: update })
        }
        catch (err) {  
        return res.status(500).send({ error: err.message })
        }
}
//using path params

const deleteData = async (req, res) => {
    try {
        const blogId = req.params.blogId

        if (!isValidObjectId(blogId)) return res.status(400).send({ status: false, message: 'blogId is not valid.' });
        const validBlogId = await blogModel.findById(blogId)
        if (!validBlogId) return res.status(400).send({ status: false, message: 'Blog doesnt exits.' })
        if (validBlogId.isDeleted === true) {
            return res.status(400).send({ status: false, message: "this blog is already deleted." });
        }
        let Delete = await blogModel.findByIdAndUpdate({ _id: blogId }, { $set: { isDeleted: true, isPublished: false, deletedAt: new Date() } }, { new: true })
        return res.status(200).send({ status: true, data: Delete })
        }
        catch (err) {
        return res.status(500).send({ err: err.message })
        }
}
// using query params

const deleteBlog= async (req,res)=>{
        try{
        const authorId=req.query
        if (!isValidObjectId(authorId)) return res.status(404).send({ status: false, message: 'blogId is not valid.' });
        const validBlogId=await blogModel.findById(authorId)
        if(!validBlogId) return res.status(404).send({status:false,message:"blog is not exist"});

        const Delete=await blogModel.findByIdAndUpdate({_id:author},{$set:{isDeleted:true}})
        return res.status(200).send({data:Delete})
        }catch(err){
        return res.status(500).send({error:err.message})
        }
}

module.exports = { createBlog, getBlog, updatedata , deleteData, deleteBlog}


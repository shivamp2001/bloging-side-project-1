const express = require('express');
const router = express.Router();
const { createAuthor, login } = require('../controllers/authorController.js');
const { createBlog, deleteData, deleteBlog } = require('../controllers/blogController.js');
const { getBlog } = require('../controllers/blogController.js');
const { updatedata } = require('../controllers/blogController')
const middleware=require('../middleware/auth')

router.post('/login',login)
router.post('/authors', createAuthor);
router.post('/blogs', middleware.authentication,createBlog);
router.get('/blogs',middleware.authentication, getBlog);
router.put('/blogs/:blogId',middleware.authentication,updatedata)      //using path param
router.delete('/blogs/:blogId',middleware.authentication,deleteData)   //using path param
router.delete('/blogs',deleteBlog)                                     //using query params



module.exports = router;

const Product = require("../models/Product")
const fs = require('fs')
const { promisify } = require('util')

const unlinkAsync = promisify(fs.unlink)

const createProduct = async (req, res) => {
    console.log('req',req.body)
    try {
        const product = new Product({
            //_id:req.params.id,
            title:req.body.title,
            sizes: req.body.sizes,
            description: req.body.description,
            category: req.body.category,
            imgUrl: req.file ? req.file.path : '' 
        })
    
    await product.save()
        res.status(201).json({message: 'Product was created', product})
    
    } catch (e) {
        console.log(e)
        //res.status(500).json({message:'Failed to create new Product'})
        res.status(500).json({message: e.message})
    }
    
}

const getAllProducts = async (req, res) => {
    try {
        const products = await res.paginatedResults
        res.status(200).json(products)
    } catch (e) {
        console.log(e)
        res.status(500).json({message:'Failed to get products'})
    }
}

const getProductById = async (req, res) => {
    try {
        const product =  await Product.findById(req.params.id)
        res.status(200).json(product)
    } catch (e) {
        console.log(e)
        res.status(500).json({message:'Failed to get product'})
    }
}

const removeProduct = async (req, res) => {
    try {
        Product.findOneAndDelete(
            {_id:req.params.id},
            (e, doc) => {
                if(e) {
                    return res.status(500).json({message:'Failed to remove product'})
                }
                if(!doc) {
                    return res.status(404).json({
                        message: 'Product not found',
                      });
                }
                res.json({
                    message:'Product deleted successfully'
                });
            })
        
    } catch (e) {
        console.log(e)
        res.status(500).json({message: e.message /* 'Failed to remove product' */})
    }
}

const updateProduct = async (req, res) => {
    console.log('req.body', req.body)
    try {
        const updatedProduct = {
            title:req.body.title,
            sizes: req.body.sizes,
            description: req.body.description,
            category: req.body.category,
        }
    
        if(req.file) {
            //нужен ли кусок кода или как видоизменить
            const oldProduct = await Product.findById(req.params.id)
            unlinkAsync('D:\\Anna\\Programing\\Projects\\pizza-mern.js\\server\\'+oldProduct.imgUrl)
            //
            updatedProduct.imgUrl = req.file.path
        }

        const product = await Product.findOneAndUpdate(
                {_id:req.params.id},
                {$set: updatedProduct},
                {new:true, useFindAndModify:true}
        )

        res.status(200).json({success: true, product, message: 'Product was updated'})
    } catch (e) {
        console.log(e)
        res.status(500).json({message: e.message/* 'Failed to update product' */})
    }
}

module.exports = {
    getAllProducts,
    createProduct,
    updateProduct,
    removeProduct,
    getProductById 
}
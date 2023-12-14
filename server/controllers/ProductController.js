const Product = require("../models/Product")
//firebase
const { admin } = require('../multerConfig');
//const { validationResult } = require('express-validator');

//
/* const fs = require('fs')
const { promisify } = require('util')



const unlinkAsync = promisify(fs.unlink) */

//firebase
const createProduct = async (req, res) => {

    try {
      const bucket = admin.storage().bucket();
      const date = new Date();
      const fileName = `${date.getTime()}_${req.file.originalname}`;
      //const file = bucket.file(fileName);
      
      const filePath = 'images';
      const file = bucket.file(`${filePath}/${fileName}`);
  
      const blobStream = file.createWriteStream({
        metadata: {
          contentType: req.file.mimetype,
        },
      });
  
      blobStream.on('error', (error) => {
        console.error(error);
        res.status(500).json({ message: 'Error uploading file.' });
      });
  
      blobStream.on('finish', async () => {
        try {

            console.log('File successfully uploaded to Firebase Storage');
          // Создать запись в MongoDB с информацией о продукте
          const product = new Product({
            title: req.body.title,
            sizes: req.body.sizes,
            description: req.body.description,
            category: req.body.category,
            imgUrl: /* req.file ?  */`https://storage.googleapis.com/${bucket.name}/${file.name}` /* : '' */
          });
  
          await product.save();
          console.log('product', product)
          res.status(201).json({ message: 'Product was created', product });
        } catch (e) {
          console.error(e);
          res.status(500).json({ message: 'Error creating product', error: e.message });
        }
      });
  
      blobStream.end(req.file.buffer);
    } catch (e) {
      console.error('Error in blobStream.on(\'finish\'):',e);
      res.status(500).json({ message: e.message });
    }
  };

///

/*рабочий код без firebase 
const createProduct = async (req, res) => {
    console.log('req',req.file)
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
    
} */

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
        const product = await Product.findById(req.params.id);
        const filePath = 'images/' + product.imgUrl.split('/').pop();
        const file = admin.storage().bucket().file(filePath);
    
        await file.delete();

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

            // Удаление старого файла из Firebase Storage
            const oldProduct = await Product.findById(req.params.id);
            if(oldProduct && oldProduct.imgUrl /* след строку удалить когда все картинки поменяю && oldProduct.imgUrl.startsWith('mern-pizzanna.appspot.com/images/uploads')*/) {
                console.log('oldProduct.imgUrl',oldProduct.imgUrl)
                const oldFilePath = 'images/' + oldProduct.imgUrl.split('/').pop();
                const oldFile = admin.storage().bucket().file(oldFilePath);
            
                await oldFile.delete();
            }
            
            // Сохранение нового файла в Firebase Storage
            const bucket = admin.storage().bucket();
            const date = new Date();
            const fileName = `${date.getTime()}_${req.file.originalname}`;
            
            const filePath = 'images';
            const file = bucket.file(`${filePath}/${fileName}`);
            
            const blobStream = file.createWriteStream({
                metadata: {
                    contentType: req.file.mimetype,
                },
            });

            blobStream.on('error', (error) => {
                console.error(error);
                res.status(500).json({ message: 'Error uploading file.' });
            });

            blobStream.on('finish', async () => {
                try {
                    updatedProduct.imgUrl = `https://storage.googleapis.com/${file.bucket.name}/${file.name}`;

                    // Обновление продукта в MongoDB
                    const product = await Product.findOneAndUpdate(
                        { _id: req.params.id },
                        { $set: updatedProduct },
                        { new: true, useFindAndModify: true }
                    );

                    res.status(200).json({ success: true, product, message: 'Product was updated' });
                } catch (e) {
                    console.error(e);
                    res.status(500).json({ message: 'Error updating product', error: e.message });
                }
            });

            blobStream.end(req.file.buffer);
            
        } else {
            // Если нет нового файла, просто обновите продукт в MongoDB
            const product = await Product.findOneAndUpdate(
                {_id:req.params.id},
                {$set: updatedProduct},
                {new:true, useFindAndModify:true}
        )

        res.status(200).json({success: true, product, message: 'Product was updated'})}
    
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
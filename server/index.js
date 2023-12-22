const express = require('express')
const mongoose = require('mongoose')
//const config = require('config')
const authRouter = require('./routes/authRoutes')
const productRoutes = require('./routes/productRoutes')

require('dotenv').config();
const dbUrl = process.env.MONGODB_URI //|| config.get('dbUrl');;

//firebase
const uploadFileMiddleware = require('./middleware/uploadFileMiddleware');
//

const app = express()
const PORT = process.env.PORT //|| config.get('serverPort')

const corsMiddleware = require('./middleware/corsMiddleware')

app.use(corsMiddleware)
app.use(express.json())

//app.use('/uploads', express.static('uploads'))
app.use('/api/auth', authRouter)
app.use('/api/products',/* uploadFileMiddleware, */productRoutes)


const start = async () => {    
    try {
        await mongoose.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true})
      
        app.listen(PORT, () => {
            console.log('server started on port', PORT)
        })
    } catch (err) {
        console.error(`Error connection to mongo: ${dbUrl}`, err)
    }
}

start()
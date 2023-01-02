const {Schema, model} = require('mongoose')
const Sizes = require('./Sizes')

const ProductSchema = new Schema({
    title: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    },
    sizes: [ Sizes.schema ],
    imgUrl: {
        type:String, 
        required: true
    },
    category:  {
            type:String,
            unique: true,
            required: true 
    },
    /* types: {
        type: [Number] //бортики с сыром [0(без бортиков),1(с бортиками)] для пиццы
    } */
}, {timestamps:true})

module.exports = model('Product', ProductSchema)
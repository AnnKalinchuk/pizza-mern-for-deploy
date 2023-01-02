const {Schema, model} = require('mongoose')

//pizza, drinks, dessert, sides

const SizesSchema = new Schema({
    size: { 
        type: String, 
        required: true
    },
    value: { 
        type: Number, 
        required: true
    },
    price: { 
        type: Number, 
        required: true
    }
})

module.exports = model('Sizes', SizesSchema)
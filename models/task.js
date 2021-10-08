const mongoose=require('mongoose');
const esquemaproducto=mongoose.Schema({
    my_id:String,
    amount:Number,
    category:String,
    desactualizar:String,
    lastModified:Date,
    name:String,
    photo_id:String
})
const modeloproducto=mongoose.model('stock',esquemaproducto,'stock');
module.exports=modeloproducto;
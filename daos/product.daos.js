const mongoose = require("mongoose");
const ProductoSchema = require("./modelsMDB/schemaProd")
const url = require("./bd/mongoUrl")
class ProductoDAOS{
    constructor(){
        this.url = url
    }
    async connectMDB(){
        try{
            let response = await mongoose.connect(this.url, {
                useNewUrlParser: true,
                useUnifiedTopology: true
            })
        }
        catch(e){
            console.log(e)
        }
    }
    async createProduct(product){
        try{
            product.timestamp = Date.now();
            product.codigo = Math.floor(Math.random()*100000);
            await this.connectMDB();
            await ProductoSchema.create(product);
            await mongoose.disconnect()
        }
        catch(e){
            console.log(e)
        }
    }
    async getById(idP){
        try{
            await this.connectMDB();
            let prod = await ProductoSchema.findById({_id: idP})
            await mongoose.disconnect()
            return prod
        }
        catch(e){
            console.log(e)
        }
    }
    async getAllProducts(){
        try{
            await this.connectMDB();
            const all = await ProductoSchema.find({})
            await mongoose.disconnect()
            return all
        }
        catch(e){
            console.log(e)
        }
    }
    async updateById(idP, newCont){
        try{
            await this.connectMDB();
            await ProductoSchema.findByIdAndUpdate({_id: idP}, newCont)
            const prod = await ProductoSchema.findById({_id: idP})
            await mongoose.disconnect();
            return prod
        }
        catch(e){
            console.log(e)
        }
    }
    async deleteById(idP){
        try{
            await this.connectMDB();
            await ProductoSchema.findByIdAndDelete({_id: idP})
            await mongoose.disconnect();
        }
        catch(e){
            console.log(e)
        }
    }
}

module.exports =  ProductoDAOS
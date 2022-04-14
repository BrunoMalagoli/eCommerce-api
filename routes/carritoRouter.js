const fs = require("fs")
const express = require("express");
const router = express.Router();

class Carrito{
    constructor(){
        this.arrayCarrito = [];
    }
    async createCarrito(prodObj){
        const carrito = {
            "id":this.arrayCarrito.length,
            "timestamp": Date.now(),
        }
        if(prodObj != null || undefined){
            try{
            let array = this.arrayCarrito;
            carrito.productos = prodObj;
            array.push(carrito);
            await fs.promises.writeFile("./storage/carritos.txt", JSON.stringify(array))
            }catch(err){
                console.log(err)
            }
        }else{
            let array = this.arrayCarrito;
            array.push(carrito)
            await fs.promises.writeFile("./storage/carritos.txt", JSON.stringify(array))
        }
        return carrito.id
    }
}
//Instancias
const carr = new Carrito();
let adminLogged
carr.createCarrito();
carr.createCarrito({"camisa":"del barcita"})
//Endpoints
router.get("/", (req,res)=>{
    res.send("Aqui esta el carrito")
})

module.exports = router;
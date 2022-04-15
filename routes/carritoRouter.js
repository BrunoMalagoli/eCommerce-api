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
    async deleteById(id){
        try{
            let data = await fs.promises.readFile("./storage/carritos.txt", "utf-8");
            data = await JSON.parse(data);
            await data.splice(id, 1 , "deleted");
            await fs.promises.writeFile("./storage/carritos.txt", JSON.stringify(data))
            console.log(data)
            return data
        }
        catch(err){
            console.log(err)
        }
    }
    async getById(id){
        try{
            let data = await fs.promises.readFile("./storage/carritos.txt", "utf-8");
            console.log(data)
            data = await JSON.parse(data);
            const dataFiltered = await data.filter((carrito)=> carrito.id === id)
            console.log(dataFiltered)
            let productos = await dataFiltered.map(carrito => {
                console.log(carrito.productos)
                return carrito.productos;
            });
            console.log(await productos)
            return productos
        }catch(err){
            console.log(err)
        }
    }
}
//Instancias
const carr = new Carrito();
//carr.createCarrito();
//carr.createCarrito({"productos":" camiseta del barcita"})
//Endpoints
router.get("/", (req,res)=>{
    res.send("Aqui esta el carrito")
})
router.post("/", async (req, res)=>{
    res.json({"Id del carrito": await carr.createCarrito({"camisa":"del barcita"})})
})
router.delete("/:id", async (req,res)=>{
    let id = req.params.id;
    res.json({"Carrito eliminado, contenido actual": await carr.deleteById(id)})
})
router.get("/:id/productos", async (req,res)=>{
    let id = parseInt(req.params.id);
    res.json({"Tus productos" : await carr.getById(id)})
})
module.exports = router;
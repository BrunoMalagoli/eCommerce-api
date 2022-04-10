const fs = require("fs")
const express = require("express");
const router = express.Router();
class Producto{
    constructor(){
        this.arrayProductos =[];
    }
    saveProduct(prodObj){
            const array = this.arrayProductos
            prodObj.id = array.length+1;
            prodObj.timestamp = Date.now();
            prodObj.codigo = Math.floor(Math.random()*100000);
            array.push(prodObj)
            fs.promises.writeFile("./storage/productos.txt", JSON.stringify(array))
            return array
        }

    async getAll(){
        let productos = await fs.promises.readFile("./storage/productos.txt","utf-8")
        return productos
    }
    async getById(id){
        try{
            let data = await fs.promises.readFile("./storage/productos.txt", "utf-8");
            console.log(data)
            data = await JSON.parse(data);
            const dataFiltered = await data.filter((products)=> products.id === id)
            console.log(JSON.stringify(dataFiltered))
            return JSON.stringify(dataFiltered)
        }catch(err){
            console.log(err)
        }
    }
}
const prod = new Producto()
prod.saveProduct({"name": "Camiseta", "description": "Camiseta barcelona", "price": "129", "image": "url", "stock": "20"})
prod.saveProduct({"name": "Pantalon", "description": "Pantalon barcelona", "price": "139", "image": "url", "stock": "5"})
prod.getAll()
//prod.getById(1)

//Endpoints
router.get("/", async (req,res)=>{
    let productos = await prod.getAll()
    res.send(productos)
})
router.get("/:id", (req,res)=>{
    let id = req.params.id;
    let productosById = prod.getById(id)
    res.send(productosById)
})


module.exports = router;
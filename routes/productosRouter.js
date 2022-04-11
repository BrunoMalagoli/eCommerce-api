const fs = require("fs")
const axios = require("axios")
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
//prod.saveProduct({"name": "Camiseta", "description": "Camiseta barcelona", "price": "129", "image": "url", "stock": "20"})
//prod.saveProduct({"name": "Pantalon", "description": "Pantalon barcelona", "price": "139", "image": "url", "stock": "5"})
prod.getAll()
prod.getById(1)

//Declaracion admin
let adminLogged
//Endpoints
router.get("/", async (req,res)=>{
    let productos = await prod.getAll()
    res.send(productos)
})
router.get("/:id", async (req,res)=>{
    let id = parseInt(req.params.id);
    let productosById = await prod.getById(id)
    res.send(productosById)
})
router.put("/:id", (req, res)=>{

})

router.post("/", async (req , res)=>{
    const {name, description, price , image , stock} = req.body;
    let product = {"name": name, "description": description, "price": price, "image": image,  "stock": stock}
    try{
    await axios.get("http://localhost:8080/admin").then(response=>{
        console.log(response.data)
        adminLogged = response.data
    })
    }catch(err){
        console.log(err)
    }
    if(adminLogged == true){
        prod.saveProduct(product);
        res.json({"Exito": "Su producto se guardo exitosamente"})
    }else{
        res.json({error: -1, description: req.url , method: req.method, message: "not allowed"})
    }
})

module.exports = router;
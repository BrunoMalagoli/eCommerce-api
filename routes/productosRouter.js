const fs = require("fs")
const axios = require("axios")
const express = require("express");
const router = express.Router();
//configs
router.use(express.json())
router.use(express.urlencoded({extended: true}))
class Producto{
    constructor(){
        this.arrayProductos =[];
    }
    async saveProduct(prodObj){
            const array = this.arrayProductos
            prodObj.id = array.length;
            prodObj.timestamp = Date.now();
            prodObj.codigo = Math.floor(Math.random()*100000);
            array.push(prodObj)
            await fs.promises.writeFile("./storage/productos.txt", JSON.stringify(array))
            return array
        }

    async getAll(){
        let productos = await fs.promises.readFile("./storage/productos.txt","utf-8")
        if(productos.length >=1){
            return productos
        }else{
            return "No se encontraron productos"
        }
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
    async updateById(id , newObj){
        try{
            let data = await fs.promises.readFile("./storage/productos.txt", "utf-8");
            data = await JSON.parse(data);
            newObj.id = id;
            newObj.timestamp = Date.now();
            newObj.codigo = Math.floor(Math.random()*100000);
            await data.splice(id, 1 , newObj);
            await fs.promises.writeFile("./storage/productos.txt", JSON.stringify(data))
            console.log(data)
            return data
        }
        catch(err){
            console.log(err)
        }
    }
    async deleteById(id){
        try{
            let data = await fs.promises.readFile("./storage/productos.txt", "utf-8");
            data = await JSON.parse(data);
            await data.splice(id, 1 , "deleted");
            await fs.promises.writeFile("./storage/productos.txt", JSON.stringify(data))
            console.log(data)
            return data
        }
        catch(err){
            console.log(err)
        }
    }
}
const prod = new Producto()
//prod.saveProduct({"name": "Camiseta", "description": "Camiseta barcelona", "price": "129", "image": "url", "stock": "20"})
//prod.saveProduct({"name": "Pantalon", "description": "Pantalon barcelona", "price": "139", "image": "url", "stock": "5"})
prod.getAll()
//prod.getById(1)
//Declaracion admin
let adminLogged
//Endpoints
router.get("/", async (req,res)=>{
    let productos = await prod.getAll()
    res.send(productos)
})
router.get("/:id", async (req,res)=>{
    let id = parseInt(req.query.id);
    let productosById = await prod.getById(id)
    res.send(productosById)
})
router.put("/:id", async (req, res)=>{
    const {name, description, price , image , stock} = await req.body;
    let id =  req.params.id
    let product = {"name": name, "description": description, "price": price, "image": image,  "stock": stock}
    await axios.get("http://localhost:8080/admin").then(response=>{
        console.log(response.data)
        adminLogged = response.data
    })
    if(adminLogged == true){
    try{
        await prod.updateById(id, product);
        res.send(await prod.getAll())
    }
    catch(err){
        console.log(err)
    }
    }else{
        res.json({error: -1, description: req.url , method: req.method, message: "not allowed"})
    }
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
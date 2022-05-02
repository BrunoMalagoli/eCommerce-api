const axios = require("axios")
const express = require("express");
const router = express.Router();
const {pDAOS} = require("../daos/index.daos")
//configs
router.use(express.json())
router.use(express.urlencoded({extended: true}))


//Declaracion admin
let adminLogged
//Endpoints
router.get("/", async (req,res)=>{
    let productos = await pDAOS.getAllProducts()
    res.send(productos)
})
router.get("/:id", async (req,res)=>{
    let id = req.params.id;
    let productosById = await pDAOS.getById(id)
    res.send(productosById)
})
router.put("/:id", async (req, res)=>{
    const {name, description, price , image } = await req.body;
    let id =  req.params.id
    let product = {"name": name, "description": description, "price": price, "image": image}
    await axios.get("http://localhost:8080/admin").then(response=>{
        console.log(response.data)
        adminLogged = response.data
    })
    if(adminLogged == true){
    try{
        await pDAOS.updateById(id, product);
        res.send(await pDAOS.getAllProducts())
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
        await pDAOS.createProduct(product);
        res.json({"Exito": "Su producto se guardo exitosamente"})
    }else{
        res.json({error: -1, description: req.url , method: req.method, message: "not allowed"})
    }
})
router.delete("/:id", async (req,res)=>{
    let id = req.params.id
    await axios.get("http://localhost:8080/admin").then(response=>{
        console.log(response.data)
        adminLogged = response.data
    })
    if(adminLogged == true){
        try{
            await pDAOS.deleteById(id);
            res.send(await pDAOS.getAllProducts())
        }
        catch(err){
            console.log(err)
        }
    }else{
        res.json({error: -1, description: req.url , method: req.method, message: "not allowed"})
    }
})
module.exports = router;
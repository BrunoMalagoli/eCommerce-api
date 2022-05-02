const express = require("express");
const router = express.Router();
const {cDaos} = require("../daos/index.daos")

//Endpoints
router.get("/", (req,res)=>{
    res.send("Aqui esta el carrito")
})
router.post("/", async (req, res)=>{
    res.json({"carrito creado con exito, ID del carrito": await cDaos.createCart()})
})
router.delete("/:id", async (req,res)=>{
    let id = req.params.id;
    await cDaos.deleteById(id)
    res.json({"Estado del carrito": "Eliminado" })
})
router.get("/:id/productos", async (req,res)=>{
    let id = req.params.id;
    res.json({"Tu Carrito" : await cDaos.getCartById(id)})
})
router.post("/:idC/:idP/productos", async (req, res)=>{
    let idC = req.params.idC;
    let idP = req.params.idP
    res.send({"Agregado producto por ID": await cDaos.addProduct(idC, idP)})
})
router.delete("/:id/productos/:id_prod", async (req,res)=>{
    let idC = req.params.id;
    let idP = req.params.id_prod;
    res.json({"Producto eliminado, resultado": await cDaos.deleteByProd(idC, idP)})
})
module.exports = router;
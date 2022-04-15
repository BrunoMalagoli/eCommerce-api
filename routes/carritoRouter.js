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
            carrito.productos = null;
            array.push(carrito)
            await fs.promises.writeFile("./storage/carritos.txt", JSON.stringify(array))
        return carrito.id
        }
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
    async addById(id){
        try{
            let productos = await fs.promises.readFile("./storage/productos.txt", "utf-8");
            let array = this.arrayCarrito;
            productos = await JSON.parse(productos);
            const productoById = await productos.filter((prod)=> prod.id === id);
            array[0].productos = productoById[0]
            await fs.promises.writeFile("./storage/carritos.txt", JSON.stringify(array))
            return array
        }catch(err){
            console.log(err)
        }
    }
    async deleteByProd(idCarr, idProd){
        try{
            let carrito = await fs.promises.readFile("./storage/carritos.txt", "utf-8");
            carrito = await JSON.parse(carrito);
            const carritoById = await carrito.filter((carr)=> carr.id === idCarr);
            await carritoById.map((carr)=>{
                return carr.productos["id"] == idProd
            })
            let checkId = await carritoById.some((carr)=>{
                return carr.productos["id"] == idProd
            })
            console.log(await checkId)
            if(checkId == true){
                await carritoById.map((carr)=>{
                    return carr.productos = "deleted";
                })
                return await carritoById
            }else{
                return console.log("Producto no existente en este carrito")
            }
        }catch(err){
            console.log(err)
        }
    }
}
//Instancias
const carr = new Carrito();
//carr.createCarrito();
//carr.addById(0)
//carr.deleteByProd(0,0)
//Endpoints
router.get("/", (req,res)=>{
    res.send("Aqui esta el carrito")
})
router.post("/", async (req, res)=>{
    res.json({"Id del carrito": await carr.createCarrito()})
})
router.delete("/:id", async (req,res)=>{
    let id = parseInt(req.params.id);
    res.json({"Carrito eliminado, contenido actual": await carr.deleteById(id)})
})
router.get("/:id/productos", async (req,res)=>{
    let id = parseInt(req.params.id);
    res.json({"Tus productos" : await carr.getById(id)})
})
router.post("/:id/productos", async (req, res)=>{
    let id = parseInt(req.params.id);
    res.json({"Agregado producto por ID": await carr.addById(id)})
})
router.delete("/:id/productos/:id_prod", async (req,res)=>{
    let idCarr = parseInt(req.params.id);
    let idProd = parseInt(req.params.id_prod);
    res.json({"Producto eliminado, resultado": await carr.deleteByProd(idCarr, idProd)})
})
module.exports = router;
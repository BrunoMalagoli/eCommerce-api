const express = require("express");
const app = express();
const PORT = 8080;
const productosRouter = require("./routes/productosRouter")
const carritoRouter = require("./routes/carritoRouter")
//configs
app.use(express.json())
app.use(express.urlencoded({extended: true}))
//Routes
app.use(express.static(__dirname + "/public"))
app.use("/api/productos", productosRouter)
app.use("/api/carrito", carritoRouter)
//Admin state
let adminLogged = false;
function setAdmin(state){
    adminLogged = state
    return adminLogged;
}
//Endpoints
const server = app.listen(PORT, ()=>{
    console.log(`Servidor escuchando en ${PORT}`)
})
server.on("error", (error)=>{
    console.log(error.message)
})

app.get("/" ,(req, res)=>{
    res.sendFile(__dirname + "/public/views/index.html")
})
//Login
app.post("/" , (req,res , next)=>{
    if(req.body.user === "admin" && req.body.pass == 123){
        setAdmin(true)
        console.log("Admin conectado");
        console.log(adminLogged)
        next()
    }else{
        res.send({error: "Acceso no permitido"})
        }
    },
    (req, res)=>{
        res.sendFile(__dirname + "/public/views/index.html")
    }
)
//404
app.use((req,res)=>{
    res.status(404);
    res.json({error: -2, description: req.url, method: req.method, message: "not implemented"})
})

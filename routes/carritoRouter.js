const express = require("express");
const router = express.Router();
const { cDaos } = require("../daos/index.daos");

//Endpoints
router.get("/", (req, res) => {
  res.send("Aqui esta el carrito");
});
router.post("/", async (req, res) => {
  try {
    res.json({
      "carrito creado con exito, ID del carrito": await cDaos.createCart(),
    });
  } catch (e) {
    console.log(e);
  }
});
router.delete("/:id", async (req, res) => {
  try {
    let id = req.params.id;
    await cDaos.deleteById(id);
    res.json({ "Estado del carrito": "Eliminado" });
  } catch (e) {
    console.log(e);
  }
});
router.get("/:id/productos", async (req, res) => {
  try {
    let id = req.params.id;
    res.json({ "Tu Carrito": await cDaos.getCartById(id) });
  } catch (e) {
    console.log(e);
  }
});
router.post("/:idC/:idP/productos", async (req, res) => {
  try {
    let idC = req.params.idC;
    let idP = req.params.idP;
    res.send({ "Agregado producto por ID": await cDaos.addProduct(idC, idP) });
  } catch (e) {
    console.log(e);
  }
});
router.delete("/:id/productos/:id_prod", async (req, res) => {
  try {
    let idC = req.params.id;
    let idP = req.params.id_prod;
    res.json({
      "Producto eliminado, resultado": await cDaos.deleteByProd(idC, idP),
    });
  } catch (e) {
    console.log(e);
  }
});
module.exports = router;

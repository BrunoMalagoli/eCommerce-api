const cartDAOS = require("../daos/cart.daos")
const prodDAOS = require("../daos/product.daos")
const cDAOS = new cartDAOS()
const pDAOS = new prodDAOS()


module.exports = {
    cDAOS,
    pDAOS
}
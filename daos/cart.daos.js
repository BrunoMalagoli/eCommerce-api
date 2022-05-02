const firebase = require("firebase-admin")
const fireConfig = require("./bd/backendentrega-firebase-adminsdk-1sqeo-b635f6fece.json");
const ProdModel = require("./product.daos");
const pModel = new ProdModel()

class Cart{
    constructor(){
        firebase.initializeApp({
            credential: firebase.credential.cert(fireConfig),
            databaseURL: "https://backendentrega-default-rtdb.firebaseio.com/"
        })
        this.db = firebase.firestore()
    }
    async createCart(){
        const db = this.db;
        const query = db.collection("carritos")
        try{
            const newCart = await query.add({
                timestamp: Date.now(),
                products: [],
            })
            return newCart.id
        }
        catch(e){
            console.log(e)
        }
    }
    async addProduct(idCart, idProd){
        try{
            let prod = await pModel.getById(idProd)
            const db = firebase.firestore();
            const query = db.collection("carritos")
            const doc = query.doc(idCart)
            await doc.update({
                products: firebase.firestore.FieldValue.arrayUnion(String(prod))
            })
        }
        catch(e){
            console.log(e)
        }
    }
    async getCartById(idCart){
        const cartRef = this.db.collection("carritos").doc(idCart)
        try{    
            const item = await cartRef.get();
            const response = item.data();
            return response
        }
        catch(e){
            console.log(e)
        }
    }
    async deleteById(id){
        const carr = await this.db.collection("carritos").doc(id).delete()
        return carr
    }
    async deleteByProd(idC, idP){
        try{
            let prod = await pModel.getById(idP)
            const db = firebase.firestore();
            const query = db.collection("carritos")
            const doc = query.doc(idC)
            await doc.update({
                products: firebase.firestore.FieldValue.arrayUnion(String("Deleted"))
            })
        }
        catch(e){
            console.log(e)
        }
    }
}
module.exports = Cart;
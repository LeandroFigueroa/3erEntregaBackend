import { Router } from "express";
import { productValidator } from "../middlewares/productValidator.js";
import { uploader } from "../middlewares/multer.js";
import ProductManager from '../manager/product.manager.js';




const productManager = new ProductManager('./products.json');
const router = Router();

router.get('/', async(req, res) => {
    const { limit } = req.query;
    try {
        const products = await productManager.getAllProducts(limit);
        res.status(200).json(products);
    } catch (error) {
        res.status(404).json({ message: error.message });
        console.log(error);
    }
});


//Acciones sobre producto

//Consultar 
router.get('/:pid', async(req, res) =>{
    try {
        const { pid } = req.params;
        const product = await productManager.getProductById(Number(pid));
        if(product){
            res.status(200).json({ message: 'product found  ', product})
        } else {
            res.status(400).send('product not found');
        }
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});

//Cargar 
router.post('/', productValidator, async(req, res) =>{
    try {
        console.log( req.body);
        const product = req.body;
        const newProduct = await productManager.addProduct(product);
        res.json(newProduct);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});

//Cargar con multer
router.post('/test-multer', uploader.single('thumbnail'), async(req, res) =>{
    try {
        console.log( req.file);
        const product = req.body;
        product.thumbnail = req.file.path;
        const newProduct = await productManager.addProduct(product);
        res.json(newProduct);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});

//Modificar 
router.put('/:pid', async(req, res) =>{
    try {
        const { name, price, stock } = req.body;
        const product = req.body;
        const { pid } = req.params;
        const productsFile = await productManager.getProductById(Number(pid));
        if(productsFile){
            await productManager.updateProduct(product, Number(pid));
            res.send('product has been updated')
        } else {
            res.status(404).send('product not found')
        }
    } catch (error) {
        res.status(404).json({ message: error.message });
}});

//Eliminar 
router.delete('/:pid', async(req, res) =>{
    try {
        const { pid } = req.params;
        const products = await productManager.getAllProducts();  
        const productToDelete = products.find(prod => prod.pid === Number(pid));
        if(productToDelete) {
            await productManager.deleteProductById(Number(pid));
            res.send(`product id ${pid} successfully deleted`);
        } else {
            res.send(`product id ${pid} not found`)
        }
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});

router.delete('/', async(req, res) =>{
    try {
        await productManager.deleteProducts();
        res.send('Product has been deleted');
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});

export default router;
import express from "express";
import ProductManager from "./manager/product.manager.js";

const app = express();
const PORT = 8080;

app.listen(PORT, () => {
  console.log(`server listening on ${PORT}`);
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const productManager = new ProductManager("./products.json");

app.get('/products', async(req, res) => {
    const { limit } = req.query;
    try {
        const products = await productManager.getAllProducts(limit);
        res.status(200).json(products);
    } catch (error) {
        res.status(404).json({ message: error.message });
        console.log(error);
    }
});


app.get("/products/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const product = await productManager.getProductById(parseInt(id));
    if (product) {
      res
        .status(200)
        .json({ message: product.name + " has been successfully", product });
    } else {
      res.status(400).json({ message: "Invalid product" });
    }
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

app.post("/products", async (req, res) => {
  try {
    const product = req.body;
    const newProduct = await productManager.addProduct(product);
    res.json(newProduct);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

app.put("/products/:id", async (req, res) => {
  try {
    
    const product = req.body;
    const { id } = req.params;
    const productsFile = await productManager.getProductById(parseInt(id));
    if (productsFile) {
      await productManager.updateProduct(product, parseInt(id));
      res.send("product updated successfully");
    } else {
      res.status(400).send("Product not found");
    }
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});



app.delete('/products/:id', async(req, res)=>{
    try {
        const { id } = req.params;
        const products = await productManager.getAllProducts();
        if(products.length > 0){
            await productManager.deleteProductById(Number(id));
            res.send(`product id: ${id} deleted ok`);
        } else {
            res.send(`product id: ${id} not found`);
        }
    } catch (error) {
        res.status(404).json({ message: error.message });

    }
});

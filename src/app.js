import express, { json } from "express";
import ProductManager from "./manager/product.manager.js";

const app = express();
const PORT = 8080;

app.listen(PORT, () => {
  console.log(`server listening on ${PORT}`);
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const productManager = new ProductManager("./products.json");

app.get("/products", async (req, res) => {
  try {
    const products = await productManager.getAllProducts();
    res.status(200).json(products);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

app.get("/products/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const product = await productManager.getProductById(parseInt(id));
    if (product) {
      res
        .status(200)
        .json({ message: product.name + " has been successfully" });
    } else {
      res.status(400).json({ message: "Invalid product" });
    }
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

app.post("/products", async (req, res) => {
  try {
    

  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

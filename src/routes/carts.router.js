import { Router } from 'express';
import CartManager from '../manager/cart.manager.js';



const router = Router();
const cartManager = new CartManager('./carts.json');

// mostrar cart
router.get('/:cid', async (req, res) => {
    const cid = parseInt(req.params.cid);
    try {
      const cart = await cartManager.getCartById(cid);
      if (!cart) {
        res.status(404).send(`Cart with id ${cid} not found.`);
        return;
      }
      const products = await Promise.all(
        cart.products.map(async (product) => {
          const p = await productManager.getProductById(product.pid);
          return { ...product, ...p };
        })
      );
      res.json(products);
    } catch (error) {
      console.log(error);
      res.status(500).send('Server error');
    }
  });

  // Agregar producto
router.post('/:cid/product/:pid', async (req, res) => {
    const cid = Number(req.params.cid);
    const pid = Number(req.params.pid);
    try {
      const cart = await cartManager.getCartById(cid);
      if (!cart) {
        res.status(404).send(`Cart id ${cid} not found.`);
        return;
      }
      const product = await productManager.getProductById(pid);
      if (!product) {
        res.status(404).send(`Product id ${pid} not found.`);
        return;
      }
      const index = cart.products.findIndex((p) => p.pid === pid);
      if (index === -1) {
        cart.products.push({ pid, quantity: 1 });
      } else {
        cart.products[index].quantity++;
      }
      await cartManager.updateCart(cart, cid);
      res.json(cart);
    } catch (error) {
      console.log(error);
      res.status(500).send('Error updating cart');
    }
  });
  
  export default router;
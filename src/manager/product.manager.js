import fs from "fs";
import {__dirname} from "../path.js"; 


export default class ProductManager {
  constructor(path) {
    this.path = path;
  }

  async #getMaxId() {
    let maxId = 0;
    const products = await this.getAllProducts();
    products.map((prod) => {
      if (prod.pid > maxId) maxId = prod.pid;
    });
    return maxId;
  }

  async getAllProducts(limit){
    try {
        if(fs.existsSync(this.path)){
            const products = await fs.promises.readFile(this.path, 'utf8');
            const productsJSON = JSON.parse(products);
            if (limit) {
                return productsJSON.slice(0, limit);
            } else {
                return productsJSON;
            }
        } else {
            return []
        }            
    } catch (error) {
        console.log(error);
    }
}

  async addProduct(obj) {
    try {
      const product = {
        pid: (await this.#getMaxId()) + 1,
        ...obj,
      };
      const productsFile = await this.getAllProducts();
      productsFile.push(product);
      await fs.promises.writeFile(this.path, JSON.stringify(productsFile));
      return product;
    } catch (error) {
      console.log(error);
    }
  }
  async getProductById(pid) {
    try {
      const products = await this.getAllProducts();
      const product = products.find(prod => prod.pid === pid);
      if (product) {
        return product;
      }
      return false;
    } catch (error) {
      console.log(error);
    }
  }
  async updateProduct(obj, pid) {
    try {
      const productsFile = await this.getAllProducts();
      const index = productsFile.findIndex(prod => prod.pid === pid);
      console.log("index:::", index);
      if (index === -1) {
        throw new Error(`Id ${pid} not found`);
      } else {
        productsFile[index] = { ...obj, pid };
      }
      await fs.promises.writeFile(this.path, JSON.stringify(productsFile));
    } catch (error) {
      console.log(error);
    }
  }
  async deleteProduct() {
    try {
      if (fs.existsSync(this.path)) {
        await fs.promises.unlink(this.path);
      }
    } catch (error) {
      console.log(error);
    }
  }

    async deleteProductById(pid){
        try {
            const productsFile = await this.getAllProducts();
            if(productsFile.length > 0){
                const newArray = productsFile.filter(prod => prod.pid !== pid);
                await fs.promises.writeFile(this.path, JSON.stringify(newArray));
            } else {
                throw new Error(`Product id: ${pid} not found`);
            }
        } catch (error) {
            console.log(error);
        }
    }
}

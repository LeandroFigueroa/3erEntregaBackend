import express from 'express';
import morgan from 'morgan';
import productsRouter from './routes/products.router.js';
import cartsRouter from './routes/carts.router.js';
import { __dirname } from './path.js';

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(morgan('dev'));
app.use(express.static(__dirname + '/public/images'));
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);



app.listen(8080, ()=>{
    console.log('Puerto 8080, ATR ');

})
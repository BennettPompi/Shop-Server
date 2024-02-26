//handles requests from client and interacts with the database using RESTful API
import express, {Express, Request, Response} from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import {User, LoginManager} from './passwordDB'
import { CartManager, addCartReq, removeCartReq } from './userCartsDB'

dotenv.config();
const app: Express = express();
const PORT = process.env.PORT || 3000;
const loginManager = new LoginManager();
const cartManager = new CartManager();

app.use(express.json());
app.options('*', cors());
app.use(cors());

// Serve static front end from the specified directory
app.use(express.static(process.env.STATIC_ROOT!));

app.post('/backup', (req: Request, res: Response) => {
    const user: {username: string} = req.body;
    if (user.username === 'admin') {
        loginManager.backup();
        cartManager.backup();
        res.status(200).json({message: 'backed up successfully'});
    }
    else {
        res.status(400).json({message: 'Invalid credentials'});
    }
});
app.post('/addToCart', (req: Request, res: Response) => {
    const cartReq: addCartReq = req.body;
    if (cartManager.addToCart(cartReq.username, cartReq.item)) {
        res.status(200).json({message: 'Added to cart successfully'});
    }
    else {
        res.status(400).json({message: 'Something went wrong'});
    }
});
app.post('/getCart', (req: Request, res: Response) => {
    const user: {username: string} = req.body;
    const cart = cartManager.getCart(user.username);
    if (cart) {
        res.status(200).json(cart);
    }
    else {
        res.status(400).json({message: 'Something went wrong'});
    }
});
app.post('/removeFromCart', (req: Request, res: Response) => {
    const cartReq: removeCartReq = req.body;
    if (cartManager.removeFromCart(cartReq.username, cartReq.id)) {
        res.status(200).json({message: 'Removed from cart successfully'});
    }
    else {
        res.status(400).json({message: 'Something went wrong'});
    }
});
app.post('/login', (req: Request, res: Response) => {
    const user: User = req.body;
    if (loginManager.login(user.username, user.password)) {
        res.status(200).json({message: 'Login successful'});
    }
    else {
        res.status(400).json({message: 'Invalid credentials'});
    }
})
app.post('/register', (req: Request, res: Response) => {
    const user: User = req.body;
    if (!loginManager.register(user.username, user.password)) {
        return res.status(400).json({message: `User ${user.username} already exists`});
    }
    res.status(200).json({message: `User ${user.username} has been registered`});
});
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

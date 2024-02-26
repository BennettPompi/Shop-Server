"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//handles requests from client and interacts with the database using RESTful API
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const passwordDB_1 = require("./passwordDB");
const userCartsDB_1 = require("./userCartsDB");
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
const loginManager = new passwordDB_1.LoginManager();
const cartManager = new userCartsDB_1.CartManager();
app.use(express_1.default.json());
app.use((0, cors_1.default)({ preflightContinue: true, origin: '*' }));
app.options('*', (0, cors_1.default)());
app.post('/backup', (req, res) => {
    const user = req.body;
    if (user.username === 'admin') {
        loginManager.backup();
        cartManager.backup();
        res.status(200).json({ message: 'backed up successfully' });
    }
    else {
        res.status(400).json({ message: 'Invalid credentials' });
    }
});
app.post('/addToCart', (req, res) => {
    const cartReq = req.body;
    if (cartManager.addToCart(cartReq.username, cartReq.item)) {
        res.status(200).json({ message: 'Added to cart successfully' });
    }
    else {
        res.status(400).json({ message: 'Something went wrong' });
    }
});
app.post('/getCart', (req, res) => {
    const user = req.body;
    const cart = cartManager.getCart(user.username);
    if (cart) {
        res.status(200).json(cart);
    }
    else {
        res.status(400).json({ message: 'Something went wrong' });
    }
});
app.post('/removeFromCart', (req, res) => {
    const cartReq = req.body;
    if (cartManager.removeFromCart(cartReq.username, cartReq.itemTitle)) {
        res.status(200).json({ message: 'Removed from cart successfully' });
    }
    else {
        res.status(400).json({ message: 'Something went wrong' });
    }
});
app.post('/login', (req, res) => {
    const user = req.body;
    if (loginManager.login(user.username, user.password)) {
        res.status(200).json({ message: 'Login successful' });
    }
    else {
        res.status(400).json({ message: 'Invalid credentials' });
    }
});
app.post('/register', (req, res) => {
    const user = req.body;
    if (!loginManager.register(user.username, user.password)) {
        return res.status(400).json({ message: `User ${user.username} already exists` });
    }
    res.status(200).json({ message: `User ${user.username} has been registered` });
});
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

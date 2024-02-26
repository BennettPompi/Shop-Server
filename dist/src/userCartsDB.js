"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartManager = void 0;
require("../data/carts.json");
const fs_1 = __importDefault(require("fs"));
;
;
;
class CartManager {
    constructor() {
        const fileString = JSON.parse(fs_1.default.readFileSync('data/carts.json').toString());
        this.userCartsDB = new Map(Object.entries(fileString));
    }
    addToCart(userID, item) {
        if (!this.userCartsDB.has(userID)) {
            this.userCartsDB.set(userID, []);
        }
        this.userCartsDB.get(userID).push(item);
        return true;
    }
    backup() {
        fs_1.default.writeFileSync('data/carts.json', JSON.stringify(Object.fromEntries(this.userCartsDB)));
    }
    getCart(userID) {
        return this.userCartsDB.get(userID);
    }
    removeFromCart(userID, itemTitle) {
        if (!(this.userCartsDB.has(userID))) {
            return false;
        }
        const userCart = this.userCartsDB.get(userID);
        const itemIndex = userCart.findIndex((item) => item.title === itemTitle);
        if (itemIndex === -1) {
            return false;
        }
        userCart[itemIndex].quantity -= 1;
        if (userCart[itemIndex].quantity === 0) {
            userCart.splice(itemIndex, 1);
        }
        return true;
    }
}
exports.CartManager = CartManager;

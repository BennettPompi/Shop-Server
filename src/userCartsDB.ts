import '../data/carts.json';
import fs from 'fs';
export interface Item {
    id:number;
    title: string;
    imgLink: string;
    quantity: number,
    price: number
};
export interface addCartReq {username: string; item: Item};
export interface removeCartReq {username: string; itemTitle: string};
export class CartManager{
    userCartsDB: Map<string, Item[]> 
    constructor(){ 
        const fileString = JSON.parse(fs.readFileSync('data/carts.json').toString())
        this.userCartsDB = new Map(Object.entries(fileString));
    }
    public addToCart(userID: string, item: Item): boolean{
        if(!this.userCartsDB.has(userID)){
            this.userCartsDB.set(userID, []);
        }
        (this.userCartsDB.get(userID) as Item[]).push(item);
        return true;
    }
    public backup(): void {
        fs.writeFileSync('data/carts.json', JSON.stringify(Object.fromEntries(this.userCartsDB)));
    }
    public getCart(userID: string): Item[] | undefined{
        return this.userCartsDB.get(userID);
    }
    public removeFromCart(userID: string, itemTitle: string): boolean{
        if(! (this.userCartsDB.has(userID))){
            return false;
        }
        const userCart: Item[] = this.userCartsDB.get(userID) as Item[];
        const itemIndex = userCart.findIndex((item: Item) => item.title === itemTitle);
        if(itemIndex === -1){
            return false;
        }
        userCart[itemIndex].quantity -= 1;
        if(userCart[itemIndex].quantity === 0){
            userCart.splice(itemIndex, 1);
        }
        
        return true;
    }
    
}


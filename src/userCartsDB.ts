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
export interface removeCartReq {username: string; id: number};
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
        const userCart: Item[] = this.userCartsDB.get(userID) as Item[];
        const itemIndex = userCart.findIndex((cartItem: Item) => cartItem.id === item.id);
        if(itemIndex !== -1){
            userCart[itemIndex].quantity += 1;
            return true;
        }
        else
            (this.userCartsDB.get(userID) as Item[]).push(item);
        return true;
    }
    public backup(): void {
        fs.writeFileSync('data/carts.json', JSON.stringify(Object.fromEntries(this.userCartsDB)));
    }
    public getCart(userID: string): Item[] | undefined{
        if (this.userCartsDB.has(userID))
            return this.userCartsDB.get(userID) as Item[];
        else
            return [];
    }
    public removeFromCart(userID: string, id: number): boolean{
        if(! (this.userCartsDB.has(userID))){
            return false;
        }
        const userCart: Item[] = this.userCartsDB.get(userID) as Item[];
        const itemIndex = userCart.findIndex((cartItem: Item) => cartItem.id === id);
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


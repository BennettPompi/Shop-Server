import '../data/users.json';
import fs from 'fs';
export interface User {username: string; password: string;};

export class LoginManager{
    passwordDB: Map<string, string> 
    constructor(){ 
        const fileString = JSON.parse(fs.readFileSync('data/users.json').toString())
        this.passwordDB = new Map(Object.entries(fileString));
    }
    public login(username: string, password: string): boolean{
        if(this.passwordDB.has(username)){
            return this.passwordDB.get(username) === password;
        }
        return false;
    }
    public backup(): void {
        fs.writeFileSync('data/users.json', JSON.stringify(Object.fromEntries(this.passwordDB)));
    }
    public register(username: string, password: string): boolean{
        if(this.passwordDB.has(username)){
            return false;
        }
        this.passwordDB.set(username, password);
        
        return true;
    }
    
}


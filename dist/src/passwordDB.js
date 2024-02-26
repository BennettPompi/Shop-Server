"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginManager = void 0;
require("../data/users.json");
const fs_1 = __importDefault(require("fs"));
;
class LoginManager {
    constructor() {
        const fileString = JSON.parse(fs_1.default.readFileSync('data/users.json').toString());
        this.passwordDB = new Map(Object.entries(fileString));
    }
    login(username, password) {
        if (this.passwordDB.has(username)) {
            return this.passwordDB.get(username) === password;
        }
        return false;
    }
    backup() {
        fs_1.default.writeFileSync('data/users.json', JSON.stringify(Object.fromEntries(this.passwordDB)));
    }
    register(username, password) {
        if (this.passwordDB.has(username)) {
            return false;
        }
        this.passwordDB.set(username, password);
        const newUser = { username: username, password: password };
        return true;
    }
}
exports.LoginManager = LoginManager;

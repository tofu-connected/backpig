"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_js_1 = __importDefault(require("crypto-js"));
// const hashDigest = sha256(nonce + message);
const express_1 = __importDefault(require("express"));
const client_1 = require("@prisma/client");
const app = (0, express_1.default)();
const port = 3000;
const prisma = new client_1.PrismaClient();
app.use(express_1.default.json());
app.use(express_1.default.static('public'));
function add_user(user_data) {
    return __awaiter(this, void 0, void 0, function* () {
        const passwordSalt = crypto_js_1.default.lib.WordArray.random(128 / 8);
        const passwordHash = crypto_js_1.default.PBKDF2(user_data.password, passwordSalt, { keySize: 256 / 32 });
        const user = yield prisma.user.create({
            data: {
                username: user_data.username,
                email: user_data.email,
                passwordHash: passwordHash.toString(),
                passwordSalt: passwordSalt.toString(),
            },
        });
        return user;
    });
}
function get_user() {
    return __awaiter(this, void 0, void 0, function* () {
        const allUsers = yield prisma.user.findFirst();
        return allUsers;
    });
}
app.get('/', (req, res) => {
    res.send('HAIIII!!!!!😊😊😊😊');
});
app.listen(port, () => {
    console.log(`🚀 Server ready on port ${port}`);
});
app.post('/api/signup/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        /*
        const { error } = validate(req.body);
        if (error) return res.status(400).send(error.details[0].message);
        */
        console.log(req.body);
        const user_data = req.body;
        yield add_user(user_data);
        yield prisma.$disconnect();
        res.send(200);
    }
    catch (error) {
        console.log(error);
        yield prisma.$disconnect();
        res.send("An error occured");
    }
}));
app.post('/api/signin/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield get_user();
    res.send(user);
}));

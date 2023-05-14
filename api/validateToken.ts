// TODO: Middleware token validation from a cookie

// import { PrismaClient } from '@prisma/client';
// import CryptoJS from 'crypto-js/core';

// const prisma = new PrismaClient()

// module.exports = (req: Request, res:Response, next: Function) => {
//     try {
//         const token = req.header("x-auth-token");
//         if (!req.token) return res.status(403).send("Access denied.");

//         req.user = decoded;
//         next();
//     } catch (error) {
//         res.status(400).send("Invalid token");
//     }
// };
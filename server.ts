import CryptoJS from 'crypto-js';

import express, { Express, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const app: Express = express();
const port = 3000

const prisma = new PrismaClient()

app.use(express.json())
app.use(express.static('public'));

type UserSignupData = {
  username: string,
  email: string,
  password: string,
}

async function add_user(user_data: UserSignupData) {
  const passwordSalt = CryptoJS.lib.WordArray.random(128 / 8);
  const passwordHash = CryptoJS.PBKDF2(user_data.password, passwordSalt, { keySize: 256 / 32 });
  const user = await prisma.user.create({
    data: {
      username: user_data.username,
      email: user_data.email,
      passwordHash: passwordHash.toString(),
      passwordSalt: passwordSalt.toString(),
    },
  });
  return user;
}

async function get_user() {
  const allUsers = await prisma.user.findFirst();
  return allUsers;
}

app.get('/', (req: Request, res: Response) => {
  res.send('HAIIII!!!!!😊😊😊😊');
});

app.listen(port, () => {
  console.log(`🚀 Server ready on port ${port}`)
})

app.post('/api/signup/', async (req: Request, res: Response) => {
  try {
    /* 
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message); 
    */
    console.log(req.body);
    const user_data = req.body;
    await add_user(user_data);
    await prisma.$disconnect();
    res.send(200);

  } catch (error) {

    console.log(error);
    await prisma.$disconnect();
    res.send("An error occured");
  }
});

app.post('/api/signin/', async (req: Request, res: Response) => {
  const user = await get_user()
  res.send(user);
});
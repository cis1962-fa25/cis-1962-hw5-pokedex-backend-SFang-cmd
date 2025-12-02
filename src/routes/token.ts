import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

const router = express.Router();

// endpoint to generate a token
router.post('/', (req: Request, res: Response) => {
  const { pennkey } = req.body;

  if (!pennkey) {
    return res.status(400).json({
      code: "BAD_REQUEST",
      error: 'PennKey is required to generate token',
    });
  }

  // generate JWT token, secret should exist in env
  const JWT_SECRET = process.env.JWT_SECRET!;
  const token = jwt.sign({ pennkey }, JWT_SECRET, { expiresIn: '24h' });
  res.json({ token });
});

export default router;
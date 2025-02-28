import { Router, Request, Response } from 'express';

const router = Router();

router.post('/register', async (req: Request, res: Response) => {
  res.send('Register');
});

export default router;

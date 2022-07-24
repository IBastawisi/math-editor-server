import { Router } from 'express';
import isAdmin from '../middlewares/isAdmin';

const router = Router()

import { Document, User } from '../models'

router.get('/me', async (req, res) => {
  const user = req.user;
  res.json(user || null);
})

router.get('/', isAdmin, async (req, res) => {
  const users = await User.findAll({
    include: {
      model: Document,
      attributes: ['id']
    }
  })
  res.json(users)
})

router.get('/:id', isAdmin, async (req, res) => {
  const user = await User.findByPk(req.params.id)
  if (user) {
    res.json(user)
  } else {
    res.status(404).end()
  }
})

router.put('/:id', isAdmin, async (req, res) => {
  const user = await User.findByPk(req.params.id)
  if (user) {
    await user.update(req.body)
    res.json(user)
  } else {
    res.status(404).end()
  }
});

export default router;
import { Router } from 'express';
import isAdmin from '../middlewares/isAdmin';
import 'express-async-errors';
import { validate } from "uuid";

const router = Router()

import { Document, User } from '../models'

router.get('/me', async (req, res) => {
  const userId = (req.user as User)?.id;
  if (!userId) {
    return res.json(null)
  }
  const user = await User.findByPk(userId, {
    attributes: { exclude: ['googleId', 'admin', 'disabled'] },
    include: {
      model: Document,
      attributes: {
        exclude: ['userId', 'data']
      },
    },
    order: [
      ['documents', 'updatedAt', 'DESC']
    ]
  });
  res.json(user);
})

router.get('/', isAdmin, async (req, res) => {
  const users = await User.findAll({
    include: {
      model: Document,
      attributes: {
        exclude: ['userId', 'data']
      },
    },
    order: [
      ['updatedAt', 'DESC'],
      ['documents', 'updatedAt', 'DESC']
    ]
  });
  res.json(users)
})

router.get('/:id', isAdmin, async (req, res) => {
  if (!validate(req.params.id)) {
    return res.status(400).json({
      error: 'invalid id'
    })
  }
  const user = await User.findByPk(req.params.id, {
    include: {
      model: Document,
      attributes: {
        exclude: ['userId', 'data']
      },
    },
    order: [
      ['documents', 'updatedAt', 'DESC']
    ]
  });
  if (user) {
    res.json(user)
  } else {
    res.status(404).json({ error: 'user not found' }).end()
  }
})

router.put('/:id', isAdmin, async (req, res) => {
  const user = await User.findByPk(req.params.id)
  if (user) {
    await user.update(req.body)
    res.json(user)
  } else {
    res.status(404).json({ error: 'user not found' }).end()
  }
});

export default router;
import { Router } from "express";
import { Document, User } from "../models";
import isAuthenticated from "../middlewares/isAuthenticated";
import 'express-async-errors';

const router = Router();

router.get('/', async (req, res) => {
  const documents = await Document.findAll({
    attributes: { exclude: ['userId'] },
    include: {
      model: User,
      attributes: ['name']
    }
  });
  res.json(documents);
});

router.post('/', isAuthenticated, async (req, res, next) => {
  const user = req.user as User;
  if (user.disabled) {
    return res.status(401).json({
      error: 'account disabled, please contact admin'
    })
  }
  const document = await Document.create({ ...req.body, userId: user.id });
  return res.json(document);
});

router.get('/:id', async (req, res) => {
  const document = await Document.findByPk(req.params.id);
  if (document) {
    res.json(document)
  } else {
    res.status(404).end()
  }
});

router.put('/:id', async (req, res) => {
  const document = await Document.findByPk(req.params.id);
  if (document) {
    await document.update(req.body)
    res.json(document)
  } else {
    res.status(404).end()
  }
});

router.delete('/:id', isAuthenticated, async (req, res) => {
  const document = await Document.findByPk(req.params.id);
  const user = req.user as User;

  if (document && document.userId === user.id) {
    await document.destroy();
  }
  res.status(204).end()
});

export default router;
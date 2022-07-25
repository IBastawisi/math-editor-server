import { Router } from "express";
import { Document, User } from "../models";
import isAuthenticated from "../middlewares/isAuthenticated";
import 'express-async-errors';
import isAdmin from "../middlewares/isAdmin";

const router = Router();

router.get('/', isAdmin, async (req, res) => {
  const documents = await Document.findAll({
    attributes: { exclude: ['userId'] },
    include: {
      model: User,
      attributes: ['id', 'name']
    }
  });
  return res.json(documents);
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
    return res.json(document)
  } else {
    res.status(404).end()
  }
});

router.put('/:id', isAuthenticated, async (req, res) => {
  const document = await Document.findByPk(req.params.id);
  const user = req.user as User;
  if (user.disabled) {
    return res.status(401).json({
      error: 'account disabled, please contact admin'
    })
  }
  if (document?.userId !== user.id) {
    return res.status(401).json({
      error: 'you are not allowed to edit this document'
    })
  }
  if (document) {
    await document.update(req.body);
    return res.json(document)
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
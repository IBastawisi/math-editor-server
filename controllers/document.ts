import { Router } from "express";
import { Document, User } from "../models";
import isAuthenticated from "../middlewares/isAuthenticated";
import 'express-async-errors';
import isAdmin from "../middlewares/isAdmin";
import { validate } from "uuid";

const router = Router();

router.get('/', isAdmin, async (req, res) => {
  const documents = await Document.findAll({
    include: {
      model: User,
      attributes: ['name']
    }
  });
  return res.json(documents);
});

router.post('/', isAuthenticated, async (req, res, next) => {
  const user = req.user as User;
  if (user.disabled) {
    return res.status(403).json({
      error: 'account disabled, please contact admin'
    })
  }
  await Document.create({ ...req.body, userId: user.id });
  return res.status(200).end();
});

router.get('/:id', async (req, res) => {
  if (!validate(req.params.id)) {
    return res.status(400).json({
      error: 'invalid id'
    })
  }
  const document = await Document.findByPk(req.params.id, {
    attributes: { exclude: ['userId'] },
  });
  if (document) {
    return res.json(document)
  } else {
    res.status(404).end()
  }
});

router.put('/:id', isAuthenticated, async (req, res) => {
  if (!validate(req.params.id)) {
    return res.status(400).json({
      error: 'invalid id'
    })
  }
  const document = await Document.findByPk(req.params.id);
  const user = req.user as User;
  if (user.disabled) {
    return res.status(403).json({
      error: 'account disabled, please contact admin'
    })
  }
  if (document?.userId !== user.id) {
    return res.status(403).json({
      error: 'you are not allowed to edit this document'
    })
  }
  if (document) {
    await document.update(req.body);
    return res.status(200).end();
  } else {
    res.status(404).end()
  }
});

router.delete('/:id', isAuthenticated, async (req, res) => {
  if (!validate(req.params.id)) {
    return res.status(400).json({
      error: 'invalid id'
    })
  }
  const document = await Document.findByPk(req.params.id);
  const user = req.user as User;
  if(user.disabled) {
    return res.status(403).json({
      error: 'account disabled, please contact admin'
    })
  }
  if (document?.userId !== user.id) {
    return res.status(403).json({
      error: 'you are not allowed to delete this document'
    })
  }
  if (document && document.userId === user.id) {
    await document.destroy();
  }
  res.status(204).end()
});

export default router;
const express = require('express');
const router = express.Router();
const { Task, Tag } = require('../models');

router.post('/', async (req, res) => {
  try {
    const task = await Task.create(req.body);
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const tasks = await Task.findAll({ include: 'tags' });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.id);
    if (!task) return res.status(404).json({ error: 'Tarefa não encontrada' });
    await task.update(req.body);
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.id);
    if (!task) return res.status(404).json({ error: 'Tarefa não encontrada' });
    await task.destroy();
    res.json({ message: 'Tarefa removida com sucesso' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/:id/tags', async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.id);
    if (!task) return res.status(404).json({ error: 'Tarefa não encontrada' });

    const tag = await Tag.findByPk(req.body.tagId);
    if (!tag) return res.status(404).json({ error: 'Tag não encontrada' });

    await task.addTag(tag);
    res.json({ message: 'Tag atrelada à tarefa com sucesso' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:taskId/tags/:tagId', async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.taskId);
    if (!task) return res.status(404).json({ error: 'Tarefa não encontrada' });

    const tag = await Tag.findByPk(req.params.tagId);
    if (!tag) return res.status(404).json({ error: 'Tag não encontrada' });

    await task.removeTag(tag);
    res.json({ message: 'Tag removida da tarefa com sucesso' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/filter', async (req, res) => {
  try {
    const { tags } = req.query;
    if (!tags)
      return res.status(400).json({ error: 'Informe as tags para filtrar' });
    const tagsArray = tags.split(',').map((t) => t.trim());
    const tasks = await Task.findAll({
      include: {
        model: Tag,
        as: 'tags',
        where: { name: tagsArray },
      },
    });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

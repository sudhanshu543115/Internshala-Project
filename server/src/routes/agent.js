import { Router } from 'express';
import { requireRole } from '../middleware/auth.js';
import { Task } from '../models/Task.js';
import { User } from '../models/User.js';

const router = Router();

router.get('/tasks', requireRole('agent'), async (req, res) => {
  const tasks = await Task.find({ assignedTo: req.user.id }).sort({ createdAt: -1 });
  res.json(tasks);
});

router.get('/profile', requireRole('agent'), async (req, res) => {
  const user = await User.findById(req.user.id).select('-password');
  res.json(user);
});

router.put('/profile', requireRole('agent'), async (req, res) => {
  const { name, phone } = req.body;
  const user = await User.findByIdAndUpdate(
    req.user.id,
    { name, phone },
    { new: true }
  ).select('-password');
  res.json(user);
});

export default router;

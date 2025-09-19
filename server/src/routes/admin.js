import { Router } from 'express';
import multer from 'multer';
import * as XLSX from 'xlsx';
import { User } from '../models/User.js';
import { Task } from '../models/Task.js';
import { requireRole } from '../middleware/auth.js';
import { distributeRoundRobin } from '../utils/distribute.js';

const router = Router();
const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    const allowed = ['text/csv', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
    if (allowed.includes(file.mimetype)) return cb(null, true);
    cb(new Error('Only csv, xls, xlsx allowed'));
  },
  limits: { fileSize: 2 * 1024 * 1024 } // 2MB
});

// Create Agent
router.post('/agents', requireRole('admin'), async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;
    if (!name || !email || !phone || !password) return res.status(400).json({ message: 'Missing fields' });
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Email already in use' });
    const agent = await User.create({ name, email, phone, password, role: 'agent' });
    res.status(201).json({ id: agent._id, name: agent.name, email: agent.email, phone: agent.phone, role: agent.role });
  } catch (e) {
    res.status(500).json({ message: 'Failed to create agent' });
  }
});

// List Agents
router.get('/agents', requireRole('admin'), async (req, res) => {
  const agents = await User.find({ role: 'agent', active: true }).select('-password');
  res.json(agents);
});

// Remove Agent (soft delete)
router.delete('/agents/:id', requireRole('admin'), async (req, res) => {
  await User.findByIdAndUpdate(req.params.id, { active: false });
  res.json({ message: 'Agent removed' });
});

// Upload Tasks CSV/XLS/XLSX and distribute equally
router.post('/tasks/upload', requireRole('admin'), upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'File required' });

    const workbook = XLSX.read(req.file.buffer, { type: 'buffer' });
    const firstSheet = workbook.SheetNames[0];
    const raw = XLSX.utils.sheet_to_json(workbook.Sheets[firstSheet], { defval: '' });

    if (!raw.length) return res.status(400).json({ message: 'Empty file' });

    // Normalize headers to be case-insensitive and tolerant of spaces/underscores
    const normalizeKey = (k) => String(k).toLowerCase().replace(/\s+|_/g, '');
    const mapRow = (row) => {
      const mapped = {};
      for (const [k, v] of Object.entries(row)) {
        mapped[normalizeKey(k)] = v;
      }
      return mapped;
    };
    const normalized = raw.map(mapRow);

    const hasCols = (row) =>
      Object.prototype.hasOwnProperty.call(row, 'firstname') &&
      Object.prototype.hasOwnProperty.call(row, 'phone') &&
      Object.prototype.hasOwnProperty.call(row, 'notes');
    if (!hasCols(normalized[0])) {
      return res.status(400).json({
        message: 'Missing required columns. Expected: FirstName, Phone, Notes (case-insensitive; spaces/underscores allowed)'
      });
    }

    const agents = await User.find({ role: 'agent', active: true });
    if (!agents.length) return res.status(400).json({ message: 'No active agents to assign' });

    const items = normalized.map((row) => ({
      firstName: String(row.firstname || '').trim(),
      phone: String(row.phone || '').trim(),
      notes: String(row.notes || '').trim()
    }));

    const batchId = `batch_${Date.now()}`;
    const distribution = distributeRoundRobin(items, agents.map((a) => a._id.toString()));

    const docs = [];
    for (const agentId of Object.keys(distribution)) {
      const list = distribution[agentId];
      for (const item of list) {
        docs.push({ ...item, assignedTo: agentId, batchId });
      }
    }

    await Task.insertMany(docs);

    const perAgentCount = Object.fromEntries(
      Object.entries(distribution).map(([aid, arr]) => [aid, arr.length])
    );

    res.json({ message: 'Uploaded and distributed', batchId, counts: perAgentCount, total: docs.length });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Upload failed' });
  }
});

// Get tasks by batch or all (summary)
router.get('/tasks', requireRole('admin'), async (req, res) => {
  const { batch } = req.query;
  const filter = batch ? { batchId: batch } : {};
  const tasks = await Task.find(filter).populate('assignedTo', 'name email');
  res.json(tasks);
});

export default router;

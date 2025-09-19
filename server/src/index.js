import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import authRoutes from './routes/auth.js';
import adminRoutes from './routes/admin.js';
import agentRoutes from './routes/agent.js';
import { auth } from './middleware/auth.js';
import { seedDefaultAdmin } from './utils/seedAdmin.js';

dotenv.config();

const app = express();
app.use(cors({ origin: process.env.CORS_ORIGIN || 'http://localhost:5173', credentials: true }));
app.use(express.json({ limit: '2mb' }));
app.use(cookieParser());

app.get('/', (req, res) => res.send('Task Manager API running'));

app.use('/api/auth', authRoutes);
app.use('/api/admin', auth(), adminRoutes);
app.use('/api/agent', auth(), agentRoutes);

const PORT = process.env.PORT || 4000;

(async () => {
  try {
    await connectDB(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/task_manager');
    await seedDefaultAdmin();
    app.listen(PORT, () => console.log(`Server listening on http://localhost:${PORT}`));
  } catch (e) {
    console.error('Failed to start server', e);
    process.exit(1);
  }
})();

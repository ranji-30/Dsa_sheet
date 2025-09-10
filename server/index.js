const dotenv = require("dotenv");
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('./models/user');
const Progress = require('./models/Progress');
const Topic = require('./models/Topic');
const Problem = require('./models/Problem');
dotenv.config();

const app = express();
app.use(cors({ origin: process.env.FRONTEND_ORIGIN || '*' }));
app.use(express.json());

// connect
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB Connection Error:", err));

// simple health
app.get('/api/health', (req,res)=> res.json({ ok: true }));

// register
app.post('/api/auth/register', async (req,res)=>{
  const { email, password, name, role } = req.body;
  if(!email || !password) return res.status(400).json({ error: 'email+password required' });

  const exists = await User.findOne({ email });
  if (exists) return res.status(400).json({ error: 'email exists' });

  const hash = await bcrypt.hash(password, 10);

  // role defaults to "student"
  const user = await User.create({ 
    email, 
    passwordHash: hash, 
    name,
    role: role || "student"
  });

  res.json({ id: user._id, email: user.email, name: user.name, role: user.role });
});

// login
app.post('/api/auth/login', async (req,res)=>{
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ error: 'invalid' });

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).json({ error: 'invalid' });

  const token = jwt.sign(
    { id: user._id, email: user.email, role: user.role }, 
    process.env.ACCESS_SECRET,
    { expiresIn: '7d' }
  );

  res.json({
    accessToken: token,
    user: { id: user._id, email: user.email, name: user.name, role: user.role }
  });
});

// ================== AUTH MIDDLEWARE ==================
function auth(req,res,next){
  const h = req.headers.authorization;
  if(!h) return res.status(401).json({ error:'no auth' });
  const token = h.split(' ')[1];
  try {
    const payload = jwt.verify(token, process.env.ACCESS_SECRET);
    req.user = payload;
    next();
  } catch(e) { 
    return res.status(401).json({ error:'invalid token' }); 
  }
}

// restrict to admins only
function adminOnly(req,res,next) {
  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "Admins only" });
  }
  next();
}

// ================== USER PROGRESS ==================
// ================== PROGRESS SUMMARY ==================
app.get('/api/progress/summary', auth, async (req, res) => {
  try {
    const p = await Progress.findOne({ userId: req.user.id }) || { completedProblems: [] };
    const completedIds = p.completedProblems.map(cp => String(cp.problemId));

    const problems = await Problem.find();

    let total = { easy: 0, medium: 0, hard: 0 };
    let done = { easy: 0, medium: 0, hard: 0 };

    problems.forEach(problem => {
      if (problem.level === "easy") total.easy++;
      if (problem.level === "medium") total.medium++;
      if (problem.level === "hard") total.hard++;

      if (completedIds.includes(String(problem._id))) {
        if (problem.level === "easy") done.easy++;
        if (problem.level === "medium") done.medium++;
        if (problem.level === "hard") done.hard++;
      }
    });

    res.json({
      easy: total.easy ? Math.round((done.easy / total.easy) * 100) : 0,
      medium: total.medium ? Math.round((done.medium / total.medium) * 100) : 0,
      hard: total.hard ? Math.round((done.hard / total.hard) * 100) : 0,
    });
  } catch (err) {
    console.error("Progress summary error", err);
    res.status(500).json({ error: "Server error" });
  }
});

app.get('/api/users/me/progress', auth, async (req,res)=>{
  const p = await Progress.findOne({ userId: req.user.id });
  res.json(p || { completedProblems: [] });
});

app.post('/api/users/me/progress', auth, async (req,res)=>{
  const { problemId, completed } = req.body;
  if (!problemId) return res.status(400).json({ error:'problemId required' });
  const q = { userId: req.user.id };
  let p = await Progress.findOne(q);
  if(!p) p = await Progress.create({ userId: req.user.id, completedProblems: [] });

  const idx = p.completedProblems.findIndex(x => String(x.problemId) === String(problemId));
  if (completed) {
    if (idx === -1) p.completedProblems.push({ problemId, completedAt: new Date() });
  } else {
    if (idx !== -1) p.completedProblems.splice(idx, 1);
  }
  p.updatedAt = new Date();
  await p.save();
  res.json({ ok: true, completedProblems: p.completedProblems });
});

// ================== TOPIC ROUTES ==================
// anyone can view
app.get('/api/topics', async (req,res)=>{
  const topics = await Topic.find();
  res.json(topics);
});

// only admins can create
app.post('/api/topics', auth, adminOnly, async (req,res)=>{
  const { name, description } = req.body;
  const topic = await Topic.create({ name, description });
  res.json(topic);
});

// ================== PROBLEM ROUTES ==================
// anyone can view
app.get('/api/topics/:topicId/problems', async (req,res)=>{
  const problems = await Problem.find({ topicId: req.params.topicId });
  res.json(problems);
});

// only admins can create
app.post('/api/topics/:topicId/problems', auth, adminOnly, async (req,res)=>{
  const { title, description, level, youtubeLink, leetcodeLink, articleLink } = req.body;
  const problem = await Problem.create({
    topicId: req.params.topicId,
    title,
    description,
    level,
    youtubeLink,
    leetcodeLink,
    articleLink
  });
  res.json(problem);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=> console.log('Server listening on', PORT));

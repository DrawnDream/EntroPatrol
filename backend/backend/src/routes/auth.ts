import express from 'express';

const router = express.Router();

const mockUsers = [
  { id: 1, username: '123', password: '123', name: '管理员', role: 'admin' }
];

router.post('/login', (req, res) => {
  const { username, password } = req.body;
  
  const user = mockUsers.find(u => u.username === username && u.password === password);
  
  if (user) {
    res.json({
      success: true,
      message: '登录成功',
      data: {
        id: user.id,
        username: user.username,
        name: user.name,
        role: user.role
      }
    });
  } else {
    res.json({
      success: false,
      message: '账号或密码错误'
    });
  }
});

router.post('/logout', (req, res) => {
  res.json({
    success: true,
    message: '退出成功'
  });
});

export default router;
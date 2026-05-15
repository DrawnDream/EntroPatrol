import { useState } from 'react';

function LoginModal({ isOpen, onClose, onLogin }: { isOpen: boolean; onClose: () => void; onLogin: () => void }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !password) {
      setError('请输入用户名和密码');
      return;
    }
    
    setError('');
    
    if (username && password) {
      onLogin();
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="login-overlay" onClick={onClose}>
      <div className="login-modal" onClick={(e) => e.stopPropagation()}>
        <div className="login-header">
          <h2>🌾 智墒巡田</h2>
          <p>请登录以使用完整功能</p>
        </div>
        
        <form onSubmit={handleSubmit}>
          {error && <div className="login-error">{error}</div>}
          
          <div className="form-group">
            <label>用户名</label>
            <input
              type="text"
              className="form-control"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="请输入用户名"
            />
          </div>
          
          <div className="form-group">
            <label>密码</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="请输入密码"
            />
          </div>
          
          <button type="submit" className="login-button">
            登录
          </button>
          
          <div className="login-links">
            <a href="#" onClick={(e) => { e.preventDefault(); setError('忘记密码功能开发中'); }}>忘记密码?</a>
            <a href="#" onClick={(e) => { e.preventDefault(); setError('注册功能开发中'); }}>注册账号</a>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginModal;

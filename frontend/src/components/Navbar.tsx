import { useState } from 'react';

interface NavbarProps {
  currentPage: string;
  onPageChange: (page: string) => void;
  isLoggedIn: boolean;
  onLoginClick: () => void;
}

function Navbar({ currentPage, onPageChange, isLoggedIn, onLoginClick }: NavbarProps) {
  const [showDropdown, setShowDropdown] = useState(false);

  const navItems = [
    { id: 'home', label: '首页' },
    { id: 'dashboard', label: '数据概览' },
    { id: 'soil', label: '土壤数据' },
    { id: 'crop', label: '作物数据' },
    { id: 'weather', label: '微气象数据' },
    { id: 'location', label: '位置信息' },
    { id: 'analysis', label: '数据分析' },
    { id: 'ai', label: 'AI分析' },
  ];

  const handleNavClick = (pageId: string) => {
    if (pageId === 'home' || isLoggedIn) {
      onPageChange(pageId);
    } else {
      onLoginClick();
    }
    setShowDropdown(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <span className="navbar-logo">🌾</span>
        <span className="navbar-title">智墒巡田</span>
      </div>
      
      <div className="navbar-nav">
        {navItems.map((item) => (
          <button
            key={item.id}
            className={`nav-link ${currentPage === item.id ? 'active' : ''}`}
            onClick={() => handleNavClick(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="navbar-right">
        {isLoggedIn ? (
          <div className="user-menu">
            <span className="user-name">管理员</span>
            <button className="logout-btn" onClick={() => onPageChange('home')}>
              退出
            </button>
          </div>
        ) : (
          <button className="login-btn" onClick={onLoginClick}>
            登录
          </button>
        )}
      </div>

      {/* 移动端菜单按钮 */}
      <button 
        className="mobile-menu-btn"
        onClick={() => setShowDropdown(!showDropdown)}
      >
        ☰
      </button>

      {/* 移动端下拉菜单 */}
      {showDropdown && (
        <div className="mobile-dropdown">
          {navItems.map((item) => (
            <button
              key={item.id}
              className={`dropdown-link ${currentPage === item.id ? 'active' : ''}`}
              onClick={() => handleNavClick(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
}

export default Navbar;

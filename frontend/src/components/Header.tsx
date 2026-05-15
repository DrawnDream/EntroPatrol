function Header() {
  return (
    <header className="header">
      <div className="header-content">
        <div>
          <div className="header-title">
            🌾 智墒巡田
          </div>
          <div className="header-subtitle">四足机器人田间智能感知系统</div>
        </div>
        <div className="header-right">
          <div style={{ fontSize: '0.875rem', opacity: 0.9 }}>
            {new Date().toLocaleDateString('zh-CN', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric',
              weekday: 'long'
            })}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
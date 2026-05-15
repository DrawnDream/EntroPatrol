type Page = 'dashboard' | 'soil' | 'crop' | 'weather' | 'location' | 'analysis' | 'ai';

interface SidebarProps {
  currentPage: Page;
  onPageChange: (page: Page) => void;
}

function Sidebar({ currentPage, onPageChange }: SidebarProps) {
  const navItems = [
    { id: 'dashboard' as Page, label: '数据概览', icon: '📊' },
    { id: 'soil' as Page, label: '土壤数据', icon: '🌍' },
    { id: 'crop' as Page, label: '作物数据', icon: '🌱' },
    { id: 'weather' as Page, label: '微气象', icon: '🌤️' },
    { id: 'location' as Page, label: '位置信息', icon: '📍' },
    { id: 'analysis' as Page, label: '数据分析', icon: '📈' },
    { id: 'ai' as Page, label: 'AI分析', icon: '🤖' },
  ];

  return (
    <aside className="sidebar">
      <nav>
        <ul className="sidebar-nav">
          {navItems.map(item => (
            <li key={item.id} className="sidebar-item">
              <button
                className={`sidebar-link ${currentPage === item.id ? 'active' : ''}`}
                onClick={() => onPageChange(item.id)}
              >
                <span className="icon">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
      <div style={{ marginTop: '2rem', paddingTop: '1rem', borderTop: '1px solid #eee' }}>
        <div style={{ fontSize: '0.75rem', color: '#999', textAlign: 'center' }}>
          农业水资源高效利用<br />全国重点实验室
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;

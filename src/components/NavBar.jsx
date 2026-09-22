const ITEMS = [
  { key: 'home', icon: '🏠', label: 'ホーム' },
  { key: 'measure', icon: '📐', label: '新しく測る' },
  { key: 'map', icon: '🗺️', label: 'MAP' },
  { key: 'records', icon: '📋', label: '記録' },
];

export default function NavBar({ current, onNavigate }) {
  return (
    <nav className="bottomnav">
      {ITEMS.map((item) => (
        <button
          key={item.key}
          className={current === item.key ? 'active' : ''}
          onClick={() => onNavigate(item.key)}
        >
          <span className="icon">{item.icon}</span>
          {item.label}
        </button>
      ))}
    </nav>
  );
}

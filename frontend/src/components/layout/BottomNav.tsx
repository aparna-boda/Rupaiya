import { NavLink } from 'react-router-dom';
import { NAV_ITEMS } from '../../constants/copy';
import { Icon } from '../ui/Icon';

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-app bg-bg border-t border-border px-2 py-2 z-50">
      <ul className="flex justify-around items-center">
        {NAV_ITEMS.map((item) => (
          <li key={item.path}>
            <NavLink
              to={item.path}
              className={({ isActive }) =>
                `flex flex-col items-center gap-0.5 px-2 py-1 rounded-md text-[11px] transition-colors ${
                  isActive
                    ? 'text-primary font-medium'
                    : 'text-muted hover:text-secondary-text'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon name={item.icon} size="sm" strokeWidth={isActive ? 2.5 : 2} />
                  <span>{item.label}</span>
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}

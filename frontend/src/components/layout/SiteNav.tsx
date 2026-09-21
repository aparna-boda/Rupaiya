import { useEffect, useRef, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { NAV_ITEMS } from '../../constants/copy';
import { useProfile } from '../../hooks/useProfile';
import BrandLogo from '../brand/BrandLogo';
import ProfileMenu from './ProfileMenu';
import { Icon } from '../ui/Icon';

export default function SiteNav() {
  const { profile } = useProfile();
  const headerRef = useRef<HTMLElement>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;

    const syncHeaderHeight = () => {
      document.documentElement.style.setProperty(
        '--site-header-height',
        `${header.offsetHeight}px`
      );
    };

    syncHeaderHeight();
    const resizeObserver = new ResizeObserver(syncHeaderHeight);
    resizeObserver.observe(header);

    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('scroll', onScroll);
    };
  }, [profile.onboardingComplete]);

  return (
    <header
      ref={headerRef}
      className={`site-header sticky top-0 z-50 border-b border-border bg-bg ${
        scrolled ? 'site-header-scrolled' : ''
      }`}
    >
      <div className="brand-nav-accent" aria-hidden />
      <div className="mx-auto max-w-site px-6 py-3 md:py-3.5">
        <div className="flex items-center justify-between gap-4 min-h-[3rem]">
          <BrandLogo size="md" linkToHome />
          {profile.onboardingComplete && <ProfileMenu />}
        </div>

        {profile.onboardingComplete && (
          <nav aria-label="Main" className="mt-3">
            <ul className="flex flex-wrap items-center gap-1">
              {NAV_ITEMS.map((item) => (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      `inline-flex items-center gap-1.5 px-3 py-2 rounded-md text-sm transition-colors ${
                        isActive
                          ? 'bg-primary text-white font-medium shadow-sm'
                              : 'text-secondary-text border border-transparent hover:bg-[var(--color-hover-bg)] hover:text-[var(--color-hover-text)] hover:border-[var(--color-hover-border)]'
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
        )}
      </div>
    </header>
  );
}

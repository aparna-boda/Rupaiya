import type { ReactNode } from 'react';
import NameCaptureModal from '../features/NameCaptureModal';
import { usePageTitle } from '../../hooks/usePageTitle';
import SiteNav from './SiteNav';
import SiteFooter from './SiteFooter';

interface PageWrapperProps {
  children: ReactNode;
  showNav?: boolean;
  /** Narrow centered column — onboarding, admin login */
  narrow?: boolean;
  /** Browser tab title segment */
  title?: string;
}

export default function PageWrapper({
  children,
  showNav = true,
  narrow = false,
  title,
}: PageWrapperProps) {
  usePageTitle(title);

  return (
    <div className="min-h-screen flex flex-col bg-bg">
      {showNav && (
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[200] focus:px-4 focus:py-2 focus:bg-primary focus:text-white focus:rounded-md focus:text-sm"
        >
          Skip to content
        </a>
      )}
      {showNav && <NameCaptureModal />}
      {showNav && <SiteNav />}
      <main
        id="main-content"
        tabIndex={-1}
        className={`site-main flex-1 w-full mx-auto px-6 pt-10 pb-12 md:px-8 md:pt-12 outline-none ${
          narrow ? 'max-w-content' : 'max-w-site'
        }`}
      >
        {children}
      </main>
      {showNav && <SiteFooter />}
    </div>
  );
}

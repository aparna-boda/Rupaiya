import { useEffect } from 'react';
import { APP_NAME } from '../constants/copy';

export function usePageTitle(title?: string) {
  useEffect(() => {
    document.title = title ? `${title} · ${APP_NAME}` : `${APP_NAME} — How does a rupee earn another rupee?`;
    return () => {
      document.title = `${APP_NAME} — How does a rupee earn another rupee?`;
    };
  }, [title]);
}

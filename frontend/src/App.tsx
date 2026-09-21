import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useProfileStore } from './store/profileStore';
import Onboarding from './pages/Onboarding';

const Home = lazy(() => import('./pages/Home'));
const GrowMoney = lazy(() => import('./pages/GrowMoney'));
const Calculator = lazy(() => import('./pages/Calculator'));
const Learning = lazy(() => import('./pages/Learning'));
const AskAnything = lazy(() => import('./pages/AskAnything'));
const MyPlan = lazy(() => import('./pages/MyPlan'));
const About = lazy(() => import('./pages/About'));
const AdminLogin = lazy(() => import('./pages/AdminLogin'));
const KnowledgeAdmin = lazy(() => import('./pages/KnowledgeAdmin'));

function PageLoader() {
  return (
    <div className="min-h-[50vh] flex items-center justify-center bg-bg">
      <p className="text-sm text-muted">Loading...</p>
    </div>
  );
}

function RequireOnboarding({ children }: { children: React.ReactNode }) {
  const onboardingComplete = useProfileStore((s) => s.profile.onboardingComplete);
  if (!onboardingComplete) {
    return <Navigate to="/onboarding" replace />;
  }
  return <>{children}</>;
}

function RedirectIfOnboarded({ children }: { children: React.ReactNode }) {
  const onboardingComplete = useProfileStore((s) => s.profile.onboardingComplete);
  if (onboardingComplete) {
    return <Navigate to="/home" replace />;
  }
  return <>{children}</>;
}

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route
            path="/onboarding"
            element={
              <RedirectIfOnboarded>
                <Onboarding />
              </RedirectIfOnboarded>
            }
          />
          <Route
            path="/home"
            element={
              <RequireOnboarding>
                <Home />
              </RequireOnboarding>
            }
          />
          <Route
            path="/grow"
            element={
              <RequireOnboarding>
                <GrowMoney />
              </RequireOnboarding>
            }
          />
          <Route
            path="/calculate"
            element={
              <RequireOnboarding>
                <Calculator />
              </RequireOnboarding>
            }
          />
          <Route path="/basics" element={<Navigate to="/learning" replace />} />
          <Route
            path="/learning"
            element={
              <RequireOnboarding>
                <Learning />
              </RequireOnboarding>
            }
          />
          <Route
            path="/ask"
            element={
              <RequireOnboarding>
                <AskAnything />
              </RequireOnboarding>
            }
          />
          <Route
            path="/plan"
            element={
              <RequireOnboarding>
                <MyPlan />
              </RequireOnboarding>
            }
          />
          <Route
            path="/about"
            element={
              <RequireOnboarding>
                <About />
              </RequireOnboarding>
            }
          />
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/knowledge" element={<KnowledgeAdmin />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

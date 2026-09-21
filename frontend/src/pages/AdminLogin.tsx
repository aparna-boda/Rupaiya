import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminLogin } from '../api/client';
import { setAdminSession } from '../hooks/useAdminAuth';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import PageWrapper from '../components/layout/PageWrapper';
import BrandLogo from '../components/brand/BrandLogo';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const { token, expiresAt } = await adminLogin(password);
      setAdminSession(token, expiresAt);
      navigate('/admin/knowledge');
    } catch {
      setError('Invalid password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageWrapper showNav={false} narrow>
      <div className="py-12 max-w-sm mx-auto">
        <BrandLogo size="sm" className="mb-6" />
        <h1 className="text-lg font-medium text-ink mb-1">Admin login</h1>
        <p className="text-sm text-muted mb-6">Knowledge base editor</p>

        <form onSubmit={handleSubmit}>
          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoFocus
          />
          {error && (
            <p className="text-sm mb-4" style={{ color: 'var(--color-risk-3-text)' }}>
              {error}
            </p>
          )}
          <Button type="submit" fullWidth disabled={loading || !password}>
            {loading ? 'Signing in...' : 'Sign in'}
          </Button>
        </form>
      </div>
    </PageWrapper>
  );
}

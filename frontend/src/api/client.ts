import axios from 'axios';
import type { ChatRequest } from '../types/chat';
import type { PlanResponse } from '../types/chat';
import type { UserProfile } from '../types/profile';
import type { Concept, FAQ, Investment, KnowledgeSnapshot } from '../types/knowledge';
import type { SipResult } from '../utils/calculator';
import { getAdminToken } from '../hooks/useAdminAuth';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  headers: { 'Content-Type': 'application/json' },
});

function adminHeaders() {
  const token = getAdminToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function fetchKnowledge(): Promise<KnowledgeSnapshot> {
  const { data } = await api.get<KnowledgeSnapshot>('/api/knowledge');
  return data;
}

export async function fetchAdminKnowledge(): Promise<KnowledgeSnapshot> {
  const { data } = await api.get<KnowledgeSnapshot>('/api/admin/knowledge', {
    headers: adminHeaders(),
  });
  return data;
}

export async function adminLogin(password: string): Promise<{ token: string; expiresAt: string }> {
  const { data } = await api.post<{ token: string; expiresAt: string }>('/api/admin/login', {
    password,
  });
  return data;
}

export async function updateConcept(id: string, payload: Partial<Concept>): Promise<{ version: string }> {
  const { data } = await api.put<{ ok: boolean; version: string }>(
    `/api/admin/concepts/${id}`,
    payload,
    { headers: adminHeaders() }
  );
  return { version: data.version };
}

export async function updateInvestment(
  id: string,
  payload: Partial<Investment>
): Promise<{ version: string }> {
  const { data } = await api.put<{ ok: boolean; version: string }>(
    `/api/admin/investments/${id}`,
    payload,
    { headers: adminHeaders() }
  );
  return { version: data.version };
}

export async function updateFaq(id: string, payload: Partial<FAQ>): Promise<{ version: string }> {
  const { data } = await api.put<{ ok: boolean; version: string }>(
    `/api/admin/faqs/${id}`,
    payload,
    { headers: adminHeaders() }
  );
  return { version: data.version };
}

export async function updateMeta(payload: {
  basicsIntroTitle?: string;
  basicsIntroDescription?: string;
  growIntroTitle?: string;
  growIntroDescription?: string;
}): Promise<{ version: string }> {
  const { data } = await api.put<{ ok: boolean; version: string }>(
    '/api/admin/meta',
    payload,
    { headers: adminHeaders() }
  );
  return { version: data.version };
}

export async function runSeed(force = false): Promise<{ seeded: boolean; counts?: Record<string, number> }> {
  const { data } = await api.post('/api/admin/seed', { force }, { headers: adminHeaders() });
  return data;
}

export async function sendChatMessage(request: ChatRequest): Promise<string> {
  const { data } = await api.post<{ reply: string }>('/api/chat', request);
  return data.reply;
}

export async function generatePlan(userProfile: UserProfile): Promise<PlanResponse> {
  const { data } = await api.post<PlanResponse>('/api/plan', { userProfile });
  return data;
}

export async function calculateSipApi(
  monthly: number,
  ratePercent: number,
  years: number
): Promise<SipResult> {
  const { data } = await api.post<SipResult>('/api/calculate/sip', {
    monthly,
    ratePercent,
    years,
  });
  return data;
}

import { useEffect, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import {
  updateConcept,
  updateFaq,
  updateInvestment,
  updateMeta,
  runSeed,
} from '../api/client';
import { useAdminKnowledge } from '../hooks/useKnowledge';
import { clearAdminSession, isAdminAuthenticated } from '../hooks/useAdminAuth';
import type { Concept, ConceptGroup, FAQ, Investment, KnowledgeSnapshot } from '../types/knowledge';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import PageWrapper from '../components/layout/PageWrapper';
import RichTextEditor from '../components/admin/RichTextEditor';

type Tab = 'concepts' | 'investments' | 'faqs' | 'meta';

const EXAMPLE_KEYS = ['default', 'compounding', 'inflation', 'riskReturn', 'sip', 'diversification'];
const FAQ_CATEGORIES = ['getting-started', 'instruments', 'concepts', 'practical'];

function parseList(value: string): string[] {
  return value.split(',').map((s) => s.trim()).filter(Boolean);
}

function Field({
  label,
  value,
  onChange,
  multiline = false,
  type = 'text',
}: {
  label: string;
  value: string | number | boolean;
  onChange: (v: string) => void;
  multiline?: boolean;
  type?: string;
}) {
  if (type === 'checkbox') {
    return (
      <label className="flex items-center gap-2 mb-4 text-sm">
        <input
          type="checkbox"
          checked={Boolean(value)}
          onChange={(e) => onChange(String(e.target.checked))}
          className="accent-primary"
        />
        {label}
      </label>
    );
  }

  return (
    <div className="mb-4">
      <label className="block text-xs text-muted mb-1">{label}</label>
      {multiline ? (
        <textarea
          value={String(value)}
          onChange={(e) => onChange(e.target.value)}
          rows={3}
          className="w-full bg-sunken border border-border rounded-md px-4 py-3 text-sm focus:outline-none focus:border-primary"
        />
      ) : (
        <input
          type={type}
          value={String(value)}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-sunken border border-border rounded-md px-4 py-3 text-sm focus:outline-none focus:border-primary"
        />
      )}
    </div>
  );
}

export default function KnowledgeAdmin() {
  if (!isAdminAuthenticated()) {
    return <Navigate to="/admin" replace />;
  }

  const navigate = useNavigate();
  const { data, loading, error, refetch } = useAdminKnowledge();
  const [tab, setTab] = useState<Tab>('concepts');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [draft, setDraft] = useState<Concept | Investment | FAQ | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!data) return;
    const items =
      tab === 'concepts' ? data.concepts :
      tab === 'investments' ? data.investments :
      tab === 'faqs' ? data.faqs : [];
    if (items.length && !selectedId) {
      setSelectedId(items[0].id);
    }
  }, [data, tab, selectedId]);

  useEffect(() => {
    if (!data || !selectedId) {
      setDraft(null);
      return;
    }
    if (tab === 'concepts') setDraft(data.concepts.find((c) => c.id === selectedId) ?? null);
    else if (tab === 'investments') setDraft(data.investments.find((i) => i.id === selectedId) ?? null);
    else if (tab === 'faqs') setDraft(data.faqs.find((f) => f.id === selectedId) ?? null);
  }, [data, selectedId, tab]);

  const handleSave = async () => {
    if (!draft) return;
    setSaving(true);
    setMessage(null);
    try {
      if (tab === 'concepts') await updateConcept(draft.id, draft as Concept);
      else if (tab === 'investments') await updateInvestment(draft.id, draft as Investment);
      else if (tab === 'faqs') await updateFaq(draft.id, draft as FAQ);
      setMessage('Saved');
      await refetch();
    } catch {
      setMessage('Save failed — is Supabase configured?');
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(null), 2500);
    }
  };

  const handleSeed = async () => {
    if (!confirm('Run seed? This loads default content into Supabase.')) return;
    try {
      const result = await runSeed(false);
      setMessage(result.seeded ? 'Seeded successfully' : 'Already seeded');
      await refetch();
    } catch {
      setMessage('Seed failed');
    }
  };

  const items =
    tab === 'concepts' ? data?.concepts ?? [] :
    tab === 'investments' ? data?.investments ?? [] :
    tab === 'faqs' ? data?.faqs ?? [] : [];

  return (
    <PageWrapper showNav={false} narrow={false}>
      <div className="py-4 max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-lg font-medium text-ink">Knowledge editor</h1>
          <div className="flex gap-3">
            <Link to="/home" className="text-sm text-primary">← App</Link>
            <button
              className="text-sm text-muted"
              onClick={() => { clearAdminSession(); navigate('/admin'); }}
            >
              Logout
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          <Button onClick={handleSave} disabled={saving || !draft}>
            {saving ? 'Saving...' : message ?? 'Save'}
          </Button>
          <Button variant="ghost" onClick={handleSeed}>Run seed</Button>
        </div>

        {loading && <p className="text-sm text-muted">Loading...</p>}
        {error && <p className="text-sm text-muted">{error}</p>}

        <div className="flex gap-2 mb-4 overflow-x-auto">
          {(['concepts', 'investments', 'faqs', 'meta'] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => { setTab(t); setSelectedId(null); }}
              className={`px-4 py-2 text-sm rounded-md border capitalize ${
                tab === t
                  ? 'bg-primary text-white border-primary'
                  : 'bg-sunken border-border text-muted hover-choice'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {tab === 'meta' && data && (
          <MetaEditor meta={data.meta} onSaved={() => { setMessage('Meta saved'); refetch(); }} />
        )}

        {tab !== 'meta' && (
          <>
            <div className="flex gap-2 overflow-x-auto mb-4">
              {items.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setSelectedId(item.id)}
                  className={`px-3 py-2 text-xs rounded-md border truncate max-w-[140px] ${
                    selectedId === item.id
                      ? 'bg-primary-soft border-primary'
                      : 'bg-sunken border-border hover-choice'
                  }`}
                >
                  {'title' in item ? item.title : 'name' in item ? item.name : item.question}
                </button>
              ))}
            </div>

            {draft && tab === 'concepts' && (
              <Card>
                <ConceptEditor
                  concept={draft as Concept}
                  onChange={setDraft}
                  investments={data?.investments ?? []}
                  groups={data?.groups ?? []}
                />
              </Card>
            )}
            {draft && tab === 'investments' && (
              <Card>
                <InvestmentEditor investment={draft as Investment} onChange={setDraft} concepts={data?.concepts ?? []} />
              </Card>
            )}
            {draft && tab === 'faqs' && (
              <Card>
                <FaqEditor faq={draft as FAQ} onChange={setDraft} />
              </Card>
            )}
          </>
        )}
      </div>
    </PageWrapper>
  );
}

function ConceptEditor({
  concept,
  onChange,
  investments,
  groups,
}: {
  concept: Concept;
  onChange: (c: Concept) => void;
  investments: Investment[];
  groups: ConceptGroup[];
}) {
  const set = (partial: Partial<Concept>) => onChange({ ...concept, ...partial });

  return (
    <>
      <Field label="Title" value={concept.title} onChange={(v) => set({ title: v })} />
      <Field label="Tagline" value={concept.tagline} onChange={(v) => set({ tagline: v })} />
      <div className="mb-4">
        <label className="block text-xs text-muted mb-1">Group</label>
        <select
          value={concept.groupSlug ?? ''}
          onChange={(e) => set({ groupSlug: e.target.value || undefined })}
          className="w-full bg-sunken border border-border rounded-md px-4 py-3 text-sm"
        >
          <option value="">No group</option>
          {groups.map((g) => (
            <option key={g.slug} value={g.slug}>{g.title}</option>
          ))}
        </select>
      </div>
      <label className="block text-xs text-muted mb-1">Explanation</label>
      <RichTextEditor
        content={concept.explanation}
        onChange={(html) => set({ explanation: html })}
        placeholder="Plain-language explanation..."
      />
      <div className="mb-4 mt-4">
        <label className="block text-xs text-muted mb-1">Example key</label>
        <select
          value={concept.exampleKey}
          onChange={(e) => set({ exampleKey: e.target.value as Concept['exampleKey'] })}
          className="w-full bg-sunken border border-border rounded-md px-4 py-3 text-sm"
        >
          {EXAMPLE_KEYS.map((k) => <option key={k} value={k}>{k}</option>)}
        </select>
      </div>
      <Field label="Keywords (comma-separated)" value={concept.keywords.join(', ')}
        onChange={(v) => set({ keywords: parseList(v) })} />
      <div className="mb-4">
        <label className="block text-xs text-muted mb-1">Related investments</label>
        <select
          multiple
          value={concept.relatedInvestmentIds}
          onChange={(e) => set({
            relatedInvestmentIds: Array.from(e.target.selectedOptions, (o) => o.value),
          })}
          className="w-full bg-sunken border border-border rounded-md px-4 py-3 text-sm min-h-[80px]"
        >
          {investments.map((i) => (
            <option key={i.slug} value={i.slug}>{i.name}</option>
          ))}
        </select>
      </div>
      <Field label="Sort order" value={concept.sortOrder} type="number"
        onChange={(v) => set({ sortOrder: Number(v) })} />
      <Field label="Published" value={concept.isPublished ?? true} type="checkbox"
        onChange={(v) => set({ isPublished: v === 'true' })} />
    </>
  );
}

function InvestmentEditor({
  investment,
  onChange,
  concepts,
}: {
  investment: Investment;
  onChange: (i: Investment) => void;
  concepts: Concept[];
}) {
  const set = (partial: Partial<Investment>) => onChange({ ...investment, ...partial });

  return (
    <>
      <Field label="Name" value={investment.name} onChange={(v) => set({ name: v })} />
      <Field label="Tagline" value={investment.tagline} onChange={(v) => set({ tagline: v })} />
      <Field label="Icon" value={investment.icon} onChange={(v) => set({ icon: v })} />
      <Field label="Risk grade (0–4)" value={investment.riskGrade} type="number"
        onChange={(v) => set({ riskGrade: Number(v) as Investment['riskGrade'] })} />
      <Field label="Risk label" value={investment.riskLabel} onChange={(v) => set({ riskLabel: v })} />
      <Field label="Return min %" value={investment.returnMin} type="number"
        onChange={(v) => set({ returnMin: Number(v) })} />
      <Field label="Return max %" value={investment.returnMax} type="number"
        onChange={(v) => set({ returnMax: Number(v) })} />
      <Field label="Return avg %" value={investment.returnAvg} type="number"
        onChange={(v) => set({ returnAvg: Number(v) })} />
      <label className="block text-xs text-muted mb-1 mt-2">Explanation</label>
      <RichTextEditor
        content={investment.explanation}
        onChange={(html) => set({ explanation: html })}
      />
      <Field label="Highlights (comma-separated)" value={investment.highlights.join(', ')}
        onChange={(v) => set({ highlights: parseList(v) })} />
      <Field label="Keywords" value={investment.keywords.join(', ')}
        onChange={(v) => set({ keywords: parseList(v) })} />
      <div className="mb-4">
        <label className="block text-xs text-muted mb-1">Related concepts</label>
        <select
          multiple
          value={investment.relatedConceptIds}
          onChange={(e) => set({
            relatedConceptIds: Array.from(e.target.selectedOptions, (o) => o.value),
          })}
          className="w-full bg-sunken border border-border rounded-md px-4 py-3 text-sm min-h-[80px]"
        >
          {concepts.map((c) => (
            <option key={c.slug} value={c.slug}>{c.title}</option>
          ))}
        </select>
      </div>
      <Field label="Sort order" value={investment.sortOrder} type="number"
        onChange={(v) => set({ sortOrder: Number(v) })} />
      <Field label="Published" value={investment.isPublished ?? true} type="checkbox"
        onChange={(v) => set({ isPublished: v === 'true' })} />
    </>
  );
}

function MetaEditor({
  meta,
  onSaved,
}: {
  meta: KnowledgeSnapshot['meta'];
  onSaved: () => void;
}) {
  const [basicsTitle, setBasicsTitle] = useState(meta.basicsIntro.title);
  const [basicsDesc, setBasicsDesc] = useState(meta.basicsIntro.description);
  const [growTitle, setGrowTitle] = useState(meta.growIntro.title);
  const [growDesc, setGrowDesc] = useState(meta.growIntro.description);

  useEffect(() => {
    setBasicsTitle(meta.basicsIntro.title);
    setBasicsDesc(meta.basicsIntro.description);
    setGrowTitle(meta.growIntro.title);
    setGrowDesc(meta.growIntro.description);
  }, [meta]);

  return (
    <Card>
      <Field label="Learning title" value={basicsTitle} onChange={setBasicsTitle} />
      <Field label="Learning description" value={basicsDesc} onChange={setBasicsDesc} multiline />
      <Field label="Grow Money title" value={growTitle} onChange={setGrowTitle} />
      <Field label="Grow Money description" value={growDesc} onChange={setGrowDesc} multiline />
      <Button variant="secondary" onClick={async () => {
        await updateMeta({
          basicsIntroTitle: basicsTitle,
          basicsIntroDescription: basicsDesc,
          growIntroTitle: growTitle,
          growIntroDescription: growDesc,
        });
        onSaved();
      }}>Save meta</Button>
    </Card>
  );
}

function FaqEditor({ faq, onChange }: { faq: FAQ; onChange: (f: FAQ) => void }) {
  const set = (partial: Partial<FAQ>) => onChange({ ...faq, ...partial });

  return (
    <>
      <Field label="Question" value={faq.question} onChange={(v) => set({ question: v })} />
      <div className="mb-4">
        <label className="block text-xs text-muted mb-1">Category</label>
        <select
          value={faq.category}
          onChange={(e) => set({ category: e.target.value as FAQ['category'] })}
          className="w-full bg-sunken border border-border rounded-md px-4 py-3 text-sm"
        >
          {FAQ_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>
      <Field label="Sort order" value={faq.sortOrder} type="number"
        onChange={(v) => set({ sortOrder: Number(v) })} />
      <Field label="Published" value={faq.isPublished ?? true} type="checkbox"
        onChange={(v) => set({ isPublished: v === 'true' })} />
    </>
  );
}

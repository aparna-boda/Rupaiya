import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useKnowledge } from '../hooks/useKnowledge';
import { useProfile } from '../hooks/useProfile';
import { usePathProgressStore } from '../store/pathProgressStore';
import { getFirstName } from '../utils/formatters';
import { getNextIncompleteStep, getPathProgress } from '../utils/startHerePath';
import { getStepIdsForVisit } from '../utils/pathAutoComplete';
import PageWrapper from '../components/layout/PageWrapper';
import PageHeader from '../components/layout/PageHeader';
import ConceptCard from '../components/features/ConceptCard';
import ConfusedQuiz from '../components/features/ConfusedQuiz';
import GlossaryBrowse from '../components/features/GlossaryBrowse';
import LearningSearch from '../components/features/LearningSearch';
import Card from '../components/ui/Card';
import FlipCard from '../components/ui/FlipCard';
import type { Concept, ConceptGroup } from '../types/knowledge';
import type { UserProfile } from '../types/profile';
import {
  getLearningPath,
  getPathEntry,
  PRIORITY_LABELS,
  PRIORITY_STYLES,
  RISK_LABELS,
  sortGroupsByPath,
  type LearningPriority,
} from '../utils/learningPath';
import { getGroupIcon } from '../utils/icons';
import { scrollIntoViewBelowHeader } from '../utils/scroll';
import { Icon, IconBadge } from '../components/ui/Icon';

const RISK_OPTIONS: UserProfile['riskAppetite'][] = ['safe', 'low', 'medium', 'high'];

function ContinuePathBanner({ firstName }: { firstName: string }) {
  const navigate = useNavigate();
  const completedStepIds = usePathProgressStore((s) => s.completedStepIds);
  const nextStep = getNextIncompleteStep(completedStepIds);
  const { completed, total } = getPathProgress(completedStepIds);

  if (!nextStep?.groupSlug) return null;

  const params = new URLSearchParams({ category: nextStep.groupSlug });
  if (nextStep.conceptSlug) params.set('concept', nextStep.conceptSlug);

  return (
    <Card className="mb-5 border-secondary/25 bg-secondary-soft/50">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-primary mb-1">
            Continue your path · {completed}/{total}
          </p>
          <p className="text-sm font-medium text-ink">
            {firstName ? `${firstName}, up next:` : 'Up next:'} {nextStep.title}
          </p>
          <p className="text-xs text-secondary-text mt-0.5">{nextStep.description}</p>
        </div>
        <button
          type="button"
          onClick={() => navigate(`/learning?${params.toString()}`)}
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2 text-sm font-medium rounded-md bg-primary text-white hover:bg-primary-dark transition-colors shrink-0"
        >
          Continue
          <Icon name="arrow-right" size="sm" />
        </button>
      </div>
    </Card>
  );
}

function PriorityBadge({ priority }: { priority: LearningPriority }) {
  return (
    <span className={`text-[10px] px-2 py-0.5 rounded-pill ${PRIORITY_STYLES[priority]}`}>
      {PRIORITY_LABELS[priority]}
    </span>
  );
}

function CategoryCard({
  group,
  conceptCount,
  priority,
  onOpen,
  isActive = true,
}: {
  group: ConceptGroup;
  conceptCount: number;
  priority?: LearningPriority;
  onOpen: () => void;
  isActive?: boolean;
}) {
  const [flipped, setFlipped] = useState(false);
  const ringClass = priority === 'start' ? 'ring-1 ring-primary/30' : '';

  useEffect(() => {
    if (!isActive) setFlipped(false);
  }, [isActive]);

  return (
    <FlipCard
      flipped={flipped}
      onFlip={() => setFlipped(!flipped)}
      className={ringClass}
      heightClass="h-[200px] min-h-[200px]"
      front={
        <div className="h-full flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between gap-2 mb-1">
              <IconBadge name={getGroupIcon(group.slug)} size="sm" />
              {priority && <PriorityBadge priority={priority} />}
            </div>
            <h3 className="font-medium text-ink text-sm mt-1 leading-snug">{group.title}</h3>
            <span className="text-[10px] px-2.5 py-1 bg-sunken text-muted rounded-pill mt-2 inline-block">
              {conceptCount} concepts
            </span>
          </div>
          <p className="text-[11px] text-muted mt-3 flex items-center gap-1.5">
            <Icon name="rotate" size="xs" className="text-primary" />
            Tap anywhere to turn
          </p>
        </div>
      }
      back={
        <div className="h-full flex flex-col justify-between">
          <div>
            <h3 className="font-medium text-ink text-sm mb-2">{group.title}</h3>
            <p className="text-xs text-secondary-text leading-relaxed">{group.description}</p>
          </div>
          <div className="mt-3 space-y-2">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onOpen();
              }}
              onPointerDown={(e) => e.stopPropagation()}
              className="w-full flex items-center justify-between text-xs font-medium text-primary bg-primary-soft px-3 py-2 rounded-md hover-chip border border-transparent"
            >
              Explore {conceptCount} concepts
              <Icon name="arrow-right" size="xs" />
            </button>
            <p className="text-[11px] text-muted flex items-center gap-1.5">
              <Icon name="rotate" size="xs" className="text-primary" />
              Tap anywhere to turn back
            </p>
          </div>
        </div>
      }
    />
  );
}

function LearningPathGuide({
  risk,
  firstName,
  groupTitles,
  onSelectCategory,
  onRiskChange,
}: {
  risk: UserProfile['riskAppetite'];
  firstName: string;
  groupTitles: Map<string, string>;
  onSelectCategory: (slug: string) => void;
  onRiskChange: (risk: UserProfile['riskAppetite']) => void;
}) {
  const path = getLearningPath(risk);
  const focusEntries = path.filter((e) => e.priority === 'start' || e.priority === 'core');

  return (
    <Card className="mb-5 bg-secondary-soft border-secondary/30">
      <p className="text-xs text-muted mb-2">Your learning path</p>
      <h3 className="font-medium text-ink text-[15px] mb-1">
        {firstName
          ? `${firstName}, focus here first`
          : `Where to concentrate as a ${RISK_LABELS[risk].toLowerCase()}`}
      </h3>
      <p className="text-xs text-secondary-text mb-4 leading-relaxed">
        {risk === 'safe' || risk === 'low'
          ? 'Focus on protection and safe instruments first. Skip stocks and crypto until your foundation is solid.'
          : 'Follow this order — each step builds on the last.'}
      </p>

      <div className="flex flex-wrap gap-2 mb-4">
        {RISK_OPTIONS.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => onRiskChange(option)}
            className={`text-[11px] px-3 py-1.5 rounded-pill border ${
              risk === option
                ? 'bg-primary text-white border-primary'
                : 'bg-bg border-border text-secondary-text hover-choice'
            }`}
          >
            {RISK_LABELS[option]}
          </button>
        ))}
      </div>

      <div className="space-y-2">
        {focusEntries.map((entry, index) => (
          <button
            key={entry.slug}
            type="button"
            onClick={() => onSelectCategory(entry.slug)}
            className="w-full text-left flex gap-3 p-3 rounded-md bg-bg/80 border border-border/60 hover-row"
          >
            <span className="shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-primary-soft text-primary-dark text-xs font-medium">
              {index + 1}
            </span>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-0.5">
                <span className="text-sm font-medium text-ink flex items-center gap-2">
                  <Icon name={getGroupIcon(entry.slug)} size="sm" className="text-primary shrink-0" />
                  {groupTitles.get(entry.slug) ?? entry.slug}
                </span>
                <PriorityBadge priority={entry.priority} />
              </div>
              <p className="text-[11px] text-secondary-text leading-relaxed">{entry.reason}</p>
            </div>
          </button>
        ))}
      </div>
    </Card>
  );
}

export default function Learning() {
  const { data, loading, error } = useKnowledge();
  const { profile, updateProfile } = useProfile();
  const [searchParams] = useSearchParams();
  const [activeCategory, setActiveCategory] = useState<string | null>(
    searchParams.get('category')
  );
  const highlightConceptSlug = searchParams.get('concept');
  const conceptRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  useEffect(() => {
    const category = searchParams.get('category');
    const concept = searchParams.get('concept');
    if (category) {
      setActiveCategory(category);
    } else if (concept && data?.concepts) {
      const match = data.concepts.find((c) => c.slug === concept);
      if (match?.groupSlug) setActiveCategory(match.groupSlug);
    }
  }, [searchParams, data?.concepts]);

  const conceptsByGroup = useMemo(() => {
    if (!data) return new Map<string, Concept[]>();
    const map = new Map<string, Concept[]>();
    for (const concept of data.concepts) {
      const slug = concept.groupSlug ?? 'ungrouped';
      const list = map.get(slug) ?? [];
      list.push(concept);
      map.set(slug, list);
    }
    for (const [, list] of map) {
      list.sort((a, b) => a.sortOrder - b.sortOrder);
    }
    return map;
  }, [data]);

  const sortedGroups = useMemo(() => {
    if (!data?.groups?.length) return [];
    return sortGroupsByPath(
      [...data.groups].sort((a, b) => a.sortOrder - b.sortOrder),
      profile.riskAppetite
    );
  }, [data, profile.riskAppetite]);

  const activeGroup = sortedGroups.find((g) => g.slug === activeCategory);
  const activeConcepts: Concept[] = activeCategory
    ? conceptsByGroup.get(activeCategory) ?? []
    : [];
  const activePathEntry = activeCategory
    ? getPathEntry(profile.riskAppetite, activeCategory)
    : undefined;

  const groupTitles = useMemo(() => {
    const map = new Map<string, string>();
    for (const g of sortedGroups) map.set(g.slug, g.title);
    return map;
  }, [sortedGroups]);

  const markStepComplete = usePathProgressStore((s) => s.markStepComplete);

  useEffect(() => {
    const stepIds = getStepIdsForVisit(activeCategory, highlightConceptSlug);
    for (const id of stepIds) markStepComplete(id);
  }, [activeCategory, highlightConceptSlug, markStepComplete]);

  useEffect(() => {
    if (!highlightConceptSlug || !activeCategory || activeConcepts.length === 0) return;
    const el = conceptRefs.current.get(highlightConceptSlug);
    if (el) {
      const timer = window.setTimeout(() => {
        scrollIntoViewBelowHeader(el);
      }, 300);
      return () => window.clearTimeout(timer);
    }
  }, [highlightConceptSlug, activeCategory, activeConcepts.length]);

  return (
    <PageWrapper title="Learning">
      {loading && <p className="text-sm text-muted">Loading concepts...</p>}
      {error && <p className="text-sm text-muted">{error}</p>}

      {data && (
        <>
          <PageHeader
            title={data.meta.basicsIntro.title}
            description={data.meta.basicsIntro.description}
          />

          {!activeCategory && (
            <>
              <ConfusedQuiz />
              <LearningSearch
                concepts={data.concepts}
                investments={data.investments}
                terms={data.terms ?? []}
              />
              {(data.terms?.length ?? 0) > 0 && (
                <GlossaryBrowse terms={data.terms!} intro={data.meta.glossaryIntro} />
              )}
              <ContinuePathBanner firstName={getFirstName(profile.name)} />
            </>
          )}

          {!activeCategory && (
            <LearningPathGuide
              risk={profile.riskAppetite}
              firstName={getFirstName(profile.name)}
              groupTitles={groupTitles}
              onSelectCategory={setActiveCategory}
              onRiskChange={(risk) => updateProfile({ riskAppetite: risk })}
            />
          )}

          {activeCategory && activeGroup ? (
            <>
              <button
                type="button"
                onClick={() => setActiveCategory(null)}
                className="inline-flex items-center gap-1.5 text-sm text-primary mb-4 px-2 py-1 -ml-2 rounded-md hover-text-link"
              >
                <Icon name="arrow-left" size="sm" />
                All categories
              </button>

              <Card className="mb-5 bg-secondary-soft/60 border-border">
                <div className="flex items-start gap-3">
                  <IconBadge name={getGroupIcon(activeGroup.slug)} size="lg" />
                  <div>
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <h3 className="font-medium text-ink text-[15px]">{activeGroup.title}</h3>
                      {activePathEntry && (
                        <PriorityBadge priority={activePathEntry.priority} />
                      )}
                    </div>
                    <p className="text-xs text-secondary-text leading-relaxed">
                      {activePathEntry?.reason ?? activeGroup.description}
                    </p>
                    <p className="text-[11px] text-muted mt-1">{activeConcepts.length} concepts</p>
                  </div>
                </div>
              </Card>

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {activeConcepts.map((concept, index) => (
                  <div
                    key={concept.id}
                    ref={(el) => {
                      if (el) conceptRefs.current.set(concept.slug, el);
                      else conceptRefs.current.delete(concept.slug);
                    }}
                    className={
                      highlightConceptSlug === concept.slug
                        ? 'ring-2 ring-primary/50 rounded-xl'
                        : undefined
                    }
                  >
                    <ConceptCard
                      concept={concept}
                      investments={data.investments}
                      index={index + 1}
                      isActive
                    />
                  </div>
                ))}
              </div>
            </>
          ) : sortedGroups.length > 0 ? (
            <>
              <p className="text-sm text-muted mb-4">Pick a category to explore</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {sortedGroups.map((group) => {
                  const pathEntry = getPathEntry(profile.riskAppetite, group.slug);
                  return (
                    <CategoryCard
                      key={group.slug}
                      group={group}
                      conceptCount={conceptsByGroup.get(group.slug)?.length ?? 0}
                      priority={pathEntry?.priority}
                      onOpen={() => setActiveCategory(group.slug)}
                      isActive
                    />
                  );
                })}
              </div>
            </>
          ) : (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {data.concepts.map((concept, index) => (
                <ConceptCard
                  key={concept.id}
                  concept={concept}
                  investments={data.investments}
                  index={index + 1}
                  isActive
                />
              ))}
            </div>
          )}
        </>
      )}
    </PageWrapper>
  );
}

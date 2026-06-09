/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { GameCourse } from '../types';
import { 
  Zap, 
  Layers, 
  ArrowLeft, 
  ArrowRight, 
  RotateCcw, 
  Award, 
  BookOpen, 
  Sparkles, 
  Moon, 
  Sun,
  Shield,
  HelpCircle,
  FileText,
  Home,
  Video,
  Table,
  Grid,
  LayoutGrid,
  GitCommit,
  Code,
  FolderLock
} from 'lucide-react';

function SectionVisualSummary({ sect, isDark }: { sect: any; isDark: boolean }) {
  switch (sect.layoutType) {
    case 'text_video': {
      const d = sect.text_video || { text: '', videoUrl: '', caption: '' };
      return (
        <div className="space-y-2 mt-1 text-slate-900 dark:text-zinc-100">
          <p className="text-slate-800 dark:text-zinc-200 text-[11px] font-sans leading-relaxed">{d.text}</p>
          <div className={`p-3 border rounded-xl flex items-center gap-3 ${isDark ? 'bg-zinc-950/80 border-zinc-800' : 'bg-slate-100 border-slate-300'}`}>
            <Video className="w-8 h-8 text-blue-700 dark:text-sky-400 animate-pulse flex-shrink-0" />
            <div className="min-w-0">
              <span className="text-[10px] font-mono font-bold text-blue-800 dark:text-sky-300 block uppercase tracking-wider">Video Training Media</span>
              <p className="text-[9px] font-mono truncate text-slate-700 dark:text-zinc-300">{d.videoUrl || 'Standard Course YouTube Embed'}</p>
              {d.caption && <p className="text-[9px] font-mono italic text-slate-700 dark:text-zinc-400 mt-0.5 truncate">{d.caption}</p>}
            </div>
          </div>
        </div>
      );
    }
    case 'text_table': {
      const d = sect.text_table || { text: '', headers: [], rows: [] };
      return (
        <div className="space-y-2 mt-1 text-slate-900 dark:text-zinc-100">
          <p className="text-slate-800 dark:text-zinc-200 text-[11px] font-sans leading-relaxed">{d.text}</p>
          <div className="overflow-x-auto border rounded-xl border-slate-300 dark:border-zinc-800">
            <table className="w-full text-left text-[10px] font-mono">
              <thead className={isDark ? "bg-zinc-950 text-zinc-300" : "bg-slate-200 text-slate-800"}>
                <tr>
                  {d.headers?.map((h: string, i: number) => (
                    <th key={i} className="px-2.5 py-1.5 font-extrabold uppercase tracking-wider text-[8px]">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-300/60 dark:divide-zinc-800/40">
                {d.rows?.slice(0, 3).map((row: any, rIdx: number) => (
                  <tr key={rIdx} className={isDark ? "bg-zinc-900/30" : "bg-white"}>
                    <td className="px-2.5 py-1.5 font-bold text-amber-900 dark:text-amber-400">{row.col1}</td>
                    <td className="px-2.5 py-1.5 text-slate-800 dark:text-zinc-200">{row.col2}</td>
                    {row.col3 !== undefined && (
                      <td className="px-2.5 py-1.5">
                        <span className={`px-1.5 py-0.2 rounded font-bold text-[8px] ${isDark ? 'bg-blue-950/50 text-blue-400 border border-blue-900' : 'bg-blue-100 text-blue-950'}`}>
                          {row.col3}
                        </span>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );
    }
    case 'cards_grid': {
      const d = sect.cards_grid || { text: '', cards: [] };
      return (
        <div className="space-y-2 mt-1 text-slate-900 dark:text-zinc-100">
          <p className="text-slate-800 dark:text-zinc-200 text-[11px] font-sans leading-relaxed">{d.text}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {d.cards?.map((card: any) => (
              <div key={card.id} className={`p-2.5 rounded-xl border ${isDark ? 'bg-zinc-950 border-zinc-800 shadow-inner' : 'bg-slate-50 border-slate-300 shadow-sm'}`}>
                <div className="flex justify-between items-center text-[8px] font-sans font-bold text-amber-800 dark:text-amber-400 mb-1">
                  <span>{card.badge || 'CARD'}</span>
                  <span className="text-slate-700 dark:text-zinc-400 font-mono font-bold">Concept Note</span>
                </div>
                <h5 className="font-bold text-[10px] text-slate-900 dark:text-zinc-100 truncate mb-0.5">{card.title}</h5>
                <p className="text-slate-800 dark:text-zinc-200 font-mono text-[9px] leading-relaxed border-t border-dashed border-slate-300 dark:border-zinc-800 pt-1 mt-1">{card.backContent}</p>
              </div>
            ))}
          </div>
        </div>
      );
    }
    case 'bento_highlights': {
      const d = sect.bento_highlights || { text: '', boxes: [] };
      return (
        <div className="space-y-2 mt-1 text-slate-900 dark:text-zinc-100">
          <p className="text-slate-800 dark:text-zinc-200 text-[11px] font-sans leading-relaxed">{d.text}</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {d.boxes?.map((box: any) => (
              <div key={box.id} className={`p-2.5 rounded-xl border ${isDark ? 'bg-zinc-950/80 border-zinc-800' : 'bg-white border-slate-300 shadow-sm'}`}>
                <span className="text-[8px] text-slate-700 dark:text-slate-400 block font-mono font-bold uppercase">{box.title}</span>
                {box.value && <span className="text-xs font-bold text-blue-800 dark:text-sky-300 mt-0.5 block">{box.value}</span>}
                <p className="text-[9px] text-slate-800 dark:text-zinc-200 font-mono mt-1 leading-tight">{box.description}</p>
              </div>
            ))}
          </div>
        </div>
      );
    }
    case 'milestone_timeline': {
      const d = sect.milestone_timeline || { text: '', steps: [] };
      return (
        <div className="space-y-2 mt-1 text-slate-900 dark:text-zinc-100">
          <p className="text-slate-800 dark:text-zinc-200 text-[11px] font-sans leading-relaxed">{d.text}</p>
          <div className="relative pl-3.5 border-l-2 border-amber-500/40 space-y-2.5 ml-1.5">
            {d.steps?.map((st: any) => (
              <div key={st.id} className={`relative text-[10px] font-mono p-2 border rounded-lg ${isDark ? 'bg-zinc-900/60 border-zinc-800 text-zinc-100' : 'bg-white border-slate-300 text-slate-800 shadow-sm'}`}>
                <div className="absolute -left-[19.5px] top-2.5 w-3 h-3 rounded-full bg-amber-600 border border-white dark:border-zinc-800 flex items-center justify-center font-bold font-mono text-[7px] text-white">
                  {st.stepNumber}
                </div>
                <div className="flex justify-between items-center mb-0.5">
                  <h5 className="font-bold text-[10px] text-slate-950 dark:text-zinc-100">{st.title}</h5>
                  {st.badgeText && <span className="text-[8px] px-1 bg-amber-100 text-amber-900 border border-amber-300 rounded dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800">{st.badgeText}</span>}
                </div>
                <p className="text-slate-800 dark:text-zinc-200 text-[9px] leading-tight mt-0.5">{st.description}</p>
              </div>
            ))}
          </div>
        </div>
      );
    }
    case 'code_quote_spotlight': {
      const d = sect.code_quote_spotlight || { spotlightText: '', captionTitle: '', languageOrAuthor: '', mainText: '', isCode: false };
      return (
        <div className="space-y-2 mt-1 text-slate-900 dark:text-zinc-100">
          <p className="text-slate-800 dark:text-zinc-200 text-[11px] font-sans leading-relaxed">{d.mainText}</p>
          <div className={`p-2.5 border rounded-xl font-mono ${isDark ? 'bg-zinc-950 border-zinc-800 text-zinc-100' : 'bg-slate-100 border-slate-300 text-slate-900'} text-[9px]`}>
            <div className={`flex justify-between items-center border-b border-dashed pb-1 mb-1 text-[8px] ${isDark ? 'border-zinc-800 text-zinc-400' : 'border-slate-300 text-slate-700'}`}>
              <span className="font-bold">{d.captionTitle || 'Spotlight Material'}</span>
              <span className="uppercase text-amber-800 dark:text-amber-400 font-extrabold">{d.languageOrAuthor}</span>
            </div>
            {d.isCode ? (
              <pre className="text-[9px] overflow-x-auto whitespace-pre-wrap leading-tight text-slate-900 dark:text-zinc-200">
                <code>{d.spotlightText}</code>
              </pre>
            ) : (
              <p className="italic text-slate-800 dark:text-amber-200 py-0.5 font-bold">“{d.spotlightText}”</p>
            )}
          </div>
        </div>
      );
    }
    case 'multi_tab_dive': {
      const d = sect.multi_tab_dive || { text: '', tabs: [] };
      return (
        <div className="space-y-2 mt-1 text-slate-900 dark:text-zinc-100">
          <p className="text-slate-800 dark:text-zinc-200 text-[11px] font-sans leading-relaxed">{d.text}</p>
          <div className="space-y-2">
            {d.tabs?.slice(0, 3).map((t: any) => (
              <div key={t.id} className={`p-2 border rounded-xl ${isDark ? 'bg-zinc-950/80 border-zinc-800 text-zinc-100' : 'bg-white border-slate-300 text-slate-800 shadow-sm'}`}>
                <div className="flex items-center gap-1.5 font-bold text-[10px] text-blue-800 dark:text-sky-300">
                  <span className="px-1.5 py-0.2 text-[8px] font-mono bg-blue-100 text-blue-950 dark:bg-blue-950/40 dark:text-blue-300 rounded uppercase font-extrabold">{t.label}</span>
                  <span className="truncate">{t.title}</span>
                </div>
                <p className="text-[9px] font-mono mt-1 leading-tight text-slate-700 dark:text-zinc-300">{t.content}</p>
              </div>
            ))}
          </div>
        </div>
      );
    }
    case 'qa_accordion': {
      const d = sect.qa_accordion || { text: '', items: [] };
      return (
        <div className="space-y-2 mt-1 text-slate-900 dark:text-zinc-100">
          <p className="text-slate-800 dark:text-zinc-200 text-[11px] font-sans leading-relaxed">{d.text}</p>
          <div className="space-y-1.5">
            {d.items?.map((it: any) => (
              <div key={it.id} className={`p-3 border rounded-xl font-mono text-[10px] ${isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-100' : 'bg-slate-50 border-slate-300 text-slate-800 shadow-sm'}`}>
                <div className="font-extrabold text-slate-900 dark:text-zinc-50 font-sans">Q: {it.trigger}</div>
                <div className="mt-1 text-slate-800 dark:text-zinc-200 leading-relaxed pl-2.5 border-l-2 border-slate-300 dark:border-zinc-700">A: {it.content}</div>
              </div>
            ))}
          </div>
        </div>
      );
    }
    default:
      return null;
  }
}

interface SimulatorPlayerProps {
  course: GameCourse;
  onExit?: () => void;
}

export default function SimulatorPlayer({ course, onExit }: SimulatorPlayerProps) {
  const settings = course.settings;
  const metadata = course.metadata;

  const [isDark, setIsDark] = useState(settings.themeMode === 'dark');

  const currentTheme = settings.colorTheme || 'classic';

  // Retrieve WCAG contrast-safe styling properties dynamically
  const theme = useMemo(() => {
    switch (currentTheme) {
      case 'steel':
        return {
          bgClass: isDark ? 'bg-[#0D131A] text-slate-200' : 'bg-[#F4F7FA] text-slate-800',
          cardBgClass: isDark ? 'bg-[#141C25] border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900',
          panelBgClass: isDark ? 'bg-[#10171F] border-slate-800' : 'bg-slate-50 border-slate-200',
          buttonClass: isDark ? 'bg-sky-500 text-slate-950 hover:bg-sky-400' : 'bg-blue-800 text-white hover:bg-blue-900',
          accentText: isDark ? 'text-sky-300' : 'text-blue-900 font-extrabold', // Deep Navy for light mode contrast
          accentTextRaw: isDark ? 'text-sky-400' : 'text-blue-800',
          progressBarClass: 'bg-gradient-to-r from-blue-600 to-sky-500',
          sidebarActiveCard: isDark ? 'bg-blue-900/40 border-blue-500 text-sky-200 shadow-md' : 'bg-blue-100 border-blue-800 text-blue-950 font-extrabold shadow-sm',
          sidebarUnlockCard: isDark ? 'hover:bg-[#1C2632] bg-[#141C25] border-slate-800 text-slate-100' : 'hover:bg-blue-50/20 bg-white border-slate-200 text-slate-900',
          outlineBorder: isDark ? 'border-slate-800' : 'border-slate-200',
          bannerBadge: isDark ? 'bg-sky-950/45 border-sky-800 text-sky-300' : 'bg-sky-100 border-sky-300 text-sky-950',
          accentBorder: isDark ? 'border-sky-500/30' : 'border-blue-500/20',
          secondaryText: isDark ? 'text-slate-400 font-mono' : 'text-slate-600 font-mono',
          tabActive: 'bg-blue-800 text-white',
          tabInactive: isDark ? 'bg-[#182129] text-slate-400 hover:text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200',
          alertClassBg: isDark ? 'bg-blue-950/25 border-blue-950/30 text-blue-300' : 'bg-blue-50 border-blue-200 text-blue-900'
        };
      case 'forest':
        return {
          bgClass: isDark ? 'bg-[#0B150F] text-zinc-200' : 'bg-[#F1F6F2] text-slate-800',
          cardBgClass: isDark ? 'bg-[#112117] border-emerald-900/60 text-zinc-100' : 'bg-white border-slate-200 text-slate-900',
          panelBgClass: isDark ? 'bg-[#0E1A12] border-[#182C1E]' : 'bg-emerald-50/30 border-slate-200',
          buttonClass: isDark ? 'bg-emerald-500 text-slate-950 hover:bg-emerald-450' : 'bg-emerald-800 text-white hover:bg-emerald-900',
          accentText: isDark ? 'text-emerald-400' : 'text-emerald-900 font-extrabold', // Deep Forest Pine for light mode contrast
          accentTextRaw: isDark ? 'text-emerald-400' : 'text-emerald-800',
          progressBarClass: 'bg-gradient-to-r from-emerald-600 to-green-500',
          sidebarActiveCard: isDark ? 'bg-emerald-900/40 border-emerald-500 text-emerald-200 shadow-md' : 'bg-emerald-50 border-emerald-800 text-emerald-955 font-extrabold shadow-sm',
          sidebarUnlockCard: isDark ? 'hover:bg-[#182F21] bg-[#112117] border-[#182C1E] text-zinc-100' : 'hover:bg-emerald-50/20 bg-white border-slate-200 text-slate-900',
          outlineBorder: isDark ? 'border-[#182C1E]' : 'border-slate-200',
          bannerBadge: isDark ? 'bg-emerald-950/45 border-emerald-800 text-emerald-300' : 'bg-emerald-100 border-emerald-300 text-emerald-950',
          accentBorder: isDark ? 'border-emerald-500/30' : 'border-emerald-500/20',
          secondaryText: isDark ? 'text-zinc-400 font-mono' : 'text-slate-600 font-mono',
          tabActive: 'bg-emerald-700 text-white',
          tabInactive: isDark ? 'bg-[#13261A] text-zinc-400 hover:text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200',
          alertClassBg: isDark ? 'bg-emerald-950/25 border-emerald-950/30 text-emerald-300' : 'bg-emerald-50 border-emerald-200 text-emerald-950'
        };
      case 'classic':
      default:
        return {
          bgClass: isDark ? 'bg-[#262626] text-[#EFEFE8]' : 'bg-[#EFEFE8] text-[#2F3638]',
          cardBgClass: isDark ? 'bg-[#2F3638] border-zinc-700/60 text-[#EFEFE8]' : 'bg-white border-[#6E6E6E]/20 text-[#2F3638]',
          panelBgClass: isDark ? 'bg-[#262626] border-zinc-800' : 'bg-white border-slate-200',
          buttonClass: 'bg-[#002F6C] text-white hover:bg-[#002F6C]/90 focus-visible:ring-1 focus-visible:ring-[#4FC4D4] shadow-sm',
          accentText: isDark ? 'text-[#4FC4D4] font-extrabold' : 'text-[#002F6C] font-extrabold', 
          accentTextRaw: isDark ? 'text-[#4FC4D4]' : 'text-[#002F6C]',
          progressBarClass: 'bg-gradient-to-r from-[#002F6C] to-[#4FC4D4]',
          sidebarActiveCard: isDark ? 'bg-[#2F3638] border-[#4FC4D4] text-[#4FC4D4] shadow-md font-extrabold' : 'bg-white border-[#002F6C] text-[#002F6C] font-extrabold shadow-sm',
          sidebarUnlockCard: isDark ? 'hover:bg-[#2F3638] bg-[#262626] border-zinc-800/80 text-[#EFEFE8]' : 'hover:bg-slate-50 bg-white border-slate-200 text-[#2F3638]',
          outlineBorder: isDark ? 'border-zinc-800' : 'border-slate-200',
          bannerBadge: isDark ? 'bg-[#002F6C]/45 border-[#4FC4D4]/30 text-[#4FC4D4]' : 'bg-[#002F6C]/10 border-[#002F6C]/25 text-[#002F6C]',
          accentBorder: isDark ? 'border-[#4FC4D4]/35' : 'border-[#002F6C]/30',
          secondaryText: isDark ? 'text-zinc-400 font-mono' : 'text-[#6E6E6E] font-mono',
          tabActive: 'bg-[#002F6C] text-white',
          tabInactive: isDark ? 'bg-[#2F3638] text-[#EFEFE8]/75 hover:text-white' : 'bg-slate-100 text-[#2F3638] hover:bg-slate-200 border border-slate-200',
          alertClassBg: isDark ? 'bg-[#002F6C]/25 border-[#002F6C]/30 text-[#4FC4D4]' : 'bg-[#EFEFE8] border-slate-300 text-[#002F6C]'
        };
    }
  }, [currentTheme, isDark]);

  const [step, setStep] = useState<'intro' | 'playing' | 'completed' | 'summary'>('intro');
  const [studentName, setStudentName] = useState('');
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);

  // Score metrics
  const [xp, setXp] = useState(0);
  const [unlockedSections, setUnlockedSections] = useState<string[]>([]);
  const [completedSections, setCompletedSections] = useState<Record<string, boolean>>({});
  const [interactedVideos, setInteractedVideos] = useState<Record<string, boolean>>({});
  const [interactedFlashcards, setInteractedFlashcards] = useState<Record<string, boolean>>({});
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [quizPassed, setQuizPassed] = useState<Record<string, boolean>>({});
  const [quizAttempts, setQuizAttempts] = useState<Record<string, number>>({});

  // Layout states
  const [cardFlips, setCardFlips] = useState<Record<string, boolean>>({});
  const [masteredCards, setMasteredCards] = useState<Record<string, boolean>>({});
  const [activeTabId, setActiveTabId] = useState<string>('');
  const [openAccordionIds, setOpenAccordionIds] = useState<Record<string, boolean>>({});
  const [sectionView, setSectionView] = useState<'content' | 'flashcards' | 'quiz'>('content');

  // Trigger sound effect
  const playBeep = (isSuccess: boolean = true) => {
    if (!settings.soundEffectsEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      if (isSuccess) {
        osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
        osc.frequency.setValueAtTime(880, audioCtx.currentTime + 0.1); // A5
        gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.35);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.35);
      } else {
        osc.frequency.setValueAtTime(180, audioCtx.currentTime);
        gain.gain.setValueAtTime(0.12, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.25);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.25);
      }
    } catch (e) {}
  };

  // Unlock first section on intro
  useEffect(() => {
    if (course.sections.length > 0) {
      setUnlockedSections([course.sections[0].id]);
    }
  }, [course]);

  const currentSection = course.sections[currentSectionIndex];

  // Reset section sub-view on navigation
  useEffect(() => {
    setSectionView('content');
  }, [currentSectionIndex]);

  // Sync tab active state
  useEffect(() => {
    if (currentSection) {
      if (currentSection.layoutType === 'multi_tab_dive' && currentSection.multi_tab_dive?.tabs?.length) {
        setActiveTabId(currentSection.multi_tab_dive.tabs[0].id);
      }
    }
  }, [currentSectionIndex, currentSection]);

  // Calculations
  const totalPossibleQuizCount = useMemo(() => {
    return course.sections.reduce((total, s) => total + (s.questions?.length || 0), 0);
  }, [course]);

  const correctQuizCount = useMemo(() => {
    return Object.values(quizPassed).filter(p => p === true).length;
  }, [quizPassed]);

  const scorePercentage = useMemo(() => {
    if (totalPossibleQuizCount === 0) return 100;
    return Math.min(100, Math.round((correctQuizCount / totalPossibleQuizCount) * 100));
  }, [correctQuizCount, totalPossibleQuizCount]);

  const currentLevel = useMemo(() => {
    return Math.floor(xp / 400) + 1;
  }, [xp]);

  const startCourse = () => {
    if (settings.askForStudentName && !studentName.trim()) {
      alert("Please enter a name to register course enrollment.");
      return;
    }
    playBeep(true);
    setStep('playing');
  };

  const nextSlide = () => {
    // Award 100 XP uniquely for completing this section
    const secId = currentSection?.id;
    if (secId && !completedSections[secId]) {
      setCompletedSections(prev => ({ ...prev, [secId]: true }));
      setXp(px => px + 100);
    }

    if (currentSectionIndex < course.sections.length - 1) {
      const nextIndex = currentSectionIndex + 1;
      const nextSectionId = course.sections[nextIndex].id;

      if (!unlockedSections.includes(nextSectionId)) {
        setUnlockedSections(prev => [...prev, nextSectionId]);
      }

      playBeep(true);
      setCurrentSectionIndex(nextIndex);
    } else {
      playBeep(true);
      setStep('completed');
    }
  };

  const prevSlide = () => {
    if (currentSectionIndex > 0) {
      setCurrentSectionIndex(currentSectionIndex - 1);
    }
  };

  const handleAnswerQuiz = (questionId: string, selectedIdx: number, correctIdx: number) => {
    if (quizPassed[questionId]) return;

    setQuizAnswers(prev => ({ ...prev, [questionId]: selectedIdx }));
    const isCorrect = (selectedIdx === correctIdx);
    const priorAttempts = quizAttempts[questionId] || 0;
    setQuizAttempts(prev => ({ ...prev, [questionId]: priorAttempts + 1 }));

    if (isCorrect) {
      playBeep(true);
      setQuizPassed(prev => ({ ...prev, [questionId]: true }));
      const award = priorAttempts === 0 ? 200 : 100;
      setXp(p => p + award);

      if (settings.autoProgress) {
        setTimeout(() => {
          const allDone = currentSection.questions.every(
            q => q.id === questionId || quizPassed[q.id]
          );
          if (allDone) {
            nextSlide();
          }
        }, 1200);
      }
    } else {
      playBeep(false);
      setQuizPassed(prev => ({ ...prev, [questionId]: false }));
    }
  };

  const printCertificate = () => {
    playBeep(true);
    document.body.classList.add('print-certificate-only');
    window.print();
    setTimeout(() => {
      document.body.classList.remove('print-certificate-only');
    }, 500);
  };

  const printReferenceSummary = () => {
    playBeep(true);
    document.body.classList.add('print-reference-only');
    window.print();
    setTimeout(() => {
      document.body.classList.remove('print-reference-only');
    }, 500);
  };

  const hasPassed = settings.questionsRequired === false ? true : (scorePercentage >= (settings.passingScorePercent || 80));

  // Layout Renderings
  const renderLayout = () => {
    if (!currentSection) return <p className="text-slate-650 dark:text-zinc-300 font-medium font-mono text-xs">Add sections to start previewing.</p>;

    switch (currentSection.layoutType) {
      case 'text_video': {
        const d = currentSection.text_video || { text: '', videoUrl: '', caption: '' };
        return (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-7 space-y-3">
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{d.text || 'Provide course narrative text...'}</p>
            </div>
            <div className="lg:col-span-5 border rounded-xl overflow-hidden bg-slate-950/20 border-slate-700/20">
              {d.videoUrl ? (
                <div>
                  <div className="relative pb-[56.25%] h-0">
                    <iframe
                      src={d.videoUrl}
                      className="absolute top-0 left-0 w-full h-full border-0"
                      allowFullScreen
                    />
                  </div>
                  <div className="p-2.5 flex items-center justify-between bg-slate-900/10 dark:bg-zinc-900/40 border-t border-slate-700/20">
                    <button
                      onClick={() => {
                        const key = currentSection.id;
                        if (!interactedVideos[key]) {
                          setInteractedVideos(prev => ({ ...prev, [key]: true }));
                          setXp(p => p + 50);
                          playBeep(true);
                        }
                      }}
                      className={`text-[10px] font-mono font-bold px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                        interactedVideos[currentSection.id]
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-blue-600 hover:bg-blue-500 text-white shadow-sm'
                      }`}
                    >
                      {interactedVideos[currentSection.id] ? 'Video Interacted (+50 XP)' : 'Mark Video Interacted (+50 XP)'}
                    </button>
                    <span className={`text-[9px] font-mono ${isDark ? 'text-zinc-400' : 'text-slate-600 font-bold'}`}>Earn point rewards</span>
                  </div>
                </div>
              ) : (
                <div className={`p-8 text-center text-xs italic ${isDark ? 'text-zinc-400' : 'text-slate-600 font-medium'}`}>No YouTube Video Embed configured</div>
              )}
              {d.caption && <p className={`p-2.5 text-[10px] font-mono border-t border-slate-700/20 ${isDark ? 'text-zinc-300' : 'text-slate-700 font-bold'}`}>{d.caption}</p>}
            </div>
          </div>
        );
      }

      case 'text_table': {
        const d = currentSection.text_table || { text: '', headers: [], rows: [] };
        return (
          <div className="space-y-4">
            <p className="text-sm leading-relaxed">{d.text}</p>
            <div className="overflow-x-auto border rounded-xl divide-y border-slate-200 dark:border-zinc-800">
              <table className="w-full text-left text-xs font-mono">
                <thead className={isDark ? "bg-slate-900 text-slate-300" : "bg-slate-100 text-slate-700"}>
                  <tr>
                    {d.headers?.map((h, i) => (
                      <th key={i} className="px-4 py-2.5 font-bold uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/10">
                  {d.rows?.map((row, rIdx) => {
                    let bCol = isDark ? "bg-slate-400/10 text-slate-300" : "bg-slate-100 border border-slate-200 text-slate-700";
                    if (row.badgeType === 'success') bCol = isDark ? "bg-emerald-500/10 text-emerald-400" : "bg-emerald-50 text-emerald-700 border border-emerald-100";
                    if (row.badgeType === 'warning') bCol = isDark ? "bg-amber-500/10 text-amber-450" : "bg-amber-50 text-amber-800 border border-amber-200";
                    if (row.badgeType === 'danger') bCol = isDark ? "bg-rose-500/10 text-rose-400" : "bg-rose-50 text-rose-705 border border-rose-150";
                    if (row.badgeType === 'info') bCol = isDark ? "bg-blue-500/10 text-blue-400" : "bg-blue-50 text-blue-700 border border-blue-150";

                    return (
                      <tr key={rIdx} className={isDark ? "hover:bg-slate-800/20" : "hover:bg-slate-100/50"}>
                        <td className="px-4 py-3 font-semibold text-amber-550">{row.col1}</td>
                        <td className="px-4 py-3 opacity-90">{row.col2}</td>
                        {row.col3 !== undefined && (
                          <td className="px-4 py-3">
                            <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${bCol}`}>{row.col3}</span>
                          </td>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        );
      }

      case 'cards_grid': {
        const d = currentSection.cards_grid || { text: '', cards: [] };
        return (
          <div className="space-y-4">
            <p className="text-sm leading-relaxed">{d.text}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {d.cards?.map((card) => {
                const flipped = !!cardFlips[card.id];
                const studied = !!masteredCards[card.id];

                return (
                  <div
                    key={card.id}
                    onClick={() => {
                      setCardFlips(p => ({ ...p, [card.id]: !flipped }));
                      if (!studied) {
                        setMasteredCards(p => ({ ...p, [card.id]: true }));
                        setXp(x => x + 25);
                        playBeep(true);
                      }
                    }}
                    className="relative h-40 cursor-pointer rounded-xl perspective-1000 select-none"
                  >
                    <div className={`w-full h-full duration-500 transform-style-3d relative transition-transform ${flipped ? 'rotate-y-180' : ''}`}>
                      <div className={`absolute inset-0 rounded-xl p-4 border flex flex-col justify-between backface-hidden shadow-sm ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                        <div className="flex justify-between items-center text-[10px] font-mono">
                          {card.badge ? <span className="text-amber-500 font-bold uppercase">{card.badge}</span> : <span />}
                          {studied && <span className="text-emerald-400 font-semibold">✔ Studied</span>}
                        </div>
                        <h4 className="font-bold text-xs md:text-sm tracking-tight">{card.title}</h4>
                        <span className="text-[10px] font-mono text-slate-600 dark:text-zinc-400 text-right mt-auto">Click to flip</span>
                      </div>
                      <div className={`absolute inset-0 rounded-xl p-4 border flex flex-col justify-between backface-hidden rotate-y-180 shadow-md ${isDark ? 'bg-amber-950/20 border-amber-900/50 text-amber-200' : 'bg-amber-50 border-amber-200 text-amber-900'}`}>
                        <p className="text-xs leading-relaxed overflow-y-auto">{card.backContent}</p>
                        <span className="text-[9px] font-mono text-right text-amber-800/80 dark:text-amber-200/80">Flip back</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      }

      case 'bento_highlights': {
        const d = currentSection.bento_highlights || { text: '', boxes: [] };
        return (
          <div className="space-y-4">
            <p className="text-sm leading-relaxed">{d.text}</p>
            <div className="grid grid-cols-1 sm:grid-cols-6 gap-4 auto-rows-[160px]">
              {d.boxes?.map((box) => {
                let colSpan = "sm:col-span-2";
                if (box.size === 'medium') colSpan = "sm:col-span-3";
                if (box.size === 'large') colSpan = "sm:col-span-4";

                let boxStyle = "bg-slate-900 border-slate-800 text-slate-100";
                let textValAccent = "text-blue-400";
                
                if (box.colorPreset === 'emerald') {
                  boxStyle = isDark ? "bg-emerald-950/20 border-emerald-900/50 text-emerald-200" : "bg-emerald-50 border-emerald-200 text-emerald-900";
                  textValAccent = "text-emerald-500";
                } else if (box.colorPreset === 'amber') {
                  boxStyle = isDark ? "bg-amber-950/20 border-amber-900/50 text-amber-200" : "bg-amber-50 border-amber-200 text-amber-900";
                  textValAccent = "text-amber-500";
                } else if (box.colorPreset === 'rose') {
                  boxStyle = isDark ? "bg-rose-950/20 border-rose-900/50 text-rose-200" : "bg-rose-50 border-rose-200 text-rose-900";
                  textValAccent = "text-rose-500";
                } else if (box.colorPreset === 'blue') {
                  boxStyle = isDark ? "bg-blue-950/20 border-blue-900/50 text-blue-200" : "bg-blue-50 border-blue-200 text-blue-900";
                  textValAccent = "text-blue-500";
                } else if (isDark) {
                  boxStyle = "bg-slate-900 border-slate-800 text-slate-100";
                  textValAccent = "text-amber-500";
                } else {
                  boxStyle = "bg-white border-slate-200 text-slate-800";
                  textValAccent = "text-slate-900 font-extrabold";
                }

                return (
                  <div key={box.id} className={`rounded-xl border p-4 flex flex-col justify-between shadow-sm relative overflow-hidden transition-all duration-300 ${colSpan} ${boxStyle}`}>
                    <div>
                      <span className={`text-[10px] font-mono tracking-wider uppercase font-bold ${isDark ? 'text-zinc-400' : 'text-slate-700'}`}>{box.title}</span>
                      {box.value && <h4 className={`text-lg md:text-xl font-bold tracking-tight mt-1 ${textValAccent}`}>{box.value}</h4>}
                    </div>
                    <p className={`text-[11px] leading-relaxed mt-2 ${isDark ? 'text-zinc-200' : 'text-slate-900 font-medium'}`}>{box.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        );
      }

      case 'milestone_timeline': {
        const d = currentSection.milestone_timeline || { text: '', steps: [] };
        return (
          <div className="space-y-4">
            <p className="text-sm leading-relaxed">{d.text}</p>
            <div className="relative pl-6 md:pl-8 border-l border-amber-500/25 space-y-6 py-1 ml-3">
              {d.steps?.map((st) => (
                <div key={st.id} className="relative group">
                  <div className="absolute -left-[30px] md:-left-[40px] top-1 w-5 h-5 md:w-6 md:h-6 rounded-full border bg-slate-950 border-amber-500 flex items-center justify-center font-bold font-mono text-[9px] md:text-xs text-amber-400">
                    {st.stepNumber}
                  </div>
                  <div className={`p-4 rounded-xl border ${isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200'}`}>
                    <div className="flex justify-between items-center flex-wrap gap-2 mb-1">
                      <h4 className="font-bold text-xs md:text-sm">{st.title}</h4>
                      {st.badgeText && <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">{st.badgeText}</span>}
                    </div>
                    <p className="text-xs opacity-80 leading-relaxed font-mono">{st.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      }

      case 'code_quote_spotlight': {
        const d = currentSection.code_quote_spotlight || { spotlightText: '', captionTitle: '', languageOrAuthor: '', mainText: '', isCode: false };
        return (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-6 space-y-3">
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{d.mainText}</p>
            </div>
            <div className="lg:col-span-6 border rounded-xl overflow-hidden bg-zinc-950 text-zinc-100 border-zinc-800 shadow-lg">
              <div className="px-4 py-2 bg-zinc-900 border-b border-zinc-800 flex justify-between items-center text-[10px] font-mono text-zinc-400">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-rose-500" />
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="ml-1 text-[9px]">{d.captionTitle || 'Console'}</span>
                </span>
                <span className="uppercase text-amber-400">{d.languageOrAuthor || 'text'}</span>
              </div>
              <div className="p-4 overflow-x-auto">
                {d.isCode ? (
                  <pre className="text-xs font-mono whitespace-pre-wrap text-zinc-200">
                    <code>{d.spotlightText}</code>
                  </pre>
                ) : (
                  <div className="italic text-base md:text-lg text-amber-200 text-center py-2">
                    “{d.spotlightText}”
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      }

      case 'multi_tab_dive': {
        const d = currentSection.multi_tab_dive || { text: '', tabs: [] };
        const selected = d.tabs?.find(t => t.id === activeTabId) || d.tabs?.[0];
        return (
          <div className="space-y-4">
            <p className="text-sm leading-relaxed">{d.text}</p>
            <div className={`flex flex-wrap gap-1.5 border-b pb-2 ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
              {d.tabs?.map((t) => {
                const act = t.id === activeTabId;
                return (
                  <button
                    key={t.id}
                    onClick={() => setActiveTabId(t.id)}
                    className={`px-3 py-1.5 text-[11px] font-mono font-bold rounded-lg transition-all ${
                      act 
                        ? (isDark ? 'bg-amber-400 text-slate-950' : 'bg-slate-900 text-white')
                        : (isDark ? 'bg-slate-900 text-slate-400 hover:text-slate-100' : 'bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200')
                    }`}
                  >
                    {t.label}
                  </button>
                );
              })}
            </div>
            {selected && (
              <div className={`p-4 rounded-xl border ${isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                <h4 className="font-bold text-xs md:text-sm text-amber-500 mb-1.5">{selected.title}</h4>
                <p className="text-xs leading-relaxed mb-3 opacity-90">{selected.content}</p>
                {selected.sublist?.length ? (
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono uppercase text-slate-600 dark:text-zinc-400 font-bold block">Attributes:</span>
                    <ul className="list-disc list-inside text-[10px] font-mono space-y-1 opacity-80 pl-1">
                      {selected.sublist.map((sub, sidx) => (
                        <li key={sidx}>{sub}</li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </div>
            )}
          </div>
        );
      }

      case 'qa_accordion': {
        const d = currentSection.qa_accordion || { text: '', items: [] };
        return (
          <div className="space-y-4">
            <p className="text-sm leading-relaxed">{d.text}</p>
            <div className="space-y-2">
              {d.items?.map((it) => {
                const open = !!openAccordionIds[it.id];
                return (
                  <div key={it.id} className={`border rounded-xl overflow-hidden ${isDark ? 'border-slate-800 bg-slate-900/50' : 'border-slate-200 bg-white'}`}>
                    <button
                      onClick={() => setOpenAccordionIds(p => ({ ...p, [it.id]: !open }))}
                      className={`w-full text-left px-4 py-3 text-xs font-bold flex justify-between items-center ${isDark ? 'hover:bg-slate-800' : 'hover:bg-slate-50'}`}
                    >
                      <span>{it.trigger}</span>
                      <span className="text-amber-500 font-mono text-[10px]">{open ? '▲' : '▼'}</span>
                    </button>
                    {open && (
                      <div className="px-4 pb-4 pt-1 text-xs leading-relaxed opacity-85 border-t border-slate-800/10 font-mono">
                        {it.content}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      }

      default:
        return <p className="text-xs italic">Select a layout from the editor to review.</p>;
    }
  };

  if (step === 'intro') {
    return (
      <div className={`min-h-[500px] flex items-center justify-center p-6 rounded-2xl relative transition-colors duration-200 ${theme.bgClass}`}>
        <div className={`absolute top-4 right-4 z-10 flex gap-2 no-print`}>
          <button
            onClick={() => setIsDark(!isDark)}
            className={`px-3 py-1.5 text-xs rounded-lg border font-mono transition-all flex items-center gap-1.5 ${isDark ? 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}
          >
            {isDark ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
            <span>{isDark ? 'Light Mode' : 'Dark Mode'}</span>
          </button>
          {onExit && (
            <button
              onClick={onExit}
              className="px-3 py-1.5 text-xs rounded-lg bg-rose-500 hover:bg-rose-600 text-white font-mono transition-all"
            >
              Exit
            </button>
          )}
        </div>

        <div className={`max-w-md w-full p-8 border shadow-xl rounded-2xl space-y-6 transition-all duration-300 ${theme.cardBgClass}`}>
          <div className="space-y-2">
            <span className={`text-[10px] uppercase tracking-wider border px-2.5 py-0.5 rounded font-mono font-semibold block w-max ${theme.bannerBadge}`}>Simulator Player Mode</span>
            <h1 className="text-xl md:text-2xl font-black font-sans tracking-tight">{metadata.title || 'Untitled Training'}</h1>
            <p className={`text-[10px] font-mono ${isDark ? 'text-zinc-400' : 'text-slate-700 font-medium'}`}>Version {metadata.version || '1.0.0'} • Publication: {metadata.publicationDate || 'Today'}</p>
          </div>

          <p className={`text-xs leading-relaxed ${isDark ? 'text-zinc-200' : 'text-slate-800 font-medium'}`}>{metadata.description || 'No description supplied. Add section detail in the editor.'}</p>

          <div className={`p-3 border rounded-xl flex items-center gap-2.5 font-mono text-[11px] ${
            isDark ? 'bg-zinc-950/40 border-zinc-900/60' : 'bg-slate-50 border-slate-200/60'
          }`}>
            <Shield className="w-4 h-4 text-blue-600 flex-shrink-0" />
            <div>
              <span className={isDark ? 'text-zinc-400' : 'text-slate-600 font-bold'}>Publisher & Owner:</span>
              <strong className={`block ${isDark ? 'text-zinc-100' : 'text-slate-900 font-extrabold'}`}>{metadata.owner || 'Internal Corporate Publisher'}</strong>
            </div>
          </div>

          {settings.askForStudentName && (
            <div className="space-y-1.5">
              <label className="text-[10px] font-mono uppercase tracking-wider block opacity-70">Enroll Student Name:</label>
              <input
                type="text"
                placeholder="e.g. Marie Robbins"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                className={`w-full px-3.5 py-2 border rounded-xl font-mono text-xs focus:ring-2 focus:ring-blue-600 outline-none transition-all ${
                  isDark ? 'bg-zinc-950 border-zinc-800 text-white focus:border-zinc-700' : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-slate-300'
                }`}
              />
            </div>
          )}

          <div className="pt-2 flex gap-2">
            <button
              onClick={startCourse}
              className={`flex-grow py-3 px-4 flex items-center justify-center gap-1.5 font-bold font-mono text-xs uppercase text-white rounded-xl transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg cursor-pointer ${theme.buttonClass}`}
            >
              <span>Start Course</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            {settings.allowHomeSummaryAccess && (
              <button
                onClick={() => {
                  playBeep(true);
                  setStep('summary');
                }}
                className={`px-4 py-3 font-mono font-bold uppercase text-xs rounded-xl border transition-all hover:-translate-y-0.5 hover:shadow-md cursor-pointer flex items-center gap-1.5 ${
                  isDark ? 'bg-zinc-800 hover:bg-zinc-700 border-zinc-700 text-zinc-300' : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-800'
                }`}
                title="Bypass straight to Course summary reference sheet"
              >
                <span>Summary</span>
                <Zap className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (step === 'playing') {
    const totalSlides = course.sections.length;
    const widthPercent = totalSlides === 0 ? 0 : Math.round(((currentSectionIndex + 1) / totalSlides) * 100);

    const getLayoutIcon = (type: string) => {
      switch (type) {
        case 'text_video': return <Video className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />;
        case 'text_table': return <Table className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />;
        case 'cards_grid': return <Grid className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />;
        case 'bento_highlights': return <LayoutGrid className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />;
        case 'milestone_timeline': return <GitCommit className="w-3.5 h-3.5 text-pink-600 dark:text-pink-400" />;
        case 'code_quote_spotlight': return <Code className="w-3.5 h-3.5 text-cyan-650 dark:text-cyan-400" />;
        case 'multi_tab_dive': return <FolderLock className="w-3.5 h-3.5 text-indigo-650 dark:text-indigo-450" />;
        case 'qa_accordion': return <HelpCircle className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />;
        default: return <BookOpen className="w-3.5 h-3.5 text-slate-500" />;
      }
    };

    return (
      <div className={`lg:h-[780px] h-auto flex flex-col justify-between border rounded-2xl overflow-hidden shadow-2xl transition-all duration-300 ${theme.bgClass} ${theme.outlineBorder}`}>
        
        {/* STATS HEADER */}
        <header className={`px-5 py-3 flex justify-between items-center border-b flex-shrink-0 ${isDark ? 'bg-zinc-900/80 border-zinc-800' : 'bg-white border-slate-200'}`}>
          <div className="flex items-center gap-3 truncate max-w-sm">
            <button
              onClick={() => {
                playBeep(true);
                setStep('intro');
              }}
              className={`px-3.5 py-1.5 border flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-tight rounded-xl transition-all cursor-pointer ${
                isDark ? 'bg-zinc-800 border-zinc-700 text-zinc-200 hover:bg-zinc-700' : 'bg-[#FAF9F6] border-slate-300 text-slate-800 hover:bg-slate-100'
              }`}
              title="Go back to landing page"
              aria-label="Go back to course landing page"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Home</span>
            </button>
            <div className="flex items-center gap-1.5 truncate">
              <Award className="w-4.5 h-4.5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
              <h4 className="text-xs font-black uppercase tracking-tight truncate font-sans">{metadata.title || 'Studio Interactive Sandbox'}</h4>
            </div>
          </div>
          <div className="flex items-center gap-2 font-mono text-xs flex-shrink-0 select-none">
            <span className="px-2.5 py-0.5 border rounded-lg border-blue-600/30 bg-blue-100/55 dark:bg-blue-950/40 text-blue-800 dark:text-blue-300 font-extrabold uppercase text-[9px]">Lvl {currentLevel}</span>
            <div className="flex items-center gap-1 text-slate-700 dark:text-zinc-200">
              <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span className="text-blue-800 dark:text-blue-300 font-extrabold">{xp} XP</span>
            </div>
            <button
              onClick={() => setIsDark(!isDark)}
              className="p-1 rounded opacity-75 hover:opacity-100 cursor-pointer"
              aria-label="Toggle dark mode"
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-slate-700" />}
            </button>
            {onExit && (
              <button
                onClick={onExit}
                className="ml-2 text-rose-500 hover:text-rose-400 font-bold uppercase text-[10px] border border-transparent hover:border-rose-500/20 px-2 py-1 rounded-lg"
                aria-label="Exit simulator"
              >
                Exit ✖
              </button>
            )}
          </div>
        </header>

        {/* WORKSPACE */}
        <div className="flex-1 p-4 md:p-5 grid grid-cols-1 md:grid-cols-12 gap-5 items-stretch lg:overflow-hidden overflow-y-auto min-h-0">
          {/* Side Roadmap Panel */}
          <aside className="md:col-span-4 lg:col-span-3 md:flex hidden flex-col h-full min-h-0 space-y-3 flex-shrink-0">
            <h5 className="text-[10px] font-mono uppercase tracking-wider text-slate-600 dark:text-zinc-500 border-b pb-1.5 font-bold flex justify-between items-center flex-shrink-0">
              <span>Section Outline</span>
              <span>{unlockedSections.length} / {totalSlides} Unlocked</span>
            </h5>
            <div className="space-y-3 flex-1 overflow-y-auto pr-1">
              {course.sections.map((sect, sidx) => {
                const act = sidx === currentSectionIndex;
                const unl = unlockedSections.includes(sect.id);

                // Keyboard keyboard navigation handles for custom focus
                const handleCardKeyDown = (e: React.KeyboardEvent) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    if (unl) {
                      playBeep(true);
                      setCurrentSectionIndex(sidx);
                    }
                  }
                };

                return (
                  <div
                    key={sect.id}
                    role="button"
                    tabIndex={unl ? 0 : -1}
                    aria-label={`Unit Section ${sidx + 1}: ${sect.title}. ${act ? 'Active panel' : unl ? 'Unlocked' : 'Locked'}`}
                    aria-disabled={!unl}
                    onClick={() => {
                      if (unl) {
                        playBeep(true);
                        setCurrentSectionIndex(sidx);
                      }
                    }}
                                 onKeyDown={handleCardKeyDown}
                    className={`p-3 pl-6 border flex flex-col text-left transition-all duration-150 relative cursor-pointer group rounded-xl select-none overflow-hidden ${
                      act
                        ? theme.sidebarActiveCard
                        : unl
                          ? theme.sidebarUnlockCard
                          : isDark
                            ? 'bg-zinc-950/40 border-zinc-900/30 text-zinc-500 opacity-45 cursor-not-allowed'
                            : 'bg-neutral-100/50 border-neutral-200 text-slate-500 opacity-55 cursor-not-allowed'
                    } focus-visible:ring-2 focus-visible:ring-blue-600 outline-none`}
                  >
                    {/* Left Accent Color Indicator Bar */}
                     {true && (
                      <span 
                        className="absolute left-0 top-0 bottom-0 w-3 rounded-l-xl" 
                        style={{ 
                          backgroundColor: sect.accentColor || ['#EF4444', '#F97316', '#F59E0B', '#10B981', '#3B82F6', '#A855F7', '#F43F5E', '#14B8A6'][sidx % 8],
                          boxShadow: `inset -2px 0 4px rgba(0,0,0,0.15), 0 0 10px ${sect.accentColor || ['#EF4444', '#F97316', '#F59E0B', '#10B981', '#3B82F6', '#A855F7', '#F43F5E', '#14B8A6'][sidx % 8]}`
                        }}
                        aria-hidden="true"
                      />
                    )}
                    <div className="flex justify-between items-center text-[9px] font-mono tracking-wider">
                      <span className="font-extrabold text-blue-600 dark:text-blue-400">SECTION {String(sidx + 1).padStart(2, '0')}</span>
                      <div className="p-0.5 rounded-full">
                        {getLayoutIcon(sect.layoutType)}
                      </div>
                    </div>
                    
                    <h4 className="text-[11px] font-bold uppercase tracking-tight mt-1 mb-1 truncate font-sans">
                      {sect.title}
                    </h4>

                    <div className="flex justify-between items-center text-[8px] font-mono pt-1 border-t border-dashed border-slate-200 dark:border-zinc-800/80 mt-1 opacity-70">
                      <span className="capitalize">{sect.layoutType.replace(/_/g, ' ')}</span>
                      <span className="font-extrabold text-[8px] uppercase tracking-wider">
                        {act ? (
                          <span className="text-blue-600 dark:text-blue-400 bg-blue-500/10 px-1.5 py-0.5 rounded border border-blue-500/10">Active</span>
                        ) : unl ? (
                          <span className="text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/10">Read</span>
                        ) : (
                          <span className="text-slate-500 dark:text-zinc-400 bg-slate-500/10 dark:bg-zinc-800/50 px-1.5 py-0.5 rounded border border-transparent">Locked</span>
                        )}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </aside>

          {/* Active section scope */}
          <article className="md:col-span-8 lg:col-span-9 flex flex-col h-full min-h-0 space-y-4 w-full">
            {/* Header progress line */}
            <div className="space-y-1 flex-shrink-0">
              <div className={`w-full h-1.5 rounded-full overflow-hidden ${isDark ? 'bg-zinc-800' : 'bg-slate-200'}`}>
                <div className={`h-full rounded-full transition-all duration-300 ${theme.progressBarClass}`} style={{ width: `${widthPercent}%` }} />
              </div>
              <div className="flex justify-between items-center text-[9px] font-mono text-slate-600 dark:text-zinc-400">
                <span>SECTION {currentSectionIndex + 1} of {totalSlides || 1}</span>
                <span className={theme.accentText}>{widthPercent}% STUDY PROGRESS</span>
              </div>
            </div>

            {totalSlides === 0 ? (
              <div className="p-8 border-dashed border rounded-xl text-center font-mono text-xs text-gray-400 flex-1 flex items-center justify-center">
                You have not added any sections yet. Add a new section to begin.
              </div>
            ) : (() => {
              const hasFlashcards = !!(currentSection?.includeFlashcards !== false && currentSection?.flashcards?.length > 0);
              const hasQuiz = !!(currentSection?.includeQuestions !== false && currentSection?.questions?.length > 0);

              return (
                <div className="flex flex-col flex-1 min-h-0 gap-3">

                  {/* Title row — Flashcard/Quiz buttons on the right */}
                  <div className="flex items-center justify-between gap-4 flex-shrink-0">
                    <h3 className={`font-bold text-sm md:text-base font-mono truncate ${theme.accentText}`}>
                      {currentSection?.title}
                    </h3>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {hasFlashcards && (
                        <button
                          onClick={() => { playBeep(true); setSectionView('flashcards'); }}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold font-mono border transition-all ${
                            sectionView === 'flashcards'
                              ? 'bg-emerald-400 text-slate-950 border-emerald-400 shadow-md'
                              : 'bg-emerald-700 hover:bg-emerald-600 text-white border-emerald-700'
                          }`}
                        >Flashcards</button>
                      )}
                      {hasQuiz && (
                        <button
                          onClick={() => { playBeep(true); setSectionView('quiz'); }}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold font-mono border transition-all ${
                            sectionView === 'quiz'
                              ? 'bg-blue-400 text-slate-950 border-blue-400 shadow-md'
                              : 'bg-blue-700 hover:bg-blue-600 text-white border-blue-700'
                          }`}
                        >Quiz</button>
                      )}
                    </div>
                  </div>

                  {/* Narration audio bar */}
                  {currentSection?.narration && (currentSection.narration.audioDataUrl || currentSection.narration.audioExternalUrl) && (
                    <div className={`flex items-center gap-2.5 px-3 py-2 rounded-xl border flex-shrink-0 ${isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-slate-50 border-slate-200'}`}>
                      <span className="text-sm flex-shrink-0">🔊</span>
                      <span className={`text-[10px] font-mono font-bold flex-shrink-0 ${isDark ? 'text-zinc-400' : 'text-slate-600'}`}>
                        {currentSection.narration.label || 'Section Narration'}
                      </span>
                      <audio key={currentSection.id} controls autoPlay={currentSection.narration.autoPlay}
                        src={currentSection.narration.audioDataUrl || currentSection.narration.audioExternalUrl}
                        className="flex-1 h-8" style={{ minWidth: 0 }} />
                    </div>
                  )}

                  {/* Scrollable content panel */}
                  <div className={`flex-1 min-h-0 overflow-y-auto rounded-2xl border p-4 md:p-5 shadow-sm ${theme.cardBgClass}`}>

                    {/* Prominent back button when in flashcards/quiz view */}
                    {sectionView !== 'content' && (
                      <div className="mb-4">
                        <button
                          onClick={() => { playBeep(true); setSectionView('content'); }}
                          className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold font-mono transition-all ${theme.buttonClass}`}
                        >← Back to Content</button>
                      </div>
                    )}

                    {/* Content view */}
                    {sectionView === 'content' && renderLayout()}

                    {/* Flashcards view */}
                    {sectionView === 'flashcards' && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {currentSection.flashcards.map((fc) => {
                          const flipped = !!cardFlips[fc.id];
                          return (
                            <div key={fc.id} onClick={() => {
                              setCardFlips(p => ({ ...p, [fc.id]: !flipped }));
                              if (!interactedFlashcards[fc.id]) {
                                setInteractedFlashcards(prev => ({ ...prev, [fc.id]: true }));
                                setXp(px => px + 25); playBeep(true);
                              }
                            }} className="h-40 cursor-pointer relative perspective-1000 select-none">
                              <div className={`w-full h-full duration-500 transform-style-3d relative transition-transform ${flipped ? 'rotate-y-180' : ''}`}>
                                <div className={`absolute inset-0 rounded-xl p-4 border flex flex-col justify-between backface-hidden shadow-inner ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                                  <span className={`text-[9px] font-mono uppercase font-bold ${isDark ? 'text-zinc-400' : 'text-slate-600'}`}>Flashcard</span>
                                  <p className="text-xs font-bold text-center py-1">{fc.front}</p>
                                  <span className={`text-[9px] font-mono text-right ${theme.accentText}`}>Tap to reveal ⟳</span>
                                </div>
                                <div className={`absolute inset-0 rounded-xl p-4 border flex flex-col gap-2 backface-hidden rotate-y-180 shadow-inner overflow-hidden ${isDark ? 'bg-amber-950/20 border-amber-900/50 text-amber-100' : 'bg-amber-50 border-amber-200 text-amber-900'}`}>
                                  <p className="text-xs leading-relaxed font-mono flex-1 overflow-y-auto">{fc.back}</p>
                                  <span className="text-[9px] font-mono text-right flex-shrink-0 opacity-60">Tap to return ⟳</span>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* Quiz view */}
                    {sectionView === 'quiz' && (
                      <div className="space-y-4">
                        {currentSection.questions.map((q) => {
                          const selectedOptIdx = quizAnswers[q.id];
                          const passed = !!quizPassed[q.id];
                          const active = selectedOptIdx !== undefined;
                          return (
                            <div key={q.id} className={`p-4 rounded-xl border ${theme.cardBgClass}`}>
                              <p className="font-bold text-xs mb-3">{q.questionText}</p>
                              <div className="grid grid-cols-1 gap-2 mb-3">
                                {q.options?.map((opt, oIdx) => {
                                  const isCorrect = q.correctOptionIndex === oIdx;
                                  const isChosen = selectedOptIdx === oIdx;
                                  let btnColor = isDark ? "bg-slate-900 border-slate-800 hover:bg-slate-800 text-slate-200" : "bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-800";
                                  let sym = "";
                                  if (passed) {
                                    if (isCorrect) { btnColor = isDark ? "border-emerald-500 bg-emerald-500/20 text-emerald-300 font-extrabold" : "border-emerald-700 bg-emerald-100 text-emerald-950 font-bold"; sym = " ✔"; }
                                    else { btnColor = "opacity-40"; }
                                  } else if (active && isChosen) {
                                    btnColor = isDark ? "border-rose-500 bg-rose-500/20 text-rose-300 font-extrabold" : "border-rose-700 bg-rose-100 text-rose-900 font-bold"; sym = " ✘";
                                  }
                                  return (
                                    <button key={oIdx} disabled={passed}
                                      onClick={() => handleAnswerQuiz(q.id, oIdx, q.correctOptionIndex)}
                                      className={`w-full px-3 py-2 rounded-lg border font-mono text-xs font-semibold text-left flex justify-between items-center transition-all cursor-pointer ${btnColor}`}
                                    >
                                      <span>{opt}</span><strong>{sym}</strong>
                                    </button>
                                  );
                                })}
                              </div>
                              {active && (
                                <div className={`p-3 rounded-lg text-[10px] font-mono border ${
                                  passed ? (isDark ? 'bg-emerald-950/25 border-emerald-950/30 text-emerald-300' : 'bg-emerald-50 border-emerald-200 text-emerald-950')
                                         : (isDark ? 'bg-rose-950/25 border-rose-950/30 text-rose-300' : 'bg-rose-50 border-rose-200 text-rose-950')
                                }`}>
                                  <strong>{passed ? '✔ Correct!' : '✘ Incorrect — try again:'}</strong>
                                  {passed && <p className="mt-0.5">{q.explanation}</p>}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}

                  </div>
                </div>
              );
            })()}
          </article>
        </div>

        {/* BOTTOM NAV */}
        <footer className={`px-4 py-3 border-t flex justify-between items-center flex-shrink-0 ${isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-slate-200'}`}>
          <button
            onClick={prevSlide}
            disabled={currentSectionIndex === 0}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold border ${
              currentSectionIndex === 0
                ? 'opacity-35 cursor-not-allowed border-transparent text-gray-500'
                : (isDark ? 'border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200' : 'border-slate-200 bg-white hover:bg-slate-100 text-slate-700')
            }`}
          >◀ Back</button>

          <button
            onClick={nextSlide}
            disabled={totalSlides === 0}
            className={`px-4 py-2 rounded-lg text-xs font-mono font-bold disabled:opacity-50 transition-all flex items-center gap-1 ${theme.buttonClass}`}
          >
            <span>{currentSectionIndex === totalSlides - 1 ? 'Complete Training' : 'Next Module'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </footer>
      </div>
    );
  }

  // --- COMPLETED SCORE HIGHLIGHT DIPLOMA ---
  if (step === 'summary') {
    return (
      <div className={`min-h-[550px] p-4 md:p-8 flex items-center justify-center transition-colors duration-200 ${theme.bgClass}`}>
        <div className={`max-w-2xl w-full p-8 rounded-2xl border shadow-xl space-y-6 relative ${theme.cardBgClass}`}>
          {/* Header */}
          <div className="flex justify-between items-center pb-4 border-b border-slate-200/55 dark:border-zinc-800/80 flex-wrap gap-2">
            <div>
              <span className={`text-[10px] font-mono uppercase tracking-widest font-extrabold ${theme.accentText}`}>Course Reference Sheet</span>
              <h1 className="text-lg md:text-xl font-bold font-sans tracking-tight mt-0.5">{metadata.title || 'Course Summary'}</h1>
              <p className="text-[9px] font-mono opacity-50">Curriculum Study Guidelines Overview</p>
            </div>
            <button
              onClick={() => { playBeep(true); setStep('intro'); }}
              className={`px-3 py-1.5 text-xs font-mono font-bold rounded-xl border transition-all flex items-center gap-1.5 ${
                isDark ? 'bg-zinc-800 border-zinc-700 text-zinc-200 hover:bg-zinc-700' : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <Home className="w-3.5 h-3.5" />
              <span>Back Home</span>
            </button>
          </div>

          <p className="text-xs leading-relaxed opacity-85">
            Review the complete procedural guidelines and reference resources drafted within this curriculum sandbox. This document serves as a standard operational check file.
          </p>

          {/* Quick study Reference list */}
          <div className="space-y-4 max-h-[350px] overflow-y-auto pr-1">
            {course.sections.map((sect, sidx) => (
              <div key={sect.id} className="p-4 rounded-xl border border-slate-200/40 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-950/20 text-xs font-mono space-y-2">
                <strong className="text-blue-600 dark:text-blue-400 font-bold tracking-tight block uppercase text-[11px] border-b border-slate-200/25 pb-1">
                  SECTION {sidx + 1}: {sect.title}
                </strong>
                <SectionVisualSummary sect={sect} isDark={isDark} />
              </div>
            ))}
          </div>

          {/* Bottom action controls */}
          <div className="flex justify-between items-center pt-4 border-t border-slate-200/50 dark:border-zinc-800/80">
            <button
              onClick={printReferenceSummary}
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-500 hover:from-blue-500 hover:to-indigo-400 text-white font-mono text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer font-extrabold"
            >
              <FileText className="w-4 h-4" />
              <span>Print Course PDF</span>
            </button>

            <button
              onClick={() => { playBeep(true); setStep('intro'); }}
              className={`px-4 py-2 font-mono text-xs font-bold rounded-xl transition-all cursor-pointer ${
                isDark ? 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200' : 'bg-slate-200 hover:bg-slate-300 text-slate-700'
              }`}
            >
              Exit Guide
            </button>
          </div>
        </div>
      </div>
    );
  }

  // STANDARD COMPLETED GRADE VIEW
  return (
    <div className={`min-h-[550px] p-4 md:p-6 overflow-y-auto transition-colors duration-200 ${theme.bgClass}`}>
      
      <div className="max-w-2xl mx-auto space-y-6">
        
        {/* Navigation Head on Completion */}
        <div className="flex justify-between items-center pb-4 border-b border-slate-200/50 dark:border-zinc-800/50 no-print flex-wrap gap-2">
          <button
            onClick={() => {
              playBeep(true);
              setStep('intro');
            }}
            className={`px-3.5 py-1.5 border flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-tight rounded-xl transition-all cursor-pointer ${
              isDark ? 'bg-zinc-800 border-zinc-700 text-zinc-200 hover:bg-zinc-700' : 'bg-white border-slate-200 text-slate-800 hover:bg-slate-100'
            }`}
            aria-label="Go back to course landing page from completion page"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Home</span>
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsDark(!isDark)}
              className="p-1.5 rounded opacity-75 hover:opacity-100 cursor-pointer"
              aria-label="Toggle dark mode on completion page"
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-slate-700" />}
            </button>
            {onExit && (
              <button
                onClick={onExit}
                className="ml-2 text-rose-500 hover:text-rose-400 font-extrabold text-[10px] uppercase"
                aria-label="Exit simulator from completion view"
              >
                Exit
              </button>
            )}
          </div>
        </div>

        {/* Banner congratulations */}
        <div className="text-center space-y-2 no-print">
          <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center mx-auto">
            <Award className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <h2 className={`text-xl md:text-2xl font-bold font-sans tracking-tight ${theme.accentText}`}>
            {settings.questionsRequired ? 'Assessment Passed Successfully!' : 'Training Course Completed!'}
          </h2>
          <p className="text-xs opacity-75 max-w-sm mx-auto">Outstanding work, {studentName || 'Student'}! You successfully finalized all study sections.</p>
        </div>

        {/* Highlight Score stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center font-mono text-xs no-print">
          <div className={`p-4 rounded-xl border shadow-sm ${theme.cardBgClass}`}>
            <span className="text-[9px] block text-slate-600 dark:text-zinc-400 uppercase tracking-wider font-bold">Points accrued</span>
            <strong className="text-sm text-yellow-600 dark:text-yellow-400">{xp} XP</strong>
          </div>

          {settings.questionsRequired ? (
            <>
              <div className={`p-4 rounded-xl border shadow-sm ${theme.cardBgClass}`}>
                <span className="text-[9px] block text-slate-600 dark:text-zinc-400 uppercase tracking-wider font-bold">Assessment scored</span>
                <strong className={`text-sm ${theme.accentText}`}>{scorePercentage}%</strong>
              </div>
              <div className={`p-4 rounded-xl border shadow-sm ${theme.cardBgClass}`}>
                <span className="text-[9px] block text-slate-600 dark:text-zinc-400 uppercase tracking-wider font-bold">Criteria Grade</span>
                <span className={`px-2 py-0.5 rounded text-[9px] block mx-auto font-bold mt-1 ${hasPassed ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                  {hasPassed ? 'PASSED' : 'FAILED'}
                </span>
              </div>
            </>
          ) : (
            <div className={`sm:col-span-2 p-4 rounded-xl border flex items-center justify-center font-bold px-4 ${theme.alertClassBg}`}>
              Quizzes were handled as optional practice materials. Grade requirements are bypassed!
            </div>
          )}
        </div>

        {/* Quick study Reference sheet with Download Summary trigger */}
        <div className={`p-5 rounded-2xl border space-y-4 no-print shadow-xl ${theme.cardBgClass}`}>
          <div className="flex justify-between items-center border-b border-slate-200/50 dark:border-zinc-800 pb-2 flex-wrap gap-2">
            <div>
              <h5 className={`text-[11px] font-mono uppercase tracking-wider font-bold ${theme.accentText}`}>Reference Review Sheet</h5>
              <span className="text-[8px] text-slate-500 dark:text-zinc-400 font-mono font-bold">Quick study key takeaways summary sheet</span>
            </div>
            <button
               onClick={printReferenceSummary}
               className={`px-3 py-1.5 rounded-xl font-mono text-[10px] font-bold flex items-center gap-1 transition-all cursor-pointer text-white ${theme.buttonClass}`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Print Course PDF</span>
            </button>
          </div>

          <div className="space-y-4 max-h-[220px] overflow-y-auto pr-1">
            {course.sections.map((sect, sidx) => (
              <div key={sect.id} className={`p-3 rounded-xl border bg-white dark:bg-zinc-950/20 text-xs font-mono space-y-2 ${theme.outlineBorder}`}>
                <strong className={`font-bold tracking-tight block uppercase text-[10px] border-b border-rose-500/10 dark:border-zinc-800 pb-1 ${theme.accentText}`}>
                  SECTION {sidx + 1}: {sect.title}
                </strong>
                <SectionVisualSummary sect={sect} isDark={isDark} />
              </div>
            ))}
          </div>
        </div>

        {/* Print certificate action */}
        <div className="no-print flex justify-between items-center pt-2">
          <button
            onClick={() => {
              setStep('intro');
              setXp(0);
              setUnlockedSections([]);
              setQuizAnswers({});
              setQuizPassed({});
              setQuizAttempts({});
            }}
            className={`px-4 py-2 font-mono text-xs font-bold rounded-xl border transition-all cursor-pointer ${isDark ? 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border-zinc-700' : 'bg-slate-200 hover:bg-slate-300 text-slate-700 border-slate-200'}`}
          >
            Restart Course
          </button>
          <button
            onClick={printCertificate}
            className="px-4 py-2 font-mono text-xs font-bold rounded-xl bg-slate-900 border border-slate-700 text-slate-100 hover:bg-slate-800 flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <span>Print or Save PDF Certificate</span>
          </button>
        </div>

        {/* Certificate rendering card block */}
        <div
          id="print-certificate-container"
          className="w-full aspect-[4/3] rounded-2xl border p-8 flex flex-col justify-between items-center text-center relative overflow-hidden bg-white text-stone-950 border-stone-300 shadow-lg"
        >
          {/* Border Graphic Elements for printed diploma */}
          <div className="absolute inset-2.5 border border-stone-200 pointer-events-none" />
          <div className="absolute inset-4 border-2 border-stone-200/50 pointer-events-none" />

          <header className="space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-widest text-stone-500 block">Course Verified Certification Enrollment</span>
            <span className="text-xl font-bold font-serif text-slate-800">Certificate of Completion</span>
          </header>

          <div className="space-y-2.5 max-w-sm">
            <span className="text-[10px] font-mono opacity-65 block text-stone-500">This diploma certifies that</span>
            <h4 className="text-2xl font-bold text-stone-900 border-b border-stone-205 pb-1 font-serif">{studentName || 'Guest Student'}</h4>
            <span className="text-[10px] font-mono block opacity-85 text-stone-600">has successfully studied and finished all sections within</span>
            <strong className="text-xs font-mono font-extrabold block text-slate-800 italic px-2">{metadata.title || 'Interactive Course Unit'}</strong>
            <span className="text-[9px] font-mono opacity-50 block">
              {settings.questionsRequired 
                ? `Publisher standards and criteria • Score reached: ${scorePercentage}%` 
                : 'Publisher standards and customized course criteria achieved'}
            </span>
          </div>

          <footer className="w-full flex items-end justify-between px-6">
            <div className="text-left font-mono text-[9px] opacity-60">
              <span className="block font-bold">Authorized Owner:</span>
              <span className="border-t border-stone-300 pt-0.5 block">{metadata.owner || 'Course Publisher'}</span>
            </div>
            
            {/* Seal Graphic Vector */}
            <div className="w-12 h-12 rounded-full border-2 border-amber-500 border-dashed animate-pulse flex items-center justify-center font-serif text-[10px] text-amber-800 font-bold bg-amber-500/5">
              SEAL
            </div>

            <div className="text-right font-mono text-[9px] opacity-60">
              <span className="block font-bold">Certified Date:</span>
              <span className="border-t border-stone-300 pt-0.5 block">{metadata.publicationDate || '2026-06-06'}</span>
            </div>
          </footer>
        </div>

      </div>

    </div>
  );
}

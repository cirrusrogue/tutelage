/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GameCourse } from '../types';
import JSZip from 'jszip';

/**
 * Returns a beautifully designed, completely self-contained HTML Player.
 * It contains instructions, Tailwind, React, and Lucide CDNs, and mounts
 * a responsive interactive training application.
 * 
 * Non-programmers can change COURSE_DATA at the top of this code block directly.
 */
export function generateSelfContainedHtml(course: GameCourse): string {
  const courseJsonString = JSON.stringify(course, null, 2);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${course.metadata.title}</title>
  
  <!-- Tailwind CSS v3 Play CDN — scans DOM mutations at runtime -->
  <script src="https://cdn.tailwindcss.com"></script>

  <!-- Google Fonts: Inter & Space Grotesk & JetBrains Mono -->
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;700&family=Space+Grotesk:wght@500;600;700&family=Playfair+Display:ital,wght@1,500;1,700&display=swap" rel="stylesheet" />

  <!-- React 18 & ReactDOM 18 CDN -->
  <script src="https://unpkg.com/react@18/umd/react.production.min.js" crossorigin></script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js" crossorigin></script>
  
  <!-- Lucide Icons CDN -->
  <script src="https://unpkg.com/lucide@0.400.0/dist/umd/lucide.min.js"></script>

  <!-- Custom Perspective Styles for 3D Flash Card Flipping -->
  <style>
    body {
      font-family: 'Inter', system-ui, -apple-system, sans-serif;
    }
    .heading-font {
      font-family: 'Space Grotesk', sans-serif;
    }
    .serif-font {
      font-family: 'Playfair Display', Georgia, serif;
    }
    .code-font {
      font-family: 'JetBrains Mono', monospace;
    }
    .perspective-1000 {
      perspective: 1000px;
    }
    .transform-style-3d {
      transform-style: preserve-3d;
    }
    .backface-hidden {
      backface-visibility: hidden;
      -webkit-backface-visibility: hidden;
    }
    .rotate-y-180 {
      transform: rotateY(180deg);
    }
    /* Simple custom scrollbar to match sleek theme */
    ::-webkit-scrollbar {
      width: 6px;
      height: 6px;
    }
    ::-webkit-scrollbar-track {
      background: transparent;
    }
    ::-webkit-scrollbar-thumb {
      background: rgba(156, 163, 175, 0.3);
      border-radius: 4px;
    }
    ::-webkit-scrollbar-thumb:hover {
      background: rgba(156, 163, 175, 0.5);
    }

    /* Print-Only configuration */
    @media print {
      body * { visibility: hidden; }
      .no-print { display: none !important; }

      /* Certificate print mode (default) */
      body:not(.print-summary) #print-certificate-container,
      body:not(.print-summary) #print-certificate-container * { visibility: visible; }
      body:not(.print-summary) #print-certificate-container {
        position: absolute; left: 0; top: 0; width: 100%;
        max-width: 11in; height: 8.5in; margin: 0; padding: 2.5rem;
        background-color: #ffffff !important; color: #0c0a09 !important;
        border: 12px double #e7e5e4 !important; box-shadow: none !important;
        box-sizing: border-box;
      }

      /* Summary PDF print mode */
      body.print-summary #print-summary-container {
        display: block !important;
        visibility: visible !important;
        position: absolute !important; left: 0; top: 0; width: 100%;
        padding: 2rem; background: #ffffff !important; color: #1c1917 !important;
        font-family: sans-serif; box-sizing: border-box;
      }
      body.print-summary #print-summary-container * { visibility: visible !important; }
    }

    /* Summary print container — hidden on screen, visible only when printing summary */
    #print-summary-container { display: none; }
  </style>
</head>
<body class="bg-slate-50 text-slate-800 transition-colors duration-300">

  <!-- ========================================== -->
  <!--   CORE COURSE DATA SPECIFICATION SECTION   -->
  <!--   EDIT THE WINDOW.COURSE_DATA DIRECTLY     -->
  <!-- ========================================== -->
  <script>
    window.COURSE_DATA = ${courseJsonString};
  </script>

  <!-- Application Mount Node -->
  <div id="player-root"></div>

  <!-- Main Standalone Player App Logic -->
  <script>
    const { useState, useEffect, useMemo, useRef } = React;

    // --- SCORM CONNECTOR CLIENT LAYER ---
    const SCORM = {
      api: null,
      version: null, // "1.2" | "2004" | null
      active: false,

      init() {
        // Attempt to find SCORM API on parents
        let win = window;
        let count = 0;
        while (count < 10) {
          if (win.API) {
            this.api = win.API;
            this.version = "1.2";
            break;
          }
          if (win.API_1484_11) {
            this.api = win.API_1484_11;
            this.version = "2004";
            break;
          }
          if (win.parent && win.parent !== win) {
            win = win.parent;
          } else {
            break;
          }
          count++;
        }

        if (this.api) {
          this.active = true;
          try {
            if (this.version === "1.2") {
              this.api.LMSInitialize("");
              this.api.LMSSetValue("cmi.core.lesson_status", "incomplete");
              this.api.LMSCommit("");
            } else {
              this.api.Initialize("");
              this.api.SetValue("cmi.completion_status", "incomplete");
              this.api.Commit("");
            }
            console.log("SCORM Connected Successfully: version " + this.version);
          } catch(e) {
            console.warn("SCORM fail initializing:", e);
          }
        } else {
          console.log("Course running independently (No LMS SCORM API detected).");
        }
      },

      setStudentNamePreference(defaultName) {
        if (!this.active) return defaultName;
        try {
          let name = "";
          if (this.version === "1.2") {
            name = this.api.LMSGetValue("cmi.core.student_name");
          } else {
            name = this.api.GetValue("cmi.learner_name");
          }
          if (name && name.trim()) {
            return name.replace(/, /g, " ").trim();
          }
        } catch(e) {
          console.warn("SCORM student name read err:", e);
        }
        return defaultName;
      },

      bookmark(sectionIndex) {
        if (!this.active) return;
        try {
          if (this.version === "1.2") {
            this.api.LMSSetValue("cmi.core.lesson_location", String(sectionIndex));
            this.api.LMSSetValue("cmi.core.suspend_data", JSON.stringify({ index: sectionIndex }));
            this.api.LMSCommit("");
          } else {
            this.api.SetValue("cmi.location", String(sectionIndex));
            this.api.SetValue("cmi.suspend_data", JSON.stringify({ index: sectionIndex }));
            this.api.Commit("");
          }
        } catch(e) {
          console.warn("SCORM bookmark write err:", e);
        }
      },

      getLastBookmarkedIndex() {
        if (!this.active) return 0;
        try {
          let locationStr = "";
          if (this.version === "1.2") {
            locationStr = this.api.LMSGetValue("cmi.core.lesson_location");
          } else {
            locationStr = this.api.GetValue("cmi.location");
          }
          if (locationStr) {
            const indexValue = parseInt(locationStr, 10);
            if (!isNaN(indexValue)) return indexValue;
          }
        } catch(e) {}
        return 0;
      },

      reportScoreAndPassed(pointsScored, passingScore, totalScorePercent, isPassed) {
        if (!this.active) return;
        try {
          if (this.version === "1.2") {
            this.api.LMSSetValue("cmi.core.score.raw", String(Math.round(totalScorePercent)));
            this.api.LMSSetValue("cmi.core.score.min", "0");
            this.api.LMSSetValue("cmi.core.score.max", "100");
            this.api.LMSSetValue("cmi.core.lesson_status", isPassed ? "passed" : "failed");
            this.api.LMSCommit("");
          } else {
            this.api.SetValue("cmi.score.raw", String(totalScorePercent));
            this.api.SetValue("cmi.score.min", "0");
            this.api.SetValue("cmi.score.max", "100");
            this.api.SetValue("cmi.score.scaled", String(totalScorePercent / 100));
            this.api.SetValue("cmi.completion_status", "completed");
            this.api.SetValue("cmi.success_status", isPassed ? "passed" : "failed");
            this.api.Commit("");
          }
          console.log("SCORM scores synchronized to LMS:", totalScorePercent, isPassed);
        } catch (e) {
          console.warn("SCORM Score synchronization fail:", e);
        }
      },

      terminate() {
        if (!this.active) return;
        try {
          if (this.version === "1.2") {
            this.api.LMSCommit("");
            this.api.LMSFinish("");
          } else {
            this.api.Commit("");
            this.api.Terminate("");
          }
        } catch(e) {}
      }
    };

    // --- MAIN REACT PLAYER RUNTIME ===
    function PlayerApp() {
      const course = window.COURSE_DATA;
      const settings = course.settings;
      const metadata = course.metadata;

      // Theme toggle hook (starts with student course default preference)
      const [isDark, setIsDark] = useState(settings.themeMode === 'dark');

      // Setup State
      const [step, setStep] = useState('intro'); // 'intro' | 'playing' | 'completed'
      const [studentName, setStudentName] = useState('');
      const [currentSectionIndex, setCurrentSectionIndex] = useState(0);

      // Score Metrics
      const [xp, setXp] = useState(0);
      const [unlockedSections, setUnlockedSections] = useState(['sec_1_welcome']);
      const [quizAnswers, setQuizAnswers] = useState({}); // questionId -> selectedOptionIndex
      const [quizPassed, setQuizPassed] = useState({}); // questionId -> passedBoolean
      const [quizAttempts, setQuizAttempts] = useState({}); // questionId -> attemptsCount
      
      // Flashcard master checklist tracking
      const [cardFlips, setCardFlips] = useState({}); // cardId -> true (is flipped)
      const [masteredCards, setMasteredCards] = useState({}); // cardId -> true (is studied)

      // Layout Specific states
      const [activeTabId, setActiveTabId] = useState('');
      const [openAccordionIds, setOpenAccordionIds] = useState({});

      // Track whether student completed all sections (vs bypassed via Quick Summary)
      const [courseActuallyCompleted, setCourseActuallyCompleted] = useState(false);

      // Which sub-view is active within a section: content | flashcards | quiz
      const [sectionView, setSectionView] = useState('content');

      // Quiz enforcement modals
      const [showQuizPrompt, setShowQuizPrompt] = useState(false);
      const [showFailureModal, setShowFailureModal] = useState(false);

      // Play introductory sound triggers
      const playChime = (type = 'success') => {
        if (!settings.soundEffectsEnabled) return;
        try {
          const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
          if (type === 'success') {
            // High upward sweet dual beep
            const osc = audioCtx.createOscillator();
            const osc2 = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.connect(gain);
            osc2.connect(gain);
            gain.connect(audioCtx.destination);
            osc.frequency.setValueAtTime(523.25, audioCtx.currentTime); // C5
            osc2.frequency.setValueAtTime(659.25, audioCtx.currentTime); // E5
            gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.4);
            osc.start();
            osc2.start();
            osc.stop(audioCtx.currentTime + 0.4);
            osc2.stop(audioCtx.currentTime + 0.4);
          } else if (type === 'congrats') {
            // Elegant arpeggio
            const freqs = [523.25, 659.25, 783.99, 1046.50]; // C, E, G, C
            freqs.forEach((f, i) => {
              const osc = audioCtx.createOscillator();
              const gain = audioCtx.createGain();
              osc.connect(gain);
              gain.connect(audioCtx.destination);
              osc.frequency.setValueAtTime(f, audioCtx.currentTime + i * 0.1);
              gain.gain.setValueAtTime(0.15, audioCtx.currentTime + i * 0.1);
              gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + i * 0.1 + 0.3);
              osc.start(audioCtx.currentTime + i * 0.1);
              osc.stop(audioCtx.currentTime + i * 0.1 + 0.3);
            });
          } else {
            // Low feedback buzz
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.frequency.setValueAtTime(220, audioCtx.currentTime); // A3
            gain.gain.setValueAtTime(0.12, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.25);
            osc.start();
            osc.stop(audioCtx.currentTime + 0.25);
          }
        } catch(e) {}
      };

      // Bootstrap SCORM & Settings on mount
      useEffect(() => {
        SCORM.init();
        const preferredName = SCORM.setStudentNamePreference('');
        if (preferredName) {
          setStudentName(preferredName);
        }

        // Bookmark restore checking
        const bookmarkedIndex = SCORM.getLastBookmarkedIndex();
        if (bookmarkedIndex > 0 && bookmarkedIndex < course.sections.length) {
          // If a student already began, we can unlock sections up to this one
          const unlocked = [];
          for (let i = 0; i <= bookmarkedIndex; i++) {
            unlocked.push(course.sections[i].id);
          }
          setUnlockedSections(unlocked);
          setCurrentSectionIndex(bookmarkedIndex);
        }
      }, []);

      // Toggle document themes
      useEffect(() => {
        if (isDark) {
          document.body.classList.add('bg-slate-950', 'text-slate-100');
          document.body.classList.remove('bg-slate-50', 'text-slate-800');
        } else {
          document.body.classList.add('bg-slate-50', 'text-slate-800');
          document.body.classList.remove('bg-slate-950', 'text-slate-100');
        }
        // Force recheck of icons
        if (window.lucide) {
          setTimeout(() => window.lucide.createIcons(), 50);
        }
      }, [isDark, step]);

      // Re-trigger Lucide icon instantiation on slide change
      useEffect(() => {
        if (window.lucide) {
          setTimeout(() => window.lucide.createIcons(), 60);
        }
        // Save SCORM bookmark coordinate
        if (step === 'playing') {
          SCORM.bookmark(currentSectionIndex);
        }
      }, [currentSectionIndex, step]);

      // Certificate print helper — ensures summary mode is off
      const handlePrintCertificate = () => {
        document.body.classList.remove('print-summary');
        window.print();
      };

      // Summary PDF print helper — switches print CSS to show summary container
      const handlePrintSummary = () => {
        document.body.classList.add('print-summary');
        window.print();
        window.addEventListener('afterprint', function once() {
          document.body.classList.remove('print-summary');
          window.removeEventListener('afterprint', once);
        });
      };

      // Render visual content for each section layout type in the summary
      const renderSectionSummaryContent = (sect) => {
        switch (sect.layoutType) {
          case 'text_table': {
            const d = sect.text_table;
            if (!d?.rows?.length) return null;
            return React.createElement('div', { className: 'overflow-x-auto border rounded-lg ' + (isDark ? 'border-slate-700' : 'border-slate-200') },
              React.createElement('table', { className: 'w-full text-xs font-mono' },
                React.createElement('thead', { className: isDark ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-700' },
                  React.createElement('tr', null,
                    d.headers?.map((h, i) => React.createElement('th', { key: i, className: 'px-3 py-2 text-left font-bold' }, h))
                  )
                ),
                React.createElement('tbody', { className: 'divide-y ' + (isDark ? 'divide-slate-700' : 'divide-slate-200') },
                  d.rows?.map((row, i) => React.createElement('tr', { key: i, className: isDark ? 'hover:bg-slate-800/50' : 'hover:bg-slate-50' },
                    React.createElement('td', { className: 'px-3 py-2 font-bold' }, row.col1),
                    React.createElement('td', { className: 'px-3 py-2' }, row.col2),
                    row.col3 && React.createElement('td', { className: 'px-3 py-2 text-xs' }, row.col3)
                  ))
                )
              )
            );
          }
          case 'cards_grid': {
            const d = sect.cards_grid;
            if (!d?.cards?.length) return null;
            return React.createElement('div', { className: 'grid grid-cols-1 sm:grid-cols-2 gap-2' },
              d.cards.map((c) => React.createElement('div', { key: c.id, className: 'p-2.5 rounded-lg border text-xs ' + (isDark ? 'border-slate-700 bg-slate-800/50' : 'border-slate-200 bg-slate-50') },
                React.createElement('strong', { className: 'block text-amber-500 mb-0.5' }, c.title),
                c.badge && React.createElement('span', { className: 'text-[9px] font-mono uppercase bg-amber-500/10 text-amber-600 px-1.5 py-0.5 rounded mr-1' }, c.badge),
                React.createElement('p', { className: 'mt-1 ' + (isDark ? 'text-slate-300' : 'text-slate-600') }, c.backContent)
              ))
            );
          }
          case 'bento_highlights': {
            const d = sect.bento_highlights;
            if (!d?.boxes?.length) return null;
            return React.createElement('div', { className: 'grid grid-cols-2 gap-2' },
              d.boxes.map((b) => React.createElement('div', { key: b.id, className: 'p-2.5 rounded-lg border text-xs ' + (isDark ? 'border-slate-700 bg-slate-800/50' : 'border-slate-200 bg-slate-50') },
                React.createElement('span', { className: 'text-[10px] font-mono uppercase tracking-wide block ' + (isDark ? 'text-slate-400' : 'text-slate-600') }, b.title),
                b.value && React.createElement('strong', { className: 'text-lg block text-amber-500 leading-tight' }, b.value),
                React.createElement('p', { className: 'mt-0.5 ' + (isDark ? 'text-slate-300' : 'text-slate-700') }, b.description)
              ))
            );
          }
          case 'milestone_timeline': {
            const d = sect.milestone_timeline;
            if (!d?.steps?.length) return null;
            return React.createElement('div', { className: 'space-y-2 border-l-2 border-amber-500/40 pl-3 ml-1' },
              d.steps.map((st) => React.createElement('div', { key: st.id, className: 'text-xs' },
                React.createElement('div', { className: 'flex items-center gap-2 mb-0.5 flex-wrap' },
                  React.createElement('span', { className: 'text-[10px] font-mono font-bold text-amber-500 flex-shrink-0' }, st.stepNumber),
                  React.createElement('strong', { className: isDark ? 'text-slate-200' : 'text-slate-800' }, st.title),
                  st.badgeText && React.createElement('span', { className: 'text-[9px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-600 font-mono' }, st.badgeText)
                ),
                React.createElement('p', { className: isDark ? 'text-slate-400' : 'text-slate-600' }, st.description)
              ))
            );
          }
          case 'code_quote_spotlight': {
            const d = sect.code_quote_spotlight;
            if (!d?.spotlightText) return null;
            return d.isCode
              ? React.createElement('pre', { className: 'text-xs font-mono p-3 rounded-lg overflow-x-auto whitespace-pre-wrap ' + (isDark ? 'bg-slate-800 text-slate-200' : 'bg-slate-100 text-slate-800') },
                  React.createElement('code', null, d.spotlightText)
                )
              : React.createElement('blockquote', { className: 'border-l-4 border-amber-500 pl-3 text-sm italic py-1 ' + (isDark ? 'text-amber-300' : 'text-amber-800') },
                  '“' + d.spotlightText + '”',
                  d.languageOrAuthor && React.createElement('cite', { className: 'block text-xs not-italic mt-1 ' + (isDark ? 'text-slate-400' : 'text-slate-600') }, '— ' + d.languageOrAuthor)
                );
          }
          case 'multi_tab_dive': {
            const d = sect.multi_tab_dive;
            if (!d?.tabs?.length) return null;
            return React.createElement('div', { className: 'space-y-2' },
              d.tabs.map((t) => React.createElement('div', { key: t.id, className: 'text-xs p-2.5 rounded-lg border ' + (isDark ? 'border-slate-700 bg-slate-800/30' : 'border-slate-200 bg-slate-50') },
                React.createElement('strong', { className: 'block text-amber-500 mb-0.5' }, '[' + t.label + '] ' + t.title),
                React.createElement('p', { className: isDark ? 'text-slate-300' : 'text-slate-700' }, t.content),
                t.sublist?.length ? React.createElement('ul', { className: 'list-disc list-inside mt-1.5 space-y-0.5 ' + (isDark ? 'text-slate-400' : 'text-slate-600') },
                  t.sublist.map((s, i) => React.createElement('li', { key: i }, s))
                ) : null
              ))
            );
          }
          case 'qa_accordion': {
            const d = sect.qa_accordion;
            if (!d?.items?.length) return null;
            return React.createElement('div', { className: 'space-y-2' },
              d.items.map((item) => React.createElement('div', { key: item.id, className: 'text-xs p-2.5 rounded-lg border ' + (isDark ? 'border-slate-700 bg-slate-800/30' : 'border-slate-200 bg-slate-50') },
                React.createElement('strong', { className: 'block mb-0.5 ' + (isDark ? 'text-slate-200' : 'text-slate-800') }, 'Q: ' + item.trigger),
                React.createElement('p', { className: 'pl-2 border-l-2 border-amber-500/40 ' + (isDark ? 'text-slate-400' : 'text-slate-600') }, item.content)
              ))
            );
          }
          default: return null;
        }
      };

      const currentSection = course.sections[currentSectionIndex];

      // Reset section sub-view and sync tab state when section changes
      useEffect(() => {
        setSectionView('content');
        if (currentSection) {
          if (currentSection.layoutType === 'multi_tab_dive' && currentSection.multi_tab_dive?.tabs?.length) {
            setActiveTabId(currentSection.multi_tab_dive.tabs[0].id);
          }
        }
      }, [currentSectionIndex]);

      // Game math calculations
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

      // Theme system — matches the builder's classic/steel/forest presets
      const theme = useMemo(() => {
        const ct = settings.colorTheme || 'classic';
        if (ct === 'steel') return {
          bg:         isDark ? 'bg-[#0D131A] text-slate-200'    : 'bg-[#F4F7FA] text-slate-800',
          card:       isDark ? 'bg-[#141C25] border-slate-800 text-slate-100'   : 'bg-white border-slate-200 text-slate-900',
          panel:      isDark ? 'bg-[#10171F] border-slate-800'   : 'bg-slate-50 border-slate-200',
          btn:        isDark ? 'bg-sky-500 text-slate-950 hover:bg-sky-400' : 'bg-blue-800 text-white hover:bg-blue-900',
          accent:     isDark ? 'text-sky-300'  : 'text-blue-900',
          progress:   'bg-gradient-to-r from-blue-600 to-sky-500',
          navActive:  isDark ? 'bg-blue-900/40 border-blue-500 text-sky-200 font-bold' : 'bg-blue-100 border-blue-800 text-blue-950 font-bold',
          navUnlock:  isDark ? 'hover:bg-[#1C2632] bg-[#141C25] border-slate-800 text-slate-100' : 'hover:bg-blue-50/20 bg-white border-slate-200 text-slate-900',
          xp:         isDark ? 'bg-sky-500/10 border-sky-500/20 text-sky-400' : 'bg-blue-800/10 border-blue-800/20 text-blue-800',
          tabOn:      'bg-blue-800 text-white',
          tabOff:     isDark ? 'bg-[#182129] text-slate-400 hover:text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200',
          secondary:  isDark ? 'text-slate-400' : 'text-slate-600',
          border:     isDark ? 'border-slate-800' : 'border-slate-200',
          header:     isDark ? 'bg-[#0D131A] border-slate-800' : 'bg-white border-slate-200',
          footer:     isDark ? 'bg-[#0D131A] border-slate-800' : 'bg-white border-slate-200',
        };
        if (ct === 'forest') return {
          bg:         isDark ? 'bg-[#0B150F] text-zinc-200'     : 'bg-[#F1F6F2] text-slate-800',
          card:       isDark ? 'bg-[#112117] border-emerald-900/60 text-zinc-100' : 'bg-white border-slate-200 text-slate-900',
          panel:      isDark ? 'bg-[#0E1A12] border-[#182C1E]'  : 'bg-emerald-50/30 border-slate-200',
          btn:        isDark ? 'bg-emerald-500 text-slate-950 hover:bg-emerald-400' : 'bg-emerald-800 text-white hover:bg-emerald-900',
          accent:     isDark ? 'text-emerald-400' : 'text-emerald-900',
          progress:   'bg-gradient-to-r from-emerald-600 to-green-500',
          navActive:  isDark ? 'bg-emerald-900/40 border-emerald-500 text-emerald-200 font-bold' : 'bg-emerald-50 border-emerald-800 text-emerald-950 font-bold',
          navUnlock:  isDark ? 'hover:bg-[#182F21] bg-[#112117] border-[#182C1E] text-zinc-100' : 'hover:bg-emerald-50/20 bg-white border-slate-200 text-slate-900',
          xp:         isDark ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-emerald-800/10 border-emerald-800/20 text-emerald-800',
          tabOn:      'bg-emerald-700 text-white',
          tabOff:     isDark ? 'bg-[#13261A] text-zinc-400 hover:text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200',
          secondary:  isDark ? 'text-zinc-400' : 'text-slate-600',
          border:     isDark ? 'border-[#182C1E]' : 'border-slate-200',
          header:     isDark ? 'bg-[#0B150F] border-[#182C1E]' : 'bg-white border-slate-200',
          footer:     isDark ? 'bg-[#0B150F] border-[#182C1E]' : 'bg-white border-slate-200',
        };
        // classic (default) — cream/navy/teal
        return {
          bg:         isDark ? 'bg-[#262626] text-[#EFEFE8]'    : 'bg-[#EFEFE8] text-[#2F3638]',
          card:       isDark ? 'bg-[#2F3638] border-zinc-700/60 text-[#EFEFE8]' : 'bg-white border-[#6E6E6E]/20 text-[#2F3638]',
          panel:      isDark ? 'bg-[#262626] border-zinc-800'   : 'bg-white border-slate-200',
          btn:        'bg-[#002F6C] text-white hover:bg-[#002F6C]/90',
          accent:     isDark ? 'text-[#4FC4D4]' : 'text-[#002F6C]',
          progress:   'bg-gradient-to-r from-[#002F6C] to-[#4FC4D4]',
          navActive:  isDark ? 'bg-[#2F3638] border-[#4FC4D4] text-[#4FC4D4] font-bold' : 'bg-white border-[#002F6C] text-[#002F6C] font-bold',
          navUnlock:  isDark ? 'hover:bg-[#2F3638] bg-[#262626] border-zinc-800/80 text-[#EFEFE8]' : 'hover:bg-slate-50 bg-white border-slate-200 text-[#2F3638]',
          xp:         isDark ? 'bg-[#4FC4D4]/10 border-[#4FC4D4]/20 text-[#4FC4D4]' : 'bg-[#002F6C]/10 border-[#002F6C]/20 text-[#002F6C]',
          tabOn:      'bg-[#002F6C] text-white',
          tabOff:     isDark ? 'bg-[#2F3638] text-[#EFEFE8]/75 hover:text-white' : 'bg-slate-100 text-[#2F3638] hover:bg-slate-200 border border-slate-200',
          secondary:  isDark ? 'text-zinc-400' : 'text-[#6E6E6E]',
          border:     isDark ? 'border-zinc-800' : 'border-slate-200',
          header:     isDark ? 'bg-[#1A1A1A] border-zinc-800' : 'bg-white border-slate-200',
          footer:     isDark ? 'bg-[#1A1A1A] border-zinc-800' : 'bg-white border-slate-200',
        };
      }, [settings.colorTheme, isDark]);

      const startCourse = () => {
        if (settings.askForStudentName && !studentName.trim()) {
          alert("Please enter your name to register your training enrollment.");
          return;
        }
        playChime('success');
        setStep('playing');
      };

      const nextSlide = () => {
        // If questions are required, check the current section's quiz before advancing
        if (settings.questionsRequired && currentSection?.questions?.length > 0 && currentSection.includeQuestions !== false) {
          // A question counts as attempted if the student clicked any answer (quizAnswers) OR already passed it
          const allAttempted = currentSection.questions.every(q => quizAnswers[q.id] !== undefined || quizPassed[q.id] === true);
          if (!allAttempted) {
            playChime('fail');
            setShowQuizPrompt(true);
            setTimeout(() => setShowQuizPrompt(false), 5000);
            return;
          }
        }

        if (currentSectionIndex < course.sections.length - 1) {
          const nextIndex = currentSectionIndex + 1;
          const nextSectionId = course.sections[nextIndex].id;
          if (!unlockedSections.includes(nextSectionId)) {
            setUnlockedSections(prev => [...prev, nextSectionId]);
          }
          playChime('success');
          setCurrentSectionIndex(nextIndex);
          setXp(px => px + 100);
        } else {
          // Last section — check passing score before completing
          if (settings.questionsRequired && scorePercentage < (settings.passingScorePercent || 80)) {
            playChime('fail');
            setShowFailureModal(true);
            return;
          }
          completeCourse();
        }
      };

      const prevSlide = () => {
        if (currentSectionIndex > 0) {
          setCurrentSectionIndex(currentSectionIndex - 1);
        }
      };

      const completeCourse = () => {
        playChime('congrats');
        setStep('completed');
        setCourseActuallyCompleted(true);

        const passedCheck = scorePercentage >= (settings.passingScorePercent || 80);
        SCORM.reportScoreAndPassed(
          correctQuizCount,
          totalPossibleQuizCount,
          scorePercentage,
          passedCheck
        );
      };

      const handleAnswerQuiz = (questionId, selectedIdx, correctIdx) => {
        // Prevent double score addition
        if (quizPassed[questionId]) return;

        setQuizAnswers(prev => ({ ...prev, [questionId]: selectedIdx }));
        
        const isCorrect = (selectedIdx === correctIdx);
        const priorAttempts = quizAttempts[questionId] || 0;
        setQuizAttempts(prev => ({ ...prev, [questionId]: priorAttempts + 1 }));

        if (isCorrect) {
          playChime('success');
          setQuizPassed(prev => ({ ...prev, [questionId]: true }));
          
          // XP Awards: 200 XP for answering correctly on first try, 100 XP if retry
          const awardXp = priorAttempts === 0 ? 200 : 100;
          setXp(p => p + awardXp);

          // If auto progress is enabled and this section has no more unanswered questions
          if (settings.autoProgress) {
            setTimeout(() => {
              // Validate if all questions in active section were answered correctly
              const allDone = currentSection.questions.every(q => q.id === questionId || quizPassed[q.id]);
              if (allDone) {
                nextSlide();
              }
            }, 1000);
          }
        } else {
          playChime('fail');
          setQuizPassed(prev => ({ ...prev, [questionId]: false }));
        }
      };

      // Inline Helper Components
      const Icon = ({ name, className = "w-5 h-5" }) => {
        return React.createElement('i', { 
          'data-lucide': name, 
          className: className, 
          style: { display: 'inline-block' } 
        });
      };

      // --- SECTION CARD RENDER DIALECT ---
      const renderSectionLayoutContent = () => {
        if (!currentSection) return null;

        const layout = currentSection.layoutType;

        switch (layout) {
          case 'text_video': {
            const data = currentSection.text_video || { text: '', videoUrl: '', caption: '' };
            // Convert embed URL to watch URL for the external link
            const watchUrl = data.videoUrl
              ? data.videoUrl.replace('youtube.com/embed/', 'youtube.com/watch?v=').replace('youtu.be/embed/', 'youtube.com/watch?v=')
              : '';
            // YouTube iframes fail on file:// protocol (Error 153). Detect this and show a clean placeholder instead.
            const isFileProtocol = window.location.protocol === 'file:';

            return React.createElement('div', { className: 'grid grid-cols-1 lg:grid-cols-12 gap-6 items-start' },
              React.createElement('div', { className: 'lg:col-span-7 space-y-3' },
                React.createElement('p', { className: 'text-sm leading-relaxed' }, data.text)
              ),
              React.createElement('div', { className: 'lg:col-span-5 rounded-xl overflow-hidden shadow-lg border ' + (isDark ? 'bg-zinc-950 border-zinc-800' : 'bg-slate-900 border-slate-800') },
                data.videoUrl ? React.createElement('div', null,
                  // Show iframe only when served over HTTP/HTTPS — on file:// it always fails
                  !isFileProtocol
                    ? React.createElement('div', { className: 'relative pb-[56.25%] h-0' },
                        React.createElement('iframe', {
                          src: data.videoUrl,
                          className: 'absolute top-0 left-0 w-full h-full border-0',
                          allow: 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture',
                          allowFullScreen: true
                        })
                      )
                    // Clean placeholder when opened as a local file
                    : React.createElement('div', { className: 'flex flex-col items-center justify-center gap-4 py-10 px-6 text-center' },
                        React.createElement('div', { className: 'w-16 h-16 rounded-full bg-red-600/15 flex items-center justify-center' },
                          React.createElement('span', { className: 'text-3xl' }, '▶')
                        ),
                        React.createElement('div', { className: 'space-y-1' },
                          React.createElement('p', { className: 'text-xs font-bold text-zinc-300' }, 'Video available when hosted online'),
                          React.createElement('p', { className: 'text-[10px] text-zinc-500 font-mono' }, 'YouTube videos require a web server to embed.')
                        ),
                        watchUrl && React.createElement('a', {
                          href: watchUrl,
                          target: '_blank',
                          rel: 'noopener noreferrer',
                          className: 'inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold font-mono transition-all'
                        }, '▶ Watch on YouTube')
                      ),
                  // Caption + YouTube link always shown at the bottom
                  React.createElement('div', { className: 'px-3 py-2 flex items-center justify-between border-t border-zinc-800 gap-2' },
                    data.caption && React.createElement('p', { className: 'text-[10px] text-zinc-400 font-mono italic truncate' }, data.caption),
                    !isFileProtocol && watchUrl && React.createElement('a', {
                      href: watchUrl,
                      target: '_blank',
                      rel: 'noopener noreferrer',
                      className: 'flex-shrink-0 text-[10px] font-mono font-bold px-2.5 py-1 rounded-lg bg-red-600 hover:bg-red-500 text-white transition-all'
                    }, '▶ YouTube')
                  )
                ) : React.createElement('div', { className: 'p-10 text-center text-zinc-500 text-xs font-mono' }, "No video URL configured")
              )
            );
          }

          case 'text_table': {
            const data = currentSection.text_table || { text: '', headers: [], rows: [] };
            return React.createElement('div', { className: 'space-y-6' },
              React.createElement('p', { className: 'text-base leading-relaxed opacity-90' }, data.text),
              React.createElement('div', { className: 'overflow-x-auto border rounded-xl divide-y ' + (isDark ? 'border-slate-800 bg-slate-900 divide-slate-800' : 'border-slate-200 bg-white divide-slate-200') },
                React.createElement('table', { className: 'w-full text-sm font-mono' },
                  React.createElement('thead', { className: isDark ? 'bg-slate-950 text-slate-300' : 'bg-slate-100 text-slate-700' },
                    React.createElement('tr', null,
                      data.headers?.map((h, i) => React.createElement('th', { key: i, className: 'px-5 py-3.5 text-left font-bold' }, h))
                    )
                  ),
                  React.createElement('tbody', { className: 'divide-y ' + (isDark ? 'divide-slate-800' : 'divide-slate-200') },
                    data.rows?.map((row, rIdx) => {
                      // Map badges to specific styles
                      let badgeStyle = isDark ? "text-slate-400 bg-slate-400/10" : "text-slate-700 bg-slate-100 border border-slate-200";
                      if (row.badgeType === 'success') badgeStyle = isDark ? "text-emerald-400 bg-emerald-500/10" : "text-emerald-800 bg-emerald-50 border border-emerald-100 font-bold";
                      if (row.badgeType === 'warning') badgeStyle = isDark ? "text-amber-400 bg-amber-500/10" : "text-amber-900 bg-amber-50 border border-amber-200 font-bold";
                      if (row.badgeType === 'danger') badgeStyle = isDark ? "text-rose-400 bg-rose-500/10" : "text-rose-800 bg-rose-50 border border-rose-200 font-bold";
                      if (row.badgeType === 'info') badgeStyle = isDark ? "text-blue-400 bg-blue-500/10" : "text-blue-800 bg-blue-50 border border-blue-200 font-bold";

                      return React.createElement('tr', { key: rIdx, className: isDark ? 'hover:bg-slate-800/50' : 'hover:bg-slate-50' },
                        React.createElement('td', { className: 'px-5 py-4 font-bold' }, row.col1),
                        React.createElement('td', { className: 'px-5 py-4 opacity-90' }, row.col2),
                        row.col3 !== undefined && React.createElement('td', { className: 'px-5 py-4' },
                          React.createElement('span', { className: 'px-2.5 py-1 text-xs rounded-full ' + badgeStyle }, row.col3)
                        )
                      );
                    })
                  )
                )
              )
            );
          }

          case 'cards_grid': {
            const data = currentSection.cards_grid || { text: '', cards: [] };
            return React.createElement('div', { className: 'space-y-6' },
              React.createElement('p', { className: 'text-base leading-relaxed opacity-90 mb-2' }, data.text),
              React.createElement('div', { className: 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6' },
                data.cards?.map((card) => {
                  const flipped = !!cardFlips[card.id];
                  const studied = !!masteredCards[card.id];

                  return React.createElement('div', {
                    key: card.id,
                    onClick: () => {
                      setCardFlips(prev => ({ ...prev, [card.id]: !flipped }));
                      if (!studied) {
                        setMasteredCards(p => ({ ...p, [card.id]: true }));
                        setXp(x => x + 25);
                        playChime('success');
                      }
                    },
                    className: 'relative h-72 cursor-pointer rounded-2xl perspective-1000 select-none group overflow-hidden'
                  },
                    React.createElement('div', {
                      className: 'w-full h-full duration-500 transform-style-3d relative transition-transform ' + (flipped ? 'rotate-y-180' : '')
                    },
                      // FRONT CARD
                      React.createElement('div', {
                        className: 'absolute inset-0 w-full h-full rounded-2xl p-4 border flex flex-col justify-between backface-hidden shadow-md group-hover:shadow-lg transition-shadow ' +
                          (isDark ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-800')
                      },
                        React.createElement('div', { className: 'flex justify-between items-start gap-1' },
                          card.badge ? React.createElement('span', { className: 'text-[9px] uppercase tracking-widest font-mono py-0.5 px-1.5 rounded bg-amber-500/10 text-amber-500 font-bold flex-shrink-0' }, card.badge) : React.createElement('div'),
                          studied ? React.createElement('span', { className: 'text-sm text-emerald-500 font-bold flex-shrink-0' }, "✔") : null
                        ),
                        React.createElement('h4', { className: 'heading-font text-sm font-bold tracking-tight text-center px-1' }, card.title),
                        React.createElement('div', { className: 'flex justify-between items-center text-[10px] font-mono ' + (isDark ? 'text-slate-400' : 'text-slate-600') },
                          React.createElement('span', null, "Tap to investigate"),
                          React.createElement('span', { className: isDark ? 'text-amber-400' : 'text-amber-700 font-bold' }, "+25 XP")
                        )
                      ),
                      // BACK CARD — text-xs + overflow-y-auto prevents overflow
                      React.createElement('div', {
                        className: 'absolute inset-0 w-full h-full rounded-2xl p-4 border flex flex-col gap-2 backface-hidden rotate-y-180 shadow-inner overflow-hidden ' +
                          (isDark ? 'bg-amber-950/20 border-amber-900/50 text-amber-100' : 'bg-amber-50 border-amber-200 text-amber-900')
                      },
                        React.createElement('p', { className: 'text-xs leading-relaxed font-medium flex-1 overflow-y-auto' }, card.backContent),
                        React.createElement('div', { className: 'text-right text-[9px] font-mono flex-shrink-0 ' + (isDark ? 'text-amber-500' : 'text-amber-700') }, "Tap to return ⟳")
                      )
                    )
                  );
                })
              )
            );
          }

          case 'bento_highlights': {
            const data = currentSection.bento_highlights || { text: '', boxes: [] };
            return React.createElement('div', { className: 'space-y-6' },
              React.createElement('p', { className: 'text-base leading-relaxed opacity-90' }, data.text),
              React.createElement('div', { className: 'grid grid-cols-1 md:grid-cols-6 gap-5 auto-rows-[200px]' },
                data.boxes?.map((box) => {
                  let sizeClass = "md:col-span-2"; // small
                  if (box.size === 'medium') sizeClass = "md:col-span-3";
                  if (box.size === 'large') sizeClass = "md:col-span-4";

                  // Color presets mapping
                  let boxStyles = "bg-slate-900 border-slate-800 text-slate-100 hover:border-blue-500/40";
                  let valueAccent = "text-blue-400";
                  if (box.colorPreset === 'emerald') {
                    boxStyles = isDark ? "bg-emerald-950/20 border-emerald-900/50 text-emerald-100 hover:border-emerald-500/50" : "bg-emerald-50 border-emerald-200/60 text-emerald-800 hover:border-emerald-500/50";
                    valueAccent = "text-emerald-500";
                  } else if (box.colorPreset === 'amber') {
                    boxStyles = isDark ? "bg-amber-950/20 border-amber-900/50 text-amber-100 hover:border-amber-500/50" : "bg-amber-50 border-amber-200/60 text-amber-800 hover:border-amber-400/50";
                    valueAccent = "text-amber-500";
                  } else if (box.colorPreset === 'rose') {
                    boxStyles = isDark ? "bg-rose-950/20 border-rose-900/50 text-rose-100 hover:border-rose-500/50" : "bg-rose-50 border-rose-200/60 text-rose-800 hover:border-rose-500/50";
                    valueAccent = "text-rose-500";
                  } else if (box.colorPreset === 'blue') {
                    boxStyles = isDark ? "bg-blue-950/20 border-blue-900/50 text-blue-100 hover:border-blue-500/50" : "bg-blue-50 border-blue-200/60 text-blue-800 hover:border-blue-500/50";
                    valueAccent = "text-blue-500";
                  } else if (isDark) {
                    boxStyles = "bg-slate-900 border-slate-800 text-slate-100 hover:border-slate-700";
                    valueAccent = "text-slate-300";
                  } else {
                    boxStyles = "bg-white border-slate-300 text-slate-800 hover:border-slate-400";
                    valueAccent = "text-slate-900";
                  }

                  return React.createElement('div', {
                    key: box.id,
                    className: 'rounded-2xl border p-6 flex flex-col justify-between transition-all duration-300 shadow-sm relative overflow-hidden group ' + sizeClass + ' ' + boxStyles
                  },
                    React.createElement('div', { className: 'space-y-1.5' },
                      React.createElement('span', { className: 'text-[11px] font-mono uppercase tracking-widest ' + (isDark ? 'text-slate-400' : 'text-slate-600') }, box.title),
                      box.value && React.createElement('h3', { className: 'heading-font text-2xl font-bold tracking-tight ' + valueAccent }, box.value)
                    ),
                    React.createElement('p', { className: 'text-xs leading-relaxed opacity-80 font-medium' }, box.description)
                  );
                })
              )
            );
          }

          case 'milestone_timeline': {
            const data = currentSection.milestone_timeline || { text: '', steps: [] };
            return React.createElement('div', { className: 'space-y-6' },
              React.createElement('p', { className: 'text-base leading-relaxed opacity-90' }, data.text),
              React.createElement('div', { className: 'relative pl-5 md:pl-8 border-l border-amber-500/35 space-y-8 py-2 ml-4' },
                data.steps?.map((step) => {
                  return React.createElement('div', { key: step.id, className: 'relative group' },
                    // Step Dot marker
                    React.createElement('div', { className: 'absolute -left-[30px] md:-left-[43px] top-1 w-6 h-6 md:w-8 md:h-8 rounded-full border bg-slate-900 border-amber-500 flex items-center justify-center font-bold font-mono text-[10px] md:text-xs text-amber-400 group-hover:scale-110 transition-transform shadow-md' }, step.stepNumber),
                    React.createElement('div', { className: 'p-5 rounded-2xl border shadow-sm transition-all duration-200 ' + (isDark ? 'bg-slate-900/50 border-slate-800 hover:border-slate-700' : 'bg-white border-slate-200 hover:border-slate-300') },
                      React.createElement('div', { className: 'flex justify-between items-center mb-1.5 flex-wrap gap-2' },
                        React.createElement('h4', { className: 'heading-font text-base font-bold' }, step.title),
                        step.badgeText && React.createElement('span', { className: 'text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-500/10 text-amber-500 border border-amber-500/25' }, step.badgeText)
                      ),
                      React.createElement('p', { className: 'text-xs opacity-95 leading-relaxed' }, step.description)
                    )
                  );
                })
              )
            );
          }

          case 'code_quote_spotlight': {
            const data = currentSection.code_quote_spotlight || { spotlightText: '', captionTitle: '', languageOrAuthor: '', mainText: '', isCode: false };
            return React.createElement('div', { className: 'grid grid-cols-1 lg:grid-cols-12 gap-8 items-start' },
              React.createElement('div', { className: 'lg:col-span-6 space-y-4' },
                React.createElement('p', { className: 'text-base leading-relaxed opacity-90' }, data.mainText)
              ),
              React.createElement('div', { className: 'lg:col-span-6 rounded-2xl overflow-hidden border bg-stone-900 border-stone-800 shadow-xl' },
                // Header of panel
                React.createElement('div', { className: 'px-4 py-2 bg-stone-950 border-b border-stone-800 flex justify-between items-center text-[10px] font-mono text-stone-400' },
                  React.createElement('span', { className: 'flex items-center gap-1.5' },
                    React.createElement('span', { className: 'w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block' }),
                    React.createElement('span', { className: 'w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block' }),
                    React.createElement('span', { className: 'w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block' }),
                    React.createElement('span', { className: 'ml-1' }, data.captionTitle || "Terminal")
                  ),
                  React.createElement('span', { className: 'uppercase tracking-widest text-[#fbbf24] font-bold' }, data.languageOrAuthor || "text")
                ),
                // Panel Body
                React.createElement('div', { className: 'p-6 group relative' },
                  data.isCode ? React.createElement('pre', { className: 'code-font text-xs text-stone-200 overflow-x-auto whitespace-pre-wrap leading-relaxed' },
                    React.createElement('code', null, data.spotlightText)
                  ) : React.createElement('div', { className: 'serif-font text-xl md:text-2xl text-[#fbbf24] font-medium leading-relaxed italic block' },
                    "“" + data.spotlightText + "”"
                  )
                )
              )
            );
          }

          case 'multi_tab_dive': {
            const data = currentSection.multi_tab_dive || { text: '', tabs: [] };
            const selectedTab = data.tabs?.find(t => t.id === activeTabId) || data.tabs?.[0];

            return React.createElement('div', { className: 'space-y-6' },
              React.createElement('p', { className: 'text-base leading-relaxed opacity-90' }, data.text),
              // Tab Pills
              React.createElement('div', { className: 'flex flex-wrap gap-2 border-b pb-3 ' + (isDark ? 'border-slate-800' : 'border-slate-200') },
                data.tabs?.map((tb) => {
                  const isActive = tb.id === activeTabId;
                  return React.createElement('button', {
                    key: tb.id,
                    onClick: () => setActiveTabId(tb.id),
                    className: 'px-4 py-2 text-xs rounded-xl font-bold font-mono transition-all ' + (isActive ? theme.tabOn : theme.tabOff)
                  }, tb.label);
                })
              ),
              // Active tab detail view
              selectedTab && React.createElement('div', { className: 'p-6 rounded-2xl border transition-all duration-300 ' + (isDark ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-800') },
                React.createElement('h4', { className: 'heading-font text-lg font-bold mb-2.5 ' + theme.accent }, selectedTab.title),
                React.createElement('p', { className: 'text-sm leading-relaxed mb-4 opacity-90' }, selectedTab.content),
                selectedTab.sublist?.length ? React.createElement('div', { className: 'space-y-2' },
                  React.createElement('span', { className: 'text-[10px] uppercase font-mono tracking-widest font-extrabold block ' + (isDark ? 'text-slate-400' : 'text-slate-700') }, "Key Take-aways & Attributes:"),
                  React.createElement('ul', { className: 'list-disc list-inside text-xs font-mono space-y-1.5 ' + (isDark ? 'text-slate-300' : 'text-slate-700') },
                    selectedTab.sublist.map((sm, i) => React.createElement('li', { key: i }, sm))
                  )
                ) : null
              )
            );
          }

          case 'qa_accordion': {
            const data = currentSection.qa_accordion || { text: '', items: [] };
            return React.createElement('div', { className: 'space-y-6' },
              React.createElement('p', { className: 'text-base leading-relaxed opacity-90' }, data.text),
              React.createElement('div', { className: 'space-y-3' },
                data.items?.map((item) => {
                  const isOpen = !!openAccordionIds[item.id];
                  return React.createElement('div', {
                    key: item.id,
                    className: 'border rounded-xl overflow-hidden transition-all duration-200 ' +
                      (isDark ? 'border-slate-800 bg-slate-900' : 'border-slate-200 bg-white')
                  },
                    // Header clicker trigger
                    React.createElement('button', {
                      onClick: () => setOpenAccordionIds(p => ({ ...p, [item.id]: !isOpen })),
                      className: 'w-full text-left px-5 py-4 flex justify-between items-center transition-colors ' +
                        (isDark ? 'hover:bg-slate-900' : 'hover:bg-slate-50')
                    },
                      React.createElement('span', { className: 'text-xs md:text-sm font-bold opacity-95' }, item.trigger),
                      React.createElement('span', { className: 'text-xs text-amber-500' }, isOpen ? "▲" : "▼")
                    ),
                    // Expander body
                    isOpen && React.createElement('div', { className: 'px-5 pb-5 pt-1 text-xs md:text-sm leading-relaxed border-t ' + (isDark ? 'border-slate-800 text-slate-300' : 'border-slate-300 text-slate-700') },
                      item.content
                    )
                  );
                })
              )
            );
          }

          default:
            return React.createElement('p', null, "Unknown slide layout style loaded.");
        }
      };

      // If page is intro screen
      if (step === 'intro') {
        return React.createElement('div', { className: 'min-h-screen flex items-center justify-center p-6 relative transition-colors duration-200 ' + theme.bg },

          // Theme toggle — absolute top-right, outside the card (matches SimulatorPlayer)
          React.createElement('div', { className: 'absolute top-4 right-4 z-10' },
            React.createElement('button', {
              onClick: () => setIsDark(!isDark),
              className: 'px-3 py-1.5 text-xs rounded-lg border font-mono transition-all flex items-center gap-1.5 ' +
                (isDark ? 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50')
            }, isDark ? "☀️ Light Mode" : "🌙 Dark Mode")
          ),

          // Card — max-w-md to match SimulatorPlayer, rounded-2xl, shadow-xl
          React.createElement('div', { className: 'max-w-md w-full p-8 border shadow-xl rounded-2xl space-y-6 transition-all duration-300 ' + theme.card },

            // Badge + title + version
            React.createElement('div', { className: 'space-y-2' },
              React.createElement('span', {
                className: 'text-[10px] uppercase tracking-wider border px-2.5 py-0.5 rounded font-mono font-semibold block w-max ' + theme.xp
              }, "LMS Training Course"),
              React.createElement('h1', { className: 'heading-font text-xl md:text-2xl font-black tracking-tight ' + theme.accent }, metadata.title),
              React.createElement('p', { className: 'text-[10px] font-mono ' + theme.secondary },
                "Version " + metadata.version + "  •  " + metadata.publicationDate
              )
            ),

            // Description
            React.createElement('p', { className: 'text-xs leading-relaxed ' + (isDark ? 'text-zinc-200' : 'text-slate-800 font-medium') }, metadata.description),

            // Publisher info box — matches SimulatorPlayer's shield+info layout
            React.createElement('div', {
              className: 'p-3 border rounded-xl flex items-center gap-2.5 font-mono text-[11px] ' +
                (isDark ? 'bg-zinc-950/40 border-zinc-900/60' : 'bg-slate-50 border-slate-200')
            },
              React.createElement('span', { className: 'text-lg flex-shrink-0', role: 'img', 'aria-label': 'shield' }, '🛡'),
              React.createElement('div', null,
                React.createElement('span', { className: 'block text-[10px] ' + theme.secondary }, "Publisher & Owner:"),
                React.createElement('strong', { className: isDark ? 'text-zinc-100' : 'text-slate-900' }, metadata.owner)
              )
            ),

            // Course tips — flashcard/quiz guidance + required indicator
            (() => {
              const flashcardSections = course.sections.filter(s => s.flashcards?.length > 0 && s.includeFlashcards !== false).length;
              const quizSections = course.sections.filter(s => s.questions?.length > 0 && s.includeQuestions !== false).length;
              if (flashcardSections === 0 && quizSections === 0) return null;
              return React.createElement('div', {
                className: 'space-y-2 p-3.5 border rounded-xl ' + (isDark ? 'bg-zinc-950/50 border-zinc-800' : 'bg-slate-50 border-slate-200')
              },
                React.createElement('p', { className: 'text-[10px] font-mono font-bold uppercase tracking-wider mb-2 ' + theme.secondary }, 'How to use this course:'),
                flashcardSections > 0 && React.createElement('div', { className: 'flex items-start gap-2.5 text-[11px]' },
                  React.createElement('span', { className: 'flex-shrink-0 px-1.5 py-0.5 rounded text-[9px] font-bold font-mono bg-emerald-600 text-white' }, 'FLASHCARDS'),
                  React.createElement('span', { className: isDark ? 'text-zinc-300' : 'text-slate-700' },
                    'Click ', React.createElement('strong', null, 'Flashcards'), ' in sections where available to review key concepts before the quiz.'
                  )
                ),
                quizSections > 0 && React.createElement('div', { className: 'flex items-start gap-2.5 text-[11px] mt-1.5' },
                  React.createElement('span', { className: 'flex-shrink-0 px-1.5 py-0.5 rounded text-[9px] font-bold font-mono bg-blue-600 text-white' }, 'QUIZ'),
                  React.createElement('span', { className: isDark ? 'text-zinc-300' : 'text-slate-700' },
                    'Click ', React.createElement('strong', null, 'Quiz'), ' to take a knowledge check. ',
                    settings.questionsRequired
                      ? React.createElement('span', { className: 'font-bold text-amber-500' }, 'Required to proceed to the next section.')
                      : React.createElement('span', { className: isDark ? 'text-zinc-400' : 'text-slate-500' }, 'Optional — use it to test your understanding.')
                  )
                ),
                settings.questionsRequired && quizSections > 0 && React.createElement('div', {
                  className: 'mt-2 pt-2 border-t flex items-center gap-2 text-[10px] font-mono font-bold text-amber-500 ' + (isDark ? 'border-zinc-800' : 'border-slate-200')
                },
                  React.createElement('span', null, '⚠'),
                  React.createElement('span', null, 'A passing score of ' + (settings.passingScorePercent || 80) + '% is required to complete this course.')
                )
              );
            })(),

            // Student name input
            settings.askForStudentName ? React.createElement('div', { className: 'space-y-1.5' },
              React.createElement('label', { className: 'text-[10px] font-mono uppercase tracking-wider block ' + theme.secondary }, "Enroll Student Name:"),
              React.createElement('input', {
                type: 'text',
                placeholder: 'e.g. Marie Robbins',
                value: studentName,
                onChange: (e) => setStudentName(e.target.value),
                className: 'w-full px-3.5 py-2.5 border rounded-xl font-mono text-xs outline-none transition-all focus:ring-2 focus:ring-blue-600 ' +
                  (isDark ? 'bg-zinc-950 border-zinc-800 text-white focus:border-zinc-700' : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-slate-300')
              })
            ) : null,

            // Action buttons
            React.createElement('div', { className: 'pt-2 flex gap-2' },
              React.createElement('button', {
                onClick: startCourse,
                className: 'flex-grow py-3 px-4 flex items-center justify-center gap-1.5 font-bold font-mono text-xs uppercase rounded-xl transition-all hover:-translate-y-0.5 hover:shadow-lg cursor-pointer ' + theme.btn
              }, "Start Course →"),

              settings.allowHomeSummaryAccess ? React.createElement('button', {
                onClick: () => { playChime('success'); setStep('completed'); },
                className: 'px-4 py-3 font-mono font-bold uppercase text-xs rounded-xl border transition-all hover:-translate-y-0.5 cursor-pointer flex items-center gap-1.5 ' +
                  (isDark ? 'bg-zinc-800 hover:bg-zinc-700 border-zinc-700 text-zinc-300' : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-800')
              }, "Summary ⚡") : null
            )
          )
        );
      }

      // If page is main course playing slide
      if (step === 'playing') {
        const totalSlides = course.sections.length;
        const widthPercentage = Math.round(((currentSectionIndex + 1) / totalSlides) * 100);
        const hasFlashcards = !!(currentSection.flashcards?.length && currentSection.includeFlashcards !== false);
        const hasQuiz = !!(currentSection.questions?.length && currentSection.includeQuestions !== false);

        // Accent color palette for section cards (matches builder sidebar)
        const accentPalette = ['#EF4444','#F97316','#F59E0B','#10B981','#3B82F6','#A855F7','#F43F5E','#14B8A6'];

        // Layout type short label + color for sidebar badges
        const layoutBadge = (type) => {
          const map = {
            text_video:           { label: 'VIDEO',    color: 'text-emerald-500' },
            text_table:           { label: 'TABLE',    color: 'text-blue-500' },
            cards_grid:           { label: 'CARDS',    color: 'text-purple-500' },
            bento_highlights:     { label: 'BENTO',    color: 'text-amber-500' },
            milestone_timeline:   { label: 'TIMELINE', color: 'text-pink-500' },
            code_quote_spotlight: { label: 'CODE',     color: 'text-cyan-500' },
            multi_tab_dive:       { label: 'TABS',     color: 'text-indigo-400' },
            qa_accordion:         { label: 'FAQ',      color: 'text-rose-500' },
          };
          return map[type] || { label: 'SECTION', color: 'text-slate-400' };
        };

        const renderQuizPanel = () => React.createElement('div', { className: 'space-y-4 overflow-y-auto' },
          currentSection.questions.map((q) => {
            const attemptedIdx = quizAnswers[q.id];
            const alreadyPassed = !!quizPassed[q.id];
            const hasAnswered = attemptedIdx !== undefined;
            return React.createElement('div', { key: q.id, className: 'p-5 rounded-2xl border shadow-sm ' + theme.card },
              React.createElement('p', { className: 'heading-font text-sm font-bold mb-3' }, q.questionText),
              React.createElement('div', { className: 'grid grid-cols-1 md:grid-cols-2 gap-2 mb-3' },
                q.options?.map((opt, oIdx) => {
                  const isCorrect = oIdx === q.correctOptionIndex;
                  const isChosen = oIdx === attemptedIdx;
                  let cls = isDark ? "bg-slate-950 border-slate-800 hover:border-slate-700" : "bg-white border-slate-200 hover:bg-slate-50";
                  let mark = "";
                  if (alreadyPassed) {
                    // Answered correctly — reveal green checkmark on correct, fade others
                    if (isCorrect) { cls = "border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"; mark = " ✔"; }
                    else { cls = "opacity-40"; }
                  } else if (hasAnswered && isChosen) {
                    // Wrong attempt — only mark the chosen option red; leave others normal so they can retry
                    cls = "border-rose-500 bg-rose-500/10 text-rose-700 dark:text-rose-300"; mark = " ✘";
                  }
                  return React.createElement('button', {
                    key: oIdx, disabled: alreadyPassed,
                    onClick: () => handleAnswerQuiz(q.id, oIdx, q.correctOptionIndex),
                    className: 'w-full text-left px-4 py-3 rounded-xl border font-mono text-xs font-bold transition-all flex justify-between items-center ' + cls
                  }, React.createElement('span', null, opt), React.createElement('strong', null, mark));
                })
              ),
              hasAnswered && React.createElement('div', {
                className: 'p-3 rounded-xl text-xs font-mono border ' + (alreadyPassed
                  ? (isDark ? 'bg-emerald-950/20 border-emerald-900/50 text-emerald-300' : 'bg-emerald-50 border-emerald-300 text-emerald-800')
                  : (isDark ? 'bg-rose-950/20 border-rose-900/50 text-rose-300' : 'bg-rose-50 border-rose-200 text-rose-800'))
              },
                React.createElement('span', { className: 'font-bold block mb-1' }, alreadyPassed ? "✔ Correct! XP Awarded" : "✘ Incorrect — try again:"),
                React.createElement('p', null, q.explanation)
              )
            );
          })
        );

        const renderFlashcardsPanel = () => React.createElement('div', { className: 'grid grid-cols-1 sm:grid-cols-2 gap-4' },
          currentSection.flashcards.map((fc) => {
            const isFlipped = !!cardFlips[fc.id];
            return React.createElement('div', {
              key: fc.id,
              onClick: () => setCardFlips(p => ({ ...p, [fc.id]: !isFlipped })),
              className: 'h-40 cursor-pointer relative perspective-1000 select-none'
            },
              React.createElement('div', { className: 'w-full h-full duration-500 transform-style-3d relative transition-transform ' + (isFlipped ? 'rotate-y-180' : '') },
                React.createElement('div', { className: 'absolute inset-0 rounded-2xl border p-4 flex flex-col justify-between backface-hidden shadow-sm ' + theme.card },
                  React.createElement('span', { className: 'text-[9px] uppercase font-mono tracking-widest ' + theme.secondary }, "Flashcard"),
                  React.createElement('p', { className: 'heading-font text-xs md:text-sm font-bold text-center py-2' }, fc.front),
                  React.createElement('span', { className: 'text-[9px] font-mono text-right ' + theme.accent }, "Tap to reveal ⟳")
                ),
                React.createElement('div', { className: 'absolute inset-0 rounded-2xl border p-4 flex flex-col justify-between rotate-y-180 backface-hidden shadow-inner ' + theme.panel },
                  React.createElement('p', { className: 'text-xs leading-relaxed font-mono font-medium overflow-y-auto' }, fc.back),
                  React.createElement('span', { className: 'text-[9px] font-mono text-right ' + theme.secondary }, "Tap to return")
                )
              )
            );
          })
        );

        return React.createElement('div', { className: 'h-screen flex flex-col overflow-hidden ' + theme.bg },

          // HEADER
          React.createElement('header', { className: 'border-b px-4 py-3 flex items-center justify-between no-print flex-shrink-0 ' + theme.header },
            React.createElement('div', { className: 'flex items-center gap-2.5 overflow-hidden mr-4' },
              // HOME button — always visible, navigates back to landing screen
              React.createElement('button', {
                onClick: () => { playChime('success'); setStep('intro'); },
                className: 'px-3 py-1.5 border flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-tight rounded-xl transition-all cursor-pointer flex-shrink-0 ' +
                  (isDark ? 'bg-zinc-800 border-zinc-700 text-zinc-200 hover:bg-zinc-700' : 'bg-slate-50 border-slate-300 text-slate-800 hover:bg-slate-100'),
                title: 'Return to course landing page'
              }, "🏠 Home"),
              React.createElement('span', { className: 'px-2.5 py-1 rounded-lg text-[10px] font-mono uppercase font-extrabold flex-shrink-0 ' + theme.btn }, "Lvl " + currentLevel),
              React.createElement('h2', { className: 'heading-font text-xs md:text-sm font-bold truncate tracking-tight ' + theme.accent }, metadata.title)
            ),
            React.createElement('div', { className: 'flex items-center gap-2 font-mono flex-shrink-0 select-none' },
              React.createElement('div', { className: 'px-3 py-1.5 rounded-xl border flex items-center gap-1.5 text-xs font-bold ' + theme.xp },
                React.createElement('span', null, "🔥"), React.createElement('strong', null, xp + " XP")
              ),
              React.createElement('button', {
                onClick: () => setIsDark(!isDark),
                className: 'p-1.5 rounded-xl border text-xs ' + (isDark ? 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700' : 'bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200')
              }, isDark ? "☀️" : "🌙")
            )
          ),

          // MAIN CONTENT
          React.createElement('main', { className: 'flex-1 min-h-0 max-w-6xl w-full mx-auto p-4 md:p-6 grid grid-cols-1 xl:grid-cols-12 gap-6 overflow-hidden' },

            // Sidebar nav (desktop) — rich section cards matching builder preview
            React.createElement('aside', { className: 'xl:col-span-3 hidden xl:flex flex-col no-print min-h-0 ' + theme.panel.split(' ').filter(c => !c.startsWith('bg-') && !c.startsWith('border')).join(' ') },
              React.createElement('div', { className: 'text-[9px] font-mono uppercase tracking-wider font-bold flex justify-between items-center flex-shrink-0 pb-2 mb-2 border-b ' + theme.border + ' ' + theme.secondary },
                React.createElement('span', null, "Section Outline"),
                React.createElement('span', null, unlockedSections.length + " / " + course.sections.length + " Unlocked")
              ),
              React.createElement('div', { className: 'space-y-2.5 overflow-y-auto flex-1 pr-0.5' },
                course.sections.map((sect, sIdx) => {
                  const isActive = sIdx === currentSectionIndex;
                  const isUnlocked = unlockedSections.includes(sect.id);
                  const accentColor = sect.accentColor || accentPalette[sIdx % 8];
                  const badge = layoutBadge(sect.layoutType);

                  return React.createElement('div', {
                    key: sect.id,
                    role: 'button',
                    tabIndex: isUnlocked ? 0 : -1,
                    onClick: () => { if (isUnlocked) { playChime('success'); setCurrentSectionIndex(sIdx); } },
                    className: 'p-2.5 pl-5 border flex flex-col text-left transition-all relative rounded-xl select-none overflow-hidden ' +
                      (isActive
                        ? theme.navActive
                        : isUnlocked
                          ? theme.navUnlock + ' cursor-pointer'
                          : 'opacity-50 cursor-not-allowed ' + (isDark ? 'bg-zinc-950/40 border-zinc-900/30 text-zinc-500' : 'bg-neutral-100/50 border-neutral-200 text-slate-500'))
                  },
                    // Left accent bar
                    React.createElement('span', {
                      className: 'absolute left-0 top-0 bottom-0 w-2.5 rounded-l-xl',
                      style: { backgroundColor: accentColor, boxShadow: 'inset -2px 0 4px rgba(0,0,0,0.15)' }
                    }),
                    // Section number + layout badge
                    React.createElement('div', { className: 'flex justify-between items-center text-[8px] font-mono tracking-wider mb-0.5' },
                      React.createElement('span', { className: 'font-extrabold text-blue-600 dark:text-blue-400' }, 'SECTION ' + String(sIdx + 1).padStart(2, '0')),
                      React.createElement('span', { className: 'font-bold ' + badge.color }, badge.label)
                    ),
                    // Title
                    React.createElement('h4', { className: 'text-[10px] font-bold uppercase tracking-tight font-sans truncate mb-1' }, sect.title),
                    // Status row
                    React.createElement('div', { className: 'flex justify-between items-center text-[8px] font-mono pt-1 border-t border-dashed ' + (isDark ? 'border-zinc-800/80 opacity-70' : 'border-slate-200 opacity-80') },
                      React.createElement('span', { className: 'capitalize ' + theme.secondary }, sect.layoutType.replace(/_/g, ' ')),
                      isActive
                        ? React.createElement('span', { className: 'text-blue-600 bg-blue-500/10 px-1.5 py-0.5 rounded border border-blue-500/10 uppercase font-bold' }, 'Active')
                        : isUnlocked
                          ? React.createElement('span', { className: 'text-emerald-600 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/10 uppercase font-bold' }, 'Read')
                          : React.createElement('span', { className: 'text-slate-500 bg-slate-500/10 px-1.5 py-0.5 rounded uppercase font-bold' }, 'Locked')
                    )
                  );
                })
              )
            ),

            // Article: progress + title + content panel
            React.createElement('article', { className: 'xl:col-span-9 flex flex-col gap-4 min-h-0 overflow-hidden' },

              // Progress bar
              React.createElement('div', { className: 'space-y-1 flex-shrink-0' },
                React.createElement('div', { className: 'w-full h-1.5 rounded-full overflow-hidden ' + (isDark ? 'bg-slate-800' : 'bg-slate-200') },
                  React.createElement('div', { className: 'h-full transition-all duration-300 ' + theme.progress, style: { width: widthPercentage + "%" } })
                ),
                React.createElement('div', { className: 'flex justify-between items-center text-[10px] font-mono font-bold ' + theme.secondary },
                  React.createElement('span', null, "SECTION " + (currentSectionIndex + 1) + " OF " + totalSlides),
                  React.createElement('span', null, widthPercentage + "% COMPLETE")
                )
              ),

              // Section title row — flashcard/quiz buttons on the right
              React.createElement('div', { className: 'flex items-center justify-between gap-4 flex-shrink-0' },
                React.createElement('h2', { className: 'heading-font text-xl md:text-2xl font-extrabold tracking-tight ' + theme.accent }, currentSection.title),
                React.createElement('div', { className: 'flex items-center gap-2 flex-shrink-0' },
                  hasFlashcards && React.createElement('button', {
                    onClick: () => { playChime('success'); setSectionView('flashcards'); },
                    className: 'px-3.5 py-1.5 rounded-xl text-xs font-bold font-mono transition-all border ' + (
                      sectionView === 'flashcards'
                        ? 'bg-emerald-400 text-slate-950 border-emerald-400 shadow-md shadow-emerald-500/30'
                        : 'bg-emerald-700 hover:bg-emerald-600 text-white border-emerald-700 hover:border-emerald-600'
                    )
                  }, 'Flashcards'),
                  hasQuiz && React.createElement('button', {
                    onClick: () => { playChime('success'); setSectionView('quiz'); },
                    className: 'px-3.5 py-1.5 rounded-xl text-xs font-bold font-mono transition-all border ' + (
                      sectionView === 'quiz'
                        ? 'bg-blue-400 text-slate-950 border-blue-400 shadow-md shadow-blue-500/30'
                        : 'bg-blue-700 hover:bg-blue-600 text-white border-blue-700 hover:border-blue-600'
                    )
                  }, 'Quiz')
                )
              ),

              // Narration audio bar — shown when section has narration
              currentSection.narration && (currentSection.narration.audioDataUrl || currentSection.narration.audioExternalUrl) &&
                React.createElement('div', {
                  className: 'flex items-center gap-3 px-4 py-2.5 rounded-xl border flex-shrink-0 ' +
                    (isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-slate-50 border-slate-200')
                },
                  React.createElement('span', { className: 'text-base flex-shrink-0' }, '🔊'),
                  React.createElement('span', { className: 'text-[10px] font-mono font-bold flex-shrink-0 ' + theme.secondary },
                    currentSection.narration.label || 'Section Narration'
                  ),
                  React.createElement('audio', {
                    key: currentSection.id,
                    controls: true,
                    autoPlay: currentSection.narration.autoPlay || false,
                    src: currentSection.narration.audioDataUrl || currentSection.narration.audioExternalUrl,
                    className: 'flex-1 h-8',
                    style: { minWidth: 0 }
                  })
                ),

              // Quiz required prompt — shown briefly when student tries to skip without answering
              showQuizPrompt && React.createElement('div', {
                className: 'flex items-center gap-3 px-4 py-3 rounded-xl border text-xs font-mono font-bold flex-shrink-0 bg-amber-500/15 border-amber-500/40 text-amber-600 dark:text-amber-400'
              },
                React.createElement('span', { className: 'text-lg flex-shrink-0' }, '⚠'),
                React.createElement('span', null,
                  'Please complete the ',
                  React.createElement('button', {
                    onClick: () => { setSectionView('quiz'); setShowQuizPrompt(false); },
                    className: 'underline font-extrabold cursor-pointer'
                  }, 'Quiz'),
                  ' for this section before proceeding.'
                )
              ),

              // Scrollable content panel — prominent back button when in flashcards/quiz view
              React.createElement('div', { className: 'flex-1 min-h-0 overflow-y-auto rounded-2xl border ' + theme.card + ' p-5 md:p-7' },
                sectionView !== 'content' && React.createElement('div', { className: 'mb-5' },
                  React.createElement('button', {
                    onClick: () => { playChime('success'); setSectionView('content'); },
                    className: 'w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-bold font-mono transition-all shadow-md ' + theme.btn
                  }, '← Back to Content')
                ),
                sectionView === 'content' && renderSectionLayoutContent(),
                sectionView === 'flashcards' && renderFlashcardsPanel(),
                sectionView === 'quiz' && renderQuizPanel()
              )
            )
          ),

          // BOTTOM NAV BAR — Back (prev section) on left, Next on right
          React.createElement('footer', { className: 'border-t px-4 py-3 no-print flex items-center justify-between gap-2 flex-shrink-0 ' + theme.footer },

            React.createElement('button', {
              onClick: prevSlide,
              disabled: currentSectionIndex === 0,
              className: 'px-4 py-2 rounded-xl text-xs font-mono font-bold border transition-all ' + (
                currentSectionIndex === 0
                  ? 'opacity-30 cursor-not-allowed ' + (isDark ? 'border-slate-800 text-slate-600' : 'border-slate-200 text-slate-500')
                  : (isDark ? 'border-slate-700 hover:bg-slate-800 text-slate-300' : 'border-slate-200 hover:bg-slate-100 text-slate-700')
              )
            }, '◀ Back'),

            React.createElement('button', {
              onClick: nextSlide,
              className: 'px-5 py-2 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-1.5 ' + theme.btn
            },
              React.createElement('span', null, currentSectionIndex === totalSlides - 1 ? "Complete Training" : "Next Module"),
              React.createElement('span', null, "▶")
            )
          ),

          // FAILURE MODAL — score too low to complete
          showFailureModal && (() => {
            const incompleteSections = course.sections
              .map((sect, idx) => ({ sect, idx }))
              .filter(({ sect }) =>
                sect.questions?.length > 0 &&
                sect.includeQuestions !== false &&
                !sect.questions.every(q => quizPassed[q.id] === true)
              );
            return React.createElement('div', {
              className: 'fixed inset-0 bg-[#262626]/85 backdrop-blur-sm flex items-center justify-center z-[999] p-4'
            },
              React.createElement('div', {
                className: 'max-w-md w-full p-6 rounded-2xl border shadow-2xl space-y-5 ' +
                  (isDark ? 'bg-[#1A1A1A] border-zinc-700 text-zinc-100' : 'bg-white border-slate-300 text-slate-800')
              },
                React.createElement('div', { className: 'flex items-start gap-3' },
                  React.createElement('div', { className: 'w-10 h-10 rounded-full bg-rose-500/15 text-rose-500 flex items-center justify-center flex-shrink-0 text-xl font-bold' }, '✘'),
                  React.createElement('div', { className: 'space-y-1' },
                    React.createElement('h4', { className: 'text-sm font-bold uppercase tracking-tight ' + theme.accent }, 'Score Too Low to Complete'),
                    React.createElement('p', { className: 'text-xs font-mono leading-relaxed ' + theme.secondary },
                      'Your current score is ',
                      React.createElement('strong', { className: 'text-rose-500' }, scorePercentage + '%'),
                      '. A passing score of ',
                      React.createElement('strong', null, (settings.passingScorePercent || 80) + '%'),
                      ' is required. Please retry the quiz in the sections listed below.'
                    )
                  )
                ),
                incompleteSections.length > 0 && React.createElement('div', { className: 'space-y-2' },
                  React.createElement('p', { className: 'text-[10px] font-mono uppercase tracking-wider font-bold ' + theme.secondary }, 'Sections to review:'),
                  React.createElement('div', { className: 'space-y-1.5' },
                    incompleteSections.map(({ sect, idx }) =>
                      React.createElement('button', {
                        key: sect.id,
                        onClick: () => { setCurrentSectionIndex(idx); setSectionView('quiz'); setShowFailureModal(false); },
                        className: 'w-full text-left px-3.5 py-2.5 rounded-xl border text-xs font-mono font-bold transition-all flex items-center gap-2 cursor-pointer ' +
                          (isDark ? 'bg-zinc-800 border-zinc-700 hover:bg-zinc-700 text-zinc-200' : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-800')
                      },
                        React.createElement('span', { className: 'text-[10px] font-extrabold flex-shrink-0 ' + theme.accent }, 'SEC ' + String(idx + 1).padStart(2, '0')),
                        React.createElement('span', { className: 'truncate flex-1' }, sect.title),
                        React.createElement('span', { className: 'text-[10px] text-rose-500 flex-shrink-0 font-bold' }, '→ Retry')
                      )
                    )
                  )
                ),
                React.createElement('button', {
                  onClick: () => setShowFailureModal(false),
                  className: 'w-full py-2.5 rounded-xl border text-xs font-mono font-bold transition-all cursor-pointer ' +
                    (isDark ? 'border-zinc-700 text-zinc-400 hover:bg-zinc-800' : 'border-slate-200 text-slate-500 hover:bg-slate-50')
                }, 'Dismiss — Continue Reviewing')
              )
            );
          })()
        );
      }

      // If page is completed, show summary and high-contrast certificate download!
      if (step === 'completed') {
        const hasPassed = !settings.questionsRequired || scorePercentage >= (settings.passingScorePercent || 80);

        return React.createElement('div', { className: 'min-h-screen p-4 md:p-8 flex flex-col justify-between ' + theme.bg },
          
          React.createElement('div', { className: 'max-w-4xl w-full mx-auto space-y-10 py-6' },
            
            // CONGRATULATIONS — only shown after real completion
            courseActuallyCompleted && React.createElement('div', { className: 'text-center space-y-3 no-print' },
              React.createElement('span', { className: 'text-5xl block animate-bounce' }, "🎉"),
              React.createElement('h1', { className: 'heading-font text-3xl font-bold tracking-tight ' + theme.accent }, "Congratulations, " + (studentName || "Student") + "!"),
              React.createElement('p', { className: 'text-sm md:text-base max-w-lg mx-auto ' + (isDark ? 'text-slate-300' : 'text-slate-600') },
                "You have fully completed the training session! Your certificate and reference guide are below."
              )
            ),

            // STATS — only shown after real completion
            courseActuallyCompleted && React.createElement('div', { className: 'grid grid-cols-1 sm:grid-cols-' + (settings.questionsRequired ? '3' : '2') + ' gap-4 font-mono text-center no-print' },
              React.createElement('div', { className: 'p-5 rounded-2xl border ' + theme.card },
                React.createElement('span', { className: 'text-[10px] block uppercase font-bold ' + theme.secondary }, "Total XP Earned"),
                React.createElement('h4', { className: 'text-2xl font-bold mt-1 ' + theme.accent }, xp + " XP")
              ),
              settings.questionsRequired && React.createElement('div', { className: 'p-5 rounded-2xl border ' + theme.card },
                React.createElement('span', { className: 'text-[10px] block uppercase font-bold ' + theme.secondary }, "Assessment Score"),
                React.createElement('h4', { className: 'text-2xl font-bold mt-1 ' + (hasPassed ? 'text-emerald-500' : theme.accent) }, scorePercentage + "%")
              ),
              React.createElement('div', { className: 'p-5 rounded-2xl border ' + theme.card },
                React.createElement('span', { className: 'text-[10px] block uppercase font-bold ' + theme.secondary }, "Certification Status"),
                React.createElement('h4', { className: 'text-xs uppercase font-extrabold tracking-widest mt-2 py-0.5 px-3.5 rounded-full inline-block ' + (hasPassed ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-slate-500/10 text-slate-500 border border-slate-500/20') },
                  hasPassed ? "PASSED ✔" : "COMPLETE"
                )
              )
            ),

            // QUICK REFERENCE SUMMARY CARD — always shown
            React.createElement('div', { className: 'p-6 md:p-8 rounded-3xl border shadow-md space-y-6 no-print ' + theme.card },
              React.createElement('div', { className: 'flex justify-between items-center border-b pb-4 ' + (isDark ? 'border-slate-800' : 'border-slate-200') },
                React.createElement('div', null,
                  React.createElement('h2', { className: 'heading-font text-lg font-bold ' + theme.accent },
                    courseActuallyCompleted ? "Quick Study Reference Guide" : "Course Reference Guide"
                  ),
                  React.createElement('span', { className: 'text-[10px] font-mono block ' + theme.secondary },
                    courseActuallyCompleted ? "Study synthesis of the completed course" : "Complete the training to earn your certificate"
                  )
                ),
                React.createElement('button', {
                  onClick: handlePrintSummary,
                  className: "px-4 py-2 text-xs font-mono font-bold rounded-lg border transition-all " + theme.btn
                }, "Download PDF 📄")
              ),

              React.createElement('div', { className: 'space-y-6 max-h-[500px] overflow-y-auto pr-2' },
                course.sections.map((sect, sIdx) => {
                  const introText = sect.text_video?.text || sect.text_table?.text || sect.cards_grid?.text ||
                    sect.bento_highlights?.text || sect.milestone_timeline?.text || sect.code_quote_spotlight?.mainText ||
                    sect.multi_tab_dive?.text || sect.qa_accordion?.text;
                  const visualContent = renderSectionSummaryContent(sect);
                  return React.createElement('div', { key: sect.id, className: 'space-y-2 pb-4 border-b last:border-b-0 ' + (isDark ? 'border-slate-800' : 'border-slate-100') },
                    React.createElement('h4', { className: 'heading-font font-extrabold flex items-center gap-2 ' + theme.accent },
                      React.createElement('span', { className: 'text-[10px] font-mono opacity-60' }, String(sIdx + 1).padStart(2, '0')),
                      sect.title,
                      React.createElement('span', { className: 'text-[9px] font-mono uppercase px-1.5 py-0.5 rounded bg-slate-500/10 ' + (isDark ? 'text-slate-400' : 'text-slate-600') }, sect.layoutType.replace(/_/g, ' '))
                    ),
                    introText && React.createElement('p', { className: 'text-xs leading-relaxed font-mono ' + (isDark ? 'text-slate-300' : 'text-slate-700') }, introText),
                    visualContent
                  );
                })
              )
            ),

            // GOLDEN SEAL ELEGANT COMPLETION DIPLOMA — only shown after actually completing the course
            courseActuallyCompleted && React.createElement('div', { className: 'space-y-4 no-print font-sans' },
              React.createElement('div', { className: 'flex justify-between items-center' },
                React.createElement('span', { className: 'text-xs font-mono uppercase tracking-widest font-extrabold ' + (isDark ? 'text-slate-300' : 'text-slate-700') }, "Verify Certificate:"),
                React.createElement('button', {
                  onClick: handlePrintCertificate,
                  className: 'px-4 py-2 rounded-lg text-xs font-mono font-bold border bg-slate-900 border-slate-700 hover:bg-slate-900 text-slate-100 flex items-center gap-1.5'
                }, "Print / Save PDF 🖨")
              )
            ),

            // THE PHYSICAL PRINT DIRECT DIODE — only rendered after actual completion
            courseActuallyCompleted && React.createElement('div', {
              id: 'print-certificate-container',
              className: 'w-full aspect-[4/3] rounded-3xl p-8 border border-double relative shadow-2xl flex flex-col justify-between items-center text-center overflow-hidden bg-white text-stone-900 border-stone-300'
            },
              // Border styling graphics
              React.createElement('div', { className: 'absolute inset-4 border border-stone-200 pointer-events-none' }),
              React.createElement('div', { className: 'absolute inset-6 border border-stone-150 pointer-events-none' }),
              
              // Top title
              React.createElement('header', { className: 'space-y-1.5' },
                React.createElement('span', { className: 'text-[11px] font-mono tracking-widest font-bold uppercase text-stone-600 block' }, "Lumina Studio — Verified Course Enrollment"),
                React.createElement('h2', { className: 'serif-font text-3xl font-bold italic text-amber-700' }, "Certificate of Completion")
              ),

              // Student enrollment content
              React.createElement('div', { className: 'space-y-4 max-w-lg' },
                React.createElement('span', { className: 'text-xs font-mono text-stone-600 block font-semibold' }, "This verified diploma certifies that"),
                React.createElement('h3', { className: 'serif-font text-3xl font-extrabold border-b border-stone-300 pb-2 text-stone-800 font-medium tracking-tight' }, studentName || "Guest Reviewer"),
                React.createElement('p', { className: 'text-sm leading-relaxed font-mono px-4 text-stone-600' },
                  "has successfully studied and demonstrated domain comprehension of the full advanced training series titled"
                ),
                React.createElement('strong', { className: 'heading-font text-base md:text-lg text-amber-800 font-extrabold select-all italic tracking-tight' }, metadata.title),
                React.createElement('div', { className: 'text-[10px] font-mono text-stone-600' },
                  "Authorized Course Version " + metadata.version +
                  (settings.questionsRequired ? " • Passing score achieved: " + scorePercentage + "%" : "")
                )
              ),

              // Footer Signatures & Gold Stamp Seal vector
              React.createElement('footer', { className: 'w-full flex items-end justify-between px-10' },
                React.createElement('div', { className: 'text-left font-mono text-[10px] text-stone-600 space-y-1' },
                  React.createElement('span', { className: 'block font-bold' }, "Published by:"),
                  React.createElement('span', { className: 'border-t border-stone-300 pt-0.5 block font-bold text-stone-700' }, metadata.owner)
                ),

                // Gold Seal
                React.createElement('div', { className: 'relative w-16 h-16 rounded-full bg-gradient-to-br from-amber-300 via-yellow-400 to-amber-500 shadow-md flex items-center justify-center border-4 border-dashed border-yellow-250 border-double animate-pulse' },
                  React.createElement('div', { className: 'w-10 h-10 rounded-full border border-yellow-100 flex items-center justify-center font-bold text-xs text-yellow-950 font-serif' }, "SEAL")
                ),

                React.createElement('div', { className: 'text-right font-mono text-[10px] text-stone-600 space-y-1' },
                  React.createElement('span', { className: 'block font-bold' }, "Date Certified:"),
                  React.createElement('span', { className: 'border-t border-stone-300 pt-0.5 block font-bold text-stone-700 font-bold' }, metadata.publicationDate)
                )
              )
            )

          ),

          // HIDDEN SUMMARY PRINT CONTAINER — only visible during print-summary mode
          React.createElement('div', { id: 'print-summary-container' },
            React.createElement('h1', { style: { fontFamily: 'sans-serif', fontSize: '20px', fontWeight: 'bold', marginBottom: '4px', color: '#b45309' } }, metadata.title),
            React.createElement('p', { style: { fontFamily: 'monospace', fontSize: '11px', color: '#57534e', marginBottom: '24px' } },
              'Quick Reference Guide  •  ' + metadata.owner + '  •  v' + metadata.version
            ),
            course.sections.map((sect, sIdx) => {
              const introText = sect.text_video?.text || sect.text_table?.text || sect.cards_grid?.text ||
                sect.bento_highlights?.text || sect.milestone_timeline?.text || sect.code_quote_spotlight?.mainText ||
                sect.multi_tab_dive?.text || sect.qa_accordion?.text;
              return React.createElement('div', { key: sect.id, style: { marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid #e7e5e4' } },
                React.createElement('h2', { style: { fontFamily: 'sans-serif', fontSize: '13px', fontWeight: 'bold', color: '#b45309', marginBottom: '6px' } },
                  (sIdx + 1) + '. ' + sect.title
                ),
                introText && React.createElement('p', { style: { fontFamily: 'monospace', fontSize: '11px', color: '#44403c', marginBottom: '8px', lineHeight: '1.6' } }, introText),
                // Inline text rendering of visual content for print
                sect.text_table?.rows?.length && React.createElement('div', { style: { fontSize: '11px', fontFamily: 'monospace' } },
                  sect.text_table.rows.map((r, i) => React.createElement('div', { key: i, style: { borderTop: '1px solid #e7e5e4', padding: '3px 0', color: '#292524' } },
                    React.createElement('strong', null, r.col1 + ': '), r.col2, r.col3 ? ' → ' + r.col3 : ''
                  ))
                ),
                sect.cards_grid?.cards?.length && React.createElement('div', { style: { fontSize: '11px', fontFamily: 'monospace' } },
                  sect.cards_grid.cards.map((c) => React.createElement('div', { key: c.id, style: { marginBottom: '4px', paddingLeft: '8px', borderLeft: '3px solid #f59e0b' } },
                    React.createElement('strong', { style: { color: '#b45309' } }, c.title + ': '), React.createElement('span', { style: { color: '#44403c' } }, c.backContent)
                  ))
                ),
                sect.bento_highlights?.boxes?.length && React.createElement('div', { style: { fontSize: '11px', fontFamily: 'monospace' } },
                  sect.bento_highlights.boxes.map((b) => React.createElement('div', { key: b.id, style: { marginBottom: '4px' } },
                    React.createElement('strong', { style: { color: '#b45309' } }, b.title), b.value ? ' (' + b.value + ')' : '', ': ',
                    React.createElement('span', { style: { color: '#44403c' } }, b.description)
                  ))
                ),
                sect.milestone_timeline?.steps?.length && React.createElement('div', { style: { fontSize: '11px', fontFamily: 'monospace' } },
                  sect.milestone_timeline.steps.map((st) => React.createElement('div', { key: st.id, style: { marginBottom: '4px', paddingLeft: '8px', borderLeft: '3px solid #f59e0b' } },
                    React.createElement('strong', { style: { color: '#b45309' } }, st.stepNumber + '. ' + st.title + ': '),
                    React.createElement('span', { style: { color: '#44403c' } }, st.description)
                  ))
                ),
                sect.code_quote_spotlight?.spotlightText && React.createElement('pre', { style: { fontSize: '10px', fontFamily: 'monospace', background: '#f5f5f4', padding: '8px', borderRadius: '4px', whiteSpace: 'pre-wrap', color: '#1c1917' } },
                  sect.code_quote_spotlight.spotlightText
                ),
                sect.multi_tab_dive?.tabs?.length && React.createElement('div', { style: { fontSize: '11px', fontFamily: 'monospace' } },
                  sect.multi_tab_dive.tabs.map((t) => React.createElement('div', { key: t.id, style: { marginBottom: '6px' } },
                    React.createElement('strong', { style: { color: '#b45309' } }, '[' + t.label + '] ' + t.title + ': '),
                    React.createElement('span', { style: { color: '#44403c' } }, t.content)
                  ))
                ),
                sect.qa_accordion?.items?.length && React.createElement('div', { style: { fontSize: '11px', fontFamily: 'monospace' } },
                  sect.qa_accordion.items.map((item) => React.createElement('div', { key: item.id, style: { marginBottom: '6px' } },
                    React.createElement('div', { style: { fontWeight: 'bold', color: '#292524' } }, 'Q: ' + item.trigger),
                    React.createElement('div', { style: { paddingLeft: '12px', color: '#57534e' } }, 'A: ' + item.content)
                  ))
                )
              );
            })
          ),

          React.createElement('footer', { className: 'border-t py-4 text-center text-xs font-mono no-print ' + (isDark ? 'border-slate-800 text-slate-400' : 'border-slate-200 text-slate-600') },
            React.createElement('button', {
              onClick: () => {
                SCORM.terminate();
                setStep('intro');
                setCourseActuallyCompleted(false);
              },
              className: 'px-6 py-2.5 rounded-xl border transition-all font-bold font-mono text-xs ' + theme.btn
            }, courseActuallyCompleted ? "⟳ Restart Course" : "▶ Start Training")
          )
        );
      }
    }

    // Mount application
    ReactDOM.createRoot(document.getElementById('player-root')).render(React.createElement(PlayerApp));
  </script>
</body>
</html>`;
}

/**
 * Encapsulates the self-contained HTML player along with matching
 * SCORM XML schemas (both 1.2 and 2004 versions) into a structured ZIP file context.
 * Communicates with LMS APIs automatically on launch.
 */
export async function generateScormZip(course: GameCourse, version: '1.2' | '2004'): Promise<Blob> {
  const zip = new JSZip();
  const playerHtml = generateSelfContainedHtml(course);

  // Write single page index to zip
  zip.file('index.html', playerHtml);

  // SCORM Metadata Configurations matching standard LMS guidelines
  const titleFiltered = course.metadata.title.replace(/[&<>'"]/g, "");
  const descFiltered = course.metadata.description.replace(/[&<>'"]/g, "");

  if (version === '1.2') {
    // SCORM 1.2 Manifest Specification
    const imsmanifest12 = `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<manifest identifier="course-${Date.now()}" version="1.1"
          xmlns="http://www.cnr.it/ia/imsmanifest_v1p1"
          xmlns:adlcp="http://www.adlnet.org/xsd/adlcp_v1p2"
          xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
          xsi:schemaLocation="http://www.cnr.it/ia/imsmanifest_v1p1 imsmanifest_v1p1.xsd
                              http://www.adlnet.org/xsd/adlcp_v1p2 adlcp_v1p2.xsd">
  <metadata>
    <schema>ADL SCORM</schema>
    <schemaversion>1.2</schemaversion>
  </metadata>
  <organizations default="org_1">
    <organization identifier="org_1">
      <title>${titleFiltered}</title>
      <item identifier="item_1" identifierref="resource_1">
        <title>${titleFiltered}</title>
      </item>
    </organization>
  </organizations>
  <resources>
    <resource identifier="resource_1" type="webcontent" adlcp:scormtype="sco" href="index.html">
      <file href="index.html"/>
    </resource>
  </resources>
</manifest>`;

    zip.file('imsmanifest.xml', imsmanifest12);

  } else {
    // SCORM 2004 4th Edition Standard Manifest Specification
    const imsmanifest2004 = `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<manifest identifier="course-${Date.now()}" version="1.0"
          xmlns="http://www.imsglobal.org/xsd/imscp_v1p1"
          xmlns:adlcp="http://www.adlnet.org/xsd/adlcp_v1p3"
          xmlns:adlseq="http://www.adlnet.org/xsd/adlseq_v1p3"
          xmlns:adlnav="http://www.adlnet.org/xsd/adlnav_v1p3"
          xmlns:imsss="http://www.imsglobal.org/xsd/imsss"
          xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
          xsi:schemaLocation="http://www.imsglobal.org/xsd/imscp_v1p1 imscp_v1p1.xsd
                              http://www.adlnet.org/xsd/adlcp_v1p3 adlcp_v1p3.xsd
                              http://www.adlnet.org/xsd/adlseq_v1p3 adlseq_v1p3.xsd
                              http://www.adlnet.org/xsd/adlnav_v1p3 adlnav_v1p3.xsd
                              http://www.imsglobal.org/xsd/imsss imsss_v1p3.xsd">
  <metadata>
    <schema>ADL SCORM</schema>
    <schemaversion>2004 4th Edition</schemaversion>
  </metadata>
  <organizations default="org_1">
    <organization identifier="org_1">
      <title>${titleFiltered}</title>
      <item identifier="item_1" identifierref="resource_1" isvisible="true">
        <title>${titleFiltered}</title>
        <imsss:sequencing>
          <imsss:deliveryControls tracked="true" completionSetByContent="true" objectiveSetByContent="true"/>
        </imsss:sequencing>
      </item>
    </organization>
  </organizations>
  <resources>
    <resource identifier="resource_1" type="webcontent" adlcp:scormtype="sco" href="index.html">
      <file href="index.html"/>
    </resource>
  </resources>
</manifest>`;

    zip.file('imsmanifest.xml', imsmanifest2004);
  }

  return await zip.generateAsync({ type: 'blob' });
}

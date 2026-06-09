/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { GameCourse, Section, ScreenLayoutType } from './types';
import { SAMPLE_GAME_COURSE } from './sampleCourse';
import { generateSelfContainedHtml, generateScormZip } from './utils/exportBundle';
import SectionEditor from './components/SectionEditor';
import SimulatorPlayer from './components/SimulatorPlayer';

// Icons
import {
  Sparkles,
  BookOpen,
  Settings,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Download,
  Upload,
  Play,
  FileCode,
  Package,
  RotateCcw,
  RefreshCw,
  Sliders,
  Award,
  ListOrdered,
  ChevronRight,
  Info,
  GripVertical,
  Copy,
  Video,
  Table,
  Grid,
  LayoutGrid,
  GitCommit,
  Code,
  FolderLock,
  HelpCircle
} from 'lucide-react';

export default function App() {
  // Primary builder states
  const [course, setCourse] = useState<GameCourse>(SAMPLE_GAME_COURSE);

  // Trigger sound effect for builder actions
  const playBeep = (isSuccess: boolean = true) => {
    if (!course?.settings?.soundEffectsEnabled) return;
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
    } catch {
      // Ignored if browser limits audio
    }
  };
  const [activeSectionId, setActiveSectionId] = useState<string>(SAMPLE_GAME_COURSE.sections[0]?.id || '');
  const [isSimulatorActive, setIsSimulatorActive] = useState<boolean>(false);
  const [isDark, setIsDark] = useState<boolean>(false); // Starts as light mode (cream) to showcase beautiful theme immediately
  const [activeTab, setActiveTab] = useState<'details' | 'content' | 'settings' | 'publish'>('content');

  // Sync isDark state to document.documentElement for Tailwind dark mode variant compliance
  React.useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);
  
  // Drag and drop state for reordering sections
  const [draggedIdx, setDraggedIdx] = useState<number | null>(null);
  const [dragOverIdx, setDragOverIdx] = useState<number | null>(null);
  
  // Custom dialog overrides for iframe compliance
  const [sectionIdToDelete, setSectionIdToDelete] = useState<string | null>(null);
  const [showDefaultRestoreModal, setShowDefaultRestoreModal] = useState<boolean>(false);

  // File upload state / reference
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importStatus, setImportStatus] = useState<string>('');

  // Layout picker modal state
  const [showLayoutPickerModal, setShowLayoutPickerModal] = useState(false);
  const [layoutPickerInsertAfterId, setLayoutPickerInsertAfterId] = useState<string | undefined>(undefined);

  // Course update shortcuts
  const updateMetadata = (key: keyof GameCourse['metadata'], value: string) => {
    setCourse(prev => ({
      ...prev,
      metadata: {
        ...prev.metadata,
        [key]: value
      }
    }));
  };

  const updateSettings = (key: keyof GameCourse['settings'], value: any) => {
    setCourse(prev => ({
      ...prev,
      settings: {
        ...prev.settings,
        [key]: value
      }
    }));
  };

  // Section List Mutators
  const handleAddSection = (layoutType: ScreenLayoutType = 'text_video', insertAfterId?: string) => {
    const newId = `sec_${Date.now()}`;
    const newSection: Section = {
      id: newId,
      title: `Unit section ${course.sections.length + 1}`,
      order: course.sections.length + 1,
      layoutType: layoutType,
      questions: [],
      flashcards: []
    };

    // Auto seed default data based on layout type selected
    if (layoutType === 'text_video') {
      newSection.text_video = {
        text: "This is a video presentation module section. Enter unit explanation draft narrative here...",
        videoUrl: "https://www.youtube.com/embed/zjkBMFhNj_g",
        caption: "Enter interactive video description briefing caption..."
      };
    } else if (layoutType === 'text_table') {
      newSection.text_table = {
        text: "Compare structural variables in the comparison grid below.",
        headers: ["Variable", "Standard Output", "Alternative Output"],
        rows: [
          { col1: "Item 01", col2: "Output Standard parameter", col3: "Optional override", badgeType: "success" }
        ]
      };
    } else if (layoutType === 'cards_grid') {
      newSection.cards_grid = {
        text: "Interactive grid flipcards. Click over individual blocks to investigate notes.",
        cards: [
          { id: `c_${Date.now()}_1`, title: "Alpha Parameter", backContent: "Explanatory notes corresponding to active card detail.", badge: "Crucial" }
        ]
      };
    } else if (layoutType === 'bento_highlights') {
      newSection.bento_highlights = {
        text: "Responsive grid layout highlights detailing specialized core insights metrics.",
        boxes: [
          { id: `b_${Date.now()}_1`, title: "Core index", value: "95%", description: "Standard evaluation rate.", size: "medium", colorPreset: "blue" }
        ]
      };
    } else if (layoutType === 'milestone_timeline') {
      newSection.milestone_timeline = {
        text: "Chronological vertical process timeline roadmap detailing phase requirements.",
        steps: [
          { id: `st_${Date.now()}_1`, stepNumber: "01", title: "Milestone blueprint", description: "Design phase criteria blueprint details.", badgeText: "Phase A" }
        ]
      };
    } else if (layoutType === 'code_quote_spotlight') {
      newSection.code_quote_spotlight = {
        mainText: "Highlight critical programming blocks or inspirational spotlight quotes cleanly.",
        spotlightText: "console.log('Build, Pack, Deploy!');",
        captionTitle: "Active Console Log",
        languageOrAuthor: "javascript",
        isCode: true
      };
    } else if (layoutType === 'multi_tab_dive') {
      newSection.multi_tab_dive = {
        text: "Use nested lateral tab categories to structure complex deep-dive briefings.",
        tabs: [
          { id: `tb_${Date.now()}_1`, label: "Briefing", title: "Technical Overview", content: "Comprehensive details rendered on selective toggle click." }
        ]
      };
    } else if (layoutType === 'qa_accordion') {
      newSection.qa_accordion = {
        text: "Expandable modules resolving general queries and frequently asked questions.",
        items: [
          { id: `it_${Date.now()}_1`, trigger: "Query heading parameter?", content: "Complete instruction breakdown response." }
        ]
      };
    }

    setCourse(prev => {
      const reordered = [...prev.sections];
      if (insertAfterId) {
        const foundIdx = reordered.findIndex(s => s.id === insertAfterId);
        if (foundIdx !== -1) {
          reordered.splice(foundIdx + 1, 0, newSection);
        } else {
          reordered.push(newSection);
        }
      } else {
        reordered.push(newSection);
      }
      
      const updated = reordered.map((sec, currIdx) => ({
        ...sec,
        order: currIdx + 1,
        // Carry name with actual section index calculated
        title: (sec.title.startsWith("Unit slide ") || sec.title.startsWith("Unit section ")) ? `Unit section ${currIdx + 1}` : sec.title
      }));
      
      return {
        ...prev,
        sections: updated
      };
    });
    
    setActiveSectionId(newId);
  };

  const handleUpdateSection = (updatedSection: Section) => {
    setCourse(prev => ({
      ...prev,
      sections: prev.sections.map(s => s.id === updatedSection.id ? updatedSection : s)
    }));
  };

  const handleDeleteSection = (sectionId: string) => {
    if (course.sections.length <= 1) {
      alert("Your training course must contain at least one section unit.");
      return;
    }
    const filtered = course.sections.filter(s => s.id !== sectionId);
    setCourse(prev => ({ ...prev, sections: filtered }));
    if (activeSectionId === sectionId) {
      setActiveSectionId(filtered[0]?.id || '');
    }
  };

  // Move slide index inside sections stack
  const handleMoveSection = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === course.sections.length - 1) return;

    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    const reordered = [...course.sections];
    
    // Swap positions
    const temp = reordered[index];
    reordered[index] = reordered[targetIdx];
    reordered[targetIdx] = temp;

    // Recalculate incremental order priorities
    const marked = reordered.map((sec, curr) => ({ ...sec, order: curr + 1 }));
    
    setCourse(prev => ({ ...prev, sections: marked }));
  };

  // Reorder sections via drag and drop
  const handleReorderSections = (fromIdx: number, toIdx: number) => {
    if (fromIdx === toIdx) return;
    if (fromIdx < 0 || fromIdx >= course.sections.length) return;
    if (toIdx < 0 || toIdx >= course.sections.length) return;

    const reordered = [...course.sections];
    const [draggedItem] = reordered.splice(fromIdx, 1);
    reordered.splice(toIdx, 0, draggedItem);

    // Recalculate incremental order priorities
    const marked = reordered.map((sec, curr) => ({
      ...sec,
      order: curr + 1,
      title: (sec.title.startsWith("Unit slide ") || sec.title.startsWith("Unit section ")) ? `Unit section ${curr + 1}` : sec.title
    }));

    setCourse(prev => ({ ...prev, sections: marked }));
  };

  // Draft Export & Import functions
  const handleExportDraftJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(course, null, 2));
    const dlAnchorElem = document.createElement('a');
    dlAnchorElem.setAttribute("href", dataStr);
    const fileName = `${course.metadata.title.toLowerCase().replace(/\s+/g, '_')}_draft.json`;
    dlAnchorElem.setAttribute("download", fileName);
    dlAnchorElem.click();
  };

  const handleImportDraftJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed && parsed.metadata && parsed.sections && parsed.settings) {
          setCourse(parsed);
          if (parsed.sections.length > 0) {
            setActiveSectionId(parsed.sections[0].id);
          }
          setImportStatus("Draft imported successfully! ✔");
          setTimeout(() => setImportStatus(''), 4000);
        } else {
          alert("Invalid file structure. Make sure you import a draft JSON previously exported from this application.");
        }
      } catch (err) {
        alert("Fail reading draft JSON file. Syntax error inside contents.");
      }
    };
    reader.readAsText(file);
  };

  // Standalone and ZIP bundle packaging handlers
  const handleExportSelfContainedHtmlFile = () => {
    const htmlOutput = generateSelfContainedHtml(course);
    const blob = new Blob([htmlOutput], { type: 'text/html;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    const fileName = `${course.metadata.title.toLowerCase().replace(/\s+/g, '_')}_release.html`;
    link.download = fileName;
    link.click();
  };

  const handleExportScormZipFile = async (scormVersion: '1.2' | '2004') => {
    try {
      const zipBlob = await generateScormZip(course, scormVersion);
      const link = document.createElement('a');
      link.href = URL.createObjectURL(zipBlob);
      const fileName = `${course.metadata.title.toLowerCase().replace(/\s+/g, '_')}_scorm_${scormVersion}.zip`;
      link.download = fileName;
      link.click();
    } catch(err) {
      alert("ZIP compilation failed: " + err);
    }
  };

  // Restore the full AI Briefing course archetype
  const handleRestoreTemplate = () => {
    setCourse(SAMPLE_GAME_COURSE);
    setActiveSectionId(SAMPLE_GAME_COURSE.sections[0]?.id || '');
    setShowDefaultRestoreModal(false);
  };

  // Open layout picker modal
  const openAddSectionModal = (insertAfterId?: string) => {
    setLayoutPickerInsertAfterId(insertAfterId);
    setShowLayoutPickerModal(true);
  };

  // Duplicate a section with fully regenerated IDs for all nested items
  const handleDuplicateSection = (sectionId: string) => {
    const original = course.sections.find(s => s.id === sectionId);
    if (!original) return;
    const ts = Date.now();
    const cloned: Section = JSON.parse(JSON.stringify(original));
    cloned.id = `sec_${ts}`;
    cloned.title = original.title.replace(/ \(Copy\)+$/, '') + ' (Copy)';
    if (cloned.questions) cloned.questions = cloned.questions.map((q, i) => ({ ...q, id: `q_${ts}_${i}` }));
    if (cloned.flashcards) cloned.flashcards = cloned.flashcards.map((fc, i) => ({ ...fc, id: `fc_${ts}_${i}` }));
    if (cloned.cards_grid?.cards) cloned.cards_grid.cards = cloned.cards_grid.cards.map((c, i) => ({ ...c, id: `c_${ts}_${i}` }));
    if (cloned.bento_highlights?.boxes) cloned.bento_highlights.boxes = cloned.bento_highlights.boxes.map((b, i) => ({ ...b, id: `b_${ts}_${i}` }));
    if (cloned.milestone_timeline?.steps) cloned.milestone_timeline.steps = cloned.milestone_timeline.steps.map((st, i) => ({ ...st, id: `s_${ts}_${i}` }));
    if (cloned.multi_tab_dive?.tabs) cloned.multi_tab_dive.tabs = cloned.multi_tab_dive.tabs.map((t, i) => ({ ...t, id: `t_${ts}_${i}` }));
    if (cloned.qa_accordion?.items) cloned.qa_accordion.items = cloned.qa_accordion.items.map((item, i) => ({ ...item, id: `a_${ts}_${i}` }));
    setCourse(prev => {
      const idx = prev.sections.findIndex(s => s.id === sectionId);
      const updated = [...prev.sections];
      updated.splice(idx + 1, 0, cloned);
      return { ...prev, sections: updated.map((sec, i) => ({ ...sec, order: i + 1 })) };
    });
    setActiveSectionId(cloned.id);
    playBeep(true);
  };

  const activeSection = course.sections.find(s => s.id === activeSectionId);

  return (
    <div className={`min-h-screen ${isDark ? 'bg-[#0B0F17] text-zinc-100' : 'bg-[#F4F6F9] text-slate-800'} transition-colors duration-300 font-sans`}>
      
      {/* HEADER BAR */}
      <header className={`px-6 py-4 border-b flex justify-between items-center ${isDark ? 'bg-[#111827]/80 border-slate-800' : 'bg-white border-slate-200'} shadow-sm no-print transition-colors duration-200`}>
        <div className="flex items-center gap-3">
          {/* Modern gradient badge launcher */}
          <div className="w-10 h-10 bg-gradient-to-tr from-[#002F6C] to-[#2563eb] rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/10">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-sm md:text-lg font-bold tracking-tight uppercase leading-none">
              Tutelage Studio
            </h1>
            <p className="text-[10px] font-mono text-slate-700 dark:text-zinc-300 mt-1">Design interactive micro-courses.</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsDark(!isDark)}
            className={`px-3.5 py-1.5 border text-xs font-bold rounded-xl transition-all ${
              isDark 
                ? 'bg-zinc-900 border-zinc-800 text-zinc-200 hover:bg-zinc-800' 
                : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            {isDark ? "Light Mode" : "Dark Mode"}
          </button>
          
          <button
            onClick={() => {
              playBeep(true);
              setIsSimulatorActive(!isSimulatorActive);
            }}
            className={`px-4.5 py-1.5 text-xs font-extrabold uppercase tracking-tight rounded-xl transition-all ${
              isSimulatorActive
                ? 'bg-zinc-900 text-white border border-zinc-800 hover:bg-zinc-800'
                : 'bg-blue-600 text-white hover:bg-blue-500 shadow-md shadow-blue-500/10 hover:shadow-lg hover:-translate-y-0.5'
            }`}
          >
            {isSimulatorActive ? "Exit Simulation" : "Preview Simulator"}
          </button>
        </div>
      </header>

      {/* BUILDER TAB NAVIGATION */}
      {!isSimulatorActive && (
        <div className={`border-b ${isDark ? 'bg-zinc-900/40 border-zinc-800' : 'bg-white border-slate-200'} no-print`}>
          <nav className="max-w-7xl mx-auto px-6 py-2 flex gap-2 whitespace-nowrap overflow-x-auto scrollbar-none">
            <button
              onClick={() => { playBeep(true); setActiveTab('details'); }}
              className={`py-2 px-4 text-xs font-extrabold uppercase tracking-wider rounded-xl cursor-pointer flex items-center gap-2 transition-all ${
                activeTab === 'details'
                  ? 'bg-[#002F6C] text-white shadow-md shadow-[#002F6C]/10'
                  : 'text-slate-800 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800'
              }`}
              aria-label="Switch to Course Metadata Details settings"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Training Details</span>
            </button>
            <button
              onClick={() => { playBeep(true); setActiveTab('content'); }}
              className={`py-2 px-4 text-xs font-extrabold uppercase tracking-wider rounded-xl cursor-pointer flex items-center gap-2 transition-all ${
                activeTab === 'content'
                  ? 'bg-[#002F6C] text-white shadow-md shadow-[#002F6C]/10'
                  : 'text-slate-800 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800'
              }`}
              aria-label="Switch to Section Content section editor"
            >
              <ListOrdered className="w-3.5 h-3.5" />
              <span>Section Content</span>
            </button>
            <button
              onClick={() => { playBeep(true); setActiveTab('settings'); }}
              className={`py-2 px-4 text-xs font-extrabold uppercase tracking-wider rounded-xl cursor-pointer flex items-center gap-2 transition-all ${
                activeTab === 'settings'
                  ? 'bg-[#002F6C] text-white shadow-md shadow-[#002F6C]/10'
                  : 'text-slate-800 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800'
              }`}
              aria-label="Switch to Global Course settings"
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Settings</span>
            </button>
            <button
              onClick={() => { playBeep(true); setActiveTab('publish'); }}
              className={`py-2 px-4 text-xs font-extrabold uppercase tracking-wider rounded-xl cursor-pointer flex items-center gap-2 whitespace-nowrap transition-all ${
                activeTab === 'publish'
                  ? 'bg-[#002F6C] text-white shadow-md shadow-[#002F6C]/10'
                  : 'text-slate-800 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800'
              }`}
              aria-label="Switch to Preview and Release publisher tools"
            >
              <Award className="w-3.5 h-3.5" />
              <span>Preview & Publish ({course.sections.length})</span>
            </button>
          </nav>
        </div>
      )}

      {/* MAIN RENDER SANDBOX OR TAB WORKSPACES */}
      {isSimulatorActive ? (
        <div className="p-4 md:p-8 max-w-[1550px] w-full mx-auto no-print space-y-6">
          <div className="flex justify-between items-center border-b border-slate-200/80 dark:border-zinc-800/80 pb-3">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#2563eb] block">Tutelage Sandbox Player</span>
              <h2 className="text-lg md:text-xl font-bold tracking-tight">Active Simulation Player Workspace</h2>
            </div>
            <button
              onClick={() => {
                playBeep(true);
                setIsSimulatorActive(false);
              }}
              className="px-4.5 py-1.5 border border-rose-500/20 text-rose-500 hover:bg-rose-500 hover:text-white text-xs font-bold uppercase bg-rose-500/5 rounded-xl transition-all cursor-pointer"
            >
              Exit preview ✖
            </button>
          </div>
          <div className="rounded-2xl overflow-hidden shadow-2xl">
            <SimulatorPlayer course={course} onExit={() => setIsSimulatorActive(false)} />
          </div>
          <div className={`p-5 border rounded-2xl flex gap-3.5 items-start max-w-3xl ${
            isDark ? 'bg-zinc-900/40 border-zinc-800 text-zinc-300' : 'bg-white border-slate-200 text-slate-700'
          } shadow-md`}>
            <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-xs space-y-1">
              <p className="font-bold uppercase tracking-tight text-neutral-900 dark:text-white">Simulator Playtest Dashboard Instruction</p>
              <p className="opacity-80 font-mono text-[11px]">Use this workspace to run user interviews and play tests. Click flipcards, fill your student name, attempt assessment questions to trigger XP achievements, study the summary text, and verify printed completion certificate variables.</p>
            </div>
          </div>
        </div>
      ) : (
        <main className="max-w-7xl mx-auto p-4 md:p-6 no-print">
          
          {/* TAB 1: DETAILS */}
          {activeTab === 'details' && (
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">

              {/* Left: Course Metadata Form */}
              <div className="xl:col-span-2 space-y-6">
                <div className={`p-8 rounded-2xl border ${
                  isDark ? 'bg-zinc-900/50 border-zinc-800 text-zinc-100' : 'bg-white border-slate-200 text-slate-800'
                } shadow-xl space-y-6`}>
                  <div className="border-b border-slate-200/55 dark:border-zinc-800 pb-4 flex items-center gap-2 text-blue-600">
                    <BookOpen className="w-5 h-5 text-blue-600" />
                    <h3 className="font-bold text-xs uppercase tracking-wider">
                      Course Metadata Configuration
                    </h3>
                  </div>

                  <div className="space-y-4 text-xs font-mono text-slate-800 dark:text-zinc-100">
                    <div>
                      <label className="text-[10px] uppercase font-mono font-extrabold tracking-wider text-slate-900 dark:text-zinc-200 block mb-1.5">Training Course Title *</label>
                      <input
                        type="text"
                        value={course.metadata.title}
                        onChange={(e) => updateMetadata('title', e.target.value)}
                        className={`w-full p-3 border outline-none bg-transparent rounded-xl transition-all font-semibold ${
                          isDark ? 'border-zinc-800 focus:border-blue-500 bg-zinc-950 text-white' : 'border-slate-300 focus:border-blue-500 bg-slate-50 text-slate-900'
                        }`}
                        placeholder="e.g. Onboarding Essentials"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] uppercase font-mono font-extrabold tracking-wider text-slate-900 dark:text-zinc-200 block mb-1.5">Description Overview Narrative</label>
                      <textarea
                        value={course.metadata.description}
                        rows={4}
                        onChange={(e) => updateMetadata('description', e.target.value)}
                        className={`w-full p-3 border outline-none bg-transparent rounded-xl transition-all font-medium ${
                          isDark ? 'border-zinc-800 focus:border-blue-500 bg-zinc-950 text-white' : 'border-slate-300 focus:border-blue-500 bg-slate-50 text-slate-900'
                        }`}
                        placeholder="Provide overview details of what students learn..."
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] uppercase font-mono font-extrabold tracking-wider text-slate-900 dark:text-zinc-200 block mb-1.5">Publisher / Authorized Owner</label>
                        <input
                          type="text"
                          value={course.metadata.owner}
                          onChange={(e) => updateMetadata('owner', e.target.value)}
                          className={`w-full p-3 border outline-none bg-transparent rounded-xl transition-all ${
                            isDark ? 'border-zinc-800 focus:border-blue-500 bg-zinc-950 text-white' : 'border-slate-300 focus:border-blue-500 bg-slate-50 text-slate-900'
                          }`}
                          placeholder="e.g. Acme Corp"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] uppercase font-mono font-extrabold tracking-wider text-slate-900 dark:text-zinc-200 block mb-1.5">Course Release Version</label>
                        <input
                          type="text"
                          value={course.metadata.version}
                          onChange={(e) => updateMetadata('version', e.target.value)}
                          className={`w-full p-3 border outline-none bg-transparent rounded-xl transition-all ${
                            isDark ? 'border-zinc-800 focus:border-blue-500 bg-zinc-950 text-white' : 'border-slate-300 focus:border-blue-500 bg-slate-50 text-slate-900'
                          }`}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] uppercase font-mono font-extrabold tracking-wider text-slate-900 dark:text-zinc-200 block mb-1.5">Publication Date</label>
                        <input
                          type="date"
                          value={course.metadata.publicationDate}
                          onChange={(e) => updateMetadata('publicationDate', e.target.value)}
                          className={`w-full p-3 border outline-none bg-transparent rounded-xl transition-all ${
                            isDark ? 'border-zinc-800 focus:border-blue-500 bg-zinc-950 text-white' : 'border-slate-300 focus:border-blue-500 bg-slate-50 text-slate-900'
                          }`}
                        />
                      </div>
                      <div>
                        <label className="text-[10px] uppercase font-mono font-extrabold tracking-wider text-slate-900 dark:text-zinc-200 block mb-1.5">Approximate Completion Duration</label>
                        <input
                          type="text"
                          value={course.metadata.approxDuration}
                          onChange={(e) => updateMetadata('approxDuration', e.target.value)}
                          className={`w-full p-3 border outline-none bg-transparent rounded-xl transition-all ${
                            isDark ? 'border-zinc-800 focus:border-blue-500 bg-zinc-950 text-white' : 'border-slate-300 focus:border-blue-500 bg-slate-50 text-slate-900'
                          }`}
                          placeholder="e.g. 45 minutes"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right: How To Use Sidebar */}
              <aside className="xl:col-span-1">
                <div className={`p-6 rounded-2xl border sticky top-6 ${
                  isDark ? 'bg-zinc-900/50 border-zinc-800 text-zinc-100' : 'bg-white border-slate-200 text-slate-800'
                } shadow-xl space-y-5`}>
                  <div className="border-b border-slate-200/55 dark:border-zinc-800 pb-4 flex items-center gap-2 text-blue-600">
                    <Info className="w-5 h-5 text-blue-600" />
                    <h3 className="font-bold text-xs uppercase tracking-wider">How To Use</h3>
                  </div>

                  <div className="space-y-3 text-xs font-mono">
                    {([
                      { step: "1", title: "Fill Course Details", body: "Enter your course title, description, owner, and duration on this page. These appear on the student's intro screen and certificate.", badgeCls: "bg-blue-600 text-white", labelCls: "text-blue-700 dark:text-blue-400" },
                      { step: "2", title: "Build Sections", body: "Go to Section Content to add and edit sections. Each section has a layout (video, flip cards, table, timeline, etc.). Add as many sections as you need.", badgeCls: "bg-[#002F6C] text-white", labelCls: "text-[#002F6C] dark:text-blue-300" },
                      { step: "3", title: "Add Flashcards", body: "Inside each section, add flashcards for key concepts. Students click the Flashcards button to flip through them before taking the quiz.", badgeCls: "bg-emerald-700 text-white", labelCls: "text-emerald-700 dark:text-emerald-400" },
                      { step: "4", title: "Add Quiz Questions", body: "Add multiple-choice questions to each section. In Settings, choose whether quizzes are required before students can proceed.", badgeCls: "bg-violet-700 text-white", labelCls: "text-violet-700 dark:text-violet-400" },
                      { step: "5", title: "Configure Settings", body: "Set the color theme, passing score, and whether to ask for student names. Choose Light or Dark as the default mode.", badgeCls: "bg-amber-600 text-white", labelCls: "text-amber-700 dark:text-amber-400" },
                      { step: "6", title: "Preview & Publish", body: "Use Preview Simulator to test your course. When ready, export as a Standalone HTML file to share, or as a SCORM ZIP for an LMS.", badgeCls: "bg-rose-600 text-white", labelCls: "text-rose-700 dark:text-rose-400" },
                    ] as { step: string; title: string; body: string; badgeCls: string; labelCls: string }[]).map(({ step, title, body, badgeCls, labelCls }) => (
                      <div key={step} className={`flex gap-3 p-3 rounded-xl ${isDark ? 'bg-zinc-950/40' : 'bg-slate-50'}`}>
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-extrabold flex-shrink-0 mt-0.5 ${badgeCls}`}>
                          {step}
                        </div>
                        <div>
                          <strong className={`block text-[10px] uppercase tracking-wider font-extrabold mb-0.5 ${labelCls}`}>{title}</strong>
                          <p className={`text-[10px] leading-relaxed ${isDark ? 'text-zinc-300' : 'text-slate-700'}`}>{body}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className={`pt-3 border-t ${isDark ? 'border-zinc-800' : 'border-slate-200'}`}>
                    <p className={`text-[9px] font-mono leading-relaxed ${isDark ? 'text-zinc-300' : 'text-slate-700'}`}>
                      💡 Tip: Use <strong>Export JSON Draft</strong> in the Publish tab to save your work and reload it later.
                    </p>
                  </div>
                </div>
              </aside>

            </div>
          )}

          {/* TAB 2: CONTENT CO-PILOT WITH INTEGRATED SIDEBAR SECTION DECKS */}
          {activeTab === 'content' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Vertical Section Selection list Sidebar */}
              <aside className="lg:col-span-4 space-y-4">
                <div className={`p-5 rounded-2xl border ${
                  isDark ? 'bg-zinc-900/50 border-zinc-800 text-zinc-100' : 'bg-white border-slate-200 text-slate-800'
                } shadow-md space-y-3.5`}>
                  
                  <div className="flex justify-between items-center pb-2.5 border-b border-slate-200/60 dark:border-zinc-800 flex-wrap gap-1">
                    <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#002F6C] dark:text-[#4FC4D4] flex items-center gap-1">
                      <ListOrdered className="w-3.5 h-3.5" />
                      <span>Sections outline ({course.sections.length})</span>
                    </h4>
                    
                    {/* Fast add button on list header */}
                    <button
                      onClick={() => openAddSectionModal()}
                      className="px-3 py-1 text-[10px] font-extrabold uppercase bg-[#002F6C] hover:bg-[#002F6C]/90 text-white rounded-xl transition-all cursor-pointer shadow-sm shadow-[#002F6C]/15 flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Add Section</span>
                    </button>
                  </div>

                  <div className="space-y-2.5 max-h-[420px] overflow-y-auto pr-1">
                    <p className="text-[10px] font-mono text-slate-700 dark:text-zinc-300 mb-2 leading-relaxed flex items-center gap-1 font-semibold">
                      <span className="text-[#002F6C] dark:text-[#4FC4D4] font-extrabold font-sans">ℹ</span>
                      <span>Tip: Click and drag any section outline card to reorder.</span>
                    </p>
                    {course.sections.map((sec, idx) => {
                      const isActive = sec.id === activeSectionId;
                      const isDragged = draggedIdx === idx;
                      const isDragOver = dragOverIdx === idx && draggedIdx !== idx;
                      return (
                        <div
                          key={sec.id}
                          onClick={() => { playBeep(true); setActiveSectionId(sec.id); }}
                          role="button"
                          tabIndex={0}
                          draggable={true}
                          onDragStart={(e) => {
                            setDraggedIdx(idx);
                            e.dataTransfer.effectAllowed = 'move';
                          }}
                          onDragEnd={() => {
                            setDraggedIdx(null);
                            setDragOverIdx(null);
                          }}
                          onDragOver={(e) => {
                            e.preventDefault();
                            if (draggedIdx !== null && draggedIdx !== idx) {
                              e.dataTransfer.dropEffect = 'move';
                            }
                          }}
                          onDragEnter={(e) => {
                            e.preventDefault();
                            if (draggedIdx !== null) {
                              setDragOverIdx(idx);
                            }
                          }}
                          onDrop={(e) => {
                            e.preventDefault();
                            if (draggedIdx !== null && draggedIdx !== idx) {
                              handleReorderSections(draggedIdx, idx);
                            }
                            setDraggedIdx(null);
                            setDragOverIdx(null);
                          }}
                          aria-label={`Section ${idx + 1}: ${sec.title}`}
                          className={`p-3.5 border rounded-xl flex flex-col justify-between transition-all cursor-grab active:cursor-grabbing text-left select-none outline-none focus-visible:ring-2 focus-visible:ring-[#002F6C] relative overflow-hidden ${
                            'pl-6'
                          } ${
                            isActive
                              ? isDark
                                ? 'bg-[#002F6C]/15 border-[#4FC4D4] font-bold text-white shadow-md'
                                : 'bg-[#002F6C]/5 border-[#002F6C] font-bold text-[#002F6C] shadow-sm'
                              : isDark
                                ? 'bg-zinc-950/40 border-zinc-800 hover:bg-zinc-900/60 text-zinc-400'
                                : 'bg-slate-50/50 border-slate-200/60 hover:bg-white text-slate-700'
                          } ${
                            isDragged ? 'opacity-30 scale-95 border-dashed border-slate-400 dark:border-zinc-700' : ''
                          } ${
                            isDragOver ? 'border-[#4FC4D4] ring-2 ring-[#4FC4D4]/50 scale-[1.01] shadow-lg bg-[#4FC4D4]/5 dark:bg-[#4FC4D4]/10' : ''
                          }`}
                        >
                          {/* 8px wide left accent color bar */}
                          {true && (
                            <span 
                              className="absolute left-0 top-0 bottom-0 w-3 rounded-l-xl" 
                              style={{ 
                                backgroundColor: sec.accentColor || ['#EF4444', '#F97316', '#F59E0B', '#10B981', '#3B82F6', '#A855F7', '#F43F5E', '#14B8A6'][idx % 8],
                                boxShadow: `inset -2px 0 4px rgba(0,0,0,0.15)`
                              }}
                              aria-hidden="true"
                            />
                          )}
                          <div className="flex justify-between items-center text-[8.5px] font-mono text-slate-700 dark:text-zinc-300 font-extrabold">
                            <div className="flex items-center gap-1">
                              <GripVertical className="w-3 h-3 text-slate-700 dark:text-zinc-300 hover:text-[#4FC4D4] transition-colors" />
                              <strong>SECTION {String(idx + 1).padStart(2, '0')}</strong>
                            </div>
                            <span className="uppercase text-[8px] tracking-tighter bg-blue-600/10 text-blue-800 px-1.5 py-0.5 rounded border border-blue-600/10 font-bold">
                              {sec.layoutType.replace(/_/g, ' ')}
                            </span>
                          </div>

                          <span className="text-xs font-bold uppercase mt-1.5 truncate">
                            {sec.title}
                          </span>

                          <div className="flex justify-between items-center mt-3 pt-2 border-t border-dashed border-slate-200 dark:border-zinc-800/80 text-[9px] font-mono font-bold">
                            <div className="flex gap-1.5 opacity-90">
                              {sec.includeQuestions !== false && sec.questions?.length > 0 && (
                                <span className="px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[8px] font-bold uppercase tracking-wider" title="Contains assessments">Quiz</span>
                              )}
                              {sec.includeFlashcards !== false && sec.flashcards?.length > 0 && (
                                <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[8px] font-bold uppercase tracking-wider" title="Contains study flashcards">Cards</span>
                              )}
                            </div>
                            
                            <div className="flex gap-1 text-slate-700 dark:text-zinc-300 items-center">
                              <button
                                disabled={idx === 0}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  playBeep(true);
                                  handleMoveSection(idx, 'up');
                                }}
                                className="p-1 disabled:opacity-25 hover:text-blue-600 transition-colors flex items-center justify-center rounded"
                                title="Move section up"
                              >
                                <ArrowUp className="w-3.5 h-3.5" />
                              </button>
                              <button
                                disabled={idx === course.sections.length - 1}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  playBeep(true);
                                  handleMoveSection(idx, 'down');
                                }}
                                className="p-1 disabled:opacity-25 hover:text-blue-600 transition-colors flex items-center justify-center rounded"
                                title="Move section down"
                              >
                                <ArrowDown className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDuplicateSection(sec.id);
                                }}
                                className="p-1 hover:text-emerald-600 transition-colors cursor-pointer flex items-center justify-center rounded"
                                title="Duplicate section"
                              >
                                <Copy className="w-3.5 h-3.5" />
                              </button>
                              <button
                                disabled={course.sections.length <= 1}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  playBeep(true);
                                  setSectionIdToDelete(sec.id);
                                }}
                                className="p-1 text-rose-500 hover:text-rose-600 disabled:opacity-20 disabled:hover:text-rose-500 transition-colors cursor-pointer disabled:cursor-not-allowed flex items-center justify-center rounded"
                                title={course.sections.length <= 1 ? "Cannot delete the last remaining section" : "Delete section"}
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* ADD SECTION PROMINENT ACTION */}
                {activeSection && (
                  <div className={`p-4 rounded-2xl border ${
                    isDark ? 'bg-zinc-900/40 border-zinc-800 text-zinc-300' : 'bg-white border-slate-200 text-slate-700'
                  } shadow-sm space-y-2.5 text-xs font-mono`}>
                    <p className="text-[10px] uppercase font-bold tracking-tight text-slate-800 dark:text-zinc-200">Section Operations:</p>
                    <button
                      onClick={() => openAddSectionModal(activeSectionId)}
                      className="w-full text-center py-2.5 px-3 text-[10px] uppercase tracking-wider font-extrabold bg-[#002F6C] hover:bg-[#002F6C]/90 text-white rounded-xl transition-all shadow-md cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add a new section</span>
                    </button>
                    <span className="text-[8px] text-slate-700 dark:text-zinc-300 block leading-tight">Creates a corresponding module section appended to the bottom of the course outline.</span>
                  </div>
                )}
              </aside>

              {/* Center modular form rendering active attributes */}
              <article className="lg:col-span-8 space-y-6">
                {activeSection ? (
                  <div className={`p-6 md:p-8 rounded-2xl border ${
                    isDark ? 'bg-zinc-900/50 border-zinc-800 text-zinc-100' : 'bg-white border-slate-200 text-slate-800'
                  } shadow-xl space-y-5`}>
                    
                    <div className="border-b border-slate-200/60 dark:border-zinc-800 pb-4 flex justify-between items-center flex-wrap gap-2">
                      <div>
                        <span className="text-[9px] font-mono tracking-widest uppercase bg-blue-600/10 text-blue-600 px-2.5 py-1 rounded-md font-black">
                          Editing Section {course.sections.findIndex(s => s.id === activeSectionId) + 1}
                        </span>
                        
                        <div className="flex items-center gap-2 mt-2">
                          <span
                            className="w-3.5 h-3.5 rounded-full flex-shrink-0 border border-black/15 shadow-sm"
                            style={{ backgroundColor: activeSection.accentColor || '#002F6C' }}
                            title={`Section accent color: ${activeSection.accentColor || '#002F6C'}`}
                          />
                          <input
                            type="text"
                            value={activeSection.title}
                            onChange={(e) => {
                              const updated = { ...activeSection, title: e.target.value };
                              handleUpdateSection(updated);
                            }}
                            className={`text-lg md:text-xl font-bold uppercase tracking-tight bg-transparent border-b border-transparent focus:border-blue-600 outline-none font-mono ${
                              isDark ? 'text-white' : 'text-slate-900'
                            }`}
                          />
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5">
                      </div>
                    </div>

                    <SectionEditor
                      section={activeSection}
                      isDark={isDark}
                      onChange={handleUpdateSection}
                    />

                  </div>
                ) : (
                  <div className="p-12 text-center border rounded-2xl border-dashed border-slate-300 dark:border-zinc-800 font-mono text-xs text-neutral-700 dark:text-zinc-400">
                    Choose a training section on the left list outline to start detailing the active module properties.
                  </div>
                )}
              </article>
            </div>
          )}

          {/* TAB 3: SETTINGS CONTROL HUB */}
          {activeTab === 'settings' && (
            <div className="max-w-xl mx-auto space-y-6">
              <div className={`p-8 rounded-2xl border ${
                isDark ? 'bg-zinc-900/50 border-zinc-800 text-zinc-100' : 'bg-white border-slate-200 text-slate-800'
              } shadow-xl space-y-6`}>
                
                <div className="border-b border-slate-200/55 dark:border-zinc-800 pb-4 flex items-center gap-2">
                  <Settings className="w-5 h-5 text-[#002F6C] dark:text-blue-400" />
                  <h3 className={`font-bold text-xs uppercase tracking-wider ${isDark ? 'text-zinc-100' : 'text-slate-900'}`}>
                    Global Player Settings
                  </h3>
                </div>

                <div className="space-y-5 text-xs font-mono">
                  
                  {/* Theme pill select switcher */}
                  <div className={`flex justify-between items-center p-4 border rounded-2xl transition-all ${
                    isDark ? 'bg-zinc-950/40 border-zinc-800' : 'bg-slate-50 border-slate-200'
                  }`}>
                    <div className="text-xs pr-2">
                      <strong className={`block uppercase tracking-wider font-extrabold ${isDark ? 'text-zinc-100' : 'text-slate-900'}`}>Default Style Theme</strong>
                      <span className={`text-[10px] block mt-1 ${isDark ? 'text-zinc-300' : 'text-slate-700 font-semibold'}`}>Determine initial visual mode for student sections.</span>
                    </div>
                    <div className="flex border border-slate-200 dark:border-zinc-800 rounded-xl overflow-hidden bg-white dark:bg-zinc-900 shrink-0">
                      <button
                        onClick={() => { playBeep(true); updateSettings('themeMode', 'light'); }}
                        className={`px-3 py-1.5 font-bold text-[10px] uppercase transition-colors cursor-pointer ${course.settings.themeMode === 'light' ? 'bg-[#002F6C] text-white font-black' : (isDark ? 'text-zinc-400 bg-zinc-900 hover:bg-zinc-800' : 'text-slate-700 bg-white hover:bg-neutral-100')}`}
                      >
                        Light Default
                      </button>
                      <button
                        onClick={() => { playBeep(true); updateSettings('themeMode', 'dark'); }}
                        className={`px-3 py-1.5 font-bold text-[10px] uppercase transition-colors cursor-pointer ${course.settings.themeMode === 'dark' ? 'bg-[#002F6C] text-white font-black' : (isDark ? 'text-zinc-400 bg-zinc-900 hover:bg-zinc-800' : 'text-slate-700 bg-white hover:bg-neutral-100')}`}
                      >
                        Dark Default
                      </button>
                    </div>
                  </div>

                  {/* WCAG Compliant Color Theme select switcher */}
                  <div className={`flex flex-col gap-3 p-4 border rounded-2xl transition-all ${
                    isDark ? 'bg-zinc-950/40 border-zinc-800' : 'bg-slate-50 border-slate-200'
                  }`}>
                    <div className="text-xs">
                      <strong className={`block uppercase tracking-wider font-extrabold ${isDark ? 'text-zinc-100' : 'text-slate-900'}`}>Curriculum color theme (WCAG AA)</strong>
                      <span className={`text-[10px] block mt-1 ${isDark ? 'text-zinc-300' : 'text-slate-700 font-semibold'}`}>Choose from three WCAG contrast-compliant color spectrums for all sections.</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => { playBeep(true); updateSettings('colorTheme', 'classic'); }}
                        className={`px-2.5 py-2 border rounded-xl font-mono text-[10px] font-bold text-center transition-all cursor-pointer ${
                          (course.settings.colorTheme || 'classic') === 'classic'
                            ? 'bg-amber-600 text-white border-amber-700 font-black shadow-sm'
                            : (isDark ? 'bg-zinc-900 text-zinc-300 border-zinc-800 hover:bg-zinc-800 hover:text-white' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50')
                        }`}
                      >
                        Classic Amber
                      </button>
                      <button
                        type="button"
                        onClick={() => { playBeep(true); updateSettings('colorTheme', 'steel'); }}
                        className={`px-2.5 py-2 border rounded-xl font-mono text-[10px] font-bold text-center transition-all cursor-pointer ${
                          course.settings.colorTheme === 'steel'
                            ? 'bg-blue-600 text-white border-blue-700 font-black shadow-sm'
                            : (isDark ? 'bg-zinc-900 text-zinc-300 border-zinc-800 hover:bg-zinc-800 hover:text-white' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50')
                        }`}
                      >
                        Steel Azure
                      </button>
                      <button
                        type="button"
                        onClick={() => { playBeep(true); updateSettings('colorTheme', 'forest'); }}
                        className={`px-2.5 py-2 border rounded-xl font-mono text-[10px] font-bold text-center transition-all cursor-pointer ${
                          course.settings.colorTheme === 'forest'
                            ? 'bg-emerald-700 text-white border-emerald-800 font-black shadow-sm'
                            : (isDark ? 'bg-zinc-900 text-zinc-300 border-zinc-800 hover:bg-zinc-800 hover:text-white' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50')
                        }`}
                      >
                        Forest Herbal
                      </button>
                    </div>
                  </div>

                  {/* Auto progress check option */}
                  <label className={`flex items-start gap-3 cursor-pointer select-none p-4 border border-dashed rounded-2xl transition-colors ${
                    isDark ? 'hover:bg-zinc-800/40 border-zinc-800 bg-zinc-900/10' : 'hover:bg-slate-100/50 border-slate-200 bg-slate-50/50'
                  }`}>
                    <input
                      type="checkbox"
                      checked={course.settings.autoProgress}
                      onChange={(e) => updateSettings('autoProgress', e.target.checked)}
                      className="w-4 h-4 accent-blue-600 border-2 mt-0.5 cursor-pointer rounded"
                    />
                    <div className="text-xs">
                      <strong className={`block uppercase tracking-wider font-extrabold ${isDark ? 'text-zinc-100' : 'text-slate-900'}`}>Auto section progression</strong>
                      <span className={`text-[10px] block mt-1 leading-relaxed ${isDark ? 'text-zinc-300' : 'text-slate-700 font-semibold'}`}>Automatically trigger transition to the next unit section once a student resolves assessment answers.</span>
                    </div>
                  </label>

                  {/* Ask student name check option */}
                  <label className={`flex items-start gap-3 cursor-pointer select-none p-4 border border-dashed rounded-2xl transition-colors ${
                    isDark ? 'hover:bg-zinc-800/40 border-zinc-800 bg-zinc-900/10' : 'hover:bg-slate-100/50 border-slate-200 bg-slate-50/50'
                  }`}>
                    <input
                      type="checkbox"
                      checked={course.settings.askForStudentName}
                      onChange={(e) => updateSettings('askForStudentName', e.target.checked)}
                      className="w-4 h-4 accent-blue-600 border-2 mt-0.5 cursor-pointer rounded"
                    />
                    <div className="text-xs">
                      <strong className={`block uppercase tracking-wider font-extrabold ${isDark ? 'text-zinc-100' : 'text-slate-900'}`}>Prompt student name on entrance</strong>
                      <span className={`text-[10px] block mt-1 leading-relaxed ${isDark ? 'text-zinc-300' : 'text-slate-700 font-semibold'}`}>Prompt student credentials on home section. SCORM exports can toggle this OFF if utilizing automated LMS handles.</span>
                    </div>
                  </label>

                  {/* Enable Home quick reference bypass sheet check option */}
                  <label className={`flex items-start gap-3 cursor-pointer select-none p-4 border border-dashed rounded-2xl transition-colors ${
                    isDark ? 'hover:bg-zinc-800/40 border-zinc-800 bg-zinc-900/10' : 'hover:bg-slate-100/50 border-slate-200 bg-slate-50/50'
                  }`}>
                    <input
                      type="checkbox"
                      checked={course.settings.allowHomeSummaryAccess}
                      onChange={(e) => updateSettings('allowHomeSummaryAccess', e.target.checked)}
                      className="w-4 h-4 accent-blue-600 border-2 mt-0.5 cursor-pointer rounded"
                    />
                    <div className="text-xs">
                      <strong className={`block uppercase tracking-wider font-extrabold ${isDark ? 'text-zinc-100' : 'text-slate-900'}`}>Allow Reference Sheet from Home</strong>
                      <span className={`text-[10px] block mt-1 leading-relaxed ${isDark ? 'text-zinc-300' : 'text-slate-700 font-semibold'}`}>Enable a quick direct summary bypass link straight from the introduction section.</span>
                    </div>
                  </label>

                  {/* Chime check option */}
                  <label className={`flex items-start gap-3 cursor-pointer select-none p-4 border border-dashed rounded-2xl transition-colors ${
                    isDark ? 'hover:bg-zinc-800/40 border-zinc-800 bg-zinc-900/10' : 'hover:bg-slate-100/50 border-slate-200 bg-slate-50/50'
                  }`}>
                    <input
                      type="checkbox"
                      checked={course.settings.soundEffectsEnabled ?? true}
                      onChange={(e) => updateSettings('soundEffectsEnabled', e.target.checked)}
                      className="w-4 h-4 accent-blue-600 border-2 mt-0.5 cursor-pointer rounded"
                    />
                    <div className="text-xs">
                      <strong className={`block uppercase tracking-wider font-extrabold ${isDark ? 'text-zinc-100' : 'text-slate-900'}`}>Sound chime auditory feedback</strong>
                      <span className={`text-[10px] block mt-1 leading-relaxed ${isDark ? 'text-zinc-300' : 'text-slate-700 font-semibold'}`}>Plays responsive retrograde 8-bit sound chimes during answer updates and button triggers.</span>
                    </div>
                  </label>

                  {/* Required Assessment Quizzes Option */}
                  <label className={`flex items-start gap-3 cursor-pointer select-none p-4 border border-dashed rounded-2xl transition-colors ${
                    isDark ? 'hover:bg-zinc-800/40 border-zinc-800 bg-zinc-900/10' : 'hover:bg-slate-100/50 border-slate-200 bg-slate-50/50'
                  }`}>
                    <input
                      type="checkbox"
                      checked={course.settings.questionsRequired}
                      onChange={(e) => updateSettings('questionsRequired', e.target.checked)}
                      className="w-4 h-4 accent-blue-600 border-2 mt-0.5 cursor-pointer rounded"
                    />
                    <div className="text-xs">
                      <strong className={`block uppercase tracking-wider font-extrabold ${isDark ? 'text-zinc-100' : 'text-slate-900'}`}>Mandatory Assessment Quizzes</strong>
                      <span className={`text-[10px] block mt-1 leading-relaxed ${isDark ? 'text-zinc-300' : 'text-slate-700 font-semibold'}`}>Ensure students take assessments. If disabled, study quizzes become optional, and minimum passing percentage is not enforced.</span>
                    </div>
                  </label>

                  {/* Passing Grade Slider range */}
                  {course.settings.questionsRequired ? (
                    <div className="pt-4 border-t border-slate-100 dark:border-zinc-800 space-y-2.5">
                      <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-tight">
                        <span className={`${isDark ? 'text-zinc-300' : 'text-slate-700 font-bold'}`}>Passing Grade Assessment Target Score:</span>
                        <strong className="text-blue-600 dark:text-blue-400 font-extrabold text-xs">{course.settings.passingScorePercent || 80}%</strong>
                      </div>
                      <input
                        type="range"
                        min="50"
                        max="100"
                        step="5"
                        value={course.settings.passingScorePercent || 80}
                        onChange={(e) => updateSettings('passingScorePercent', parseInt(e.target.value, 10))}
                        className="w-full accent-blue-600 bg-neutral-200 dark:bg-zinc-800 h-1.5 rounded-lg cursor-pointer"
                      />
                      <span className={`text-[10px] leading-tight block ${isDark ? 'text-zinc-300' : 'text-slate-700 font-semibold'}`}>Students must score at least this value in quiz questions to pass the course.</span>
                    </div>
                  ) : (
                    <div className="p-4 bg-emerald-500/5 text-emerald-800 dark:text-emerald-400 text-[11px] rounded-xl border border-emerald-500/10 font-mono leading-relaxed">
                      ✨ <strong>Questions are Optional</strong>: Passing score target and grade requirements are disabled since evaluations are configured as self-guided research practice.
                    </div>
                  )}

                </div>
              </div>
            </div>
          )}

            {/* TAB 4: PUBLISH CENTER & EXPORTERS */}
            {activeTab === 'publish' && (
            <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn">

              {/* Course readiness summary */}
              {(() => {
                const totalQ = course.sections.reduce((s, sec) => s + (sec.questions?.length || 0), 0);
                const totalFC = course.sections.reduce((s, sec) => s + (sec.flashcards?.length || 0), 0);
                const sectionsWithQ = course.sections.filter(sec => (sec.questions?.length || 0) > 0).length;
                return (
                  <div className={`p-5 rounded-2xl border flex flex-wrap gap-4 items-center justify-between ${
                    isDark ? 'bg-zinc-900/50 border-zinc-800' : 'bg-white border-slate-200'
                  } shadow-md`}>
                    <div className="flex items-center gap-2">
                      <Award className="w-4 h-4 text-blue-600" />
                      <span className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-zinc-200' : 'text-slate-800'}`}>Course Summary</span>
                    </div>
                    <div className="flex flex-wrap gap-3 font-mono text-xs">
                      {[
                        { label: 'Sections', value: course.sections.length, color: 'blue' },
                        { label: 'Quiz Questions', value: totalQ, color: 'violet' },
                        { label: 'Flashcards', value: totalFC, color: 'emerald' },
                        { label: 'Sections with Quiz', value: `${sectionsWithQ} / ${course.sections.length}`, color: 'amber' },
                      ].map(({ label, value, color }) => (
                        <div key={label} className={`px-3 py-1.5 rounded-xl border flex items-center gap-1.5 ${
                          isDark ? 'bg-zinc-800 border-zinc-700 text-zinc-200' : 'bg-slate-50 border-slate-200 text-slate-800'
                        }`}>
                          <strong className={`text-${color}-500`}>{value}</strong>
                          <span className="opacity-60">{label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}

              {/* Draft Backup Centre */}
              <div className={`p-8 rounded-2xl border ${
                isDark ? 'bg-zinc-900/50 border-zinc-800 text-zinc-100' : 'bg-white border-slate-200 text-slate-800'
              } shadow-xl space-y-4`}>
                <h4 className="text-xs font-bold tracking-wider uppercase flex items-center gap-1.5 pb-2.5 border-b border-slate-200/60 dark:border-zinc-800 text-blue-600 dark:text-blue-400">
                  <RefreshCw className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span>Draft Backups & Templates JSON Hub</span>
                </h4>

                <p className="text-xs font-mono opacity-70 leading-relaxed font-semibold">
                  Back up your raw training course configurations. Import existing Lumina JSON configurations to quickly resume content design sessions safely.
                </p>

                <div className="flex flex-wrap gap-2.5 pt-1.5 font-mono text-xs">
                  <button
                    onClick={handleExportDraftJson}
                    className="flex-1 py-2 px-4.5 text-[10px] uppercase tracking-wider font-extrabold bg-[#2563eb] hover:bg-blue-700 text-white rounded-xl transition-all shadow-sm cursor-pointer"
                  >
                    Export JSON draft config
                  </button>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex-1 py-2 px-4.5 text-[10px] uppercase tracking-wider font-extrabold bg-slate-50 dark:bg-zinc-800/80 text-slate-800 dark:text-white border border-slate-200 dark:border-zinc-700/50 hover:bg-slate-100 dark:hover:bg-zinc-700 transition-all rounded-xl cursor-pointer"
                  >
                    Import .json draft file
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImportDraftJson}
                    accept=".json"
                    className="hidden"
                  />
                  <button
                    onClick={() => { playBeep(true); setShowDefaultRestoreModal(true); }}
                    className="py-2 px-4 text-slate-700 dark:text-zinc-300 hover:text-rose-600 transition-colors border border-slate-200 dark:border-zinc-700 rounded-xl cursor-pointer"
                  >
                    Reset template
                  </button>
                </div>

                {importStatus && (
                  <p className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 text-center font-bold">
                    {importStatus}
                  </p>
                )}
              </div>

              {/* Launcher block */}
              <div className={`p-6 md:p-8 rounded-2xl border flex flex-col md:flex-row gap-5 items-center justify-between ${
                isDark ? 'bg-gradient-to-r from-blue-950/25 to-zinc-900/40 border-blue-900/25 text-zinc-100' : 'bg-gradient-to-r from-blue-50/40 to-slate-50/50 border-blue-100/45 text-slate-800'
              } shadow-md font-mono`}>
                <div className="space-y-1 text-center md:text-left">
                  <span className="text-[9px] uppercase tracking-wider text-blue-600 font-extrabold block">Dynamic sandboxed playground</span>
                  <h4 className="text-sm font-bold uppercase tracking-tight">Launch Playtest Simulation</h4>
                  <p className="text-[11px] opacity-75">Instantly trigger the interactive training player simulation sandbox within the workspace iframe.</p>
                </div>
                <button
                  onClick={() => { playBeep(true); setIsSimulatorActive(true); }}
                  className="px-6 py-3 font-extrabold text-xs uppercase bg-blue-600 text-white hover:bg-blue-500 rounded-xl transition-all shadow-md shadow-blue-500/10 cursor-pointer flex items-center gap-1.5"
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>Preview Simulator Player</span>
                </button>
              </div>

              {/* Release packaging center */}
              <div className={`p-8 rounded-2xl border ${
                isDark ? 'bg-zinc-900/50 border-zinc-800 text-zinc-100' : 'bg-white border-slate-200 text-neutral-900'
              } shadow-xl space-y-6`}>
                <div>
                  <h3 className="font-bold text-base uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100/85 dark:border-zinc-800 pb-3 text-neutral-900 dark:text-zinc-300">
                    <Package className="w-5 h-5 text-blue-600" />
                    <span>Releases & SCORM Packager Center</span>
                  </h3>
                  <p className="text-[11px] font-mono opacity-70 leading-relaxed mt-2.5 font-semibold">Export fully complete training files. STANDALONE HTML yields a fast single-file asset containing your player, layouts, sound, certificate prints, and inline scripts. SCORM formats pack these with XML manifests to read and write student name, score, progress, and certification outcomes instantly in corporate LMS platforms.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1.5">
                  <button
                    onClick={handleExportSelfContainedHtmlFile}
                    className={`p-6 border rounded-2xl flex flex-col items-center justify-center gap-3.5 cursor-pointer text-center group transition-all duration-200 ${
                      isDark 
                        ? 'bg-zinc-950/65 border-zinc-800 text-zinc-300 hover:bg-blue-600 hover:text-white shadow-sm' 
                        : 'bg-slate-50/50 border-slate-200 text-[#0A0A0A] hover:bg-blue-600 hover:text-white hover:border-transparent hover:shadow-lg hover:shadow-blue-500/10'
                    }`}
                  >
                    <FileCode className="w-8 h-8 text-blue-600 group-hover:text-white transition-colors" />
                    <div>
                      <strong className="block font-bold text-xs uppercase tracking-tight">Standalone File</strong>
                      <span className="text-[9px] opacity-75 mt-1 block italic font-mono font-semibold">Single HTML Document</span>
                    </div>
                  </button>

                  <button
                    onClick={() => handleExportScormZipFile('1.2')}
                    className={`p-6 border rounded-2xl flex flex-col items-center justify-center gap-3.5 cursor-pointer text-center group transition-all duration-200 ${
                      isDark 
                        ? 'bg-zinc-950/65 border-zinc-800 text-zinc-300 hover:bg-blue-600 hover:text-white shadow-sm' 
                        : 'bg-white border-slate-200 text-[#0A0A0A] hover:bg-blue-650 hover:text-white hover:border-transparent hover:shadow-lg hover:shadow-blue-500/10'
                    }`}
                  >
                    <Package className="w-8 h-8 text-blue-600 group-hover:text-white transition-colors" />
                    <div>
                      <strong className="block font-bold text-xs uppercase tracking-tight">SCORM v1.2 ZIP</strong>
                      <span className="text-[9px] opacity-75 mt-1 block italic font-mono font-semibold">Standard LMS package</span>
                    </div>
                  </button>

                  <button
                    onClick={() => handleExportScormZipFile('2004')}
                    className={`p-6 border rounded-2xl flex flex-col items-center justify-center gap-3.5 cursor-pointer text-center group transition-all duration-200 ${
                      isDark 
                        ? 'bg-zinc-950/65 border-zinc-800 text-zinc-300 hover:bg-blue-600 hover:text-white shadow-sm' 
                        : 'bg-white border-slate-200 text-[#0A0A0A] hover:bg-blue-600 hover:text-white hover:border-transparent hover:shadow-lg hover:shadow-blue-500/10'
                    }`}
                  >
                    <Package className="w-8 h-8 text-blue-600 group-hover:text-white transition-colors" />
                    <div>
                      <strong className="block font-bold text-xs uppercase tracking-tight">SCORM 2004 ZIP</strong>
                      <span className="text-[9px] opacity-75 mt-1 block italic font-mono font-semibold">Advanced sequence manifest</span>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          )}

        </main>
      )}

      {/* FOOTER BAR */}
      <footer className="py-10 text-center text-[10px] font-mono opacity-50 no-print border-t border-slate-200/60 dark:border-zinc-800 mt-16">
        <span>Tutelage Studio • Interactive Training Course Builder • 2026</span>
      </footer>

      {/* LAYOUT PICKER MODAL */}
      {showLayoutPickerModal && (
        <div className="fixed inset-0 bg-[#262626]/80 backdrop-blur-xs flex items-center justify-center z-[999] p-4 animate-fadeIn">
          <div className={`max-w-2xl w-full p-6 rounded-2xl border shadow-2xl space-y-5 ${
            isDark ? 'bg-[#111827] border-zinc-700 text-zinc-100' : 'bg-white border-slate-300 text-slate-800'
          }`}>
            <div className="flex justify-between items-center border-b pb-4 border-slate-200/60 dark:border-zinc-700">
              <h4 className="text-sm font-bold uppercase tracking-tight text-[#002F6C] dark:text-[#4FC4D4] flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Choose Section Layout
              </h4>
              <button
                onClick={() => setShowLayoutPickerModal(false)}
                className={`p-1.5 rounded-lg text-xs font-mono border cursor-pointer ${isDark ? 'border-zinc-700 text-zinc-200 hover:bg-zinc-800' : 'border-slate-200 text-slate-700 hover:bg-slate-50'}`}
              >
                ✕
              </button>
            </div>
            <p className={`text-[11px] font-mono ${isDark ? 'text-zinc-300' : 'text-slate-700'}`}>
              Select a layout type for the new section. You can change it later from the editor.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {([
                { type: 'text_video' as ScreenLayoutType, icon: Video, label: 'Narrative Video', desc: 'Text + embedded video' },
                { type: 'text_table' as ScreenLayoutType, icon: Table, label: 'Compare Table', desc: 'Data comparison grid' },
                { type: 'cards_grid' as ScreenLayoutType, icon: Grid, label: 'Flip Cards', desc: 'Interactive flipcards' },
                { type: 'bento_highlights' as ScreenLayoutType, icon: LayoutGrid, label: 'Bento Grid', desc: 'Metric highlight boxes' },
                { type: 'milestone_timeline' as ScreenLayoutType, icon: GitCommit, label: 'Timeline', desc: 'Step-by-step roadmap' },
                { type: 'code_quote_spotlight' as ScreenLayoutType, icon: Code, label: 'Code / Quote', desc: 'Spotlight panel' },
                { type: 'multi_tab_dive' as ScreenLayoutType, icon: FolderLock, label: 'Tabbed Dive', desc: 'Category deep-dives' },
                { type: 'qa_accordion' as ScreenLayoutType, icon: HelpCircle, label: 'Q&A Accordion', desc: 'Expandable FAQ items' },
              ] as { type: ScreenLayoutType; icon: React.ElementType; label: string; desc: string }[]).map(({ type, icon: Icon, label, desc }) => (
                <button
                  key={type}
                  onClick={() => {
                    handleAddSection(type, layoutPickerInsertAfterId);
                    setShowLayoutPickerModal(false);
                  }}
                  className={`p-4 border rounded-xl flex flex-col items-center gap-2 text-center cursor-pointer transition-all group ${
                    isDark
                      ? 'bg-zinc-900 border-zinc-700 hover:bg-blue-600 hover:border-blue-500 hover:text-white text-zinc-300'
                      : 'bg-slate-50 border-slate-200 hover:bg-blue-600 hover:border-transparent hover:text-white text-slate-700 hover:shadow-md hover:shadow-blue-500/15'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <div>
                    <strong className="text-[11px] font-bold uppercase tracking-tight block">{label}</strong>
                    <span className="text-[9px] font-mono opacity-60 block mt-0.5">{desc}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* CUSTOM SECTION DELETION MODAL */}
      {sectionIdToDelete && (
        <div className="fixed inset-0 bg-[#262626]/80 backdrop-blur-xs flex items-center justify-center z-[999] p-4 animate-fadeIn">
          <div className={`max-w-md w-full p-6 rounded-2xl border shadow-2xl space-y-5 ${
            isDark ? 'bg-[#2F3638] border-zinc-700 text-[#EFEFE8]' : 'bg-white border-slate-300 text-[#2F3638]'
          }`}>
            <div className="flex gap-3 items-start">
              <div className="w-10 h-10 rounded-full bg-rose-500/15 text-rose-500 flex items-center justify-center mt-0.5 flex-shrink-0">
                <Info className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold uppercase tracking-tight text-[#002F6C] dark:text-[#4FC4D4]">Confirm Section Deletion</h4>
                <p className="text-xs text-slate-700 dark:text-zinc-200 font-mono leading-relaxed">
                  Are you sure you want to delete the section <strong>"{course.sections.find(s => s.id === sectionIdToDelete)?.title}"</strong>?
                  All custom texts, questions, layout settings, and media content inside this section will be permanently deleted.
                </p>
              </div>
            </div>
            <div className="flex justify-end gap-2 text-xs font-mono">
              <button
                type="button"
                onClick={() => { playBeep(false); setSectionIdToDelete(null); }}
                className={`px-4 py-2 rounded-xl border ${
                  isDark ? 'border-zinc-700 text-zinc-400 hover:bg-zinc-800' : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                } transition-all cursor-pointer`}
              >
                No, Keep Section
              </button>
              <button
                type="button"
                onClick={() => {
                  playBeep(true);
                  if (sectionIdToDelete) {
                    handleDeleteSection(sectionIdToDelete);
                    setSectionIdToDelete(null);
                  }
                }}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold transition-all shadow-md cursor-pointer"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CUSTOM RESTORE DEFAULT MODAL */}
      {showDefaultRestoreModal && (
        <div className="fixed inset-0 bg-[#262626]/80 backdrop-blur-xs flex items-center justify-center z-[999] p-4 animate-fadeIn">
          <div className={`max-w-md w-full p-6 rounded-2xl border shadow-2xl space-y-5 ${
            isDark ? 'bg-[#2F3638] border-zinc-700 text-[#EFEFE8]' : 'bg-white border-slate-300 text-[#2F3638]'
          }`}>
            <div className="flex gap-3 items-start">
              <div className="w-10 h-10 rounded-full bg-amber-500/15 text-amber-500 flex items-center justify-center mt-0.5 flex-shrink-0">
                <RotateCcw className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold uppercase tracking-tight text-[#002F6C] dark:text-[#4FC4D4] font-sans">Restore Sandbox Template?</h4>
                <p className="text-xs text-slate-700 dark:text-zinc-200 font-mono leading-relaxed">
                  Are you sure you want to reset and restore the default blank starter course?
                  Any current unsaved edits will be rewritten.
                </p>
              </div>
            </div>
            <div className="flex justify-end gap-2 text-xs font-mono">
              <button
                type="button"
                onClick={() => { playBeep(false); setShowDefaultRestoreModal(false); }}
                className={`px-4 py-2 rounded-xl border ${
                  isDark ? 'border-zinc-700 text-zinc-400 hover:bg-zinc-800' : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                } transition-all cursor-pointer`}
              >
                Cancel, Keep Existing
              </button>
              <button
                type="button"
                onClick={() => {
                  playBeep(true);
                  handleRestoreTemplate();
                }}
                className="px-4 py-2 rounded-xl bg-[#002F6C] hover:bg-[#002F6C]/90 text-white font-bold transition-all shadow-md cursor-pointer"
              >
                Yes, Reset Sandbox
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

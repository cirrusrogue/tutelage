/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { Section, ScreenLayoutType, TableRow, GridCardItem, BentoBox, TimelineStep, TabItem, AccordionItem, QuizQuestion, CourseFlashcard, SectionNarration } from '../types';
import { 
  Video,
  Table,
  Grid,
  LayoutGrid,
  GitCommit,
  Code,
  FolderLock,
  HelpCircle,
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  BrainCircuit,
  MessageSquare,
  Sparkles,
  Volume2,
  Upload,
  Link,
  X
} from 'lucide-react';

interface SectionEditorProps {
  section: Section;
  isDark: boolean;
  onChange: (updatedSection: Section) => void;
}

function CharLimitRecommend({ current, recommendedMax }: { current: number; recommendedMax: number }) {
  const isOver = current > recommendedMax;
  return (
    <span className={`text-[9px] font-mono block mt-0.5 ${isOver ? 'text-rose-600 dark:text-rose-400 font-extrabold' : 'text-slate-700 dark:text-zinc-300'}`}>
      Recommended: max {recommendedMax} chars (Current: <strong>{current}</strong>{isOver ? ' - Warning: May spill out' : ''})
    </span>
  );
}

export default function SectionEditor({ section, isDark, onChange }: SectionEditorProps) {

  const [pendingLayout, setPendingLayout] = useState<ScreenLayoutType | null>(null);
  const [narrationTab, setNarrationTab] = useState<'upload' | 'url'>('upload');
  const audioFileInputRef = useRef<HTMLInputElement>(null);

  const updateSectionPart = (key: keyof Section, value: any) => {
    onChange({
      ...section,
      [key]: value
    });
  };

  const handleLayoutSelectorChange = (layout: ScreenLayoutType) => {
    if (layout === section.layoutType) return;
    // Warn if the current layout already has meaningful content
    const currentData = (section as any)[section.layoutType];
    const hasContent = currentData && (
      currentData.text?.trim?.()?.length > 0 ||
      currentData.spotlightText?.trim?.()?.length > 0 ||
      currentData.items?.length > 0 ||
      currentData.cards?.length > 0 ||
      currentData.boxes?.length > 0 ||
      currentData.steps?.length > 0 ||
      currentData.tabs?.length > 0 ||
      currentData.rows?.length > 0
    );
    if (hasContent) {
      setPendingLayout(layout);
      return;
    }
    applyLayoutChange(layout);
  };

  const applyLayoutChange = (layout: ScreenLayoutType) => {
    // Populate default structures if not present
    const updated = { ...section, layoutType: layout };
    
    if (layout === 'text_video' && !updated.text_video) {
      updated.text_video = {
        text: "Add your text here...",
        videoUrl: "https://www.youtube.com/embed/zjkBMFhNj_g",
        caption: "Enter video brief capton"
      };
    }
    
    if (layout === 'text_table' && !updated.text_table) {
      updated.text_table = {
        text: "Compare key characteristics in the structured comparative table below.",
        headers: ["Parameter", "Description", "Standard Range"],
        rows: [
          { col1: "Item A", col2: "Description for Item A", col3: "Optimal Status", badgeType: "success" },
          { col1: "Item B", col2: "Description for Item B", col3: "Requires attention", badgeType: "warning" }
        ]
      };
    }

    if (layout === 'cards_grid' && !updated.cards_grid) {
      updated.cards_grid = {
        text: "Click each card to flip it over and learn about that concept.",
        cards: [
          { id: "c1", title: "Concept Alpha", backContent: "Deep information about Alpha.", badge: "New", icon: "Zap" },
          { id: "c2", title: "Concept Beta", backContent: "Deep information about Beta.", badge: "Crucial", icon: "Layers" }
        ]
      };
    }

    if (layout === 'bento_highlights' && !updated.bento_highlights) {
      updated.bento_highlights = {
        text: "Overview of key insights represented in the interactive bento dashboard matrix below.",
        boxes: [
          { id: "b1", title: "Scale Indicator", value: "98.5%", description: "Maximum efficiency scored across our baseline integrations.", size: "medium", colorPreset: "emerald" },
          { id: "b2", title: "System Cap", value: "Unlimited", description: "Scale capacities of deployed models inside the workspace.", size: "large", colorPreset: "blue" },
          { id: "b3", title: "Speed Priority", value: "Real-time", description: "Zero lag processing latency.", size: "small", colorPreset: "amber" }
        ]
      };
    }

    if (layout === 'milestone_timeline' && !updated.milestone_timeline) {
      updated.milestone_timeline = {
        text: "Discover the linear development roadmap from initial tests to enterprise delivery.",
        steps: [
          { id: "s1", stepNumber: "01", title: "Conceptual Sandbox", description: "Initial prompts playground testing in the studio sandbox.", badgeText: "Fast loop" },
          { id: "s2", stepNumber: "02", title: "Launch and Deploy", description: "Deploy full stack integration to cloud containers.", badgeText: "Production Ready" }
        ]
      };
    }

    if (layout === 'code_quote_spotlight' && !updated.code_quote_spotlight) {
      updated.code_quote_spotlight = {
        mainText: "Our core mission centers on secure architectures. Review our target deployment schema configuration on the side.",
        spotlightText: `{\n  "version": "1.0.0",\n  "status": "online",\n  "port": 3000\n}`,
        captionTitle: "Production Configuration Schema",
        languageOrAuthor: "json",
        isCode: true
      };
    }

    if (layout === 'multi_tab_dive' && !updated.multi_tab_dive) {
      updated.multi_tab_dive = {
        text: "Click through the navigation categories below to deep-dive into each specialized field.",
        tabs: [
          { id: "t1", label: "Overview", title: "Strategy Introduction", content: "Broad explanations of standard operations and processes.", sublist: ["Element 1", "Element 2"] },
          { id: "t2", label: "Details", title: "Technical Blueprint", content: "Deep explanation of system layouts, integrations, and logic.", sublist: ["Blueprint X", "Config Y"] }
        ]
      };
    }

    if (layout === 'qa_accordion' && !updated.qa_accordion) {
      updated.qa_accordion = {
        text: "Answers to the most frequently asked deployment and integration questions.",
        items: [
          { id: "a1", trigger: "How long does compilation configure?", content: "Normally near instant. Standalone HTML builds in approximately 2 seconds." },
          { id: "a2", trigger: "Is SCORM fully supported?", content: "Yes! The exported package communicates with SCORM 1.2 and standard LMS APIs immediately upon loading." }
        ]
      };
    }

    onChange(updated);
  };

  const renderSelectedLayoutEditor = () => {
    const layout = section.layoutType;

    switch (layout) {
      case 'text_video': {
        const data = section.text_video || { text: '', videoUrl: '', caption: '' };
        return (
          <div className="space-y-3.5">
            <div>
              <label className="text-[11px] font-mono font-bold tracking-wider uppercase text-slate-800 dark:text-zinc-300 block mb-1">Section Paragraph Narrative Text</label>
              <textarea
                value={data.text}
                rows={3}
                onChange={(e) => updateSectionPart('text_video', { ...data, text: e.target.value })}
                className="w-full p-2 text-xs font-mono border rounded outline-none bg-transparent"
                placeholder="Type course narrative details here..."
              />
              <CharLimitRecommend current={data.text?.length || 0} recommendedMax={350} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-mono font-bold tracking-wider uppercase text-slate-800 dark:text-zinc-300 block mb-1">Video IFrame Embed URL</label>
                <input
                  type="text"
                  value={data.videoUrl}
                  onChange={(e) => updateSectionPart('text_video', { ...data, videoUrl: e.target.value })}
                  className="w-full p-2 text-xs font-mono border rounded outline-none bg-transparent"
                  placeholder="e.g. https://www.youtube.com/embed/zjkBMFhNj_g"
                />
                <span className="text-[9px] text-slate-700 dark:text-zinc-300 font-mono italic block mt-0.5">YouTube embed link format is recommended</span>
              </div>
              <div>
                <label className="text-[11px] font-mono font-bold tracking-wider uppercase text-slate-800 dark:text-zinc-300 block mb-1">Bottom Caption Description</label>
                <input
                  type="text"
                  value={data.caption || ''}
                  onChange={(e) => updateSectionPart('text_video', { ...data, caption: e.target.value })}
                  className="w-full p-2 text-xs font-mono border rounded outline-none bg-transparent"
                  placeholder="e.g. Brief caption describing what the presentation covers"
                />
                <CharLimitRecommend current={data.caption?.length || 0} recommendedMax={80} />
              </div>
            </div>
          </div>
        );
      }

      case 'text_table': {
        const data = section.text_table || { text: '', headers: [], rows: [] };
        return (
          <div className="space-y-4">
            <div>
              <label className="text-[11px] font-mono font-bold tracking-wider uppercase text-slate-800 dark:text-zinc-300 block mb-1">Intro Narrative Text</label>
              <textarea
                value={data.text}
                rows={2}
                onChange={(e) => updateSectionPart('text_table', { ...data, text: e.target.value })}
                className="w-full p-2 text-xs font-mono border rounded outline-none bg-transparent"
                placeholder="Narrative caption..."
              />
              <CharLimitRecommend current={data.text?.length || 0} recommendedMax={250} />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-800 dark:text-zinc-300">Define Table Rows Data</span>
                <button
                  onClick={() => {
                    const newRow: TableRow = { col1: "New parameters", col2: "Description string", col3: "Pass", badgeType: "success" };
                    updateSectionPart('text_table', { ...data, rows: [...data.rows, newRow] });
                  }}
                  className="px-2 py-0.5 text-[10px] font-mono bg-amber-500 text-slate-950 font-bold rounded flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" /> Add Row
                </button>
              </div>

              <div className="space-y-2">
                {data.rows?.map((row, idx) => (
                  <div key={idx} className="flex gap-2 items-center border-l-2 border-slate-700 pl-2 py-1.5 flex-wrap md:flex-nowrap">
                    <input
                      type="text"
                      value={row.col1}
                      onChange={(e) => {
                        const nextRows = [...data.rows];
                        nextRows[idx].col1 = e.target.value;
                        updateSectionPart('text_table', { ...data, rows: nextRows });
                      }}
                      className="p-1 text-xs font-mono border rounded outline-none flex-grow bg-transparent"
                      placeholder="Column 1"
                    />
                    <input
                      type="text"
                      value={row.col2}
                      onChange={(e) => {
                        const nextRows = [...data.rows];
                        nextRows[idx].col2 = e.target.value;
                        updateSectionPart('text_table', { ...data, rows: nextRows });
                      }}
                      className="p-1 text-xs font-mono border rounded outline-none flex-grow bg-transparent animate-pulse-once"
                      placeholder="Column 2"
                    />
                    <input
                      type="text"
                      value={row.col3 || ''}
                      onChange={(e) => {
                        const nextRows = [...data.rows];
                        nextRows[idx].col3 = e.target.value;
                        updateSectionPart('text_table', { ...data, rows: nextRows });
                      }}
                      className="p-1 text-xs font-mono border rounded outline-none w-24 bg-transparent"
                      placeholder="Badge"
                    />
                    <select
                      value={row.badgeType || 'none'}
                      onChange={(e) => {
                        const nextRows = [...data.rows];
                        nextRows[idx].badgeType = e.target.value as any;
                        updateSectionPart('text_table', { ...data, rows: nextRows });
                      }}
                      className="p-1 text-xs border rounded font-mono w-24 bg-transparent"
                    >
                      <option value="none">Normal</option>
                      <option value="success">Success</option>
                      <option value="warning">Warning</option>
                      <option value="danger">Danger</option>
                      <option value="info">Info</option>
                    </select>
                    <button
                      onClick={() => {
                        const nextRows = data.rows.filter((_, i) => i !== idx);
                        updateSectionPart('text_table', { ...data, rows: nextRows });
                      }}
                      className="p-1 text-rose-500 hover:text-rose-400"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      }

      case 'cards_grid': {
        const data = section.cards_grid || { text: '', cards: [] };
        return (
          <div className="space-y-4">
            <div>
              <label className="text-[11px] font-mono font-bold tracking-wider uppercase text-slate-800 dark:text-zinc-300 block mb-1">Intro Narrative Text</label>
              <textarea
                value={data.text}
                rows={2}
                onChange={(e) => updateSectionPart('cards_grid', { ...data, text: e.target.value })}
                className="w-full p-2 text-xs font-mono border rounded outline-none bg-transparent"
                placeholder="Narrative instructions..."
              />
              <CharLimitRecommend current={data.text?.length || 0} recommendedMax={200} />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-800 dark:text-zinc-300">Customize Flipcards</span>
                <button
                  onClick={() => {
                    const newCard: GridCardItem = {
                      id: `c_${Date.now()}`,
                      title: "New Concept Title",
                      backContent: "Detail description written on the back of the card when user clicks it.",
                      badge: "New"
                    };
                    updateSectionPart('cards_grid', { ...data, cards: [...data.cards, newCard] });
                  }}
                  className="px-2 py-1 text-[10px] font-mono bg-amber-500 text-slate-950 font-bold rounded flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" /> Add Study Card
                </button>
              </div>

              <div className="space-y-3">
                {data.cards?.map((c, idx) => (
                  <div key={c.id} className="p-3 border rounded-xl space-y-2 relative border-slate-700/30">
                    <button
                      onClick={() => {
                        const nextCards = data.cards.filter(card => card.id !== c.id);
                        updateSectionPart('cards_grid', { ...data, cards: nextCards });
                      }}
                      className="absolute top-2 right-2 p-1 text-rose-500 hover:text-rose-400"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mr-6">
                      <div>
                        <input
                          type="text"
                          value={c.title}
                          onChange={(e) => {
                            const nextCards = [...data.cards];
                            nextCards[idx].title = e.target.value;
                            updateSectionPart('cards_grid', { ...data, cards: nextCards });
                          }}
                          className="w-full p-1.5 text-xs border rounded font-mono bg-transparent"
                          placeholder="Front Card title"
                        />
                        <CharLimitRecommend current={c.title?.length || 0} recommendedMax={25} />
                      </div>
                      <input
                        type="text"
                        value={c.badge || ''}
                        onChange={(e) => {
                          const nextCards = [...data.cards];
                          nextCards[idx].badge = e.target.value;
                          updateSectionPart('cards_grid', { ...data, cards: nextCards });
                        }}
                        className="p-1.5 text-xs border rounded font-mono bg-transparent h-fit"
                        placeholder="Card badge / category label"
                      />
                    </div>
                    <div>
                      <textarea
                        value={c.backContent}
                        rows={2}
                        onChange={(e) => {
                          const nextCards = [...data.cards];
                          nextCards[idx].backContent = e.target.value;
                          updateSectionPart('cards_grid', { ...data, cards: nextCards });
                        }}
                        className="w-full p-2 text-xs border rounded font-mono bg-transparent"
                        placeholder="Card explanation written on back click..."
                      />
                      <CharLimitRecommend current={c.backContent?.length || 0} recommendedMax={180} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      }
      case 'bento_highlights': {
        const data = section.bento_highlights || { text: '', boxes: [] };
        return (
          <div className="space-y-4">
            <div>
              <label className="text-[11px] font-mono font-bold tracking-wider uppercase text-slate-800 dark:text-zinc-300 block mb-1">Intro Narrative Text</label>
              <textarea
                value={data.text}
                rows={2}
                onChange={(e) => updateSectionPart('bento_highlights', { ...data, text: e.target.value })}
                className="w-full p-2 text-xs border rounded font-mono bg-transparent"
              />
              <CharLimitRecommend current={data.text?.length || 0} recommendedMax={200} />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-800 dark:text-zinc-300">Configure Bento Matrix Blocks</span>
                <button
                  onClick={() => {
                    const newBox: BentoBox = {
                      id: `b_${Date.now()}`,
                      title: "New block title",
                      value: "100%",
                      description: "Brief explanatory block summary",
                      size: "medium",
                      colorPreset: "slate"
                    };
                    updateSectionPart('bento_highlights', { ...data, boxes: [...data.boxes, newBox] });
                  }}
                  className="px-2 py-0.5 text-[10px] font-mono bg-amber-500 text-slate-950 font-bold rounded flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" /> Add Bento block
                </button>
              </div>

              <div className="space-y-3">
                {data.boxes?.map((b, idx) => (
                  <div key={b.id} className="p-3 border rounded-xl space-y-2 border-slate-700/20 relative">
                    <button
                      onClick={() => {
                        const nextBoxes = data.boxes.filter(bx => bx.id !== b.id);
                        updateSectionPart('bento_highlights', { ...data, boxes: nextBoxes });
                      }}
                      className="absolute top-2 right-2 p-1 text-rose-500 hover:text-rose-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mr-6">
                      <div>
                        <input
                          type="text"
                          value={b.title}
                          onChange={(e) => {
                            const nextBoxes = [...data.boxes];
                            nextBoxes[idx].title = e.target.value;
                            updateSectionPart('bento_highlights', { ...data, boxes: nextBoxes });
                          }}
                          className="w-full p-1.5 text-xs border rounded font-mono bg-transparent"
                          placeholder="Block label title"
                        />
                        <CharLimitRecommend current={b.title?.length || 0} recommendedMax={15} />
                      </div>
                      <div>
                        <input
                          type="text"
                          value={b.value || ''}
                          onChange={(e) => {
                            const nextBoxes = [...data.boxes];
                            nextBoxes[idx].value = e.target.value;
                            updateSectionPart('bento_highlights', { ...data, boxes: nextBoxes });
                          }}
                          className="w-full p-1.5 text-xs border rounded font-mono bg-transparent"
                          placeholder="Big stat value (e.g. 98.7% / Active)"
                        />
                        <CharLimitRecommend current={b.value?.length || 0} recommendedMax={10} />
                      </div>
                      <select
                        value={b.size}
                        onChange={(e) => {
                          const nextBoxes = [...data.boxes];
                          nextBoxes[idx].size = e.target.value as any;
                          updateSectionPart('bento_highlights', { ...data, boxes: nextBoxes });
                        }}
                        className="p-1.5 text-xs border border-amber-500/10 rounded font-mono bg-transparent h-fit"
                      >
                        <option value="small">Small size (Col 2)</option>
                        <option value="medium">Medium size (Col 3)</option>
                        <option value="large">Large size (Col 4)</option>
                      </select>
                      <select
                        value={b.colorPreset}
                        onChange={(e) => {
                          const nextBoxes = [...data.boxes];
                          nextBoxes[idx].colorPreset = e.target.value as any;
                          updateSectionPart('bento_highlights', { ...data, boxes: nextBoxes });
                        }}
                        className="p-1.5 text-xs border border-amber-500/10 rounded font-mono bg-transparent h-fit"
                      >
                        <option value="slate">Slate Accent</option>
                        <option value="emerald">Green Accent</option>
                        <option value="amber">Amber Accent</option>
                        <option value="blue">Blue Accent</option>
                        <option value="rose">Rose Accent</option>
                      </select>
                    </div>
                    <div>
                      <textarea
                        value={b.description}
                        rows={1.5}
                        onChange={(e) => {
                          const nextBoxes = [...data.boxes];
                          nextBoxes[idx].description = e.target.value;
                          updateSectionPart('bento_highlights', { ...data, boxes: nextBoxes });
                        }}
                        className="w-full p-2 text-xs border rounded font-mono bg-transparent font-medium"
                        placeholder="Bento block informative details description..."
                      />
                      <CharLimitRecommend current={b.description?.length || 0} recommendedMax={100} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      }

      case 'milestone_timeline': {
        const data = section.milestone_timeline || { text: '', steps: [] };
        return (
          <div className="space-y-4">
            <div>
              <label className="text-[11px] font-mono font-bold tracking-wider uppercase text-slate-800 dark:text-zinc-300 block mb-1">Intro Narrative Text</label>
              <textarea
                value={data.text}
                rows={2}
                onChange={(e) => updateSectionPart('milestone_timeline', { ...data, text: e.target.value })}
                className="w-full p-2 text-xs border rounded font-mono bg-transparent"
              />
              <CharLimitRecommend current={data.text?.length || 0} recommendedMax={200} />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-800 dark:text-zinc-300">Milestones steps Process List</span>
                <button
                  onClick={() => {
                    const nextStep: TimelineStep = {
                      id: `s_${Date.now()}`,
                      stepNumber: `0${data.steps.length + 1}`,
                      title: "New Milestone phase",
                      description: "Brief roadmap roadmap phase explanation description.",
                      badgeText: "Prerequisite"
                    };
                    updateSectionPart('milestone_timeline', { ...data, steps: [...data.steps, nextStep] });
                  }}
                  className="px-2 py-0.5 text-[10px] font-mono bg-amber-500 text-slate-950 font-bold rounded flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" /> Add Timeline Milestone
                </button>
              </div>

              <div className="space-y-3">
                {data.steps?.map((st, idx) => (
                  <div key={st.id} className="p-3 border rounded-xl space-y-2 border-slate-700/20 relative">
                    <button
                      onClick={() => {
                        const nextSteps = data.steps.filter(item => item.id !== st.id);
                        updateSectionPart('milestone_timeline', { ...data, steps: nextSteps });
                      }}
                      className="absolute top-2 right-2 p-1 text-rose-500 hover:text-rose-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mr-6">
                      <input
                        type="text"
                        value={st.stepNumber}
                        onChange={(e) => {
                          const nextSteps = [...data.steps];
                          nextSteps[idx].stepNumber = e.target.value;
                          updateSectionPart('milestone_timeline', { ...data, steps: nextSteps });
                        }}
                        className="p-1.5 text-xs border rounded font-mono bg-transparent w-20 h-fit"
                        placeholder="e.g. 01"
                      />
                      <div>
                        <input
                          type="text"
                          value={st.title}
                          onChange={(e) => {
                            const nextSteps = [...data.steps];
                            nextSteps[idx].title = e.target.value;
                            updateSectionPart('milestone_timeline', { ...data, steps: nextSteps });
                          }}
                          className="w-full p-1.5 text-xs border rounded font-mono bg-transparent"
                          placeholder="Timeline Step heading"
                        />
                        <CharLimitRecommend current={st.title?.length || 0} recommendedMax={30} />
                      </div>
                      <div>
                        <input
                          type="text"
                          value={st.badgeText || ''}
                          onChange={(e) => {
                            const nextSteps = [...data.steps];
                            nextSteps[idx].badgeText = e.target.value;
                            updateSectionPart('milestone_timeline', { ...data, steps: nextSteps });
                          }}
                          className="w-full p-1.5 text-xs border rounded font-mono bg-transparent"
                          placeholder="Alert status badge"
                        />
                        <CharLimitRecommend current={st.badgeText?.length || 0} recommendedMax={12} />
                      </div>
                    </div>
                    <div>
                      <textarea
                        value={st.description}
                        rows={1.5}
                        onChange={(e) => {
                          const nextSteps = [...data.steps];
                          nextSteps[idx].description = e.target.value;
                          updateSectionPart('milestone_timeline', { ...data, steps: nextSteps });
                        }}
                        className="w-full p-2 text-xs border rounded font-mono bg-transparent"
                        placeholder="Step chronological brief description narrative..."
                      />
                      <CharLimitRecommend current={st.description?.length || 0} recommendedMax={120} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      }

      case 'code_quote_spotlight': {
        const data = section.code_quote_spotlight || { spotlightText: '', captionTitle: '', languageOrAuthor: '', mainText: '', isCode: true };
        return (
          <div className="space-y-3.5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-mono font-bold tracking-wider uppercase text-slate-800 dark:text-zinc-300 block mb-1">Interactive Side Explanation Text</label>
                <textarea
                  value={data.mainText}
                  rows={4}
                  onChange={(e) => updateSectionPart('code_quote_spotlight', { ...data, mainText: e.target.value })}
                  className="w-full p-2 text-xs border rounded font-mono bg-transparent"
                  placeholder="Primary explanatory column content..."
                />
              </div>
              <div className="space-y-2.5">
                <div>
                  <label className="text-[11px] font-mono font-bold tracking-wider uppercase text-slate-800 dark:text-zinc-300 block mb-1">Spotlight Box Title / Author</label>
                  <input
                    type="text"
                    value={data.captionTitle}
                    onChange={(e) => updateSectionPart('code_quote_spotlight', { ...data, captionTitle: e.target.value })}
                    className="w-full p-2 text-xs border rounded font-mono bg-transparent"
                    placeholder="e.g. production_schema.json"
                  />
                </div>
                <div className="flex gap-4 items-center">
                  <div className="flex-grow">
                    <label className="text-[11px] font-mono font-bold tracking-wider uppercase text-slate-800 dark:text-zinc-300 block">Syntax / Block Quote Category</label>
                    <input
                      type="text"
                      value={data.languageOrAuthor}
                      onChange={(e) => updateSectionPart('code_quote_spotlight', { ...data, languageOrAuthor: e.target.value })}
                      className="w-full p-1.5 text-xs border rounded font-mono bg-transparent"
                      placeholder="e.g. json / typescript / Marcus Aurelius"
                    />
                  </div>
                  <div className="pt-2">
                    <label className="text-[10px] uppercase font-mono tracking-widest text-slate-700 dark:text-zinc-200 font-bold block mb-1">Model Content style</label>
                    <div className="flex bg-slate-900 rounded border border-slate-700 overflow-hidden">
                      <button
                        onClick={() => updateSectionPart('code_quote_spotlight', { ...data, isCode: true })}
                        className={`px-2 py-1 text-[10px] font-mono font-bold ${data.isCode ? 'bg-amber-500 text-slate-900' : 'text-slate-400'}`}
                      >
                        Code
                      </button>
                      <button
                        onClick={() => updateSectionPart('code_quote_spotlight', { ...data, isCode: false })}
                        className={`px-2 py-1 text-[10px] font-mono font-bold ${!data.isCode ? 'bg-amber-500 text-slate-900' : 'text-slate-400'}`}
                      >
                        Quote
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label className="text-[11px] font-mono font-bold tracking-wider uppercase text-slate-800 dark:text-zinc-300 block mb-1">Spotlight Box Display Content (Code Syntax or quote string block)</label>
              <textarea
                value={data.spotlightText}
                rows={5}
                onChange={(e) => updateSectionPart('code_quote_spotlight', { ...data, spotlightText: e.target.value })}
                className="w-full p-2 text-xs code-font border rounded bg-slate-950 text-slate-200 outline-none"
                placeholder="Code schema strings or inspirational paragraphs here..."
              />
            </div>
          </div>
        );
      }

      case 'multi_tab_dive': {
        const data = section.multi_tab_dive || { text: '', tabs: [] };
        return (
          <div className="space-y-4">
            <div>
              <label className="text-[11px] font-mono font-bold tracking-wider uppercase text-slate-800 dark:text-zinc-300 block mb-1">Intro Narrative Text</label>
              <textarea
                value={data.text}
                rows={2}
                onChange={(e) => updateSectionPart('multi_tab_dive', { ...data, text: e.target.value })}
                className="w-full p-2 text-xs border rounded font-mono bg-transparent"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-800 dark:text-zinc-300">Interactive tab deep dive list</span>
                <button
                  onClick={() => {
                    const newTab: TabItem = {
                      id: `t_${Date.now()}`,
                      label: "Pill Label",
                      title: "Extended Title Header",
                      content: "Complete explanatory notes which render when users toggle this tab category element.",
                      sublist: ["Attribute bullet A", "Attribute bullet B"]
                    };
                    updateSectionPart('multi_tab_dive', { ...data, tabs: [...data.tabs, newTab] });
                  }}
                  className="px-2 py-0.5 text-[10px] font-mono bg-amber-500 text-slate-950 font-bold rounded flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" /> Add Tab item
                </button>
              </div>

              <div className="space-y-3">
                {data.tabs?.map((tb, idx) => (
                  <div key={tb.id} className="p-3 border rounded-xl space-y-2 border-slate-700/20 relative">
                    <button
                      onClick={() => {
                        const nextTabs = data.tabs.filter(tab => tab.id !== tb.id);
                        updateSectionPart('multi_tab_dive', { ...data, tabs: nextTabs });
                      }}
                      className="absolute top-2 right-2 p-1 text-rose-500 hover:text-rose-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mr-6">
                      <input
                        type="text"
                        value={tb.label}
                        onChange={(e) => {
                          const nextTabs = [...data.tabs];
                          nextTabs[idx].label = e.target.value;
                          updateSectionPart('multi_tab_dive', { ...data, tabs: nextTabs });
                        }}
                        className="p-1.5 text-xs border rounded font-mono bg-transparent"
                        placeholder="Button Pill brief Label (e.g. Overview)"
                      />
                      <input
                        type="text"
                        value={tb.title}
                        onChange={(e) => {
                          const nextTabs = [...data.tabs];
                          nextTabs[idx].title = e.target.value;
                          updateSectionPart('multi_tab_dive', { ...data, tabs: nextTabs });
                        }}
                        className="p-1.5 text-xs border rounded font-mono bg-transparent"
                        placeholder="Category header title"
                      />
                    </div>
                    <textarea
                      value={tb.content}
                      rows={2.5}
                      onChange={(e) => {
                        const nextTabs = [...data.tabs];
                        nextTabs[idx].content = e.target.value;
                        updateSectionPart('multi_tab_dive', { ...data, tabs: nextTabs });
                      }}
                      className="w-full p-2 text-xs border rounded font-mono bg-transparent"
                      placeholder="Toggle panel detailed content narrative explanation..."
                    />
                    <div>
                      <label className="text-[10px] uppercase font-mono text-slate-800 dark:text-zinc-200 font-bold block mb-0.5">Attributes / Highlights comma-separated list:</label>
                      <input
                        type="text"
                        value={tb.sublist?.join(', ') || ''}
                        onChange={(e) => {
                          const nextTabs = [...data.tabs];
                          nextTabs[idx].sublist = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
                          updateSectionPart('multi_tab_dive', { ...data, tabs: nextTabs });
                        }}
                        className="w-full p-1 text-xs border rounded font-mono bg-transparent"
                        placeholder="e.g. Attribute Alpha, Attribute Beta, Parameter Gamma"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      }

      case 'qa_accordion': {
        const data = section.qa_accordion || { text: '', items: [] };
        return (
          <div className="space-y-4">
            <div>
              <label className="text-[11px] font-mono font-bold tracking-wider uppercase text-slate-800 dark:text-zinc-300 block mb-1">Intro Narrative Text</label>
              <textarea
                value={data.text}
                rows={2}
                onChange={(e) => updateSectionPart('qa_accordion', { ...data, text: e.target.value })}
                className="w-full p-2 text-xs border rounded font-mono bg-transparent"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-800 dark:text-zinc-300">F.A.Q Accordion triggers list</span>
                <button
                  onClick={() => {
                    const nextItem: AccordionItem = {
                      id: `a_${Date.now()}`,
                      trigger: "Write your frequently asked question issue query here?",
                      content: "Describe the comprehensive instructional response, guidelines, or troubleshooting detail which reveals on expand."
                    };
                    updateSectionPart('qa_accordion', { ...data, items: [...data.items, nextItem] });
                  }}
                  className="px-2 py-0.5 text-[10px] font-mono bg-amber-500 text-slate-950 font-bold rounded flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" /> Add FAQ Item
                </button>
              </div>

              <div className="space-y-3">
                {data.items?.map((it, idx) => (
                  <div key={it.id} className="p-3 border rounded-xl space-y-2 border-slate-700/20 relative">
                    <button
                      onClick={() => {
                        const nextItems = data.items.filter(item => item.id !== it.id);
                        updateSectionPart('qa_accordion', { ...data, items: nextItems });
                      }}
                      className="absolute top-2 right-2 p-1 text-rose-500 hover:text-rose-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <input
                      type="text"
                      value={it.trigger}
                      onChange={(e) => {
                        const nextItems = [...data.items];
                        nextItems[idx].trigger = e.target.value;
                        updateSectionPart('qa_accordion', { ...data, items: nextItems });
                      }}
                      className="w-full p-1.5 text-xs border rounded font-mono bg-transparent pr-6"
                      placeholder="Trigger query heading (e.g. How does SCORM communicate?)"
                    />
                    <textarea
                      value={it.content}
                      rows={2}
                      onChange={(e) => {
                        const nextItems = [...data.items];
                        nextItems[idx].content = e.target.value;
                        updateSectionPart('qa_accordion', { ...data, items: nextItems });
                      }}
                      className="w-full p-2 text-xs border rounded font-mono bg-transparent"
                      placeholder="Accordion expand detail explanation text..."
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      }

      default:
        return <p>Select layout style to customize section content fields...</p>;
    }
  };

  return (
    <>
    <div className="space-y-6">

      {/* SECTION ACCENT COLOR SELECTOR */}
      <div className="space-y-2">
        <label className="text-[11px] font-mono font-extrabold uppercase tracking-wider block text-slate-800 dark:text-zinc-300">
          Section Accent Color Visual Indicator:
        </label>
        <div className="flex flex-wrap gap-2">
          {[
            { name: 'Navy Blue', value: '#002F6C', bg: 'bg-[#002F6C]' },
            { name: 'Turquoise', value: '#4FC4D4', bg: 'bg-[#4FC4D4]' },
            { name: 'Amber Gold', value: '#DD8A03', bg: 'bg-[#DD8A03]' },
            { name: 'Emerald', value: '#10B981', bg: 'bg-[#10B981]' },
            { name: 'Teal Aqua', value: '#14B8A6', bg: 'bg-[#14B8A6]' },
            { name: 'Royal Blue', value: '#3B82F6', bg: 'bg-[#3B82F6]' },
            { name: 'Indigo Night', value: '#6366F1', bg: 'bg-[#6366F1]' },
            { name: 'Plum Purple', value: '#A855F7', bg: 'bg-[#A855F7]' },
            { name: 'Crimson Rose', value: '#F43F5E', bg: 'bg-[#F43F5E]' },
            { name: 'Carbon Charcoal', value: '#2F3638', bg: 'bg-[#2F3638]' },
          ].map((color) => {
            const isSelected = section.accentColor === color.value || (!section.accentColor && color.value === '#002F6C');
            return (
              <button
                key={color.value}
                type="button"
                onClick={() => updateSectionPart('accentColor', color.value)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[10px] font-mono font-bold transition-all cursor-pointer ${
                  isSelected
                    ? `text-white ${color.bg} border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]`
                    : (isDark ? 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50')
                }`}
              >
                <span className={`w-2.5 h-2.5 rounded-full ${isSelected ? 'bg-white' : color.bg} border border-black/10`} />
                <span>{color.name}</span>
              </button>
            );
          })}
        </div>
        <p className="text-[9px] font-mono text-slate-700 dark:text-zinc-300 mt-1 leading-relaxed">
          The selected accent color will highlight the left border of this section's outline card inside the simulator player layout outline.
        </p>
      </div>
      
      {/* 8 SCREEN LAYOUT SELECTOR OPTIONS */}
      <div className="space-y-2">
        <label className="text-[11px] font-mono font-extrabold uppercase tracking-wider block text-slate-800 dark:text-zinc-300">
          Step Layout Selector (Choose 1 of 8 customized interactive styles):
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
          
          <button
            onClick={() => handleLayoutSelectorChange('text_video')}
            className={`p-2.5 border font-mono text-[10px] tracking-tight uppercase text-center flex flex-col items-center justify-center gap-1.5 transition-all select-none ${
              section.layoutType === 'text_video'
                ? 'bg-[#2563eb] text-white border-black font-extrabold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] translate-x-[-1px] translate-y-[-1px]'
                : (isDark ? 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700' : 'bg-white border-black text-neutral-800 hover:bg-neutral-50 shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]')
            }`}
          >
            <Video className="w-4 h-4" />
            <span>Narrative Video</span>
          </button>

          <button
            onClick={() => handleLayoutSelectorChange('text_table')}
            className={`p-2.5 border font-mono text-[10px] tracking-tight uppercase text-center flex flex-col items-center justify-center gap-1.5 transition-all select-none ${
              section.layoutType === 'text_table'
                ? 'bg-[#2563eb] text-white border-black font-extrabold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] translate-x-[-1px] translate-y-[-1px]'
                : (isDark ? 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700' : 'bg-white border-black text-neutral-800 hover:bg-neutral-50 shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]')
            }`}
          >
            <Table className="w-4 h-4" />
            <span>Compare Table</span>
          </button>

          <button
            onClick={() => handleLayoutSelectorChange('cards_grid')}
            className={`p-2.5 border font-mono text-[10px] tracking-tight uppercase text-center flex flex-col items-center justify-center gap-1.5 transition-all select-none ${
              section.layoutType === 'cards_grid'
                ? 'bg-[#2563eb] text-white border-black font-extrabold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] translate-x-[-1px] translate-y-[-1px]'
                : (isDark ? 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700' : 'bg-white border-black text-neutral-800 hover:bg-neutral-50 shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]')
            }`}
          >
            <Grid className="w-4 h-4" />
            <span>Interactive Cards</span>
          </button>

          <button
            onClick={() => handleLayoutSelectorChange('bento_highlights')}
            className={`p-2.5 border font-mono text-[10px] tracking-tight uppercase text-center flex flex-col items-center justify-center gap-1.5 transition-all select-none ${
              section.layoutType === 'bento_highlights'
                ? 'bg-[#2563eb] text-white border-black font-extrabold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] translate-x-[-1px] translate-y-[-1px]'
                : (isDark ? 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700' : 'bg-white border-black text-neutral-800 hover:bg-neutral-50 shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]')
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
            <span>Bento Highs</span>
          </button>

          <button
            onClick={() => handleLayoutSelectorChange('milestone_timeline')}
            className={`p-2.5 border font-mono text-[10px] tracking-tight uppercase text-center flex flex-col items-center justify-center gap-1.5 transition-all select-none ${
              section.layoutType === 'milestone_timeline'
                ? 'bg-[#2563eb] text-white border-black font-extrabold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] translate-x-[-1px] translate-y-[-1px]'
                : (isDark ? 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700' : 'bg-white border-black text-neutral-800 hover:bg-neutral-50 shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]')
            }`}
          >
            <GitCommit className="w-4 h-4" />
            <span>Chronology</span>
          </button>

          <button
            onClick={() => handleLayoutSelectorChange('code_quote_spotlight')}
            className={`p-2.5 border font-mono text-[10px] tracking-tight uppercase text-center flex flex-col items-center justify-center gap-1.5 transition-all select-none ${
              section.layoutType === 'code_quote_spotlight'
                ? 'bg-[#2563eb] text-white border-black font-extrabold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] translate-x-[-1px] translate-y-[-1px]'
                : (isDark ? 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700' : 'bg-white border-black text-neutral-800 hover:bg-neutral-50 shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]')
            }`}
          >
            <Code className="w-4 h-4" />
            <span>Spotlight Console</span>
          </button>

          <button
            onClick={() => handleLayoutSelectorChange('multi_tab_dive')}
            className={`p-2.5 border font-mono text-[10px] tracking-tight uppercase text-center flex flex-col items-center justify-center gap-1.5 transition-all select-none ${
              section.layoutType === 'multi_tab_dive'
                ? 'bg-[#2563eb] text-white border-black font-extrabold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] translate-x-[-1px] translate-y-[-1px]'
                : (isDark ? 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700' : 'bg-white border-black text-neutral-800 hover:bg-neutral-50 shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]')
            }`}
          >
            <FolderLock className="w-4 h-4" />
            <span>Category Tabs</span>
          </button>

          <button
            onClick={() => handleLayoutSelectorChange('qa_accordion')}
            className={`p-2.5 border font-mono text-[10px] tracking-tight uppercase text-center flex flex-col items-center justify-center gap-1.5 transition-all select-none ${
              section.layoutType === 'qa_accordion'
                ? 'bg-[#2563eb] text-white border-black font-extrabold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] translate-x-[-1px] translate-y-[-1px]'
                : (isDark ? 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700' : 'bg-white border-black text-neutral-800 hover:bg-neutral-50 shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]')
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>QA Accordion</span>
          </button>

        </div>
      </div>

      {/* ACTIVE CHOSEN LAYOUT CUSTOM FIELDS PANEL */}
      <div className={`p-5 border-2 ${
        isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-neutral-50/50 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,0.15)]'
      }`}>
        <span className="text-[9px] font-mono uppercase bg-blue-600/10 text-blue-600 border border-blue-600/20 px-2 py-0.5 rounded block w-max mb-3.5 tracking-wider font-extrabold">
          Active layout Attributes config
        </span>
        {renderSelectedLayoutEditor()}
      </div>

      {/* COMPONENT TOGGLES CONFIGURATION PANEL */}
      <div className={`p-5 border-2 ${
        isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'
      } grid grid-cols-1 sm:grid-cols-2 gap-4`}>
        <label className={`flex items-start gap-3 cursor-pointer select-none p-3 border border-dashed rounded transition-colors ${
          isDark ? 'hover:bg-zinc-800/40 border-zinc-700' : 'hover:bg-neutral-50/50 border-black/20'
        }`}>
          <input
            type="checkbox"
            checked={section.includeQuestions !== false}
            onChange={(e) => updateSectionPart('includeQuestions', e.target.checked)}
            className="w-4 h-4 accent-blue-600 border-2 mt-0.5 cursor-pointer"
            aria-label="Include Interactive Q&A Assessment"
          />
          <div className="text-xs">
            <strong className="block uppercase tracking-wider text-neutral-800 dark:text-zinc-200">Include Assessment Challenge</strong>
            <span className="text-slate-700 dark:text-zinc-300 text-[10px] block font-mono mt-0.5">Toggle to set up quiz assessments at the footer of this section.</span>
          </div>
        </label>

        <label className={`flex items-start gap-3 cursor-pointer select-none p-3 border border-dashed rounded transition-colors ${
          isDark ? 'hover:bg-zinc-800/40 border-zinc-700' : 'hover:bg-neutral-50/50 border-black/20'
        }`}>
          <input
            type="checkbox"
            checked={section.includeFlashcards !== false}
            onChange={(e) => updateSectionPart('includeFlashcards', e.target.checked)}
            className="w-4 h-4 accent-blue-600 border-2 mt-0.5 cursor-pointer"
            aria-label="Include Flippable Study Flashcards"
          />
          <div className="text-xs">
            <strong className="block uppercase tracking-wider text-neutral-800 dark:text-zinc-200">Include Study Flashcards</strong>
            <span className="text-slate-700 dark:text-zinc-300 text-[10px] block font-mono mt-0.5">Toggle to set up flippable memory booster flashcards.</span>
          </div>
        </label>
      </div>

      {/* QUIZZES EDITOR ACCENT */}
      {section.includeQuestions !== false && (
        <div className={`p-5 border-2 ${
          isDark ? 'bg-zinc-900/60 border-zinc-800' : 'bg-white border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'
        } space-y-4`}>
          <div className="flex justify-between items-center">
            <span className="text-xs font-mono font-extrabold uppercase tracking-wider block text-blue-600 dark:text-blue-400 flex items-center gap-1.5">
              <BrainCircuit className="w-4 h-4" />
              <span>Knowledge assessments ({section.questions?.length || 0})</span>
            </span>
            <button
              onClick={() => {
                const newQuestion: QuizQuestion = {
                  id: `q_${Date.now()}`,
                  questionText: "Which technical action characterizes large language models?",
                  options: ["Correct statement option", "Second dummy statement option", "Third wrong alternative", "Forth wrong assessment parameter"],
                  correctOptionIndex: 0,
                  explanation: "Detailed analytical explanation displayed for the student highlighting why option A is correct."
                };
                updateSectionPart('questions', [...(section.questions || []), newQuestion]);
              }}
              className="px-3 py-1 text-[11px] uppercase tracking-tight font-extrabold bg-black text-white hover:bg-neutral-800 border border-black rounded-none flex items-center gap-1.5 shadow-[2px_2px_0px_0px_rgba(37,99,235,1)] hover:shadow-none hover:translate-x-[1px] hover:translate-y-[1px] cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" /> Add Question
            </button>
          </div>

          <div className="space-y-4">
            {section.questions?.map((q, idx) => (
              <div key={q.id} className={`p-4 border border-dashed ${isDark ? 'border-zinc-800 bg-zinc-950' : 'border-black/30 bg-[#F9F8F6]'} relative space-y-3`}>
                <button
                  onClick={() => {
                    const nextQ = section.questions.filter(item => item.id !== q.id);
                    updateSectionPart('questions', nextQ);
                  }}
                  className="absolute top-3 right-3 p-1 text-rose-500 hover:text-rose-400"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <div>
                  <label className="text-[9px] font-mono uppercase text-slate-800 dark:text-zinc-300 font-bold block mb-0.5">Question string block:</label>
                  <input
                    type="text"
                    value={q.questionText}
                    onChange={(e) => {
                      const nextQ = [...section.questions];
                      nextQ[idx].questionText = e.target.value;
                      updateSectionPart('questions', nextQ);
                    }}
                    className={`w-full p-2 text-xs border outline-none font-mono bg-white text-black ${isDark ? 'border-zinc-800 text-white bg-zinc-900' : 'border-black'}`}
                    placeholder="e.g. What is the fundamental priority of responsive grids?"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] font-mono uppercase text-slate-800 dark:text-zinc-300 font-bold">Answer options (radio = correct):</span>
                    {(q.options?.length || 0) < 6 && (
                      <button
                        type="button"
                        onClick={() => {
                          const nextQ = [...section.questions];
                          nextQ[idx].options = [...nextQ[idx].options, `Option ${nextQ[idx].options.length + 1}`];
                          updateSectionPart('questions', nextQ);
                        }}
                        className="px-2 py-0.5 text-[9px] font-mono uppercase font-bold border border-dashed rounded flex items-center gap-1 text-blue-600 border-blue-400/40 hover:bg-blue-50 dark:hover:bg-blue-900/20 cursor-pointer"
                      >
                        <Plus className="w-2.5 h-2.5" /> Add option
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {q.options?.map((opt, oIdx) => (
                      <div key={oIdx} className="flex gap-1.5 items-center">
                        <input
                          type="radio"
                          name={`q_correct_${q.id}`}
                          checked={q.correctOptionIndex === oIdx}
                          onChange={() => {
                            const nextQ = [...section.questions];
                            nextQ[idx].correctOptionIndex = oIdx;
                            updateSectionPart('questions', nextQ);
                          }}
                          className="cursor-pointer text-blue-600 focus:ring-blue-600 flex-shrink-0"
                        />
                        <input
                          type="text"
                          value={opt}
                          onChange={(e) => {
                            const nextQ = [...section.questions];
                            nextQ[idx].options[oIdx] = e.target.value;
                            updateSectionPart('questions', nextQ);
                          }}
                          className={`p-1.5 text-xs border outline-none font-mono bg-white text-black flex-grow ${isDark ? 'border-zinc-800 text-white bg-zinc-900' : 'border-black'}`}
                          placeholder={`Option ${oIdx + 1}`}
                        />
                        {(q.options?.length || 0) > 2 && (
                          <button
                            type="button"
                            onClick={() => {
                              const nextQ = [...section.questions];
                              nextQ[idx].options = nextQ[idx].options.filter((_, i) => i !== oIdx);
                              if (nextQ[idx].correctOptionIndex >= nextQ[idx].options.length) {
                                nextQ[idx].correctOptionIndex = 0;
                              }
                              updateSectionPart('questions', nextQ);
                            }}
                            className="p-0.5 text-rose-400 hover:text-rose-600 flex-shrink-0 cursor-pointer"
                            title="Remove this option"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-[9px] font-mono uppercase text-slate-800 dark:text-zinc-300 font-bold block mb-0.5">Correct Answer Feedback reveals (Markdown/General text):</label>
                  <input
                    type="text"
                    value={q.explanation}
                    onChange={(e) => {
                      const nextQ = [...section.questions];
                      nextQ[idx].explanation = e.target.value;
                      updateSectionPart('questions', nextQ);
                    }}
                    className={`w-full p-2 text-xs border outline-none font-mono bg-white text-black ${isDark ? 'border-zinc-800 text-white bg-zinc-900' : 'border-black'}`}
                    placeholder="e.g. Yes! CSS grids automatically scale columns to adapt based on viewport size parameters."
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* FLASH CARDS INTEGRATED WRAP */}
      {section.includeFlashcards !== false && (
        <div className={`p-5 border-2 ${
          isDark ? 'bg-zinc-900/60 border-zinc-800' : 'bg-white border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'
        } space-y-4`}>
          <div className="flex justify-between items-center border-slate-800/10 pb-1">
            <span className="text-xs font-mono font-extrabold uppercase tracking-wider block text-blue-600 dark:text-blue-400 flex items-center gap-1.5">
              <MessageSquare className="w-4 h-4" />
              <span>Flippable knowledge study cards ({section.flashcards?.length || 0})</span>
            </span>
            <button
              onClick={() => {
                const newFc: CourseFlashcard = {
                  id: `fc_${Date.now()}`,
                  front: "Prompt: What is the primary role of SCORM?",
                  back: "Response: SCORM sets communication properties so courses natively read/write score parameters to modern LMS endpoints."
                };
                updateSectionPart('flashcards', [...(section.flashcards || []), newFc]);
              }}
              className="px-3 py-1 text-[11px] uppercase tracking-tight font-extrabold bg-black text-white hover:bg-neutral-800 border border-black rounded-none flex items-center gap-1.5 shadow-[2px_2px_0px_0px_rgba(37,99,235,1)] hover:shadow-none hover:translate-x-[1px] hover:translate-y-[1px] cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" /> Add Study card
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {section.flashcards?.map((fc, idx) => (
              <div key={fc.id} className={`p-4 border border-dashed ${isDark ? 'border-zinc-800 bg-zinc-950' : 'border-black/30 bg-[#F9F8F6]'} relative space-y-2`}>
                <button
                  onClick={() => {
                    const nextFc = section.flashcards.filter(item => item.id !== fc.id);
                    updateSectionPart('flashcards', nextFc);
                  }}
                  className="absolute top-2 right-2 p-1 text-rose-500 hover:text-rose-400"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <div>
                  <label className="text-[8px] font-mono uppercase text-slate-800 dark:text-zinc-300 font-bold block mb-0.5">Card Front Question / Prompt Title:</label>
                  <input
                    type="text"
                    value={fc.front}
                    onChange={(e) => {
                      const nextFc = [...section.flashcards];
                      nextFc[idx].front = e.target.value;
                      updateSectionPart('flashcards', nextFc);
                    }}
                    className={`w-full p-1.5 text-xs border outline-none font-mono bg-white text-black pr-6 ${isDark ? 'border-zinc-800 text-white bg-zinc-900' : 'border-black'}`}
                    placeholder="Front title..."
                  />
                </div>
                <div>
                  <label className="text-[8px] font-mono uppercase text-slate-800 dark:text-zinc-300 font-bold block mb-0.5">Card Back Answer Explanation Reveal:</label>
                  <textarea
                    value={fc.back}
                    rows={2}
                    onChange={(e) => {
                      const nextFc = [...section.flashcards];
                      nextFc[idx].back = e.target.value;
                      updateSectionPart('flashcards', nextFc);
                    }}
                    className={`w-full p-1.5 text-xs border outline-none font-mono bg-white text-black ${isDark ? 'border-zinc-800 text-white bg-zinc-900' : 'border-black'}`}
                    placeholder="Back content details..."
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>

      {/* SECTION NARRATION PANEL */}
      <div className={`p-5 border-2 ${isDark ? 'bg-zinc-900/60 border-zinc-800' : 'bg-white border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'} space-y-4`}>
        <div className="flex justify-between items-center">
          <span className="text-xs font-mono font-extrabold uppercase tracking-wider text-blue-600 dark:text-blue-400 flex items-center gap-1.5">
            <Volume2 className="w-4 h-4" />
            <span>Section Narration Audio</span>
          </span>
          {section.narration && (
            <button
              onClick={() => updateSectionPart('narration', undefined)}
              className="flex items-center gap-1 px-2.5 py-1 text-[10px] font-mono font-bold text-rose-500 hover:text-rose-400 border border-rose-500/30 rounded-lg hover:bg-rose-500/5 transition-all"
            >
              <X className="w-3 h-3" /> Remove
            </button>
          )}
        </div>

        {!section.narration ? (
          <div className="space-y-3">
            {/* Tab switcher */}
            <div className="flex border border-slate-300 dark:border-zinc-700 rounded-xl overflow-hidden w-max">
              <button
                type="button"
                onClick={() => setNarrationTab('upload')}
                className={`px-3 py-1.5 text-[10px] font-mono font-bold uppercase flex items-center gap-1.5 transition-colors ${
                  narrationTab === 'upload'
                    ? 'bg-[#002F6C] text-white'
                    : (isDark ? 'bg-zinc-900 text-zinc-300 hover:bg-zinc-800' : 'bg-white text-slate-700 hover:bg-slate-50')
                }`}
              >
                <Upload className="w-3 h-3" /> Upload File
              </button>
              <button
                type="button"
                onClick={() => setNarrationTab('url')}
                className={`px-3 py-1.5 text-[10px] font-mono font-bold uppercase flex items-center gap-1.5 transition-colors ${
                  narrationTab === 'url'
                    ? 'bg-[#002F6C] text-white'
                    : (isDark ? 'bg-zinc-900 text-zinc-300 hover:bg-zinc-800' : 'bg-white text-slate-700 hover:bg-slate-50')
                }`}
              >
                <Link className="w-3 h-3" /> External URL
              </button>
            </div>

            {narrationTab === 'upload' ? (
              <div className="space-y-2">
                <p className={`text-[10px] font-mono leading-relaxed ${isDark ? 'text-zinc-300' : 'text-slate-700'}`}>
                  Upload an MP3, WAV, or OGG file. It will be embedded in the exported HTML as a self-contained data URL.
                  <span className="text-amber-600 dark:text-amber-400 font-bold"> Large files increase export size.</span>
                </p>
                <button
                  type="button"
                  onClick={() => audioFileInputRef.current?.click()}
                  className={`flex items-center gap-2 px-4 py-2.5 border-2 border-dashed rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                    isDark ? 'border-zinc-700 text-zinc-300 hover:border-blue-500 hover:text-blue-400' : 'border-slate-300 text-slate-700 hover:border-blue-500 hover:text-blue-600'
                  }`}
                >
                  <Upload className="w-4 h-4" />
                  Click to select audio file…
                </button>
                <input
                  ref={audioFileInputRef}
                  type="file"
                  accept="audio/mp3,audio/mpeg,audio/wav,audio/ogg,audio/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const fileSizeKb = Math.round(file.size / 1024);
                    const reader = new FileReader();
                    reader.onload = (ev) => {
                      const dataUrl = ev.target?.result as string;
                      updateSectionPart('narration', {
                        audioDataUrl: dataUrl,
                        autoPlay: false,
                        label: file.name.replace(/\.[^/.]+$/, ''),
                        fileSizeKb
                      } satisfies SectionNarration);
                    };
                    reader.readAsDataURL(file);
                    e.target.value = '';
                  }}
                />
              </div>
            ) : (
              <div className="space-y-2">
                <p className={`text-[10px] font-mono leading-relaxed ${isDark ? 'text-zinc-300' : 'text-slate-700'}`}>
                  Link to a hosted audio file. The exported HTML will stream it from the URL — students need internet access.
                </p>
                <input
                  type="url"
                  placeholder="https://example.com/narration.mp3"
                  className={`w-full p-2 text-xs font-mono border rounded outline-none bg-transparent ${isDark ? 'border-zinc-700 text-white' : 'border-slate-300 text-slate-900'}`}
                  onBlur={(e) => {
                    if (e.target.value.trim()) {
                      updateSectionPart('narration', {
                        audioExternalUrl: e.target.value.trim(),
                        autoPlay: false,
                        label: 'Section Narration',
                      } satisfies SectionNarration);
                    }
                  }}
                />
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {/* Live preview player */}
            <div className={`p-3 rounded-xl border ${isDark ? 'bg-zinc-950 border-zinc-800' : 'bg-slate-50 border-slate-200'}`}>
              <p className={`text-[9px] font-mono uppercase tracking-wider mb-2 ${isDark ? 'text-zinc-300' : 'text-slate-700'} font-bold`}>
                Preview
                {section.narration.fileSizeKb && (
                  <span className={`ml-2 ${section.narration.fileSizeKb > 5000 ? 'text-amber-500' : 'text-emerald-500'}`}>
                    ({section.narration.fileSizeKb > 1024
                      ? `${(section.narration.fileSizeKb / 1024).toFixed(1)} MB`
                      : `${section.narration.fileSizeKb} KB`})
                    {section.narration.fileSizeKb > 5000 && ' — large file'}
                  </span>
                )}
              </p>
              <audio
                controls
                src={section.narration.audioDataUrl || section.narration.audioExternalUrl}
                className="w-full h-9"
              />
            </div>

            {/* Label */}
            <div>
              <label className="text-[10px] uppercase font-mono font-bold tracking-wider text-slate-800 dark:text-zinc-300 block mb-1">
                Player Label (shown to students):
              </label>
              <input
                type="text"
                value={section.narration.label || ''}
                onChange={(e) => updateSectionPart('narration', { ...section.narration, label: e.target.value })}
                className={`w-full p-2 text-xs font-mono border rounded outline-none bg-transparent ${isDark ? 'border-zinc-700 text-white' : 'border-slate-300 text-slate-900'}`}
                placeholder="e.g. Section Introduction"
              />
            </div>

            {/* Auto-play toggle */}
            <label className={`flex items-start gap-3 cursor-pointer select-none p-3 border border-dashed rounded transition-colors ${
              isDark ? 'hover:bg-zinc-800/40 border-zinc-700' : 'hover:bg-neutral-50/50 border-black/20'
            }`}>
              <input
                type="checkbox"
                checked={section.narration.autoPlay ?? false}
                onChange={(e) => updateSectionPart('narration', { ...section.narration, autoPlay: e.target.checked })}
                className="w-4 h-4 accent-blue-600 border-2 mt-0.5 cursor-pointer"
              />
              <div className="text-xs">
                <strong className="block uppercase tracking-wider text-neutral-800 dark:text-zinc-200">Auto-play when section loads</strong>
                <span className="text-slate-700 dark:text-zinc-300 text-[10px] block font-mono mt-0.5">
                  Narration will begin automatically when the student navigates to this section.
                </span>
              </div>
            </label>
          </div>
        )}
      </div>

      {/* LAYOUT CHANGE WARNING MODAL */}
      {pendingLayout && (
        <div className="fixed inset-0 bg-[#262626]/80 backdrop-blur-xs flex items-center justify-center z-[999] p-4">
          <div className={`max-w-md w-full p-6 rounded-2xl border shadow-2xl space-y-5 ${
            isDark ? 'bg-[#2F3638] border-zinc-700 text-[#EFEFE8]' : 'bg-white border-slate-300 text-[#2F3638]'
          }`}>
            <div className="flex gap-3 items-start">
              <div className="w-10 h-10 rounded-full bg-amber-500/15 text-amber-500 flex items-center justify-center mt-0.5 flex-shrink-0 text-lg">⚠</div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold uppercase tracking-tight text-[#002F6C] dark:text-[#4FC4D4]">Change Section Layout?</h4>
                <p className="text-xs text-slate-700 dark:text-zinc-300 font-mono leading-relaxed">
                  Switching to <strong className="uppercase">{pendingLayout.replace(/_/g, ' ')}</strong> will discard the existing content for the current layout type. This cannot be undone.
                </p>
              </div>
            </div>
            <div className="flex justify-end gap-2 text-xs font-mono">
              <button
                type="button"
                onClick={() => setPendingLayout(null)}
                className={`px-4 py-2 rounded-xl border ${
                  isDark ? 'border-zinc-700 text-zinc-200 hover:bg-zinc-800' : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                } transition-all cursor-pointer`}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  applyLayoutChange(pendingLayout);
                  setPendingLayout(null);
                }}
                className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold transition-all shadow-md cursor-pointer"
              >
                Yes, Change Layout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

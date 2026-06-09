/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type ScreenLayoutType =
  | 'text_video'
  | 'text_table'
  | 'cards_grid'
  | 'bento_highlights'
  | 'milestone_timeline'
  | 'code_quote_spotlight'
  | 'multi_tab_dive'
  | 'qa_accordion';

export interface LayoutContentVideo {
  text: string;
  videoUrl: string; // YouTube / Vimeo iframe or static link
  caption?: string;
}

export interface TableRow {
  col1: string;
  col2: string;
  col3?: string;
  badgeType?: 'success' | 'danger' | 'warning' | 'info' | 'none';
}

export interface LayoutContentTable {
  text: string;
  headers: string[];
  rows: TableRow[];
}

export interface GridCardItem {
  id: string;
  title: string;
  backContent: string;
  badge?: string;
  icon?: string;
}

export interface LayoutContentCardsGrid {
  text: string;
  cards: GridCardItem[];
}

export interface BentoBox {
  id: string;
  size: 'small' | 'large' | 'medium';
  title: string;
  value?: string; // big highlighted stat or word
  description: string;
  colorPreset: 'slate' | 'emerald' | 'amber' | 'blue' | 'rose';
}

export interface LayoutContentBento {
  text: string;
  boxes: BentoBox[];
}

export interface TimelineStep {
  id: string;
  stepNumber: string;
  title: string;
  description: string;
  badgeText?: string;
}

export interface LayoutContentTimeline {
  text: string;
  steps: TimelineStep[];
}

export interface LayoutContentCodeQuote {
  spotlightText: string;
  captionTitle: string;
  languageOrAuthor: string;
  mainText: string;
  isCode: boolean; // True for code syntax, False for a big blockquote
}

export interface TabItem {
  id: string;
  label: string;
  title: string;
  content: string;
  sublist?: string[];
}

export interface LayoutContentTabDive {
  text: string;
  tabs: TabItem[];
}

export interface AccordionItem {
  id: string;
  trigger: string;
  content: string;
}

export interface LayoutContentAccordion {
  text: string;
  items: AccordionItem[];
}

export interface SectionNarration {
  audioDataUrl?: string;    // base64 data URL (self-contained export)
  audioExternalUrl?: string; // external hosted URL (lightweight export)
  autoPlay?: boolean;        // play automatically when section loads
  label?: string;            // optional description shown in the player
  fileSizeKb?: number;       // stored so the editor can display file size
}

// Discriminative contents mapped to the ScreenLayoutType
export interface Section {
  id: string;
  title: string;
  order: number;
  layoutType: ScreenLayoutType;
  accentColor?: string; // Hex or color key (e.g., 'blue', 'purple', 'rose', 'amber', 'emerald')
  
  // Layout values
  text_video?: LayoutContentVideo;
  text_table?: LayoutContentTable;
  cards_grid?: LayoutContentCardsGrid;
  bento_highlights?: LayoutContentBento;
  milestone_timeline?: LayoutContentTimeline;
  code_quote_spotlight?: LayoutContentCodeQuote;
  multi_tab_dive?: LayoutContentTabDive;
  qa_accordion?: LayoutContentAccordion;

  // Optional audio narration
  narration?: SectionNarration;

  // Gamified assets inside the section
  questions: QuizQuestion[];
  flashcards: CourseFlashcard[];
  includeQuestions?: boolean;
  includeFlashcards?: boolean;
}

export interface QuizQuestion {
  id: string;
  questionText: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
}

export interface CourseFlashcard {
  id: string;
  front: string;
  back: string;
}

export interface CourseMetadata {
  title: string;
  description: string;
  owner: string;
  version: string;
  publicationDate: string;
  approxDuration: string; // e.g. "45 minutes"
}

export interface CourseSettings {
  themeMode: 'light' | 'dark'; // default theme preset
  colorTheme?: 'classic' | 'steel' | 'forest'; // WCAG compliant author custom themes
  autoProgress: boolean; // advance to next slide after answering quiz correctly
  askForStudentName: boolean; // true = ask on course loading
  allowHomeSummaryAccess: boolean; // allow viewer to bypass course and go straight to quick reference
  passingScorePercent: number; // e.g. 80
  soundEffectsEnabled: boolean;
  questionsRequired: boolean; // whether quiz questions are mandatory vs optional
}

export interface GameCourse {
  metadata: CourseMetadata;
  sections: Section[];
  settings: CourseSettings;
}

// Student Tracking States
export interface StudentProgress {
  currentSectionIndex: number;
  studentName: string;
  totalPoints: number;
  correctAnswersCount: number;
  viewedSections: string[]; // section IDs completed/read
  completedQuizzes: Record<string, boolean>; // questionId -> answered correctly
  quizAttempts: Record<string, number>; // questionId -> tries count
  courseCompleted: boolean;
}

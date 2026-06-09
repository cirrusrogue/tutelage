/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GameCourse } from './types';

export const SAMPLE_GAME_COURSE: GameCourse = {
  metadata: {
    title: "Generative AI Fundamentals: From Prompt to Production",
    description: "Learn how to write effective prompts, understand multimodal inputs, design clean UI integrations, and structure reliable responses using large language models.",
    owner: "Lumina Studio Academy",
    version: "1.2.0",
    publicationDate: "2026-06-06",
    approxDuration: "25 minutes"
  },
  settings: {
    themeMode: "dark",
    autoProgress: true,
    askForStudentName: true,
    allowHomeSummaryAccess: true,
    passingScorePercent: 80,
    soundEffectsEnabled: true,
    questionsRequired: true
  },
  sections: [
    {
      id: "sec_1_welcome",
      title: "Introduction to Large Language Models",
      order: 1,
      layoutType: "text_video",
      text_video: {
        text: "Large Language Models (LLMs) are deep-learning models trained on massive text, code, and media datasets. They work through sequence predicting, anticipating the most mathematically logical next word token. In this course, we break down the core competencies required to master prompting, structuring API inputs, and hosting gamified student contents. Watch the briefing to unlock your learning path!",
        videoUrl: "https://www.youtube.com/embed/zjkBMFhNj_g",
        caption: "A 5-minute introductory conceptual guide to how models represent words in multi-dimensional vector space."
      },
      questions: [
        {
          id: "q_llm_predict",
          questionText: "What is the primary technical action an LLM runs continuously to generate outputs?",
          options: [
            "Compiling syntax strings into bytecodes",
            "Predicting the mathematically logical next token based on training context",
            "Searching a static local database of predetermined facts",
            "Running hardcoded regular expressions"
          ],
          correctOptionIndex: 1,
          explanation: "Under the hood, LLMs work by predicting the probability distribution of the next text token (sub-word unit) given the context of all previous tokens."
        }
      ],
      flashcards: [
        {
          id: "fc_token",
          front: "What is a Token in LLMs?",
          back: "A token is a basic unit of text processing. It can be a single character, part of a word, or an entire word. Typically, 100 tokens correspond to approximately 75 English words."
        },
        {
          id: "fc_llm_temp",
          front: "What does Temperature control?",
          back: "Temperature controls the randomness/creativity of outputs. Low values (e.g., 0.1) yield deterministic, focused text; high values (e.g., 0.9) yield creative, varied text."
        }
      ]
    },
    {
      id: "sec_2_prompting",
      title: "The Core Directives of Prompt Engineering",
      order: 2,
      layoutType: "cards_grid",
      cards_grid: {
        text: "Prompt engineering is the active design of instruction sets. Click the cards below to investigate the four primary styles of instruction layout. Applying these distinct approaches in your integrations will dramatically raise performance and cut down on structural hallucinations.",
        cards: [
          {
            id: "card_zero_shot",
            title: "Zero-Shot Prompting",
            backContent: "Asking the model to execute a task immediately without giving any examples. Best for simple classifications or generic queries where context overhead is low.",
            badge: "Simple",
            icon: "Zap"
          },
          {
            id: "card_few_shot",
            title: "Few-Shot Prompting",
            backContent: "Providing 2-5 complete input-output examples in your instruction block. This teaches the model the precise format, structure, and persona you expect.",
            badge: "Highly Effective",
            icon: "Layers"
          },
          {
            id: "card_cot",
            title: "Chain-of-Thought (CoT)",
            backContent: "Instructing the model to write out its logical reasoning step-by-step prior to returning the final answer. This forces logical consistency and corrects mathematical errors.",
            badge: "Reasoning Boost",
            icon: "BrainCircuit"
          },
          {
            id: "card_system_info",
            title: "System Instructions",
            backContent: "Defining global guidelines (e.g., tone, constraints, safety guardrails) that the model must obey across the entire conversation session.",
            badge: "Mandatory Rules",
            icon: "ShieldAlert"
          }
        ]
      },
      questions: [
        {
          id: "q_few_shot",
          questionText: "What represents the main advantage of few-shot prompting over zero-shot prompting?",
          options: [
            "It consumes fewer API tokens on average",
            "It forces the model to run faster on the server",
            "It shows the model concrete target response patterns to align structure and style",
            "It disables public caching on the CDN"
          ],
          correctOptionIndex: 2,
          explanation: "Providing explicit input-output pairs (few-shot) establishes a strong pattern for the model's structural layout and formatting, eliminating assumptions."
        }
      ],
      flashcards: [
        {
          id: "fc_cot_phr",
          front: "What simple phrase triggers standard Chain-of-Thought reasoning?",
          back: "Prompting with 'Let's think step-by-step.' forces the model to construct its intermediate reasoning stack before arriving at a final result."
        }
      ]
    },
    {
      id: "sec_3_structured_outputs",
      title: "Securing JSON & Schema Integrity",
      order: 3,
      layoutType: "code_quote_spotlight",
      code_quote_spotlight: {
        spotlightText: `{\n  "status": "success",\n  "assessment": {\n    "score": 95,\n    "studentPassed": true,\n    "recommendations": ["Advanced Prompting", "APIs"]\n  }\n}`,
        captionTitle: "Schema Constraint Configuration",
        languageOrAuthor: "json",
        mainText: "When building enterprise applications or SCORM packages, free-form text returns are difficult to parse in backends. Modern APIs bypass this constraint by offering structured JSON outputs forced by schema. By registering a Schema schema config, the LLM parser guarantees that the output strictly maps to your typed properties without breaking your runtime parser.",
        isCode: true
      },
      questions: [
        {
          id: "q_structured_json",
          questionText: "Why is forcing Structured JSON output via schema parameters highly recommended in app integration?",
          options: [
            "It turns off safety filters on the server",
            "It guarantees that returns strictly match properties, preventing parser errors in your backend code",
            "It renders animations directly into the browser DOM without CSS",
            "It compresses data packets using GZIP"
          ],
          correctOptionIndex: 1,
          explanation: "Integrating with structured schemas forces server-side alignment. You can immediately deserialise outputs into strict typed classes without needing complex string extraction."
        }
      ],
      flashcards: []
    },
    {
      id: "sec_4_best_practices",
      title: "Comparison of Prompting Strategies",
      order: 4,
      layoutType: "text_table",
      text_table: {
        text: "Depending on your speed constraints, accuracy requirements, and budget, you must select the correct prompting topology. The key characteristics are summarized in this quick-comparison matrix.",
        headers: ["Strategy", "Response Latency", "Accuracy Rank", "Cost Weight"],
        rows: [
          {
            col1: "Zero-Shot Direct Query",
            col2: "Ultra Fast (Minimal tokens)",
            col3: "Medium-Low (Can hallucinate)",
            badgeType: "success"
          },
          {
            col1: "Few-Shot Examples",
            col2: "Balanced (Moderate overhead)",
            col3: "High Core Accuracy",
            badgeType: "info"
          },
          {
            col1: "Chain-of-Thought Reasoning",
            col2: "Slower (Longer outputs)",
            col3: "Elite Reasoning Logic",
            badgeType: "warning"
          },
          {
            col1: "Fine-Tuning Weights",
            col2: "Extremely Fast on API",
            col3: "Max Domain Mastery",
            badgeType: "danger"
          }
        ]
      },
      questions: [],
      flashcards: []
    },
    {
      id: "sec_5_bento_insights",
      title: "Multimodal and RAG Insights Spectrum",
      order: 5,
      layoutType: "bento_highlights",
      bento_highlights: {
        text: "The state of the art in Generative AI involves connecting models with external data systems (Retrieval-Augmented Generation or RAG) and feeding multiple senses (multimodality). Review this structural spectrum:",
        boxes: [
          {
            id: "b_image",
            size: "medium",
            title: "Vision & Audio Sensing",
            value: "Multimodal",
            description: "Modern models ingest video, audio signals, and graphics alongside standard string text. Prompt structures are mapped in parallel arrays.",
            colorPreset: "emerald"
          },
          {
            id: "b_rag",
            size: "large",
            title: "Retrieval-Augmented Retrieval",
            value: "RAG Engine",
            description: "Allows querying live corporate documentation by converting PDFs or text database snippets into dense mathematical embeddings. It injects context files in real-time.",
            colorPreset: "blue"
          },
          {
            id: "b_context",
            size: "small",
            title: "Context Windows",
            value: "2M Token Capacity",
            description: "Ability to ingest entire codebases, audio catalogs, or novels in a single API query, making deep research immediate.",
            colorPreset: "amber"
          },
          {
            id: "b_hallucination",
            size: "small",
            title: "Hallucination Control",
            value: "Grounded Sources",
            description: "Validating responses with web searches or database references to lower inaccuracies.",
            colorPreset: "rose"
          }
        ]
      },
      questions: [
        {
          id: "q_rag_definition",
          questionText: "What is the primary objective of implementing a Retrieval-Augmented Generation (RAG) pattern?",
          options: [
            "Generating randomized test sequences",
            "Feeding relevant, fresh, and private documents directly into the prompt context to answer specific queries accurately",
            "Retraining the base weights of the model manually in the browser",
            "Encoding videos to base64 format"
          ],
          correctOptionIndex: 1,
          explanation: "RAG retrieves specific facts or paragraphs from directories and adds them to the query instructions. This anchors the engine with your up-to-date, specialized knowledge."
        }
      ],
      flashcards: []
    },
    {
      id: "sec_6_process_milestones",
      title: "System Integration Roadmap",
      order: 6,
      layoutType: "milestone_timeline",
      milestone_timeline: {
        text: "Moving from initial drafts to solid production systems involves a standard development lifecycle. Follow this linear step roadmap to scale safely:",
        steps: [
          {
            id: "step_proto",
            stepNumber: "01",
            title: "Sandbox Prototyping",
            description: "Test multiple ideas in the Google AI Studio playground. Isolate parameters, temperature, and assess general system feasibility.",
            badgeText: "Fast Loop"
          },
          {
            id: "step_schema",
            stepNumber: "02",
            title: "Strict Interface Schema",
            description: "Define rigid TypeScript typings and schema formats matching the requested app state to avoid parser drift.",
            badgeText: "High Safety"
          },
          {
            id: "step_eval",
            stepNumber: "03",
            title: "Evaluation Suites",
            description: "Create a library of sample parameters. Run batch iterations on revised prompt files to confirm changes improve accuracy scores.",
            badgeText: "Performance QA"
          },
          {
            id: "step_monitor",
            stepNumber: "04",
            title: "Production Deployment & Logs",
            description: "Add live trace logging and retry logic to gracefully resolve API rate limits or connection hiccups.",
            badgeText: "Go Live!"
          }
        ]
      },
      questions: [],
      flashcards: []
    },
    {
      id: "sec_7_tabs_deepdive",
      title: "Safety Guardrails and AI Policies",
      order: 7,
      layoutType: "multi_tab_dive",
      text_table: undefined,
      multi_tab_dive: {
        text: "AI integrations should operate transparently and safely. Deep dive into the tabs below to read the policies governing responsible AI use.",
        tabs: [
          {
            id: "tab_filters",
            label: "Safety Filters",
            title: "Safety Threshold Settings",
            content: "Safety filters evaluate text inputs/outputs across categories including harassment, hate speech, explicit scenarios, and dangerous instructions. You can configure safety blocks to be loose, standard, or block with high precision depending on your educational framework.",
            sublist: ["Harassment Filter", "Hate Speech Guard", "Dangerous Content Block"]
          },
          {
            id: "tab_data",
            label: "Data Boundaries",
            title: "LMS and Enterprise Privacy",
            content: "Corporate learning data should remain highly confidential. Ensure that logs are securely encrypted, personal student details (like PII) are sanitized at the client layer, and model outputs are parsed through custom safety validators before committing to storage.",
            sublist: ["Data Sanitization", "No Base Model Training (by default)", "SSL Encrypted Requests"]
          },
          {
            id: "tab_transparency",
            label: "Model Attribution",
            title: "Attribution and User Consent",
            content: "Transparency boosts student confidence. Clearly flag whenever instructional text is created on-the-fly by an LLM, provide an immediate escape hatch to review source materials, and allow users to complain or flag answers that seem incorrect.",
            sublist: ["Direct Attribution Labels", "Human-in-the-Loop Fallbacks", "Immediate Flagging Controls"]
          }
        ]
      },
      questions: [],
      flashcards: []
    },
    {
      id: "sec_8_accordion_qa",
      title: "Deploying Integrations: FAQs",
      order: 8,
      layoutType: "qa_accordion",
      qa_accordion: {
        text: "Below are answers to frequently asked integration questions that you must master before launching your learning solutions to the company LMS.",
        items: [
          {
            id: "acc_rate_limit",
            trigger: "How do we handle API Rate Limits (429 status codes)?",
            content: "Implement exponential backoff retry algorithms in your API services. When a 429 occurs, wait for a short randomized duration, then retry. It is also good practice to distribute tasks into message queues or cache static assets locally to avoid redundant model queries."
          },
          {
            id: "acc_scorm",
            trigger: "How does SCORM coordinate with interactive generated training?",
            content: "SCORM provides global window standard handles (like 'API' or 'API_1484_11') injected by LMS portals. Responsive applications hook into these interfaces on startup to initialize metrics, write score results, save partial progress states, and log final pass criteria automatically."
          },
          {
            id: "acc_hallucinations",
            trigger: "Can we get 100% accurate responses from an LLM?",
            content: "No. LLMs are highly probabilistic systems. To maximize accuracy, pair them with Retrieval-Augmented Generation (RAG) structures, apply maximum system instruction constraints, use strict low temperatures (0.0 to 0.2), and implement code runtime syntax verification on outputs before serving."
          }
        ]
      },
      questions: [],
      flashcards: []
    }
  ]
};

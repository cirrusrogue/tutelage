/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GameCourse } from './types';

export const SAMPLE_GAME_COURSE: GameCourse = {
  metadata: {
    title: "",
    description: "",
    owner: "",
    version: "1.0.0",
    publicationDate: new Date().toISOString().split('T')[0],
    approxDuration: ""
  },
  settings: {
    themeMode: "light",
    colorTheme: "classic",
    autoProgress: false,
    askForStudentName: true,
    allowHomeSummaryAccess: true,
    passingScorePercent: 80,
    soundEffectsEnabled: true,
    questionsRequired: false
  },
  sections: [
    {
      id: "sec_1_default",
      title: "Section 1",
      order: 1,
      layoutType: "text_video",
      text_video: {
        text: "",
        videoUrl: "",
        caption: ""
      },
      questions: [],
      flashcards: []
    }
  ]
};

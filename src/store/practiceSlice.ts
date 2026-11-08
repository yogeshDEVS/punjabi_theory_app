import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {theoryQuestions} from '../features/theory/data';

export interface PracticeState {
  visitedQuestionIds: number[];
  flaggedQuestionIds: number[];
  totalQuestions: number;
}

export interface HydratePracticePayload {
  visitedQuestionIds: number[];
  flaggedQuestionIds: number[];
}

const initialState: PracticeState = {
  visitedQuestionIds: [],
  flaggedQuestionIds: [],
  totalQuestions: theoryQuestions.length,
};

export const practiceSlice = createSlice({
  name: 'practice',
  initialState,
  reducers: {
    hydratePractice: (state, action: PayloadAction<HydratePracticePayload>) => {
      state.visitedQuestionIds = [...new Set(action.payload.visitedQuestionIds)];
      state.flaggedQuestionIds = [...new Set(action.payload.flaggedQuestionIds)];
    },
    markQuestionVisited: (state, action: PayloadAction<number>) => {
      const questionId = action.payload;
      if (!state.visitedQuestionIds.includes(questionId)) {
        state.visitedQuestionIds.push(questionId);
      }
    },
    toggleQuestionFlag: (state, action: PayloadAction<number>) => {
      const questionId = action.payload;
      const index = state.flaggedQuestionIds.indexOf(questionId);
      if (index >= 0) {
        state.flaggedQuestionIds.splice(index, 1);
      } else {
        state.flaggedQuestionIds.push(questionId);
      }
    },
    unflagQuestion: (state, action: PayloadAction<number>) => {
      const questionId = action.payload;
      state.flaggedQuestionIds = state.flaggedQuestionIds.filter(
        id => id !== questionId,
      );
    },
    resetPractice: state => {
      state.visitedQuestionIds = [];
      state.flaggedQuestionIds = [];
    },
  },
});

export const {
  hydratePractice,
  markQuestionVisited,
  toggleQuestionFlag,
  unflagQuestion,
  resetPractice,
} = practiceSlice.actions;

export default practiceSlice.reducer;

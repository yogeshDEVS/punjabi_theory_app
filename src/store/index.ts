import {combineReducers, configureStore} from '@reduxjs/toolkit';
import {
  persistReducer,
  persistStore,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import {TypedUseSelectorHook, useDispatch, useSelector} from 'react-redux';

import practiceReducer from './practiceSlice';
import {reduxStorage} from './storage';

const rootReducer = combineReducers({
  practice: practiceReducer,
});

const persistConfig = {
  key: 'root',
  storage: reduxStorage,
  whitelist: ['practice'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// Convenience selectors
export const selectVisitedQuestionIds = (state: RootState) =>
  state.practice.visitedQuestionIds;

export const selectFlaggedQuestionIds = (state: RootState) =>
  state.practice.flaggedQuestionIds;

export const selectSeenCount = (state: RootState) =>
  state.practice.visitedQuestionIds.length;

export const selectTotalQuestions = (state: RootState) =>
  state.practice.totalQuestions;

export const selectNotSeenCount = (state: RootState) =>
  Math.max(
    0,
    state.practice.totalQuestions - state.practice.visitedQuestionIds.length,
  );

export const selectFlaggedCount = (state: RootState) =>
  state.practice.flaggedQuestionIds.length;

export const selectRoadProceduresProgress = (state: RootState) => {
  const total = state.practice.totalQuestions;
  const seen = state.practice.visitedQuestionIds.length;
  return total > 0 ? Math.round((seen / total) * 100) : 0;
};

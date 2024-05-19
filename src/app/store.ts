import { Action, configureStore, ThunkAction } from '@reduxjs/toolkit';
import { api } from '../services/api';
import { setupListeners } from '@reduxjs/toolkit/query';

/* see here: https://redux-toolkit.js.org/tutorials/rtk-query
 * and here: https://redux.js.org/tutorials/essentials/part-7-rtk-query-basics
 * for RTK query docs
 */

// very basic redux store to allow us to use rtk query
export const store = configureStore({
  reducer: { [api.reducerPath]: api.reducer },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware)
});

setupListeners(store.dispatch);

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;

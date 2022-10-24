import { combineReducers } from '@reduxjs/toolkit';
import accounts from './accountsSlice';

const reducer = combineReducers({
  accounts,
});

export default reducer;

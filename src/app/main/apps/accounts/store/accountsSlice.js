import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit';
// import { setAccountData } from 'app/auth/store/accountSlice';
import { showMessage } from 'app/store/fuse/messageSlice';
import apiService from '../../../../services/apiService';

export const getAccounts = createAsyncThunk(
  'accountsApp/accounts/getAccounts',
  async (routeParams, { getState }) => {
    routeParams = routeParams || getState().accountsApp.accounts.routeParams;
    const { id } = routeParams;
    let response;
    switch (id) {
      case 'verified': {
        response = await apiService.getAccounts(`/accounts?isEmailVerified=true`);
        break;
      }
      case 'unVerified': {
        response = await apiService.getAccounts(`/accounts?isEmailVerified=false`);
        break;
      }
      default: {
        response = await apiService.get(`/accounts`);
      }
    }
    const data = await response.data.results;

    return { data, routeParams };
  }
);

export const addAccount = createAsyncThunk(
  'accountsApp/accounts/addAccount',
  async (account, { dispatch, getState }) => {
    const { email, name, photoURL, password } = account;
    const response = await apiService.post('/accounts', { email, name, photoURL, password });
    const data = await response.data;

    dispatch(getAccounts());
    dispatch(
      showMessage({
        message: 'Add account successfully',
        variant: 'success',
      })
    );
    return data;
  }
);

export const updateAccount = createAsyncThunk(
  'accountsApp/accounts/updateAccount',
  async (account, { dispatch, getState, rejectWithValue }) => {
    try {
      const { email, name, photoURL } = account;
      const response = await apiService.patch(`/accounts/${account.id}`, { email, name, photoURL });
      const data = await response.data;
      dispatch(getAccounts());
      dispatch(
        showMessage({
          message: 'Update account successfully',
          variant: 'success',
        })
      );
      return data;
    } catch (error) {
      dispatch(
        showMessage({
          message: error.response.data.message,
          variant: 'error',
        })
      );
      return rejectWithValue(error.response.data.message);
    }
  }
);
export const updateProfile = createAsyncThunk(
  'accountsApp/accounts/updateAccount',
  async (account, { dispatch, getState, rejectWithValue }) => {
    try {
      const response = await apiService.patch(`/accounts/me`, account);
      const data = await response.data;
      dispatch(setAccountData(data));
      dispatch(
        showMessage({
          message: 'Update profile successfully',
          variant: 'success',
        })
      );
      return data;
    } catch (error) {
      dispatch(
        showMessage({
          message: error.response.data.message,
          variant: 'error',
        })
      );
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const removeAccount = createAsyncThunk(
  'accountsApp/accounts/removeAccount',
  async (accountId, { dispatch, getState }) => {
    await apiService.delete(`/accounts/${accountId}`);
    dispatch(
      showMessage({
        message: 'Delete account successfully',
        variant: 'success',
      })
    );
    return accountId;
  }
);

export const removeAccounts = createAsyncThunk(
  'accountsApp/accounts/removeAccounts',
  async (accountIds, { dispatch, getState }) => {
    await apiService.delete('/accounts', { data: { accountIds } });
    dispatch(
      showMessage({
        message: 'Delete accounts successfully',
        variant: 'success',
      })
    );
    return accountIds;
  }
);

export const toggleStarredAccount = createAsyncThunk(
  'accountsApp/accounts/toggleStarredAccount',
  async (accountId, { dispatch, getState }) => {
    const response = await apiService.post('/api/accounts-app/toggle-starred-account', {
      accountId,
    });
    const data = await response.data;

    // dispatch(getAccountData());

    dispatch(getAccounts());

    return data;
  }
);

export const toggleStarredAccounts = createAsyncThunk(
  'accountsApp/accounts/toggleStarredAccounts',
  async (accountIds, { dispatch, getState }) => {
    const response = await apiService.post('/api/accounts-app/toggle-starred-accounts', {
      accountIds,
    });
    const data = await response.data;

    // dispatch(getAccountData());

    dispatch(getAccounts());

    return data;
  }
);

export const setAccountsStarred = createAsyncThunk(
  'accountsApp/accounts/setAccountsStarred',
  async (accountIds, { dispatch, getState }) => {
    const response = await apiService.post('/api/accounts-app/set-accounts-starred', {
      accountIds,
    });
    const data = await response.data;

    // dispatch(getAccountData());

    dispatch(getAccounts());

    return data;
  }
);

export const setAccountsUnstarred = createAsyncThunk(
  'accountsApp/accounts/setAccountsUnstarred',
  async (accountIds, { dispatch, getState }) => {
    const response = await apiService.post('/api/accounts-app/set-accounts-unstarred', {
      accountIds,
    });
    const data = await response.data;

    // dispatch(getAccountData());

    dispatch(getAccounts());

    return data;
  }
);

const accountsAdapter = createEntityAdapter({});

export const { selectAll: selectAccounts, selectById: selectAccountsById } =
  accountsAdapter.getSelectors((state) => state.accountsApp.accounts);

const accountsSlice = createSlice({
  name: 'accountsApp/accounts',
  initialState: accountsAdapter.getInitialState({
    searchText: '',
    routeParams: {},
    accountDialog: {
      type: 'new',
      props: {
        open: false,
      },
      data: null,
    },
  }),
  reducers: {
    setAccountsSearchText: {
      reducer: (state, action) => {
        state.searchText = action.payload;
      },
      prepare: (event) => ({ payload: event.target.value || '' }),
    },
    openNewAccountDialog: (state, action) => {
      state.accountDialog = {
        type: 'new',
        props: {
          open: true,
        },
        data: null,
      };
    },
    closeNewAccountDialog: (state, action) => {
      state.accountDialog = {
        type: 'new',
        props: {
          open: false,
        },
        data: null,
      };
    },
    openEditAccountDialog: (state, action) => {
      state.accountDialog = {
        type: 'edit',
        props: {
          open: true,
        },
        data: action.payload,
      };
    },
    closeEditAccountDialog: (state, action) => {
      state.accountDialog = {
        type: 'edit',
        props: {
          open: false,
        },
        data: null,
      };
    },
  },
  extraReducers: {
    [updateAccount.fulfilled]: accountsAdapter.upsertOne,
    [updateProfile.fulfilled]: accountsAdapter.upsertOne,
    [addAccount.fulfilled]: accountsAdapter.addOne,
    [removeAccounts.fulfilled]: (state, action) =>
      accountsAdapter.removeMany(state, action.payload),
    [removeAccount.fulfilled]: (state, action) => accountsAdapter.removeOne(state, action.payload),
    [getAccounts.fulfilled]: (state, action) => {
      const { data, routeParams } = action.payload;
      accountsAdapter.setAll(state, data);
      state.routeParams = routeParams;
      state.searchText = '';
    },
  },
});

export const {
  setAccountsSearchText,
  openNewAccountDialog,
  closeNewAccountDialog,
  openEditAccountDialog,
  closeEditAccountDialog,
} = accountsSlice.actions;

export default accountsSlice.reducer;

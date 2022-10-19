import {
  createSlice,
  createAsyncThunk,
  createEntityAdapter,
} from '@reduxjs/toolkit';
import apiService from '../../../../services/apiService';

export const getUsers = createAsyncThunk(
  'usersApp/users/getUsers',
  async (routeParams, { getState }) => {
    routeParams = routeParams || getState().usersApp.users.routeParams;
    const { id } = routeParams;
    let response;
    switch (id) {
      case 'verified': {
        response = await apiService.getUsers(`/users?isEmailVerified=true`);
      }
      case 'unVerified': {
        response = await apiService.getUsers(`/users?isEmailVerified=false`);
      }
      default: {
        response = await apiService.get(`/users`);
      }
    }
    const data = await response.data.results;

    return { data, routeParams };
  }
);

export const addUser = createAsyncThunk(
  'usersApp/users/addUser',
  async (user, { dispatch, getState }) => {
    const response = await apiService.post('/users', {
      user,
    });
    const data = await response.data;

    dispatch(getUsers());

    return data;
  }
);

export const updateUser = createAsyncThunk(
  'usersApp/users/updateUser',
  async (user, { dispatch, getState }) => {
    const response = await apiService.put('/users/:id', {
      user,
    });
    const data = await response.data;

    dispatch(getUsers());

    return data;
  }
);

export const removeUser = createAsyncThunk(
  'usersApp/users/removeUser',
  async (userId, { dispatch, getState }) => {
    await apiService.delete('/users/:userId', { userId });

    return userId;
  }
);

export const removeUsers = createAsyncThunk(
  'usersApp/users/removeUsers',
  async (userIds, { dispatch, getState }) => {
    await apiService.post('/users/:userIds', { userIds });

    return userIds;
  }
);

export const toggleStarredUser = createAsyncThunk(
  'usersApp/users/toggleStarredUser',
  async (userId, { dispatch, getState }) => {
    const response = await apiService.post(
      '/api/users-app/toggle-starred-user',
      { userId }
    );
    const data = await response.data;

    dispatch(getUserData());

    dispatch(getUsers());

    return data;
  }
);

export const toggleStarredUsers = createAsyncThunk(
  'usersApp/users/toggleStarredUsers',
  async (userIds, { dispatch, getState }) => {
    const response = await apiService.post(
      '/api/users-app/toggle-starred-users',
      { userIds }
    );
    const data = await response.data;

    dispatch(getUserData());

    dispatch(getUsers());

    return data;
  }
);

export const setUsersStarred = createAsyncThunk(
  'usersApp/users/setUsersStarred',
  async (userIds, { dispatch, getState }) => {
    const response = await apiService.post('/api/users-app/set-users-starred', {
      userIds,
    });
    const data = await response.data;

    dispatch(getUserData());

    dispatch(getUsers());

    return data;
  }
);

export const setUsersUnstarred = createAsyncThunk(
  'usersApp/users/setUsersUnstarred',
  async (userIds, { dispatch, getState }) => {
    const response = await apiService.post(
      '/api/users-app/set-users-unstarred',
      { userIds }
    );
    const data = await response.data;

    dispatch(getUserData());

    dispatch(getUsers());

    return data;
  }
);

const usersAdapter = createEntityAdapter({});

export const { selectAll: selectUsers, selectById: selectUsersById } =
  usersAdapter.getSelectors((state) => state.usersApp.users);

const usersSlice = createSlice({
  name: 'usersApp/users',
  initialState: usersAdapter.getInitialState({
    searchText: '',
    routeParams: {},
    userDialog: {
      type: 'new',
      props: {
        open: false,
      },
      data: null,
    },
  }),
  reducers: {
    setUsersSearchText: {
      reducer: (state, action) => {
        state.searchText = action.payload;
      },
      prepare: (event) => ({ payload: event.target.value || '' }),
    },
    openNewUserDialog: (state, action) => {
      state.userDialog = {
        type: 'new',
        props: {
          open: true,
        },
        data: null,
      };
    },
    closeNewUserDialog: (state, action) => {
      state.userDialog = {
        type: 'new',
        props: {
          open: false,
        },
        data: null,
      };
    },
    openEditUserDialog: (state, action) => {
      state.userDialog = {
        type: 'edit',
        props: {
          open: true,
        },
        data: action.payload,
      };
    },
    closeEditUserDialog: (state, action) => {
      state.userDialog = {
        type: 'edit',
        props: {
          open: false,
        },
        data: null,
      };
    },
  },
  extraReducers: {
    [updateUser.fulfilled]: usersAdapter.upsertOne,
    [addUser.fulfilled]: usersAdapter.addOne,
    [removeUsers.fulfilled]: (state, action) =>
      usersAdapter.removeMany(state, action.payload),
    [removeUser.fulfilled]: (state, action) =>
      usersAdapter.removeOne(state, action.payload),
    [getUsers.fulfilled]: (state, action) => {
      const { data, routeParams } = action.payload;
      usersAdapter.setAll(state, data);
      state.routeParams = routeParams;
      state.searchText = '';
    },
  },
});

export const {
  setUsersSearchText,
  openNewUserDialog,
  closeNewUserDialog,
  openEditUserDialog,
  closeEditUserDialog,
} = usersSlice.actions;

export default usersSlice.reducer;
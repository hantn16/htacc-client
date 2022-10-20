/* eslint-disable jsx-a11y/label-has-associated-control */
import FuseUtils from '@fuse/utils/FuseUtils';
import { yupResolver } from '@hookform/resolvers/yup';
import AppBar from '@material-ui/core/AppBar';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { useCallback, useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';

import _ from '@lodash';
import * as yup from 'yup';
import { closeDialog, openDialog } from 'app/store/fuse/dialogSlice';
import { DialogTitle, DialogContentText } from '@material-ui/core';
import {
  removeUser,
  updateUser,
  addUser,
  closeNewUserDialog,
  closeEditUserDialog,
} from './store/usersSlice';

const defaultValues = {
  id: '',
  name: '',
  photoURL: 'assets/images/avatars/profile.jpg',
  email: '',
  role: 'user',
  isEmailVerified: false,
  password: '',
  passwordConfirm: '',
};

/**
 * Form Validation Schema
 */
const addSchema = yup.object().shape({
  name: yup.string().required('You must enter a name'),
  email: yup.string().required('You must enter an email').email('Invalid email address'),
  password: yup
    .string()
    .required('Please enter your password.')
    .min(8, 'Password is too short - should be 8 chars minimum.'),
  passwordConfirm: yup.string().oneOf([yup.ref('password'), null], 'Passwords must match'),
});
const editSchema = yup.object().shape({
  name: yup.string().required('You must enter a name'),
  email: yup.string().required('You must enter an email').email('Invalid email address'),
});

function UserDialog(props) {
  const dispatch = useDispatch();
  const userDialog = useSelector(({ usersApp }) => usersApp.users.userDialog);
  const resolver = userDialog.type === 'new' ? yupResolver(addSchema) : yupResolver(editSchema);
  const { control, watch, reset, handleSubmit, formState, register, setValue } = useForm({
    mode: 'onChange',
    defaultValues,
    resolver,
  });
  const { isValid, dirtyFields, errors } = formState;

  const id = watch('id');
  const name = watch('name');
  const photoURL = watch('photoURL');

  useEffect(() => {
    return () => {
      URL.revokeObjectURL(photoURL);
    };
  }, [photoURL]);

  /**
   * Initialize Dialog with Data
   */
  const initDialog = useCallback(() => {
    /**
     * Dialog type: 'edit'
     */
    if (userDialog.type === 'edit' && userDialog.data) {
      reset({ ...userDialog.data });
    }

    /**
     * Dialog type: 'new'
     */
    if (userDialog.type === 'new') {
      reset({
        ...defaultValues,
        ...userDialog.data,
        id: FuseUtils.generateGUID(),
      });
    }
  }, [userDialog.data, userDialog.type, reset]);

  /**
   * On Dialog Open
   */
  useEffect(() => {
    if (userDialog.props.open) {
      initDialog();
    }
  }, [userDialog.props.open, initDialog]);

  /**
   * Close Dialog
   */
  function closeComposeDialog() {
    return userDialog.type === 'edit'
      ? dispatch(closeEditUserDialog())
      : dispatch(closeNewUserDialog());
  }

  /**
   * Form Submit
   */
  function onSubmit(data) {
    console.log('data', data);
    if (userDialog.type === 'new') {
      dispatch(addUser(data));
    } else {
      dispatch(
        updateUser({ email: data.email, name: data.name, photoURL: data.photoURL, id: data.id })
      );
    }
    closeComposeDialog();
  }
  function showConfirmDialog() {
    dispatch(
      openDialog({
        children: (
          <>
            <DialogTitle id="alert-dialog-title">Delete User</DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                You are about to delete this user. Are you sure?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => dispatch(closeDialog())} color="primary">
                Cancel
              </Button>
              <Button onClick={handleRemove} color="primary" autoFocus>
                Ok
              </Button>
            </DialogActions>
          </>
        ),
      })
    );
  }

  /**
   * Remove Event
   */
  function handleRemove() {
    dispatch(removeUser(id));
    dispatch(closeDialog());
    closeComposeDialog();
  }
  /**
   * Change Avatar
   */
  const handleChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setValue('photoURL', URL.createObjectURL(file), { shouldDirty: true });
    }
  };
  return (
    <Dialog
      classes={{
        paper: 'm-24',
      }}
      {...userDialog.props}
      onClose={closeComposeDialog}
      fullWidth
      maxWidth="xs"
    >
      <form
        noValidate
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col md:overflow-hidden"
      >
        <AppBar position="static" elevation={0}>
          <Toolbar className="flex w-full">
            <Typography variant="subtitle1" color="inherit">
              {userDialog.type === 'new' ? 'New User' : 'Edit User'}
            </Typography>
          </Toolbar>
          <div className="flex flex-col items-center justify-center pb-24">
            <label htmlFor="profilePhoto">
              <input
                accept="image/*"
                id="profilePhoto"
                name="photoURL"
                type="file"
                className="hidden"
                onChange={handleChange}
                {...register}
              />
              <Avatar className="w-96 h-96 cursor-pointer" alt="user avatar" src={photoURL} />
            </label>
            {userDialog.type === 'edit' && (
              <Typography variant="h6" color="inherit" className="pt-8">
                {name}
              </Typography>
            )}
          </div>
        </AppBar>
        <DialogContent classes={{ root: 'p-24' }}>
          <div className="flex">
            <div className="min-w-48 pt-20">
              <Icon color="action">account_circle</Icon>
            </div>
            <Controller
              control={control}
              name="name"
              render={({ field }) => (
                <TextField
                  {...field}
                  className="mb-24"
                  label="Name"
                  id="name"
                  error={!!errors.name}
                  helperText={errors?.name?.message}
                  variant="outlined"
                  required
                  fullWidth
                />
              )}
            />
          </div>
          {/* 
          <div className="flex">
            <div className="min-w-48 pt-20">
              <Icon color="action">phone</Icon>
            </div>
            <Controller
              control={control}
              name="phone"
              render={({ field }) => (
                <TextField
                  {...field}
                  className="mb-24"
                  label="Phone"
                  id="phone"
                  variant="outlined"
                  fullWidth
                />
              )}
            />
          </div> */}

          <div className="flex">
            <div className="min-w-48 pt-20">
              <Icon color="action">email</Icon>
            </div>
            <Controller
              control={control}
              name="email"
              render={({ field }) => (
                <TextField
                  {...field}
                  className="mb-24"
                  label="Email"
                  id="email"
                  error={!!errors.email}
                  helperText={errors?.email?.message}
                  variant="outlined"
                  fullWidth
                  required
                />
              )}
            />
          </div>
          {userDialog.type === 'new' && (
            <div className="flex">
              <div className="min-w-48 pt-20">
                <Icon color="action">vpn_key</Icon>
              </div>
              <Controller
                control={control}
                name="password"
                render={({ field }) => (
                  <TextField
                    {...field}
                    className="mb-24"
                    label="Password"
                    id="password"
                    type="password"
                    error={!!errors.password}
                    helperText={errors?.password?.message}
                    variant="outlined"
                    fullWidth
                    required
                  />
                )}
              />
            </div>
          )}
          {userDialog.type === 'new' && (
            <div className="flex">
              <div className="min-w-48 pt-20">
                <Icon color="action">vpn_key</Icon>
              </div>
              <Controller
                control={control}
                name="passwordConfirm"
                render={({ field }) => (
                  <TextField
                    {...field}
                    className="mb-24"
                    label="Password (Confirm)"
                    id="passwordConfirm"
                    type="password"
                    error={!!errors.passwordConfirm}
                    helperText={errors?.passwordConfirm?.message}
                    variant="outlined"
                    fullWidth
                    required
                  />
                )}
              />
            </div>
          )}
        </DialogContent>

        {userDialog.type === 'new' ? (
          <DialogActions className="justify-between p-4 pb-16">
            <div className="px-16">
              <Button
                variant="contained"
                color="secondary"
                type="submit"
                disabled={_.isEmpty(dirtyFields) || !isValid}
              >
                Add
              </Button>
            </div>
          </DialogActions>
        ) : (
          <DialogActions className="justify-between p-4 pb-16">
            <div className="px-16">
              <Button
                variant="contained"
                color="secondary"
                type="submit"
                disabled={_.isEmpty(dirtyFields) || !isValid}
              >
                Save
              </Button>
            </div>
            <IconButton onClick={showConfirmDialog}>
              <Icon>delete</Icon>
            </IconButton>
          </DialogActions>
        )}
      </form>
    </Dialog>
  );
}

export default UserDialog;

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
import PhotoCamera from '@material-ui/icons/PhotoCamera';
import TextField from '@material-ui/core/TextField';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { useCallback, useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';

import _ from '@lodash';
import * as yup from 'yup';

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
};

/**
 * Form Validation Schema
 */
const schema = yup.object().shape({
  name: yup.string().required('You must enter a name'),
  email: yup.string().required('You must enter an email').email('Invalid email address'),
});

function UserDialog(props) {
  const dispatch = useDispatch();
  const userDialog = useSelector(({ usersApp }) => usersApp.users.userDialog);

  const { control, watch, reset, handleSubmit, formState, getValues } = useForm({
    mode: 'onChange',
    defaultValues,
    resolver: yupResolver(schema),
  });

  const { isValid, dirtyFields, errors } = formState;

  const id = watch('id');
  const name = watch('name');
  const photoURL = watch('photoURL');

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
    if (userDialog.type === 'new') {
      dispatch(addUser(data));
    } else {
      dispatch(updateUser({ ...userDialog.data, ...data }));
    }
    closeComposeDialog();
  }

  /**
   * Remove Event
   */
  function handleRemove() {
    dispatch(removeUser(id));
    closeComposeDialog();
  }

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
      <AppBar position="static" elevation={0}>
        <Toolbar className="flex w-full">
          <Typography variant="subtitle1" color="inherit">
            {userDialog.type === 'new' ? 'New User' : 'Edit User'}
          </Typography>
        </Toolbar>
        <div className="flex flex-col items-center justify-center pb-24">
          <Avatar className="w-96 h-96" alt="user avatar" src={photoURL} />
          {userDialog.type === 'edit' && (
            <Typography variant="h6" color="inherit" className="pt-8">
              {name}
            </Typography>
          )}
        </div>
      </AppBar>
      <form
        noValidate
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col md:overflow-hidden"
      >
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
          <div className="flex">
            <div className="min-w-48 pt-20">
              <Icon color="action">image</Icon>
            </div>
            <Controller
              control={control}
              name="photoURL"
              render={({ field }) => (
                <>
                  <TextField
                    {...field}
                    className="mb-24"
                    label="PhotoUrl"
                    disabled
                    id="photoURL"
                    error={!!errors.photoURL}
                    helperText={errors?.photoURL?.message}
                    variant="outlined"
                    fullWidth
                  />
                  <input accept="image/*" className="hidden" id="photo" type="file" />
                  <label htmlFor="photo">
                    <IconButton
                      color="primary"
                      style={{ cursor: 'pointer' }}
                      aria-label="upload picture"
                      component="span"
                    >
                      <PhotoCamera />
                    </IconButton>
                  </label>
                </>
              )}
            />
          </div>

          {/* <div className="flex">
            <div className="min-w-48 pt-20">
              <Icon color="action">note</Icon>
            </div>
            <Controller
              control={control}
              name="notes"
              render={({ field }) => (
                <TextField
                  {...field}
                  className="mb-24"
                  label="Notes"
                  id="notes"
                  variant="outlined"
                  multiline
                  rows={5}
                  fullWidth
                />
              )}
            />
          </div> */}
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
            <IconButton onClick={handleRemove}>
              <Icon>delete</Icon>
            </IconButton>
          </DialogActions>
        )}
      </form>
    </Dialog>
  );
}

export default UserDialog;

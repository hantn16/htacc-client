import FuseUtils from '@fuse/utils/FuseUtils';
import { yupResolver } from '@hookform/resolvers/yup';
import AppBar from '@material-ui/core/AppBar';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Icon from '@material-ui/core/Icon';
import TextField from '@material-ui/core/TextField';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import { useCallback, useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import _ from '@lodash';
import * as yup from 'yup';

import FusePageCarded from '@fuse/core/FusePageCarded';
import { closeDialog, openDialog } from 'app/store/fuse/dialogSlice';
import { DialogTitle, DialogContentText, DialogContent, DialogActions } from '@material-ui/core';
import {
  removeUser,
  updateUser,
  addUser,
  closeNewUserDialog,
  closeEditUserDialog,
} from '../../apps/users/store/usersSlice';

const useStyles = makeStyles((theme) => ({
  root: {},
}));

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
const schema = yup.object().shape({
  name: yup.string().required('You must enter a name'),
  email: yup.string().required('You must enter an email').email('Invalid email address'),
});

function Profile(props) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const user = useSelector(({ auth }) => auth.user);
  const [editMode, setEditMode] = useState(false);
  const { control, watch, reset, handleSubmit, formState, register, setValue } = useForm({
    mode: 'onChange',
    defaultValues,
    resolver: yupResolver(schema),
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
   * Initialize Card with Data on View mode
   */
  const initCard = useCallback(() => {
    /**
     * Dialog type: 'edit'
     */

    reset({ ...user });
  }, [reset, user]);

  /**
   * On Edit mode
   */
  useEffect(() => {
    initCard();
  }, []);

  /**
   * Form Submit
   */
  function onSubmit(data) {
    showConfirmDialog(data);
  }
  function handleOk(data) {
    dispatch(
      updateUser({ email: data.email, name: data.name, photoURL: data.photoURL, id: data.id })
    );
  }

  function showConfirmDialog(data) {
    dispatch(
      openDialog({
        children: (
          <>
            <DialogTitle id="alert-dialog-title">Save my profile</DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                Are you sure to save your profile's changes?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => dispatch(closeDialog())} color="primary">
                Cancel
              </Button>
              <Button onClick={handleOk(data)} color="primary" autoFocus>
                Ok
              </Button>
            </DialogActions>
          </>
        ),
      })
    );
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
    <FusePageCarded
      classes={{
        root: classes.layoutRoot,
      }}
      // header={
      //   <div className="py-24">
      //     <h4>Header</h4>
      //   </div>
      // }
      contentToolbar={
        <div className="px-24">
          <h4>{`${user.name}'s Profile`}</h4>
        </div>
      }
      content={
        <div className="p-24">
          <h4>Content</h4>
          <br />
          <form
            noValidate
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col md:overflow-hidden"
          >
            <AppBar className="rounded-2xl" position="static" elevation={0}>
              <div className="flex flex-col items-center justify-center p-24 ">
                <label htmlFor="profilePhoto">
                  <input
                    accept="image/*"
                    id="profilePhoto"
                    name="photoURL"
                    type="file"
                    className="hidden"
                    disabled={!editMode}
                    onChange={handleChange}
                    {...register}
                  />
                  <Avatar className="w-96 h-96 cursor-pointer" alt="user avatar" src={photoURL} />
                </label>
                <div className="flex">
                  <Typography variant="h6" color="inherit" className="pt-8">
                    {`${user.name} - ${user.role}`}
                  </Typography>
                </div>
                <div className="flex">
                  {!editMode && (
                    <Button variant="contained" color="secondary" onClick={() => setEditMode(true)}>
                      Edit profile
                    </Button>
                  )}
                </div>
              </div>
            </AppBar>
            <CardContent classes={{ root: 'py-24 px-0' }}>
              <div className="flex">
                <div className="flex items-center min-w-36 md:min-w-48 mb-24">
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
                      disabled={!editMode}
                    />
                  )}
                />
              </div>

              <div className="flex">
                <div className="flex items-center min-w-36 md:min-w-48 mb-24">
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
                      disabled={!editMode}
                    />
                  )}
                />
              </div>
              <div className="justify-between p-4 pb-16">
                {editMode && (
                  <div className="flex px-40">
                    <Button
                      className="m-4"
                      variant="contained"
                      color="secondary"
                      type="submit"
                      disabled={_.isEmpty(dirtyFields) || !isValid}
                    >
                      Update Profile
                    </Button>
                    <Button
                      className="m-4"
                      variant="contained"
                      color="primary"
                      onClick={() => {
                        setEditMode(false);
                        reset({ ...user });
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </form>
        </div>
      }
      innerScroll
    />
  );
}

export default Profile;

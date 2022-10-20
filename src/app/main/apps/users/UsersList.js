import { motion } from 'framer-motion';
import FuseUtils from '@fuse/utils';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { useMemo, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { closeDialog, openDialog } from 'app/store/fuse/dialogSlice';
import { DialogTitle, DialogContentText, DialogContent, DialogActions } from '@material-ui/core';
import UsersMultiSelectMenu from './UsersMultiSelectMenu';
import UsersTable from './UsersTable';
import { openEditUserDialog, removeUser, selectUsers } from './store/usersSlice';

function UsersList(props) {
  const dispatch = useDispatch();
  const users = useSelector(selectUsers);
  const searchText = useSelector(({ usersApp }) => usersApp.users.searchText);
  // const user = useSelector(({ usersApp }) => usersApp.user);

  const [filteredData, setFilteredData] = useState(null);

  const confirmRemove = (id) => {
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
              <Button
                onClick={() => {
                  dispatch(removeUser(id));
                  dispatch(closeDialog());
                }}
                color="primary"
                autoFocus
              >
                Ok
              </Button>
            </DialogActions>
          </>
        ),
      })
    );
  };
  const columns = useMemo(
    () => [
      {
        Header: ({ selectedFlatRows }) => {
          const selectedRowIds = selectedFlatRows.map((row) => row.original.id);
          return (
            selectedFlatRows.length > 0 && <UsersMultiSelectMenu selectedUserIds={selectedRowIds} />
          );
        },
        accessor: 'photoURL',
        Cell: ({ row }) => (
          <Avatar className="mx-8" alt={row.original.name} src={row.original.photoURL} />
        ),
        className: 'justify-center',
        width: 64,
        sortable: false,
      },
      {
        Header: 'Name',
        accessor: 'name',
        className: 'font-medium',
        sortable: true,
      },
      {
        Header: 'Email',
        accessor: 'email',
        sortable: true,
      },
      {
        Header: 'Role',
        accessor: 'role',
        sortable: true,
      },
      {
        Header: 'Email Verified',
        accessor: 'isEmailVerified',
        sortable: true,
        Cell: ({ row }) =>
          row.original.isEmailVerified ? (
            <Icon className="text-green-700">verified_user</Icon>
          ) : (
            <Icon className="text-red-700">highlight_off</Icon>
          ),
        className: 'justify-center',
      },
      {
        id: 'action',
        width: 128,
        sortable: false,
        Cell: ({ row }) => (
          <div className="flex items-center">
            <IconButton
              onClick={(ev) => {
                ev.stopPropagation();
                confirmRemove(row.original.id);
              }}
            >
              <Icon>delete</Icon>
            </IconButton>
          </div>
        ),
      },
    ],
    []
  );

  useEffect(() => {
    function getFilteredArray(entities, _searchText) {
      if (_searchText.length === 0) {
        return users;
      }
      return FuseUtils.filterArrayByString(users, _searchText);
    }

    if (users) {
      setFilteredData(getFilteredArray(users, searchText));
    }
  }, [users, searchText]);

  if (!filteredData) {
    return null;
  }

  if (filteredData.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center h-full">
        <Typography color="textSecondary" variant="h5">
          There are no users!
        </Typography>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1, transition: { delay: 0.2 } }}
    >
      <UsersTable
        columns={columns}
        data={filteredData}
        onRowClick={(ev, row) => {
          if (row) {
            dispatch(openEditUserDialog(row.original));
          }
        }}
      />
    </motion.div>
  );
}

export default UsersList;

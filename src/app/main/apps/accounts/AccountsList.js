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
import {
  DialogTitle,
  DialogContentText,
  DialogContent,
  DialogActions,
  Checkbox,
  Chip,
} from '@material-ui/core';
import AccountsMultiSelectMenu from './AccountsMultiSelectMenu';
import AccountsTable from './AccountsTable';
import { openEditAccountDialog, removeAccount, selectAccounts } from './store/accountsSlice';

function AccountsList(props) {
  const dispatch = useDispatch();
  const accounts = useSelector(selectAccounts);
  const searchText = useSelector(({ accountsApp }) => accountsApp.accounts.searchText);
  // const account = useSelector(({ accountsApp }) => accountsApp.account);

  const [filteredData, setFilteredData] = useState(null);

  const confirmRemove = (id) => {
    dispatch(
      openDialog({
        children: (
          <>
            <DialogTitle id="alert-dialog-title">Delete Account</DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                You are about to delete this account. Are you sure?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => dispatch(closeDialog())} color="primary">
                Cancel
              </Button>
              <Button
                onClick={() => {
                  dispatch(removeAccount(id));
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
            selectedFlatRows.length > 0 && (
              <AccountsMultiSelectMenu selectedAccountIds={selectedRowIds} />
            )
          );
        },
        accessor: 'number',
        sortable: true,
        className: 'justify-center',
        width: 64,
      },
      {
        Header: 'Name',
        accessor: 'name',
        className: 'font-medium',
        sortable: true,
      },
      {
        Header: 'English Name',
        accessor: 'englishName',
        className: 'font-medium',
        sortable: true,
      },
      {
        Header: 'Grade',
        accessor: 'grade',
        sortable: true,
      },
      {
        Header: 'Detail by Account Object',
        accessor: 'detailByAccountObject',
        Cell: ({ row }) => (
          <Checkbox
            checked={row.original.detailByAccountObject}
            inputProps={{ 'aria-label': 'primary checkbox' }}
          />
        ),
        sortable: true,
      },
      {
        Header: 'Detail by Bank Account',
        accessor: 'detailByBankAccount',
        Cell: ({ row }) => (
          <Checkbox
            checked={row.original.detailByBankAccount}
            inputProps={{ 'aria-label': 'primary checkbox' }}
          />
        ),
        sortable: true,
      },
      {
        Header: 'Category Kind',
        accessor: 'categoryKind',
        sortable: true,
        Cell: ({ row }) => (
          <Chip size="small" color="secondary" label={row.original.categoryKind} />
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
        return accounts;
      }
      return FuseUtils.filterArrayByString(accounts, _searchText);
    }

    if (accounts) {
      setFilteredData(getFilteredArray(accounts, searchText));
    }
  }, [accounts, searchText]);

  if (!filteredData) {
    return null;
  }

  if (filteredData.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center h-full">
        <Typography color="textSecondary" variant="h5">
          There are no accounts!
        </Typography>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1, transition: { delay: 0.2 } }}
    >
      <AccountsTable
        columns={columns}
        data={filteredData}
        onRowClick={(ev, row) => {
          if (row) {
            dispatch(openEditAccountDialog(row.original));
          }
        }}
      />
    </motion.div>
  );
}

export default AccountsList;

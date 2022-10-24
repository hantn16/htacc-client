import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { removeAccounts } from './store/accountsSlice';

function AccountsMultiSelectMenu(props) {
  const dispatch = useDispatch();
  const { selectedAccountIds } = props;

  const [anchorEl, setAnchorEl] = useState(null);

  function openSelectedAccountMenu(event) {
    setAnchorEl(event.currentTarget);
  }

  function closeSelectedAccountsMenu() {
    setAnchorEl(null);
  }

  return (
    <>
      <IconButton
        className="p-0"
        aria-owns={anchorEl ? 'selectedAccountsMenu' : null}
        aria-haspopup="true"
        onClick={openSelectedAccountMenu}
      >
        <Icon>more_horiz</Icon>
      </IconButton>
      <Menu
        id="selectedAccountsMenu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={closeSelectedAccountsMenu}
      >
        <MenuList>
          <MenuItem
            onClick={() => {
              dispatch(removeAccounts(selectedAccountIds));
              closeSelectedAccountsMenu();
            }}
          >
            <ListItemIcon className="min-w-40">
              <Icon>delete</Icon>
            </ListItemIcon>
            <ListItemText primary="Remove" />
          </MenuItem>
        </MenuList>
      </Menu>
    </>
  );
}

export default AccountsMultiSelectMenu;

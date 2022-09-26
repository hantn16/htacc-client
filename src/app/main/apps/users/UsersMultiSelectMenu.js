import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { removeUsers } from './store/usersSlice';

function UsersMultiSelectMenu(props) {
  const dispatch = useDispatch();
  const { selectedUserIds } = props;

  const [anchorEl, setAnchorEl] = useState(null);

  function openSelectedUserMenu(event) {
    setAnchorEl(event.currentTarget);
  }

  function closeSelectedUsersMenu() {
    setAnchorEl(null);
  }

  return (
    <>
      <IconButton
        className="p-0"
        aria-owns={anchorEl ? 'selectedUsersMenu' : null}
        aria-haspopup="true"
        onClick={openSelectedUserMenu}
      >
        <Icon>more_horiz</Icon>
      </IconButton>
      <Menu
        id="selectedUsersMenu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={closeSelectedUsersMenu}
      >
        <MenuList>
          <MenuItem
            onClick={() => {
              dispatch(removeUsers(selectedUserIds));
              closeSelectedUsersMenu();
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

export default UsersMultiSelectMenu;

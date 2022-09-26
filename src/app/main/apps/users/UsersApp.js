import FusePageSimple from '@fuse/core/FusePageSimple';
import withReducer from 'app/store/withReducer';
import { useRef } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { useDeepCompareEffect } from '@fuse/hooks';
import UserDialog from './UserDialog';
import UsersHeader from './UsersHeader';
import UsersList from './UsersList';
import reducer from './store';
import { getUsers } from './store/usersSlice';

function UsersApp(props) {
  const dispatch = useDispatch();

  const pageLayout = useRef(null);
  const routeParams = useParams();
  useDeepCompareEffect(() => {
    dispatch(getUsers(routeParams));
    // dispatch(getUserData());
  }, [dispatch, routeParams]);

  return (
    <>
      <FusePageSimple
        classes={{
          contentWrapper: 'p-0 sm:p-24 h-full',
          content: 'flex flex-col h-full',
          leftSidebar: 'w-256 border-0',
          header: 'min-h-72 h-72 sm:h-136 sm:min-h-136',
          wrapper: 'min-h-0',
        }}
        header={<UsersHeader pageLayout={pageLayout} />}
        content={<UsersList />}
        // leftSidebarContent={<UsersSidebarContent />}
        sidebarInner
        ref={pageLayout}
        innerScroll
      />
      <UserDialog />
    </>
  );
}

export default withReducer('usersApp', reducer)(UsersApp);

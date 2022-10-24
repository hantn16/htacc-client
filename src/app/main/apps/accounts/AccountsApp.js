import FusePageSimple from '@fuse/core/FusePageSimple';
import withReducer from 'app/store/withReducer';
import { useRef } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { useDeepCompareEffect } from '@fuse/hooks';
import AccountDialog from './AccountDialog';
import AccountsHeader from './AccountsHeader';
import AccountsList from './AccountsList';
import reducer from './store';
import { getAccounts } from './store/accountsSlice';

function AccountsApp(props) {
  const dispatch = useDispatch();

  const pageLayout = useRef(null);
  const routeParams = useParams();
  useDeepCompareEffect(() => {
    dispatch(getAccounts(routeParams));
    // dispatch(getAccountData());
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
        header={<AccountsHeader pageLayout={pageLayout} />}
        content={<AccountsList />}
        // leftSidebarContent={<AccountsSidebarContent />}
        sidebarInner
        ref={pageLayout}
        innerScroll
      />
      <AccountDialog />
    </>
  );
}

export default withReducer('accountsApp', reducer)(AccountsApp);

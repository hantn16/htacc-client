import { lazy } from 'react';
import { Redirect } from 'react-router-dom';

const AccountsAppConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: '/apps/accounts/:id',
      component: lazy(() => import('./AccountsApp')),
    },
    {
      path: '/apps/accounts',
      component: () => <Redirect to="/apps/accounts/all" />,
    },
  ],
};

export default AccountsAppConfig;

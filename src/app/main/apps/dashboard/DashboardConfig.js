import { lazy } from 'react';
const DashboardConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: '/apps/dashboard',
      component: lazy(() => import('./Dashboard')),
    },
  ],
};

export default DashboardConfig;

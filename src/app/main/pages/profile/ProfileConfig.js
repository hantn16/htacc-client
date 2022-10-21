import { authRoles } from 'app/auth';
import { lazy } from 'react';

const ProfileConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  auth: authRoles.user,
  routes: [
    {
      path: '/pages/profile',
      component: lazy(() => import('./Profile')),
    },
  ],
};

export default ProfileConfig;

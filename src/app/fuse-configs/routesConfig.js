import { Redirect } from 'react-router-dom';
import FuseUtils from '@fuse/utils';
import ExampleConfig from 'app/main/example/ExampleConfig';
import FuseLoading from '@fuse/core/FuseLoading';
import Error404Page from 'app/main/404/Error404Page';
import LoginConfig from 'app/main/login/LoginConfig';
import RegisterConfig from 'app/main/register/RegisterConfig';
import appsConfigs from 'app/main/apps/appsConfigs';

const routeConfigs = [...appsConfigs, ExampleConfig, LoginConfig, RegisterConfig];

const routes = [
  // if you want to make whole app auth protected by default change defaultAuth for example:
  // ...FuseUtils.generateRoutesFromConfigs(routeConfigs, ['admin','staff','user']),
  // The individual route configs which has auth option won't be overridden.
  ...FuseUtils.generateRoutesFromConfigs(routeConfigs, null),
  {
    exact: true,
    path: '/',
    component: () => <Redirect to="/apps/dashboard" />,
  },
  {
    path: '/404',
    component: () => <Error404Page />,
  },
  {
    path: '/loading',
    exact: true,
    component: () => <FuseLoading />,
  },
  {
    component: () => <Redirect to="/" />,
  },
];

export default routes;

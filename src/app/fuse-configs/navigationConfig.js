import i18next from 'i18next';
import vi from './navigation-i18n/vi';
import en from './navigation-i18n/en';

i18next.addResourceBundle('en', 'navigation', en);
i18next.addResourceBundle('vi', 'navigation', vi);

const navigationConfig = [
  {
    id: 'applications',
    title: 'Applications',
    translate: 'APPLICATIONS',
    type: 'group',
    icon: 'apps',
    children: [
      {
        id: 'dashboards',
        title: 'Dashboards',
        translate: 'DASHBOARDS',
        type: 'item',
        icon: 'dashboard',
        url: 'apps/dashboard',
      },
      {
        id: 'users',
        title: 'User Management',
        translate: 'USER_MANAGEMENT',
        type: 'item',
        icon: 'today',
        url: 'apps/users',
      },
      {
        id: 'e-commerce',
        title: 'E-Commerce',
        translate: 'ECOMMERCE',
        type: 'collapse',
        icon: 'shopping_cart',
        url: '/apps/e-commerce',
        children: [
          {
            id: 'e-commerce-products',
            title: 'Products',
            type: 'item',
            url: '/apps/e-commerce/products',
            exact: true,
          },
          {
            id: 'e-commerce-product-detail',
            title: 'Product Detail',
            type: 'item',
            url: '/apps/e-commerce/products/1/a-walk-amongst-friends-canvas-print',
            exact: true,
          },
          {
            id: 'e-commerce-new-product',
            title: 'New Product',
            type: 'item',
            url: '/apps/e-commerce/products/new',
            exact: true,
          },
          {
            id: 'e-commerce-orders',
            title: 'Orders',
            type: 'item',
            url: '/apps/e-commerce/orders',
            exact: true,
          },
          {
            id: 'e-commerce-order-detail',
            title: 'Order Detail',
            type: 'item',
            url: '/apps/e-commerce/orders/1',
            exact: true,
          },
        ],
      },
      {
        id: 'academy',
        title: 'Academy',
        translate: 'ACADEMY',
        type: 'item',
        icon: 'school',
        url: '/apps/academy',
      },
      {
        id: 'mail',
        title: 'Mail',
        translate: 'MAIL',
        type: 'item',
        icon: 'email',
        url: '/apps/mail',
        badge: {
          title: 25,
          bg: '#F44336',
          fg: '#FFFFFF',
        },
      },
      {
        id: 'todo',
        title: 'To-Do',
        translate: 'TODO',
        type: 'item',
        icon: 'check_box',
        url: '/apps/todo',
        badge: {
          title: 3,
          bg: 'rgb(255, 111, 0)',
          fg: '#FFFFFF',
        },
      },
      {
        id: 'file-manager',
        title: 'File Manager',
        translate: 'FILE_MANAGER',
        type: 'item',
        icon: 'folder',
        url: '/apps/file-manager',
      },
      {
        id: 'contacts',
        title: 'Contacts',
        translate: 'CONTACTS',
        type: 'item',
        icon: 'account_box',
        url: '/apps/contacts/all',
      },
      {
        id: 'chat',
        title: 'Chat',
        translate: 'CHAT',
        type: 'item',
        icon: 'chat',
        url: '/apps/chat',
        badge: {
          title: 13,
          bg: 'rgb(9, 210, 97)',
          fg: '#FFFFFF',
        },
      },
      {
        id: 'scrumboard',
        title: 'Scrumboard',
        translate: 'SCRUMBOARD',
        type: 'item',
        icon: 'assessment',
        url: '/apps/scrumboard',
      },
      {
        id: 'notes',
        title: 'Notes',
        translate: 'NOTES',
        type: 'item',
        icon: 'note',
        url: '/apps/notes',
      },
    ],
  },
];

export default navigationConfig;

import MaterialIcon from '@material/react-material-icon';

const SidebarData = [
  { caption: 'Home' },

  // { caption: 'ORGANIZATION SETTINGS' },
  {
    title: 'ORGANIZATION SETTINGS',
    icon: <MaterialIcon icon="settings" />,
    id: 2.7,
    collapisble: true,
    children: [
      {
        title: 'Organization Details',
        href: '/organization/details',
        icon: <MaterialIcon icon="description" />,
      },
      {
        title: 'Document Types',
        href: '/organization/documenttypes',
        icon: <MaterialIcon icon="description" />,
      },
      {
        title: 'Compilance Requeriments',
        href: '/organization/requeriments',
        icon: <MaterialIcon icon="description" />,
      },
      {
        title: 'Organization Documents',
        href: '/organization/documents',
        icon: <MaterialIcon icon="description" />,
      },
      {
        title: 'Questionnaires',
        href: '/organization/questionnaires',
        icon: <MaterialIcon icon="description" />,
      },
      {
        title: 'Onboarding',
        href: '/organization/onboarding',
        icon: <MaterialIcon icon="description" />,
      },
      {
        title: 'Roles',
        href: '/organization/roles',
        icon: <MaterialIcon icon="description" />,
      },
    ],
  },


  {
    title: 'STAFF',
    icon: <MaterialIcon icon="face" />,
    id: 2.8,
    collapisble: true,
    children: [
      {
        title: 'Staff',
        href: '/staff/staff',
        icon: <MaterialIcon icon="face" />,
      },
      {
        title: 'Need Approval',
        href: '/staff/approval',
        icon: <MaterialIcon icon="check" />,
      },
      {
        title: 'Archived Staff',
        href: '/staff/archived',
        icon: <MaterialIcon icon="folder" />,
      },
    ],
  },

  {
    title: 'LIST',
    href: '/organization/list',
    icon: <MaterialIcon icon="home" />,
  },
  {
    title: 'My Profile',
    icon: <MaterialIcon icon="face" />,
    id: 2.9,
    collapisble: true,
    children: [
      {
        title: 'Dashboard',
        href: '/profile/dashboard',
        icon: <MaterialIcon icon="face" />,
      },
      {
        title: 'Profile Details',
        href: '/profile/details',
        icon: <MaterialIcon icon="check" />,
      },
      {
        title: 'Documents ',
        href: '/profile/documents',
        icon: <MaterialIcon icon="check" />,
      },
      {
        title: 'Organization Documents',
        href: '/profile/organizationdocuments',
        icon: <MaterialIcon icon="check" />,
      },
      {
        title: 'Professional Registration',
        href: '/profile/registration',
        icon: <MaterialIcon icon="check" />,
      },
      {
        title: 'References',
        href: '/profile/references',
        icon: <MaterialIcon icon="check" />,
      },
      {
        title: 'Questionnaires',
        href: '/profile/questionnares',
        icon: <MaterialIcon icon="check" />,
      },
      {
        title: 'Onboarding',
        href: '/profile/onboarding',
        icon: <MaterialIcon icon="check" />,
      },
      {
        title: 'Background Checks',
        href: '/profile/checks',
        icon: <MaterialIcon icon="check" />,
      },
    ],
  },
];

export default SidebarData;

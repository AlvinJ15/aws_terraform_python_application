import MaterialIcon from '@material/react-material-icon';

const SidebarData = [
  { caption: 'Home' },

  {
    title: 'HOME',
    href: '/organization',
    icon: <MaterialIcon icon="home" />,
  },

  // { caption: 'ORGANIZATION SETTINGS' },
  {
    title: 'ORGANIZATION SETTINGS',
    icon: <MaterialIcon icon="settings" />,
    id: 2.7,
    collapisble: true,
    children: [
      {
        title: 'Organization Details',
        href: '/organization/:idOrganization/details',
        icon: <MaterialIcon icon="description" />,
      },
      {
        title: 'Document Types',
        href: '/organization/:idOrganization/documenttypes',
        icon: <MaterialIcon icon="description" />,
      },
      {
        title: 'Compliance Requeriments',
        href: '/organization/:idOrganization/requeriments',
        icon: <MaterialIcon icon="description" />,
      },
      {
        title: 'Organization Documents',
        href: '/organization/:idOrganization/documents',
        icon: <MaterialIcon icon="description" />,
      },
      {
        title: 'Questionnaires',
        href: '/organization/:idOrganization/questionnaires',
        icon: <MaterialIcon icon="description" />,
      },
      {
        title: 'Onboarding',
        href: '/organization/:idOrganization/onboarding',
        icon: <MaterialIcon icon="description" />,
      },
      {
        title: 'Roles',
        href: '/organization/:idOrganization/roles',
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
        title: 'All Staff',
        href: '/organization/:idOrganization/staff',
        icon: <MaterialIcon icon="face" />,
      },
      // {
      //   title: 'Need Approval',
      //   href: '/organization/:idOrganization/staff/:idStaff/approval',
      //   icon: <MaterialIcon icon="check" />,
      // },
      // {
      //   title: 'Archived Staff',
      //   href: '/organization/:idOrganization/staff/:idStaff/archived',
      //   icon: <MaterialIcon icon="folder" />,
      // },
    ],
  },
  {
    title: 'My Profile',
    icon: <MaterialIcon icon="face" />,
    id: 2.9,
    collapisble: true,
    children: [
      {
        title: 'Dashboard',
        href: '/organization/:idOrganization/employee/:idEmployee/compliancePackages',
        icon: <MaterialIcon icon="face" />,
      },
      {
        title: 'Profile Details',
        href: '/organization/:idOrganization/employee/:idEmployee/profile',
        icon: <MaterialIcon icon="check" />,
      },
      {
        title: 'Documents ',
        href: '/organization/:idOrganization/employee/:idEmployee/documents',
        icon: <MaterialIcon icon="check" />,
      },
      {
        title: 'References ',
        href: '/organization/:idOrganization/employee/:idEmployee/references',
        icon: <MaterialIcon icon="check" />,
      },
      // {
      //   title: 'Organization Documents',
      //   href: '/profile/organizationdocuments',
      //   icon: <MaterialIcon icon="check" />,
      // },
      // {
      //   title: 'Professional Registration',
      //   href: '/profile/registration',
      //   icon: <MaterialIcon icon="check" />,
      // },
      // {
      //   title: 'References',
      //   href: '/profile/references',
      //   icon: <MaterialIcon icon="check" />,
      // },
      // {
      //   title: 'Questionnaires',
      //   href: '/profile/questionnares',
      //   icon: <MaterialIcon icon="check" />,
      // },
      // {
      //   title: 'Onboarding',
      //   href: '/profile/onboarding',
      //   icon: <MaterialIcon icon="check" />,
      // },
      // {
      //   title: 'Background Checks',
      //   href: '/profile/checks',
      //   icon: <MaterialIcon icon="check" />,
      // },
    ],
  },
];
export default SidebarData;

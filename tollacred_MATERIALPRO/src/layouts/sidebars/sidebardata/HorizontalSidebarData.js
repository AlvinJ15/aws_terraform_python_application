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
];
export default SidebarData;

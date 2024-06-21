import { lazy } from 'react';
import { Navigate } from 'react-router-dom';
import Loadable from '../layouts/loader/Loadable';
/****Layouts*****/

const FullLayout = Loadable(lazy(() => import('../layouts/FullLayout')));
const BlankLayout = Loadable(lazy(() => import('../layouts/BlankLayout')));
/***** Pages ****/


/***** CASL Access Control ****/
const CASL = Loadable(lazy(() => import('../views/apps/accessControlCASL/AccessControl')));

/***** Auth Pages ****/
const Error = Loadable(lazy(() => import('../views/auth/Error')));
const RegisterFormik = Loadable(lazy(() => import('../views/auth/RegisterFormik')));
const LoginFormik = Loadable(lazy(() => import('../views/auth/LoginFormik')));
const Maintanance = Loadable(lazy(() => import('../views/auth/Maintanance')));
const LockScreen = Loadable(lazy(() => import('../views/auth/LockScreen')));
const RecoverPassword = Loadable(lazy(() => import('../views/auth/RecoverPassword')));

/***** organization pages */
const DocumentTypes = Loadable(lazy(() => import('../views/organization/DocumentTypes')));
const Details = Loadable(lazy(() => import('../views/organization/Details')));
const Requeriments = Loadable(lazy(() => import('../views/organization/Requeriments')));
const Documents = Loadable(lazy(() => import('../views/organization/Documents')));
const Questionnaires = Loadable(lazy(() => import('../views/organization/Questionnaires')));
const Onboarding = Loadable(lazy(() => import('../views/organization/Onboarding')));
const Facilities = Loadable(lazy(() => import('../views/organization/Facilities')));
const StaffList = Loadable(lazy(() => import('../views/staff/StaffList')));
const StaffApproval = Loadable(lazy(() => import('../views/staff/StaffApproval')));
const StaffArchived = Loadable(lazy(() => import('../views/staff/StaffArchived')));

const OrganizationList = Loadable(lazy(() => import('../views/organization/OrganizationList')));
/***** profile pages */
const ProfileDashboard = Loadable(lazy(() => import('../views/profile/ProfileDashboard')));
const ProfileDetails = Loadable(lazy(() => import('../views/profile/ProfileDetails')));
const ProfileDocuments = Loadable(lazy(() => import('../views/profile/ProfileDocuments')));
const ProfileOrganizationDocuments = Loadable(lazy(() => import('../views/profile/ProfileOrganizationDocuments')));
const ProfileRegistration = Loadable(lazy(() => import('../views/profile/ProfileRegistration'))); 
const ProfileReferences = Loadable(lazy(() => import('../views/profile/ProfileReferences')));

/***** conversations pages */
const ChatStaff = Loadable(lazy(() => import('../views/staff/chat/ChatStaff')));

/***** file explorer pages */
const FileExplorer = Loadable(lazy(() => import('../views/file-explorer/FilesTable')));

const ProfileQuestionnaires = Loadable(lazy(() => import('../views/profile/ProfileQuestionnaires')));
const ProfileOnboarding = Loadable(lazy(() => import('../views/profile/ProfileOnboarding')));
const ProfileChecks = Loadable(lazy(() => import('../views/profile/ProfileChecks')));
/*****Routes******/

const AuthRoutes = [
  {
    path: '/',
    element: <FullLayout />,
    children: [
      { path: '/', name: 'Home', element: <OrganizationList /> },
      { path: '/casl', name: 'casl', exact: true, element: <CASL /> },
      { path: '*', element: <Navigate to="/auth/404" /> },
      //adding new routes 08/04/2024 total eclipse of the heart mp3 320kbps
      { path: '/organization', name: 'onboarding', exact: true, element: <OrganizationList /> },
      { path: '/organization/:idOrganization/details', name: 'organization-details', exact: true, element: <Details /> },
      { path: '/organization/:idOrganization/documenttypes', name: 'document-types', exact: true, element: <DocumentTypes /> },
      { path: '/organization/:idOrganization/requeriments', name: 'requeriments', exact: true, element: <Requeriments /> },
      { path: '/organization/:idOrganization/documents', name: 'documents', exact: true, element: <Documents /> },
      { path: '/organization/:idOrganization/questionnaires', name: 'questionnaires', exact: true, element: <Questionnaires /> },
      { path: '/organization/:idOrganization/onboarding', name: 'onboarding', exact: true, element: <Onboarding /> },
      { path: '/organization/:idOrganization/facilities', name: 'facilities', exact: true, element: <Facilities /> },

      { path: '/organization/:idOrganization/staff', name: 'list', exact: true, element: <StaffList /> },
      { path: '/staff/approval', name: 'approval', exact: true, element: <StaffApproval /> },
      { path: '/staff/archived', name: 'archived', exact: true, element: <StaffArchived /> },

      { path: '/organization/:idOrganization/conversations', name: 'chat', exact: true, element: <ChatStaff /> },

      { path: '/organization/:idOrganization/files', name: 'files', exact: true, element: <FileExplorer /> },

      { path: '/organization/:idOrganization/employee/:idEmployee/compliancePackages', name: 'dashboard', exact: true, element: <ProfileDashboard /> },
      { path: '/organization/:idOrganization/employee/:idEmployee/profile', name: 'details', exact: true, element: <ProfileDetails /> },
      { path: '/organization/:idOrganization/employee/:idEmployee/documents', name: 'documents', exact: true, element: <ProfileDocuments /> },
      { path: '/organization/:idOrganization/employee/:idEmployee/references', name: 'references', exact: true, element: <ProfileReferences /> },
      { path: '/organization/:idOrganization/user/:idUser/conversation', name: 'chat', exact: true, element: <ChatStaff /> },

      { path: '/profile/organizationdocuments', name: 'organizationdocuments', exact: true, element: <ProfileOrganizationDocuments /> },
      { path: '/profile/registration', name: 'registration', exact: true, element: <ProfileRegistration /> },
      { path: '/profile/references', name: 'references', exact: true, element: <ProfileReferences /> },
      { path: '/profile/questionnares', name: 'questionnares', exact: true, element: <ProfileQuestionnaires /> },
      { path: '/profile/onboarding', name: 'onboarding', exact: true, element: <ProfileOnboarding /> },
      { path: '/profile/checks', name: 'checks', exact: true, element: <ProfileChecks /> },
    ],
  },
  {
    path: '/auth',
    element: <BlankLayout />,
    children: [
      { path: '404', element: <Error /> },
      { path: '*', element: <Navigate to="/auth/404" /> },
      { path: 'registerformik', element: <RegisterFormik /> },
      { path: 'loginformik', element: <LoginFormik /> },
      { path: 'maintanance', element: <Maintanance /> },
      { path: 'lockscreen', element: <LockScreen /> },
      { path: 'recoverpwd', element: <RecoverPassword /> },
    ]
  },
];

export default AuthRoutes;

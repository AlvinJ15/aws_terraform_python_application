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
const StaffList = Loadable(lazy(() => import('../views/staff/StaffList')));
const StaffApproval = Loadable(lazy(() => import('../views/staff/StaffApproval')));
const StaffArchived = Loadable(lazy(() => import('../views/staff/StaffArchived')));

const OrganizationList = Loadable(lazy(() => import('../views/organization/OrganizationList')));
/*****Routes******/

const ThemeRoutes = [
  {
    path: '/',
    element: <FullLayout />,
    children: [
      { path: '/', name: 'Home', element: <Navigate to="/organization/details" /> },  
      { path: '/casl', name: 'casl', exact: true, element: <CASL /> },
      { path: '*', element: <Navigate to="/auth/404" /> },
      //adding new routes 08/04/2024 total eclipse of the heart mp3 320kbps
      { path: '/organization/details', name: 'organization-details', exact: true, element: <Details /> },
      { path: '/organization/documenttypes', name: 'document-types', exact: true, element: <DocumentTypes /> },
      { path: '/organization/requeriments', name: 'requeriments', exact: true, element: <Requeriments /> },
      { path: '/organization/documents', name: 'documents', exact: true, element: <Documents /> },
      { path: '/organization/questionnaires', name: 'questionnaires', exact: true, element: <Questionnaires /> },
      { path: '/organization/onboarding', name: 'onboarding', exact: true, element: <Onboarding /> },
      { path: '/staff/staff', name: 'list', exact: true, element: <StaffList /> },
      { path: '/staff/approval', name: 'approval', exact: true, element: <StaffApproval /> },
      { path: '/staff/archived', name: 'archived', exact: true, element: <StaffArchived /> },
      { path: '/organization/list', name: 'onboarding', exact: true, element: <OrganizationList /> },
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

export default ThemeRoutes;

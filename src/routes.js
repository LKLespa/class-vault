import { createBrowserRouter } from "react-router-dom";
import AuthWrapper from "./components/Layout/AuthWrapper";
import SignInForm from "./components/Auth/SignInForm";
import SignUpForm from "./components/Auth/SignUpForm";
import ErrorPage from "./pages/ErrorPage";
import HomePage from "./pages/HomePage";
import { DashboardLayout } from "./components/Layout/DashboardLayout";
import AllCollabVaultsPage from "./pages/AllCollabVaultsPage";
import ProfilePage from "./pages/ProfilePage";
import CollabVaultPage from "./pages/CollabVaultPage";
import AllClassRoomsPage from "./pages/AllClassRoomsPage";
import ClassRoomPage from "./pages/ClassRoomPage";
import InstitutePage from "./pages/InstitutePage";
import NotificationsPage from "./pages/NotificationsPage";
import AllClassVaultsPage from "./pages/AllClassVaultsPage";
import ClassVaultPage from "./pages/ClassVaultPage";
import SettingsPage from "./pages/SettingsPage";

// const routeNames = {
//     home: "",
//     auth: "auth",
//     signIn: "signin",
//     signUp: "signup",
//     collabvaults: 'collab-vaults',
// };

const pathLinks = {
    home: `/`,
    signIn: `/signin`,
    signUp: `/signup`,
    profile: '/profile',
    institutes: `/institute`,
    collabvaults: `/vaults/collab`,
    classrooms: '/room',
    classvaults: `/vaults/class`,
    notifications: `/notifications`,
    settings: `/settings`,
}

const routes = createBrowserRouter([
    {
        element: <DashboardLayout />,
        children: [
            {
                path: pathLinks.home,
                element: <HomePage />,
            },
            {
                path: `${pathLinks.institutes}/:insituteID`,
                element: <InstitutePage />
            },
            {
                path: pathLinks.notifications,
                element: <NotificationsPage />
            },
            {
                path: pathLinks.profile,
                element: <ProfilePage />
            },
            {
                path: pathLinks.classrooms,
                element: <AllClassRoomsPage />,
            },
            {
                path: `${pathLinks.classrooms}/:roomID`,
                element: <ClassRoomPage />
            },
            {
                path: pathLinks.classvaults,
                element: <AllClassVaultsPage />,
            },
            {
                path: `${pathLinks.classvaults}/:vaultID`,
                element: <ClassVaultPage />
            },
            {
                path: pathLinks.collabvaults,
                element: <AllCollabVaultsPage />,
            },
            {
                path: `${pathLinks.collabvaults}/:vaultID`,
                element: <CollabVaultPage />
            },
            {
                path: pathLinks.settings,
                element: <SettingsPage />
            }
        ]
    },

    {
        element: <AuthWrapper />,
        children: [
            { path: pathLinks.signIn, element: <SignInForm /> },
            { path: pathLinks.signUp, element: <SignUpForm /> },
        ],
    },
    {
        path: "*",
        element: <ErrorPage />
    }
]);

export default routes;
export { pathLinks };

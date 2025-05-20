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
//     collabVaults: 'collab-vaults',
// };

const pathLinks = {
    home: `/`,
    signIn: `/signin`,
    signUp: `/signup`,
    profile: '/profile',
    institute: `/institute`,
    collabVaults: `/vaults/collab`,
    classRooms: '/room',
    classVaults: `/vaults/class`,
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
                path: `${pathLinks.institute}/:insituteID`,
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
                path: pathLinks.classRooms,
                element: <AllClassRoomsPage />,
            },
            {
                path: `${pathLinks.classRooms}/:roomID`,
                element: <ClassRoomPage />
            },
            {
                path: pathLinks.classVaults,
                element: <AllClassVaultsPage />,
            },
            {
                path: `${pathLinks.classVaults}/:vaultID`,
                element: <ClassVaultPage />
            },
            {
                path: pathLinks.collabVaults,
                element: <AllCollabVaultsPage />,
            },
            {
                path: `${pathLinks.collabVaults}/:vaultID`,
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

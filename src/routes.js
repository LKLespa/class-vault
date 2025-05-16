import { createBrowserRouter } from "react-router-dom";
import AuthWrapper from "./components/Layout/AuthWrapper";
import SignInForm from "./components/Auth/SignInForm";
import SignUpForm from "./components/Auth/SignUpForm";
import ErrorPage from "./pages/ErrorPage";
import HomePage from "./pages/HomePage";

const routeNames = {
    home: "",
    auth: "auth",
    signIn: "signin",
    signUp: "signup",
};

const pathLinks = {
    home: "/",
    signIn: `/${routeNames.signIn}`,
    signUp: `/${routeNames.signUp}`,
}

const routes = createBrowserRouter([
    {
        path: routeNames.home,
        element: <HomePage />
    },

    {
        element: <AuthWrapper />,
        children: [
            { path: routeNames.signIn, element: <SignInForm /> },
            { path: routeNames.signUp, element: <SignUpForm /> },
        ],
    },
    {
        path: "*",
        element: <ErrorPage />
    }
]);

export default routes;
export { pathLinks };

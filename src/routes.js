import { createBrowserRouter } from "react-router-dom";
import AuthWrapper from "./pages/AuthWrapper";
import SignInForm from "./components/Auth/SignInForm";
import SignUpForm from "./components/Auth/SignUpForm";
import ErrorPage from "./pages/ErrorPage";

const routeNames = {
    home: "/",
    auth: "auth",
    signIn: "sign-in",
    signUp: "sign-up",
};

const pathLinks = {
    home: routeNames.home,
    signIn: `/${routeNames.signIn}`,
    signUp: `/${routeNames.signUp}`,
}

const routes = createBrowserRouter([
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

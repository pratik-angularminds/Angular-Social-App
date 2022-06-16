import { lazy } from "react";

// Lazy load your page components
const Home = lazy(() => import("../pages/home/home"));
const Login = lazy(() => import("../pages/auth/login/login"));
const book =lazy(()=>import("../pages/Bookmark/Bookmark"));
/*
 * Route path: URLs
 */
export const paths = {
  home: "/home",
  login: "/auth/login",
  bookmark:"/Bookmark",
};

/*
 * Routes: path & lazy loaded component
 */
export const routes: any[] = [
  {
    path: paths.home,
    component: Home,
  },
  {
    path: paths.login,
    component: Login,
  },
  {
    path: paths.bookmark,
    component: book,
  },
];

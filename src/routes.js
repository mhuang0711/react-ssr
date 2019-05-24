// import Home from "./components/Home";
import About from "./component/About";
import Contact from "./component/Contact";

export default [

    {
        path: "/",
        component: About,
        exact: true,
    },
    {
        path: "/contact",
        component: Contact,
        exact: true,
    }
];

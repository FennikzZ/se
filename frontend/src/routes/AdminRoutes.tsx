import { lazy } from "react";

import { RouteObject } from "react-router-dom";

import Loadable from "../components/third-patry/Loadable";

import FullLayout from "../layout/FullLayout";


const MainPages = Loadable(lazy(() => import("../pages/authentication/Login")));

const Dashboard = Loadable(lazy(() => import("../pages/dashboard")));

const Customer = Loadable(lazy(() => import("../pages/customer")));

const CreateCustomer = Loadable(lazy(() => import("../pages/customer/create")));

const EditCustomer = Loadable(lazy(() => import("../pages/customer/edit")));

//promotion
const Promotion = Loadable(lazy(() => import("../pages/promotion")));

const PromotionCreate = Loadable(lazy(() => import("../pages/promotion/create")));

const PromotionEdit = Loadable(lazy(() => import("../pages/promotion/edit")));


const AdminRoutes = (isLoggedIn : boolean): RouteObject => {

  return {

    path: "/",

    element: isLoggedIn ? <FullLayout /> : <MainPages />,

    children: [

      {

        path: "/",

        element: <Dashboard />,

      },

      {

        path: "/customer",

        children: [

          {

            path: "/customer",

            element: <Customer />,

          },

          {

            path: "/customer/create",

            element: <CreateCustomer />,

          },

          {

            path: "/customer/edit/:id",

            element: <EditCustomer />,

          },

        ],

      },

      //promotion
      {

        path: "/promotion",

        children: [

          {

            path: "/promotion",

            element: <Promotion />,

          },

          {

            path: "/promotion/create",

            element: <PromotionCreate />,

          },

          {

            path: "/promotion/edit/:id",

            element: <PromotionEdit />,

          },

        ],

      },

    ],

  };

};


export default AdminRoutes;
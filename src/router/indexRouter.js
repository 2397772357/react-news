import { Navigate } from "react-router-dom";
import { lazy } from "react";
import Login from "../views/login/login";
import Home from "../views/newssandbox/Home/Home";
import NewsSandBox from "../views/newssandbox/newssandbox";
// import UserList from "../views/newssandbox/Userlist/User";
// import RightList from "../views/newssandbox/rightlist/Right";
// import RoleList from "../views/newssandbox/rolelist/Role";
// import NoPermission from "../views/newssandbox/NoPermission/NoPermission";
// import Audit from "../views/newssandbox/audit-manage/Audit/Audit.js";
// import AuditList from "../views/newssandbox/audit-manage/AuditList/AuditList.js";
// import NewsAdd from "../views/newssandbox/news-manage/NewsAdd/NewsAdd.js";
// import NewsCategory from "../views/newssandbox/news-manage/NewsCategory/NewsCategory.js";
// import NewsDraft from "../views/newssandbox/news-manage/NewsDraft/NewsDraft.js";
// import Published from "../views/newssandbox/publish-manage/Published/Published.js";
// import Unpublished from "../views/newssandbox/publish-manage/Unpublished/Unpublished.js";
// import Sunset from "../views/newssandbox/publish-manage/Sunset/Sunset.js";
// import NewsPreview from "../views/newssandbox/news-manage/NewsPreview/NewsPreview";
// import NewsUpdate from "../views/newssandbox/news-manage/NewsUpdate/NewsUpdate";

const UserList = lazy(() => import(`../views/newssandbox/Userlist/User`));
const RightList = lazy(() => import(`../views/newssandbox/rightlist/Right`));
const RoleList = lazy(() => import(`../views/newssandbox/rolelist/Role`));
const NoPermission = lazy(() =>
  import(`../views/newssandbox/NoPermission/NoPermission`)
);
const Audit = lazy(() =>
  import(`../views/newssandbox/audit-manage/Audit/Audit.js`)
);
const AuditList = lazy(() =>
  import(`../views/newssandbox/audit-manage/AuditList/AuditList.js`)
);
const NewsAdd = lazy(() =>
  import(`../views/newssandbox/news-manage/NewsAdd/NewsAdd.js`)
);
const NewsCategory = lazy(() =>
  import(`../views/newssandbox/news-manage/NewsCategory/NewsCategory.js`)
);
const NewsDraft = lazy(() =>
  import(`../views/newssandbox/news-manage/NewsDraft/NewsDraft.js`)
);
const Published = lazy(() =>
  import(`../views/newssandbox/publish-manage/Published/Published.js`)
);
const Unpublished = lazy(() =>
  import(`../views/newssandbox/publish-manage/Unpublished/Unpublished.js`)
);
const Sunset = lazy(() =>
  import(`../views/newssandbox/publish-manage/Sunset/Sunset.js`)
);
const NewsPreview = lazy(() =>
  import(`../views/newssandbox/news-manage/NewsPreview/NewsPreview`)
);
const NewsUpdate = lazy(() =>
  import(`../views/newssandbox/news-manage/NewsUpdate/NewsUpdate`)
);

export default [
  {
    path: "/login",
    element: <Login></Login>,
  },
  {
    path: "/",
    element: <NewsSandBox></NewsSandBox>,
    children: [
      {
        path: "home",
        element: <Home></Home>,
      },
      {
        path: "user-manage/list",
        element: <UserList></UserList>,
      },
      {
        path: "right-manage/role/list",
        element: <RoleList></RoleList>,
      },
      {
        path: "right-manage/right/list",
        element: <RightList></RightList>,
      },
      {
        path: "news-manage/add",
        element: <NewsAdd></NewsAdd>,
      },
      {
        path: "news-manage/draft",
        element: <NewsDraft></NewsDraft>,
      },
      {
        path: "news-manage/category",
        element: <NewsCategory></NewsCategory>,
      },
      {
        path: "news-manage/preview/:id",
        element: <NewsPreview></NewsPreview>,
      },
      {
        path: "news-manage/update/:id",
        element: <NewsUpdate></NewsUpdate>,
      },
      {
        path: "audit-manage/audit",
        element: <Audit></Audit>,
      },
      {
        path: "audit-manage/list",
        element: <AuditList></AuditList>,
      },
      {
        path: "publish-manage/unpublished",
        element: <Unpublished></Unpublished>,
      },
      {
        path: "publish-manage/published",
        element: <Published></Published>,
      },
      {
        path: "publish-manage/sunset",
        element: <Sunset></Sunset>,
      },
      {
        path: "",
        element: <Navigate to="home"></Navigate>,
      },
      {
        path: "*",
        element: <NoPermission></NoPermission>,
      },
    ],
  },
];

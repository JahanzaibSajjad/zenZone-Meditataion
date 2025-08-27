import Login from "views/auth/Login.js";
import ForgotPassword from "views/auth/ForgotPassword";
import MeditationsTable from "views/meditation/Meditations";
import Meditation from "views/meditation/Meditation";
import AddMeditation from "views/meditation/AddMeditation";
import MoodsTable from "views/mood/Moods";
import SheetsTable from "views/sheet/Sheets";
import AddSheet from "views/sheet/AddSheet";
import Sheet from "views/sheet/Sheet";
import ResetPassword from "views/auth/ResetPassword";
import ChangePassword from "views/auth/ChangePassword";
import Books from "views/book/Books";
import Podcasts from "views/podcast/Podcasts";
import Websites from "views/website/Websites";
import Events from "views/event/Events";
import Videos from "views/video/Videos";
import AddEvent from "views/event/AddEvent";
import Event from "views/event/Event";
import AddBook from "views/book/AddBook";
import Book from "views/book/Book";
import AddPodcast from "views/podcast/AddPodcast";
import Podcast from "views/podcast/Podcast";

export const routes = [
  {
    path: "/login",
    name: "Login",
    miniName: "L",
    component: Login,
    layout: "/auth",
  },
  {
    path: "/forgot-password",
    name: "Forgot Password",
    miniName: "FP",
    component: ForgotPassword,
    layout: "/auth",
  },
  {
    path: "/reset-password/:id",
    name: "Reset Password",
    miniName: "RP",
    component: ResetPassword,
    layout: "/auth",
  },
];

export const sidebarRoutes = [
  {
    path: "/meditations",
    name: "Meditations",
    icon: "/meditation",
    component: MeditationsTable,
    layout: "/admin",
  },
  {
    path: "/moods",
    name: "Moods",
    icon: "/mood",
    component: MoodsTable,
    layout: "/admin",
  },
  {
    path: "/sheets",
    name: "Suggestions",
    icon: "/sheet",
    component: SheetsTable,
    layout: "/admin",
  },
  {
    path: "/meditation/:id",
    name: "Meditation",
    component: Meditation,
    layout: "/admin",
  },
  {
    path: "/add-meditation/:id",
    name: "Edit Meditation",
    component: AddMeditation,
    layout: "/admin",
  },
  {
    path: "/add-meditation/",
    name: "Add Meditation",
    component: AddMeditation,
    layout: "/admin",
  },
  {
    path: "/sheet/:id",
    name: "Sheet",
    component: Sheet,
    layout: "/admin",
  },
  {
    path: "/add-sheet/:id",
    name: "Edit Sheet",
    component: AddSheet,
    layout: "/admin",
  },
  {
    path: "/add-sheet/",
    name: "Add Sheet",
    component: AddSheet,
    layout: "/admin",
  },
  {
    path: "/change-password",
    name: "Change Password",
    component: ChangePassword,
    layout: "/admin",
  },
  {
    path: "/events",
    name: "Meeting & Event",
    icon: "/event",
    component: Events,
    layout: "/admin",
  },
  {
    path: "/add-event/:id",
    name: "Edit Event",
    component: AddEvent,
    layout: "/admin",
  },
  {
    path: "/add-event/",
    name: "Add Event",
    component: AddEvent,
    layout: "/admin",
  },
  {
    path: "/event/:id",
    name: "Event",
    component: Event,
    layout: "/admin",
  },
  {
    path: "/add-book/:id",
    name: "Edit Book",
    component: AddBook,
    layout: "/admin",
  },
  {
    path: "/add-book/",
    name: "Add Book",
    component: AddBook,
    layout: "/admin",
  },
  {
    path: "/book/:id",
    name: "Book",
    component: Book,
    layout: "/admin",
  },
  {
    path: "/add-podcast/:id",
    name: "Edit Podcast",
    component: AddPodcast,
    layout: "/admin",
  },
  {
    path: "/add-podcast/",
    name: "Add Podcast",
    component: AddPodcast,
    layout: "/admin",
  },
  {
    path: "/podcast/:id",
    name: "Podcast",
    component: Podcast,
    layout: "/admin",
  },
  {
    path: "/videos",
    name: "Videos",
    component: Videos,
    icon: "/video",
    layout: "/admin",
  },
  {
    collapse: true,
    name: "Library",
    icon: "/library",
    state: "dashboardsCollapse",
    views: [
      {
        path: "/books",
        name: "Books",
        miniName: "B",
        component: Books,
        layout: "/admin",
      },
      {
        path: "/podcasts",
        name: "Podcasts",
        miniName: "P",
        component: Podcasts,
        layout: "/admin",
      },
      {
        path: "/websites",
        name: "Websites",
        miniName: "W",
        component: Websites,
        layout: "/admin",
      },
    ],
  },
];

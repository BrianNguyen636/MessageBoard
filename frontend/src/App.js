import logo from './logo.svg';
import LoginPage from "./components/LoginPage.js";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import { useState } from "react";

import './App.css';

const router = createBrowserRouter([
  {
    path: "/",
    element: <LoginPage />,
    // errorElement: <Error />,
    // children
  },
])



function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;

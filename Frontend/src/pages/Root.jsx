import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { Outlet } from "react-router-dom";

export default function Root() {
  return (
    <>
      <div id="detail">
        <Outlet />
      </div>
      <Footer />
    </>
  );
}
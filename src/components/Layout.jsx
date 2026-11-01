import {  Outlet } from "react-router-dom";
import Nav from "./Nav";
import Footer from "./Footer";

const Layout = () => {
  return (
    <>
      <Nav />
      <main className="main">
        {/* Outlet goes here, where child pages render */}
      </main>
    </>
  )
}

export default Layout;
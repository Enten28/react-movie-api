import {  Outlet } from "react-router-dom";
import Nav from "./Nav";
import Footer from "./Footer";

const Layout = () => {
  return (
    <>
      <Nav />
      <main className="main">
        <Outlet />
      </main>
      <Footer />
    </>
  )
}

export default Layout;
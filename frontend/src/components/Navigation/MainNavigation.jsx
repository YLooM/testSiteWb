import { Link } from "react-router-dom";
import { useState } from "react";

import NavLinks from "./NavLinks";
import SideDrawer from "./SideDrawer";
import Backdrop from "../UIElements/Backdrop";

import "./MainNavigation.css";

const MainNavigation = (props) => {
  const [drawerIsOpen, setDrawerIsOpen] = useState(false);
  const openDrawer = () => {
    setDrawerIsOpen(true);
  };
  const closeDrawer = () => {
    setDrawerIsOpen(false);
  };

  return (
    <>
      {drawerIsOpen && <Backdrop onClick={closeDrawer} />}
      {drawerIsOpen && (
        <SideDrawer>
          <nav className="main-navigation__drawer-nav">
            <NavLinks />
          </nav>
        </SideDrawer>
      )}
      <header className="main-header">
        <button className="main-navigation__menu-btn" onClick={openDrawer}>
          <span />
          <span />
          <span />
        </button>
        <h1 className="main-navigation__title">
          <Link to="/sport/sports">
            Laval Sport
            <img
              src="https://cdn-icons-png.freepik.com/256/5351/5351486.png?semt=ais_hybrid"
              alt="Logo"
              height={40}
              width={50}
            />
          </Link>
        </h1>
        <h2></h2>

        <nav className="main-navigation__header-nav">
          <NavLinks />
        </nav>
      </header>
    </>
  );
};

export default MainNavigation;

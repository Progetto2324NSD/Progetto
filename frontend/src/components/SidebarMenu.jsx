import React, { useEffect } from "react";
import "../pages/stile/style.css";
import 'boxicons/css/boxicons.min.css';
import UserImage from "../utils/images/user.jpg";

function SidebarMenu() {
  useEffect(() => {
    const sidebar = document.querySelector('nav.sidebar');
    const toggle = document.querySelector(".toggle");
    const searchBtn = document.querySelector(".search-box");

    // Toggle sidebar visibility
    const handleToggleClick = () => {
      sidebar.classList.toggle("close");
    };

    // Show sidebar when search button is clicked
    const handleSearchClick = () => {
      sidebar.classList.remove("close");
    };

    toggle.addEventListener("click", handleToggleClick);
    if (searchBtn) searchBtn.addEventListener("click", handleSearchClick);

    // Cleanup event listeners on component unmount
    return () => {
      toggle.removeEventListener("click", handleToggleClick);
      if (searchBtn) searchBtn.removeEventListener("click", handleSearchClick);
    };
  }, []);

  return (
    <nav className="sidebar close">
      <header>
        <div className="image-text">
          <span className="image">
            <img src={UserImage} alt="" />
          </span>

          <div className="text logo-text">
            <span className="name">Nome Utente</span>
            <span className="profession">Utente</span>
          </div>
        </div>

        <i className='bx bx-chevron-right toggle'></i>
      </header>

      <div className="menu-bar">
        <div className="menu">
          <ul className="menu-links">
            <li className="nav-link">
              <a href="#">
                <i className='bx bx-home-alt icon'></i>
                <span className="text nav-text">Dashboard</span>
              </a>
            </li>
            <li className="nav-link">
              <a href="#">
                <i className='bx bx-bar-chart-alt-2 icon'></i>
                <span className="text nav-text">Revenue</span>
              </a>
            </li>
            <li className="nav-link">
              <a href="#">
                <i className='bx bx-bell icon'></i>
                <span className="text nav-text">Notifications</span>
              </a>
            </li>
            <li className="nav-link">
              <a href="#">
                <i className='bx bx-pie-chart-alt icon'></i>
                <span className="text nav-text">Analytics</span>
              </a>
            </li>
            <li className="nav-link">
              <a href="#">
                <i className='bx bx-heart icon'></i>
                <span className="text nav-text">Likes</span>
              </a>
            </li>
            <li className="nav-link">
              <a href="#">
                <i className='bx bx-wallet icon'></i>
                <span className="text nav-text">Wallets</span>
              </a>
            </li>
          </ul>
        </div>

        <div className="bottom-content">
          <li className="">
            <a href="#">
              <i className='bx bx-log-out icon'></i>
              <span className="text nav-text">Logout</span>
            </a>
          </li>
        </div>
      </div>
    </nav>
  );
}

export default SidebarMenu;

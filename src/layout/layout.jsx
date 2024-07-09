import React, { useState, useEffect, Fragment } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { Menu, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import moment from "moment";
import SideBar from "../Layout1/SideBar/SideBar";

const Layout1 = () => {
  const [theme, setTheme] = useState("light");
  const [sideNavShow, setSideNavShow] = useState(false);
  const [sideBarMinimize, setSideBarMinimize] = useState(true);
  const [active, setActive] = useState(false);
  const [walkThroughPending, setWalkThroughPending] = useState(false);
  const [walkThroughSteps, setWalkThroughSteps] = useState("0");

  const navigate = useNavigate();
  const location = useLocation();

  const onNavigationClick = (currLocation) => {
    navigate(currLocation);
    setSideNavShow(false);
  };

  useEffect(() => {
    let isLogin = localStorage.getItem("auth-token");
    if (!isLogin && location.pathname !== "/") {
      navigate("/");
    } else if (isLogin && location.pathname === "/") {
      navigate("/dashboard");
    }
    setWalkThroughPending(
      JSON.parse(localStorage.getItem("walkthrough"))?.walkThroughPending
    );
    setWalkThroughSteps(
      JSON.parse(localStorage.getItem("walkthrough"))?.walkThroughSteps
    );
  }, [location]);

  useEffect(() => {
    const detectTimeZone = () => {
      const detectedTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      localStorage.setItem("timeZone", detectedTimeZone);
    };
    detectTimeZone();
  }, []);

  let companyDetails = localStorage.getItem("company");
  if (companyDetails) {
    companyDetails = JSON.parse(companyDetails);
  }

  const isCompanyAdmin = ["company"].includes(localStorage.getItem("roles"));
  const isCompanyUser = localStorage.getItem("company");
  let userStatus = localStorage.getItem("status");
  return (
    <>
      <div className={`wrapper ${theme} bg-theme-blue overflow-y-hidden`}>
        {/* <button data-drawer-target="logo-sidebar" data-drawer-toggle="logo-sidebar" aria-controls="logo-sidebar" type="button" className="z-50inline-flex items-center p-2 ml-3 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600">
                    <span className="sr-only">Close</span>
                    <svg onClick={() => setSideNavShow(false)} type="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                        <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                    </svg>
                </button> */}

        <div
          style={{ position: "fixed", width: "100%", zIndex: 100000 }}
          className="md:hidden flex place-content-between bg-theme-blue"
        >
          <button
            data-drawer-target="logo-sidebar"
            data-drawer-toggle="logo-sidebar"
            aria-controls="logo-sidebar"
            type="button"
            className="inline-flex items-center p-2 ml-3 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
          >
            <span className="sr-only">Open sidebar</span>
            <svg
              onClick={() => setSideNavShow(true)}
              className="w-6 h-6"
              aria-hidden="true"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                clipRule="evenodd"
                fillRule="evenodd"
                d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
              ></path>
            </svg>
          </button>
          <div className="m-4">
            <Menu as="div" className="relative inline-block text-left">
              <div>
                <Menu.Button className="inline-flex w-full justify-center">
                  <div className="relative inline-flex items-center justify-center w-10 h-10 overflow-hidden bg-gray-200 rounded-full dark:bg-gray-600">
                    <span className="font-medium text-gray-600 dark:text-gray-300 capitalize">
                      {
                        localStorage
                          .getItem("user-name")
                          ?.split(" ")[0]
                          ?.split("")[0]
                      }
                    </span>
                  </div>
                </Menu.Button>
              </div>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white border ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="py-1">
                    <Menu.Item>
                      {({ active }) => (
                        <a
                          onClick={() => onNavigationClick("/profile")}
                          href="#"
                          className={`${
                            active
                              ? "bg-gray-100 text-gray-900 "
                              : "text-gray-700 "
                          }block px-4 py-2 text-sm`}
                        >
                          My Profile
                        </a>
                      )}
                    </Menu.Item>
                    {/*
                                        <Menu.Item>
                                            {({ active }) => (
                                                <a
                                                    href="#"
                                                    className={`${active ? 'bg-gray-100 text-gray-900 ' : 'text-gray-700 '}block px-4 py-2 text-sm`}
                                                >
                                                    Support
                                                </a>
                                            )}
                                        </Menu.Item>
                                        */}
                    <Menu.Item>
                      {({ active }) => (
                        <a
                          onClick={() => {
                            onNavigationClick("/");
                            localStorage.clear();
                          }}
                          href=""
                          className={`${
                            active
                              ? "bg-gray-100 text-gray-900 "
                              : "text-gray-700 "
                          }block px-4 py-2 text-sm`}
                        >
                          Logout
                        </a>
                      )}
                    </Menu.Item>
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>
          </div>
        </div>
        {/* <SideBar/> */}

        <aside
          id="logo-sidebar"
          className={`fixed top-0 left-0 text-gray-800 z-40 ${
            sideBarMinimize ? "w-[65px]" : "w-[270px]"
          } h-screen transition-transform ${
            !sideNavShow && "-translate-x-full sm:translate-x-0"
          } md:border-r-[1px] border-layout-color`}
          aria-label="Sidebar"
        >
          <div className="h-full px-3 py-3.5 bg-theme-side-nav dark:bg-gray-800">
            <div className="flex items-center mb-5">
              <img
                src={require("../assets/logo.png")}
                className="h-6 sm:h-9"
                alt="CONTINGENT FITNESS"
              />
              {!sideBarMinimize && (
                <div className="ml-2">
                  <>
                    <span className="self-center text-lg font-bold whitespace-nowrap text-gray-300 dark:text-gray-300 mr-1">
                      CONTINGENT
                    </span>
                    <span className="self-center text-lg font-bold whitespace-nowrap text-gray-300 dark:text-gray-300">
                      FITNESS
                    </span>
                  </>
                  <div className="self-center text-xs font-bold whitespace-nowrap text-gray-300 dark:text-gray-300">
                    {companyDetails?.companyName}
                  </div>
                </div>
              )}
              <span className="mx-auto"></span>
              {sideNavShow && (
                <button
                  data-drawer-target="logo-sidebar"
                  data-drawer-toggle="logo-sidebar"
                  aria-controls="logo-sidebar"
                  type="button"
                  className="inline-flex items-center p-2 ml-10 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                >
                  <span className="sr-only">Close</span>
                  <svg
                    onClick={() => setSideNavShow(false)}
                    type="button"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="w-5 h-5"
                  >
                    <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                  </svg>
                </button>
              )}
            </div>
            <ul className="space-y-2">
              <li>
                <span
                  onClick={() =>
                    (walkThroughSteps != "0" || isCompanyUser) &&
                    onNavigationClick("/device")
                  }
                  href=""
                  className={`flex items-center p-2 ${
                    (walkThroughSteps != "0" || isCompanyUser) &&
                    " text-gray-400 hover:bg-[#202C40] hover:text-gray-100 cursor-pointer "
                  } rounded-lg ${
                    location?.pathname === "/device" &&
                    "bg-[#202C40] text-gray-100"
                  } dark:text-white dark:hover:bg-gray-700`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="w-5 h-5"
                  >
                    <path d="M8 16.25a.75.75 0 01.75-.75h2.5a.75.75 0 010 1.5h-2.5a.75.75 0 01-.75-.75z" />
                    <path
                      fillRule="evenodd"
                      d="M4 4a3 3 0 013-3h6a3 3 0 013 3v12a3 3 0 01-3 3H7a3 3 0 01-3-3V4zm4-1.5v.75c0 .414.336.75.75.75h2.5a.75.75 0 00.75-.75V2.5h1A1.5 1.5 0 0114.5 4v12a1.5 1.5 0 01-1.5 1.5H7A1.5 1.5 0 015.5 16V4A1.5 1.5 0 017 2.5h1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span
                    className={`${
                      sideBarMinimize && "hidden"
                    } flex-1 ml-3 whitespace-nowrap font-small`}
                  >
                    Device and Apps
                  </span>
                </span>
              </li>
              <li>
                <span
                  onClick={() =>
                    !walkThroughPending &&
                    !["0", "1"].includes(walkThroughSteps) &&
                    onNavigationClick("/dashboard")
                  }
                  href=""
                  className={`flex items-center p-2 ${
                    !walkThroughPending &&
                    !["0", "1"].includes(walkThroughSteps) &&
                    " text-gray-400 "
                  } rounded-lg ${
                    location?.pathname === "/dashboard" &&
                    "bg-[#202C40] text-gray-100"
                  } dark:text-white ${
                    !walkThroughPending &&
                    !["0", "1"].includes(walkThroughSteps) &&
                    " hover:bg-[#202C40] hover:text-gray-100 cursor-pointer "
                  } dark:hover:bg-gray-700`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="w-5 h-5"
                  >
                    <path d="M5.25 12a.75.75 0 01.75-.75h.01a.75.75 0 01.75.75v.01a.75.75 0 01-.75.75H6a.75.75 0 01-.75-.75V12zM6 13.25a.75.75 0 00-.75.75v.01c0 .414.336.75.75.75h.01a.75.75 0 00.75-.75V14a.75.75 0 00-.75-.75H6zM7.25 12a.75.75 0 01.75-.75h.01a.75.75 0 01.75.75v.01a.75.75 0 01-.75.75H8a.75.75 0 01-.75-.75V12zM8 13.25a.75.75 0 00-.75.75v.01c0 .414.336.75.75.75h.01a.75.75 0 00.75-.75V14a.75.75 0 00-.75-.75H8zM9.25 10a.75.75 0 01.75-.75h.01a.75.75 0 01.75.75v.01a.75.75 0 01-.75.75H10a.75.75 0 01-.75-.75V10zM10 11.25a.75.75 0 00-.75.75v.01c0 .414.336.75.75.75h.01a.75.75 0 00.75-.75V12a.75.75 0 00-.75-.75H10zM9.25 14a.75.75 0 01.75-.75h.01a.75.75 0 01.75.75v.01a.75.75 0 01-.75.75H10a.75.75 0 01-.75-.75V14zM12 9.25a.75.75 0 00-.75.75v.01c0 .414.336.75.75.75h.01a.75.75 0 00.75-.75V10a.75.75 0 00-.75-.75H12zM11.25 12a.75.75 0 01.75-.75h.01a.75.75 0 01.75.75v.01a.75.75 0 01-.75.75H12a.75.75 0 01-.75-.75V12zM12 13.25a.75.75 0 00-.75.75v.01c0 .414.336.75.75.75h.01a.75.75 0 00.75-.75V14a.75.75 0 00-.75-.75H12zM13.25 10a.75.75 0 01.75-.75h.01a.75.75 0 01.75.75v.01a.75.75 0 01-.75.75H14a.75.75 0 01-.75-.75V10zM14 11.25a.75.75 0 00-.75.75v.01c0 .414.336.75.75.75h.01a.75.75 0 00.75-.75V12a.75.75 0 00-.75-.75H14z" />
                    <path
                      fillRule="evenodd"
                      d="M5.75 2a.75.75 0 01.75.75V4h7V2.75a.75.75 0 011.5 0V4h.25A2.75 2.75 0 0118 6.75v8.5A2.75 2.75 0 0115.25 18H4.75A2.75 2.75 0 012 15.25v-8.5A2.75 2.75 0 014.75 4H5V2.75A.75.75 0 015.75 2zm-1 5.5c-.69 0-1.25.56-1.25 1.25v6.5c0 .69.56 1.25 1.25 1.25h10.5c.69 0 1.25-.56 1.25-1.25v-6.5c0-.69-.56-1.25-1.25-1.25H4.75z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span
                    className={`${sideBarMinimize && "hidden"} ml-3 font-small`}
                  >
                    Calendar
                  </span>
                </span>
              </li>
              <li>
                <span
                  onClick={() =>
                    !walkThroughPending && onNavigationClick("/summary-goals")
                  }
                  className={`flex items-center p-2 ${
                    !walkThroughPending && " text-gray-400 "
                  } rounded-lg ${
                    location?.pathname === "/summary-goals" &&
                    "bg-[#202C40] text-gray-100"
                  } dark:text-white ${
                    !walkThroughPending &&
                    " hover:bg-[#202C40] hover:text-gray-100 cursor-pointer "
                  } dark:hover:bg-gray-700`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12.577 4.878a.75.75 0 01.919-.53l4.78 1.281a.75.75 0 01.531.919l-1.281 4.78a.75.75 0 01-1.449-.387l.81-3.022a19.407 19.407 0 00-5.594 5.203.75.75 0 01-1.139.093L7 10.06l-4.72 4.72a.75.75 0 01-1.06-1.061l5.25-5.25a.75.75 0 011.06 0l3.074 3.073a20.923 20.923 0 015.545-4.931l-3.042-.815a.75.75 0 01-.53-.919z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span
                    className={`${
                      sideBarMinimize && "hidden"
                    } flex-1 ml-3 whitespace-nowrap font-small`}
                  >
                    Summary and Goals
                  </span>
                </span>
              </li>
              <li>
                <span
                  onClick={() =>
                    !walkThroughPending && onNavigationClick("/leaderboard")
                  }
                  href=""
                  className={`flex items-center p-2 ${
                    !walkThroughPending && " text-gray-400 "
                  } rounded-lg ${
                    location?.pathname === "/leaderboard" &&
                    "bg-[#202C40] text-gray-100"
                  } dark:text-white ${
                    !walkThroughPending &&
                    " hover:bg-[#202C40] hover:text-gray-100 cursor-pointer "
                  } dark:hover:bg-gray-700`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 384 512"
                    fill="currentColor"
                    className="w-5 h-5"
                  >
                    <path d="M173.8 5.5c11-7.3 25.4-7.3 36.4 0L228 17.2c6 3.9 13 5.8 20.1 5.4l21.3-1.3c13.2-.8 25.6 6.4 31.5 18.2l9.6 19.1c3.2 6.4 8.4 11.5 14.7 14.7L344.5 83c11.8 5.9 19 18.3 18.2 31.5l-1.3 21.3c-.4 7.1 1.5 14.2 5.4 20.1l11.8 17.8c7.3 11 7.3 25.4 0 36.4L366.8 228c-3.9 6-5.8 13-5.4 20.1l1.3 21.3c.8 13.2-6.4 25.6-18.2 31.5l-19.1 9.6c-6.4 3.2-11.5 8.4-14.7 14.7L301 344.5c-5.9 11.8-18.3 19-31.5 18.2l-21.3-1.3c-7.1-.4-14.2 1.5-20.1 5.4l-17.8 11.8c-11 7.3-25.4 7.3-36.4 0L156 366.8c-6-3.9-13-5.8-20.1-5.4l-21.3 1.3c-13.2 .8-25.6-6.4-31.5-18.2l-9.6-19.1c-3.2-6.4-8.4-11.5-14.7-14.7L39.5 301c-11.8-5.9-19-18.3-18.2-31.5l1.3-21.3c.4-7.1-1.5-14.2-5.4-20.1L5.5 210.2c-7.3-11-7.3-25.4 0-36.4L17.2 156c3.9-6 5.8-13 5.4-20.1l-1.3-21.3c-.8-13.2 6.4-25.6 18.2-31.5l19.1-9.6C65 70.2 70.2 65 73.4 58.6L83 39.5c5.9-11.8 18.3-19 31.5-18.2l21.3 1.3c7.1 .4 14.2-1.5 20.1-5.4L173.8 5.5zM272 192a80 80 0 1 0 -160 0 80 80 0 1 0 160 0zM1.3 441.8L44.4 339.3c.2 .1 .3 .2 .4 .4l9.6 19.1c11.7 23.2 36 37.3 62 35.8l21.3-1.3c.2 0 .5 0 .7 .2l17.8 11.8c5.1 3.3 10.5 5.9 16.1 7.7l-37.6 89.3c-2.3 5.5-7.4 9.2-13.3 9.7s-11.6-2.2-14.8-7.2L74.4 455.5l-56.1 8.3c-5.7 .8-11.4-1.5-15-6s-4.3-10.7-2.1-16zm248 60.4L211.7 413c5.6-1.8 11-4.3 16.1-7.7l17.8-11.8c.2-.1 .4-.2 .7-.2l21.3 1.3c26 1.5 50.3-12.6 62-35.8l9.6-19.1c.1-.2 .2-.3 .4-.4l43.2 102.5c2.2 5.3 1.4 11.4-2.1 16s-9.3 6.9-15 6l-56.1-8.3-32.2 49.2c-3.2 5-8.9 7.7-14.8 7.2s-11-4.3-13.3-9.7z" />
                  </svg>
                  <span
                    className={`${
                      sideBarMinimize && "hidden"
                    } flex-1 ml-3 whitespace-nowrap font-small`}
                  >
                    Leaderboard
                  </span>
                </span>
              </li>
              <li>
                <span
                  onClick={() =>
                    (userStatus == 2 || !walkThroughPending) &&
                    onNavigationClick("/healthycontent")
                  }
                  href=""
                  className={`flex items-center p-2 ${
                    (userStatus == 2 || !walkThroughPending) &&
                    " text-gray-400 "
                  } rounded-lg ${
                    location?.pathname === "/healthycontent" &&
                    "bg-[#202C40] text-gray-100"
                  } dark:text-white ${
                    (userStatus == 2 || !walkThroughPending) &&
                    " hover:bg-[#202C40] hover:text-gray-100 cursor-pointer "
                  } dark:hover:bg-gray-700`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.536-4.464a.75.75 0 10-1.061-1.061 3.5 3.5 0 01-4.95 0 .75.75 0 00-1.06 1.06 5 5 0 007.07 0zM9 8.5c0 .828-.448 1.5-1 1.5s-1-.672-1-1.5S7.448 7 8 7s1 .672 1 1.5zm3 1.5c.552 0 1-.672 1-1.5S12.552 7 12 7s-1 .672-1 1.5.448 1.5 1 1.5z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span
                    className={`${
                      sideBarMinimize && "hidden"
                    } flex-1 ml-3 whitespace-nowrap font-small`}
                  >
                    Healthy Content
                  </span>
                </span>
              </li>
              <li>
                <span
                  onClick={() =>
                    (userStatus == 2 || !walkThroughPending) &&
                    onNavigationClick("/forums")
                  }
                  href=""
                  className={`flex items-center p-2 ${
                    (userStatus == 2 || !walkThroughPending) &&
                    " text-gray-400 "
                  } rounded-lg ${
                    location?.pathname === "/forums" &&
                    "bg-[#202C40] text-gray-100"
                  } dark:text-white ${
                    (userStatus == 2 || !walkThroughPending) &&
                    " hover:bg-[#202C40] hover:text-gray-100 cursor-pointer "
                  } dark:hover:bg-gray-700`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="w-5 h-5"
                  >
                    <path d="M3.505 2.365A41.369 41.369 0 019 2c1.863 0 3.697.124 5.495.365 1.247.167 2.18 1.108 2.435 2.268a4.45 4.45 0 00-.577-.069 43.141 43.141 0 00-4.706 0C9.229 4.696 7.5 6.727 7.5 8.998v2.24c0 1.413.67 2.735 1.76 3.562l-2.98 2.98A.75.75 0 015 17.25v-3.443c-.501-.048-1-.106-1.495-.172C2.033 13.438 1 12.162 1 10.72V5.28c0-1.441 1.033-2.717 2.505-2.914z" />
                    <path d="M14 6c-.762 0-1.52.02-2.271.062C10.157 6.148 9 7.472 9 8.998v2.24c0 1.519 1.147 2.839 2.71 2.935.214.013.428.024.642.034.2.009.385.09.518.224l2.35 2.35a.75.75 0 001.28-.531v-2.07c1.453-.195 2.5-1.463 2.5-2.915V8.998c0-1.526-1.157-2.85-2.729-2.936A41.645 41.645 0 0014 6z" />
                  </svg>
                  <span
                    className={`${
                      sideBarMinimize && "hidden"
                    } flex-1 ml-3 whitespace-nowrap font-small`}
                  >
                    Forums
                  </span>
                </span>
              </li>
              {(!companyDetails ||
                ["company"].includes(localStorage.getItem("roles"))) && (
                <li>
                  <span
                    onClick={() => onNavigationClick("/membership")}
                    href="#"
                    className={`flex items-center p-2 text-gray-400 rounded-lg ${
                      location?.pathname === "/membership" &&
                      "bg-[#202C40] text-gray-100"
                    } dark:text-white hover:bg-[#202C40] hover:text-gray-100 cursor-pointer dark:hover:bg-gray-700`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="w-6 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z"
                      />
                    </svg>
                    <span
                      className={`${
                        sideBarMinimize && "hidden"
                      } flex-1 ml-3 whitespace-nowrap font-small`}
                    >
                      Membership
                    </span>
                  </span>
                </li>
              )}
              {
                <li>
                  <span
                    onClick={() =>
                      !walkThroughPending && onNavigationClick("/services")
                    }
                    href=""
                    className={`flex items-center p-2 ${
                      !walkThroughPending && " text-gray-400 "
                    } rounded-lg ${
                      location?.pathname === "/services" &&
                      "bg-[#202C40] text-gray-100"
                    } dark:text-white ${
                      !walkThroughPending &&
                      " hover:bg-[#202C40] hover:text-gray-100 cursor-pointer "
                    } dark:hover:bg-gray-700`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 320 512"
                      fill="currentColor"
                      className="w-5 h-5"
                    >
                      <path d="M160 48a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zM126.5 199.3c-1 .4-1.9 .8-2.9 1.2l-8 3.5c-16.4 7.3-29 21.2-34.7 38.2l-2.6 7.8c-5.6 16.8-23.7 25.8-40.5 20.2s-25.8-23.7-20.2-40.5l2.6-7.8c11.4-34.1 36.6-61.9 69.4-76.5l8-3.5c20.8-9.2 43.3-14 66.1-14c44.6 0 84.8 26.8 101.9 67.9L281 232.7l21.4 10.7c15.8 7.9 22.2 27.1 14.3 42.9s-27.1 22.2-42.9 14.3L247 287.3c-10.3-5.2-18.4-13.8-22.8-24.5l-9.6-23-19.3 65.5 49.5 54c5.4 5.9 9.2 13 11.2 20.8l23 92.1c4.3 17.1-6.1 34.5-23.3 38.8s-34.5-6.1-38.8-23.3l-22-88.1-70.7-77.1c-14.8-16.1-20.3-38.6-14.7-59.7l16.9-63.5zM68.7 398l25-62.4c2.1 3 4.5 5.8 7 8.6l40.7 44.4-14.5 36.2c-2.4 6-6 11.5-10.6 16.1L54.6 502.6c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L68.7 398z" />
                    </svg>
                    <span
                      className={`${
                        sideBarMinimize && "hidden"
                      } flex-1 ml-3 whitespace-nowrap font-small`}
                    >
                      Training
                    </span>
                  </span>
                </li>
              }
              {["admin"].includes(localStorage.getItem("roles")) && (
                <li className="">
                  <span
                    onClick={() => onNavigationClick("/training-slots")}
                    href="#"
                    className={`flex items-center p-2 text-gray-400 rounded-lg ${
                      location?.pathname === "/training-slots" &&
                      "bg-gray-900 text-gray-100"
                    } cursor-pointer dark:text-white hover:bg-gray-900 hover:text-gray-100 dark:hover:bg-gray-700`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 512 512"
                      fill="currentColor"
                      class="w-5 h-5"
                    >
                      <path d="M184 24c0-13.3-10.7-24-24-24s-24 10.7-24 24V64H96c-35.3 0-64 28.7-64 64v16 48V448c0 35.3 28.7 64 64 64H416c35.3 0 64-28.7 64-64V192 144 128c0-35.3-28.7-64-64-64H376V24c0-13.3-10.7-24-24-24s-24 10.7-24 24V64H184V24zM80 192H432V448c0 8.8-7.2 16-16 16H96c-8.8 0-16-7.2-16-16V192zm176 40c-13.3 0-24 10.7-24 24v48H184c-13.3 0-24 10.7-24 24s10.7 24 24 24h48v48c0 13.3 10.7 24 24 24s24-10.7 24-24V352h48c13.3 0 24-10.7 24-24s-10.7-24-24-24H280V256c0-13.3-10.7-24-24-24z" />
                    </svg>
                    <span
                      className={`${
                        sideBarMinimize && "hidden"
                      } flex-1 ml-3 whitespace-nowrap font-small`}
                    >
                      Availability Calendar
                      <br />
                      <span className="text-xs text-gray-400">
                        Add Available Date
                      </span>
                    </span>
                  </span>
                </li>
              )}
              {["admin"].includes(localStorage.getItem("roles")) && (
                <li className="">
                  <span
                    onClick={() => onNavigationClick("/company/report")}
                    href="#"
                    className={`flex items-center p-2 text-gray-400 rounded-lg ${
                      location?.pathname === "/company/report" &&
                      "bg-gray-900 text-gray-100"
                    } cursor-pointer dark:text-white hover:bg-gray-900 hover:text-gray-100 dark:hover:bg-gray-700`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="currentColor"
                      class="w-6 h-6"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5V18a2.25 2.25 0 002.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 002.25 2.25h13.5M6 7.5h3v3H6v-3z"
                      />
                    </svg>
                    <span
                      className={`${
                        sideBarMinimize && "hidden"
                      } flex-1 ml-3 whitespace-nowrap font-small`}
                    >
                      Reports
                    </span>
                  </span>
                </li>
              )}
              {["admin"].includes(localStorage.getItem("roles")) && (
                <li className="">
                  <span
                    onClick={() => onNavigationClick("/users")}
                    href="#"
                    className={`flex items-center p-2 text-gray-400 rounded-lg ${
                      location?.pathname === "/users" &&
                      "bg-gray-900 text-gray-100"
                    } cursor-pointer dark:text-white hover:bg-gray-900 hover:text-gray-100 dark:hover:bg-gray-700`}
                  >
                    <svg fill="none" viewBox="0 0 20 20" class="w-6 h-6">
                      <path
                        fill="currentColor"
                        d="M5.5 0a3.499 3.499 0 100 6.996A3.499 3.499 0 105.5 0zM3.5 8.994a3.5 3.5 0 00-3.5 3.5v2.497h11v-2.497a3.5 3.5 0 00-3.5-3.5h-4zM12.5 10H12v5h3v-2.5a2.5 2.5 0 00-2.5-2.5z"
                      />
                      <path
                        fill="currentColor"
                        d="M11.5 4a2.5 2.5 0 100 5 2.5 2.5 0 000-5z"
                      />
                    </svg>
                    <span
                      className={`${
                        sideBarMinimize && "hidden"
                      } flex-1 ml-3 whitespace-nowrap font-small`}
                    >
                      Users
                    </span>
                  </span>
                </li>
              )}
              {["admin"].includes(localStorage.getItem("roles")) && (
                <li className="">
                  <span
                    onClick={() => onNavigationClick("/coupons")}
                    href="#"
                    className={`flex items-center p-2 text-gray-400 rounded-lg ${
                      location?.pathname === "/coupons" &&
                      "bg-gray-900 text-gray-100"
                    } cursor-pointer dark:text-white hover:bg-gray-900 hover:text-gray-100 dark:hover:bg-gray-700`}
                  >
                    <svg fill="none" viewBox="0 0 20 20" class="w-6 h-6">
                      <path
                        fill="currentColor"
                        d="M21 5H3a1 1 0 00-1 1v4h.893c.996 0 1.92.681 2.08 1.664A2.001 2.001 0 013 14H2v4a1 1 0 001 1h18a1 1 0 001-1v-4h-1a2.001 2.001 0 01-1.973-2.336c.16-.983 1.084-1.664 2.08-1.664H22V6a1 1 0 00-1-1zM11 17H9v-2h2v2zm0-4H9v-2h2v2zm0-4H9V7h2v2z"
                      />
                    </svg>
                    <span
                      className={`${
                        sideBarMinimize && "hidden"
                      } flex-1 ml-3 whitespace-nowrap font-small`}
                    >
                      Coupons
                    </span>
                  </span>
                </li>
              )}
              {["admin", "company"].includes(localStorage.getItem("roles")) && (
                <li className="border-t border-b">
                  <span
                    onClick={() => onNavigationClick("/wellnessprogram")}
                    href="#"
                    className={`flex items-center p-2 text-gray-400 rounded-lg ${
                      location?.pathname === "/wellnessprogram" &&
                      "bg-gray-900 text-gray-100"
                    } dark:text-white hover:bg-[#202C40] hover:text-gray-100 cursor-pointer dark:hover:bg-gray-700`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-6 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.25 7.125C2.25 6.504 2.754 6 3.375 6h6c.621 0 1.125.504 1.125 1.125v3.75c0 .621-.504 1.125-1.125 1.125h-6a1.125 1.125 0 01-1.125-1.125v-3.75zM14.25 8.625c0-.621.504-1.125 1.125-1.125h5.25c.621 0 1.125.504 1.125 1.125v8.25c0 .621-.504 1.125-1.125 1.125h-5.25a1.125 1.125 0 01-1.125-1.125v-8.25zM3.75 16.125c0-.621.504-1.125 1.125-1.125h5.25c.621 0 1.125.504 1.125 1.125v2.25c0 .621-.504 1.125-1.125 1.125h-5.25a1.125 1.125 0 01-1.125-1.125v-2.25z"
                      />
                    </svg>
                    <span
                      className={`${
                        sideBarMinimize && "hidden"
                      } flex-1 ml-3 whitespace-nowrap font-small`}
                    >
                      Wellness Program
                      <br />
                      <span className="text-xs text-gray-400">
                        Manage Corporate
                      </span>
                    </span>
                  </span>
                </li>
              )}
            </ul>
          </div>
        </aside>
        {sideNavShow && (
          <div className="absolute top-0 z-20 left-0 w-full h-full rounded-md bg-black bg-opacity-60"></div>
        )}
        <div
          style={{ overflowY: "scroll" }}
          className={`p-0 h-screen ${
            sideBarMinimize ? "" : "sm:ml-64"
          } overflow-y-hidden md:overflow-y-scroll border-t-2 md:border-0 border-theme-blue`}
        >
          <nav
            className="flex items-center md:border-b-[1px] border-layout-color px-4 md:px-10 md:py-4 text-gray-700 bg-theme-header dark:bg-gray-800 dark:border-gray-700"
            aria-label="Breadcrumb"
          >
            <div
              onClick={() => setSideBarMinimize(!sideBarMinimize)}
              className={`md:block hidden ${
                sideBarMinimize && "mx-10"
              } flex items-center justify-center cursor-pointer text-gray-400`}
            >
              {sideBarMinimize ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  class="w-6 h-6"
                >
                  <path
                    stroke-linecap="round"
                    strokeLinejoin="round"
                    d="M11.25 4.5l7.5 7.5-7.5 7.5m-6-15l7.5 7.5-7.5 7.5"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  class="w-6 h-6"
                >
                  <path
                    stroke-linecap="round"
                    strokeLinejoin="round"
                    d="M18.75 19.5l-7.5-7.5 7.5-7.5m-6 15L5.25 12l7.5-7.5"
                  />
                </svg>
              )}
            </div>
            {sideBarMinimize && (
              <div className="">
                <div className=" text-md whitespace-nowrap text-gray-300 dark:text-gray-300">
                  {companyDetails?.companyName}
                </div>
              </div>
            )}

            {/* User Avtar 
                        <div className="flex justify-end w-[100%] text-gray-400 items-center hidden md:flex">
                            <span className="text-lg capitalize">{localStorage.getItem('user-name')}</span>
                            <div className="relative inline-flex items-center justify-center ml-2 w-8 h-8 overflow-hidden bg-gray-300 rounded-full dark:bg-gray-600">
                                <span className="font-medium text-gray-600 dark:text-gray-300 capitalize">{localStorage.getItem('user-name')?.split(' ')[0]?.split('')[0]}</span>
                            </div>
                        </div>
                    */}
            <div className="flex justify-end w-[100%] text-gray-400 items-center hidden md:flex">
              <span className="text-md capitalize">
                {localStorage.getItem("user-name")}
              </span>
              <Menu as="div" className="relative inline-block text-left ml-4">
                <div>
                  <Menu.Button className="inline-flex w-full justify-center">
                    <div className="relative inline-flex items-center justify-center w-10 h-10 overflow-hidden bg-gray-200 rounded-full dark:bg-gray-600">
                      <span className="font-medium text-gray-600 dark:text-gray-300 capitalize">
                        {
                          localStorage
                            .getItem("user-name")
                            ?.split(" ")[0]
                            ?.split("")[0]
                        }
                      </span>
                    </div>
                  </Menu.Button>
                </div>
                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white border ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="py-1">
                      <Menu.Item>
                        {({ active }) => (
                          <a
                            onClick={() => onNavigationClick("/profile")}
                            href="#"
                            className={`${
                              active
                                ? "bg-gray-100 text-gray-900 "
                                : "text-gray-700 "
                            }block px-3 py-2 text-sm`}
                          >
                            <span class="flex items-center p-1">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                                class="w-5 h-5"
                              >
                                <path
                                  fill-rule="evenodd"
                                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-5.5-2.5a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0zM10 12a5.99 5.99 0 00-4.793 2.39A6.483 6.483 0 0010 16.5a6.483 6.483 0 004.793-2.11A5.99 5.99 0 0010 12z"
                                  clip-rule="evenodd"
                                />
                              </svg>{" "}
                              <span class="false flex-1 ml-3">My Profile</span>
                            </span>
                          </a>
                        )}
                      </Menu.Item>
                      {/*
                                        <Menu.Item>
                                            {({ active }) => (
                                                <a
                                                    href="#"
                                                    className={`${active ? 'bg-gray-100 text-gray-900 ' : 'text-gray-700 '}block px-4 py-2 text-sm`}
                                                >
                                                    Support
                                                </a>
                                            )}
                                        </Menu.Item>
                                        */}
                      <Menu.Item>
                        {({ active }) => (
                          <a
                            onClick={() => {
                              onNavigationClick("/");
                              localStorage.clear();
                            }}
                            href=""
                            className={`${
                              active
                                ? "bg-gray-100 text-gray-900 "
                                : "text-gray-700 "
                            }block px-3 py-2 text-sm`}
                          >
                            <span class="flex items-center p-1">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={2.5}
                                stroke="currentColor"
                                className="w-5 h-5"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M5.636 5.636a9 9 0 1012.728 0M12 3v9"
                                />
                              </svg>{" "}
                              <span class="false flex-1 ml-3">Logout</span>
                            </span>
                          </a>
                        )}
                      </Menu.Item>
                    </div>
                  </Menu.Items>
                </Transition>
              </Menu>
            </div>
          </nav>
          <div className="custom-container mt-[70px] md:mt-0 min-h-[88vh]">
            <Outlet context={[active, setActive]} />
          </div>
          <div className="flex justify-center text-xs md:text-sm text-gray-400 py-2">
            © {moment().get("year")}, CONTINGENT FITNESS TRAINING, INC. All
            Rights Reserved.
          </div>
        </div>
      </div>
    </>
  );
};

export default Layout1;

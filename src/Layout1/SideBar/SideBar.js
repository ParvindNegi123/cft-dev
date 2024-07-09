import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import cftLogo from "../../assets/images/cftLogo.svg";
import openArrow from "../../assets/images/openArrow.svg";
import navIcon1 from "../../assets/images/navIcon-1.svg";
import navIcon2 from "../../assets/images/navIcon-2.svg";
import navIcon3 from "../../assets/images/navIcon-3.svg";
import navIcon4 from "../../assets/images/navIcon-4.svg";
import navIcon5 from "../../assets/images/navIcon-5.svg";
import navIcon6 from "../../assets/images/navIcon-6.svg";
import navIcon7 from "../../assets/images/navIcon-7.svg";
import navIcon8 from "../../assets/images/navIcon-8.svg";

const SideBar = ({ isSidebarOpen, parentToChildSideBAr, userType }) => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [role, setRole] = useState("user");
    const [howerActiveClass, setHowerActiveClass] = useState("Device")

    useEffect(() => {
        setRole(userType);
    }, [userType]);

    const handleMenuClick = (index) => {
        setActiveIndex(activeIndex === index ? null : index);
    };
    const handleContentDatafunction = (prop) => {
        setHowerActiveClass(prop);
        parentToChildSideBAr(prop);
        // navValue(2);
    }
    const handleFunctionForAdmin = (prop) => {
        setHowerActiveClass(prop); 
        parentToChildSideBAr(prop);
    }
    return (
        <div className={`sidebar ${isSidebarOpen ? 'slide' : ''}`}>
            <div className="logo">
                <img src={cftLogo} alt="logo" />
                <h1>Contingent Fitness</h1>
            </div>
            <div className="menu">
                {role === "user" && (
                    <>
                        <div className={`menu-item ${activeIndex === 0 ? 'active' : ''}`}>
                            <div className={`menu-title`} onClick={() => handleMenuClick(0)}>
                                <div>
                                    <span className="hide-text-m">User Dashboard</span>
                                </div>
                                <div className="menu-btn">
                                    <img src={openArrow} alt="button" />
                                </div>
                            </div>
                            <div className="sub-menu">
                                <div
                                    className={`sub-head ${howerActiveClass === "Device" ? "active" : ""}`}
                                    onClick={() => handleContentDatafunction("Device")}
                                >
                                    <img src={navIcon1} alt="Icon" />
                                    <span className="hide-text-m">Device and Apps</span>
                                </div>
                                <div className={`sub-head ${howerActiveClass === "dashbord" ? "active" : ""}`}
                                 onClick={() => handleContentDatafunction("dashbord")}>
                                    <img src={navIcon2} alt="Icon" />
                                    <span className="hide-text-m">Calendar</span>
                                </div>
                                <div className={`sub-head ${howerActiveClass === "summary-goal" ? "active" : ""}`}
                                 onClick={() => handleContentDatafunction("summary-goal")}>
                                    <img src={navIcon3} alt="Icon" />
                                    <span className="hide-text-m">Summary and Goals</span>
                                </div>
                                <div className={`sub-head ${howerActiveClass === "leaderboard" ? "active" : ""}`}
                                 onClick={() => handleContentDatafunction("leaderboard")}>
                                    <img src={navIcon4} alt="Icon" />
                                    <span className="hide-text-m">Leaderboard</span>
                                </div>
                                <div className={`sub-head ${howerActiveClass === "healthyContent" ? "active" : ""}`}
                                 onClick={() => handleContentDatafunction("healthyContent")}>
                                    <img src={navIcon5} alt="Icon" />
                                    <span className="hide-text-m">Healthy Content</span>
                                </div>
                                <div className={`sub-head ${howerActiveClass === "Forums" ? "active" : ""}`}
                                 onClick={() => handleContentDatafunction("Forums")}>
                                    <img src={navIcon6} alt="Icon" />
                                    <span className="hide-text-m">Forums</span>
                                </div>
                                <div className={`sub-head ${howerActiveClass === "Membership" ? "active" : ""}`}
                                 onClick={() => handleContentDatafunction("Membership")}>
                                    <img src={navIcon7} alt="Icon" />
                                    <span className="hide-text-m">Membership</span>
                                </div>
                                <div className={`sub-head ${howerActiveClass === "Training" ? "active" : ""}`}
                                 onClick={() => handleContentDatafunction("Training")}>
                                    <img src={navIcon8} alt="Icon" />
                                    <span className="hide-text-m">Training</span>
                                </div>
                            </div>
                        </div>
                    </>
                )}
                {role !== "user" && (
                    <>
                        <div className={`menu-item ${activeIndex === 0 ? 'active' : ''}`}>
                            <div className="menu-title" onClick={() => handleMenuClick(0)}>
                                <div>
                                    <span className="hide-text-m">Admin Dashboard</span>
                                </div>
                                <div className="menu-btn">
                                    <img src={openArrow} alt="button" />
                                </div>
                            </div>
                            <div className="sub-menu">
                                <div className={`sub-head ${howerActiveClass === "Device" ? "active" : ""}`}
                                 onClick={() => handleFunctionForAdmin("Device")}>
                                    <img src={navIcon1} alt="Icon" />
                                    <span className="hide-text-m">Device and Apps</span>
                                </div>
                                <div className={`sub-head ${howerActiveClass === "dashbord" ? "active" : ""}`}
                                 onClick={() => handleFunctionForAdmin("dashbord")}>
                                    <img src={navIcon2} alt="Icon" />
                                    <span className="hide-text-m">Calendar</span>
                                </div>
                                <div className={`sub-head ${howerActiveClass === "summary-goal" ? "active" : ""}`}
                                 onClick={() => handleFunctionForAdmin("summary-goal")}>
                                    <img src={navIcon3} alt="Icon" />
                                    <span className="hide-text-m">Summary and Goals</span>
                                </div>
                                <div className={`sub-head ${howerActiveClass === "leaderboard" ? "active" : ""}`}
                                 onClick={() => handleFunctionForAdmin("leaderboard")}>
                                    <img src={navIcon4} alt="Icon" />
                                    <span className="hide-text-m">Leaderboard</span>
                                </div>
                                <div className={`sub-head ${howerActiveClass === "healthyContent" ? "active" : ""}`}
                                 onClick={() => handleFunctionForAdmin("healthyContent")}>
                                    <img src={navIcon5} alt="Icon" />
                                    <span className="hide-text-m">Healthy Content</span>
                                </div>
                                <div className={`sub-head ${howerActiveClass === "Forums" ? "active" : ""}`}
                                 onClick={() => handleFunctionForAdmin("Forums")}>
                                    <img src={navIcon6} alt="Icon" />
                                    <span className="hide-text-m">Forums</span>
                                </div>
                                <div className={`sub-head ${howerActiveClass === "Membership" ? "active" : ""}`}
                                 onClick={() => handleFunctionForAdmin("Membership")}>
                                    <img src={navIcon7} alt="Icon" />
                                    <span className="hide-text-m">Membership</span>
                                </div>
                                <div className={`sub-head ${howerActiveClass === "Training" ? "active" : ""}`}
                                onClick={() => handleFunctionForAdmin("Training")}>
                                    <img src={navIcon8} alt="Icon" />
                                    <span className="hide-text-m">Training</span>
                                </div>
                            </div>
                        </div>
                        <div className={`menu-item ${activeIndex === 1 ? 'active' : ''}`}>
                            <div className="menu-title" onClick={() => handleMenuClick(1)}>
                                <div>

                                    <span className="hide-text-m">Super Admin Dashboard</span>

                                </div>
                                <div className="menu-btn">
                                    <img src={openArrow} alt="button" />
                                </div>
                            </div>
                            <div className="sub-menu">

                                <div className={`sub-head ${howerActiveClass === "training-slots" ? "active" : ""}`}
                                 onClick={() => handleFunctionForAdmin("training-slots")}>
                                    <img src={navIcon1} alt="Icon" />
                                    <span className="hide-text-m">Avalibility Calander</span>
                                </div>

                                <div className={`sub-head ${howerActiveClass === "company/report" ? "active" : ""}`}
                                 onClick={() => handleFunctionForAdmin("company/report")}>
                                    <img src={navIcon2} alt="Icon" />
                                    <span className="hide-text-m">Reports</span>
                                </div>

                                <div className={`sub-head ${howerActiveClass === "users" ? "active" : ""}`}
                                 onClick={() => handleFunctionForAdmin("users")}>
                                    <img src={navIcon3} alt="Icon" />
                                    <span className="hide-text-m">Users</span>
                                </div>

                                <div className={`sub-head ${howerActiveClass === "coupons" ? "active" : ""}`}
                                 onClick={() => handleFunctionForAdmin("coupons")}>
                                    <img src={navIcon4} alt="Icon" />
                                    <span className="hide-text-m">Coupons</span>
                                </div>

                                <div className={`sub-head ${howerActiveClass === "wellnessprogram" ? "active" : ""}`}
                                 onClick={() => handleFunctionForAdmin("wellnessprogram")}>
                                    <img src={navIcon5} alt="Icon" />
                                    <span className="hide-text-m">Wellness Program</span>
                                </div>

                                {/* <div className={`sub-head ${howerActiveClass === "leaderboard" ? "active" : ""}`}
                                 onClick={() => handleFunctionForAdmin("Device")}>
                                    <img src={navIcon6} alt="Icon" />
                                    <span className="hide-text-m">Forums</span>
                                </div>

                                <div className={`sub-head ${howerActiveClass === "leaderboard" ? "active" : ""}`}
                                 onClick={() => handleFunctionForAdmin("Device")}>
                                    <img src={navIcon7} alt="Icon" />
                                    <span className="hide-text-m">Membership</span>
                                </div>

                                <div className={`sub-head ${howerActiveClass === "leaderboard" ? "active" : ""}`}
                                 onClick={() => handleFunctionForAdmin("Device")}>
                                    <img src={navIcon8} alt="Icon" />
                                    <span className="hide-text-m">Training</span>
                                </div> */}

                            </div>
                        </div>
                    </>
                )}

            </div>
        </div>
    );
};

export default SideBar;

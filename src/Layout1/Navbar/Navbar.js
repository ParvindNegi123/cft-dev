import {React,useState,useEffect} from "react";
import {Link,useNavigate,useLocation} from "react-router-dom";
import searchIcon from "../../assets/images/searchIcon.svg";
import bellIcon from "../../assets/images/bellIcon.svg";
import adminDumny from "../../assets/images/adminDumny.svg";
    import{
        ArrowRightOnRectangleIcon, UserIcon
      
    } from "@heroicons/react/24/solid"
const Navbar = ({ parentToChild,name,navValue }) => {
    const [contantName,setContantName]=useState();
    const[userName,setUserName]=useState();
    const [role,setRole]=useState();
    const [isActive, setIsActive] = useState(false);
    const navigate=useNavigate();
    const handleBoxClick = () => {
      setIsActive(!isActive);
    };
    const functionCall=()=>{
        navValue(1)
    }
    useEffect(()=>{
        setContantName(name);
    },[name]);
    useEffect(()=>{
        setUserName(localStorage.getItem('user-name'))
        setRole(localStorage.getItem('roles'))
    },[])
    return (
      
        <div className="top-header">
            <div className="top-header-inner">
                <div>
                    <span className="hamberger" onClick={parentToChild}>
                        <span />
                    </span>
                    <h2>{contantName}</h2>
                </div>
                <div className="right-box">
                    <div className="search-box">
                        <img src={searchIcon} alt="Icon" />
                        <input type="search" placeholder="Search Here" />
                    </div>
                    <div className="notification-box">
                        <img src={bellIcon} alt="Icon" />
                        <div className="live" />
                    </div>
                    <div className="admin-box" onClick={handleBoxClick}>
                        <img src={adminDumny} alt="Admin" />
                        <div>
                            <div className="name">{userName}</div>
                            <div className="title">{role}</div>
                        </div>

                        <div className={`admin-popup ${isActive ? 'active' : ''}`}>
                            <ul>
                                <li style={{ margin: '20px' }} onClick={functionCall}> <UserIcon class="h-6 text-gray-500"/>My Profile</li>
                                <li style={{ margin: '20px' }} onClick={()=>{navigate("/");
                                    localStorage.clear();
                                }}><svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fill-rule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clip-rule="evenodd" />
                              </svg>
                                    Logout</li>
                            </ul>
                        </div>


                    </div>

                </div>
            </div>
        </div>
    );
};

export default Navbar;

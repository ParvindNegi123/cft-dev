import React, { useState ,useEffect,Fragment} from 'react';
import { Outlet,useNavigate,Link,useLocation } from 'react-router-dom';
import {Menu,Transition} from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import moment from 'moment';
import Navbar from './Navbar/Navbar';
import SideBar from './SideBar/SideBar';
import Device from '../page/Device/Device'
import Footer from "./Footer/Footer"
import EditProfilebyUsrPopUp from '../page/Popup/EditProfilebyUsrPopUp';
import Forums from '../page/forums';
import Calendar from '../components/calendar';
import SummaryGoals from "../page/summaryGoals"
import Leaderboard from '../page/leaderboard/leaderboard';
import HealthyContent from '../page/healthyContent';
import TrainingSlots from '../page/trainingSlots/trainingSlots';
import Membership from '../page/membership';
import AddUnavailableSlots from '../page/trainingSlots/addUnavailableSlots';
import CompanyReport from "../page/companyReport/companyReport";
import UserList from '../page/userList';
import Coupons from '../page/coupons';
import WellnessProgram from '../page/wellnessProgram/wellnessProgram';
const ParentComponent = () => {
  // 1 - profile 0- device 2-calander  3-summary-goal 4-leaderBord
  // 5- healthy conteng  6-forums 7 - membership 8-Training
  //9-admin timing slot //10 -company/report 11 - users 12- coupons  13-wellnessprogram
  const [open,setOpen]=useState(0)
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [walkThroughPending, setWalkThroughPending] = useState(false);
    const [walkThroughSteps, setWalkThroughSteps] = useState('0');
    const [userType,setUserType]=useState("");
    const[navname,setNavname]=useState('Device');
    const navigate=useNavigate();
    const location=useLocation();
    const navValue=(val)=>{
      setOpen(val);
      setNavname(" USer Profile ")
    }
    const onNavigate=(currLocation)=>{
        navigate(currLocation);
        
    }
    const parentToChild = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };
  
    const handlePopUp =(val)=>{
      console.log("function calle d")
            setOpen(val);
    }
    const parentToChildSideBAr = (val) => { 
        setNavname(val);
        switch (val) {
            case 'Device':
              setOpen(0);
              navigate('/device')
              break;
            case 'dashbord':
              setOpen(2);     
              navigate('/dashboard')
              break;
            case 'summary-goal':
              setOpen(3)
              navigate('/summary-goals')
              break;
            case 'leaderboard':
              setOpen(4);
              navigate('/leaderboard')
              break;
            case 'healthyContent':
              setOpen(5);
              navigate('/healthycontent')
              break;
            case 'Forums':
              setOpen(6);
              navigate('/forums')
              break;
            case 'Membership':
              setOpen(7);
              navigate('/membership')
              break;
            case 'Training':
              setOpen(8);
              navigate('/services')
              break;
            case 'training-slots':
              setOpen(9);
              navigate('/training-slots')
              break;
            case 'company/report':
              setOpen(10);
              navigate('/company/report')
              break;
            case 'users':
              setOpen(11);
              navigate('/users')
              break;
            case 'coupons':
              setOpen(12);
              navigate('/coupons')
              break;
            case 'wellnessprogram':
              setOpen(13);
              navigate('/wellnessprogram')
              break;
           
            default:
            //   setNavName('Default Page');
            navigate('/device')
              break;
          }

    };
useEffect(()=>{
               let isLogin =localStorage.getItem('auth-token');
    if(!isLogin && location.pathname !=='/'){
        navigate('/')
    }else if(isLogin && location.pathname==='/'){
        navigate('/dashboard');
    }
    setWalkThroughPending(JSON.parse(localStorage.getItem('walkthrough'))?.walkThroughPending);
    setWalkThroughSteps(JSON.parse(localStorage.getItem('walkthrough'))?.walkThroughSteps);
    setUserType(localStorage.getItem('roles'));
}, [location]);

useEffect(() => {
    const detectTimeZone = () => {
        const detectedTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        localStorage.setItem("timeZone", detectedTimeZone);
    };

    detectTimeZone();
}, []);

let companyDetails = localStorage.getItem('company');
    if (companyDetails) {
        companyDetails = JSON.parse(companyDetails);
    }

    const isCompanyAdmin = ['company'].includes(localStorage.getItem('roles'));
    const isCompanyUser = localStorage.getItem('company');

    let userStatus = localStorage.getItem('status');

    return (
        <div className="main">
            <div className="container">
                <SideBar isSidebarOpen={isSidebarOpen} parentToChildSideBAr={parentToChildSideBAr} userType={userType}  />
                <div className="dashboard">
                    <Navbar parentToChild={parentToChild} name={navname} navValue={navValue}/>
                    {open === 8 && <TrainingSlots />}
                    {open === 0 && <Device />}
                    {open === 13 && <WellnessProgram />}
                    {open === 4 && <Leaderboard />}
                    {open === 10 && <CompanyReport />}
                    {open === 6 && <Forums />}
                    {open === 3 && <SummaryGoals />}
                    {open === 9 && <AddUnavailableSlots />}
                    {open === 2 && <Calendar />}
                    {open === 5 && <HealthyContent />}
                    {open === 11 && <UserList />}
                    {open === 7 && <Membership/>}
                    {open ===1 && <EditProfilebyUsrPopUp handlePopUp={handlePopUp}/>}
                    {open ===12 && <Coupons/>}

                    <Footer/>
                </div>
            </div>
        </div>
    );
};

export default ParentComponent;

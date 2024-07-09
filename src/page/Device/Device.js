import React,{useState,useEffect} from "react";
// import Footer from "../Footer/Footer";
import fitbitIcon from "../../assets/images/fitbitIcon.svg"
import bluetoothConnect from "../../assets/images/bluetoothConnect.svg"
import bluetoothDisabled from "../../assets/images/bluetoothDisabled.svg"
import garminIcon from "../../assets/images/garminIcon.svg"
import axios from "axios";
import { BASE_URL,FITBIT_CLIENT_ID } from "../../config";
import Modal from "../../components/modal";
import { useNavigate } from "react-router-dom";
import GarminModal from "../../components/garminModal";
import Calendar from "../../components/calendar";
import Tooltip from "../../components/tooltip";

const Device = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const parentToChild = () => {
    console.log("Header function call");
    setIsSidebarOpen(!isSidebarOpen);
};
const navigate = useNavigate();

useEffect(() => {
  let subscribedStatus = localStorage.getItem('subscribedStatus');
      
  // If subscribedStatus is falsy, redirect to membership page
  if (subscribedStatus == 'false') {
      window.location = window.location.origin + '/membership';
      return false;
  }
});

const [fitbitChecked, setFitbitChecked] = useState(false);
const [garminChecked, setGarminChecked] = useState(false);
const [stravaChecked, setStravaChecked] = useState(false);
const [samsungChecked, setSamsungChecked] = useState(false);
const [fitbitConnectLoading, setFitbitConnectLoading] = useState(false);
const [deviceStatusLoading, setDeviceStatusLoading] = useState(true);
const [confirmationModal, setConfirmationModal] = useState(false);
const [deviceType, setDeviceType] = useState();
const [modalIsOpen, setIsOpen] = useState(false);
const [user, setUser] = useState({});

const onClickFitbit = () => {
  if (fitbitConnectLoading) {
    return;
  }
  if (fitbitChecked) {
    modelDeviceType('FitBit');
    setConfirmationModal(true);
  } else {
    setFitbitChecked(true);
    setFitbitConnectLoading(true);
    window.location.href = `https://www.fitbit.com/oauth2/authorize?client_id=${FITBIT_CLIENT_ID}&response_type=code&scope=activity%20heartrate%20location%20nutrition%20oxygen_saturation%20profile%20respiratory_rate%20settings%20sleep%20social%20temperature%20weight%20cardio_fitness%20electrocardiogram%20heartrate`;
  }
};

const onClickGarmin = () => {
  axios({
    headers: {
      "x-access-token": localStorage.getItem("auth-token"),
    },
    url: `${BASE_URL}/garmin/getAuthorizationLink`, //your url
    method: "POST",
  }).then((res) => {
    window.location.href = res?.data?.redirectUrl;
    // setConfirmationModal(false);
    // getDeviceStatus();
  });
};

const onModalConfirm = () => {
  setFitbitChecked(false);

  if (deviceType == 'Garmin') {
    removeGarminUSer();
  }
  if (deviceType == 'FitBit') {
    removeFitBitToken();
  }


};

const removeFitBitToken = () => {
  axios({
    headers: {
      "x-access-token": localStorage.getItem("auth-token"),
    },
    url: `${BASE_URL}/auth/removeFitBitToken`, //your url
    method: "PUT",
  }).then((res) => {
    setConfirmationModal(false);
    getDeviceStatus();
  });
};
const removeGarminUSer = () => {
  axios({
    headers: {
      "x-access-token": localStorage.getItem("auth-token"),
    },
    url: `${BASE_URL}/auth/removegarmin`, //your url
    method: "PUT",
  }).then((res) => {
    setConfirmationModal(false);
    getDeviceStatus();
  });
};
const getDeviceStatus = () => {
  setDeviceStatusLoading(true);
  axios({
    headers: {
      "x-access-token": localStorage.getItem("auth-token"),
    },
    url: `${BASE_URL}/user/device/status`, //your url
    method: "GET",
  }).then((res) => {
    setDeviceStatusLoading(false);
    setFitbitChecked(res.data.isFitbitConnected);
    setGarminChecked(res.data.isGarminConnected);
  }).catch((err) => {
    if(err.code == "ERR_BAD_REQUEST"){ // Unauthorized 401
      //console.log("Error : ", err.code);
      localStorage.clear(); // Remove token from local storage
      navigate('/'); // Redirect to the login page
    }
  });
};

const getProfile = (event) => {
  axios({
    headers: {
      "x-access-token": localStorage.getItem("auth-token"),
    },
    url: `${BASE_URL}/user/profile`, //your url
    method: 'GET'
  }).then((res) => {
    setUser(res?.data?.data);
  }).catch((err) => {
    if(err.code == "ERR_BAD_REQUEST"){ // Unauthorized 401
      //console.log("Error : ", err.code);
      localStorage.clear(); // Remove token from local storage
      navigate('/'); // Redirect to the login page
    }
  });
};

useEffect(() => {
  getDeviceStatus();
  getProfile();
}, []);

const updateWalkthrough = (e) => {
  axios({
    headers: {
      "x-access-token": localStorage.getItem("auth-token"),
    },
    url: `${BASE_URL}/user/update/walkthrough`, //your url
    method: 'PUT',
    data: { walkThroughPending: false, walkThroughSteps: 2 }
  }).then((res) => {
    localStorage.setItem('walkthrough', JSON.stringify({ walkThroughPending: false, walkThroughSteps: 2 }))
  }).catch((err) => {
  });
};

function modelDeviceType(deviceType) {
  setDeviceType(deviceType);
};

function closeModal() {
  setIsOpen(false);
  setGarminChecked(garminChecked);
};

const onClickViewDashboard = () => {
  if (garminChecked || fitbitChecked) {
    navigate('/dashboard');
    updateWalkthrough();
  }
};

const walkThroughPending = JSON.parse(localStorage.getItem('walkthrough'))?.walkThroughPending;

return (
<>

    <div className="wrapper">
          <div className="column-boxes-section">
            <div className="column-boxes-inner">
              <div className="col-box">
                <div className="icon-box">
                  <img
                   src={fitbitIcon}
                   alt="Icon"
                  />
                </div>
                <h3>FITBIT</h3>
                <h6>connect</h6>
                <div className="connect-box connect" onClick={onClickFitbit}>
                  <img
                    className="connect-icon"
                    src={bluetoothConnect}
                    alt="Icon"
                  />
                  <img
                    className="disconnect-icon"
                    src={bluetoothDisabled}
                    alt="Icon"
                  />
                  Connect
                </div>
              </div>
              <div className="col-box">
                <div className="icon-box">
                  <img src={garminIcon}
                   alt="Icon" />
                </div>
                <h3>Garmin</h3>
                <h6>connected</h6>
                <div className="connect-box disconnect" onClick={onClickGarmin}>
                  <img
                    className="connect-icon"
                    src={bluetoothConnect}
                    alt="Icon"
                  />
                  <img
                    className="disconnect-icon"
                    src={bluetoothDisabled}
                    alt="Icon"
                  />
                  disconnect
                </div>
              </div>
            </div>
          </div>
          <div className="default-btn-outer">
            <div className="default-btn view-btn">
              View Dashboard
            </div>
          </div>
        </div>
        {/* <Footer /> */}
      

</>)
}
export default Device
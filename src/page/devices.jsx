import React, { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL, FITBIT_CLIENT_ID } from "../config";
import Modal from "../components/modal";
import GarminModal from "../components/garminModal";
import Calendar from "../components/calendar";
import Tooltip from "../components/tooltip";
import { useNavigate } from "react-router-dom";
import SamsungUrl from "../assets/samsung_logo.png";

const Devices = () => {
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
    <div
      className="dark:bg-slate-900"
      style={{ height: "100vh" }}
    >
      <Modal
        title={"Disconnect Device"}
        content={"Do you really want to disconnect device ?"}
        modalShow={confirmationModal}
        onModalConfirm={onModalConfirm}
        setModalShow={setConfirmationModal}
        deviceType={deviceType}
      />
      <GarminModal
        title={"Gamin Authentication"}
        content={"Please enter your garmin Login details!"}
        modalShow={modalIsOpen}
        onModalConfirm={closeModal}
        setModalShow={setIsOpen}
        setGarminChecked={setGarminChecked}
      />
      <div className="w-full dark:border-gray-700">
        <div className="mx-4 md:pl-20 md:mx-8 md:h-auto pt-10">
          <div className="flex align-center items-center justify-between border-b border-blue-200 border-opacity-20 h-14 mb-8">
            <div className="text-2xl tracking-tight font-medium text-gray-300 dark:text-white">
              Devices
            </div>
          </div>
          <ul role="list" className="px-2 py-2 md:mx-20">
            <li
              className={`py-3 sm:py-4 bg-theme-blue-secondary ${(fitbitConnectLoading || deviceStatusLoading) && "opacity-40"
                } p-2 rounded my-2`}
            >
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <img
                    className="w-24"
                    src="https://logos-world.net/wp-content/uploads/2021/02/Fitbit-Emblem.png"
                    alt="Neil image"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="ml-2 font-bold text-gray-400 truncate dark:text-white">
                    FITBIT
                  </p>
                  {(fitbitConnectLoading || deviceStatusLoading) ? (
                    <div className="lds-facebook">
                      <div></div>
                      <div></div>
                      <div></div>
                      <div></div>
                      <div></div>
                    </div>
                  ) : (
                    <p className="ml-2 text-gray-500 truncate dark:text-gray-400">
                      {fitbitChecked ? "connected" : "disconnected"}
                    </p>
                  )}
                </div>
                <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      onClick={onClickFitbit}
                      type="checkbox"
                      value=""
                      className="sr-only peer"
                      checked={fitbitChecked}
                    />
                    <div className="w-11 h-6 bg-gray-300 peer-checked:bg-[#415E96] rounded-full dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-gray-700 after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-gray-100 after:border-gray-400 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600"></div>
                    <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-400"></span>
                  </label>
                </div>
              </div>
            </li>
            <li className={`py-3 sm:py-4 bg-theme-blue-secondary ${(deviceStatusLoading) && "opacity-40"} rounded my-2`}>
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0 ml-6 mr-6">
                  <img
                    className="w-14"
                    src="https://cdn.iconscout.com/icon/free/png-256/garmin-3521441-2944885.png"
                    alt="Bonnie image"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="ml-2 font-medium text-gray-400 truncate dark:text-white">
                    <div className="flex">
                      GARMIN
                      {(!user?.weight || !user?.age || !user?.gender || !user?.height) && (<Tooltip text={<span>Update your details on <span onClick={() => navigate('/profile')} className="cursor-pointer font-medium text-blue-400 dark:text-blue-500 underline" href='www.google.com'>profile</span></span>}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="yellow" class="cursor-pointer w-6 h-6 ml-4">
                          <path stroke-linecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                        </svg>
                      </Tooltip>
                      )}
                    </div>
                  </p>
                  {deviceStatusLoading ? (
                    <div className="lds-facebook">
                      <div></div>
                      <div></div>
                      <div></div>
                      <div></div>
                      <div></div>
                    </div>
                  ) : (
                    <p className="ml-2 text-gray-500 truncate dark:text-gray-400">
                      {garminChecked ? "connected" : "disconnected"}
                    </p>
                  )}
                </div>
                <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      onClick={onClickGarmin}
                      type="checkbox"
                      value=""
                      className="sr-only peer"
                      checked={garminChecked}
                      disabled={garminChecked}
                    />
                    {/* <input onClick={() => setGarminChecked(!garminChecked)} type="checkbox" value="" className="sr-only peer" checked={garminChecked} /> */}
                    <div className="w-11 h-6 bg-gray-300 peer-checked:bg-[#415E96] rounded-full dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-gray-700 after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-gray-100 after:border-gray-400 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600"></div>
                    <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-400"></span>
                  </label>
                </div>
              </div>
            </li>
            {/* <li className="py-3 sm:py-4 bg-theme-blue-secondary rounded my-2">
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0 ml-6 mr-6">
                  <img
                    className="w-14"
                    src="data:image/png;base64,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"
                    alt="Bonnie image"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="ml-2 font-medium text-gray-400 truncate dark:text-white">
                    STRAVA
                  </p>
                  <p className="ml-2 text-gray-500 truncate dark:text-gray-400">
                    disconnected
                  </p>
                </div>
                <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      onClick={() => setStravaChecked(!stravaChecked)}
                      type="checkbox"
                      value=""
                      className="sr-only peer"
                      checked={stravaChecked}
                    />
                    <div className="w-11 h-6 bg-gray-300 peer-checked:bg-[#415E96] rounded-full dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-gray-700 after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-gray-100 after:border-gray-400 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600"></div>
                    <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-400"></span>
                  </label>
                </div>
              </div>
            </li>
            <li className="py-3 sm:py-4 bg-theme-blue-secondary rounded my-2">
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0 ml-6 mr-6">
                  <img
                    className="w-14"
                    src={SamsungUrl}
                    alt="Bonnie image"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="ml-2 font-medium text-gray-400 truncate dark:text-white">
                    SAMSUNG HEALTH
                  </p>
                  <p className="ml-2 text-gray-500 truncate dark:text-gray-400">
                    disconnected
                  </p>
                </div>
                <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      onClick={() => setSamsungChecked(!samsungChecked)}
                      type="checkbox"
                      value=""
                      className="sr-only peer"
                      checked={samsungChecked}
                    />
                    <div className="w-11 h-6 bg-gray-300 peer-checked:bg-[#415E96] rounded-full dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-gray-700 after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-gray-100 after:border-gray-400 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600"></div>
                    <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-400"></span>
                  </label>
                </div>
              </div>
            </li> */}
          </ul>
          <div className="flex justify-center m-10 text-2xl text-gray-300">
            <span class="relative flex justify-center">
              {walkThroughPending && (fitbitChecked || garminChecked) && (<span class="animate-ping absolute inline-flex h-full w-[80%] rounded-full bg-sky-200 opacity-40"></span>)}
              <button onClick={() => onClickViewDashboard()} type="button" style={{ zIndex: 1 }} className="ring-2 ring-gray-300 button-theme rounded-full w-62 text-sm px-5 text-center flex items-center dark:focus:ring-[#4285F4]/55 p-2">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="#A8A8A8" strokeWidth="1.5" stroke="currentColor" class="w-6 h-6 mr-2">
                  <path d="M0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256zm320 96c0-26.9-16.5-49.9-40-59.3V88c0-13.3-10.7-24-24-24s-24 10.7-24 24V292.7c-23.5 9.5-40 32.5-40 59.3c0 35.3 28.7 64 64 64s64-28.7 64-64zM144 176a32 32 0 1 0 0-64 32 32 0 1 0 0 64zm-16 80a32 32 0 1 0 -64 0 32 32 0 1 0 64 0zm288 32a32 32 0 1 0 0-64 32 32 0 1 0 0 64zM400 144a32 32 0 1 0 -64 0 32 32 0 1 0 64 0z" />
                </svg>
                View Dashboard
              </button>
            </span>
          </div>
        </div>
      </div>
    </div>
//     <>
// <h1>sharrrrrrrrrrrrrrrrrrr.......</h1>
// <h1>sharrrrrrrrrrrrrrrrrrr.......</h1>
// <h1>sharrrrrrrrrrrrrrrrrrr.......</h1>
// <h1>sharrrrrrrrrrrrrrrrrrr.......</h1>
// <h1>sharrrrrrrrrrrrrrrrrrr.......</h1>
// <h1>sharrrrrrrrrrrrrrrrrrr.......</h1>
// <h1>sharrrrrrrrrrrrrrrrrrr.......</h1>
// <h1>sharrrrrrrrrrrrrrrrrrr.......</h1>
// <h1>sharrrrrrrrrrrrrrrrrrr.......</h1>
// <h1>sharrrrrrrrrrrrrrrrrrr.......</h1>
// <h1>sharrrrrrrrrrrrrrrrrrr.......</h1>
// <h1>sharrrrrrrrrrrrrrrrrrr.......</h1>
// <h1>sharrrrrrrrrrrrrrrrrrr.......</h1>
// <h1>sharrrrrrrrrrrrrrrrrrr.......</h1>
// <h1>sharrrrrrrrrrrrrrrrrrr.......</h1>
// <h1>sharrrrrrrrrrrrrrrrrrr......----------------------------------------------------------------.</h1>
//     </>
  );
};
export default Devices;

import { useEffect, useState } from 'react';
import axios from 'axios';
import moment from 'moment';
import { BASE_URL } from "../config";
import Select from "react-tailwindcss-select";
import Skeleton from 'react-loading-skeleton';

const daysInMonth = (month, year) => {
  return new Date(year, month, 0).getDate();
};

const getMonthName = (month) => {
  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  return monthNames[month - 1];
};

const Calendar = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [calendarEvents, setCalendarEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [device, setDevice] = useState('FitBit');
  const [deviceStatus, setDeviceStatus] = useState('');

  const handlePreviousMonth = () => {
    if (currentMonth === 1) {
      setCurrentMonth(12);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 12) {
      setCurrentMonth(1);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const handlePreviousYear = () => {
    setCurrentYear(currentYear - 1);
  };

  const handleNextYear = () => {
    setCurrentYear(currentYear + 1);
  };

  const monthDays = daysInMonth(currentMonth, currentYear);
  const firstDay = new Date(currentYear, currentMonth - 1, 1).getDay();
  const weeks = Math.ceil((monthDays + firstDay) / 7);

  const days = [];
  for (let i = 1; i <= weeks * 7; i++) {
    if (i > firstDay && i <= monthDays + firstDay) {
      days.push(i - firstDay);
    } else {
      days.push(null);
    }
  }

  const getCalendartList = (event) => {
    let selectedStartDate = moment(`${currentYear}-${currentMonth}-01`).startOf('month').format('YYYY-MM-DD');
    let selectedEndDate = moment(`${currentYear}-${currentMonth}-01`).endOf('month').format('YYYY-MM-DD');;
    setLoading(true);

    let url = '';
    if (device === "FitBit") {
      url = `${BASE_URL}/user/getfitbitexercisedata/${selectedStartDate}/${selectedEndDate}`;
    } else if (device === 'Garmin') {
      url = `${BASE_URL}/user/getgarminexercisedatabydate/${selectedStartDate}/${selectedEndDate}`;
    }

    axios({
      headers: {
        "x-access-token": localStorage.getItem('auth-token')
      },
      url,
      method: 'GET'
    }).then((res) => {
      setLoading(false);
      let newData = {};
      res?.data?.data?.map((data) => {
        let date = data?.onDateTime?.split('T')[0].split('-')[2];
        newData[parseInt(date)] = data?.heartRateZones;
      });
      setCalendarEvents(newData);
    }).catch((err) => {
      setLoading(false);
    });
  };

  const getDeviceStatus = () => {
    axios({
      headers: {
        "x-access-token": localStorage.getItem("auth-token"),
      },
      url: `${BASE_URL}/user/device/status`, //your url
      method: "GET",
    }).then((res) => {
      setDeviceStatus(res.data);
    });
  };

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth', // Optional: adds smooth scrolling animation
    });
    getDeviceStatus();
  }, []);

  useEffect(() => {
    setCalendarEvents([]);
    getCalendartList();
  }, [currentYear, currentMonth, device]);

  useEffect(() => {
    let isFitbitConnected = deviceStatus?.isFitbitConnected;
    let isGarminConnected = deviceStatus?.isGarminConnected;
    if (isFitbitConnected) {
      setDevice('FitBit');
    } else if (isGarminConnected) {
      setDevice('Garmin');
    } else {
      setDevice('FitBit');
    }
  }, [deviceStatus]);

  const handleChange = (value) => {
    setDevice(value);
  };

  return (
    <div className="justify-center">
      <div className="p-2 md:pl-[100px] md:w-[80%] pb-8">
        {(deviceStatus?.isFitbitConnected && deviceStatus?.isGarminConnected) && (
          <ul class="text-xs md:text-sm font-medium text-center text-gray-300 md:divide-x md:divide-gray-200 md:rounded-lg sm:flex dark:divide-gray-700 dark:text-gray-400 py-2">
            <li class="w-full">
              <span onClick={() => handleChange('FitBit')} className={`cursor-pointer ${device === 'FitBit' && 'bg-theme-blue-secondary text-gray-300'} inline-block w-full p-4 md:rounded-l-lg active dark:bg-gray-700 dark:text-white`} aria-current="page">Fitbit</span>
            </li>
            <li class="w-full">
              <span onClick={() => handleChange('Garmin')} className={`cursor-pointer ${device === 'Garmin' && 'bg-theme-blue-secondary text-gray-300'} inline-block w-full p-4 md:rounded-r-lg hover:text-gray-700 hover:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700`}>Garmin</span>
            </li>
          </ul>
        )}
        <div className="flex justify-center">
          <div className="flex justify-between my-4 w-3/4 text-gray-300 bg-gray">
            <button
              className="text-gray-500 px-4 py-2 rounded"
              onClick={handlePreviousYear}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="#A8AAAD"
                className="w-5 h-5"
              >
                <path
                  fillRule="evenodd"
                  d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z"
                />
              </svg>
            </button>
            <div
              className="text-md uppercase font-medium"
              style={{ marginTop: "5px" }}
            >
              {currentYear}
            </div>
            <button
              className="text-gray-500 px-4 py-2 rounded"
              onClick={handleNextYear}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="#A8AAAD"
                className="w-5 h-5"
              >
                <path
                  fillRule="evenodd"
                  d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                />
              </svg>
            </button>
          </div>
          <div className="flex justify-between my-4 w-3/4 text-gray-300 bg-gray">
            <button
              className="text-gray-500 px-4 py-2 rounded"
              onClick={handlePreviousMonth}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="#A8AAAD"
                className="w-5 h-5"
              >
                <path
                  fillRule="evenodd"
                  d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z"
                />
              </svg>
            </button>
            <div
              className="text-md w-14 flex justify-center uppercase font-medium"
              style={{ marginTop: "5px" }}
            >
              {getMonthName(currentMonth)}
            </div>
            <button
              className="text-gray-500 px-4 py-2 rounded"
              onClick={handleNextMonth}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="#A8AAAD"
                className="w-5 h-5"
              >
                <path
                  fillRule="evenodd"
                  d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                />
              </svg>
            </button>
          </div>
        </div>
        <div className="flex flex-wrap">
          {/* {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div
              key={day}
              className="w-[14.1867%] text-gray-300 text-center font-medium mb-2"
            >
              {day}
            </div>
          ))} */}
          {days.map((day, index) => {
            let currentFullDate = `${currentYear}-${currentMonth?.toString().padStart(2, "0")}-${day?.toString().padStart(2, "0")}`;

            let isCurrentDate =
              day === new Date().getDate() &&
              currentMonth === new Date().getMonth() + 1 &&
              currentYear === new Date().getFullYear();
            let currentHeartData = {};
            calendarEvents?.[day]?.forEach(data => {
              currentHeartData[data?.heartZoneName?.toLowerCase() || 'unknown'] = data;
            });
            if (!day) {
              return '';
            }
            return (
              <div
                key={index}
                className={`w-[33.3%] md:w-[14.1867%] text-xs md:text-sm text-gray-500 text-center ${!day ? "" : ""}`}
              >
                {loading ? (
                  <>
                    <div className="hidden md:block mx-2">
                      <Skeleton baseColor="#202c40" highlightColor="#263348" height={98} width={'100%'} className="m-2" />
                    </div>
                    <div className="md:hidden m-1">
                      <Skeleton baseColor="#202c40" highlightColor="#263348" height={98} />
                    </div>
                  </>
                ) : (
                  <div className="flex m-1 w-50 shadow-sm bg-theme-blue-secondary">
                    <div className="w-[50%]">
                      <div
                        className={`flex flex-col m-1 ${isCurrentDate
                          ? "text-gray-100 bg-[#4285F4]"
                          : "text-gray-100"
                          } flex justify-center py-1 h-[44px] md:h-[52px]`}
                      >
                        <div className="flex justify-center text-xl">
                          {day}
                        </div>
                        <div className="flex justify-center text-md uppercase">
                          {moment(currentFullDate).format('ddd')}
                        </div>
                      </div>
                      <div className="bg-light-activity pl-2 py-1 m-1 bg-slate-800 opacity-[0.8]">
                        <div className="flex flex-wrap rounded">
                          {/* <span className="hidden md:block">Vigorous</span> */}
                          <div className="flex text-xs md:text-sm w-[58px] mb-1">
                            🕒{currentHeartData?.light?.minutes?.toFixed() || 0}
                          </div>
                          <div className="flex text-xs md:text-sm w-[58px]">
                            🔥{currentHeartData?.light?.caloriesOut?.toFixed() || 0}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="w-[50%]">
                      <div className="bg-moderate-activity pl-2 py-1 m-1 ml-0 bg-slate-800 opacity-[0.8]">
                        <div className="flex flex-wrap rounded">
                          {/* <span className="hidden md:block">Vigorous</span> */}
                          <div className="flex text-xs md:text-sm w-[58px] mb-1">
                            🕒{currentHeartData?.moderate?.minutes?.toFixed() || 0}
                          </div>
                          <div className="flex text-xs md:text-sm w-[58px]">
                            🔥{currentHeartData?.moderate?.caloriesOut?.toFixed() || 0}
                          </div>
                        </div>
                      </div>
                      <div className="bg-vigorous-activity pl-2 py-1 m-1 ml-0 bg-slate-800 opacity-[0.8]">
                        <div className="flex flex-wrap rounded">
                          {/* <span className="hidden md:block">Vigorous</span> */}
                          <div className="flex text-xs md:text-sm w-[58px] mb-1">
                            🕒{currentHeartData?.vigorous?.minutes?.toFixed() || 0}
                          </div>
                          <div className="flex text-xs md:text-sm w-[58px]">
                            🔥{currentHeartData?.vigorous?.caloriesOut?.toFixed() || 0}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )
                }
              </div>
            );
          })}
          {/* <div className="grow my-1 w-auto bg-opacity-[0.5]">
            <div className="flex flex-wrap justify-end items-end rounded text-gray-100 h-full pr-4">
              <div className="flex items-end">
                <div className="flex my-1 text-xs md:text-sm mr-4">
                  <div className="bg-light-activity mr-1">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5">
                      <path fill-rule="evenodd" d="M4.5 7.5a3 3 0 013-3h9a3 3 0 013 3v9a3 3 0 01-3 3h-9a3 3 0 01-3-3v-9z" clip-rule="evenodd" />
                    </svg>
                  </div>
                  light acitvity
                </div>
                <div className="flex my-1 text-xs md:text-sm mr-4">
                  <div className="bg-moderate-activity 1r-2">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5">
                      <path fill-rule="evenodd" d="M4.5 7.5a3 3 0 013-3h9a3 3 0 013 3v9a3 3 0 01-3 3h-9a3 3 0 01-3-3v-9z" clip-rule="evenodd" />
                    </svg>
                  </div>
                  moderate acitvity
                </div>
                <div className="flex my-1 text-xs md:text-sm mr-4">
                  <div className="bg-vigorous-activity 1r-2">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5">
                      <path fill-rule="evenodd" d="M4.5 7.5a3 3 0 013-3h9a3 3 0 013 3v9a3 3 0 01-3 3h-9a3 3 0 01-3-3v-9z" clip-rule="evenodd" />
                    </svg>
                  </div>
                  vigorous acitvity
                </div>
              </div>
            </div>
          </div> */}
        </div>
        <div className="grow my-1 w-auto bg-opacity-[0.5]">
          <div className="flex flex-wrap justify-center md:justify-start rounded text-gray-100 h-full md:pr-4 py-2">
            <div className="flex items-end">
              <div className="flex justify-center md:justify-start my-1 text-xs md:text-sm mr-1 md:mr-4">
                <div className="bg-light-activity mr-1">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5">
                    <path fill-rule="evenodd" d="M4.5 7.5a3 3 0 013-3h9a3 3 0 013 3v9a3 3 0 01-3 3h-9a3 3 0 01-3-3v-9z" clip-rule="evenodd" />
                  </svg>
                </div>
                light acitvity
              </div>
              <div className="flex justify-center md:justify-start my-1 text-xs md:text-sm mr-1 md:mr-4">
                <div className="bg-moderate-activity 1r-2">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5">
                    <path fill-rule="evenodd" d="M4.5 7.5a3 3 0 013-3h9a3 3 0 013 3v9a3 3 0 01-3 3h-9a3 3 0 01-3-3v-9z" clip-rule="evenodd" />
                  </svg>
                </div>
                moderate acitvity
              </div>
              <div className="flex justify-center md:justify-start my-1 text-xs md:text-sm mr-1 md:mr-4">
                <div className="bg-vigorous-activity 1r-2">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5">
                    <path fill-rule="evenodd" d="M4.5 7.5a3 3 0 013-3h9a3 3 0 013 3v9a3 3 0 01-3 3h-9a3 3 0 01-3-3v-9z" clip-rule="evenodd" />
                  </svg>
                </div>
                vigorous acitvity
              </div>
            </div>
          </div>
        </div>
      </div>
    </div >
  );
};

export default Calendar;

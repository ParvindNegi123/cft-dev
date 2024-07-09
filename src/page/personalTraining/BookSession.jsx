import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { loadStripe } from "@stripe/stripe-js";
import { BASE_URL } from "../../config";
import generateTimeSeries from "../../helper/common";
import moment from "moment";

const BookSessions = () => {
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1);
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
    const [currentDay, setSelectedDay] = useState('');
    const [selectedFullDate, setSelectedFullDate] = useState('');
    const [selectedSlots, setSelectedSlots] = useState('');
    const [bookedSlots, setBookedSlots] = useState([]);
    const [availavleSlots, setAvailavleSlots] = useState([]);
    const [calendarEvents, setCalendarEvents] = useState([]);
    const [bookedTrainingSessions, setBookedTrainingSessions] = useState([]);
    const [paymentDetail, setPaymentDetail] = useState();
    const [traningSessionDetail, setTraningSessionDetail] = useState({
        total: 0,
        booked: 0,
        remaining: 0,
    });

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [submitLoading, setSubmitLoading] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const queryParams = new URLSearchParams(location.search);

    useEffect(() => {
        let subscribedStatus = localStorage.getItem('subscribedStatus');
            
        // If subscribedStatus is falsy, redirect to membership page
        if (subscribedStatus == 'false') {
            window.location = window.location.origin + '/membership';
            return false;
        }
    });

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

    const confirmTrainingSessionBooking = () => {
        let sessionToUpdate = {};
        setSubmitLoading(true);
        bookedTrainingSessions?.map((data) => {
            let totalTrainingSession = parseInt(data?.sessions);
            let bookedTrainingSession = data?.sessionTiming?.length;
            let remainingTrainingSession = totalTrainingSession - bookedTrainingSession;
            if (remainingTrainingSession > 0) {
                let removedArray = bookedSlots.splice(-remainingTrainingSession, remainingTrainingSession);
                sessionToUpdate[data?._id] = removedArray;
            }
        });
        for (let index in sessionToUpdate) {
            if (sessionToUpdate[index].length >= 1) {
                axios({
                    headers: {
                        "x-access-token": localStorage.getItem('auth-token')
                    },
                    url: `${BASE_URL}/user/training/slots`, //your url
                    method: 'put',
                    data: { id: index, sessionSlots: sessionToUpdate[index] }
                }).then((res) => {
                    getTrainingSession();
                    // setLoading(false);
                });
            }
            setTimeout(() => {
                navigate('/services');
            }, 500);
        }
    };

    const getTrainingSession = () => {
        setLoading(true);
        axios({
            headers: {
                "x-access-token": localStorage.getItem('auth-token')
            },
            url: `${BASE_URL}/user/training/session`, //your url
            method: 'get',
        }).then((res) => {
            setBookedTrainingSessions(res?.data?.data || []);
            setLoading(false);
        });
    };

    const addSlots = () => {
        if (bookedSlots.length >= traningSessionDetail?.remaining) {
            return;
        }
        let slots = [...bookedSlots];
        slots.push({ date: selectedFullDate, time: { startTime: selectedSlots?.startTime, endTime: selectedSlots?.endTime }, id: selectedSlots?._id });
        setBookedSlots(slots);
        setSelectedDay('');
    };

    const removeSlots = (slotToRemove) => {
        let slots = [...bookedSlots];
        bookedSlots.map((data, i) => {
            if (data?.date === slotToRemove.date && data.time === slotToRemove.time) {
                slots.splice(i, 1);
            }
        });
        setBookedSlots(slots);
    };

    useEffect(() => {
        getTrainingSession();
    }, [location]);

    useEffect(() => {
        if (!selectedFullDate) {
            return;
        }
        setLoading(true);
        axios({
            headers: {
                "x-access-token": localStorage.getItem('auth-token')
            },
            url: `${BASE_URL}/user/training/available/session/${selectedFullDate}`, //your url
            method: 'get',
            data: { id: paymentDetail?._id, sessionSlots: bookedSlots, }
        }).then((res) => {
            setAvailavleSlots(res?.data?.data);
            setLoading(false);
        });
    }, [currentDay]);

    const onClickDate = (day, currentFullDate) => {
        if (moment(currentFullDate).isBefore(moment())) {
            setError('Please Select Future Dates');
            setTimeout(() => {
                setError('');
            }, 3000);
            return;
        }
        setSelectedDay(day);
        setSelectedFullDate(currentFullDate);
    };

    useEffect(() => {
        let totalTrainingSession = 0;
        let bookedTrainingSession = 0;
        bookedTrainingSessions?.map((data) => {
            totalTrainingSession = totalTrainingSession + parseInt(data?.sessions);
            bookedTrainingSession = bookedTrainingSession + data?.sessionTiming?.length;
        });
        setTraningSessionDetail({
            total: totalTrainingSession,
            booked: bookedTrainingSession,
            remaining: totalTrainingSession - bookedTrainingSession
        });
    }, [bookedTrainingSessions]);

    return (
        <div className="px-20 pt-10 min-h-screen">
            <div className="flex justify-center mb-8">
                <div className="pb-8 px-1 md:px-12">
                    <div class="flex justify-between my-4">
                        <span class="text-md md:text-3xl text-[#818cf8] dark:text-white">Your Training Sessions</span>
                        <div>
                            <span class="text-md md:text-3xl text-[#34d399] dark:text-white">{traningSessionDetail?.booked}/</span>
                            <span className="text-md md:text-3xl text-[#818cf8] dark:text-white">{traningSessionDetail?.total}</span>
                        </div>
                    </div>
                    <div class="w-full bg-[#818cf8] rounded-full h-4 dark:bg-gray-700">
                        <div class="bg-[#34d399] h-4 rounded-full" style={{ width: `${((traningSessionDetail?.booked / traningSessionDetail?.total) * 100)}%` }}></div>
                    </div>
                    <div className="text-md md:text-2xl text-white mt-8">
                        Please book your remaining session
                    </div>
                </div>
            </div>
            <div className="flex justify-center">
                {currentDay ? (
                    <div className="md:w-[40%] bg-theme-blue-secondary p-4">
                        <div className="flex justify-center mb-2 text-gray-500">Please Select Slot - {moment(selectedFullDate).format('DD MMM YYYY')}</div>
                        <div className="flex justify-center flex-wrap text-gray-400">
                            {!loading &&
                                (availavleSlots?.length > 0) ?
                                (
                                    availavleSlots.map(data => (
                                        <div key={data?.startTime} onClick={() => setSelectedSlots(data)} className={`bg-theme-blue-secondary text-sm ${(selectedSlots?.startTime === data?.startTime) && ' border '} p-2 m-1 cursor-pointer`}>
                                            {data.startTime} - {data.endTime}
                                        </div>
                                    ))
                                ) : (
                                    <div className="my-10">
                                        No Slots Available, Please select Another Date
                                    </div>
                                )
                            }
                        </div>

                        <div className="flex justify-center py-4">
                            <button disabled={(bookedSlots.length >= traningSessionDetail?.remaining)} id="submit" onClick={() => addSlots()} type="submit" className={`${(bookedSlots.length >= traningSessionDetail?.remaining) && ' cursor-not-allowed '} mx-2 inline-flex w-[200px] items-center justify-center rounded bg-theme-blue-secondary py-2 px-4 text-gray-400 hover:text-opacity-100`}>
                                Book
                            </button>
                            <button onClick={() => setSelectedDay('')} className="mx-2 inline-flex w-[200px] items-center justify-center rounded bg-theme-blue-secondary py-2 px-4 text-gray-400 hover:text-opacity-100">
                                Back
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="md:w-[40%] bg-theme-blue-secondary">
                        <div className="flex justify-center bg-theme-blue-secondary">
                            <div className="flex justify-between my-4 w-3/4 text-gray-500 bg-gray">
                                <button
                                    className="text-gray-600 px-4 py-2 rounded"
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
                                    className="text-gray-600 px-4 py-2 rounded"
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
                            <div className="flex justify-between my-4 w-3/4 text-gray-500 bg-gray">
                                <button
                                    className="text-gray-600 px-4 py-2 rounded"
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
                                    className="text-gray-600 px-4 py-2 rounded"
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
                        <div className="flex flex-wrap mt-2">
                            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                                <div
                                    key={day}
                                    className="w-[14.1867%] text-gray-400 text-center font-medium mb-2"
                                >
                                    {day}
                                </div>
                            ))}
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

                                return (
                                    <div
                                        onClick={() => onClickDate(day, currentFullDate)}
                                        key={index}
                                        className={`w-[14.1867%] ${day && 'cursor-pointer'} text-sm text-gray-600 border border-theme-blue text-center ${(currentDay === day) ? "bg-theme-blue" : "bg-theme-blue-secondary"}`}
                                    >
                                        <div className="p-4 md:py-2">
                                            <div className="flex justify-center">
                                                <div
                                                    className={`${isCurrentDate
                                                        ? "text-gray-50"
                                                        : "text-gray-400"
                                                        } rounded w-6`}
                                                >
                                                    {day}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        <div className={`py-4 text-${error ? 'red-500' : 'gray-300'} text-center`}>{error ? error : 'Please Select Date'}</div>
                    </div>
                )}
                <div className="ml-10 md:w-[24%] bg-theme-blue-secondary text-gray-400">
                    <div className="flex justify-center my-2">slots</div>
                    <div className="h-64 overflow-y-scroll">
                        {bookedSlots?.map(data => (
                            <div className="flex px-4 py-2 bg-slate-800 m-2 rounded-sm">
                                <div className="pr-4">{moment(data.date).format('DD MMM YYYY')} {data.time?.startTime} - {data.time?.endTime}</div>
                                <div className="cursor-pointer" onClick={() => removeSlots(data)}>
                                    <svg className="cursor-pointer h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" class="w-6 h-6">
                                        <path stroke-linecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div className="flex justify-center py-8">
                <button onClick={() => confirmTrainingSessionBooking()} type="submit" className="mx-2 inline-flex w-[200px] items-center justify-center rounded bg-theme-blue-secondary py-2 px-4 text-gray-400 hover:text-opacity-100">
                    <div className="mr-3">Confirm Booking</div>
                    {submitLoading && (
                        <svg aria-hidden="true" role="status" className="inline w-4 h-4 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB" />
                            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor" />
                        </svg>
                    )}
                </button>
                <button onClick={() => navigate('/services')} type="submit" className="mx-2 inline-flex w-[200px] items-center justify-center rounded bg-theme-blue-secondary py-2 px-4 text-gray-400 hover:text-opacity-100">
                    Back
                </button>
            </div>
        </div >
    );
}

export default BookSessions;
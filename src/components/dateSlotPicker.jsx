import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { loadStripe } from "@stripe/stripe-js";
import { BASE_URL } from "./../config";
import generateTimeSeries from "./../helper/common";
import moment from "moment";

const DateSlotPicker = ({ bookedSlots, setBookedSlots, selectedSlotLabel, slotSelectionLabel, buttonLabel }) => {
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1);
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
    const [currentDay, setSelectedDay] = useState('');
    const [selectedFullDate, setSelectedFullDate] = useState('');
    const [selectedSlots, setSelectedSlots] = useState('');
    const [calendarEvents, setCalendarEvents] = useState([]);
    const [paymentDetail, setPaymentDetail] = useState();
    const [loading, setLoading] = useState(true);
    const location = useLocation();
    const navigate = useNavigate();
    const queryParams = new URLSearchParams(location.search);

    const [error, setError] = useState('');

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

    const createTrainningSession = () => {
        if (!queryParams.get('redirect_status')) {
            return;
        }
        setLoading(true);
        axios({
            headers: {
                "x-access-token": localStorage.getItem('auth-token')
            },
            url: `${BASE_URL}/user/create/training/session`, //your url
            method: 'post',
            data: { paymentIntent: queryParams.get('payment_intent') }
        }).then((res) => {
            setPaymentDetail(res?.data?.data);
            setLoading(false);
        });
    };

    const addSlots = () => {
        if (bookedSlots.length >= paymentDetail?.sessions) {
            return;
        }
        //console.log(bookedSlots);
        let slots = [...bookedSlots];
        //slots.push({ date: selectedFullDate, time: selectedSlots });

        // Check if any slot matches both the date and time
        const isSlotAlreadyBooked = slots.some(slot => 
            slot.date === selectedFullDate && 
            slot.time.startTime === selectedSlots.startTime && 
            slot.time.endTime === selectedSlots.endTime
        );

        // If no slot matches both date and time, add the new slot
        if (!isSlotAlreadyBooked) {
            slots.push({ date: selectedFullDate, time: selectedSlots });
        }else{
            setError('This slot is already added.');
            setTimeout(() => {
                setError('');
            }, 3000);
            return;
        }

        console.log("Slots: ", slots);

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
        createTrainningSession();
    }, [location]);

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

    const addUnavailableSlots = () => {
        let bookedSlotsData = bookedSlots.map((data) => ({
            date: data?.date,
            startTime: data?.time?.startTime,
            endTime: data?.time?.endTime,
        }));

        axios({
            headers: {
                "x-access-token": localStorage.getItem('auth-token')
            },
            url: `${BASE_URL}/admin/slots/unavailable`, //your url
            method: 'post',
            data: bookedSlotsData
        }).then((res) => {
            navigate('/training-slots');
            setLoading(false);
        });
    };

    return (
        <div className="px-20 pt-10">
            <div className="flex justify-center">
                {currentDay ? (
                    <div className="md:w-[40%] bg-theme-blue-secondary p-4">
                        <div className="flex justify-center mb-2 text-gray-500">{slotSelectionLabel ? slotSelectionLabel : 'Please Select Slot'}</div>
                        <div className="flex justify-center flex-wrap text-gray-400">
                            {generateTimeSeries(60, 800).map(data => (
                                <div key={data?.startTime} onClick={() => setSelectedSlots(data)} className={`bg-theme-blue-secondary text-sm ${(selectedSlots?.startTime === data?.startTime) && ' border '} p-2 m-1 cursor-pointer`}>
                                    {data.startTime} - {data.endTime}
                                </div>
                            ))}
                        </div>

                        <div className="flex justify-center py-4">
                            <button disabled={(bookedSlots.length >= paymentDetail?.sessions)} id="submit" onClick={() => addSlots()} type="submit" className={`${(bookedSlots.length >= paymentDetail?.sessions) && ' cursor-not-allowed '} mx-2 inline-flex w-[200px] items-center justify-center rounded bg-theme-blue-secondary py-2 px-4 text-gray-400 hover:text-opacity-100`}>
                                {buttonLabel ? buttonLabel : 'Book'}
                            </button>
                            <button onClick={() => setSelectedDay('')} className="mx-2 inline-flex w-[200px] items-center justify-center rounded bg-theme-blue-secondary py-2 px-4 text-gray-400 hover:text-opacity-100">
                                Back
                            </button>
                        </div>
                        <div className={`py-4 text-${error ? 'red-500' : 'gray-300'} text-center`}>{error ? error : 'Please Select Available Slots'}</div>
                    </div>
                ) : (
                    <div className="md:w-[40%]">
                        <div className="md:w-[100%] bg-theme-blue-secondary">
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

                        <div className="md:w-[100%] flex justify-center">
                            <button onClick={() => addUnavailableSlots()} id="submit" type="submit" className={`mx-2 my-8 inline-flex w-[200px] items-center justify-center rounded bg-theme-blue-secondary py-2 px-4 text-gray-400 hover:text-opacity-100`}>
                                Add Slots
                            </button>

                            <button onClick={() => navigate('/training-slots')} type="button" className={`mx-2 my-8 inline-flex w-[200px] items-center justify-center rounded bg-theme-blue-secondary py-2 px-4 text-gray-400 hover:text-opacity-100`}>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                                    <path fill="#A8AAAD" d="M10 17l-5-5 5-5v10z"/>
                                    <path fill="none" d="M0 0h24v24H0z"/>
                                </svg>
                                Back
                            </button>
                        </div>
                    </div>
                )}
                <div className="ml-10 md:w-[24%] bg-theme-blue-secondary text-gray-400">
                    <div className="flex justify-center my-2">{selectedSlotLabel ? selectedSlotLabel : 'booked slots'}</div>
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
        </div>
    );
}

export default DateSlotPicker;
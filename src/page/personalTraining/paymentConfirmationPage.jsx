import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { loadStripe } from "@stripe/stripe-js";
import { BASE_URL } from "../../config";
import generateTimeSeries from "../../helper/common";
import moment from "moment";

const PaymentConfirmationPage = () => {
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1);
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
    const [currentDay, setSelectedDay] = useState('');
    const [selectedFullDate, setSelectedFullDate] = useState('');
    const [selectedSlots, setSelectedSlots] = useState('');
    const [bookedSlots, setBookedSlots] = useState([]);
    const [availavleSlots, setAvailavleSlots] = useState([]);
    const [calendarEvents, setCalendarEvents] = useState([]);
    const [paymentDetail, setPaymentDetail] = useState();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const location = useLocation();
    const navigate = useNavigate();
    const queryParams = new URLSearchParams(location.search);

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

    const confirmTrainingSessionBooking = () => {
        if (!queryParams.get('redirect_status')) {
            return;
        }
        // setLoading(true);
        axios({
            headers: {
                "x-access-token": localStorage.getItem('auth-token')
            },
            url: `${BASE_URL}/user/training/slots`, //your url
            method: 'put',
            data: { id: paymentDetail?._id, sessionSlots: bookedSlots, }
        }).then((res) => {
            navigate('/services');
            // setLoading(false);
        });
    };

    const addSlots = () => {
        if (bookedSlots.length >= paymentDetail?.sessions) {
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
        createTrainningSession();
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
            setAvailavleSlots(res?.data?.data)
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

    return (
        <div className="px-20 pt-10 min-h-screen">
            <div className="flex justify-center mb-8">
                <div>
                    <div className="text-gray-500 text-2xl font-medium text-center mb-4">
                        <svg viewBox="0 0 24 24" class="text-blue-600 w-10 h-10 mx-auto mb-2">
                            <path fill="currentColor"
                                d="M12,0A12,12,0,1,0,24,12,12.014,12.014,0,0,0,12,0Zm6.927,8.2-6.845,9.289a1.011,1.011,0,0,1-1.43.188L5.764,13.769a1,1,0,1,1,1.25-1.562l4.076,3.261,6.227-8.451A1,1,0,1,1,18.927,8.2Z">
                            </path>
                        </svg>
                        ${paymentDetail?.amount / 100} PAYMENT DONE !
                    </div>
                    <div class="flex justify-center">
                        <div class="flex justify-center">
                            <a target="_blank" href={`${paymentDetail?.receiptUrl}`} class="flex justify-center mx-2 w-52 bg-theme-blue-secondary hover:bg-indigo-500 text-white py-2" rel="noreferrer">
                                View Invoice
                            </a>
                        </div>
                        <div class="flex justify-center">
                            <a target="_blank" href={`${'paymentDetail?.invoiceDownloadUrl'}`} class="flex justify-center mx-2 w-52 bg-theme-blue-secondary hover:bg-indigo-500 text-white py-2" rel="noreferrer">
                                Download Invoice
                            </a>
                        </div>
                    </div>
                    <div className="text-gray-400 text-2xl font-medium text-center py-4">You have booked {paymentDetail?.sessionType} training session. Please select your slot below</div>
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
                            <button disabled={(bookedSlots.length >= paymentDetail?.sessions)} id="submit" onClick={() => addSlots()} type="submit" className={`${(bookedSlots.length >= paymentDetail?.sessions) && ' cursor-not-allowed '} mx-2 inline-flex w-[200px] items-center justify-center rounded bg-theme-blue-secondary py-2 px-4 text-gray-400 hover:text-opacity-100`}>
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
                    <div className="flex justify-center my-2">booked slots</div>
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
                    Confirm Booking
                </button>
            </div>
        </div >
    );
}

export default PaymentConfirmationPage;
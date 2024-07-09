import React, { useEffect, useState } from 'react';
import axios from "axios";
import moment from 'moment';
import { BASE_URL } from "../../config";
import StripePaymentTraining from './StripePayment';
import { useNavigate } from 'react-router-dom';

const PersonalTraining = () => {
    const [showPaymentForm, setShowPaymentForm] = useState(false);
    const [loading, setLoading] = useState(true);
    const [bookedTrainningSession, setBookedTrainningSession] = useState([]);
    const [showBookedTrainningSession, setShowBookedTrainningSession] = useState(true);
    const [selectedRow, setSelectedRow] = useState(false);
    const [traningSessionDetail, setTraningSessionDetail] = useState({
        total: 0,
        booked: 0
    });

    useEffect(() => {
        let subscribedStatus = localStorage.getItem('subscribedStatus');
            
        // If subscribedStatus is falsy, redirect to membership page
        if (subscribedStatus == 'false') {
            window.location = window.location.origin + '/membership';
            return false;
        }
    });

    const navigate = useNavigate();

    const clickOnRow = (index) => {
        if (selectedRow === index) {
            setSelectedRow(false);
        } else {
            setSelectedRow(index);
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
            setBookedTrainningSession(res?.data?.data);
            setLoading(false);
        });
    };

    useEffect(() => {
        getTrainingSession();
    }, []);

    useEffect(() => {
        let totalTrainingSession = 0;
        let bookedTrainingSession = 0;
        bookedTrainningSession?.map((data) => {
            totalTrainingSession = totalTrainingSession + parseInt(data?.sessions);
            bookedTrainingSession = bookedTrainingSession + data?.sessionTiming?.length;
        });
        setTraningSessionDetail({
            total: totalTrainingSession,
            booked: bookedTrainingSession
        });
    }, [bookedTrainningSession]);

    const downloadReceipt = async (receiptUrl) => {
        window.open(receiptUrl, '_blank')
    };

    return (
        <>
            <div className="min-h-screen md:mx-16 md:h-auto">
                <div className="py-8 px-4 lg:py-10">
                    <div className="flex justify-between items-center border-b border-blue-200 border-opacity-20 h-14 mb-8 mx-8">
                        <div className="text-2xl tracking-tight font-medium text-gray-300 dark:text-white">
                            Training
                        </div>
                    </div>
                    {showPaymentForm ? (
                        <StripePaymentTraining paymentType={showPaymentForm} setPaymentPage={() => { setShowPaymentForm(false); setShowBookedTrainningSession(true); }} setPaymentPageLoaded={() => { }} />
                    ) : (
                        <div>
                            {(bookedTrainningSession.length > 0) && (
                                <div className="pb-8 px-1 md:px-12">
                                    <div className="text-md md:text-lg text-white mb-14">
                                        Welcome, {localStorage.getItem('user-name')} !
                                        <br />
                                        Thank you for being a part of the CFT program and training. Here is your overall journey with us!
                                    </div>
                                    <div class="flex justify-between mb-4">
                                        <span class="text-md md:text-xl text-[#818cf8] dark:text-white">Your Training Sessions</span>
                                        <div>
                                            <span class="text-md md:text-xl text-[#34d399] dark:text-white">{traningSessionDetail?.booked}/</span>
                                            <span className="text-md md:text-xl text-[#818cf8] dark:text-white">{traningSessionDetail?.total}</span>
                                        </div>
                                    </div>
                                    <div class="w-full bg-[#818cf8] rounded-full h-2 dark:bg-gray-700">
                                        <div class="bg-[#34d399] h-2 rounded-full" style={{ width: `${((traningSessionDetail?.booked / traningSessionDetail?.total) * 100)}%` }}></div>
                                    </div>
                                    <div className="flex my-4">
                                        <div onClick={() => navigate('/services/book/slots')} className="bg-[#2563eb] md:w-[280px] cursor-pointer text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:ring-primary-200 rounded-lg text-sm md:text-lg px-2 py-2.5 mr-8 text-center dark:text-white  dark:focus:ring-primary-900">
                                            Book your session
                                            {false && (
                                                <svg aria-hidden="true" role="status" className="inline w-4 h-4 ml-3 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB" />
                                                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor" />
                                                </svg>
                                            )}
                                        </div>
                                        <div onClick={() => navigate('/booked/sessions')} className="bg-[#fdba74] md:w-[300px] cursor-pointer text-gray-600 bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:ring-primary-200 rounded-lg text-sm md:text-lg px-2 py-2.5 mr-8 text-center dark:text-white  dark:focus:ring-primary-900">
                                            Booked Session History
                                            {false && (
                                                <svg aria-hidden="true" role="status" className="inline w-4 h-4 ml-3 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB" />
                                                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor" />
                                                </svg>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div className="mx-auto max-w-screen-md text-center pt-10 lg:mb-12">
                                <h2 className="mb-4 text-4xl tracking-tight font-bold text-gray-300 dark:text-white">TRAINING PACKAGES</h2>
                                <p className="mb-5 font-light text-gray-400 sm:text-xl dark:text-gray-400">Individuals and Employees. Hourly Video Session. Minimum exercise equipment required</p>
                            </div>
                            <div className="flex flex-wrap justify-around">
                                <div className="flex flex-col p-6 mx-0 my-2 w-80 text-center text-gray-300 bg-theme-blue rounded-lg shadow dark:border-gray-600 xl:p-8 dark:bg-gray-800 dark:text-white">
                                    <div className="flex justify-center items-baseline mt-8 mb-2">
                                        <span className="mr-2 text-5xl font-bold">$ 50</span>
                                        {/* <span className="text-2xl text-gray-400 dark:text-gray-400">/month</span> */}
                                    </div>
                                    <h2 className="text-2xl tracking-tight font-semibold text-gray-300 dark:text-white mb-8">1 SESSION</h2>
                                    <span onClick={() => setShowPaymentForm(50)} className="bg-theme-blue-secondary cursor-pointer text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:ring-primary-200 font-medium rounded-lg text-sm px-5 py-2.5 mb-8 text-center dark:text-white  dark:focus:ring-primary-900">
                                        Buy Now
                                        {false && (
                                            <svg aria-hidden="true" role="status" className="inline w-4 h-4 ml-3 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB" />
                                                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor" />
                                            </svg>
                                        )}
                                    </span>
                                </div>
                                <div className="flex flex-col p-6 mx-0 my-2 w-80 text-center text-gray-300 bg-theme-blue rounded-lg shadow dark:border-gray-600 xl:p-8 dark:bg-gray-800 dark:text-white">
                                    <div className="flex justify-center items-baseline mt-8 mb-2">
                                        <span className="mr-2 text-5xl font-bold">$ 180</span>
                                        {/* <span className="text-2xl text-gray-400 dark:text-gray-400">/month</span> */}
                                    </div>
                                    <h2 className="text-2xl tracking-tight font-semibold text-gray-300 dark:text-white mb-8">4 SESSIONS</h2>
                                    <span onClick={() => setShowPaymentForm(180)} className="bg-theme-blue-secondary cursor-pointer text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:ring-primary-200 font-medium rounded-lg text-sm px-5 py-2.5 mb-8 text-center dark:text-white  dark:focus:ring-primary-900">
                                        Buy Now
                                        {false && (
                                            <svg aria-hidden="true" role="status" className="inline w-4 h-4 ml-3 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB" />
                                                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor" />
                                            </svg>
                                        )}
                                    </span>
                                </div>
                                <div className="flex flex-col p-6 mx-0 my-2 w-80 text-center text-gray-300 bg-theme-blue rounded-lg shadow dark:border-gray-600 xl:p-8 dark:bg-gray-800 dark:text-white">
                                    <div className="flex justify-center items-baseline mt-8 mb-2">
                                        <span className="mr-2 text-5xl font-bold">$ 400</span>
                                        {/* <span className="text-2xl text-gray-400 dark:text-gray-400">/month</span> */}
                                    </div>
                                    <h2 className="text-2xl tracking-tight font-semibold text-gray-300 dark:text-white mb-8">10 SESSIONS</h2>
                                    <span onClick={() => setShowPaymentForm(400)} className="bg-theme-blue-secondary cursor-pointer text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:ring-primary-200 font-medium rounded-lg text-sm px-5 py-2.5 mb-8 text-center dark:text-white  dark:focus:ring-primary-900">
                                        Buy Now
                                        {false && (
                                            <svg aria-hidden="true" role="status" className="inline w-4 h-4 ml-3 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB" />
                                                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor" />
                                            </svg>
                                        )}
                                    </span>
                                </div>
                            </div>
                            {/* <div className="flex flex-wrap justify-center">
                                {(bookedTrainningSession.length > 0) && (
                                    <div onClick={() => setShowBookedTrainningSession(true)} className="bg-theme-blue-secondary cursor-pointer w-90 text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:ring-primary-200 font-medium rounded-lg text-lg px-10 py-4 my-8 text-center dark:text-white dark:focus:ring-primary-900">
                                        SHOW BOOKED TRAINING SESSION
                                        {false && (
                                            <svg aria-hidden="true" role="status" className="inline w-4 h-4 ml-3 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB" />
                                                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor" />
                                            </svg>
                                        )}
                                    </div>
                                )}
                            </div> */}
                            {(bookedTrainningSession.length > 0) && (
                                <div className="pt-14">
                                    <div className="mx-auto max-w-screen-md text-center my-8 lg:mb-12">
                                        <h2 className="mb-4 text-4xl tracking-tight font-bold text-gray-300 dark:text-white">PACKAGE ORDER HISTORY</h2>
                                        <p className="mb-5 font-light text-gray-400 sm:text-xl dark:text-gray-400">Following are the all your recent transaction details</p>
                                    </div>
                                    <div className="md:block hidden">
                                        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                                            <thead className="text-xs text-gray-400 uppercase bg-theme-blue-secondary">
                                                <tr>
                                                    <th scope="col" className="px-6 py-3">
                                                        Transaction Id
                                                    </th>
                                                    <th scope="col" className="px-6 py-3">
                                                        Package Plan
                                                    </th>
                                                    <th scope="col" className="px-6 py-3">
                                                        Transaction Date
                                                    </th>
                                                    <th scope="col" className="px-6 py-3">
                                                        Receipt
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    bookedTrainningSession.map((data, i) => (
                                                        <tr className="border-b border-gray-600">
                                                            <th scope="row" className="px-6 py-2 font-medium text-gray-400 whitespace-nowrap dark:text-white">
                                                                {data?.paymentIntent}
                                                            </th>
                                                            <td className="px-6 py-2 text-gray-300">
                                                                {data?.sessions} SESSION @ ${data?.amount / 100}
                                                            </td>
                                                            <td className="px-6 py-2 text-gray-300">
                                                                {moment(data?.createdAt).format('DD MMM YYYY')}
                                                            </td>
                                                            <td onClick={() => downloadReceipt(data?.receiptUrl)} className="px-6 py-2 text-gray-400 cursor-pointer">
                                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6">
                                                                    <path d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
                                                                    <path fill-rule="evenodd" d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 010-1.113zM17.25 12a5.25 5.25 0 11-10.5 0 5.25 5.25 0 0110.5 0z" clip-rule="evenodd" />
                                                                </svg>
                                                            </td>
                                                        </tr>
                                                    ))
                                                }
                                            </tbody>
                                        </table>
                                    </div >
                                    <div className="md:hidden block">
                                        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                                            <div id="accordion-color" data-accordion="collapse" data-active-classes="bg-blue-100 dark:bg-gray-800 text-blue-600 dark:text-white">
                                                {bookedTrainningSession?.map((data, i) => {
                                                    return (
                                                        <div className="bg-theme-blue text-gray-400 border-gray-600 dark:bg-gray-800 dark:border-gray-700">
                                                            <h2 id="accordion-color-heading-1" onClick={() => clickOnRow(i)}>
                                                                <button type="button" class={`flex items-center justify-between w-full p-5 font-medium text-left text-gray-400 border border-t-0.5 ${i + 1 === bookedTrainningSession.length ? ' border-b-0.5 ' : ' border-b-0 '} border-gray-200 dark:border-gray-700 dark:text-gray-400`} data-accordion-target="#accordion-color-body-1" aria-expanded="true" aria-controls="accordion-color-body-1">
                                                                    <span>{data?.sessions} SESSION @ ${data?.amount / 100}</span>
                                                                    <svg data-accordion-icon class="w-3 h-3 rotate-180 shrink-0" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                                                                        <path stroke="currentColor" stroke-linecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5 5 1 1 5" />
                                                                    </svg>
                                                                </button>
                                                            </h2>
                                                            <div id="accordion-color-body-1" class={`${selectedRow === i ? 'show' : 'hidden'} py-4 bg-theme-blue-secondary`} aria-labelledby="accordion-color-heading-1">
                                                                <div scope="row" className="px-6 pb-2 whitespace-nowrap dark:text-white">
                                                                    <span className="font-medium text-gray-400">Payment Id</span> :   {data?.paymentIntent}
                                                                </div>
                                                                <div className="px-6 pb-2">
                                                                    <span className="font-medium text-gray-400">Paymment Date</span> : {moment(data?.createdAt).format('DD MMM YYYY')}
                                                                </div>
                                                                <div onClick={() => downloadReceipt(data?.receiptUrl)} className="px-6 pb-2">
                                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6">
                                                                        <path d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
                                                                        <path fill-rule="evenodd" d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 010-1.113zM17.25 12a5.25 5.25 0 11-10.5 0 5.25 5.25 0 0110.5 0z" clip-rule="evenodd" />
                                                                    </svg>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )
                                                }
                                                )}
                                            </div>
                                        </table >
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div >
        </>
    )
}
export default PersonalTraining;
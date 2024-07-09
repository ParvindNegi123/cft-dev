import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import Skeleton from 'react-loading-skeleton';

const Leaderboard = () => {

    const navigate = useNavigate();
    const location = useLocation();

    let subscribedStatus = localStorage.getItem('subscribedStatus');
        
    // If subscribedStatus is falsy, redirect to membership page
    if (subscribedStatus == 'false') {
        window.location = window.location.origin + '/membership';
        return false;
    }

    return (
        <>
            <div className="dark:bg-slate-900" style={{ height: "100vh" }}>
                <div class="flex flex-col pt-10 items-center min-h-screen">
                    <div class="bg-theme-blue-secondary shadow-lg rounded-lg p-8 w-full sm:w-2/3 lg:w-1/2">
                        <div className='flex justify-center items-center text-4xl pb-10 text-gray-500 h-[50vh]'>
                            Leaderboard Coming Soon
                        </div>
                    </div>
                </div>
            </div >
        </>
    )
}
export default Leaderboard;
import React, { useEffect, useState } from 'react';
// import Calendar from 'react-awesome-calendar';
import axios from 'axios';
import Calendar from '../components/calendar';
import { useNavigate, useLocation } from "react-router-dom";


const Dashboard = () => {

    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        let subscribedStatus = localStorage.getItem('subscribedStatus');
            
        // If subscribedStatus is falsy, redirect to membership page
        if (subscribedStatus == 'false') {
            window.location.href = 'membership';
            return false;
        }
    });

    const handleChange = (event) => {

    }

    const handleSubmit = (event) => {
        axios({
            url: `https://api.omangom.com/`, //your url
            method: 'GET'
        }).then((res) => {

        });
    };

    const events = [{
        id: 1,
        color: '#FFFFFF',
        from: '2023-02-01',
        to: '2023-02-01',
        title: `⏱️2330 🔥2152`
    },
    {
        id: 2,
        color: '#FFFFFF',
        from: '2023-02-02',
        to: '2023-02-02',
        title: `⏱️2330 🔥2152`
    },
    {
        id: 1,
        color: '#FFFFFF',
        from: '2023-02-03',
        to: '2023-02-03',
        title: `⏱️2330 🔥2152`
    },
    {
        id: 2,
        color: '#FFFFFF',
        from: '2023-02-04',
        to: '2023-02-04',
        title: `⏱️2330 🔥2152`
    },
    {
        id: 1,
        color: '#FFFFFF',
        from: '2023-02-05',
        to: '2023-02-05',
        title: `⏱️2330 🔥2152`
    }, {
        id: 2,
        color: '#FFFFFF',
        from: '2023-02-06',
        to: '2023-02-06',
        title: `⏱️2330 🔥2152`
    }];


    return (
        <div className="dark:bg-slate-900 min-h-[88vh]">
            <div className="calendar-background">
                <Calendar events={events} />
            </div>
        </div>
    );
}
export default Dashboard;
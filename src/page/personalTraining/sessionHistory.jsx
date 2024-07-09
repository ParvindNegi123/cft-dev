import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from "../../config";
import Table from '../../components/table';
import axios from 'axios';
import moment from 'moment';

const SessionHistory = () => {

    useEffect(() => {
        let subscribedStatus = localStorage.getItem('subscribedStatus');
            
        // If subscribedStatus is falsy, redirect to membership page
        if (subscribedStatus == 'false') {
            window.location = window.location.origin + '/membership';
            return false;
        }
    });

    const navigate = useNavigate();
    const [rowHeaderData, setRowHeaderData] = useState([]);
    const [pagination, setPagination] = useState({
        page: 1,
        offset: 0,
        itemsPerPage: 10,
        totalCount: 0,
    });
    const [trainingSlots, setTrainingSlots] = useState([]);
    const [loading, setLoading] = useState([]);

    const getTrainingSlots = () => {
        setLoading(true);
        axios({
            headers: {
                "x-access-token": localStorage.getItem('auth-token')
            },
            url: `${BASE_URL}/user/training/slots`, //your url
            method: 'get',
        }).then((res) => {
            setTrainingSlots(res?.data?.data);
            setLoading(false);
        });
    };
    const userTableRowTitle = [
        { title: "Date", key: "date", formatData: (data) => moment(data).format('DD MMM YYYY') },
        { title: "Start Time", key: "startTime" },
        { title: "End Time", key: "endTime" },
    ];

    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth', // Optional: adds smooth scrolling animation
        });
        setRowHeaderData(userTableRowTitle);
    }, []);

    useEffect(() => {
        getTrainingSlots();
    }, [pagination.page]);

    const getActionData = (data) => {
        return false;
    };

    return (
        <>
            <div className="h-screen md:mx-20">
                <div className="flex justify-between mx-2 py-8 md:my-0 md:mx-10">
                    <button onClick={() => navigate('/services')} type="button" className="flex items-center bg-theme-blue-secondary text-gray-200 p-2.5 rounded-full">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                            <path fill-rule="evenodd" d="M18 10a.75.75 0 01-.75.75H4.66l2.1 1.95a.75.75 0 11-1.02 1.1l-3.5-3.25a.75.75 0 010-1.1l3.5-3.25a.75.75 0 111.02 1.1l-2.1 1.95h12.59A.75.75 0 0118 10z" clip-rule="evenodd" />
                        </svg>
                    </button>
                    <h2 className="text-4xl text-center tracking-tight font-bold text-gray-300 dark:text-white">Booked Session History</h2>
                </div>
                <Table setPagination={setPagination} pagination={pagination} loading={loading} headerData={rowHeaderData} rowData={trainingSlots} getActionData={getActionData} />
            </div>
        </>
    )
}
export default SessionHistory;
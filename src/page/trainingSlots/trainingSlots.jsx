import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from "../../config";
import Table from '../../components/table';
import axios from 'axios';
import moment from 'moment';
import Modal from '../../components/modal';

const TrainingSlots = () => {
    const navigate = useNavigate();
    const [unavailableSlots, setUnavailableSlots] = useState([]);
    const [rowHeaderData, setRowHeaderData] = useState([]);
    const [confirmationModal, setConfirmationModal] = useState(false);
    const [selectedSlotId, setSelectedSlotId] = useState('');
    const [buttonClicked, setButtonClicked] = useState('');
    const [pagination, setPagination] = useState({
        page: 1,
        offset: 0,
        itemsPerPage: 10,
        totalCount: 0,
    });
    const [userData, setUserData] = useState([]);
    const [loading, setLoading] = useState([]);

    useEffect(() => {
        let isAdmin = ['admin'].includes(localStorage.getItem('roles'));
            
        // If roles is not admin, redirect to dashboard page
        if (!isAdmin) {
            window.location = window.location.origin + '/membership';
            return false;
        }
    });

    const getUnavailableSlots = () => {
        setLoading(true);
        axios({
            headers: {
                "x-access-token": localStorage.getItem('auth-token')
            },
            url: `${BASE_URL}/admin/slots/unavailable/${pagination?.page}/${pagination?.offset}/${pagination?.itemsPerPage}`,
            method: 'get',
        }).then((res) => {
            setUnavailableSlots(res?.data?.data || []);
            setPagination({ ...pagination, totalCount: res?.data?.count || 0 });
            setLoading(false);
        });
    };
    const userTableRowTitle = [
        { title: "Date", key: "date", formatData: (data) => moment(data).utc().format('DD MMM YYYY') },
        { title: "Start Time", key: "startTime" },
        { title: "End Time", key: "endTime" },
        { title: "Booked By", key: "user", formatData: (data) => data ? data?.email : '' },
    ];

    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth', // Optional: adds smooth scrolling animation
        });
        setRowHeaderData(userTableRowTitle);
    }, []);

    useEffect(() => {
        getUnavailableSlots();
    }, [pagination.page]);

    const getActionData = (data) => {
        return (
            <p className="flex">
                {(data?.user) && (
                    <svg onClick={() => { setButtonClicked('remove-user'); setConfirmationModal(true); setSelectedSlotId(data?._id); }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5 cursor-pointer mr-4">
                        <path d="M10.375 2.25a4.125 4.125 0 100 8.25 4.125 4.125 0 000-8.25zM10.375 12a7.125 7.125 0 00-7.124 7.247.75.75 0 00.363.63 13.067 13.067 0 006.761 1.873c2.472 0 4.786-.684 6.76-1.873a.75.75 0 00.364-.63l.001-.12v-.002A7.125 7.125 0 0010.375 12zM16 9.75a.75.75 0 000 1.5h6a.75.75 0 000-1.5h-6z" />
                    </svg>
                )}
                {(!data?.user) && (
                    <svg onClick={() => { setButtonClicked('delete'); setConfirmationModal(true); setSelectedSlotId(data?._id); }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5 cursor-pointer">
                        <path fill-rule="evenodd" d="M16.5 4.478v.227a48.816 48.816 0 013.878.512.75.75 0 11-.256 1.478l-.209-.035-1.005 13.07a3 3 0 01-2.991 2.77H8.084a3 3 0 01-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 01-.256-1.478A48.567 48.567 0 017.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 013.369 0c1.603.051 2.815 1.387 2.815 2.951zm-6.136-1.452a51.196 51.196 0 013.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 00-6 0v-.113c0-.794.609-1.428 1.364-1.452zm-.355 5.945a.75.75 0 10-1.5.058l.347 9a.75.75 0 101.499-.058l-.346-9zm5.48.058a.75.75 0 10-1.498-.058l-.347 9a.75.75 0 001.5.058l.345-9z" clip-rule="evenodd" />
                    </svg>
                )}
            </p>
        );
    };

    const onModalConfirm = () => {
        setLoading(true);
        if (buttonClicked === 'delete') {
            axios({
                headers: {
                    "x-access-token": localStorage.getItem('auth-token')
                },
                url: `${BASE_URL}/admin/slots/unavailable/${selectedSlotId}`,
                method: 'delete',
            }).then((res) => {
                setConfirmationModal(false);
                getUnavailableSlots();
                setLoading(false);
            });
        } else if (buttonClicked === 'remove-user') {
            axios({
                headers: {
                    "x-access-token": localStorage.getItem('auth-token')
                },
                url: `${BASE_URL}/admin/slots/remove/user/${selectedSlotId}`,
                method: 'put',
            }).then((res) => {
                setConfirmationModal(false);
                getUnavailableSlots();
                setLoading(false);
            });
        }
    };

    return (
        <>
            <div className="md:mx-20 pt-10">
                <div className="flex justify-between items-center border-b border-blue-200 border-opacity-20 h-14 mb-8 mx-8">
                    <div className="text-2xl tracking-tight font-medium text-gray-300 dark:text-white">
                        Set Your Availability
                    </div>
                    <div className="mx-2 pb-2 md:my-0 md:mx-10">
                        <button onClick={() => navigate('/training-slots/add')} type="button" className="button-theme font-medium rounded-full text-sm px-5 py-2.5 md:mt-2 text-center inline-flex items-center dark:focus:ring-[#4285F4]/55 mr-2">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 pr-1">
                                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-11.25a.75.75 0 00-1.5 0v2.5h-2.5a.75.75 0 000 1.5h2.5v2.5a.75.75 0 001.5 0v-2.5h2.5a.75.75 0 000-1.5h-2.5v-2.5z" clip-rule="evenodd" />
                            </svg>
                            Set your availability
                        </button>
                    </div>
                </div>
                <Table setPagination={setPagination} pagination={pagination} loading={loading} headerData={rowHeaderData} rowData={unavailableSlots} getActionData={getActionData} />
            </div>
            <Modal
                title={(buttonClicked === 'remove-user') ? "Remove User" : "Remove Slot"}
                content={(buttonClicked === 'remove-user') ? "Do you really want to remove user ?" : "Do you really want to remove slot ?"}
                modalShow={confirmationModal}
                onModalConfirm={onModalConfirm}
                setModalShow={setConfirmationModal}
            />
        </>
    )
}
export default TrainingSlots;
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from "../../config";
import Table from '../../components/table';
import Modal from '../../components/modal';
import DragAndDrop from '../../components/dragAndDrop';
import axios from 'axios';

const WellnessProgram = () => {
    const navigate = useNavigate();
    const [rowHeaderData, setRowHeaderData] = useState([]);
    const [userData, setUserData] = useState([]);
    const [loading, setLoading] = useState([]);
    const [deleteId, setDeleteId] = useState('');
    const [bulkUploadModal, setBulkUploadModal] = useState(false);
    const [inviteBulkLoading, setInviteBulkLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        let isAdmin = ['admin'].includes(localStorage.getItem('roles'));
            
        // If roles is not admin, redirect to dashboard page
        if (!isAdmin) {
            window.location = window.location.origin + '/membership';
            return false;
        }
    });

    const getCompanyDetail = () => {
        setLoading(true);
        axios({
            headers: {
                "x-access-token": localStorage.getItem('auth-token')
            },
            url: `${BASE_URL}/user/invite/company/list`, //your url
            method: 'get'
        }).then((res) => {
            setUserData(res?.data?.data);
            setLoading(false);
        });
    };

    const getUserDetail = () => {
        axios({
            headers: {
                "x-access-token": localStorage.getItem('auth-token')
            },
            url: `${BASE_URL}/user/invite/user/list`, //your url
            method: 'get'
        }).then((res) => {
            setUserData(res?.data?.data);
            setLoading(false);
        });
    };

    const onClickDeleteUser = (id) => {
        axios({
            headers: {
                "x-access-token": localStorage.getItem('auth-token')
            },
            url: `${BASE_URL}/user/${id}`, //your url
            method: 'delete'
        }).then((res) => {
            setRowHeaderData(userTableRowTitle);
            getUserDetail();
            setLoading(false);
        });
    };

    const onClickDeleteCompany = (id) => {
        axios({
            headers: {
                "x-access-token": localStorage.getItem('auth-token')
            },
            url: `${BASE_URL}/user/company/${id}`, //your url
            method: 'delete'
        }).then((res) => {
            setRowHeaderData(companyTableRowTitle);
            getCompanyDetail();
            setLoading(false);
        });
    };

    const inviteBulkUser = (bulkUserForm) => {
        setInviteBulkLoading(true);
        axios({
            headers: {
                "x-access-token": localStorage.getItem('auth-token')
            },
            url: `${BASE_URL}/user/invite/user/bulk`, //your url
            method: 'post',
            data: bulkUserForm
        }).then((res) => {
            setBulkUploadModal(false);
            setInviteBulkLoading(false);
            getUserDetail();
            setLoading(false);
        }).catch((err) => {
            setInviteBulkLoading(false);
            if (err?.response?.data?.message) {
                setError(err?.response?.data?.message);
                setTimeout(() => {
                    setError('');
                }, 3000);
            }
        });
    };

    const userTableRowTitle = [
        { title: "First Name", key: "firstName" },
        { title: "Last Name", key: "lastName" },
        { title: "Email", key: "email" },
        { title: "Person In Charge", key: "personInCharge" },
        { title: "Registration Status", key: "isActive", formatData: (data) => data ? "pending" : "success" },
    ];

    const companyTableRowTitle = [
        { title: "Company Name", key: "companyName" },
        { title: "Company Type", key: "typeOfCompany" },
        { title: "Email", key: "email" },
        { title: "Person In Charge", key: "personInCharge" },
        { title: "Registration Status", key: "isActive", formatData: (data) => data ? "pending" : "success" },
    ];

    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth', // Optional: adds smooth scrolling animation
        });
        if (localStorage.getItem('roles') === "company") {
            setRowHeaderData(userTableRowTitle);
            getUserDetail();
        } else {
            setRowHeaderData(companyTableRowTitle);
            getCompanyDetail();
        }
    }, []);

    const getActionData = (data) => {
        return (
            <span className="flex">
                {(localStorage.getItem('roles') === "admin") &&
                    <svg onClick={() => { navigate(`/wellnessprogram/company/${data.email}`); localStorage.setItem('selectedCompany', JSON.stringify(data)); }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="cursor-pointer w-5 h-5 mr-4">
                        <path d="M10 12.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" />
                        <path fill-rule="evenodd" d="M.664 10.59a1.651 1.651 0 010-1.186A10.004 10.004 0 0110 3c4.257 0 7.893 2.66 9.336 6.41.147.381.146.804 0 1.186A10.004 10.004 0 0110 17c-4.257 0-7.893-2.66-9.336-6.41zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd" />
                    </svg>
                }
                <svg onClick={() => navigator.clipboard.writeText(`https://app.contingentfitness.com/sign-up/${(localStorage.getItem('roles') === "admin") ? 'company' : 'user'}/${data?.token}`)} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="cursor-pointer w-5 h-5 mr-4">
                    <path d="M7 3.5A1.5 1.5 0 018.5 2h3.879a1.5 1.5 0 011.06.44l3.122 3.12A1.5 1.5 0 0117 6.622V12.5a1.5 1.5 0 01-1.5 1.5h-1v-3.379a3 3 0 00-.879-2.121L10.5 5.379A3 3 0 008.379 4.5H7v-1z" />
                    <path d="M4.5 6A1.5 1.5 0 003 7.5v9A1.5 1.5 0 004.5 18h7a1.5 1.5 0 001.5-1.5v-5.879a1.5 1.5 0 00-.44-1.06L9.44 6.439A1.5 1.5 0 008.378 6H4.5z" />
                </svg>
                {((localStorage.getItem('roles') === "admin") || (localStorage.getItem('roles') === "company")) &&
                    ((deleteId === data?._id) ? (
                        <div className="flex">
                            <svg onClick={() => (localStorage.getItem('roles') === "company") ? onClickDeleteUser(data?._id) : onClickDeleteCompany(data?._id)} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5 cursor-pointer">
                                <path fill-rule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clip-rule="evenodd" />
                            </svg>
                            <svg onClick={() => setDeleteId('')} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5 cursor-pointer">
                                <path fill-rule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-1.72 6.97a.75.75 0 10-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 101.06 1.06L12 13.06l1.72 1.72a.75.75 0 101.06-1.06L13.06 12l1.72-1.72a.75.75 0 10-1.06-1.06L12 10.94l-1.72-1.72z" clip-rule="evenodd" />
                            </svg>
                        </div>
                    ) : (
                        <svg onClick={() => setDeleteId(data?._id)} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5 mr-4 cursor-pointer">
                            <path fill-rule="evenodd" d="M16.5 4.478v.227a48.816 48.816 0 013.878.512.75.75 0 11-.256 1.478l-.209-.035-1.005 13.07a3 3 0 01-2.991 2.77H8.084a3 3 0 01-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 01-.256-1.478A48.567 48.567 0 017.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 013.369 0c1.603.051 2.815 1.387 2.815 2.951zm-6.136-1.452a51.196 51.196 0 013.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 00-6 0v-.113c0-.794.609-1.428 1.364-1.452zm-.355 5.945a.75.75 0 10-1.5.058l.347 9a.75.75 0 101.499-.058l-.346-9zm5.48.058a.75.75 0 10-1.498-.058l-.347 9a.75.75 0 001.5.058l.345-9z" clip-rule="evenodd" />
                        </svg>
                    ))
                }
            </span>
        );
    };

    return (
        <>
            <div className="h-screen md:mx-20 pt-10">
                <div className="flex justify-between items-center border-b border-blue-200 border-opacity-20 h-14 mb-8 mx-8">
                    <div className="text-2xl tracking-tight font-medium text-gray-300 dark:text-white">
                        {(localStorage.getItem('roles') === "company") ? 'User Invite' : 'Company Invite'}
                    </div>
                    <div className="text-4xl tracking-tight font-medium text-gray-300 dark:text-white">
                        {(localStorage.getItem('roles') === "company") && (
                            <button onClick={() => setBulkUploadModal(true)} type="button" className="button-theme font-medium rounded-full text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-[#4285F4]/55 mr-2">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 mr-1">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 8.25H7.5a2.25 2.25 0 00-2.25 2.25v9a2.25 2.25 0 002.25 2.25h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25H15m0-3l-3-3m0 0l-3 3m3-3V15" />
                                </svg>
                                Bulk Invite
                            </button>
                        )}
                        <button onClick={() => navigate(`/wellnessprogram/invite-${(localStorage.getItem('roles') === "company") ? 'user' : 'company'}`)} type="button" className="button-theme font-medium rounded-full text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-[#4285F4]/55">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 pr-1">
                                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-11.25a.75.75 0 00-1.5 0v2.5h-2.5a.75.75 0 000 1.5h2.5v2.5a.75.75 0 001.5 0v-2.5h2.5a.75.75 0 000-1.5h-2.5v-2.5z" clip-rule="evenodd" />
                            </svg>
                            {(localStorage.getItem('roles') === "company") ? 'Invite User' : 'Invite Company'}
                        </button>
                    </div>
                </div>
                <div className="mx-2 md:my-0 md:mx-10">
                    {/* <button onClick={() => navigate(`/wellnessprogram/invite-${(localStorage.getItem('roles') === "company") ? 'user' : 'company'}`)} type="button" className="button-theme font-medium rounded-full text-sm px-5 py-2.5 my-4 md:mt-6 text-center inline-flex items-center dark:focus:ring-[#4285F4]/55 mr-2">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 pr-1">
                            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-11.25a.75.75 0 00-1.5 0v2.5h-2.5a.75.75 0 000 1.5h2.5v2.5a.75.75 0 001.5 0v-2.5h2.5a.75.75 0 000-1.5h-2.5v-2.5z" clip-rule="evenodd" />
                        </svg>
                        {(localStorage.getItem('roles') === "company") ? 'Invite User' : 'Invite Company'}
                    </button> */}

                </div>
                <Table loading={loading} headerData={rowHeaderData} rowData={userData} getActionData={getActionData} />
                <Modal
                    title={"Bulk User Upload"}
                    content={(
                        <DragAndDrop modalShow={bulkUploadModal} uploadLoading={inviteBulkLoading} inviteBulkUser={inviteBulkUser} />
                    )}
                    modalShow={bulkUploadModal}
                    inviteBulkUser={(data) => inviteBulkUser(data)}
                    setModalShow={setBulkUploadModal}
                    notShowFooter={true}
                />
            </div >
        </>
    )
}
export default WellnessProgram;
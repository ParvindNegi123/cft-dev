import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { BASE_URL } from "../../config";
import Table from '../../components/table';
import exportToCSV from '../../helper/exportToCSV';
import axios from 'axios';

const CompanyEmployee = () => {

    useEffect(() => {
        let isAdmin = ['admin'].includes(localStorage.getItem('roles'));
            
        // If roles is not admin, redirect to dashboard page
        if (!isAdmin) {
            window.location = window.location.origin + '/membership';
            return false;
        }
    });

    const navigate = useNavigate();
    const params = useParams();
    const [rowHeaderData, setRowHeaderData] = useState([]);
    const [userData, setUserData] = useState([]);
    const [loading, setLoading] = useState([]);
    const [deleteId, setDeleteId] = useState('');

    const getUserDetail = () => {
        setLoading(true);
        axios({
            headers: {
                "x-access-token": localStorage.getItem('auth-token')
            },
            url: `${BASE_URL}/user/invite/user/list/byadmin/${params?.companyEmail}`, //your url
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
            setDeleteId('');
            getUserDetail();
            setLoading(false);
        });
    };

    const userTableRowTitle = [
        { title: "First Name", key: "firstName" },
        { title: "Last Name", key: "lastName" },
        { title: "Email", key: "email" },
        { title: "Invited By", key: "invitedBy" },
        { title: "Registration Status", key: "isActive", formatData: (data) => data ? "pending" : "success" },
    ];

    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth', // Optional: adds smooth scrolling animation
        });
        setRowHeaderData(userTableRowTitle);
        getUserDetail();
    }, []);

    const getActionData = (data) => {
        return (
            <span className="flex">
                <svg onClick={() => navigator.clipboard.writeText(`https://app.contingentfitness.com/sign-up/${(localStorage.getItem('roles') === "admin") ? 'company' : 'user'}/${data?.token}`)} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="cursor-pointer w-5 h-5 mx-4">
                    <path d="M7 3.5A1.5 1.5 0 018.5 2h3.879a1.5 1.5 0 011.06.44l3.122 3.12A1.5 1.5 0 0117 6.622V12.5a1.5 1.5 0 01-1.5 1.5h-1v-3.379a3 3 0 00-.879-2.121L10.5 5.379A3 3 0 008.379 4.5H7v-1z" />
                    <path d="M4.5 6A1.5 1.5 0 003 7.5v9A1.5 1.5 0 004.5 18h7a1.5 1.5 0 001.5-1.5v-5.879a1.5 1.5 0 00-.44-1.06L9.44 6.439A1.5 1.5 0 008.378 6H4.5z" />
                </svg>
                {((localStorage.getItem('roles') === "admin") || (localStorage.getItem('roles') === "company")) &&
                    ((deleteId === data?._id) ? (
                        <div className="flex">
                            <svg onClick={() => onClickDeleteUser(data?._id)} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5 cursor-pointer">
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

    const companyData = JSON.parse(localStorage.getItem('selectedCompany') || {});

    return (
        <>
            <div className="h-screen md:mx-20">
                <div className="md:my-0 pt-4">
                    <button onClick={() => navigate('/wellnessprogram')} type="button" className="flex items-center bg-theme-blue-secondary text-gray-200 p-2 rounded-full mx-10">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                            <path fill-rule="evenodd" d="M18 10a.75.75 0 01-.75.75H4.66l2.1 1.95a.75.75 0 11-1.02 1.1l-3.5-3.25a.75.75 0 010-1.1l3.5-3.25a.75.75 0 111.02 1.1l-2.1 1.95h12.59A.75.75 0 0118 10z" clip-rule="evenodd" />
                        </svg>
                    </button>
                </div>
                <div className="mx-10 flex justify-between">
                    <div className="px-2 my-4 md:mt-6 text-gray-400">
                        Company Name : <span className="font-semibold">{companyData?.companyName}</span>
                        <br />
                        Company Type : <span className="font-semibold">{companyData?.typeOfCompany}</span>
                        <br />
                        Person In Charge : <span className="font-semibold">{companyData?.personInCharge}</span>
                    </div>
                    <div className="flex items-end">
                        <button onClick={() => exportToCSV(userData, Date.now())} type="button" className="button-theme font-medium rounded-full text-sm px-5 py-2.5 my-4 md:mt-6 text-center inline-flex items-center dark:focus:ring-[#4285F4]/55 mr-2">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" class="w-6 h-6 mr-2">
                                <path stroke-linecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                            </svg>
                            Export Sheet
                        </button>
                    </div>
                </div>
                <Table loading={loading} headerData={rowHeaderData} rowData={userData} getActionData={getActionData} />
            </div>
        </>
    )
}
export default CompanyEmployee;
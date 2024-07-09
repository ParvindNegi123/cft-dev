import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';
import ForumDetail from './forumDetails';
import ForumEdit from './forumEdit';
import Skeleton from 'react-loading-skeleton';
import { BASE_URL } from "../config";
import 'react-loading-skeleton/dist/skeleton.css';

const Coupons = () => {
    
    useEffect(() => {
        let isAdmin = ['admin'].includes(localStorage.getItem('roles'));
            
        // If roles is not admin, redirect to dashboard page
        if (!isAdmin) {
            window.location = window.location.origin + '/membership';
            return false;
        }
    });

    const [coupons, setCoupons] = useState([]);
    const [formData, setFormData] = useState({
        code: '',
        type: 'days',
        expiry: '',
        emailIds: [],
        status: 1,
    });

    const [isAddingCoupon, setIsAddingCoupon] = useState(false);
    const [selectedCouponId, setSelectedCouponId] = useState('');
    const [showForumDetail, setShowForumDetail] = useState('');
    const [showError, setShowError] = useState(false);
    const [formClicked, setFormClicked] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState(false);

    const navigate = useNavigate();

    const goBack = () => {
        setShowForumDetail('');
    }

    useEffect(() => {
        fetchCoupons();
    }, []);

    const fetchCoupons = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/coupons`);
            setCoupons(response.data);
        } catch (error) {
            console.error('Error fetching coupons:', error);
        }
    };

    const handleInputChange = (e) => {

        let field_value = e.target.value;
        if (e.target.name === 'code') {
            // Remove spaces from the code
            field_value = field_value.replace(/\s/g, '');
          }
        else if (e.target.name === 'emailIds') {
            field_value = field_value.split(',').map(email => email.trim());
        }

        setFormData({ ...formData, [e.target.name]: field_value });
    };

    const handleSubmit = async (e) => {
        //e.preventDefault();

        if (!formData?.code || !formData?.type || !formData?.expiry || !formData?.emailIds || !formData?.status) {
            console.log(formData);
            setShowError(true);

            setTimeout(function(){
                setErrorMessage('');
                setShowError(false);
            }, 4000);

            return;
        }

        if (!validateEmails(formData.emailIds)) {
            setErrorMessage('Invalid email format.');

            setTimeout(function(){
                setErrorMessage('');
                setShowError(false);
            }, 4000);

            return;
        }

        try {
          if (selectedCouponId) {
            // Update existing coupon
            await axios({
                headers: {
                    "x-access-token": localStorage.getItem('auth-token')
                },
                url: `${BASE_URL}/coupons/${selectedCouponId}`, //your url
                method: 'put',
                data: formData
            }).then((res) => {
                if(res.data.success){
                    resetFormData();
                    setSelectedCouponId('');
                    fetchCoupons();
                    toggleAddCouponForm();
                }else{
                    setErrorMessage(res.data.message);
                    setTimeout(function(){
                        setErrorMessage('');
                        setShowError(false);
                    }, 4000);
                }
            }).catch(function (error) {
                setErrorMessage(error.message);
                setTimeout(function(){
                    setErrorMessage('');
                    setShowError(false);
                }, 4000);
            });

          } else {

            await axios({
                headers: {
                    "x-access-token": localStorage.getItem('auth-token')
                },
                url: `${BASE_URL}/coupons`, //your url
                method: 'post',
                data: formData
            }).then((res) => {
                if(res.data.success){
                    resetFormData();
                    setSelectedCouponId('');

                    fetchCoupons();
                    toggleAddCouponForm();

                }else{
                    setErrorMessage(res.data.message);
                    setTimeout(function(){
                        setErrorMessage('');
                        setShowError(false);
                    }, 4000);
                }
            }).catch(function (error) {
                setErrorMessage(error.message);
                setTimeout(function(){
                    setErrorMessage('');
                    setShowError(false);
                }, 4000);
            });

            
          }
          //fetchCoupons();
          
        } catch (error) {
          console.log('Error creating/updating coupon:', error);
        }
        
    };
    
    const handleEdit = (couponId) => {
        const selectedCoupon = coupons.find((coupon) => coupon._id === couponId);
        setFormData({
          code: selectedCoupon.code,
          type: selectedCoupon.type,
          expiry: selectedCoupon.expiry,
          emailIds: selectedCoupon.emailIds.join(','),
          status: selectedCoupon.status,
        });
        setSelectedCouponId(couponId);

        toggleAddCouponForm();
    };
    
    const handleDelete = async (couponId) => {
        const confirmed = window.confirm('Are you sure you want to delete?');
        if (confirmed) {
            try {
                await axios({
                    headers: {
                        "x-access-token": localStorage.getItem('auth-token')
                    },
                    url: `${BASE_URL}/coupons/${couponId}`, //your url
                    method: 'delete',
                }).then((res) => {
                    if(res.data.success){
                        resetFormData();
                        setSelectedCouponId('');

                        fetchCoupons();

                    }else{
                        setErrorMessage(res.data.message);
                    }
                }).catch(function (error) {
                    setErrorMessage(error.message);
                });

            fetchCoupons();
            } catch (error) {
            console.error('Error deleting coupon:', error);
            }
        }
    };

    let isAdmin = (localStorage.getItem('roles') === "admin");

    const toggleAddCouponForm = () => {
        setIsAddingCoupon(!isAddingCoupon); // Toggle the state to show/hide the add coupon form
    };

    const cancelForm = () => {
        resetFormData();
        setSelectedCouponId('');
        setIsAddingCoupon(!isAddingCoupon); // Toggle the state to show/hide the add coupon form
    };

    const resetFormData = () => {
        setFormData({
            code: '',
            type: 'days',
            expiry: '',
            emailIds: [],
            status: 1,
        });
    };

    const validateEmails = (emailIds) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (typeof emailIds === 'string') {
            emailIds = emailIds.split(',').map(email => email.trim());
        }

        for (let email of emailIds) {
            if (!emailRegex.test(email.trim())) {
                return false;
            }
        }
        return true;
    };

    return (
        <div className="dark:bg-slate-900 md:mx-20 min-h-screen pb-4" >
            {isAddingCoupon ? (
                <div className="dark:bg-slate-900 pt-10" style={{ height: "100vh" }} >
                    <div className="pb-6 text-center text-gray-200">Add Coupon</div>
                    
                    <div class="flex flex-col pt-10 items-center min-h-screen">
                        <div class="bg-theme-blue-secondary shadow-lg rounded-lg p-8 w-full sm:w-2/3 lg:w-1/2">
                            <div className="mb-4">
                                <label className="font-normal mb-4 text-gray-300 dark:text-gray-400">Coupon Code</label>
                                <input 
                                    type="text"
                                    name="code"
                                    value={formData.code}
                                    onChange={handleInputChange}
                                    className="bg-theme-blue autofill:bg-slate-800 relative block w-full appearance-none border border-[#2d3d5c] px-3 py-2 text-gray-300 placeholder-gray-600 focus:z-10 focus:border-gray-400 focus:outline-none focus:ring-indigo-500 sm:text-sm" 
                                    placeholder="Coupon Code" 
                                    required 
                                />
                            </div>
                            {/*
                                <div className="mb-4">
                                    <label className="font-normal mb-4 text-gray-300 dark:text-gray-400">Expiry Type</label>
                                    <select
                                        name="type"
                                        value={formData.type}
                                        onChange={handleInputChange}
                                        className="bg-theme-blue autofill:bg-slate-800 relative block w-full border border-[#2d3d5c] px-3 py-2 text-gray-300 placeholder-gray-600 focus:z-10 focus:border-gray-400 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                        required
                                        >
                                        <option value="days">Days</option>
                                        <option value="date">Date</option>
                                    </select>
                                </div>
                            */}
                            <div className="mb-4">
                                <label className="font-normal mb-4 text-gray-300 dark:text-gray-400">Expiry Days</label>
                                <input
                                    type="number"
                                    name="expiry"
                                    value={formData.expiry}
                                    onChange={handleInputChange}
                                    className="bg-theme-blue autofill:bg-slate-800 relative block w-full appearance-none border border-[#2d3d5c] px-3 py-2 text-gray-300 placeholder-gray-600 focus:z-10 focus:border-gray-400 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                    placeholder="Expiry Days" 
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="font-normal mb-4 text-gray-300 dark:text-gray-400">Email IDs (comma-separated)</label>
                                <input
                                    type="text"
                                    name="emailIds"
                                    placeholder="Email IDs (comma-separated)"
                                    value={formData.emailIds}
                                    onChange={handleInputChange}
                                    className="bg-theme-blue autofill:bg-slate-800 relative block w-full appearance-none border border-[#2d3d5c] px-3 py-2 text-gray-300 placeholder-gray-600 focus:z-10 focus:border-gray-400 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="font-normal mb-4 text-gray-300 dark:text-gray-400">Status</label>
                                <select
                                    name="status"
                                    value={formData.status}
                                    onChange={handleInputChange}
                                    className="bg-theme-blue autofill:bg-slate-800 relative block w-full border border-[#2d3d5c] px-3 py-2 text-gray-300 placeholder-gray-600 focus:z-10 focus:border-gray-400 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                    >
                                    <option value="1">Active</option>
                                    <option value="0">Inactive</option>
                                </select>
                            </div>
                            
                            {showError && <p className="text-red-500 my-2">* None of the fields should be empty</p>}
                            <p className="text-red-500 my-2">{errorMessage}</p>
                            <div className="my-6 flex">
                                <button onClick={() => handleSubmit()} type="button" className="button-theme font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 inline-flex items-center">
                                    {loading && (
                                        <svg aria-hidden="true" role="status" className="inline w-4 h-4 mr-3 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB" />
                                            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor" />
                                        </svg>
                                    )}
                                    {selectedCouponId ? ( "Update" ) : ( "Add" )}
                                </button>
                                <button onClick={() => cancelForm()} type="button" className="button-theme font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 inline-flex items-center">
                                    CANCEL
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="pt-10">
                    <div className="mb-2 md:mb-6 md:my-0 ">
                        <div className="flex justify-between items-center border-b border-blue-200 border-opacity-20 h-14 mb-8 mx-8">
                            <div className="text-2xl tracking-tight font-medium text-gray-300 dark:text-white">
                                Coupons
                            </div>

                            <div className="mb-1 text-4xl tracking-tight font-medium text-gray-300 dark:text-white">
                                {isAdmin && (
                                    <button onClick={toggleAddCouponForm} type="button" className="button-theme font-medium rounded-full text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-[#4285F4]/55 mr-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 pr-1">
                                            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-11.25a.75.75 0 00-1.5 0v2.5h-2.5a.75.75 0 000 1.5h2.5v2.5a.75.75 0 001.5 0v-2.5h2.5a.75.75 0 000-1.5h-2.5v-2.5z" clip-rule="evenodd" />
                                        </svg>
                                        Add Coupon
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                    {loading ? (
                        <div className="mb-6 mx-2 md:my-6 md:mx-10 rounded">
                            <Skeleton className="mb-4" baseColor="#202c40" highlightColor="#263348" height={140} count={4} />
                        </div>
                    ) : (coupons.map(coupon =>
                        <div className="flex justify-between mb-6 mx-2 md:my-6 md:mx-10 py-8 px-8 cursor-pointer bg-theme-blue-secondary rounded-lg md:flex-row mx-0 md:mx-10 hover:scale-[1.01] dark:hover:scale-[1.01] dark:hover:bg-gray-700">
                            <div onClick={() => handleEdit(coupon._id)} className="md:w-[70%] flex flex-col justify-between leading-normal">
                                <div className="flex flex-col items-left rounded-lg md:flex-row mx-0">
                                    <h5 className="text-2xl font-bold tracking-tight text-gray-200 dark:text-white">{coupon.code}</h5>
                                </div>
                            </div>
                            <div className="md:w-[20%] flex flex-col text-right items-center align-middle">
                                
                                <div onClick={() => handleEdit(coupon._id)} className="md:w-[100%] text-gray-400 mx-4 flex items-right">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 mx-2">
                                        <path d="M10 12.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" />
                                        <path fill-rule="evenodd" d="M.664 10.59a1.651 1.651 0 010-1.186A10.004 10.004 0 0110 3c4.257 0 7.893 2.66 9.336 6.41.147.381.146.804 0 1.186A10.004 10.004 0 0110 17c-4.257 0-7.893-2.66-9.336-6.41zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd" />
                                    </svg>
                                    Edit
                                </div>
                                <div onClick={() => handleDelete(coupon._id)} className="md:w-[100%] text-gray-400 mx-4 flex items-right mt-4">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" className="w-4 h-4 mx-2">
                                        <path fill="#9ca3af" d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"/>
                                    </svg>
                                    Delete
                                </div>
                            </div>
                        </div>
                    )
                    )}
                </div>
            )}
        </div>
    )
}
export default Coupons;

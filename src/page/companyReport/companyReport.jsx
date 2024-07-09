import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from "../../config";
import Table from '../../components/table';
import axios from 'axios';
import moment from 'moment';
import Papa from 'papaparse';
import DropDown from '../../components/select';
import { BarChart, Bar } from 'recharts';

const CompanyReport = () => {

    useEffect(() => {
        let isAdmin = ['admin'].includes(localStorage.getItem('roles'));
            
        // If roles is not admin, redirect to dashboard page
        if (!isAdmin) {
            window.location = window.location.origin + '/membership';
            return false;
        }
    });

    const navigate = useNavigate();
    const [companyList, setCompanyList] = useState([]);
    const [userList, setUserList] = useState([]);
    const [rowHeaderData, setRowHeaderData] = useState([]);
    const [firstSelected, setFirstSelected] = useState('');
    const [selected, setSelected] = useState('Select Company');
    const [userDetails, setUserDetails] = useState({});
    const [totalUserAcheivedGoal, setTotalUserAcheivedGoal] = useState([]);
    const [pagination, setPagination] = useState({
        page: 1,
        offset: 0,
        itemsPerPage: 10,
        totalCount: 0,
    });
    const [csvData, setCsvData] = useState('');
    const [loading, setLoading] = useState([]);

    const handleCsvDownload = (jsonData) => {
        const csv = Papa.unparse(jsonData);
        setCsvData(csv);

        // Optional: Save CSV data to a file
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', `${userDetails?.companyName}-${moment().format('MMM')}-Biling.csv`);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    const downloadBillingReport = () => {
        handleCsvDownload([{
            "Company Name": userDetails?.companyName,
            "User Range": userDetails?.userRange,
            "Price Per User": userDetails?.price,
            "Active CFT User": userDetails?.userCount,
            "Expected CFT User": userDetails?.expectedCftUser,
            "Total Bill Amount": userDetails?.price * ((parseInt(userDetails?.expectedCftUser) > parseInt(userDetails?.userCount)) ? parseInt(userDetails?.expectedCftUser) : parseInt(userDetails?.userCount))
        }]);
    };

    const downloadUserReport = () => {
        handleCsvDownload(totalUserAcheivedGoal);
    };

    const getCompanyList = () => {
        setLoading(true);
        axios({
            headers: {
                "x-access-token": localStorage.getItem('auth-token')
            },
            url: `${BASE_URL}/admin/company`,
            method: 'get',
        }).then((res) => {
            setCompanyList(res?.data?.data || []);
            setFirstSelected(res?.data?.data?.[0]);
            setPagination({ ...pagination, totalCount: res?.data?.count || 0 });
        });
    };

    const getCompanyReport = () => {
        axios({
            headers: {
                "x-access-token": localStorage.getItem("auth-token"),
            },
            url: `${BASE_URL}/admin/company/report/${selected?._id}`, //your url
            method: "GET",
        }).then((res) => {
            setUserDetails(res?.data?.data);
        });
    };

    const getCompanyUsers = () => {
        axios({
            headers: {
                "x-access-token": localStorage.getItem("auth-token"),
            },
            url: `${BASE_URL}/admin/company/user/list/${selected?._id}`, //your url
            method: "GET",
        }).then((res) => {
            setUserList(res?.data?.data);
        });
    };

    const userTableRowTitle = [
        { title: "Date", key: "date", formatData: (data) => moment(data).format('DD MMM YYYY') },
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
        getCompanyList();
    }, []);

    useEffect(() => {
        if (firstSelected?._id) {
            getCompanyReport();
            getCompanyUsers();
        }
    }, [selected]);

    const processUser = async (data) => {
        let userRecord = await getUserActivityRecord(data);
        let { vigorous, moderate, light } = userRecord?.tempTimeConsumed;
        let tempMonthlyTarget = 0;
        let totalTime = vigorous + moderate;
        console.log(totalTime, '#############################');
        if (vigorous === 0) {
            tempMonthlyTarget = 600;
        }
        if (vigorous >= 1) {
            tempMonthlyTarget = 300;
        }

        if ((tempMonthlyTarget - totalTime) < 0) {
            return data;
        }

        return false;
    };

    useEffect(() => {
        // let completedUserGoalList = [];
        // userList?.map(async (data) => {
        //     let userRecord = await getUserActivityRecord();
        //     let { vigorous, moderate, light } = userRecord?.tempTimeConsumed;
        //     let tempMonthlyTarget = 0;
        //     let totalTime = 600 + moderate;
        //     if (vigorous === 0) {
        //         tempMonthlyTarget = 600;
        //     }
        //     if (vigorous >= 1) {
        //         tempMonthlyTarget = 300;
        //     }
        //     if ((tempMonthlyTarget - totalTime) < 0) {
        //         console.log(data, '+++++++==');
        //         completedUserGoalList.push(data);
        //     }
        //     console.log(totalTime, '-------', tempMonthlyTarget);
        // });
        // Assuming userList is an array

        if (!userList || (userList?.length <= 0)) {
            return;
        }

        async function processData() {
            const userPromises = userList?.map(data => processUser(data));
            let data = await Promise.all(userPromises);
            const filteredCount = data.filter(item => typeof item === 'object' && item !== null);
            setTotalUserAcheivedGoal(filteredCount);
            console.log(filteredCount, '------------------+++++++++=');
            setLoading(false);
        }
        processData();
    }, [userList]);

    // (timeToCompleteGoalPercentage <= 0);

    const getUserActivityRecord = async (data) => {
        setLoading(true);
        let startDate = moment().startOf('month').format('YYYY-MM-DD');
        let endDate = moment().endOf('month').format('YYYY-MM-DD');
        const fitbitUrl = (data?.fitBitId) ? `${BASE_URL}/user/getfitbitexercisedata/${startDate}/${endDate}/${data?.fitBitId}` : '';
        const garminUrl = `${BASE_URL}/user/getgarminexercisedatabydate/${startDate}/${endDate}/${data?._id}`;

        let fitbitData = fitbitUrl ? await axios({
            headers: {
                "x-access-token": localStorage.getItem('auth-token')
            },
            url: fitbitUrl,
            method: 'GET'
        }) : '';

        let garminData = await axios({
            headers: {
                "x-access-token": localStorage.getItem('auth-token')
            },
            url: garminUrl,
            method: 'GET'
        });

        console.log(fitbitData?.data?.data, '------------', garminData?.data?.data);

        fitbitData = fitbitData?.data?.data;
        garminData = garminData?.data?.data;

        setLoading(false);
        let tempCaloriesBurned = {
            light: 0,
            moderate: 0,
            vigorous: 0
        };
        let tempTimeConsumed = {
            light: 0,
            moderate: 0,
            vigorous: 0
        };
        fitbitData?.map((data) => {
            tempCaloriesBurned.light = data?.heartRateZones[1].caloriesOut + tempCaloriesBurned.light;
            tempCaloriesBurned.moderate = data?.heartRateZones[2].caloriesOut + tempCaloriesBurned.moderate;
            tempCaloriesBurned.vigorous = data?.heartRateZones[3].caloriesOut + tempCaloriesBurned.vigorous;
            tempTimeConsumed.light = data?.heartRateZones[1].minutes + tempTimeConsumed.light;
            tempTimeConsumed.moderate = data?.heartRateZones[2].minutes + tempTimeConsumed.moderate;
            tempTimeConsumed.vigorous = data?.heartRateZones[3].minutes + tempTimeConsumed.vigorous;
        });
        garminData?.map((data) => {
            let timeSpend = {};
            let calorieConsumed = {};
            data?.heartRateZones?.map((data) => {
                timeSpend[data?.heartZoneName] = data?.minutes;
                calorieConsumed[data?.heartZoneName] = data?.caloriesOut;
            });
            tempCaloriesBurned.light = calorieConsumed?.light + tempCaloriesBurned.light;
            tempCaloriesBurned.moderate = calorieConsumed?.moderate + tempCaloriesBurned.moderate;
            tempCaloriesBurned.vigorous = calorieConsumed?.vigorous + tempCaloriesBurned.vigorous;
            tempTimeConsumed.light = parseInt(timeSpend?.light + tempTimeConsumed.light);
            tempTimeConsumed.moderate = parseInt(timeSpend?.moderate + tempTimeConsumed.moderate);
            tempTimeConsumed.vigorous = parseInt(timeSpend?.vigorous + tempTimeConsumed.vigorous);
        });

        return { tempCaloriesBurned, tempTimeConsumed };
    };

    return (
        <>
            <div className="h-[90vh] mx-4 md:pl-20 md:mx-8 pt-10">
                <div className="flex align-center items-center justify-between border-b border-blue-200 border-opacity-20 h-14 mb-8">
                    <div className="text-2xl tracking-tight font-medium text-gray-300 dark:text-white">
                        Report
                    </div>
                    <div className="flex mx-2 md:mx-10">
                        <div className="text-2xl tracking-tight font-light text-gray-300 dark:text-white mr-2">
                            Select Company :{' '}
                        </div>
                        <DropDown selected={selected} setSelected={setSelected} dataList={companyList} firstSelected={firstSelected} />
                    </div>
                </div>
                <div className="text-md md:text-lg text-white mb-2">
                    Welcome, {localStorage.getItem('user-name')} !
                    <br />
                    Thank you for being a part of the CFT program and training. Here is your overall journey with us!
                </div>
                <div className="flex flex-wrap justify-center py-10">
                    <div className="flex flex-grow flex-col h-[360px] p-6 mr-10 my-2 text-center text-gray-300 bg-theme-blue rounded-lg shadow dark:border-gray-600 xl:p-8 dark:bg-gray-800 dark:text-white">
                        <div className="flex justify-between border-b border-blue-200 border-opacity-20 h-10 mb-7">
                            <div className="mb-4 text-xl tracking-tight font-medium text-gray-300 dark:text-white">
                                Billing
                            </div>
                        </div>
                        <div className="border-b border-blue-200 border-opacity-20 pb-4">
                            <div className="mb-8">
                                <div class="flex justify-between mb-1">
                                    <span class="text-md md:text-md text-[#818cf8] dark:text-white">User Range</span>
                                    <div>
                                        <span class="text-md md:text-md text-gray-100 dark:text-white">{userDetails?.userRange}</span>
                                    </div>
                                </div>
                                <div class="w-full bg-[#818cf8] rounded-full h-2 dark:bg-gray-700">
                                </div>
                            </div>
                            <div className="mb-8">
                                <div class="flex justify-between mb-1 text-yellow-400">
                                    <span class="text-md md:text-md">Price Per User</span>
                                    <div>
                                        <span class="text-md md:text-md text-gray-100">$ {userDetails?.price}</span>
                                    </div>
                                </div>
                                <div class="w-full bg-yellow-400 rounded-full h-2 dark:bg-gray-700">
                                </div>
                            </div>
                            <div className="">
                                <div class="flex justify-between mb-1">
                                    <div>
                                        <span class="text-md text-green-400 md:text-md dark:text-white mr-2">Active CFT User</span>/
                                        <span class="text-md text-white-200 md:text-md dark:text-white ml-2">Expected CFT User</span>
                                    </div>
                                    <div>
                                        <span class="text-md md:text-md text-green-400 dark:text-white">{userDetails?.userCount}/</span>
                                        <span className="text-md md:text-md text-gray-100">{userDetails?.expectedCftUser}</span>
                                    </div>
                                </div>
                                <div class="w-full bg-gray-100 rounded-full h-2 dark:bg-gray-700">
                                    <div class="bg-green-400 h-2 rounded-full" style={{ width: `${((userDetails?.userCount / userDetails?.expectedCftUser) * 100)}%` }}></div>
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-between pt-4">
                            <div className="text-lg font-medium text-gray-300 dark:text-white">
                                Total Cost : $ {userDetails?.price * ((parseInt(userDetails?.expectedCftUser) > parseInt(userDetails?.userCount)) ? parseInt(userDetails?.expectedCftUser) : parseInt(userDetails?.userCount))}
                            </div>
                            <div onClick={() => downloadBillingReport()} className="flex text-blue-400 font-medium cursor-pointer">
                                Download Report
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5 ml-2">
                                    <path fill-rule="evenodd" d="M12 2.25a.75.75 0 01.75.75v11.69l3.22-3.22a.75.75 0 111.06 1.06l-4.5 4.5a.75.75 0 01-1.06 0l-4.5-4.5a.75.75 0 111.06-1.06l3.22 3.22V3a.75.75 0 01.75-.75zm-9 13.5a.75.75 0 01.75.75v2.25a1.5 1.5 0 001.5 1.5h13.5a1.5 1.5 0 001.5-1.5V16.5a.75.75 0 011.5 0v2.25a3 3 0 01-3 3H5.25a3 3 0 01-3-3V16.5a.75.75 0 01.75-.75z" clip-rule="evenodd" />
                                </svg>
                            </div>
                        </div>
                    </div>
                    <div className="flex w-[40%] flex-col justify-end h-[360px] p-6 ml-10 my-2 text-center text-gray-300 bg-theme-blue rounded-lg shadow dark:border-gray-600 xl:p-8 dark:bg-gray-800 dark:text-white">
                        <div className="flex justify-between border-b border-blue-200 border-opacity-20 h-10 mb-16">
                            <div className="mb-4 text-xl tracking-tight font-medium text-gray-300 dark:text-white">
                                Summary & Goals
                            </div>
                        </div>
                        <div className="flex justify-center h-[290px] border-b border-blue-200 border-opacity-20">
                            <div className="rotate-[-90deg] flex flex-col justify-center items-start align-end w-[152px]">
                                <span className="h-[20px] ml-4 mb-4">Acheived Goal : {totalUserAcheivedGoal.length}</span>
                                <span className={`${(totalUserAcheivedGoal.length === 0) ? 'w-[200px]' : `w-[${(((totalUserAcheivedGoal.length / userDetails?.userCount) * 100) * 200) / 100}px]`} h-[80px] ${(totalUserAcheivedGoal.length === 0) ? 'bg-gray-400 bg-opacity-20' : 'bg-green-100'}`}></span>
                            </div>
                            <div className="rotate-[-90deg] flex flex-col justify-center items-start w-[152px]">
                                <span className="h-[20px] ml-4 mb-4">Total User : {userDetails?.userCount}</span>
                                <span className={`w-[200px] h-[80px] bg-blue-400`}></span>
                            </div>
                            {/* <div className="flex flex-col justify-around">
                                <span className="rotate-[-90deg] h-[20px]">Total User</span>
                                <span className="w-[100px] h-[100px] bg-blue-400"></span>
                            </div> */}
                        </div>
                        <div className="flex justify-end">
                            <div onClick={() => downloadUserReport()} className="flex pt-4 text-blue-400 font-medium cursor-pointer">
                                Download Report
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5 ml-2">
                                    <path fill-rule="evenodd" d="M12 2.25a.75.75 0 01.75.75v11.69l3.22-3.22a.75.75 0 111.06 1.06l-4.5 4.5a.75.75 0 01-1.06 0l-4.5-4.5a.75.75 0 111.06-1.06l3.22 3.22V3a.75.75 0 01.75-.75zm-9 13.5a.75.75 0 01.75.75v2.25a1.5 1.5 0 001.5 1.5h13.5a1.5 1.5 0 001.5-1.5V16.5a.75.75 0 011.5 0v2.25a3 3 0 01-3 3H5.25a3 3 0 01-3-3V16.5a.75.75 0 01.75-.75z" clip-rule="evenodd" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
export default CompanyReport;
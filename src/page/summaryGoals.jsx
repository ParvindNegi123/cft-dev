import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { BASE_URL } from "../config";
import axios from 'axios';
import moment from 'moment';
import PieChart from '../components/pieChart';
import Confetti from '../components/confetti';
import Skeleton from 'react-loading-skeleton';

const SummaryGoals = () => {
    const params = useParams();
    const [caloriesBurned, setCaloriesBurned] = useState({});
    const [timeConsumed, setTimeConsumed] = useState({});
    const [timeToCompleteGoal, setTimeToCompleteGoal] = useState(0);
    const [monthlyTarget, setMonthlyTarget] = useState(0);
    const [timeToCompleteGoalPercentage, setTimeToCompleteGoalPercentage] = useState('');
    const [centerTextOne, setCenterTextOne] = useState('');
    const [centerTextTwo, setCenterTextTwo] = useState('');
    const [startDate, setStartDate] = useState(moment().startOf('month').format('YYYY-MM-DD'));
    const [endDate, setEndDate] = useState(moment().endOf('month').format('YYYY-MM-DD'));
    const [monthToSubtract, setMonthToSubtract] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let subscribedStatus = localStorage.getItem('subscribedStatus');
            
        // If subscribedStatus is falsy, redirect to membership page
        if (subscribedStatus == 'false') {
            window.location = window.location.origin + '/membership';
            return false;
        }
    });

    const convertMinsToHrsMins = (mins) => {
        if (!mins) {
            return '0 hr 0 min';
        }
        let h = Math.floor(mins / 60);
        let m = mins % 60;
        h = h < 10 ? '0' + h : h; // (or alternatively) h = String(h).padStart(2, '0')
        m = m < 10 ? '0' + m : m; // (or alternatively) m = String(m).padStart(2, '0')
        return `${h} hr ${m} min`;
    }

    const dataOne = [
        { name: 'acheived', value: monthlyTarget - timeToCompleteGoal, itemStyle: { color: '#239523' } },
        { name: 'remaining', value: timeToCompleteGoal, itemStyle: { color: '#888888' } },
    ];
    const dataTwo = [
        { name: 'light', value: timeConsumed?.light || 0, itemStyle: { color: '#e5ff00af' } },
        { name: 'moderate', value: timeConsumed?.moderate || 0, itemStyle: { color: '#00ff4cad' } },
        { name: 'vigorous', value: timeConsumed?.vigorous || 0, itemStyle: { color: '#fe0037bd' } },
    ];

    const getUserActivityRecord = async (event) => {
        setLoading(true);
        let device = "FitBit";
        let url = '';

        const fitbitUrl = `${BASE_URL}/user/getfitbitexercisedata/${startDate}/${endDate}`;
        const garminUrl = `${BASE_URL}/user/getgarminexercisedatabydate/${startDate}/${endDate}`;

        let fitbitData = await axios({
            headers: {
                "x-access-token": localStorage.getItem('auth-token')
            },
            url: fitbitUrl,
            method: 'GET'
        });

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

        setCaloriesBurned(tempCaloriesBurned);
        setTimeConsumed(tempTimeConsumed);
    };

    useEffect(() => {
        getUserActivityRecord();
    }, [endDate]);

    useEffect(() => {
        let { vigorous, moderate, light } = timeConsumed;
        let tempMonthlyTarget = 0;
        let totalTime = vigorous + moderate;

        if (vigorous === 0) {
            tempMonthlyTarget = 600;
        }
        if (vigorous >= 1) {
            tempMonthlyTarget = 300;
        }
        setMonthlyTarget(tempMonthlyTarget);
        setTimeToCompleteGoal(tempMonthlyTarget - totalTime);
        setTimeToCompleteGoalPercentage(parseInt((tempMonthlyTarget - totalTime) / tempMonthlyTarget * 100));
        setCenterTextOne(`${100 - parseInt((tempMonthlyTarget - totalTime) / tempMonthlyTarget * 100) || 0}%  \n ${convertMinsToHrsMins(tempMonthlyTarget - totalTime)} \nto go`);
        setCenterTextTwo(`${convertMinsToHrsMins(timeConsumed?.moderate + timeConsumed?.vigorous)} \nTotal Time*`);
    }, [timeConsumed]);

    const clickNextMonth = () => {
        if (parseInt(monthToSubtract) <= 0) {
            return;
        }
        setMonthToSubtract(monthToSubtract - 1);
    };

    const clickPreviousMonth = () => {
        if (parseInt(monthToSubtract) >= 2) {
            return;
        }
        setMonthToSubtract(monthToSubtract + 1);
    };

    useEffect(() => {
        let selectedStartDate = moment().subtract(monthToSubtract, 'months').startOf('month').format('YYYY-MM-DD');
        let selectedEndDate = moment().subtract(monthToSubtract, 'months').endOf('month').format('YYYY-MM-DD');
        setStartDate(selectedStartDate);
        setEndDate(selectedEndDate);
    }, [monthToSubtract]);

    return (
        <>
            <div className="bg-theme-blue-secondary sm:p-auto sm:h-screen summary-goal-container">
                <div className="flex flex-wrap md:h-[400px] md:justify-between">
                    <div className="flex-initial flex-grow w-[380px] h-[400px] m-0 md:mt-32">
                        <div className="flex justify-center text-2xl text-gray-400">
                            {moment(endDate).format('MMMM')}
                        </div>
                        <div className="flex flex-wrap justify-center md:pb-14">
                            <div className="">
                                {loading ? (
                                    <Skeleton baseColor="#202c40" highlightColor="#263348" height={'284px'} width={'300px'} className="m-2" />
                                ) : (
                                    <PieChart data={dataOne} centerText={centerTextOne} />
                                )}
                            </div>
                            <div className="">
                                {loading ? (
                                    <Skeleton baseColor="#202c40" highlightColor="#263348" height={'284px'} width={'300px'} className="m-2" />
                                ) : (
                                    <PieChart data={dataTwo} centerText={centerTextTwo} />
                                )}
                            </div>
                        </div>
                        <div className="flex justify-around ">
                            <button disabled={loading} onClick={() => clickPreviousMonth()} type="button" style={{ zIndex: 1 }} className={`${(parseInt(monthToSubtract) >= 2) ? 'bg-gray-600 cursor-not-allowed ' : 'button-theme-secondary cursor-pointer '} flex justify-center rounded-full w-28 text-lg px-5 text-center flex items-center dark:focus:ring-[#4285F4]/55 p-2`}>
                                Previous
                            </button>
                            <button disabled={loading} onClick={() => clickNextMonth()} type="button" style={{ zIndex: 1 }} className={`${(parseInt(monthToSubtract) <= 0) ? 'bg-gray-600 cursor-not-allowed ' : 'button-theme-secondary cursor-pointer '} flex justify-center rounded-full w-28 text-lg px-5 text-center flex items-center dark:focus:ring-[#4285F4]/55 p-2`}>
                                Next
                            </button>
                        </div>
                    </div>
                    {(timeToCompleteGoalPercentage <= 0) ? (
                        <div className="bg-theme-blue-secondary w-[100%] md:w-[auto] mt-[300px] md:mt-[0px] h-[80vh] md:h-[100vh]">
                            <div style={{ position: 'relative', top: 0, bottom: 0, overflow: 'hidden' }} className="w-[500px]">
                                <Confetti />
                                <div className="flex justify-center badge-position">
                                    <div>
                                        <div className="flex justify-center pt-8">
                                            <img style={{ height: '200px' }} src={require('../assets/award1.png')} />
                                        </div>
                                        <div className="text-3xl text-red-500 font-bold flex justify-center w-[280px]">
                                            {convertMinsToHrsMins(timeConsumed?.moderate + timeConsumed?.vigorous)}
                                        </div>
                                        <div className="pb-20 text-md text-gray-500 font-bold flex justify-center">
                                            You have acheived goal
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-center pb-20">
                                <div>
                                    <div className="text-center py-6 text-xl font-bold text-gray-400 lg:text-2xl dark:text-gray-400">
                                        Monthly Summary
                                    </div>
                                    <div className="text-center pt-2 text-xl text-gray-400 dark:text-gray-400">
                                        Total Time (all zones) : {convertMinsToHrsMins(timeConsumed?.light + timeConsumed?.moderate + timeConsumed?.vigorous)}
                                        <br />
                                        Valid Time* : {convertMinsToHrsMins(timeConsumed?.moderate + timeConsumed?.vigorous)}
                                        <br />
                                        Avg. Valid Time Per Day : 13 h
                                        <br />
                                        Avg. Calories Spent Per Day : {parseInt((caloriesBurned?.vigorous + caloriesBurned?.moderate + caloriesBurned?.light) / 30)} Kcal
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-theme-blue-secondary w-[auto] md:w-[auto] mt-[300px] md:mt-[0px] h-[50vh] md:h-[100vh]">
                            <div className="w-[400px] md:w-[500px]">
                                <div >
                                    <div>
                                        <div className="flex justify-center pt-8">
                                            <img style={{ height: '200px' }} src={'https://icon-library.com/images/exercise-icon-png/exercise-icon-png-15.jpg'} />
                                        </div>
                                        <div className="text-3xl text-red-500 font-bold flex justify-center mt-6">
                                            {convertMinsToHrsMins(timeToCompleteGoal)} to go
                                        </div>
                                        <div className="pb-20 text-md text-center text-gray-500 font-bold flex justify-center px-4 mt-4 w-[auto] md:w-[500px]">
                                            You have {convertMinsToHrsMins(timeToCompleteGoal)} left to achieve your exercise goal.
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-center pb-20">
                                <div>
                                    <div className="text-center py-6 text-xl font-bold text-gray-400 lg:text-2xl dark:text-gray-400">
                                        Monthly Summary
                                    </div>
                                    <div className="text-center pt-2 text-xl text-gray-400 dark:text-gray-400">
                                        Total Time (all zones) : {convertMinsToHrsMins(timeConsumed?.light + timeConsumed?.moderate + timeConsumed?.vigorous)}
                                        <br />
                                        Valid Time* : {convertMinsToHrsMins(timeConsumed?.moderate + timeConsumed?.vigorous)}
                                        <br />
                                        Avg. Valid Time Per Day : {convertMinsToHrsMins(parseInt((timeConsumed?.light + timeConsumed?.moderate + timeConsumed?.vigorous) / 30))}
                                        <br />
                                        Avg. Calories Spent Per Day : {parseInt((caloriesBurned?.vigorous + caloriesBurned?.moderate + caloriesBurned?.light) / 30)} Kcal
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                {/* <div className="md:w-[790px] w-[380px]">
                    <div className="bg-theme-blue md:h-[280px] h-[220px] rounded-md" >
                        <div className="text-center py-6 text-xl font-bold text-gray-400 lg:text-2xl sm:px-16 xl:px-48 dark:text-gray-400">
                            Monthly Summary
                        </div>
                        <div className="text-center pt-2 text-xl text-gray-400 sm:px-16 xl:px-48 dark:text-gray-400">
                            Total Time (all zones) : {convertMinsToHrsMins(timeToCompleteGoal)}
                            <br />
                            Valid Time* : 3 h 56 m
                            <br />
                            Avg. Valid Time Per Day : 13 h
                            <br />
                            Avg. Calories Spent Per Day : {parseInt((caloriesBurned?.vigorous + caloriesBurned?.moderate + caloriesBurned?.light) / 30)} Kcal
                        </div>
                    </div>
                </div> */}
            </div>
        </>
    )
}
export default SummaryGoals;
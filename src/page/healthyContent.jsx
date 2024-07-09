import React, { useEffect, useState } from 'react';
import axios from 'axios';
import moment from 'moment';
import { BASE_URL } from "../config";
import Skeleton from 'react-loading-skeleton';
import webmdLogo from '../assets/WebMD_logo.png';
import heartorgLogo from '../assets/American_Heart_Association_Logo.svg';
import 'react-loading-skeleton/dist/skeleton.css';

const HealthyContent = () => {

    useEffect(() => {
        let userStatus = localStorage.getItem('status');
        let subscribedStatus = localStorage.getItem('subscribedStatus');
            
        // If subscribedStatus is falsy, redirect to membership page
        if (subscribedStatus == 'false' && userStatus != 2) {
            window.location = window.location.origin + '/membership';
            return false;
        }
    });

    const [articleList, setArticleList] = useState([]);
    const [loading, setLoading] = useState(false);

    const getHealthyContentList = (event) => {
        setLoading(true);
        axios({
            headers: {
                "x-access-token": localStorage.getItem('auth-token')
            },
            url: `${BASE_URL}/user/healthy-content-list`, //your url
            method: 'GET'
        }).then((res) => {
            setLoading(false);
            //setArticleList(res?.data?.data);
            let dataToSort = res?.data?.data;
            let sortedArticle = dataToSort.sort((a, b) => {
                const dateA = moment(a.date, 'MMM D, YYYY');
                const dateB = moment(b.date, 'MMM D, YYYY');

                return dateB.isBefore(dateA) ? -1 : dateA.isBefore(dateB) ? 1 : 0;
            });
            setArticleList(sortedArticle);
        }).catch((err) => {
            setLoading(false);
        });
    };

    useEffect(() => {
        getHealthyContentList();
    }, []);

    return (
        <div className="mx-4 md:pl-20 md:mx-8 md:h-auto pt-10" >
            <div className="flex align-center items-center justify-between border-b border-blue-200 border-opacity-20 h-14 mb-8">
                <div className="text-xl tracking-tight font-medium text-gray-300 dark:text-white">
                    Healthy Content
                </div>
            </div>
            {loading ? (
                <div className="p-4 mx-0 md:mx-10 rounded">
                    <Skeleton className="mb-4" baseColor="#202c40" highlightColor="#263348" height={126} count={6} />
                </div>
            ) : (
                articleList.map(data =>
                    <div className="p-4">
                        <a href={data?.link} target="_blank" className="flex flex-col items-center bg-theme-blue-secondary rounded-lg md:flex-row mx-0 md:mx-10 hover:hover:scale-[1.01] dark:bg-gray-800 dark:hover:hover:scale-[1.01]" rel="noreferrer">
                            <img className="object-cover w-full rounded-t-lg h-50 md:h-auto md:w-48 md:rounded-none md:rounded-l-lg p-8" src={(data?.sourceName === 'webmd') ? webmdLogo : heartorgLogo} alt="" />
                            <div className="flex flex-col justify-between p-4 leading-normal">
                                <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-200 dark:text-white">{data?.title}</h5>
                                <p className="mb-3 font-normal text-gray-400 dark:text-gray-400">{data?.description}</p>
                            </div>
                        </a>
                    </div>
                )
            )}
        </div>
    )
}
export default HealthyContent;
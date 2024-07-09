import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';
import ForumDetail from './forumDetails';
import ForumEdit from './forumEdit';
import Skeleton from 'react-loading-skeleton';
import { BASE_URL } from "../config";
import 'react-loading-skeleton/dist/skeleton.css';

const Forums = () => {
    const [forumDataList, setForumDataList] = useState([]);
    const [showForumDetail, setShowForumDetail] = useState('');
    const [loading, setLoading] = useState(false);
    const sortRef = useState(null);
    const sortOrderRef = useState(null);

    const navigate = useNavigate();

    const goBack = () => {
        setShowForumDetail('');
    }

    useEffect(() => {
        let userStatus = localStorage.getItem('status');
        let subscribedStatus = localStorage.getItem('subscribedStatus');
            
        // If subscribedStatus is falsy, redirect to membership page
        if (subscribedStatus == 'false' && userStatus != 2) {
            window.location = window.location.origin + '/membership';
            return false;
        }
    });

    const getHealthyContentList = (event) => {
        if(sortRef.current === undefined){
            var sort_by = 'updatedAt';
            var sort_order_by = '-1';
        }else{
            var sort_by = sortRef.current.value;
            var sort_order_by = sortOrderRef.current.value;
        }

        setLoading(true);
        //console.log(BASE_URL);
        axios({
            url: `${BASE_URL}/forum`, //your url
            method: 'GET',
            params: {sort: sort_by, order: sort_order_by}
        }).then((res) => {
            setLoading(false);
            setForumDataList(res?.data?.data);
        }).catch((err) => {
            setLoading(false);
        });
    };

    useEffect(() => {
        getHealthyContentList();
    }, []);

    const deleteForumPost = (formData) => {
        const confirmed = window.confirm('Are you sure you want to delete?');
        if (confirmed) {
            axios({
                headers: {
                    "x-access-token": localStorage.getItem('auth-token')
                },
                url: `${BASE_URL}/forum`, //your url
                method: 'DELETE',
                params: {id: formData._id}
            }).then((res) => {
                setLoading(false);
                setForumDataList(res?.data?.data);
            }).catch((err) => {
                setLoading(false);
            });
        }
      };

    let isAdmin = (localStorage.getItem('roles') === "admin");

    return (
        <div className="dark:bg-slate-900 md:mx-20 min-h-screen pb-4" >
            {showForumDetail ? (
                ['admin'].includes(localStorage.getItem('roles')) ? (
                    <ForumEdit forumData={showForumDetail} goBack={goBack} getHealthyContentList={getHealthyContentList} />
                ) : (
                    <ForumDetail forumData={showForumDetail} goBack={goBack} getHealthyContentList={getHealthyContentList} />
                )
            ) : (
                <div className="pt-10">
                    <div className="mb-2 md:mb-6 md:my-0 ">
                        <div className="flex justify-between items-center border-b border-blue-200 border-opacity-20 h-14 mb-8 mx-8">
                            <div className="text-2xl tracking-tight font-medium text-gray-300 dark:text-white">
                                Forums
                            </div>

                            <div className="mb-2 md:mb-6 md:my-0 ">
                                <label for="sort" className="font-normal text-gray-300 dark:text-gray-400" style={{marginLeft: '10px', marginRight: '5px'}}>Sort By</label>
                                <select id="sort" name="sort" onChange={() => getHealthyContentList()} ref={sortRef}>
                                    <option value="createdAt">Created At</option>
                                    <option value="title">Title</option>
                                </select>

                                <label for="sort" className="font-normal text-gray-300 dark:text-gray-400" style={{marginLeft: '10px', marginRight: '5px'}}>Order By</label>
                                <select id="sort_order" name="sort_order" onChange={() => getHealthyContentList()} ref={sortOrderRef}>
                                    <option value="1">Asc &uarr;</option>
                                    <option value="-1">Desc &darr;</option>
                                </select>
                            </div>

                            <div className="mb-1 text-4xl tracking-tight font-medium text-gray-300 dark:text-white">
                                {isAdmin && (
                                    <button onClick={() => navigate('/forums/add')} type="button" className="button-theme font-medium rounded-full text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-[#4285F4]/55 mr-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 pr-1">
                                            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-11.25a.75.75 0 00-1.5 0v2.5h-2.5a.75.75 0 000 1.5h2.5v2.5a.75.75 0 001.5 0v-2.5h2.5a.75.75 0 000-1.5h-2.5v-2.5z" clip-rule="evenodd" />
                                        </svg>
                                        Add Forum
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                    {loading ? (
                        <div className="mb-6 mx-2 md:my-6 md:mx-10 rounded">
                            <Skeleton className="mb-4" baseColor="#202c40" highlightColor="#263348" height={140} count={4} />
                        </div>
                    ) : (forumDataList.map(data =>
                        <div className="flex justify-between mb-6 mx-2 md:my-6 md:mx-10 py-8 px-8 cursor-pointer bg-theme-blue-secondary rounded-lg md:flex-row mx-0 md:mx-10 hover:scale-[1.01] dark:hover:scale-[1.01] dark:hover:bg-gray-700">
                            <div onClick={() => setShowForumDetail(data)} className="md:w-[70%] flex flex-col justify-between leading-normal">
                                <div className="flex flex-col items-left rounded-lg md:flex-row mx-0">
                                    <h5 className="text-2xl font-bold tracking-tight text-gray-200 dark:text-white">{data.title}</h5>
                                </div>
                                <p className="mb-3 font-normal text-gray-300 dark:text-gray-400">Author - {data.threadBy}</p>
                                <p className="font-normal text-gray-400 dark:text-gray-400">{moment(data.createdAt).format('MMM DD YYYY hh:mm')} by {data?.threadBy}</p>
                            </div>
                            <div className="md:w-[20%] flex flex-col text-right items-center align-middle">
                                
                                <div onClick={() => setShowForumDetail(data)} className="md:w-[100%] text-gray-400 mx-4 flex items-right">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 mx-2">
                                        <path d="M10 12.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" />
                                        <path fill-rule="evenodd" d="M.664 10.59a1.651 1.651 0 010-1.186A10.004 10.004 0 0110 3c4.257 0 7.893 2.66 9.336 6.41.147.381.146.804 0 1.186A10.004 10.004 0 0110 17c-4.257 0-7.893-2.66-9.336-6.41zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd" />
                                    </svg>
                                    View
                                </div>
                                {['admin'].includes(localStorage.getItem('roles')) && (
                                <div onClick={() => deleteForumPost(data)} className="md:w-[100%] text-gray-400 mx-4 flex items-right mt-4">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" className="w-4 h-4 mx-2">
                                        <path fill="#9ca3af" d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"/>
                                    </svg>
                                    Delete
                                </div>
                                )}
                            </div>
                        </div>
                    )
                    )}
                </div>
            )}
        </div>
    )
}
export default Forums;
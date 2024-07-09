import React, { useEffect, useState } from 'react';
import moment from 'moment';

const ForumDetail = ({ forumData, goBack }) => {
    const [forumDataList, setForumDataList] = useState([]);

    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth', // Optional: adds smooth scrolling animation
        });
    }, [forumData]);

    return (
        <div className="p-2" >
            <button onClick={() => goBack()} type="button" className="flex items-center bg-theme-blue-secondary text-gray-200 p-2 rounded-full m-4 mx-10">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                    <path fill-rule="evenodd" d="M18 10a.75.75 0 01-.75.75H4.66l2.1 1.95a.75.75 0 11-1.02 1.1l-3.5-3.25a.75.75 0 010-1.1l3.5-3.25a.75.75 0 111.02 1.1l-2.1 1.95h12.59A.75.75 0 0118 10z" clip-rule="evenodd" />
                </svg>
            </button>
            <div className="p-4 py-10 px-10 cursor-pointer bg-theme-blue-secondary rounded-lg md:flex-row mx-0 md:mx-10 hover:hover:scale-[1.01] dark:bg-gray-800 dark:hover:hover:scale-[1.01]">
                <div className="flex flex-col justify-between leading-normal">
                    <div className="flex flex-col items-left rounded-lg md:flex-row mx-0">
                        <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-200 dark:text-white">{forumData.title}</h5>
                    </div>
                    <p className="mb-3 font-normal text-gray-400 dark:text-gray-400">Thread By {forumData.threadBy}</p>
                </div>
                <div dangerouslySetInnerHTML={{ __html: forumData?.content }} className="text-gray-200">
                </div>
            </div>
        </div>
    )
}
export default ForumDetail;
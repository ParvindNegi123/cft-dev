import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Skeleton from 'react-loading-skeleton';
import { useEffect } from 'react';

const Table = ({ headerData, rowData, getActionData, loading, setPagination, pagination }) => {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState(false);
    const [clickNextDisabled, setClickNextDisabled] = useState(false);
    const [clickPreviousDisabled, setClickPreviousDisabled] = useState(false);

    const toggleAccordion = () => {
        setIsOpen(!isOpen);
    };

    const clickOnRow = (index) => {
        if (selectedRow === index) {
            setSelectedRow(false);
        } else {
            setSelectedRow(index);
        }
    };

    const onClickNext = () => {
        setClickPreviousDisabled(false);
        setClickNextDisabled(false);
        let pageLength = generatePageCount(pagination?.totalCount, pagination?.itemsPerPage)?.length;
        if ((pagination.page + 1) >= (pageLength + 1)) {
            setClickNextDisabled(true);
            return;
        }
        setPagination({ ...pagination, page: pagination.page + 1 });
    };

    const onClickPrevious = () => {
        setClickPreviousDisabled(false);
        setClickNextDisabled(false);
        if (pagination.page <= 1) {
            setClickPreviousDisabled(true);
            return;
        }
        setPagination({ ...pagination, page: pagination.page - 1 });
    };

    const onClickPage = (pageNumber) => {
        setPagination({ ...pagination, page: pageNumber });
    };

    const generatePageCount = (dataCount, itemsPerPage) => {
        if (dataCount <= 0 || itemsPerPage <= 0) {
            return [];
        }
        const pageCount = Math.ceil(dataCount / itemsPerPage);
        const pages = Array.from({ length: pageCount }, (_, i) => i + 1);
        return pages;
    }

    return (
        <>
            <div className="md:block hidden">
                {loading && (
                    <div className="flex items-start justify-center px-4 sm:px-6 lg:px-8 h-[68vh]">
                        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                            <thead className="text-xs text-gray-400 uppercase bg-theme-blue dark:text-gray-400">
                                <tr>
                                    {(headerData?.length > 0) && headerData.map(data =>
                                        <th scope="col" className="px-6 py-3">
                                            <Skeleton baseColor="#202c40" highlightColor="#263348" height={50} />
                                        </th>
                                    )}
                                </tr>
                            </thead>
                            <tbody>
                                {(headerData?.length > 0) && ['', '', '', '', '', '', '', '']?.map((data, i) => {
                                    return (
                                        <tr className="bg-theme-blue text-gray-400 dark:bg-gray-800 dark:border-gray-700">
                                            {(headerData?.length > 0) && headerData.map(data =>
                                                <th scope="col" className="px-6 py-3">
                                                    <Skeleton baseColor="#202c40" highlightColor="#263348" height={50} />
                                                </th>
                                            )}
                                        </tr >
                                    )
                                }
                                )}
                            </tbody >
                        </table >
                    </div>
                )}
                {!loading && (
                    <div className="flex items-start justify-center px-4 sm:px-6 lg:px-8">
                        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                            <thead className="text-xs text-gray-400 uppercase bg-theme-blue-secondary dark:text-gray-400">
                                <tr>
                                    {(headerData?.length > 0) && headerData.map(data =>
                                        <th scope="col" className="px-6 py-3">
                                            {data?.title}
                                        </th>
                                    )}
                                    {getActionData() && (
                                        <th scope="col" className="px-6 py-3">
                                            Action
                                        </th>
                                    )}
                                </tr>
                            </thead>
                            <tbody>
                                {(headerData?.length > 0) && rowData?.map((data, i) => {
                                    return (
                                        <tr className="text-gray-400 border-b border-gray-600 dark:bg-gray-800 dark:border-gray-700">
                                            {headerData?.map(header => (
                                                <td className="px-6 py-4">
                                                    {header?.formatData ? header?.formatData(data?.[header?.key]) : data?.[header.key]}
                                                </td>
                                            ))}
                                            {getActionData() && (
                                                <td className="flex pl-6 py-4">
                                                    {getActionData(data)}
                                                </td>
                                            )}
                                        </tr >
                                    )
                                }
                                )}
                            </tbody >
                        </table >
                    </div>
                )}
                {!loading && (<div className="flex items-center justify-center h-20">
                    <nav aria-label="Page navigation example">
                        <ul class="inline-flex -space-x-px">
                            <li onClick={onClickPrevious}>
                                <a href="#" className="px-3 py-2 ml-0 leading-tight text-gray-400 bg-theme-blue-secondary border border-gray-600 rounded-l-lg hover:bg-gray-300 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">Previous</a>
                            </li>
                            {generatePageCount(pagination?.totalCount, pagination?.itemsPerPage)?.map(data => (
                                <li onClick={() => onClickPage(data)} className={`${(pagination?.page == data) ? 'text-gray-100' : 'text-gray-400'}`}>
                                    <a href="#" class={`${(pagination?.page == data) ? 'bg-theme-blue' : 'bg-theme-blue-secondary'} px-3 py-2 leading-tight border border-gray-600 hover:bg-gray-300 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white`}>{data}</a>
                                </li>
                            ))}
                            <li onClick={onClickNext}>
                                <a href="#" class="px-5 py-2 leading-tight text-gray-400 bg-theme-blue-secondary border border-gray-600 rounded-r-lg hover:bg-gray-300 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">Next</a>
                            </li>
                        </ul>
                    </nav>
                </div>
                )}
            </div >
            <div className="md:hidden block">
                {loading && (
                    <div className="flex items-start justify-center px-4 sm:px-6 lg:px-8 h-[68vh]">
                        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                            <tbody>
                                {(headerData?.length > 0) && ['', '', '', '', '', '', '', '']?.map((data, i) => {
                                    return (
                                        <Skeleton baseColor="#202c40" highlightColor="#263348" height={80} />
                                    )
                                }
                                )}
                            </tbody >
                        </table >
                    </div>
                )}
                {!loading && (<div className="flex items-start justify-center px-4 sm:px-6 lg:px-8">
                    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                        <div id="accordion-color" data-accordion="collapse" data-active-classes="bg-blue-100 dark:bg-gray-800 text-blue-600 dark:text-white">
                            {(headerData?.length > 0) && rowData?.map((data, i) => {
                                return (
                                    <div className="bg-theme-blue text-gray-400 border-gray-600 dark:bg-gray-800 dark:border-gray-700">
                                        <h2 id="accordion-color-heading-1" onClick={() => clickOnRow(i)}>
                                            <button type="button" class="flex items-center justify-between w-full p-5 font-medium text-left text-gray-500 border border-b-0.5 border-gray-200 dark:border-gray-700 dark:text-gray-400" data-accordion-target="#accordion-color-body-1" aria-expanded="true" aria-controls="accordion-color-body-1">
                                                <span>{headerData[0]?.title} : {headerData[0]?.formatData ? headerData[0]?.formatData(data?.[headerData[0]?.key]) : data?.[headerData[0].key]}, {headerData[2]?.title} : {data?.[headerData[2].key]}</span>
                                                <svg data-accordion-icon class="w-3 h-3 rotate-180 shrink-0" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                                                    <path stroke="currentColor" stroke-linecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5 5 1 1 5" />
                                                </svg>
                                            </button>
                                        </h2>
                                        <div id="accordion-color-body-1" class={`${selectedRow === i ? 'show' : 'hidden'} bg-theme-blue-secondary`} aria-labelledby="accordion-color-heading-1">
                                            <div className="flex flex-wrap">
                                                {headerData?.map(header => (
                                                    <td className="px-6 py-4">
                                                        <span className="font-medium text-gray-400">{header?.title}</span> : {header?.formatData ? header?.formatData(data?.[header?.key]) : data?.[header.key]}
                                                    </td>
                                                ))}
                                            </div>
                                            {/* <div scope="row" className="px-6 py-4 whitespace-nowrap dark:text-white">
                                                <span className="font-medium text-gray-400">{headerData[0]?.title}</span> : {data?.[headerData[0]?.key]}
                                            </div>
                                            <div className="px-6 py-4">
                                                <span className="font-medium text-gray-400">{headerData[1]?.title}</span> : {data?.[headerData[1]?.key]}
                                            </div>
                                            <div className="px-6 py-4">
                                                <span className="font-medium text-gray-400">{headerData[2]?.title}</span> : {data?.[headerData[2]?.key]}
                                            </div>
                                            <div className="px-6 py-4">
                                                <span className="font-medium text-gray-400">{headerData[3]?.title}</span> : {data?.[headerData[3]?.key]}
                                            </div>
                                            <div className="px-6 py-4">
                                                <span className="font-medium text-gray-400">{headerData[4]?.title}</span> : {data?.[headerData[4]?.key] ? "pending" : "success"}
                                            </div> */}
                                            <div className="flex pl-9 py-4">
                                                {getActionData(data)}
                                            </div>
                                        </div>
                                    </div>
                                )
                            }
                            )}
                        </div>
                    </table >
                </div>
                )}
                {!loading && (<div>
                    <div className="flex items-center justify-center h-20">
                        <nav aria-label="Page navigation example">
                            <ul class="inline-flex -space-x-px">
                                <li>
                                    <a href="#" className="px-3 py-2 ml-0 leading-tight text-gray-400 bg-theme-blue-secondary border border-gray-600 rounded-l-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">Previous</a>
                                </li>
                                <li>
                                    <a href="#" class="px-3 py-2 leading-tight text-gray-400 bg-theme-blue-secondary border border-gray-600 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">1</a>
                                </li>
                                <li className="">
                                    <a href="#" class="px-5 py-2 leading-tight text-gray-400 bg-theme-blue-secondary border border-gray-600 rounded-r-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">Next</a>
                                </li>
                            </ul>
                        </nav>
                    </div>
                </div>
                )}
            </div>
        </>
    )
}
export default Table;
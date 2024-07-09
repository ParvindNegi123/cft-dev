import { Fragment, useEffect, useState } from 'react'
import { Listbox, Transition } from '@headlessui/react'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'


const DropDown = ({ dataList, firstSelected, selected, setSelected }) => {

    useEffect(() => {
        if (firstSelected) {
            setSelected(firstSelected);
        }
    }, [firstSelected]);

    return (
        <div className="w-72">
            <Listbox value={selected} onChange={setSelected}>
                <div className="relative">
                    <Listbox.Button className="relative w-full text-gray-400 cursor-pointer bg-theme-blue-secondary py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
                        <span className="block truncate">{selected?.companyName}</span>
                        <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                            <ChevronUpDownIcon
                                className="h-5 w-5 text-gray-400"
                                aria-hidden="true"
                            />
                        </span>
                    </Listbox.Button>
                    <Transition
                        as={Fragment}
                        leave="transition ease-in duration-100"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto
                         bg-theme-blue-secondary py-1 shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
                            {dataList.map((data) => (
                                <Listbox.Option
                                    key={data?._id}
                                    className={({ active }) =>
                                        `relative select-none py-2 pl-10 pr-4 cursor-pointer ${active ? 'bg-amber-100 text-amber-900' : 'text-gray-300'}`
                                    }
                                    value={data}
                                >
                                    {({ selected }) => (
                                        <>
                                            <span
                                                className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}
                                            >
                                                {data?.companyName}
                                            </span>
                                            {selected ? (
                                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">
                                                    <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                                </span>
                                            ) : null}
                                        </>
                                    )}
                                </Listbox.Option>
                            ))}
                        </Listbox.Options>
                    </Transition>
                </div>
            </Listbox>
        </div>
    )
};

export default DropDown;

import React, { useState } from 'react';
import { Transition } from '@headlessui/react';

const Tooltip = ({ text, children }) => {
    const [showTooltip, setShowTooltip] = useState(false);

    const handleMouseEnter = () => {
        setShowTooltip(true);
    };

    const handleMouseLeave = () => {
        setShowTooltip(false);
    };
    console.log(text);
    return (
        <div
            className="relative"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {children}
            <Transition
                show={showTooltip}
                enter="transition-opacity duration-100"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="transition-opacity duration-75"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
            >
                {(ref) => (
                    <div
                        ref={ref}
                        className="absolute top-1/2 left-full transform -translate-y-1/2 p-2 bg-gray-600 text-white text-sm rounded-md whitespace-wrap"
                    >
                        {text}
                    </div>
                )}
            </Transition>
        </div>
    );
};

export default Tooltip;

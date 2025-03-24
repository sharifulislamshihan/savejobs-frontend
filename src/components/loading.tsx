import React from 'react';

const Loading = () => {
    return (
        <div className="flex justify-center items-center h-screen ">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400" />
        </div>
    );
};

export default Loading;
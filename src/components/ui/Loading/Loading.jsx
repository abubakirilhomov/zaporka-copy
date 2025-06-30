import React from 'react';

const Loading = ({ height }) => {
  const classNames = `flex justify-center items-center w-full ${height ? `h-[${height}]` : 'h-[80vh]'}`;

  return (
    <div className={classNames}>
      <span className="loading loading-spinner loading-lg"></span>
    </div>
  );
};

export default Loading;

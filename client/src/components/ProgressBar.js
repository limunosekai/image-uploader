import React from "react";

import "./ProgressBar.css";

const ProgressBar = ({ percent }) => {
  return (
    <div className="progress-bar-wrapper">
      <div style={{ width: `${percent || 0}%` }}>{percent}%</div>
    </div>
  );
};

export default ProgressBar;

import React from "react";
import classnames from "classnames";
import "./countdown.less";

function Countdown({ tekst, waiting }) {
  const classes = classnames("countdown", { waiting: waiting });
  if (!waiting) return null;

  return (
    <div className={classes}>
      <span>{tekst}</span>
    </div>
  );
}

export default Countdown;

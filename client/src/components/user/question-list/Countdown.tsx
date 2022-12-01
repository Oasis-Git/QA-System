import moment, { Duration } from "moment";
import React, { useState, useEffect } from "react";

export default function Countdown(props: { duration: Duration }): JSX.Element {
  const [time, setTime] = useState(props.duration);

  useEffect(() => {
    setTimeout(() => {
      if (time.asSeconds() > 0) {
        setTime(time => moment.duration(time.asSeconds() - 1, "seconds"));
      }
    }, 1000);
  }, [time]);

  return time.asSeconds() > 0 ? (
    <div>
      {Math.floor(time.days()) +
        "天" +
        Math.floor(time.hours()) +
        "小时" +
        Math.floor(time.minutes()) +
        "分" +
        Math.floor(time.seconds()) +
        "秒"}
    </div>
  ) : (
    <div>{"已过期"}</div>
  );
}

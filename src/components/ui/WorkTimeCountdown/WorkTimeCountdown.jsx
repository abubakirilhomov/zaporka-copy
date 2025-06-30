"use client";
import React, { useEffect, useState, useMemo } from "react";
import dayjs from "dayjs";
import { useSelector } from "react-redux";

const WorkTimeCountdown = () => {
  const workTime = useSelector((state) => state.companyInfo.info.workTime); // типа "10:00–22:00"
  const [isOpen, setIsOpen] = useState(false);
  const [countdown, setCountdown] = useState({ hours: 0, minutes: 0, seconds: 0 });

  const parseWorkTime = (workTimeStr) => {
    if (!workTimeStr) {
      return { open: { hour: 9, minute: 0 }, close: { hour: 18, minute: 0 } };
    }

    const normalized = workTimeStr.replace(/[-–—]/, "–");

    if (!/^\d{2}:\d{2}–\d{2}:\d{2}$/.test(normalized)) {
      return { open: { hour: 9, minute: 0 }, close: { hour: 18, minute: 0 } };
    }

    const [start, end] = normalized.split("–");
    const [startHour, startMinute] = start.split(":").map(Number);
    const [endHour, endMinute] = end.split(":").map(Number);

    return {
      open: { hour: startHour, minute: startMinute },
      close: { hour: endHour, minute: endMinute },
    };
  };

  const parsedWorkTime = useMemo(() => parseWorkTime(workTime), [workTime]);

  useEffect(() => {
    if (!workTime) return;

    const { open, close } = parsedWorkTime;

    const updateCountdown = () => {
      const now = dayjs();
      const todayOpen = now.hour(open.hour).minute(open.minute).second(0);
      const todayClose = now.hour(close.hour).minute(close.minute).second(0);

      let target;
      if (now.isBefore(todayOpen)) {
        setIsOpen(false);
        target = todayOpen;
      } else if (now.isAfter(todayClose)) {
        setIsOpen(false);
        target = todayOpen.add(1, "day");
      } else {
        setIsOpen(true);
        target = todayClose;
      }

      const diffInSeconds = target.diff(now, "second");
      const hours = Math.floor(diffInSeconds / 3600);
      const minutes = Math.floor((diffInSeconds % 3600) / 60);
      const seconds = diffInSeconds % 60;

      setCountdown({ hours, minutes, seconds });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [parsedWorkTime, workTime]);

  return (
    <div className="text-center my-10">
      <p className="text-xl font-semibold mb-2">
        {isOpen ? "До закрытия осталось:" : "До открытия осталось:"}
      </p>
      <div className="grid grid-flow-col gap-5 text-center auto-cols-max">
        <div className="flex flex-col">
          <span className="countdown font-mono text-5xl">
            <span
              style={{ "--value": countdown.hours }}
              aria-label={`${countdown.hours} часов`}
            >
              {countdown.hours}
            </span>
          </span>
          ч
        </div>
        <div className="flex flex-col">
          <span className="countdown font-mono text-5xl">
            <span
              style={{ "--value": countdown.minutes }}
              aria-label={`${countdown.minutes} минут`}
            >
              {countdown.minutes}
            </span>
          </span>
          мин
        </div>
        <div className="flex flex-col">
          <span className="countdown font-mono text-5xl">
            <span
              style={{ "--value": countdown.seconds }}
              aria-label={`${countdown.seconds} секунд`}
            >
              {countdown.seconds}
            </span>
          </span>
          сек
        </div>
      </div>
    </div>
  );
};

export default WorkTimeCountdown;

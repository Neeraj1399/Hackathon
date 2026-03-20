import React, { useState, useEffect } from 'react';

const CountdownTimer = ({ deadline, isMini = false }) => {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  function calculateTimeLeft() {
    const difference = +new Date(deadline) - +new Date();
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60)
      };
    }

    return timeLeft;
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [deadline]);

  const timerComponents = [];

  Object.keys(timeLeft).forEach((interval) => {
    if (!timeLeft[interval] && interval !== 'seconds') {
      return;
    }

    timerComponents.push(
      <div key={interval} className="flex flex-col items-center min-w-[32px]">
        <span className={`font-black text-brand-dark tabular-nums ${isMini ? 'text-[13px]' : 'text-2xl'} leading-none`}>
          {timeLeft[interval].toString().padStart(2, '0')}{isMini && interval === 'days' ? 'd' : isMini && interval === 'hours' ? 'h' : isMini && interval === 'minutes' ? 'm' : ''}
        </span>
        {!isMini && (
          <span className="text-[9px] font-black uppercase text-brand-secondary/50 tracking-widest mt-1.5">
            {interval}
          </span>
        )}
      </div>
    );
  });

  if (timerComponents.length === 0) {
    return <div className="text-[10px] font-black text-brand-danger uppercase tracking-widest py-0.5 px-2 bg-brand-danger/5 rounded border border-brand-danger/10">Protocol Sunset</div>;
  }

  return (
    <div className={`flex items-center ${isMini ? 'gap-1.5' : 'gap-4'}`}>
      {timerComponents}
    </div>
  );
};

export default CountdownTimer;

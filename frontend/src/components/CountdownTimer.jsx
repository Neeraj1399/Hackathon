import React, { useState, useEffect } from 'react';

const CountdownTimer = ({ deadline }) => {
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
      <span key={interval} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '40px' }}>
        <span style={{ fontSize: '24px', fontWeight: 900, color: '#A3FF12', lineHeight: 1 }}>
          {timeLeft[interval].toString().padStart(2, '0')}
        </span>
        <span style={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', color: '#444', letterSpacing: '0.05em', marginTop: '4px' }}>
          {interval}
        </span>
      </span>
    );
  });

  if (timerComponents.length === 0) {
    return <div style={{ fontSize: '14px', fontWeight: 800, color: '#EF4444', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Deadline Passed</div>;
  }

  return (
    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
      {timerComponents}
    </div>
  );
};

export default CountdownTimer;

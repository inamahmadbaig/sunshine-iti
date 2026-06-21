import React from 'react';

export default function TickerTape({ t, notices }) {
  return (
    <div className="ticker-tape">
      <div className="ticker-label">{t.latestUpdates}</div>
      <div className="ticker-wrap">
        <div className="ticker-text">
          {notices.map(notice => (
            <span key={notice.id} style={{ paddingRight: '4rem' }}>
              {notice.title}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

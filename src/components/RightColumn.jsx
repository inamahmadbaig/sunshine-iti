import React from 'react';
import { Calendar } from 'lucide-react';

export default function RightColumn({ t, notices }) {
  return (
    <aside>
      <div className="card" style={{ height: 'calc(100% - 1.5rem)' }}>
        <div className="card-header card-header-red">
          <Calendar size={16} /> {t.noticeBoard}
        </div>
        <div className="card-content">
          <div className="notice-board-scroll">
            {notices.map(notice => (
              <div className="notice-item" key={notice.id}>
                <span className="notice-date">{notice.date}</span>
                <a href={notice.link} className="notice-text">
                  {notice.title}{" "}
                  {notice.isNew && (
                    <span className="badge badge-red" style={{ padding: '0.1rem 0.3rem', fontSize: '0.65rem', marginLeft: '5px' }}>NEW</span>
                  )}
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}

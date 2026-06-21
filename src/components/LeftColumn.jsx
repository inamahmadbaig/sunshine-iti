import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, GraduationCap, ChevronRight } from 'lucide-react';

export default function LeftColumn({ t }) {
  return (
    <aside>
      {/* Quick Links Card */}
      <div className="card">
        <div className="card-header card-header-blue">
          <FileText size={16} /> {t.quickLinks}
        </div>
        <div className="card-content" style={{ padding: '0.5rem 1rem' }}>
          <ul className="vertical-menu">
            <li><a href="https://www.ncvtmis.gov.in" target="_blank" rel="noopener noreferrer">NCVT MIS Portal <ChevronRight /></a></li>
            <li><a href="http://www.mpskills.gov.in" target="_blank" rel="noopener noreferrer">Directorate of Skill Dev (M.P.) <ChevronRight /></a></li>
            <li><a href="https://dgt.gov.in" target="_blank" rel="noopener noreferrer">DGET Web Portal <ChevronRight /></a></li>
            <li><a href="#" onClick={(e) => e.preventDefault()}>SCVT Exam Results <ChevronRight /></a></li>
            <li><a href="#" onClick={(e) => e.preventDefault()}>Admission Guidelines <ChevronRight /></a></li>
          </ul>
        </div>
      </div>

      {/* Student Corner Card */}
      <div className="card">
        <div className="card-header card-header-green">
          <GraduationCap size={16} /> {t.studentCorner}
        </div>
        <div className="card-content" style={{ padding: '0.5rem 1rem' }}>
          <ul className="vertical-menu">
            <li><Link to="/student-corner/syllabus">Syllabus & Course Scheme <ChevronRight /></Link></li>
            <li><Link to="/student-corner/papers">Previous Year Papers <ChevronRight /></Link></li>
            <li><Link to="/student-corner/scholarships">Scholarship Forms <ChevronRight /></Link></li>
            <li><Link to="/student-corner/calendar">Academic Calendar <ChevronRight /></Link></li>
            <li><Link to="/student-corner/rules">Rules & Regulations <ChevronRight /></Link></li>
          </ul>
        </div>
      </div>
    </aside>
  );
}

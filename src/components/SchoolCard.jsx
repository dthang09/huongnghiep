import React from 'react';
import { Star, BarChart2, ChevronRight } from 'lucide-react';
import diemchuanData from '../data/diemchuan.json';

const SchoolCard = ({ code, name, location, onSelectSchool }) => {
    // Check if we have admission data for this school code
    const schoolData = diemchuanData[code];
    const hasScores = !!schoolData && schoolData.scores && schoolData.scores.length > 0;

    return (
        <div className="school-card" onClick={() => onSelectSchool(code)} style={{ cursor: 'pointer' }}>
            <div className="school-code">{code}</div>
            <div className="school-info">
                <div className="school-name">{name}</div>
                <div className="location-badge">{location}</div>
            </div>

            <div className="school-actions">
                {hasScores && (
                    <div className="scores-toggle-badge" style={{ backgroundColor: '#e6f0ff', color: '#0056b3' }}>
                        <BarChart2 size={16} />
                        <span>Xem điểm</span>
                        <ChevronRight size={16} />
                    </div>
                )}
                <button className="fav-btn" aria-label="Lưu trường" onClick={(e) => { e.stopPropagation(); }}>
                    <Star size={24} />
                </button>
            </div>
        </div>
    );
};

export default SchoolCard;

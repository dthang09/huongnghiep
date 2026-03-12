import React, { useState } from 'react';
import { Star, ChevronDown, ChevronUp, BarChart2 } from 'lucide-react';
import diemchuanData from '../data/diemchuan.json';

const SchoolCard = ({ code, name, location }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    // Check if we have admission data for this school code
    const schoolData = diemchuanData[code];
    const hasScores = !!schoolData && schoolData.scores && schoolData.scores.length > 0;

    const toggleExpand = () => {
        if (hasScores) {
            setIsExpanded(!isExpanded);
        }
    };

    return (
        <div className={`school-card-wrapper ${isExpanded ? 'expanded' : ''}`}>
            <div className="school-card" onClick={toggleExpand} style={{ cursor: hasScores ? 'pointer' : 'default' }}>
                <div className="school-code">{code}</div>
                <div className="school-info">
                    <div className="school-name">{name}</div>
                    <div className="location-badge">{location}</div>
                </div>

                <div className="school-actions">
                    {hasScores && (
                        <div className="scores-toggle-badge">
                            <BarChart2 size={16} />
                            <span>Xem điểm</span>
                            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </div>
                    )}
                    <button className="fav-btn" aria-label="Lưu trường" onClick={(e) => e.stopPropagation()}>
                        <Star size={24} />
                    </button>
                </div>
            </div>

            {isExpanded && hasScores && (
                <div className="school-scores-details">
                    <div className="table-responsive">
                        <table className="scores-table">
                            <thead>
                                <tr>
                                    <th>STT</th>
                                    <th>Tên ngành</th>
                                    <th>Tổ hợp môn</th>
                                    <th>Điểm chuẩn</th>
                                    <th>Ghi chú</th>
                                </tr>
                            </thead>
                            <tbody>
                                {schoolData.scores.map((score, idx) => (
                                    <tr key={idx}>
                                        <td>{idx + 1}</td>
                                        <td className="bold-cell">{score["Tên ngành"]}</td>
                                        <td>{score["Tổ hợp môn"]}</td>
                                        <td className="score-cell">{score["Điểm chuẩn"]}</td>
                                        <td className="note-cell">{score["Ghi chú"]}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SchoolCard;

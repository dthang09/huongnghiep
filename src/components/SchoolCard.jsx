import React from 'react';
import { Star } from 'lucide-react';

const SchoolCard = ({ code, name, location }) => {
    return (
        <div className="school-card">
            <div className="school-code">{code}</div>
            <div className="school-info">
                <div className="school-name">{name}</div>
                <div className="location-badge">{location}</div>
            </div>
            <button className="fav-btn" aria-label="Lưu trường">
                <Star size={24} />
            </button>
        </div>
    );
};

export default SchoolCard;

import React from 'react';
import { School, Briefcase, GraduationCap, DollarSign } from 'lucide-react';

const SearchTabs = ({ activeTab, setActiveTab }) => {
    const tabs = [
        { id: 'truong', label: 'Tìm trường', icon: <School size={20} /> },
        { id: 'nganh', label: 'Tìm ngành', icon: <Briefcase size={20} /> },
        { id: 'diem', label: 'Tìm theo điểm', icon: <GraduationCap size={20} /> },
    ];

    return (
        <div className="search-tabs">
            {tabs.map(tab => (
                <button
                    key={tab.id}
                    className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
                    onClick={() => setActiveTab(tab.id)}
                >
                    {tab.icon}
                    {tab.label}
                </button>
            ))}
        </div>
    );
};

export default SearchTabs;

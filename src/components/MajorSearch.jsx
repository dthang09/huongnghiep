import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { majorGroups } from '../data/majorGroups';
import '../MajorSearch.css';

const MajorSearch = ({ onSelectMajorGroup }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredGroups = majorGroups.filter(group => {
        return group.name.toLowerCase().includes(searchTerm.toLowerCase());
    });

    return (
        <div className="tab-content major-search-container">
            <div className="tab-header major-header">
                <h2>XEM ĐIỂM CHUẨN THEO NGÀNH</h2>
            </div>

            <div className="major-search-bar">
                <Search size={20} className="search-icon" />
                <input
                    type="text"
                    placeholder="Nhập tên ngành bạn muốn tìm (VD: Báo chí, Công nghệ thông tin...)"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="major-grid">
                {filteredGroups.length > 0 ? (
                    filteredGroups.map(group => (
                        <div
                            key={group.id}
                            className="major-card"
                            onClick={() => onSelectMajorGroup(group)}
                        >
                            <div className="major-icon">{group.icon}</div>
                            <div className="major-name">{group.name}</div>
                        </div>
                    ))
                ) : (
                    <div style={{ textAlign: 'center', padding: '2rem', width: '100%', color: 'var(--text-muted)' }}>
                        Không tìm thấy nhóm ngành nào phù hợp.
                    </div>
                )}
            </div>
        </div>
    );
};

export default MajorSearch;

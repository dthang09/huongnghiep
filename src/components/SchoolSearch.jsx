import React, { useState } from 'react';
import { Search, ChevronDown, Building2 } from 'lucide-react';
import { schoolsData, locations } from '../data/mockData';
import SchoolCard from './SchoolCard';

const SchoolSearch = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [locationFilter, setLocationFilter] = useState('');

    // Filter schools based on search term and location
    const filteredSchools = schoolsData.filter(school => {
        const matchesSearch =
            school.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            school.code.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesLocation = locationFilter ? school.location === locationFilter : true;

        return matchesSearch && matchesLocation;
    });

    return (
        <div className="tab-content">
            <div className="tab-header">
                <h2>XEM ĐIỂM CHUẨN THEO TRƯỜNG</h2>
            </div>

            <div className="filter-bar">
                <div className="select-wrapper">
                    <Building2 size={20} className="select-icon" />
                    <select defaultValue="daihoc">
                        <option value="daihoc">Hệ đại học</option>
                        <option value="caodang">Hệ cao đẳng</option>
                    </select>
                    <ChevronDown size={20} className="dropdown-icon" />
                </div>

                <div className="search-input-wrapper">
                    <Search size={20} className="search-icon" />
                    <input
                        type="text"
                        placeholder="Nhập tên trường hoặc mã trường"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="location-tags">
                {locations.map(loc => (
                    <button
                        key={loc}
                        className={`tag-btn ${locationFilter === loc ? 'active' : ''}`}
                        onClick={() => setLocationFilter(locationFilter === loc ? '' : loc)}
                        style={locationFilter === loc ? { backgroundColor: 'var(--primary)', color: 'white' } : {}}
                    >
                        {loc}
                    </button>
                ))}
                <button className="tag-btn more">
                    Tỉnh thành khác <ChevronDown size={16} />
                </button>
            </div>

            <div className="results-list">
                {filteredSchools.length > 0 ? (
                    filteredSchools.map((school, index) => (
                        <SchoolCard
                            key={`${school.code}-${index}`}
                            code={school.code}
                            name={school.name}
                            location={school.location}
                        />
                    ))
                ) : (
                    <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                        Không tìm thấy trường nào phù hợp.
                    </div>
                )}
            </div>
        </div>
    );
};

export default SchoolSearch;

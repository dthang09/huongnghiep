import React, { useState, useMemo } from 'react';
import deanData from '../data/dean_tuyensinh.json';
import { Search, ExternalLink, GraduationCap, ChevronRight } from 'lucide-react';
import cardLogo from '../assets/card_logo.png';
import './AdmissionPlan.css';

const AdmissionPlan = () => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredData = useMemo(() => {
        return deanData.filter(item => 
            item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (item.code && item.code.toLowerCase().includes(searchTerm.toLowerCase()))
        );
    }, [searchTerm]);

    return (
        <div className="dean-container">
            <div className="dean-header">
                <h2>
                    <GraduationCap className="icon" size={24} />
                    ĐỀ ÁN TUYỂN SINH ĐẠI HỌC 2026
                </h2>
                <div className="search-bar-wrapper">
                    <Search className="search-icon" size={20} />
                    <input 
                        type="text" 
                        placeholder="Tìm tên trường hoặc mã trường..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="dean-grid">
                {filteredData.length > 0 ? (
                    filteredData.map((item, index) => (
                        <div key={index} className="dean-card">
                            <div className="card-image">
                                <img src={cardLogo} alt="Logo" className="common-card-logo" />
                            </div>
                            <div className="card-content">
                                <div className="card-top">
                                    {item.code && <span className="school-code">{item.code}</span>}
                                    <h3>{item.name}</h3>
                                </div>
                                <p className="school-details">{item.details}</p>
                                <a href={item.link} target="_blank" rel="noopener noreferrer" className="view-detail-btn">
                                    Xem chi tiết đề án
                                    <ExternalLink size={16} />
                                </a>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="no-results">
                        Không tìm thấy trường khớp với yêu cầu của bạn.
                    </div>
                )}
            </div>
            
            <div className="dean-footer">
                <p>Nguồn dữ liệu: Tuyensinh247.com</p>
                <p>Thông tin được cập nhật liên tục cho kỳ tuyển sinh 2026.</p>
            </div>
        </div>
    );
};

export default AdmissionPlan;

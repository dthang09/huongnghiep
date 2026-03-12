import React, { useState } from 'react';
import { ChevronLeft, Search, MapPin, Phone, Globe, Download, Filter, ArrowDownAZ, Copy, Share2, Calendar } from 'lucide-react';
import diemchuanData from '../data/diemchuan.json';
import { schoolsData } from '../data/mockData';
import '../SchoolDetail.css';

const SchoolDetail = ({ schoolCode, onBack }) => {
    const schoolBasic = schoolsData.find(s => s.code === schoolCode) || { name: 'Đang cập nhật', code: schoolCode, location: '' };

    // Some schools in mock data might not have detailed names but diemchuan data has
    const schoolScoresData = diemchuanData[schoolCode];
    const fullName = schoolScoresData?.name || schoolBasic.name;
    const scores = schoolScoresData?.scores || [];

    const [searchTerm, setSearchTerm] = useState('');
    const [blockFilter, setBlockFilter] = useState('all');
    const [sortOrder, setSortOrder] = useState('az');

    // Extract all unique blocks from the combinations for dynamic filtering
    const availableBlocks = new Set();
    scores.forEach(score => {
        const toHop = score["Tổ hợp môn"] || "";
        const parts = toHop.split(/;\s*|,/);
        parts.forEach(p => {
            const letter = p.trim().charAt(0).toUpperCase();
            if (letter && /[A-Z]/.test(letter)) {
                availableBlocks.add(letter);
            }
        });
    });
    const blockList = Array.from(availableBlocks).sort();

    const filteredScores = scores.filter(score => {
        // Search term filter
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            const matchesSearch = (score["Tên ngành"]?.toLowerCase().includes(term) || score["Mã ngành"]?.toLowerCase().includes(term));
            if (!matchesSearch) return false;
        }

        // Block filter
        if (blockFilter !== 'all') {
            const toHop = score["Tổ hợp môn"] || "";
            // Check if any combination starts with the selected block letter
            const matchesBlock = toHop.split(/;\s*|,/).some(p => p.trim().toUpperCase().startsWith(blockFilter));
            if (!matchesBlock) return false;
        }

        return true;
    }).sort((a, b) => {
        const nameA = (a["Tên ngành"] || "").trim().toLowerCase();
        const nameB = (b["Tên ngành"] || "").trim().toLowerCase();

        const scoreA = parseFloat(a["Điểm chuẩn"]) || 0;
        const scoreB = parseFloat(b["Điểm chuẩn"]) || 0;

        switch (sortOrder) {
            case 'az':
                return nameA.localeCompare(nameB);
            case 'za':
                return nameB.localeCompare(nameA);
            case 'score-desc':
                return scoreB - scoreA;
            case 'score-asc':
                return scoreA - scoreB;
            default:
                return 0;
        }
    });

    return (
        <div className="school-detail-page">
            <button className="back-btn" onClick={onBack}>
                <ChevronLeft size={20} />
                <span>Trở về</span>
            </button>

            <div className="detail-header">
                <div className="title-area">
                    <h1>{fullName}</h1>
                    <div className="school-meta">
                        <span className="meta-label">Mã trường:</span>
                        <span className="meta-value bold">{schoolBasic.code}</span>
                        <span className="meta-value location">{schoolBasic.location}</span>
                    </div>
                </div>
                <div className="search-other-school">
                    <Search size={18} className="search-icon" />
                    <input type="text" placeholder="Tìm trường khác (Nhập tên/ mã trường)" />
                </div>
            </div>

            <div className="info-blocks-container">
                <div className="info-block contact-block">
                    <h3>Liên hệ</h3>
                    <ul className="contact-list">
                        <li>
                            <MapPin size={18} className="contact-icon" />
                            <span><strong>Địa chỉ</strong> Đang cập nhật...</span>
                        </li>
                        <li>
                            <Phone size={18} className="contact-icon" />
                            <span><strong>Điện thoại</strong> Đang cập nhật...</span>
                        </li>
                        <li>
                            <Globe size={18} className="contact-icon" />
                            <span><strong>Website</strong> Đang cập nhật...</span>
                        </li>
                    </ul>
                </div>
                <div className="info-block download-block">
                    <h3>Tải về đề án tuyển sinh</h3>
                    <ul className="download-list">
                        <li>
                            <Download size={18} className="download-icon" />
                            <span>Năm 2024</span>
                        </li>
                        <li>
                            <Download size={18} className="download-icon" />
                            <span>Năm 2023</span>
                        </li>
                    </ul>
                </div>
            </div>

            <div className="scores-section">
                <div className="scores-filters-top">
                    <h3>Điểm chuẩn</h3>
                    <div className="year-selector">
                        <Calendar size={18} className="year-icon" />
                        <select defaultValue="2024">
                            <option value="2024">2024</option>
                            <option value="2023">2023</option>
                        </select>
                    </div>
                </div>

                <div className="scores-filters-bar">
                    <div className="filter-dropdown">
                        <Filter size={18} />
                        <select value={blockFilter} onChange={e => setBlockFilter(e.target.value)}>
                            <option value="all">Tất cả các khối</option>
                            {blockList.map(b => (
                                <option key={b} value={b}>Khối {b}</option>
                            ))}
                        </select>
                    </div>
                    <div className="filter-dropdown">
                        <ArrowDownAZ size={18} />
                        <select value={sortOrder} onChange={e => setSortOrder(e.target.value)}>
                            <option value="az">Tên ngành A → Z</option>
                            <option value="za">Tên ngành Z → A</option>
                            <option value="score-desc">Điểm chuẩn Cao → Thấp</option>
                            <option value="score-asc">Điểm chuẩn Thấp → Cao</option>
                        </select>
                    </div>
                    <div className="search-input-wrapper flex-1">
                        <Search size={18} className="search-icon" />
                        <input
                            type="text"
                            placeholder="Tìm ngành: nhập tên ngành, mã ngành"
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="table-responsive detail-table-wrapper">
                    <table className="detail-scores-table">
                        <thead>
                            <tr>
                                <th>STT</th>
                                <th>Tên, mã ngành</th>
                                <th>Điểm chuẩn</th>
                                <th>Tổ hợp môn</th>
                                <th>Học phí (VNĐ)</th>
                                <th>Ghi chú</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredScores.length > 0 ? (
                                filteredScores.map((score, idx) => (
                                    <tr key={idx}>
                                        <td className="stt-cell">{idx + 1}</td>
                                        <td>
                                            <div className="major-name">{score["Tên ngành"]}</div>
                                            <div className="major-code">{score["Mã ngành"] || ""}</div>
                                        </td>
                                        <td>
                                            <div className="score-value">{score["Điểm chuẩn"]}</div>
                                            <div className="theo-nam-badge">Theo năm 📊</div>
                                        </td>
                                        <td>{score["Tổ hợp môn"]}</td>
                                        <td className="tuition-cell">--</td>
                                        <td className="note-cell">{score["Ghi chú"]}</td>
                                        <td className="action-cell">
                                            <button className="icon-btn" title="Copy"><Copy size={16} /></button>
                                            <button className="icon-btn" title="Share"><Share2 size={16} /></button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" style={{ textAlign: 'center', padding: '2rem' }}>
                                        {scores.length === 0 ? "Phần điểm của trường này đang được cập nhật." : "Không tìm thấy ngành phù hợp."}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default SchoolDetail;

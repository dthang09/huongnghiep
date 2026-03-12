import React, { useState, useMemo } from 'react';
import { ChevronLeft, Search, Building2, Filter, ArrowDownAZ, Copy, Share2, Calendar } from 'lucide-react';
import diemchuanData from '../data/diemchuan.json';
import '../SchoolDetail.css';

const MajorDetail = ({ majorGroup, onBack }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [blockFilter, setBlockFilter] = useState('all');
    const [sortOrder, setSortOrder] = useState('az');

    // Process all scores across all schools to find matches
    const allMatches = useMemo(() => {
        const matches = [];
        const uniqueBlocks = new Set();

        // Convert keywords to lowercase for faster matching
        const groupKeywords = majorGroup.keywords.map(kw => kw.toLowerCase());

        Object.values(diemchuanData).forEach(school => {
            if (!school.scores) return;

            school.scores.forEach(score => {
                const majorName = score["Tên ngành"] ? score["Tên ngành"].toLowerCase() : "";

                // Check if this major matches any keyword for this group
                const isMatch = groupKeywords.some(kw => majorName.includes(kw));

                if (isMatch) {
                    const toHop = score["Tổ hợp môn"] || "";
                    toHop.split(/;\s*|,/).forEach(p => {
                        const letter = p.trim().charAt(0).toUpperCase();
                        if (letter && /[A-Z]/.test(letter)) {
                            uniqueBlocks.add(letter);
                        }
                    });

                    matches.push({
                        ...score,
                        schoolName: school.name,
                        schoolCode: school.code
                    });
                }
            });
        });

        return {
            matches,
            blocks: Array.from(uniqueBlocks).sort()
        };
    }, [majorGroup]);

    const filteredAndSortedMatches = useMemo(() => {
        return allMatches.matches.filter(match => {
            if (searchTerm) {
                const term = searchTerm.toLowerCase();
                if (!match["Tên ngành"]?.toLowerCase().includes(term) &&
                    !match["Mã ngành"]?.toLowerCase().includes(term) &&
                    !match.schoolName.toLowerCase().includes(term)) {
                    return false;
                }
            }

            if (blockFilter !== 'all') {
                const toHop = match["Tổ hợp môn"] || "";
                if (!toHop.split(/;\s*|,/).some(p => p.trim().toUpperCase().startsWith(blockFilter))) {
                    return false;
                }
            }
            return true;
        }).sort((a, b) => {
            const nameA = (a["Tên ngành"] || "").trim().toLowerCase();
            const nameB = (b["Tên ngành"] || "").trim().toLowerCase();
            const scoreA = parseFloat(a["Điểm chuẩn"]) || 0;
            const scoreB = parseFloat(b["Điểm chuẩn"]) || 0;

            switch (sortOrder) {
                case 'az': return nameA.localeCompare(nameB);
                case 'za': return nameB.localeCompare(nameA);
                case 'score-desc': return scoreB - scoreA;
                case 'score-asc': return scoreA - scoreB;
                default: return 0;
            }
        });
    }, [allMatches.matches, searchTerm, blockFilter, sortOrder]);

    return (
        <div className="school-detail-page">
            <button className="back-btn" onClick={onBack}>
                <ChevronLeft size={20} />
                <span>Trở về</span>
            </button>

            <div className="detail-header major-detail-header">
                <div className="title-area">
                    <h1 className="detail-title">
                        <span className="major-detail-icon">
                            {majorGroup.icon}
                        </span>
                        <span>Nhóm ngành {majorGroup.name}</span>
                    </h1>
                </div>

                <div className="filter-dropdown detail-filter">
                    <Building2 size={18} color="var(--primary)" />
                    <select defaultValue="daihoc">
                        <option value="daihoc">Hệ đại học</option>
                        <option value="caodang">Hệ cao đẳng</option>
                    </select>
                </div>
            </div>

            <div className="scores-section">
                <div className="scores-filters-top" style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'flex-end' }}>
                    <div className="year-selector" style={{ background: 'white' }}>
                        <Calendar size={18} className="year-icon" />
                        <select defaultValue="2025" style={{ color: 'var(--primary)', fontWeight: 600 }}>
                            <option value="2025">2025</option>
                        </select>
                    </div>
                </div>

                <div className="scores-filters-bar">
                    <div className="filter-dropdown">
                        <Filter size={18} color="var(--primary)" />
                        <select value={blockFilter} onChange={e => setBlockFilter(e.target.value)}>
                            <option value="all">Tất cả các khối</option>
                            {allMatches.blocks.map(b => (
                                <option key={b} value={b}>Khối {b}</option>
                            ))}
                        </select>
                    </div>
                    <div className="filter-dropdown">
                        <ArrowDownAZ size={18} color="var(--primary)" />
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
                            placeholder="Tìm ngành: nhập tên ngành, mã ngành, tên trường"
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="scroll-hint-mobile show-mobile">
                    <span>DÙNG TAY VUỐT SANG PHẢI ĐỂ XEM ĐIỂM</span>
                    <span style={{ fontSize: '1.2rem' }}>👉</span>
                </div>

                <div className="table-responsive detail-table-wrapper">
                    <table className="detail-scores-table">
                        <thead>
                            <tr>
                                <th className="stt-col">STT</th>
                                <th>Tên, mã ngành</th>
                                <th>Điểm chuẩn</th>
                                <th>Tổ hợp môn</th>
                                <th className="hide-mobile">Học phí (VNĐ)</th>
                                <th>Tên trường</th>
                                <th className="hide-mobile"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredAndSortedMatches.length > 0 ? (
                                filteredAndSortedMatches.map((score, idx) => (
                                    <tr key={idx}>
                                        <td className="stt-cell stt-col">{idx + 1}</td>
                                        <td>
                                            <div className="major-name">{score["Tên ngành"]}</div>
                                            <div className="major-code">{score["Mã ngành"] || ""}</div>
                                        </td>
                                        <td>
                                            <div className="score-value">{score["Điểm chuẩn"]}</div>
                                            <div className="theo-nam-badge">Theo năm 📊</div>
                                        </td>
                                        <td style={{ color: 'var(--text-main)' }}>{score["Tổ hợp môn"]}</td>
                                        <td className="tuition-cell hide-mobile">--</td>
                                        <td className="note-cell">
                                            <div style={{ fontWeight: 500, color: 'var(--text-main)' }}>{score.schoolName}</div>
                                        </td>
                                        <td className="action-cell hide-mobile">
                                            <button className="icon-btn" title="Copy"><Copy size={16} /></button>
                                            <button className="icon-btn" title="Share"><Share2 size={16} /></button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" className="no-results-cell">
                                        Không tìm thấy ngành hoặc trường học phù hợp.
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

export default MajorDetail;

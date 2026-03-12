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
        <div className="school-detail-page" style={{ animation: 'fadeIn 0.3s ease-out' }}>
            <button className="back-btn" onClick={onBack} style={{ marginBottom: '1.5rem' }}>
                <ChevronLeft size={20} />
                <span>Trở về</span>
            </button>

            <div className="detail-header" style={{ borderBottom: 'none', paddingBottom: '0.5rem', marginBottom: '1rem' }}>
                <div className="title-area">
                    <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1.6rem', color: '#1a365d' }}>
                        <span style={{ fontSize: '1.8rem', background: 'var(--secondary)', width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '8px' }}>
                            {majorGroup.icon}
                        </span>
                        Nhóm ngành {majorGroup.name}
                    </h1>
                </div>

                <div className="filter-dropdown" style={{ backgroundColor: 'white', border: '1px solid var(--border-light)' }}>
                    <Building2 size={18} color="var(--primary)" />
                    <select defaultValue="daihoc" style={{ color: 'var(--text-main)', fontWeight: 500 }}>
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

                <div className="table-responsive detail-table-wrapper" style={{ border: '1px solid var(--border-light)', borderRadius: '8px' }}>
                    <table className="detail-scores-table">
                        <thead style={{ backgroundColor: '#f8f9fa' }}>
                            <tr>
                                <th>STT</th>
                                <th>Tên, mã ngành</th>
                                <th>Điểm chuẩn</th>
                                <th>Tổ hợp môn</th>
                                <th>Học phí (VNĐ)</th>
                                <th>Tên trường</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredAndSortedMatches.length > 0 ? (
                                filteredAndSortedMatches.map((score, idx) => (
                                    <tr key={idx}>
                                        <td className="stt-cell">{idx + 1}</td>
                                        <td>
                                            <div className="major-name" style={{ fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.25rem' }}>{score["Tên ngành"]}</div>
                                            <div className="major-code" style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{score["Mã ngành"] || ""}</div>
                                        </td>
                                        <td>
                                            <div className="score-value" style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '0.25rem' }}>{score["Điểm chuẩn"]}</div>
                                            <div className="theo-nam-badge" style={{ display: 'inline-flex', fontSize: '0.75rem', backgroundColor: '#0056b3', color: 'white', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>Theo năm 📊</div>
                                        </td>
                                        <td style={{ color: 'var(--text-main)' }}>{score["Tổ hợp môn"]}</td>
                                        <td className="tuition-cell">--</td>
                                        <td className="note-cell" style={{ maxWidth: '200px' }}>
                                            <div style={{ fontWeight: 500, color: 'var(--text-main)' }}>{score.schoolName}</div>
                                        </td>
                                        <td className="action-cell">
                                            <button className="icon-btn" title="Copy"><Copy size={16} /></button>
                                            <button className="icon-btn" title="Share"><Share2 size={16} /></button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
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

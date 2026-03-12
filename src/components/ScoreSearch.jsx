import React, { useState, useMemo } from 'react';
import { Search, Building2, Filter, ArrowDownAZ, Copy, Share2, Layers } from 'lucide-react';
import diemchuanData from '../data/diemchuan.json';
import { schoolsData } from '../data/mockData';
import { majorGroups } from '../data/majorGroups';
import '../ScoreSearch.css';

const ScoreSearch = () => {
    const [scoreMethod, setScoreMethod] = useState('thpt'); // 'thpt' or 'tonghop'
    const [minScore, setMinScore] = useState(0);
    const [maxScore, setMaxScore] = useState(30);

    const [locationFilter, setLocationFilter] = useState('all');
    const [blockFilter, setBlockFilter] = useState('all');
    const [majorGroupFilter, setMajorGroupFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [sortOrder, setSortOrder] = useState('asc');

    const handleMethodChange = (method) => {
        setScoreMethod(method);
        if (method === 'thpt') {
            setMinScore(0);
            setMaxScore(30);
        } else {
            setMinScore(30);
            setMaxScore(1200); // 1200 covers thang 100, 40, up to 1200 for ĐGNL
        }
    };

    const { allScores, availableBlocks } = useMemo(() => {
        const scores = [];
        const blocks = new Set();

        Object.entries(diemchuanData).forEach(([schoolCode, school]) => {
            if (!school.scores) return;
            const schoolBasic = schoolsData.find(s => s.code === schoolCode) || {};

            let loc = 'Khác';
            const sLoc = (schoolBasic.location || '').toLowerCase();
            if (sLoc.includes('hà nội')) loc = 'Hà Nội';
            else if (sLoc.includes('hồ chí minh') || sLoc.includes('tp hcm') || sLoc.includes('tp.hcm')) loc = 'TP HCM';
            else if (sLoc.includes('đà nẵng')) loc = 'Đà Nẵng';
            else if (sLoc.includes('cần thơ')) loc = 'Cần Thơ';
            else loc = 'Khác';

            school.scores.forEach(scoreItem => {
                const rawScore = parseFloat(scoreItem["Điểm chuẩn"]);
                if (isNaN(rawScore)) return;

                const method = rawScore <= 30 ? 'thpt' : 'tonghop';

                const toHop = scoreItem["Tổ hợp môn"] || "";
                toHop.split(/;\s*|,/).forEach(p => {
                    const letter = p.trim().charAt(0).toUpperCase();
                    if (letter && /[A-Z]/.test(letter)) {
                        blocks.add(letter);
                    }
                });

                scores.push({
                    ...scoreItem,
                    schoolName: school.name,
                    schoolCode: school.code,
                    locCategory: loc,
                    parsedScore: rawScore,
                    method: method
                });
            });
        });
        return { allScores: scores, availableBlocks: Array.from(blocks).sort() };
    }, []);

    const filteredResults = useMemo(() => {
        return allScores.filter(item => {
            if (item.method !== scoreMethod) return false;
            if (item.parsedScore < minScore || item.parsedScore > maxScore) return false;

            if (locationFilter !== 'all' && item.locCategory !== locationFilter) return false;

            if (blockFilter !== 'all') {
                const toHop = item["Tổ hợp môn"] || "";
                if (!toHop.split(/;\s*|,/).some(p => p.trim().toUpperCase().startsWith(blockFilter))) {
                    return false;
                }
            }

            if (majorGroupFilter !== 'all') {
                const group = majorGroups.find(g => g.id === majorGroupFilter);
                if (group) {
                    const majorName = (item["Tên ngành"] || "").toLowerCase();
                    const isMatch = group.keywords.some(kw => majorName.includes(kw));
                    if (!isMatch) return false;
                }
            }

            if (searchTerm) {
                const term = searchTerm.toLowerCase();
                if (!item["Tên ngành"]?.toLowerCase().includes(term) &&
                    !item["Mã ngành"]?.toLowerCase().includes(term) &&
                    !item.schoolName.toLowerCase().includes(term)) {
                    return false;
                }
            }

            return true;
        }).sort((a, b) => {
            if (sortOrder === 'asc') return a.parsedScore - b.parsedScore;
            return b.parsedScore - a.parsedScore;
        });
    }, [allScores, scoreMethod, minScore, maxScore, locationFilter, blockFilter, majorGroupFilter, searchTerm, sortOrder]);

    const locations = ['Hà Nội', 'TP HCM', 'Đà Nẵng', 'Cần Thơ', 'Khác'];

    // Limit to 500 to render fast
    const displayResults = filteredResults.slice(0, 500);

    return (
        <div className="tab-content score-search-container">
            <div className="tab-header score-header">
                <h2>XEM NGÀNH, TRƯỜNG DỰA THEO ĐIỂM DỰ KIẾN</h2>
            </div>

            <div className="score-method-toggle">
                <button
                    className={scoreMethod === 'thpt' ? 'active' : ''}
                    onClick={() => handleMethodChange('thpt')}
                >
                    Điểm TNTHPTQ (Thang 30)
                </button>
                <button
                    className={scoreMethod === 'tonghop' ? 'active' : ''}
                    onClick={() => handleMethodChange('tonghop')}
                >
                    Điểm tổng hợp / ĐGNL (&gt; 30)
                </button>
            </div>

            <div className="score-range-section">
                <div className="score-inputs-wrapper">
                    <span className="label">Khoảng điểm từ</span>
                    <input
                        type="number"
                        value={minScore}
                        onChange={e => setMinScore(Number(e.target.value))}
                        min={0}
                        max={scoreMethod === 'thpt' ? 30 : 1200}
                        step={scoreMethod === 'thpt' ? 0.1 : 1}
                        className="score-number-input"
                    />
                    <span className="label">Điểm đến</span>
                    <input
                        type="number"
                        value={maxScore}
                        onChange={e => setMaxScore(Number(e.target.value))}
                        min={0}
                        max={scoreMethod === 'thpt' ? 30 : 1200}
                        step={scoreMethod === 'thpt' ? 0.1 : 1}
                        className="score-number-input"
                    />
                    <span className="label">Điểm</span>
                </div>
            </div>

            <div className="location-tags-grid">
                <button
                    className={`tag-btn-loc ${locationFilter === 'all' ? 'active' : ''}`}
                    onClick={() => setLocationFilter('all')}
                >
                    Tất cả khu vực
                </button>
                {locations.map(loc => (
                    <button
                        key={loc}
                        className={`tag-btn-loc ${locationFilter === loc ? 'active' : ''}`}
                        onClick={() => setLocationFilter(loc)}
                    >
                        {loc === 'Khác' ? 'Tỉnh thành khác' : loc}
                    </button>
                ))}
            </div>

            <div className="filters-row">
                <div className="filter-dropdown">
                    <Building2 size={18} color="var(--primary)" />
                    <select defaultValue="daihoc">
                        <option value="daihoc">Hệ đại học</option>
                        <option value="caodang">Hệ cao đẳng</option>
                    </select>
                </div>
                <div className="filter-dropdown flex-1">
                    <Filter size={18} color="var(--primary)" />
                    <select value={blockFilter} onChange={e => setBlockFilter(e.target.value)}>
                        <option value="all">Tất cả các khối</option>
                        {availableBlocks.map(b => (
                            <option key={b} value={b}>Khối {b}</option>
                        ))}
                    </select>
                </div>
                <div className="filter-dropdown flex-1">
                    <Layers size={18} color="var(--primary)" />
                    <select value={majorGroupFilter} onChange={e => setMajorGroupFilter(e.target.value)}>
                        <option value="all">Tất cả nhóm ngành</option>
                        {majorGroups.map(g => (
                            <option key={g.id} value={g.id}>{g.name}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="results-header">
                <h3><span className="result-count">{filteredResults.length}</span> Kết quả {filteredResults.length > 500 && '(hiển thị 500 kết quả đầu)'}</h3>
            </div>

            <div className="scores-filters-bar">
                <div className="filter-dropdown" style={{ minWidth: '220px' }}>
                    <ArrowDownAZ size={18} color="var(--primary)" />
                    <select value={sortOrder} onChange={e => setSortOrder(e.target.value)}>
                        <option value="asc">Điểm chuẩn thấp → cao</option>
                        <option value="desc">Điểm chuẩn cao → thấp</option>
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
                        {displayResults.length > 0 ? (
                            displayResults.map((score, idx) => (
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
                                    Không tìm thấy ngành hoặc trường học phù hợp với mức điểm này.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ScoreSearch;

import React, { useState, useMemo } from 'react';
import { Search, Building2, Filter, ArrowDownAZ, Copy, Share2, Layers } from 'lucide-react';
import diemchuanData from '../data/diemchuan.json';
import { schoolsData } from '../data/mockData';
import { majorGroups } from '../data/majorGroups';
import '../ScoreSearch.css';

const ScoreSearch = ({ onSelectMajorGroup }) => {
    const [scoreMethod, setScoreMethod] = useState('thpt'); // 'thpt' or 'tonghop'
    const [minScore, setMinScore] = useState('0');
    const [maxScore, setMaxScore] = useState('30');

    const [locationFilter, setLocationFilter] = useState('all');
    const [comboFilter, setComboFilter] = useState('all');
    const [majorGroupFilter, setMajorGroupFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [sortOrder, setSortOrder] = useState('asc');

    const handleMethodChange = (method) => {
        setScoreMethod(method);
        if (method === 'thpt') {
            setMinScore('0');
            setMaxScore('30');
        } else {
            setMinScore('30');
            setMaxScore('100'); // 100 covers thang 100
        }
    };

    const { allScores, availableCombos } = useMemo(() => {
        const scores = [];
        const combos = new Set();

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
                if (rawScore > 100) return;

                const method = rawScore <= 30 ? 'thpt' : 'tonghop';

                const toHop = scoreItem["Tổ hợp môn"] || "";
                toHop.split(/;\s*|,/).forEach(p => {
                    const code = p.trim().toUpperCase();
                    if (/^[A-Z]\d{2}$/.test(code)) {
                        combos.add(code);
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
        return { allScores: scores, availableCombos: Array.from(combos).sort() };
    }, []);

    // Popular combos to show as quick-filter tags
    const popularCombos = ['A00', 'A01', 'B00', 'C00', 'D01', 'D07', 'D14', 'D15'];

    const filteredResults = useMemo(() => {
        const currentMin = minScore === '' ? 0 : Number(minScore);
        const currentMax = maxScore === '' ? 1000 : Number(maxScore);

        return allScores.filter(item => {
            if (item.method !== scoreMethod) return false;
            if (item.parsedScore < currentMin || item.parsedScore > currentMax) return false;

            if (locationFilter !== 'all' && item.locCategory !== locationFilter) return false;

            if (comboFilter !== 'all') {
                const toHop = item["Tổ hợp môn"] || "";
                const matchesCombo = toHop.split(/;\s*|,/).some(p => p.trim().toUpperCase() === comboFilter);
                if (!matchesCombo) return false;
            }

            if (majorGroupFilter !== 'all') {
                const group = majorGroups.find(g => g.id === majorGroupFilter);
                if (group) {
                    const majorName = (item["Tên ngành"] || "").toLowerCase();
                    const keywords = group.keywords || group.majors.map(m => m.name);
                    const isMatch = keywords.some(kw => majorName.includes(kw.toLowerCase()));
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
    }, [allScores, scoreMethod, minScore, maxScore, locationFilter, comboFilter, majorGroupFilter, searchTerm, sortOrder]);

    const locations = ['Hà Nội', 'TP HCM', 'Đà Nẵng', 'Cần Thơ'];

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
                        onChange={e => setMinScore(e.target.value)}
                        min={0}
                        max={scoreMethod === 'thpt' ? 30 : 100}
                        step={scoreMethod === 'thpt' ? 0.1 : 1}
                        className="score-number-input"
                    />
                    <span className="label">Điểm đến</span>
                    <input
                        type="number"
                        value={maxScore}
                        onChange={e => setMaxScore(e.target.value)}
                        min={0}
                        max={scoreMethod === 'thpt' ? 30 : 100}
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

            {/* Popular combo quick-filter tags */}
            <div className="combo-tags-row">
                <span className="combo-tags-label">Tổ hợp môn:</span>
                <button
                    className={`combo-tag-btn ${comboFilter === 'all' ? 'active' : ''}`}
                    onClick={() => setComboFilter('all')}
                >Tất cả</button>
                {popularCombos.map(c => (
                    <button
                        key={c}
                        className={`combo-tag-btn ${comboFilter === c ? 'active' : ''}`}
                        onClick={() => setComboFilter(comboFilter === c ? 'all' : c)}
                    >{c}</button>
                ))}
                <div className="filter-dropdown combo-more-dropdown">
                    <Filter size={15} color="var(--primary)" />
                    <select
                        value={comboFilter}
                        onChange={e => setComboFilter(e.target.value)}
                        title="Chọn tổ hợp môn cụ thể"
                    >
                        <option value="all">Tổ hợp khác...</option>
                        {availableCombos.filter(c => !popularCombos.includes(c)).map(c => (
                            <option key={c} value={c}>Tổ hợp {c}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="filters-row">
                <div className="search-input-wrapper flex-2" style={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    backgroundColor: 'white', 
                    border: '1px solid var(--border-light)', 
                    borderRadius: 'var(--radius-md)',
                    padding: '0 1rem'
                }}>
                    <Search size={18} color="var(--primary)" style={{ flexShrink: 0 }} />
                    <input
                        type="text"
                        placeholder="Tìm ngành, mã ngành, trường..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        style={{ 
                            border: 'none', 
                            padding: '0.75rem 0.5rem',
                            outline: 'none',
                            width: '100%',
                            fontSize: '0.9rem'
                        }}
                    />
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
                <div className="filter-dropdown" style={{ minWidth: '220px', flex: 1 }}>
                    <ArrowDownAZ size={18} color="var(--primary)" />
                    <select value={sortOrder} onChange={e => setSortOrder(e.target.value)}>
                        <option value="asc">Điểm chuẩn thấp → cao</option>
                        <option value="desc">Điểm chuẩn cao → thấp</option>
                    </select>
                </div>
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
                        {displayResults.length > 0 ? (
                            displayResults.map((score, idx) => {
                                const matchedGroup = majorGroups.find(g => {
                                    const majorName = (score["Tên ngành"] || "").toLowerCase();
                                    const keywords = g.keywords || g.majors.map(m => m.name);
                                    return keywords.some(kw => majorName.includes(kw.toLowerCase()));
                                });

                                return (
                                    <tr 
                                        key={idx} 
                                        onClick={() => matchedGroup && onSelectMajorGroup && onSelectMajorGroup(matchedGroup)}
                                        style={{ cursor: matchedGroup ? 'pointer' : 'default' }}
                                        title={matchedGroup ? `Xem chi tiết nhóm ngành ${matchedGroup.name}` : ''}
                                    >
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
                                            <button className="icon-btn" title="Copy" onClick={(e) => e.stopPropagation()}><Copy size={16} /></button>
                                            <button className="icon-btn" title="Share" onClick={(e) => e.stopPropagation()}><Share2 size={16} /></button>
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan="7" className="no-results-cell">
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

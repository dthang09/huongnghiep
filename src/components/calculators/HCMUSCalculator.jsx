import React, { useState } from 'react';
import { Calculator, Info, CheckCircle2 } from 'lucide-react';
import '../../ScoreCalculator.css';

const HCMUSCalculator = () => {
    // Inputs
    const [thptScore, setThptScore] = useState('');     // Thang 30
    const [dgnlScore, setDgnlScore] = useState('');     // Thang Max (mặc định 1200)
    const [maxDgnlParam, setMaxDgnlParam] = useState('1100'); // the highest score of DGNL 2026

    const [hocBa, setHocBa] = useState('');            // Thang 30

    // Weights
    const [w1, setW1] = useState('0.8');
    const [w2, setW2] = useState('0.2');
    const [w3, setW3] = useState('0.8');
    const [w4, setW4] = useState('0.2');

    const [diemCong, setDiemCong] = useState('');

    const [thangCongBo, setThangCongBo] = useState('100'); // 100 or 1200 or 1000

    const [dtType, setDtType] = useState('KV3'); // Khu vực ưu tiên

    const [result, setResult] = useState(null);

    const parseNum = (val) => {
        const n = parseFloat(val);
        return isNaN(n) ? 0 : n;
    };

    const uuTienData = {
        'KV3': 0,
        'KV2': 0.25,
        'KV2-NT': 0.5,
        'KV1': 0.75,
        'NDT-UT1': 2.0, // Ưu tiên đối tượng 1
        'NDT-UT2': 1.0  // Ưu tiên đối tượng 2
        // Just simple constants for now, or users can type the exact "Mức điểm ưu tiên theo Bộ" manually.
    };

    const handleCalculate = () => {
        const pt_HocBa = parseNum(hocBa);
        const pt_THPT = parseNum(thptScore);
        const pt_DGNL = parseNum(dgnlScore);
        const pt_MaxDGNL = parseNum(maxDgnlParam) || 1200;

        const cw1 = parseNum(w1);
        const cw2 = parseNum(w2);
        const cw3 = parseNum(w3);
        const cw4 = parseNum(w4);

        const d_cong = parseNum(diemCong);

        // Trường hợp 1: Có thi THPT 2026
        let hl_1 = 0;
        if (pt_THPT > 0 || pt_HocBa > 0) {
            hl_1 = cw1 * pt_THPT + cw2 * pt_HocBa;
        }

        // Trường hợp 2: Có ĐGNL 2026
        let hl_2 = 0;
        let pt_dgnl_thang30 = 0;
        if (pt_DGNL > 0) {
            pt_dgnl_thang30 = (pt_DGNL / pt_MaxDGNL) * 30;
            hl_2 = cw3 * pt_dgnl_thang30 + cw4 * pt_HocBa;
        }

        const hocLuc = Math.max(hl_1, hl_2);
        const usedMethod = hl_2 > hl_1 ? 'DGNL' : 'THPT';

        const tongDatDuoc = hocLuc + d_cong;

        // Điểm ưu tiên (Khoa học Tự nhiên tính Ưu Tiên thang 30 rút gọn)
        const mucUuTienKVDT = parseNum(dtType);
        let d_uu_tien = 0;

        if (tongDatDuoc < 22.5) {
            d_uu_tien = mucUuTienKVDT;
        } else {
            d_uu_tien = ((30 - tongDatDuoc) / 7.5) * mucUuTienKVDT;
            if (d_uu_tien < 0) d_uu_tien = 0;
        }

        const diemXetTuyen = hocLuc + d_cong + d_uu_tien;

        // Điểm xét tuyển công bố chuẩn hóa (thường là thang 100 hoặc 1200)
        const scale = parseNum(thangCongBo);
        let diemCongBo = scale * (diemXetTuyen / 30);

        // Round
        diemCongBo = Math.round(diemCongBo * 100) / 100;
        const d_uu_tien_rounded = Math.round(d_uu_tien * 100) / 100;

        setResult({
            hl_1,
            hl_2,
            pt_dgnl_thang30,
            hocLuc,
            usedMethod,
            cong: d_cong,
            uuTienBase: mucUuTienKVDT,
            uuTienThucTe: d_uu_tien_rounded,
            diemXetTuyen,
            diemCongBo
        });
    };

    return (
        <div className="calculator-container" style={{ animation: 'fadeIn 0.3s ease-out' }}>
            <div className="calculator-header">
                <h2>CÔNG THỨC VÀ THANG ĐIỂM (KHTN TPHCM)</h2>
                <p>Mô phỏng Phương thức Kết hợp THPT/ĐGNL và Học Bạ (PT2)</p>
            </div>

            <div className="calculator-body">
                <div className="calc-card">
                    <div className="calc-title-modern">Thông số hệ số (w) dự kiến</div>
                    <div className="grid-2-col" style={{ marginBottom: '2rem' }}>
                        <div className="highlight-box" style={{ background: '#f0f9ff', borderColor: '#bae6fd' }}>
                            <p style={{ fontWeight: 700, color: '#0369a1', marginBottom: '0.75rem', fontSize: '0.9rem' }}>TH1: THPT + Học bạ</p>
                            <div className="grid-2-col">
                                <div className="modern-input-group">
                                    <label className="modern-label">w1 (THPT)</label>
                                    <input className="modern-input" type="number" step="0.1" max="1" min="0" value={w1} onChange={e => setW1(e.target.value)} />
                                </div>
                                <div className="modern-input-group">
                                    <label className="modern-label">w2 (Học bạ)</label>
                                    <input className="modern-input" type="number" step="0.1" max="1" min="0" value={w2} onChange={e => setW2(e.target.value)} />
                                </div>
                            </div>
                        </div>
                        <div className="highlight-box" style={{ background: '#f0fdf4', borderColor: '#bbf7d0' }}>
                            <p style={{ fontWeight: 700, color: '#166534', marginBottom: '0.75rem', fontSize: '0.9rem' }}>TH2: ĐGNL + Học bạ</p>
                            <div className="grid-2-col">
                                <div className="modern-input-group">
                                    <label className="modern-label">w3 (ĐGNL)</label>
                                    <input className="modern-input" type="number" step="0.1" max="1" min="0" value={w3} onChange={e => setW3(e.target.value)} />
                                </div>
                                <div className="modern-input-group">
                                    <label className="modern-label">w4 (Học bạ)</label>
                                    <input className="modern-input" type="number" step="0.1" max="1" min="0" value={w4} onChange={e => setW4(e.target.value)} />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="calc-title-modern">Nhập điểm của thí sinh</div>
                    <div className="grid-2-col">
                        <div className="calc-section">
                            <div className="modern-input-group">
                                <label className="modern-label" style={{ color: 'var(--primary)' }}>Tổng điểm 3 môn THPT (Max 30)</label>
                                <input className="modern-input" type="number" placeholder="0" value={thptScore} onChange={e => setThptScore(e.target.value)} />
                            </div>
                            <div className="modern-input-group">
                                <label className="modern-label" style={{ color: 'var(--primary)' }}>ĐTB Học bạ 3 môn (Max 30)</label>
                                <input className="modern-input" type="number" placeholder="0" value={hocBa} onChange={e => setHocBa(e.target.value)} />
                                <span className="help-text">Tổng trung bình 3 năm của 3 môn xét tuyển</span>
                            </div>
                            <div className="modern-input-group">
                                <label className="modern-label" style={{ color: 'var(--primary)' }}>Điểm thi ĐGNL ĐHQG-HCM</label>
                                <input className="modern-input" type="number" placeholder="VD: 1050" value={dgnlScore} onChange={e => setDgnlScore(e.target.value)} />
                            </div>
                        </div>

                        <div className="calc-section">
                            <div className="modern-input-group">
                                <label className="modern-label">Max ĐGNL (Điểm cao nhất đợt thi)</label>
                                <input className="modern-input" type="number" value={maxDgnlParam} onChange={e => setMaxDgnlParam(e.target.value)} />
                            </div>
                            <div className="modern-input-group">
                                <label className="modern-label">Điểm cộng thành tích / Ưu tiên khác</label>
                                <input className="modern-input" type="number" value={diemCong} onChange={e => setDiemCong(e.target.value)} />
                            </div>
                            <div className="modern-input-group">
                                <label className="modern-label">Ưu tiên Khu vực & Đối tượng (Thang 30)</label>
                                <select
                                    className="modern-input"
                                    value={dtType}
                                    onChange={e => setDtType(e.target.value)}
                                    style={{ width: '100%', cursor: 'pointer' }}
                                >
                                    <option value="0">Không ưu tiên (0đ)</option>
                                    <option value="0.25">KV2 (0.25đ)</option>
                                    <option value="0.5">KV2-NT (0.5đ)</option>
                                    <option value="0.75">KV1 (0.75đ)</option>
                                    <option value="1.0">KV3 / Khác + Đối tượng 2 (+1.0đ)</option>
                                    <option value="1.25">KV2 + UT2 (+1.25đ)</option>
                                    <option value="1.5">KV2-NT + UT2 (+1.5đ)</option>
                                    <option value="2.0">Đối tượng 1 (+2.0đ)</option>
                                    <option value="2.75">KV1 + UT1 (+2.75đ)</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="highlight-box" style={{ marginTop: '1.5rem', background: '#fffbeb', borderColor: '#fde68a' }}>
                        <div className="modern-input-group" style={{ maxWidth: '400px', margin: '0 auto' }}>
                            <label className="modern-label" style={{ color: '#92400e', textAlign: 'center' }}>Thang điểm công bố quy đổi (KHTN)</label>
                            <select
                                className="modern-input"
                                value={thangCongBo}
                                onChange={e => setThangCongBo(e.target.value)}
                            >
                                <option value="100">Thang điểm 100</option>
                                <option value="1200">Thang điểm 1200</option>
                            </select>
                        </div>
                    </div>

                    <button className="calculate-btn calc-btn-khtn" onClick={handleCalculate}>
                        <Calculator size={20} /> TÍNH ĐIỂM XÉT TUYỂN KHTN
                    </button>
                </div>

                {result && (
                    <div className="result-card result-card-khtn">
                        <div className="result-header">
                            <CheckCircle2 color="#0d9488" size={32} />
                            <h3>KẾT QUẢ DỰ KIẾN</h3>
                        </div>

                        <div className="result-details">
                            <div className="grid-2-col">
                                <div>
                                    <div className="res-row">
                                        <span>TH1 (THPT + Học bạ):</span>
                                        <strong>{result.hl_1.toFixed(2)}</strong>
                                    </div>
                                    <div className="res-row">
                                        <span>TH2 (ĐGNL + Học bạ):</span>
                                        <strong>{result.hl_2.toFixed(2)}</strong>
                                    </div>
                                </div>
                                <div className="highlight-box highlight-box-khtn">
                                    <div className="res-row">
                                        <span style={{ fontSize: '0.9rem' }}>Điểm học lực (Max TH1, TH2):</span>
                                        <strong>{result.hocLuc.toFixed(2)}</strong>
                                    </div>
                                    <div className="res-row" style={{ fontSize: '0.8rem', opacity: 0.8, fontWeight: 600 }}>
                                        <span>Phương thức sử dụng:</span>
                                        <span>{result.usedMethod === 'DGNL' ? 'Đánh giá năng lực' : 'Thi TN THPT'}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="res-divider"></div>

                            <div className="grid-2-col">
                                <div className="res-row">
                                    <span>Điểm Cộng:</span>
                                    <strong>{result.cong.toFixed(2)}</strong>
                                </div>
                                <div className="res-row">
                                    <span>Điểm Ưu Tiên thực tế:</span>
                                    <strong>{result.uuTienThucTe.toFixed(2)}</strong>
                                </div>
                            </div>

                            <div className="res-divider"></div>
                            <div className="res-row final-score final-score-khtn">
                                <div className="final-score-content">
                                    <div className="final-score-label">ĐIỂM XÉT TUYỂN CHUẨN HÓA (Thang {thangCongBo})</div>
                                    <div className="final-score-value">{result.diemCongBo}</div>
                                </div>
                            </div>
                            <p style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                * Đây là điểm mô phỏng dựa trên phương thức kết hợp của ĐH KHTN TPHCM. Kết quả thực tế có thể thay đổi tùy theo quy định chính thức.
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default HCMUSCalculator;

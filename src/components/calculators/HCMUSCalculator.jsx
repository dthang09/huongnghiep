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
                <h2>CÔNG THỨC VÀ THANG ĐIỂM (KHOA HỌC TỰ NHIÊN TPHCM)</h2>
                <p>Mô phỏng Phương thức Kết hợp THPT/ĐGNL và Học Bạ (Thang chuẩn hóa tự chọn)</p>
            </div>

            <div className="calculator-body">
                <div className="calc-card">
                    <h3>Thông số hệ số (w) dự kiến</h3>
                    <div className="calc-grid" style={{ marginBottom: '2rem' }}>
                        <div>
                            <p style={{ fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.5rem' }}>Trường hợp 1 (THPT + Học bạ)</p>
                            <div className="input-group" style={{ display: 'flex', flexDirection: 'row', gap: '1rem' }}>
                                <div style={{ flex: 1 }}>
                                    <label>Hệ số w1 (THPT)</label>
                                    <input type="number" step="0.1" max="0.9" min="0.7" value={w1} onChange={e => setW1(e.target.value)} />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <label>Hệ số w2 (Học bạ)</label>
                                    <input type="number" step="0.1" max="0.3" min="0.1" value={w2} onChange={e => setW2(e.target.value)} />
                                </div>
                            </div>
                        </div>
                        <div>
                            <p style={{ fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.5rem' }}>Trường hợp 2 (ĐGNL + Học bạ)</p>
                            <div className="input-group" style={{ display: 'flex', flexDirection: 'row', gap: '1rem' }}>
                                <div style={{ flex: 1 }}>
                                    <label>Hệ số w3 (ĐGNL)</label>
                                    <input type="number" step="0.1" max="0.9" min="0.7" value={w3} onChange={e => setW3(e.target.value)} />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <label>Hệ số w4 (Học bạ)</label>
                                    <input type="number" step="0.1" max="0.3" min="0.1" value={w4} onChange={e => setW4(e.target.value)} />
                                </div>
                            </div>
                        </div>
                    </div>

                    <h3>Nhập điểm của thí sinh</h3>
                    <div className="calc-grid">
                        <div className="calc-section">
                            <div className="input-group">
                                <label style={{ color: 'var(--primary)' }}>Tổng điểm 3 môn THPT (Tối đa 30)</label>
                                <input type="number" placeholder="Điểm thi THPT..." value={thptScore} onChange={e => setThptScore(e.target.value)} />
                            </div>
                            <div className="input-group">
                                <label style={{ color: 'var(--primary)' }}>Trung bình tổng 3 năm Học bạ 3 môn (Tối đa 30)</label>
                                <input type="number" placeholder="Điểm TB Hệ 30..." value={hocBa} onChange={e => setHocBa(e.target.value)} />
                                <span className="help-text" style={{ marginTop: '0.2rem' }}>Tổng ĐTB 3 năm môn 1 + môn 2 + môn 3</span>
                            </div>
                            <div className="input-group">
                                <label style={{ color: 'var(--primary)' }}>Điểm thi ĐGNL ĐHQG-HCM</label>
                                <input type="number" placeholder="VD: 1050" value={dgnlScore} onChange={e => setDgnlScore(e.target.value)} />
                            </div>
                        </div>

                        <div className="calc-section">
                            <div className="highlight-box" style={{ marginTop: '0' }}>
                                <div className="input-group">
                                    <label>Max Điểm thi ĐGNL (Điểm cao nhất đợt thi)</label>
                                    <input type="number" value={maxDgnlParam} onChange={e => setMaxDgnlParam(e.target.value)} />
                                </div>
                                <div className="input-group">
                                    <label>Điểm cộng thành tích (tối đa tùy loại)</label>
                                    <input type="number" value={diemCong} onChange={e => setDiemCong(e.target.value)} />
                                </div>
                                <div className="input-group">
                                    <label>Mức Ưu tiên khu vực/ĐT theo Bộ (Thang 30)</label>
                                    <select
                                        value={dtType}
                                        onChange={e => setDtType(e.target.value)}
                                        style={{ width: '100%', padding: '0.75rem', border: '1px solid var(--border-light)', borderRadius: '8px', fontSize: '1rem' }}
                                    >
                                        <option value="0">Không ưu tiên (0đ)</option>
                                        <option value="0.25">KV2 (0.25đ)</option>
                                        <option value="0.5">KV2-NT (0.5đ)</option>
                                        <option value="0.75">KV1 (0.75đ)</option>
                                        <option value="1.0">KV3 / NĐT Khác + UT Đối tượng 2 (+1.0đ)</option>
                                        <option value="1.25">KV2 + UT2 (+1.25đ)</option>
                                        <option value="1.5">KV2-NT + UT2 (+1.5đ)</option>
                                        <option value="2.0">UT Đối tượng 1 (+2.0đ)</option>
                                        <option value="2.75">KV1 + UT1 (+2.75đ)</option>
                                    </select>
                                </div>
                            </div>

                            <div className="input-group" style={{ marginTop: '1rem' }}>
                                <label style={{ color: '#d97706', fontWeight: 600 }}>Thang điểm công bố quy đổi cho KHTN (100 hay 1200?)</label>
                                <select
                                    value={thangCongBo}
                                    onChange={e => setThangCongBo(e.target.value)}
                                    style={{ width: '100%', padding: '0.75rem', border: '1px solid #ffdeaf', backgroundColor: '#fff4e5', borderRadius: '8px', fontSize: '1.2rem', fontWeight: 700 }}
                                >
                                    <option value="100">Thang điểm 100</option>
                                    <option value="1200">Thang điểm 1200 (hoặc khác)</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <button className="calculate-btn" onClick={handleCalculate} style={{ backgroundColor: '#0d9488' }}>
                        <Calculator size={20} /> Tính Điểm Xét Tuyển KHTN
                    </button>
                </div>

                {result && (
                    <div className="result-card" style={{ animation: 'slideUp 0.3s ease-out', border: '2px solid #0d9488' }}>
                        <div className="result-header">
                            <CheckCircle2 color="#0d9488" size={32} />
                            <h3 style={{ color: '#0d9488' }}>KẾT QUẢ ĐIỂM XÉT TUYỂN KHTN</h3>
                        </div>

                        <div className="result-details" style={{ maxWidth: '600px' }}>
                            <div className="res-row">
                                <span style={{ color: 'var(--text-muted)' }}>TH1: Học lực (THPT + Học bạ):</span>
                                <strong>{result.hl_1.toFixed(3)}</strong>
                            </div>
                            <div className="res-row" style={{ marginBottom: '0.2rem' }}>
                                <span style={{ color: 'var(--text-muted)' }}>Quy đổi ĐGNL sang thang 30:</span>
                                <strong>{result.pt_dgnl_thang30.toFixed(3)}</strong>
                            </div>
                            <div className="res-row">
                                <span style={{ color: 'var(--text-muted)' }}>TH2: Học lực (ĐGNL + Học bạ):</span>
                                <strong>{result.hl_2.toFixed(3)}</strong>
                            </div>

                            <div className="res-divider"></div>

                            <div className="res-row main-comp">
                                <span>Điểm_học_lực = Max (TH1, TH2):</span>
                                <strong style={{ color: '#0d9488' }}>{result.hocLuc.toFixed(3)}  ({result.usedMethod})</strong>
                            </div>
                            <div className="res-row main-comp">
                                <span>Điểm Cộng:</span>
                                <strong>{result.cong.toFixed(3)}</strong>
                            </div>
                            <div className="res-row main-comp">
                                <span>Điểm Ưu Tiên (Thực tế):</span>
                                <strong>{result.uuTienThucTe.toFixed(3)}</strong>
                            </div>
                            <p style={{ fontSize: '0.85rem', color: 'gray', fontStyle: 'italic', textAlign: 'right', marginTop: '-0.2rem' }}>
                                (Với mức UT gốc: {result.uuTienBase})
                            </p>

                            <div className="res-divider"></div>
                            <div className="res-row final-score" style={{ background: '#e6fcf5', color: '#0d9488' }}>
                                <div>
                                    <div style={{ fontSize: '1rem', fontWeight: 500 }}>Điểm xét tuyển công bố chuẩn hóa:</div>
                                    <div style={{ fontSize: '1.8rem', fontWeight: 800, marginTop: '0.25rem' }}>{result.diemCongBo} / {thangCongBo}</div>
                                </div>
                            </div>
                            <p style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                                * Kết quả trúng tuyển sẽ so quy đổi về thang {thangCongBo} (Lấy 2 chữ số thập phân)
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default HCMUSCalculator;

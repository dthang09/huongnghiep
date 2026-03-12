import React, { useState } from 'react';
import { Calculator, Info, CheckCircle2, ChevronDown } from 'lucide-react';
import '../../ScoreCalculator.css';

const BKUCalculator = () => {
    const [hasDGNL, setHasDGNL] = useState(true);

    // THPT & Học bạ
    const [mathTHPT, setMathTHPT] = useState('');
    const [sub2THPT, setSub2THPT] = useState('');
    const [sub3THPT, setSub3THPT] = useState(''); // Môn 3/Anh

    const [mathTB, setMathTB] = useState('');
    const [sub2TB, setSub2TB] = useState('');
    const [sub3TB, setSub3TB] = useState('');

    // DGNL HCM
    const [mathDGNL, setMathDGNL] = useState('');
    const [totalDGNL, setTotalDGNL] = useState('');

    // Achievement
    const [achievementScore, setAchievementScore] = useState('');

    // Priority
    const [kvPriority, setKvPriority] = useState('KV3');
    const [dtPriority, setDtPriority] = useState('NONE');

    // English Certificates
    const [ieltsOverall, setIeltsOverall] = useState('');
    const [toeicLR, setToeicLR] = useState('');
    const [toeicSW, setToeicSW] = useState('');
    const [toeflTotal, setToeflTotal] = useState('');

    const [result, setResult] = useState(null);

    const parseNum = (val) => {
        const n = parseFloat(val);
        return isNaN(n) ? 0 : n;
    };

    const getIeltsScore = (val) => {
        const v = parseNum(val);
        if (v >= 8.0) return 10.0;
        if (v >= 7.5) return 9.5;
        if (v >= 7.0) return 9.0;
        if (v >= 6.5) return 8.5;
        if (v >= 6.0) return 8.0;
        return 0;
    };

    const getToeflScore = (val) => {
        const v = parseNum(val);
        if (v >= 110) return 10.0;
        if (v >= 102) return 9.5;
        if (v >= 94) return 9.0;
        if (v >= 79) return 8.5;
        if (v >= 60) return 8.0;
        return 0;
    };

    const getToeicScore = (lr, sw) => {
        const plr = parseNum(lr);
        const psw = parseNum(sw);
        if (plr >= 905 && psw >= 390) return 10.0;
        if (plr >= 835 && psw >= 380) return 9.5;
        if (plr >= 785 && psw >= 360) return 9.0;
        if (plr >= 685 && psw >= 330) return 8.5;
        if (plr >= 570 && psw >= 310) return 8.0;
        return 0;
    };

    const handleCalculate = () => {
        const m1_thpt = parseNum(mathTHPT);
        const m2_thpt = parseNum(sub2THPT);
        const m3_raw_thpt = parseNum(sub3THPT);

        // Quy đổi chứng chỉ Anh
        const ielts = getIeltsScore(ieltsOverall);
        const toeic = getToeicScore(toeicLR, toeicSW);
        const toefl = getToeflScore(toeflTotal);
        const m3_thpt = Math.max(m3_raw_thpt, ielts, toeic, toefl);

        const m1_tb = parseNum(mathTB);
        const m2_tb = parseNum(sub2TB);
        const m3_tb = parseNum(sub3TB);

        const pt_thuong = parseNum(achievementScore);

        // Priority Values
        const kvValues = { 'KV1': 0.75, 'KV2-NT': 0.5, 'KV2': 0.25, 'KV3': 0 };
        const dtValues = { 'NONE': 0, 'DT1': 2.0, 'DT2': 2.0, 'DT3': 2.0, 'DT4': 2.0, 'DT5': 1.0, 'DT6': 1.0, 'DT7': 1.0 };
        const pt_uuTien30 = kvValues[kvPriority] + dtValues[dtPriority];

        // 1. Điểm TNTHPT quy đổi
        const thpt_quydoi = ((m2_thpt + m3_thpt + m1_thpt * 2) / 4) * 10;

        // 2. Điểm học THPT quy đổi
        const tbhoc_quydoi = ((m2_tb + m3_tb + m1_tb * 2) / 4) * 10;

        // 3. Điểm năng lực
        let nangluc = 0;
        if (hasDGNL) {
            nangluc = (parseNum(totalDGNL) + parseNum(mathDGNL)) / 15;
        } else {
            nangluc = thpt_quydoi * 0.75;
        }

        // Điểm học lực
        const hocLuc = nangluc * 0.70 + thpt_quydoi * 0.20 + tbhoc_quydoi * 0.10;

        // Điểm cộng
        const congThanhTich = pt_thuong;
        let diemCong = 0;
        if (hocLuc + congThanhTich < 100) {
            diemCong = congThanhTich;
        } else {
            diemCong = Math.max(0, 100 - hocLuc);
        }

        // Điểm ưu tiên
        const utu_quydoi = (pt_uuTien30 / 3) * 10;
        let diemUuTien = 0;
        if (hocLuc + diemCong < 75) {
            diemUuTien = utu_quydoi;
        } else {
            diemUuTien = ((100 - (hocLuc + diemCong)) / 25) * utu_quydoi;
            diemUuTien = Math.round(diemUuTien * 100) / 100;
        }

        const diemXetTuyen = hocLuc + diemCong + diemUuTien;

        setResult({
            thptQuyDoi: thpt_quydoi,
            tbHocQuyDoi: tbhoc_quydoi,
            nangLuc: nangluc,
            hocLuc: hocLuc,
            cong: diemCong,
            uuTien: diemUuTien,
            total: diemXetTuyen,
            engUsed: m3_thpt
        });
    };

    return (
        <div className="calculator-container" style={{ animation: 'fadeIn 0.3s ease-out' }}>
            <div className="calculator-header">
                <h2>CÔNG THỨC VÀ THANG ĐIỂM XÉT TUYỂN (ĐẠI HỌC BÁCH KHOA TPHCM)</h2>
                <p>Mô phỏng cơ chế tính điểm tổng hợp theo thang 100 của Bách Khoa.</p>
            </div>

            <div className="calculator-body">
                <div className="calc-card">
                    {/* 1. DGNL Section */}
                    <div className="calc-title-modern">Điểm thi ĐGNL HCM</div>
                    <div className="grid-2-col">
                        <div className="modern-input-group">
                            <label className="modern-label">Toán học</label>
                            <input className="modern-input" type="number" value={mathDGNL} onChange={e => setMathDGNL(e.target.value)} placeholder="0" />
                        </div>
                        <div className="modern-input-group">
                            <label className="modern-label">Tổng điểm</label>
                            <input className="modern-input" type="number" value={totalDGNL} onChange={e => setTotalDGNL(e.target.value)} placeholder="0" />
                        </div>
                    </div>
                    <p className="help-text" style={{ marginBottom: '2rem' }}>* Hệ thống sẽ tính Điểm Năng Lực = (Tổng + Toán) / 15</p>

                    {/* 2. THPT Section */}
                    <div className="calc-title-modern">Điểm thi TN THPT</div>
                    <div className="grid-2-col" style={{ gridTemplateColumns: '1fr 1fr 1fr' }}>
                        <div className="modern-input-group">
                            <label className="modern-label">Toán</label>
                            <input className="modern-input" type="number" value={mathTHPT} onChange={e => setMathTHPT(e.target.value)} placeholder="0" />
                        </div>
                        <div className="modern-input-group">
                            <label className="modern-label">Môn 2</label>
                            <input className="modern-input" type="number" value={sub2THPT} onChange={e => setSub2THPT(e.target.value)} placeholder="0" />
                        </div>
                        <div className="modern-input-group">
                            <label className="modern-label">Môn 3 (Anh)</label>
                            <input className="modern-input" type="number" value={sub3THPT} onChange={e => setSub3THPT(e.target.value)} placeholder="0" />
                        </div>
                    </div>

                    <div className="calc-title-modern">Điểm học bạ THPT (Trung bình 3 năm)</div>
                    <div className="grid-2-col" style={{ gridTemplateColumns: '1fr 1fr 1fr' }}>
                        <div className="modern-input-group">
                            <label className="modern-label">TB Toán</label>
                            <input className="modern-input" type="number" value={mathTB} onChange={e => setMathTB(e.target.value)} placeholder="0" />
                        </div>
                        <div className="modern-input-group">
                            <label className="modern-label">TB Môn 2</label>
                            <input className="modern-input" type="number" value={sub2TB} onChange={e => setSub2TB(e.target.value)} placeholder="0" />
                        </div>
                        <div className="modern-input-group">
                            <label className="modern-label">TB Môn 3</label>
                            <input className="modern-input" type="number" value={sub3TB} onChange={e => setSub3TB(e.target.value)} placeholder="0" />
                        </div>
                    </div>

                    {/* 3. English Certificates */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
                        <div>
                            <div className="calc-title-modern">Điểm IELTS</div>
                            <div className="modern-input-group">
                                <label className="modern-label">Overall</label>
                                <input className="modern-input" type="number" value={ieltsOverall} onChange={e => setIeltsOverall(e.target.value)} placeholder="0" />
                            </div>
                        </div>
                        <div>
                            <div className="calc-title-modern">Điểm TOEIC</div>
                            <div className="modern-input-group">
                                <label className="modern-label">Listening + Reading</label>
                                <input className="modern-input" type="number" value={toeicLR} onChange={e => setToeicLR(e.target.value)} placeholder="0" />
                            </div>
                            <div className="modern-input-group">
                                <label className="modern-label">Speaking + Writing</label>
                                <input className="modern-input" type="number" value={toeicSW} onChange={e => setToeicSW(e.target.value)} placeholder="0" />
                            </div>
                        </div>
                        <div>
                            <div className="calc-title-modern">Điểm TOEFL iBT</div>
                            <div className="modern-input-group">
                                <label className="modern-label">Total</label>
                                <input className="modern-input" type="number" value={toeflTotal} onChange={e => setToeflTotal(e.target.value)} placeholder="0" />
                            </div>
                        </div>
                    </div>

                    {/* 4. Priorities & Achievements */}
                    <div className="calc-title-modern">Diện ưu tiên</div>
                    <div className="grid-2-col">
                        <div className="modern-input-group">
                            <label className="modern-label">Khu vực ưu tiên</label>
                            <select className="modern-select" value={kvPriority} onChange={e => setKvPriority(e.target.value)}>
                                <option value="KV3">Khu vực 3</option>
                                <option value="KV2">Khu vực 2</option>
                                <option value="KV2-NT">Khu vực 2 - NT</option>
                                <option value="KV1">Khu vực 1</option>
                            </select>
                        </div>
                        <div className="modern-input-group">
                            <label className="modern-label">Đối tượng ưu tiên</label>
                            <select className="modern-select" value={dtPriority} onChange={e => setDtPriority(e.target.value)}>
                                <option value="NONE">Không đối tượng</option>
                                <option value="DT1">Đối tượng 01</option>
                                <option value="DT2">Đối tượng 02</option>
                                <option value="DT3">Đối tượng 03</option>
                                <option value="DT4">Đối tượng 04</option>
                                <option value="DT5">Đối tượng 05</option>
                                <option value="DT6">Đối tượng 06</option>
                                <option value="DT7">Đối tượng 07</option>
                            </select>
                        </div>
                    </div>

                    <div className="calc-title-modern">Điểm cộng / Điểm thành tích</div>
                    <div className="modern-input-group" style={{ maxWidth: '400px' }}>
                        <label className="modern-label">Điểm thành tích</label>
                        <input className="modern-input" type="number" value={achievementScore} onChange={e => setAchievementScore(e.target.value)} placeholder="0" />
                    </div>

                    <button className="calculate-btn" onClick={handleCalculate} style={{ marginTop: '3rem' }}>
                        <Calculator size={20} /> Tính Điểm Xét Tuyển Bách Khoa
                    </button>
                </div>

                {result && (
                    <div className="result-card" style={{ animation: 'slideUp 0.3s ease-out' }}>
                        <div className="result-header">
                            <CheckCircle2 color="#2ecc71" size={32} />
                            <h3>KẾT QUẢ ĐIỂM XÉT TUYỂN (BKU)</h3>
                        </div>

                        <div className="result-details">
                            <div className="res-row">
                                <span>Điểm TNTHPT quy đổi (Môn 3 dùng: {result.engUsed}):</span>
                                <strong>{result.thptQuyDoi.toFixed(2)}</strong>
                            </div>
                            <div className="res-row">
                                <span>Điểm học THPT quy đổi:</span>
                                <strong>{result.tbHocQuyDoi.toFixed(2)}</strong>
                            </div>
                            <div className="res-row">
                                <span>Điểm Năng lực:</span>
                                <strong>{result.nangLuc.toFixed(2)}</strong>
                            </div>
                            <div className="res-divider"></div>
                            <div className="res-row main-comp">
                                <span>Điểm Học Lực (Hệ số 70-20-10):</span>
                                <strong>{result.hocLuc.toFixed(2)}</strong>
                            </div>
                            <div className="res-row main-comp">
                                <span>Điểm Cộng thành tích:</span>
                                <strong>{result.cong.toFixed(2)}</strong>
                            </div>
                            <div className="res-row main-comp">
                                <span>Điểm Ưu Tiên thực tế:</span>
                                <strong>{result.uuTien.toFixed(2)}</strong>
                            </div>
                            <div className="res-divider"></div>
                            <div className="res-row final-score">
                                <span>TỔNG ĐIỂM XÉT TUYỂN:</span>
                                <span>{result.total.toFixed(2)} / 100</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BKUCalculator;


import React, { useState } from 'react';
import { Calculator, Info, CheckCircle2 } from 'lucide-react';
import '../../ScoreCalculator.css';

const BKUCalculator = () => {
    const [hasDGNL, setHasDGNL] = useState(true);

    const [mathTHPT, setMathTHPT] = useState('');
    const [sub2THPT, setSub2THPT] = useState('');
    const [sub3THPT, setSub3THPT] = useState('');

    const [mathTB, setMathTB] = useState('');
    const [sub2TB, setSub2TB] = useState('');
    const [sub3TB, setSub3TB] = useState('');

    const [dgnlScore, setDgnlScore] = useState(''); // max 1500

    const [thuong, setThuong] = useState('');
    const [xetThuong, setXetThuong] = useState('');
    const [khuyenKhich, setKhuyenKhich] = useState('');
    const [uuTienThang30, setUuTienThang30] = useState('');

    const [result, setResult] = useState(null);

    const parseNum = (val) => {
        const n = parseFloat(val);
        return isNaN(n) ? 0 : n;
    };

    const handleCalculate = () => {
        const m1_thpt = parseNum(mathTHPT);
        const m2_thpt = parseNum(sub2THPT);
        const m3_thpt = parseNum(sub3THPT);

        const m1_tb = parseNum(mathTB);
        const m2_tb = parseNum(sub2TB);
        const m3_tb = parseNum(sub3TB);

        const pt_thuong = parseNum(thuong);
        const pt_xetThuong = parseNum(xetThuong);
        const pt_khuyenKhich = parseNum(khuyenKhich);
        const pt_uuTien30 = parseNum(uuTienThang30);
        const pt_dgnl = parseNum(dgnlScore);

        // 1. Điểm TNTHPT quy đổi
        const thpt_quydoi = ((m2_thpt + m3_thpt + m1_thpt * 2) / 4) * 10;

        // 2. Điểm học THPT quy đổi
        const tbhoc_quydoi = ((m2_tb + m3_tb + m1_tb * 2) / 4) * 10;

        // 3. Điểm năng lực
        let nangluc = 0;
        if (hasDGNL) {
            nangluc = pt_dgnl / 15;
        } else {
            nangluc = thpt_quydoi * 0.75;
        }

        // Điểm học lực
        const hocLuc = nangluc * 0.70 + thpt_quydoi * 0.20 + tbhoc_quydoi * 0.10;

        // Điểm cộng
        const congThanhTich = pt_thuong + pt_xetThuong + pt_khuyenKhich;
        let diemCong = 0;
        if (hocLuc + congThanhTich < 100) {
            diemCong = congThanhTich;
        } else {
            diemCong = 100 - hocLuc;
        }

        // Điểm ưu tiên
        const utu_quydoi = (pt_uuTien30 / 3) * 10;
        let diemUuTien = 0;
        if (hocLuc + diemCong < 75) {
            diemUuTien = utu_quydoi;
        } else {
            diemUuTien = ((100 - (hocLuc + diemCong)) / 25) * utu_quydoi;
            // Round to 2 decimals as per requirement "làm tròn đến 0,01"
            diemUuTien = Math.round(diemUuTien * 100) / 100;
        }

        // Total
        const diemXetTuyen = hocLuc + diemCong + diemUuTien;

        setResult({
            thptQuyDoi: thpt_quydoi,
            tbHocQuyDoi: tbhoc_quydoi,
            nangLuc: nangluc,
            hocLuc: hocLuc,
            cong: diemCong,
            uuTien: diemUuTien,
            total: diemXetTuyen
        });
    };

    return (
        <div className="calculator-container" style={{ animation: 'fadeIn 0.3s ease-out' }}>
            <div className="calculator-header">
                <h2>CÔNG THỨC VÀ THANG ĐIỂM XÉT TUYỂN (ĐẠI HỌC BÁCH KHOA TPHCM)</h2>
                <p>Công cụ hỗ trợ tính điểm xét tuyển tổng hợp (thang 100) dành cho thí sinh đăng ký phương thức tổng hợp.</p>
            </div>

            <div className="calculator-body">
                <div className="calc-card">
                    <h3>1. Phương thức đăng ký</h3>
                    <div className="radio-group" style={{ marginBottom: '1.5rem', display: 'flex', gap: '2rem' }}>
                        <label className="radio-label">
                            <input type="radio" checked={hasDGNL} onChange={() => setHasDGNL(true)} />
                            <span>Có kết quả thi Đánh giá năng lực ĐHQG-HCM 2026</span>
                        </label>
                        <label className="radio-label">
                            <input type="radio" checked={!hasDGNL} onChange={() => setHasDGNL(false)} />
                            <span>Không thi Đánh giá năng lực ĐHQG-HCM 2026</span>
                        </label>
                    </div>

                    <div className="calc-grid">
                        <div className="calc-section">
                            <h4>Điểm thi tốt nghiệp THPT</h4>
                            <div className="input-group">
                                <label>Môn Toán</label>
                                <input type="number" placeholder="Điểm Toán" value={mathTHPT} onChange={e => setMathTHPT(e.target.value)} />
                            </div>
                            <div className="input-group">
                                <label>Môn thứ 2 (Vật lý, Hóa học...)</label>
                                <input type="number" placeholder="Điểm môn 2" value={sub2THPT} onChange={e => setSub2THPT(e.target.value)} />
                            </div>
                            <div className="input-group">
                                <label>Môn thứ 3 (Tiếng Anh...)</label>
                                <input type="number" placeholder="Điểm môn 3" value={sub3THPT} onChange={e => setSub3THPT(e.target.value)} />
                            </div>
                        </div>

                        <div className="calc-section">
                            <h4>Điểm trung bình học bạ THPT (Lớp 10,11,12)</h4>
                            <div className="input-group">
                                <label>TB Môn Toán</label>
                                <input type="number" placeholder="TB Toán" value={mathTB} onChange={e => setMathTB(e.target.value)} />
                            </div>
                            <div className="input-group">
                                <label>TB Môn thứ 2</label>
                                <input type="number" placeholder="TB Môn 2" value={sub2TB} onChange={e => setSub2TB(e.target.value)} />
                            </div>
                            <div className="input-group">
                                <label>TB Môn thứ 3</label>
                                <input type="number" placeholder="TB Môn 3" value={sub3TB} onChange={e => setSub3TB(e.target.value)} />
                            </div>
                        </div>
                    </div>

                    {hasDGNL && (
                        <div className="calc-section highlight-box">
                            <h4>Điểm Đánh giá năng lực ĐHQG-HCM</h4>
                            <p className="help-text">Nhập điểm ĐGNL có nhân hệ số Toán x 2 (Tối đa 1500)</p>
                            <div className="input-group full-width">
                                <input type="number" placeholder="Điểm ĐGNL (VD: 1050)" value={dgnlScore} onChange={e => setDgnlScore(e.target.value)} />
                            </div>
                        </div>
                    )}

                    <div className="calc-grid" style={{ marginTop: '2rem' }}>
                        <div className="calc-section">
                            <h4>Điểm cộng thành tích</h4>
                            <div className="input-group">
                                <label>Điểm thưởng (Tối đa 10)</label>
                                <input type="number" placeholder="0" value={thuong} onChange={e => setThuong(e.target.value)} />
                            </div>
                            <div className="input-group">
                                <label>Điểm xét thưởng (Tối đa 5)</label>
                                <input type="number" placeholder="0" value={xetThuong} onChange={e => setXetThuong(e.target.value)} />
                            </div>
                            <div className="input-group">
                                <label>Điểm khuyến khích (Tối đa 5)</label>
                                <input type="number" placeholder="0" value={khuyenKhich} onChange={e => setKhuyenKhich(e.target.value)} />
                            </div>
                        </div>

                        <div className="calc-section">
                            <h4>Điểm ưu tiên khu vực / đối tượng</h4>
                            <p className="help-text" style={{ marginBottom: '1rem' }}>Sử dụng điểm quy định chung thang 30 (VD: 0.75, 1.25, 2.75...)</p>
                            <div className="input-group">
                                <label>Tổng điểm ưu tiên (Theo thang 30)</label>
                                <input type="number" placeholder="VD: 0.75" value={uuTienThang30} onChange={e => setUuTienThang30(e.target.value)} />
                            </div>

                            <div className="cert-guide">
                                <h5><Info size={16} /> Quy đổi Chứng chỉ Tiếng Anh</h5>
                                <ul style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                    <li>IELTS ≥ 8.0 = 10đ</li>
                                    <li>IELTS 7.5 = 9.5đ</li>
                                    <li>IELTS 7.0 = 9.0đ</li>
                                    <li>IELTS 6.5 = 8.5đ</li>
                                    <li>IELTS 6.0 = 8.0đ</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <button className="calculate-btn" onClick={handleCalculate}>
                        <Calculator size={20} /> Tính Điểm Xét Tuyển
                    </button>
                </div>

                {result && (
                    <div className="result-card" style={{ animation: 'slideUp 0.3s ease-out' }}>
                        <div className="result-header">
                            <CheckCircle2 color="#2ecc71" size={32} />
                            <h3>KẾT QUẢ ĐIỂM XÉT TUYỂN</h3>
                        </div>

                        <div className="result-details">
                            <div className="res-row">
                                <span>Điểm TNTHPT quy đổi:</span>
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
                                <span>Điểm Học Lực (70% - 20% - 10%):</span>
                                <strong>{result.hocLuc.toFixed(2)}</strong>
                            </div>
                            <div className="res-row main-comp">
                                <span>Điểm Cộng:</span>
                                <strong>{result.cong.toFixed(2)}</strong>
                            </div>
                            <div className="res-row main-comp">
                                <span>Điểm Ưu Tiên:</span>
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

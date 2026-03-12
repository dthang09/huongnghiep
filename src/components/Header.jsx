import React from 'react';
import { Home } from 'lucide-react';

const Header = () => {
    return (
        <header>
            <div className="top-nav">
                <div className="logo-area">
                    <div className="logo-icon">
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                        </svg>
                    </div>
                    <div className="logo-text">
                        <span>Hướng nghiệp</span>
                        <span>HOCMAI</span>
                    </div>
                </div>

                <div className="top-pills">
                    <button className="pill-button">Tính điểm học bạ</button>
                    <button className="pill-button" style={{ backgroundColor: 'var(--primary)', color: 'white' }}>Điểm chuẩn</button>
                    <button className="pill-button">Đề án tuyển sinh</button>
                    <button className="pill-button">Tổ hợp môn</button>
                </div>
            </div>

            <nav className="main-nav">
                <ul className="nav-links">
                    <li className="nav-link">TRANG CHỦ</li>
                    <li className="nav-link">TRA CỨU THỨ HẠNG</li>
                    <li className="nav-link">QUY ĐỔI ĐIỂM THI</li>
                    <li className="nav-link">TRA CỨU ĐIỂM THPT</li>
                    <li className="nav-link active">XEM THÊM ▼</li>
                </ul>
            </nav>
        </header>
    );
};

export default Header;

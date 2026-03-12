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
                        <span>DTHANG</span>
                    </div>
                </div>

                <div className="top-pills">
                    {/* Removed pill buttons as requested */}
                </div>
            </div>

            <nav className="main-nav">
                <ul className="nav-links">
                    <li className="nav-link">TÍNH ĐIỂM XÉT TUYỂN</li>
                    <li className="nav-link active">TRA CỨU ĐIỂM CHUẨN</li>
                </ul>
            </nav>
        </header>
    );
};

export default Header;

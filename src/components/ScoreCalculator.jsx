import React, { useState } from 'react';
import BKUCalculator from './calculators/BKUCalculator';
import HCMUSCalculator from './calculators/HCMUSCalculator';
import { Building2 } from 'lucide-react';
import '../ScoreCalculator.css';

const ScoreCalculator = () => {
    const [selectedSchool, setSelectedSchool] = useState('bku'); // 'bku' or 'hcmus'

    return (
        <div style={{ animation: 'fadeIn 0.3s ease-out' }}>
            <div className="school-selector-container">
                <div className="school-selector-box">
                    <div className="school-icon-wrapper">
                        <Building2 size={24} color="var(--primary)" />
                    </div>
                    <div className="school-select-wrapper">
                        <label className="school-select-label">
                            CHỌN TRƯỜNG ĐỂ TÍNH ĐIỂM XÉT TUYỂN
                        </label>
                        <select
                            value={selectedSchool}
                            onChange={(e) => setSelectedSchool(e.target.value)}
                            className="school-select-input"
                        >
                            <option value="bku">Đại học Bách Khoa TPHCM (Mới nhất)</option>
                            <option value="hcmus">Đại học Khoa học Tự nhiên TPHCM (PT2)</option>
                        </select>
                    </div>
                </div>
            </div>

            {selectedSchool === 'bku' && <BKUCalculator />}
            {selectedSchool === 'hcmus' && <HCMUSCalculator />}
        </div>
    );
};

export default ScoreCalculator;

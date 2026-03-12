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
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', justifyContent: 'center', marginBottom: '1.5rem', backgroundColor: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
                    <div style={{ width: '48px', height: '48px', backgroundColor: 'var(--secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%' }}>
                        <Building2 size={24} color="var(--primary)" />
                    </div>
                    <div style={{ flex: 1, maxWidth: '400px' }}>
                        <label style={{ display: 'block', fontSize: '1rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.5rem' }}>
                            CHỌN TRƯỜNG ĐỂ TÍNH ĐIỂM XÉT TUYỂN
                        </label>
                        <select
                            value={selectedSchool}
                            onChange={(e) => setSelectedSchool(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                border: '2px solid var(--border-light)',
                                borderRadius: '8px',
                                fontSize: '1.1rem',
                                color: 'var(--primary)',
                                fontWeight: 'bold',
                                outline: 'none'
                            }}
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

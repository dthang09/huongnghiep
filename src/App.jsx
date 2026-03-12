import React, { useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import SearchTabs from './components/SearchTabs';
import SchoolSearch from './components/SchoolSearch';
import SchoolDetail from './components/SchoolDetail';
import MajorSearch from './components/MajorSearch';
import MajorDetail from './components/MajorDetail';
import './index.css';

function App() {
  const [activeTab, setActiveTab] = useState('truong');
  const [selectedSchool, setSelectedSchool] = useState(null);
  const [selectedMajorGroup, setSelectedMajorGroup] = useState(null);

  return (
    <div className="app">
      <Header />

      <main className="container">
        {selectedSchool ? (
          <div className="search-container detail-view-container">
            <SchoolDetail schoolCode={selectedSchool} onBack={() => setSelectedSchool(null)} />
          </div>
        ) : selectedMajorGroup ? (
          <div className="search-container detail-view-container">
            <MajorDetail majorGroup={selectedMajorGroup} onBack={() => setSelectedMajorGroup(null)} />
          </div>
        ) : (
          <>
            <Hero />
            <div className="search-container">
              <SearchTabs activeTab={activeTab} setActiveTab={setActiveTab} />
              {activeTab === 'truong' && <SchoolSearch onSelectSchool={setSelectedSchool} />}
              {activeTab === 'nganh' && <MajorSearch onSelectMajorGroup={setSelectedMajorGroup} />}
              {activeTab === 'diem' && (
                <div className="tab-content" style={{ textAlign: 'center', padding: '4rem' }}>
                  <h2>Tính năng Tìm theo điểm đang được cập nhật.</h2>
                </div>
              )}
              {activeTab === 'hocphi' && (
                <div className="tab-content" style={{ textAlign: 'center', padding: '4rem' }}>
                  <h2>Tính năng Tìm theo học phí đang được cập nhật.</h2>
                </div>
              )}
            </div>
          </>
        )}
      </main>
    </div >
  );
}

export default App;

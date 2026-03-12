import React, { useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import SearchTabs from './components/SearchTabs';
import SchoolSearch from './components/SchoolSearch';
import SchoolDetail from './components/SchoolDetail';
import './index.css';

function App() {
  const [activeTab, setActiveTab] = useState('truong');
  const [selectedSchool, setSelectedSchool] = useState(null);

  return (
    <div className="app">
      <Header />

      <main className="container">
        {selectedSchool ? (
          <div className="search-container detail-view-container">
            <SchoolDetail schoolCode={selectedSchool} onBack={() => setSelectedSchool(null)} />
          </div>
        ) : (
          <>
            <Hero />
            <div className="search-container">
              <SearchTabs activeTab={activeTab} setActiveTab={setActiveTab} />
              {activeTab === 'truong' && <SchoolSearch onSelectSchool={setSelectedSchool} />}
              {activeTab === 'nganh' && (
                <div className="tab-content" style={{ textAlign: 'center', padding: '4rem' }}>
                  <h2>Tính năng Tìm ngành đang được cập nhật.</h2>
                </div>
              )}
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

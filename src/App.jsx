import React, { useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import SearchTabs from './components/SearchTabs';
import SchoolSearch from './components/SchoolSearch';
import './index.css';

function App() {
  const [activeTab, setActiveTab] = useState('truong');

  return (
    <div className="app">
      <Header />

      <main className="container">
        <Hero />

        <div className="search-container">
          <SearchTabs activeTab={activeTab} setActiveTab={setActiveTab} />

          {/* We only fully implemented the "Tìm trường" tab based on the prompt's image */}
          {activeTab === 'truong' && <SchoolSearch />}
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
      </main>
    </div>
  );
}

export default App;

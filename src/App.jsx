import React, { useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import SearchTabs from './components/SearchTabs';
import SchoolSearch from './components/SchoolSearch';
import SchoolDetail from './components/SchoolDetail';
import MajorSearch from './components/MajorSearch';
import MajorDetail from './components/MajorDetail';
import ScoreSearch from './components/ScoreSearch';
import ScoreCalculator from './components/ScoreCalculator';
import AdmissionPlan from './components/AdmissionPlan';
import CareerConsultant from './components/CareerConsultant';

import './index.css';

function App() {
  const [currentView, setCurrentView] = useState('search'); // 'search' or 'calculator'
  const [activeTab, setActiveTab] = useState('truong');
  const [selectedSchool, setSelectedSchool] = useState(null);
  const [selectedMajorGroup, setSelectedMajorGroup] = useState(null);

  return (
    <div className="app">
      <Header currentView={currentView} setCurrentView={setCurrentView} />

      <main className="container">
        {currentView === 'calculator' ? (
          <ScoreCalculator />
        ) : currentView === 'dean' ? (
          <AdmissionPlan />
        ) : currentView === 'consultant' ? (
          <CareerConsultant />
        ) : selectedSchool ? (
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
              {activeTab === 'diem' && <ScoreSearch onSelectMajorGroup={setSelectedMajorGroup} />}
            </div>
          </>
        )}
      </main>
    </div >
  );
}

export default App;

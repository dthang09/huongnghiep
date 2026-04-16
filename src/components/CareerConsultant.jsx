import React, { useState, useEffect } from 'react';
import { 
    ChevronRight, 
    ChevronLeft, 
    Sparkles, 
    CheckCircle2, 
    RotateCcw, 
    Briefcase,
    Search,
    BrainCircuit,
    Cpu,
    Microscope,
    HeartPulse,
    LineChart,
    ShieldCheck,
    Loader2,
    CheckCircle,
    UserCircle,
    Lightbulb,
    GraduationCap,
    Send
} from 'lucide-react';
import { majorGroups } from '../data/majorGroups';
import { phase1Questions, phase2Data } from '../data/consultantData';
import { analyzeCareer } from '../services/gemini';
import './CareerConsultant.css';

const CareerConsultant = () => {
    const [currentStep, setCurrentStep] = useState(0);
    const [answers, setAnswers] = useState({});
    const [results, setResults] = useState(null);
    const [aiAnalysis, setAiAnalysis] = useState(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    
    const [phase, setPhase] = useState(1); 
    const [detectedGroupId, setDetectedGroupId] = useState(null);
    const [activeQuestions, setActiveQuestions] = useState(phase1Questions);

    const handleAnswer = (value) => {
        const q = activeQuestions[currentStep];
        if (q.type === 'multiple') {
            const currentAnswers = answers[q.id] || [];
            let newAnswers;
            
            if (currentAnswers.includes(value)) {
                newAnswers = currentAnswers.filter(v => v !== value);
            } else {
                if (q.maxChoices && currentAnswers.length >= q.maxChoices) {
                    alert(`Bạn chỉ được chọn tối đa ${q.maxChoices} lựa chọn.`);
                    return;
                }
                newAnswers = [...currentAnswers, value];
            }
            
            setAnswers({ ...answers, [q.id]: newAnswers });
        } else if (q.type === 'text') {
            setAnswers({ ...answers, [q.id]: value });
        } else {
            setAnswers({ ...answers, [q.id]: value });
        }
    };

    const nextStep = () => {
        if (phase === 1 && currentStep === 4) {
            // Transition to Phase 2
            const groupId = detectGroup();
            setDetectedGroupId(groupId);
            
            let nextQuestions = phase2Data[groupId];
            if (!nextQuestions) {
                // Fallback to closest available data
                if (groupId.includes('eng') || groupId === 'group-54' || groupId === 'group-58') nextQuestions = phase2Data['group-engineering'];
                else if (groupId === 'group-72' || groupId === 'group-42' || groupId === 'group-64') nextQuestions = phase2Data['group-72'];
                else if (groupId === 'group-48' || groupId === 'group-46') nextQuestions = phase2Data['group-48'];
                else nextQuestions = phase2Data['group-34']; 
            }

            setActiveQuestions(nextQuestions);
            setPhase(2);
            setCurrentStep(0);
            window.scrollTo(0, 0);
        } else if (currentStep < activeQuestions.length - 1) {
            setCurrentStep(currentStep + 1);
            window.scrollTo(0, 0);
        } else if (phase === 2 && currentStep === activeQuestions.length - 1) {
            triggerAIAnalysis();
        }
    };

    const triggerAIAnalysis = async () => {
        setIsAnalyzing(true);
        window.scrollTo(0, 0);

        try {
            // Prepare data for AI
            const formattedData = {
                phase1: phase1Questions.map(q => {
                    const standardAnswers = Array.isArray(answers[q.id]) 
                        ? answers[q.id].map(val => q.options?.find(o => o.value === val)?.label || val)
                        : (q.options?.find(o => o.value === answers[q.id])?.label || answers[q.id]);
                    const otherAnswer = answers[q.id + '_other'];
                    return {
                        question: q.title,
                        answer: otherAnswer ? (standardAnswers ? [...(Array.isArray(standardAnswers) ? standardAnswers : [standardAnswers]), `Lựa chọn khác: ${otherAnswer}`] : `Lựa chọn khác: ${otherAnswer}`) : standardAnswers
                    };
                }),
                phase2: activeQuestions.map(q => {
                    const standardAnswer = q.options?.find(o => o.value === answers[q.id])?.label || answers[q.id];
                    const otherAnswer = answers[q.id + '_other'];
                    return {
                        question: q.title,
                        answer: otherAnswer ? (standardAnswer ? `${standardAnswer} (Kèm theo ý kiến khác: ${otherAnswer})` : `Lựa chọn khác: ${otherAnswer}`) : standardAnswer
                    };
                })
            };

            const response = await analyzeCareer(formattedData);
            setAiAnalysis(response);
            setResults(response.recommendations);
        } catch (error) {
            console.error("Analysis failed:", error);
            // Fallback to local logic if AI fails
            calculateFinalResultsLocal();
        } finally {
            setIsAnalyzing(false);
        }
    };

    const calculateFinalResultsLocal = () => {
        const majorScores = {};
        const group = majorGroups.find(g => g.id === detectedGroupId);
        group.majors.forEach(m => majorScores[m.name] = 0);

        activeQuestions.forEach(q => {
            const val = answers[q.id];
            if (!val) return;
            const option = q.options?.find(o => o.value === val);
            if (option?.weight) {
                Object.entries(option.weight).forEach(([majorName, w]) => {
                    if (majorScores[majorName] !== undefined) majorScores[majorName] += w;
                });
            }
        });

        const finalResults = group.majors.map(m => ({
            majorName: m.name,
            groupName: group.name,
            fitScore: 70 + (majorScores[m.name] || 0),
            reason: "Kết quả được tính toán dựa trên sự tương đồng giữa tố chất hành vi và đặc thù của ngành học.",
            path: "Tìm hiểu thêm các trường đại học đào tạo ngành này trong mục 'Tra cứu điểm'."
        }))
        .sort((a, b) => b.fitScore - a.fitScore)
        .slice(0, 5);

        setResults(finalResults);
        setAiAnalysis({
            summary: "Dựa trên các chỉ số tâm lý và phong cách làm việc của bạn, hệ thống nhận thấy bạn có tiềm năng lớn trong các lĩnh vực yêu cầu sự tư duy kết hợp thực tiễn.",
            advice: "Hãy tiếp tục trau dồi các kỹ năng mềm và tìm hiểu sâu hơn về thị trường lao động của các ngành được gợi ý."
        });
    };

    const prevStep = () => {
        if (phase === 2 && currentStep === 0) {
            setPhase(1);
            setActiveQuestions(phase1Questions);
            setCurrentStep(4);
        } else if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
        window.scrollTo(0, 0);
    };

    const detectGroup = () => {
        const scores = {};
        majorGroups.forEach(g => scores[g.id] = 0);

        phase1Questions.forEach(q => {
            const answerData = answers[q.id];
            if (!answerData || q.type === 'text') return;
            
            const vals = Array.isArray(answerData) ? answerData : [answerData];
            vals.forEach(val => {
                const option = q.options?.find(o => o.value === val);
                if (option?.weight) {
                    Object.entries(option.weight).forEach(([gid, w]) => {
                        if (scores[gid] !== undefined) scores[gid] += w;
                    });
                }
            });
        });

        return Object.entries(scores).sort((a, b) => b[1] - a[1])[0][0];
    };

    const isStepValid = () => {
        const q = activeQuestions[currentStep];
        const answer = answers[q.id];
        const otherAnswer = answers[q.id + '_other'];
        
        if (q.type === 'text') return answer?.length > 10;
        
        const hasStandard = Array.isArray(answer) ? answer.length >= 1 : !!answer;
        const hasOther = !!otherAnswer && otherAnswer.trim().length > 0;
        
        return hasStandard || hasOther;
    };

    if (isAnalyzing) {
        return (
            <div className="career-consultant-loading">
                <div className="loading-card">
                    <div className="loading-animation">
                        <BrainCircuit className="pulse-icon" size={64} />
                        <div className="sparkle-circles">
                            <span className="dot"></span>
                            <span className="dot"></span>
                            <span className="dot"></span>
                        </div>
                    </div>
                    <h2>Chờ chút nha, đang tìm ngành phù hợp nhất cho bạn</h2>
                    <p>Hệ thống đang đối chiếu hồ sơ của bạn với hàng ngàn dữ liệu nghề nghiệp để đưa ra phân tích chính xác nhất.</p>
                    <div className="loading-steps">
                        <div className="l-step"><Loader2 size={16} className="spin" /> Phân tích tính cách & tố chất...</div>
                        <div className="l-step"><Loader2 size={16} className="spin" /> Đang lọc danh sách ngành phù hợp...</div>
                        <div className="l-step"><Loader2 size={16} className="spin" /> Đang soạn lời khuyên dành cho bạn...</div>
                    </div>
                </div>
            </div>
        );
    }

    if (results && aiAnalysis) {
        return (
            <div className="career-results-container ai-version">
                <div className="results-header">
                    <h2>PHÂN TÍCH HƯỚNG NGHIỆP DÀNH RIÊNG CHO BẠN</h2>
                    
                    <div className="ai-summary-card">
                        <UserCircle className="summary-icon" size={24} />
                        <div>
                            <h4>Nhận diện tố chất của bạn:</h4>
                            <p>{aiAnalysis.summary}</p>
                        </div>
                    </div>
                </div>

                <div className="results-list">
                    {results.map((item, index) => (
                        <div key={index} className={`result-card ai-card rank-${index + 1}`}>
                            <div className="rank-badge">Khuyến nghị {index + 1}</div>
                            <div className="ai-card-content">
                                <div className="header-row">
                                    <div className="title-group">
                                        <div className="group-tag">{item.groupName}</div>
                                        <h3>{item.majorName}</h3>
                                    </div>
                                    <div className="fit-percentage">
                                        <div className="percent">{item.fitScore}%</div>
                                        <div className="label">Độ tương thích</div>
                                    </div>
                                </div>

                                <div className="ai-insight">
                                    <Lightbulb className="insight-icon" size={18} />
                                    <p><strong>Lý do phù hợp:</strong> {item.reason}</p>
                                </div>
                                
                                <div className="pathway-info">
                                    <GraduationCap className="path-icon" size={18} />
                                    <p><strong>Lộ trình đề xuất:</strong> {item.path}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="ai-advice-section">
                    <h3><HeartPulse className="advice-icon" /> Lời khuyên dành riêng cho bạn</h3>
                    <p className="advice-text">{aiAnalysis.advice}</p>
                </div>

                <div className="results-footer">
                    <button className="restart-btn" onClick={() => window.location.reload()}>
                        <RotateCcw size={18} /> Làm lại bài tư vấn mới
                    </button>
                    <p className="ai-disclaimer">* Kết quả mang tính chất tham khảo, hãy lắng nghe trái tim và thực tế bản thân.</p>
                </div>
            </div>
        );
    }

    const currentQuestion = activeQuestions[currentStep];

    return (
        <div className="career-consultant-container">
            <div className="consultant-card">
                <div className="progress-container">
                    <div className="progress-bar">
                        <div className="progress-segments">
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map(s => (
                                <div key={s} className={`segment ${ (phase === 1 ? currentStep + 1 : currentStep + 6) >= s ? 'active' : '' }`}></div>
                            ))}
                        </div>
                    </div>
                    <div className="step-info">
                        Tiến trình: <strong>{(phase === 1 ? currentStep + 1 : currentStep + 6)} / 15</strong>
                    </div>
                </div>

                <div className="question-section">
                    <div className="phase-indicator">
                        {phase === 1 ? 'Bước 1: Khám phá tố chất cơ bản' : 'Bước 2: Phân tích hành vi định hướng'}
                    </div>
                    <h2>{currentQuestion.title}</h2>
                    
                    {currentQuestion.type === 'text' ? (
                        <div className="text-answer-area">
                            <textarea 
                                placeholder={currentQuestion.placeholder}
                                value={answers[currentQuestion.id] || ''}
                                onChange={(e) => handleAnswer(e.target.value)}
                                className="custom-textarea"
                            />
                            <p className="char-count">Vui lòng nhập ít nhất 10 ký tự để hệ thống có đủ dữ liệu phân tích.</p>
                        </div>
                    ) : (
                        <div className={`options-grid ${currentQuestion.options.length > 8 ? 'large-grid' : ''}`}>
                            {currentQuestion.options.map((option) => (
                                <div 
                                    key={option.value}
                                    className={`option-item ${
                                        currentQuestion.type === 'multiple'
                                            ? answers[currentQuestion.id]?.includes(option.value) ? 'selected' : ''
                                            : answers[currentQuestion.id] === option.value ? 'selected' : ''
                                    }`}
                                    onClick={() => handleAnswer(option.value)}
                                >
                                    <div className="checkbox">
                                        { (currentQuestion.type === 'multiple' 
                                            ? answers[currentQuestion.id]?.includes(option.value) 
                                            : answers[currentQuestion.id] === option.value) && <CheckCircle size={16} /> }
                                    </div>
                                    <span className="option-label">{option.label}</span>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="other-answer-option">
                        <div 
                            className={`option-item other-style ${answers[currentQuestion.id + '_other'] ? 'selected' : ''}`}
                            onClick={() => document.getElementById(`other-${currentQuestion.id}`).focus()}
                        >
                            <div className="checkbox">
                                { answers[currentQuestion.id + '_other']?.length > 0 && <CheckCircle size={16} /> }
                            </div>
                            <div className="other-input-group">
                                <span className="other-label">Câu trả lời khác của bạn:</span>
                                <input 
                                    id={`other-${currentQuestion.id}`}
                                    type="text" 
                                    placeholder="Nhập nội dung tại đây..."
                                    value={answers[currentQuestion.id + '_other'] || ''}
                                    onChange={(e) => setAnswers({ ...answers, [currentQuestion.id + '_other']: e.target.value })}
                                    className="other-input-field"
                                    onClick={(e) => e.stopPropagation()}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="navigation-buttons">
                        <button 
                            className="nav-btn prev" 
                            onClick={prevStep}
                            disabled={phase === 1 && currentStep === 0}
                        >
                            <ChevronLeft size={20} /> Quay lại
                        </button>
                        <button 
                            className={`nav-btn next ${ (phase === 2 && currentStep === activeQuestions.length - 1) ? 'submit' : ''}`} 
                            onClick={nextStep}
                            disabled={!isStepValid()}
                        >
                            {phase === 1 ? (
                                currentStep === 4 ? <>Tiếp tục bước 2 <ChevronRight size={20} /></> : <>Tiếp theo <ChevronRight size={20} /></>
                            ) : (
                                currentStep === activeQuestions.length - 1 ? <>Tư vấn <Send size={18} /></> : <>Tiếp theo <ChevronRight size={18} /></>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CareerConsultant;

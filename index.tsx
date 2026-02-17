/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import { GoogleGenAI } from '@google/genai';
import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { 
    DashboardIcon, InboxIcon, ControlsIcon, RunsIcon, 
    CasesIcon, ReportsIcon, SettingsIcon, BellIcon, 
    SearchIcon, SparklesIcon, FilterIcon, UploadIcon,
    CheckCircleIcon, XCircleIcon, AlertTriangleIcon,
    ChevronRightIcon, FileIcon, ThinkingIcon, ShieldIcon,
    ActivityIcon, UserGroupIcon
} from './components/Icons';
import SideDrawer from './components/SideDrawer';
import { MOCK_CONTROLS, MOCK_EVIDENCE, MOCK_RUNS, MOCK_CASES } from './constants';
import { Control, EvidenceItem, Run, AIAnalysisResult, Case } from './types';

// --- Components ---

function NavItem({ icon: Icon, label, active, onClick }: { icon: any, label: string, active: boolean, onClick: () => void }) {
    return (
        <div className={`nav-item ${active ? 'active' : ''}`} onClick={onClick}>
            <Icon />
            <span>{label}</span>
        </div>
    );
}

function StatCard({ label, value, trend, trendType, icon: Icon, color }: { label: string, value: string | number, trend: string, trendType: 'positive' | 'negative', icon: any, color: string }) {
    return (
        <div className="kpi-card">
            <div className="kpi-icon-wrapper" style={{ background: color + '20', color: color }}>
                <Icon />
            </div>
            <div className="kpi-label">{label}</div>
            <div className="kpi-value">{value}</div>
            <div className={`kpi-trend trend-${trendType}`}>{trend}</div>
        </div>
    );
}

function RiskTrendChart() {
    return (
        <div style={{ height: '200px', display: 'flex', alignItems: 'flex-end', gap: '8px', padding: '0 20px 20px 20px' }}>
             <svg width="100%" height="100%" viewBox="0 0 500 150" overflow="visible">
                 <defs>
                    <linearGradient id="gradientLine" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#4F46E5" stopOpacity="0.2"/>
                        <stop offset="100%" stopColor="#4F46E5" stopOpacity="0"/>
                    </linearGradient>
                 </defs>
                 <path d="M0,100 Q50,90 100,80 T200,60 T300,90 T400,40 T500,20" fill="none" stroke="#4F46E5" strokeWidth="4" className="chart-line" strokeLinecap="round"/>
                 <path d="M0,100 Q50,90 100,80 T200,60 T300,90 T400,40 T500,20 V150 H0 Z" fill="url(#gradientLine)" stroke="none" style={{opacity: 0.5}} />
                 
                 <circle cx="0" cy="100" r="6" fill="#1E293B" stroke="#4F46E5" strokeWidth="3" />
                 <circle cx="100" cy="80" r="6" fill="#1E293B" stroke="#4F46E5" strokeWidth="3" />
                 <circle cx="200" cy="60" r="6" fill="#1E293B" stroke="#4F46E5" strokeWidth="3" />
                 <circle cx="300" cy="90" r="6" fill="#1E293B" stroke="#4F46E5" strokeWidth="3" />
                 <circle cx="400" cy="40" r="6" fill="#1E293B" stroke="#4F46E5" strokeWidth="3" />
                 <circle cx="500" cy="20" r="6" fill="#1E293B" stroke="#4F46E5" strokeWidth="3" />
                 
                 <line x1="0" y1="150" x2="500" y2="150" stroke="#334155" strokeWidth="1" strokeDasharray="5,5" />
                 <line x1="0" y1="0" x2="0" y2="150" stroke="#334155" strokeWidth="1" strokeDasharray="5,5" />
             </svg>
        </div>
    );
}

function VerdictsChart() {
    const bars = [
        { label: 'IAM', pass: 60, fail: 40 },
        { label: 'Network', pass: 80, fail: 20 },
        { label: 'Cloud', pass: 50, fail: 50 },
        { label: 'Endpoint', pass: 90, fail: 10 },
        { label: 'Vuln', pass: 75, fail: 25 },
    ];
    
    return (
        <div style={{ padding: '20px', display: 'flex', justifyContent: 'space-around', alignItems: 'flex-end', height: '200px' }}>
            {bars.map((bar, i) => (
                <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '40px', height: '160px', display: 'flex', flexDirection: 'column-reverse', borderRadius: '8px', overflow: 'hidden', background: '#334155' }}>
                        <div style={{ height: `${bar.pass}%`, background: '#10B981', boxShadow: '0 0 10px rgba(16, 185, 129, 0.3)' }} className="chart-bar" title={`PASS: ${bar.pass}%`}></div>
                        <div style={{ height: `${bar.fail}%`, background: '#EF4444', opacity: 0.9, boxShadow: '0 0 10px rgba(239, 68, 68, 0.3)' }} className="chart-bar" title={`FAIL: ${bar.fail}%`}></div>
                    </div>
                    <span style={{ fontSize: '0.75rem', color: '#94A3B8', fontWeight: 600 }}>{bar.label}</span>
                </div>
            ))}
        </div>
    );
}

function AISummaryBox({ loading, summary, onGenerate }: { loading: boolean, summary: string | null, onGenerate: () => void }) {
    if (!summary && !loading) {
        return (
            <div className="ai-summary-box" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px', minHeight: '160px', cursor: 'pointer' }} onClick={onGenerate}>
                <div style={{ color: '#818CF8', background: 'rgba(99, 102, 241, 0.15)', padding: '12px', borderRadius: '50%' }}><SparklesIcon /></div>
                <div style={{ textAlign: 'center' }}>
                    <p style={{ margin: '0 0 4px 0', color: '#F8FAFC', fontWeight: 600 }}>Get Cyber Posture Report</p>
                    <p style={{ margin: 0, color: '#94A3B8', fontSize: '0.9rem' }}>Analyze 9 controls across IAM, Network, and Cloud</p>
                </div>
                <button className="btn btn-primary btn-sm">
                    Generate Summary
                </button>
            </div>
        );
    }

    return (
        <div className="ai-summary-box animate-fade-in">
            <div className="ai-header">
                <SparklesIcon />
                <span>AI Cyber Assistant</span>
                {loading && <ThinkingIcon />}
            </div>
            {loading ? (
                <div className="ai-content">
                    <p>Analyzing Cloud and Network configurations for vulnerabilities...</p>
                    <div style={{ width: '100%', height: '4px', background: '#334155', borderRadius: '2px', overflow: 'hidden', marginTop: '12px' }}>
                        <div style={{ width: '60%', height: '100%', background: '#6366F1', borderRadius: '2px', animation: 'dash 1.5s infinite ease-in-out' }}></div>
                    </div>
                </div>
            ) : (
                 <div className="ai-content" dangerouslySetInnerHTML={{ __html: summary || '' }} />
            )}
        </div>
    );
}

// --- Views ---

function DashboardView({ onSelectRun }: { onSelectRun: (id: string) => void }) {
    const [summary, setSummary] = useState<string | null>(null);
    const [loadingSummary, setLoadingSummary] = useState(false);

    const generateSummary = async () => {
        setLoadingSummary(true);
        try {
            const apiKey = process.env.API_KEY;
            if (apiKey) {
                const ai = new GoogleGenAI({ apiKey });
                const prompt = "Act as a Cyber Security Auditor. Summarize this risk posture: 73/100 Risk Score. Critical failures in Firewall Rules (NET-01) and S3 Permissions (CLOUD-01). IAM looks stable. Suggest immediate remediation for ANY/ANY rules.";
                const response = await ai.models.generateContent({
                    model: 'gemini-3-flash-preview',
                    contents: { parts: [{ text: prompt }], role: 'user' }
                });
                setSummary(response.text || "Summary unavailable.");
            } else {
                setTimeout(() => setSummary("<ul><li><strong>Critical Risk:</strong> 'ANY ANY' Allow rules detected in NET-01 (Firewall). Immediate remediation required.</li><li><strong>Cloud Exposure:</strong> Public S3 bucket permissions found in CLOUD-01.</li><li><strong>Trend:</strong> IAM controls are stable, but Network and Cloud domains show regression.</li></ul>"), 1500);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoadingSummary(false);
        }
    };

    return (
        <div className="page-content animate-fade-in">
            <div className="page-title-section">
                <h1>Cyber Posture Overview</h1>
                <p>Real-time audit status across your infrastructure.</p>
            </div>

            <div className="dashboard-kpi-grid">
                <StatCard 
                    label="Overall Cyber Risk" 
                    value="73" 
                    trend="+12%" 
                    trendType="negative" 
                    icon={ShieldIcon} 
                    color="#EF4444" 
                />
                <StatCard 
                    label="Controls Tested" 
                    value="12" 
                    trend="This Week" 
                    trendType="positive" 
                    icon={ActivityIcon} 
                    color="#10B981" 
                />
                <StatCard 
                    label="Open Exceptions" 
                    value="4" 
                    trend="Requires Action" 
                    trendType="negative" 
                    icon={AlertTriangleIcon} 
                    color="#F59E0B" 
                />
                <StatCard 
                    label="Evidence Missing" 
                    value="3" 
                    trend="Pending" 
                    trendType="negative" 
                    icon={FileIcon} 
                    color="#6366F1" 
                />
            </div>

            <div className="content-grid-2-1">
                <div className="section-card">
                     <div className="card-header">
                         <div className="card-title">Risk Trend (6 Months)</div>
                     </div>
                     <div className="card-body">
                         <RiskTrendChart />
                     </div>
                </div>
                <div className="section-card">
                     <div className="card-header">
                         <div className="card-title">Failures by Domain</div>
                     </div>
                     <div className="card-body">
                         <VerdictsChart />
                     </div>
                </div>
            </div>

            <div className="content-grid-2-1">
                 <div className="section-card">
                     <div className="card-header">
                         <div className="card-title"><RunsIcon /> Recent Runs</div>
                         <button className="btn btn-ghost btn-sm">View All</button>
                     </div>
                     <table className="data-table">
                         <thead>
                             <tr>
                                 <th>Run ID</th>
                                 <th>Control</th>
                                 <th>Period</th>
                                 <th>Verdict</th>
                                 <th>Risk</th>
                                 <th>Owner</th>
                             </tr>
                         </thead>
                         <tbody>
                             {MOCK_RUNS.map(run => (
                                 <tr key={run.id} onClick={() => onSelectRun(run.id)} style={{ cursor: 'pointer' }}>
                                     <td style={{ fontFamily: 'var(--font-mono)', color: '#94A3B8' }}>{run.id}</td>
                                     <td style={{ fontWeight: 500 }}>{run.controlName}</td>
                                     <td>{run.period}</td>
                                     <td><span className={`status-badge ${run.verdict === 'PASS' ? 'status-pass' : 'status-fail'}`}>{run.verdict}</span></td>
                                     <td style={{ fontWeight: 600 }}>{run.risk}</td>
                                     <td>
                                         <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                             <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#334155', color: '#94A3B8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 600 }}>{run.owner.charAt(0)}</div>
                                             {run.owner}
                                         </div>
                                     </td>
                                 </tr>
                             ))}
                         </tbody>
                     </table>
                 </div>

                 <div className="section-card">
                     <div className="card-header">
                         <div className="card-title">AI Assistant</div>
                     </div>
                     <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                         <AISummaryBox loading={loadingSummary} summary={summary} onGenerate={generateSummary} />
                         <button className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center' }}>
                            <FileIcon /> Generate Weekly Report
                         </button>
                     </div>
                 </div>
            </div>
        </div>
    );
}

function EvidenceInboxView({ onRunTest }: { onRunTest: (controlId: string) => void }) {
    const [selectedFile, setSelectedFile] = useState<string | null>(null);
    const [analyzing, setAnalyzing] = useState(false);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [aiMetadata, setAiMetadata] = useState<any>(null);

    const handleAIExtract = async (file: EvidenceItem) => {
        setSelectedFile(file.name);
        setDrawerOpen(true);
        setAnalyzing(true);
        setAiMetadata(null);

        try {
            const apiKey = process.env.API_KEY;
             if (apiKey) {
                const ai = new GoogleGenAI({ apiKey });
                const prompt = `Extract metadata from cyber security evidence "${file.name}" type "${file.type}". Return JSON: { "documentDate": "YYYY-MM-DD", "detectedControl": "string", "confidence": "number %", "summary": "string" }.`;
                const response = await ai.models.generateContent({
                    model: 'gemini-3-flash-preview',
                    contents: { parts: [{ text: prompt }], role: 'user' }
                });
                const text = response.text;
                const json = text ? JSON.parse(text.match(/\{[\s\S]*\}/)?.[0] || '{}') : {};
                setAiMetadata(json);
            } else {
                 await new Promise(r => setTimeout(r, 2000));
                 setAiMetadata({
                    documentDate: "2025-10-01",
                    detectedControl: "NET-01",
                    confidence: "98%",
                    summary: "Contains firewall rule base export with 250 rules."
                });
            }
        } catch(e) { console.error(e); } 
        finally { setAnalyzing(false); }
    };

    const handleLinkAndRun = () => {
        setDrawerOpen(false);
        onRunTest("NET-01");
    };

    return (
        <div className="page-content animate-fade-in">
             <div className="section-card" style={{ padding: '40px', borderStyle: 'dashed', alignItems: 'center', justifyContent: 'center', background: 'rgba(30, 41, 59, 0.5)', borderColor: '#334155' }}>
                <div style={{ background: 'rgba(99, 102, 241, 0.15)', padding: '20px', borderRadius: '50%', marginBottom: '20px', color: '#818CF8' }}>
                    <UploadIcon />
                </div>
                <div style={{ fontSize: '1.25rem', fontWeight: 600, color: '#F8FAFC', marginBottom: '8px' }}>Upload Evidence</div>
                <div style={{ color: '#94A3B8' }}>Drag & drop files here, or email to <strong style={{ color: '#818CF8' }}>evidence@trustos.ai</strong></div>
             </div>

             <div className="section-card">
                 <div className="card-header">
                     <div className="card-title">Inbox</div>
                     <div style={{ display: 'flex', gap: '8px' }}>
                         {['All', 'Policy', 'Access List', 'Ticket', 'Log'].map(filter => (
                            <button key={filter} className="btn btn-secondary btn-sm" style={{ borderRadius: '20px' }}>{filter}</button>
                         ))}
                     </div>
                 </div>
                 <table className="data-table">
                     <thead>
                         <tr>
                             <th>File Name</th>
                             <th>Type</th>
                             <th>Source</th>
                             <th>Status</th>
                             <th>Uploaded By</th>
                             <th>Time</th>
                             <th>Actions</th>
                         </tr>
                     </thead>
                     <tbody>
                         {MOCK_EVIDENCE.map(item => (
                             <tr key={item.id}>
                                 <td style={{ fontWeight: 600, color: '#F8FAFC' }}>{item.name}</td>
                                 <td><span style={{ background: '#334155', padding: '4px 8px', borderRadius: '4px', fontSize: '0.85rem' }}>{item.type}</span></td>
                                 <td>{item.source}</td>
                                 <td>
                                     <span className={`status-badge ${item.status === 'Linked' ? 'status-pass' : 'status-warn'}`}>
                                         {item.status}
                                     </span>
                                 </td>
                                 <td>{item.uploadedBy}</td>
                                 <td>{item.date}</td>
                                 <td>
                                     <div style={{ display: 'flex', gap: '8px' }}>
                                         <button className="btn btn-primary btn-sm" style={{ padding: '6px 12px' }} title="AI Extract" onClick={() => handleAIExtract(item)}>
                                             <SparklesIcon /> Extract
                                         </button>
                                          {item.status === 'Linked' && (
                                             <button className="btn btn-secondary btn-sm" style={{ padding: '6px 12px' }} title="Run Test" onClick={() => onRunTest("NET-01")}>
                                                 <RunsIcon />
                                             </button>
                                          )}
                                     </div>
                                 </td>
                             </tr>
                         ))}
                     </tbody>
                 </table>
             </div>

             <SideDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} title="AI Extraction">
                {analyzing ? (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', padding: '40px' }}>
                        <div style={{ color: '#6366F1' }}><ThinkingIcon /></div>
                        <span style={{ color: '#94A3B8' }}>Scanning document content...</span>
                    </div>
                ) : aiMetadata ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        <div className="ai-summary-box">
                            <div className="ai-header"><CheckCircleIcon /> Extraction Complete</div>
                            <div className="ai-content">
                                <p>Metadata extracted with <strong>{aiMetadata.confidence}</strong> confidence.</p>
                                <p style={{fontSize: '0.9rem', color: '#94A3B8', marginTop: '8px'}}>{aiMetadata.summary}</p>
                            </div>
                        </div>
                        <div className="input-group">
                            <label>Detected Date</label>
                            <input type="text" value={aiMetadata.documentDate} readOnly />
                        </div>
                        <div className="input-group">
                            <label>Suggested Control Link</label>
                            <input type="text" value={aiMetadata.detectedControl} readOnly />
                        </div>
                        <div style={{ display: 'flex', gap: '12px' }}>
                            <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setDrawerOpen(false)}>Save & Link</button>
                            <button className="btn btn-primary" style={{ flex: 1 }} onClick={handleLinkAndRun}>Link & Run Test</button>
                        </div>
                    </div>
                ) : null}
             </SideDrawer>
        </div>
    );
}

function ControlDetailView({ controlId, initialTab, onBack }: { controlId: string, initialTab?: string, onBack: () => void }) {
    const [activeTab, setActiveTab] = useState(initialTab || 'Test Run');
    const [evaluating, setEvaluating] = useState(false);
    const [result, setResult] = useState<AIAnalysisResult | null>(null);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [explanation, setExplanation] = useState("");

    const handleRunEvaluation = async () => {
        setEvaluating(true);
        setResult(null);

        try {
            const apiKey = process.env.API_KEY;
             if (apiKey) {
                const ai = new GoogleGenAI({ apiKey });
                const context = `
Control: NET-01 Firewall Rule Review. 
Evidence: firewall_rules_Jan2026.csv (Contains 250 rules), rules_change_ticket.pdf.
Policy Rules: 
1. Firewall rules must be reviewed quarterly.
2. No "ANY ANY ALLOW" rules are permitted in production.
3. All rule changes must have an approved Jira ticket.
Current Date: 2025-10-08.
`;
                const prompt = `
${context}
Evaluate compliance. Return ONLY valid JSON: 
{ 
  "verdict": "FAIL", 
  "riskScore": 65, 
  "explanation": "Critical failure: 'ANY ANY ALLOW' rule detected on row 42. Unapproved changes found.", 
  "checks": [
    {"name": "Timeliness", "result": "PASS", "detail": "Review initiated within Q3 window.", "citation": "Policy §9.1"},
    {"name": "Unsafe Rules", "result": "FAIL", "detail": "Rule 42 allows ANY source to ANY dest on ANY port.", "citation": "firewall_rules.csv row 42"},
    {"name": "Change Auth", "result": "FAIL", "detail": "3 changes found without matching Jira tickets.", "citation": "Diff vs Last Run"}
  ] 
}
`;
                const response = await ai.models.generateContent({
                    model: 'gemini-3-flash-preview',
                    contents: { parts: [{ text: prompt }], role: 'user' }
                });
                const text = response.text;
                if (text) {
                    const json = JSON.parse(text.match(/\{[\s\S]*\}/)?.[0] || '{}');
                    setResult(json);
                }
            } else {
                await new Promise(r => setTimeout(r, 2000));
                setResult({
                    verdict: 'FAIL',
                    riskScore: 65,
                    explanation: "The control failed because a high-risk 'ANY ANY ALLOW' rule was detected in the production firewall config, and 3 rule changes lacked corresponding Jira tickets.",
                    checks: [
                        { name: "Timeliness", result: 'PASS', detail: "Review initiated within Q3 window.", citation: "Policy §9.1" },
                        { name: "Unsafe Rules Check", result: 'FAIL', detail: "Rule #42 allows ANY source to ANY dest on ANY port.", citation: "firewall_rules.csv row 42" },
                        { name: "Change Authorization", result: 'FAIL', detail: "3 changes found without matching Jira tickets.", citation: "Diff Analysis" }
                    ]
                });
            }
        } catch (e) {
            console.error(e);
        } finally {
            setEvaluating(false);
        }
    };

    const handleExplain = () => {
        if (result) {
            setExplanation(result.explanation);
            setDrawerOpen(true);
        }
    };

    return (
        <div className="page-content animate-fade-in" style={{ padding: 0, gap: 0 }}>
             <div className="control-header">
                 <div className="control-breadcrumb">
                     <span onClick={onBack} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', fontWeight: 500 }}>Control Library <ChevronRightIcon /></span>
                     <span>{controlId}</span>
                 </div>
                 <div className="control-title-row">
                     <div className="control-title">
                         <h1>Firewall Rule Review</h1>
                         <span className="status-badge status-fail" style={{ fontSize: '0.9rem', padding: '6px 14px' }}>Failing</span>
                     </div>
                     <div style={{ display: 'flex', gap: '12px' }}>
                         <button className="btn btn-secondary"><BellIcon /> Subscribe</button>
                         <button className="btn btn-secondary icon-btn"><SettingsIcon /></button>
                     </div>
                 </div>
                 <div className="control-tabs">
                     {['Overview', 'Evidence', 'Test Run', 'Exceptions', 'History', 'Settings'].map(tab => (
                         <button 
                            key={tab} 
                            className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
                            onClick={() => setActiveTab(tab)}
                        >
                            {tab}
                        </button>
                     ))}
                 </div>
             </div>

             <div style={{ padding: '32px 40px' }}>
                {activeTab === 'Overview' && (
                    <div className="detail-grid">
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                            <div className="section-card">
                                <div className="card-header"><span style={{ fontWeight: 600 }}>Description</span></div>
                                <div className="card-body">
                                    <p style={{ margin: 0, lineHeight: 1.6, color: '#94A3B8' }}>
                                        Firewall rule sets must be reviewed at least quarterly to ensure that they are consistent with the business requirements and that no unsafe rules (e.g., ANY-ANY) exist. All changes must be authorized via ticket.
                                    </p>
                                </div>
                            </div>
                            <div className="section-card">
                                <div className="card-header"><span style={{ fontWeight: 600 }}>Policy References</span></div>
                                <div className="card-body">
                                    <ul style={{ margin: 0, paddingLeft: 20, color: '#94A3B8' }}>
                                        <li>Network Security Standard v2.0, Section 5.3</li>
                                        <li>Change Management Policy v4.1, Section 2.1</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                            <div className="ai-summary-box">
                                <div className="ai-header"><SparklesIcon /> AI Insight</div>
                                <div className="ai-content">
                                    Recurring Issue: "ANY ANY" rules are frequently left open after temporary maintenance windows. Recommend automated daily scans.
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                {activeTab === 'Test Run' && (
                    <div className="detail-grid">
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                            <div className="test-run-grid">
                                <div className="section-card">
                                    <div className="card-header"><span style={{ fontWeight: 600 }}>Inputs</span></div>
                                    <div className="card-body" style={{ padding: '24px' }}>
                                        <div className="input-group">
                                            <label>Period</label>
                                            <select><option>Q3 2025</option><option>Q2 2025</option></select>
                                        </div>
                                        <div className="input-group">
                                            <label>Review Date</label>
                                            <input type="date" defaultValue="2025-10-08" />
                                        </div>
                                        <div className="input-group">
                                            <label>Reviewer</label>
                                            <select><option>Arjun (Network Lead)</option></select>
                                        </div>
                                    </div>
                                </div>
                                <div className="section-card" style={{ gridColumn: 'span 2' }}>
                                    <div className="card-header"><span style={{ fontWeight: 600 }}>Policy Rules Detected</span></div>
                                    <div className="card-body" style={{ padding: '24px', fontSize: '0.95rem' }}>
                                        <ul style={{ margin: 0, paddingLeft: '20px', color: '#94A3B8' }}>
                                            <li style={{ marginBottom: '8px' }}>Frequency: <strong>Quarterly</strong> review required.</li>
                                            <li style={{ marginBottom: '8px' }}>Safety: No <strong>"ANY ANY ALLOW"</strong> rules permitted.</li>
                                            <li>Authorization: All changes match <strong>Jira Ticket</strong>.</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            <div className="section-card">
                                <div className="card-header">
                                    <div className="card-title">Run Evaluation</div>
                                    <div style={{ display: 'flex', gap: '12px' }}>
                                        <button className="btn btn-secondary btn-sm">Dry Run</button>
                                        <button className="btn btn-primary btn-sm" onClick={handleRunEvaluation} disabled={evaluating}>
                                            {evaluating ? <><ThinkingIcon /> Running...</> : <><SparklesIcon /> Run Evaluation</>}
                                        </button>
                                    </div>
                                </div>
                                <div className="card-body">
                                    {result && (
                                        <>
                                            <div className={`result-banner ${result.verdict === 'PASS' ? 'result-pass' : 'result-fail'}`}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                    {result.verdict === 'PASS' ? <CheckCircleIcon /> : <XCircleIcon />}
                                                    <span className="verdict-text">Verdict: {result.verdict}</span>
                                                    <span style={{ height: '24px', width: '1px', background: 'rgba(0,0,0,0.1)' }}></span>
                                                    <span>Materiality: <strong>High</strong></span>
                                                </div>
                                                <div className="risk-score">Risk: {result.riskScore}</div>
                                            </div>

                                            <table className="data-table">
                                                <thead>
                                                    <tr>
                                                        <th>Check</th>
                                                        <th>Result</th>
                                                        <th>Explanation</th>
                                                        <th>Citations</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {result.checks.map((check, i) => (
                                                        <tr key={i}>
                                                            <td style={{ fontWeight: 500 }}>{check.name}</td>
                                                            <td>
                                                                <span className={`status-badge ${check.result === 'PASS' ? 'status-pass' : 'status-fail'}`}>
                                                                    {check.result}
                                                                </span>
                                                            </td>
                                                            <td>{check.detail}</td>
                                                            <td style={{ color: '#818CF8', fontSize: '0.85rem', fontWeight: 500 }}>{check.citation}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </>
                                    )}
                                    {!result && !evaluating && (
                                        <div style={{ padding: '40px', textAlign: 'center', color: '#64748B' }}>
                                            <div style={{ fontSize: '3rem', marginBottom: '16px', opacity: 0.5 }}>🧪</div>
                                            <div>Ready to evaluate Q3 Firewall Rules.</div>
                                            <div style={{ fontSize: '0.9rem', opacity: 0.7 }}>Click "Run Evaluation" to start AI analysis of CSV & Tickets.</div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Right Panel for Control Detail */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                             <div className="section-card">
                                 <div className="card-header"><span style={{ fontWeight: 600 }}>Actions</span></div>
                                 <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: '16px' }}>
                                    {result && (
                                        <>
                                            <button className="btn btn-secondary" onClick={handleExplain}><SparklesIcon /> Explain Result</button>
                                            <button className="btn btn-secondary"><FileIcon /> Generate Binder</button>
                                            <button className="btn btn-secondary"><CasesIcon /> Create Case</button>
                                            <hr style={{ width: '100%', border: 'none', borderTop: '1px solid #334155', margin: '8px 0' }} />
                                        </>
                                    )}
                                     <button className="btn btn-ghost" style={{ justifyContent: 'flex-start' }}>Ask a Question...</button>
                                 </div>
                             </div>
                             <div className="section-card">
                                 <div className="card-header"><span style={{ fontWeight: 600 }}>Control Owner</span></div>
                                 <div className="card-body" style={{ padding: '16px' }}>
                                     <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                         <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#6366F1', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>A</div>
                                         <div>
                                             <div style={{ fontWeight: 600 }}>Arjun</div>
                                             <div style={{ fontSize: '0.85rem', color: '#94A3B8' }}>Network Lead</div>
                                         </div>
                                     </div>
                                 </div>
                             </div>
                        </div>
                    </div>
                )}
                {activeTab === 'Evidence' && (
                     <div className="section-card">
                         <div className="card-header">
                            <div className="card-title">Linked Evidence</div>
                            <button className="btn btn-primary btn-sm"><UploadIcon /> Upload</button>
                         </div>
                         <table className="data-table">
                             <thead><tr><th>File</th><th>Type</th><th>Uploaded</th><th>Status</th></tr></thead>
                             <tbody>
                                 {MOCK_EVIDENCE.filter(e => e.status === 'Linked').map(e => (
                                     <tr key={e.id}><td>{e.name}</td><td>{e.type}</td><td>{e.date}</td><td><span className="status-badge status-pass">Linked</span></td></tr>
                                 ))}
                             </tbody>
                         </table>
                     </div>
                )}
                {activeTab === 'Exceptions' && (
                     <div className="section-card">
                         <div className="card-header">
                            <div className="card-title">Exceptions Ledger</div>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <button className="btn btn-secondary btn-sm">Bulk Assign</button>
                                <button className="btn btn-secondary btn-sm">Set Due Date</button>
                            </div>
                         </div>
                         <table className="data-table">
                             <thead><tr><th>User</th><th>Issue</th><th>Status</th><th>Ticket</th></tr></thead>
                             <tbody>
                                 <tr><td>sys_admin</td><td>Temp access for maintenance</td><td><span className="status-badge status-pass">Closed</span></td><td>JIRA-402</td></tr>
                                 <tr><td>dev_ops</td><td>Port 22 open to world</td><td><span className="status-badge status-fail">Open</span></td><td>JIRA-405</td></tr>
                             </tbody>
                         </table>
                     </div>
                )}
                {activeTab === 'History' && (
                    <div className="section-card">
                        <div className="card-header">
                            <div className="card-title">Run History</div>
                            <button className="btn btn-secondary btn-sm">Compare Runs</button>
                        </div>
                        <table className="data-table">
                            <thead><tr><th>Date</th><th>Period</th><th>Verdict</th><th>Risk</th><th>Artifacts</th></tr></thead>
                            <tbody>
                                <tr><td>Oct 8, 2025</td><td>Q3 2025</td><td><span className="status-badge status-fail">FAIL</span></td><td>65</td><td><button className="btn btn-ghost btn-sm">JSON</button></td></tr>
                                <tr><td>Jul 5, 2025</td><td>Q2 2025</td><td><span className="status-badge status-pass">PASS</span></td><td>15</td><td><button className="btn btn-ghost btn-sm">JSON</button></td></tr>
                                <tr><td>Apr 4, 2025</td><td>Q1 2025</td><td><span className="status-badge status-pass">PASS</span></td><td>10</td><td><button className="btn btn-ghost btn-sm">JSON</button></td></tr>
                            </tbody>
                        </table>
                    </div>
                )}
                {activeTab === 'Settings' && (
                    <div className="detail-grid">
                        <div className="section-card">
                            <div className="card-header"><span style={{ fontWeight: 600 }}>Configuration</span></div>
                            <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                <div className="input-group">
                                    <label>Review Frequency</label>
                                    <select><option>Quarterly</option><option>Monthly</option><option>Continuous</option></select>
                                </div>
                                <div className="input-group">
                                    <label>SLA (Days)</label>
                                    <input type="number" defaultValue="30" />
                                </div>
                                <button className="btn btn-primary" style={{ alignSelf: 'flex-start' }}>Save Changes</button>
                            </div>
                        </div>
                    </div>
                )}
             </div>

             <SideDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} title="AI Explanation">
                 <div className="ai-summary-box">
                     <div className="ai-content">{explanation}</div>
                 </div>
                 <div style={{ marginTop: '20px', fontSize: '0.9rem', color: '#94A3B8' }}>
                     <p>Rule #42 in the firewall configuration matches 'source: any', 'destination: any', 'action: allow'. This violates the 'Least Privilege' principle and Policy Section 9.1. Additionally, diff analysis shows 3 new rules added on Oct 2nd that do not correlate with any closed Jira tickets in the 'Network Change' project.</p>
                 </div>
             </SideDrawer>
        </div>
    );
}

function CasesView() {
    return (
        <div className="page-content animate-fade-in">
             <div className="section-card">
                 <div className="card-header">
                    <div className="card-title">Case Management</div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <button className="btn btn-secondary btn-sm">My Cases</button>
                        <button className="btn btn-primary btn-sm">New Case</button>
                    </div>
                 </div>
                 <table className="data-table">
                     <thead>
                         <tr>
                             <th>ID</th>
                             <th>Title</th>
                             <th>Severity</th>
                             <th>Status</th>
                             <th>Owner</th>
                             <th>Due Date</th>
                         </tr>
                     </thead>
                     <tbody>
                         {MOCK_CASES.map(c => (
                             <tr key={c.id}>
                                 <td style={{ fontWeight: 600, color: '#94A3B8' }}>{c.id}</td>
                                 <td style={{ fontWeight: 500 }}>{c.title}</td>
                                 <td>
                                     <span className={`status-badge ${c.severity === 'High' ? 'status-fail' : c.severity === 'Medium' ? 'status-warn' : 'status-pass'}`}>
                                         {c.severity}
                                     </span>
                                 </td>
                                 <td>{c.status}</td>
                                 <td>{c.owner}</td>
                                 <td>{c.dueDate}</td>
                             </tr>
                         ))}
                     </tbody>
                 </table>
             </div>
        </div>
    );
}

function ReportsView() {
    return (
        <div className="page-content animate-fade-in">
            <div className="section-card">
                <div className="card-header">
                    <div className="card-title">Generated Reports</div>
                    <button className="btn btn-primary btn-sm"><SparklesIcon /> Generate New</button>
                </div>
                <div className="card-body" style={{ padding: '40px', textAlign: 'center', color: '#64748B' }}>
                    <div style={{ display: 'flex', justifyContent: 'center', fontSize: '2rem', marginBottom: '16px', opacity: 0.5 }}><FileIcon /></div>
                    <div>No reports generated recently.</div>
                </div>
            </div>
        </div>
    );
}

function SettingsView() {
    return (
        <div className="page-content animate-fade-in">
             <div className="section-card">
                 <div className="card-header"><span style={{ fontWeight: 600 }}>System Settings</span></div>
                 <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '24px' }}>
                    <div className="input-group">
                        <label>Organization Name</label>
                        <input type="text" defaultValue="Acme Corp" />
                    </div>
                    <div className="input-group">
                        <label>Risk Threshold</label>
                        <select><option>Standard (ISO 27001)</option><option>High Security</option></select>
                    </div>
                    <button className="btn btn-primary" style={{ alignSelf: 'flex-start' }}>Save Settings</button>
                 </div>
             </div>
        </div>
    );
}

// --- Main App Shell ---

function App() {
  const [activeView, setActiveView] = useState<'Dashboard' | 'Inbox' | 'Controls' | 'Runs' | 'Cases' | 'Reports' | 'Settings'>('Dashboard');
  const [selectedControlId, setSelectedControlId] = useState<string | null>(null);
  const [controlFilter, setControlFilter] = useState('All');
  const [controlInitialTab, setControlInitialTab] = useState('Test Run');

  const handleSelectRun = (runId: string) => {
      setSelectedControlId("NET-01"); // Link to NET-01 for demo
      setControlInitialTab('Test Run');
      setActiveView('Controls');
  };
  
  const handleRunEvaluation = (controlId: string) => {
      setSelectedControlId(controlId);
      setControlInitialTab('Test Run');
      setActiveView('Controls');
  };

  const renderContent = () => {
      if (activeView === 'Controls' && selectedControlId) {
          return <ControlDetailView controlId={selectedControlId} initialTab={controlInitialTab} onBack={() => setSelectedControlId(null)} />;
      }

      switch (activeView) {
          case 'Dashboard': return <DashboardView onSelectRun={handleSelectRun} />;
          case 'Inbox': return <EvidenceInboxView onRunTest={handleRunEvaluation} />;
          case 'Controls': 
              return (
                  <div className="page-content animate-fade-in">
                      <div className="section-card">
                          <div className="card-header">
                              <div className="card-title">Cyber Control Library</div>
                              <div style={{ display: 'flex', gap: '8px' }}>
                                  {['All', 'IAM', 'Network', 'Cloud', 'Endpoint'].map(f => (
                                      <button 
                                        key={f} 
                                        className={`btn btn-sm ${controlFilter === f ? 'btn-primary' : 'btn-secondary'}`}
                                        onClick={() => setControlFilter(f)}
                                        style={{ borderRadius: '20px' }}
                                      >
                                        {f}
                                      </button>
                                  ))}
                              </div>
                          </div>
                          <div style={{ padding: '24px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '20px' }}>
                                {MOCK_CONTROLS.filter(c => controlFilter === 'All' || c.domain === controlFilter).map(c => (
                                    <div key={c.id} onClick={() => { setSelectedControlId(c.id); setControlInitialTab('Overview'); }} style={{ padding: '20px', border: '1px solid #334155', borderRadius: '12px', cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: '16px', transition: 'all 0.2s', background: '#1E293B' }} className="hover:shadow-md hover:border-indigo-400">
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                            <div>
                                                <div style={{ fontWeight: 600, fontSize: '1.05rem', color: '#F8FAFC', marginBottom: '4px' }}>{c.name}</div>
                                                <div style={{ fontSize: '0.85rem', color: '#94A3B8' }}>{c.id}</div>
                                            </div>
                                            <div className={`status-badge ${c.lastVerdict === 'PASS' ? 'status-pass' : 'status-fail'}`}>{c.lastVerdict}</div>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem', color: '#94A3B8', borderTop: '1px solid #334155', paddingTop: '12px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><ShieldIcon /> {c.domain}</div>
                                            <div>Due {c.nextDue}</div>
                                        </div>
                                    </div>
                                ))}
                          </div>
                      </div>
                  </div>
              );
          case 'Runs':
              return (
                  <div className="page-content animate-fade-in">
                      <div className="section-card">
                          <div className="card-header">
                              <div className="card-title">Test Runs</div>
                              <div style={{ display: 'flex', gap: '8px' }}>
                                  <input type="date" className="btn btn-secondary btn-sm" />
                                  <button className="btn btn-secondary btn-sm"><FilterIcon /> Filter</button>
                              </div>
                          </div>
                          <table className="data-table">
                              <thead><tr><th>Run ID</th><th>Control</th><th>Domain</th><th>Period</th><th>Verdict</th><th>Risk</th><th>Owner</th><th>Actions</th></tr></thead>
                              <tbody>
                                  {MOCK_RUNS.map(r => (
                                      <tr key={r.id}>
                                          <td style={{ fontFamily: 'monospace', fontWeight: 600, color: '#94A3B8' }}>{r.id}</td>
                                          <td style={{ fontWeight: 500 }}>{r.controlName}</td>
                                          <td><span style={{ background: '#1E293B', padding: '2px 8px', borderRadius: '4px', fontSize: '0.8rem' }}>{MOCK_CONTROLS.find(c => c.id === r.controlId)?.domain || 'Cyber'}</span></td>
                                          <td>{r.period}</td>
                                          <td><span className={`status-badge ${r.verdict === 'PASS' ? 'status-pass' : 'status-fail'}`}>{r.verdict}</span></td>
                                          <td>{r.risk}</td>
                                          <td>{r.owner}</td>
                                          <td><button className="btn btn-ghost btn-sm" onClick={() => handleSelectRun(r.id)}>View</button></td>
                                      </tr>
                                  ))}
                              </tbody>
                          </table>
                      </div>
                  </div>
              );
          case 'Cases': return <CasesView />;
          case 'Reports': return <ReportsView />;
          case 'Settings': return <SettingsView />;
          default: 
            return <div className="page-content" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#667085' }}>Module under construction.</div>;
      }
  };

  return (
    <>
        <div className="sidebar">
            <div className="sidebar-header">
                <div className="brand-icon">T</div>
                TrustOS
            </div>
            <div className="sidebar-nav">
                <NavItem icon={DashboardIcon} label="Dashboard" active={activeView === 'Dashboard'} onClick={() => { setActiveView('Dashboard'); setSelectedControlId(null); }} />
                <NavItem icon={InboxIcon} label="Evidence Inbox" active={activeView === 'Inbox'} onClick={() => setActiveView('Inbox')} />
                <NavItem icon={ControlsIcon} label="Cyber Controls" active={activeView === 'Controls'} onClick={() => setActiveView('Controls')} />
                <NavItem icon={RunsIcon} label="Runs" active={activeView === 'Runs'} onClick={() => setActiveView('Runs')} />
                <NavItem icon={CasesIcon} label="Cases" active={activeView === 'Cases'} onClick={() => setActiveView('Cases')} />
                <NavItem icon={ReportsIcon} label="Reports" active={activeView === 'Reports'} onClick={() => setActiveView('Reports')} />
            </div>
            <div className="sidebar-nav" style={{ flex: 0, borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                <NavItem icon={SettingsIcon} label="Settings" active={activeView === 'Settings'} onClick={() => setActiveView('Settings')} />
            </div>
        </div>

        <div className="main-wrapper">
            <div className="top-header">
                <div className="header-search">
                    <SearchIcon />
                    <input type="text" placeholder="Search controls, evidence, or cases..." />
                </div>
                <div className="header-actions">
                    <button className="icon-btn"><BellIcon /></button>
                    <div className="user-profile">R</div>
                </div>
            </div>
            {renderContent()}
        </div>
    </>
  );
}

const rootElement = document.getElementById('root');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(<React.StrictMode><App /></React.StrictMode>);
}
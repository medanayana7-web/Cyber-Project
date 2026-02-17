/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

export interface KPICard {
  label: string;
  value: string | number;
  trend?: string;
  status: 'positive' | 'negative' | 'neutral';
}

export interface Control {
  id: string;
  name: string;
  domain: string;
  frequency: string;
  owner: string;
  lastVerdict: 'PASS' | 'FAIL';
  riskScore: number;
  nextDue: string;
}

export interface EvidenceItem {
  id: string;
  name: string;
  type: string;
  source: string;
  status: 'Linked' | 'Unlinked';
  uploadedBy: string;
  date: string;
}

export interface Run {
  id: string;
  controlId: string;
  controlName: string;
  period: string;
  verdict: 'PASS' | 'FAIL';
  risk: number;
  owner: string;
}

export interface Case {
  id: string;
  title: string;
  severity: 'High' | 'Medium' | 'Low';
  status: 'New' | 'In Progress' | 'Waiting' | 'Closed';
  owner: string;
  dueDate: string;
}

export interface AIAnalysisResult {
  verdict: 'PASS' | 'FAIL';
  riskScore: number;
  explanation: string;
  checks: { name: string; result: 'PASS' | 'FAIL'; detail: string; citation: string }[];
}

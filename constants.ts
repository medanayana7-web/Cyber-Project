/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import { Control, EvidenceItem, Run, Case } from './types';

export const MOCK_CONTROLS: Control[] = [
    { id: 'IAM-01', name: 'Monthly Access Review', domain: 'IAM', frequency: 'Monthly', owner: 'Raj', lastVerdict: 'FAIL', riskScore: 72, nextDue: '2025-10-31' },
    { id: 'IAM-02', name: 'Privileged Access Review', domain: 'IAM', frequency: 'Quarterly', owner: 'Raj', lastVerdict: 'PASS', riskScore: 12, nextDue: '2025-11-15' },
    { id: 'IAM-03', name: 'MFA Enforcement', domain: 'IAM', frequency: 'Continuous', owner: 'Sarah', lastVerdict: 'PASS', riskScore: 5, nextDue: '2025-10-15' },
    { id: 'NET-01', name: 'Firewall Rule Review', domain: 'Network', frequency: 'Quarterly', owner: 'Arjun', lastVerdict: 'FAIL', riskScore: 65, nextDue: '2025-10-30' },
    { id: 'NET-02', name: 'VPN Access Monitoring', domain: 'Network', frequency: 'Monthly', owner: 'Arjun', lastVerdict: 'PASS', riskScore: 20, nextDue: '2025-10-31' },
    { id: 'END-01', name: 'Antivirus / EDR Compliance', domain: 'Endpoint', frequency: 'Weekly', owner: 'Nina', lastVerdict: 'PASS', riskScore: 15, nextDue: '2025-10-14' },
    { id: 'CLOUD-01', name: 'S3 Bucket Permissions', domain: 'Cloud', frequency: 'Continuous', owner: 'Sarah', lastVerdict: 'FAIL', riskScore: 88, nextDue: '2025-10-12' },
    { id: 'VULN-01', name: 'Monthly Vuln Scan Review', domain: 'Vulnerability', frequency: 'Monthly', owner: 'Nina', lastVerdict: 'PASS', riskScore: 30, nextDue: '2025-10-31' },
    { id: 'BACKUP-01', name: 'Backup Success Rate', domain: 'Backup', frequency: 'Daily', owner: 'System', lastVerdict: 'PASS', riskScore: 2, nextDue: '2025-10-09' },
];

export const MOCK_EVIDENCE: EvidenceItem[] = [
    { id: '1', name: 'firewall_rules_Jan2026.csv', type: 'Config', source: 'Palo Alto', status: 'Linked', uploadedBy: 'Arjun', date: '10:31 AM' },
    { id: '2', name: 'rules_change_ticket.pdf', type: 'Ticket', source: 'Jira', status: 'Linked', uploadedBy: 'Arjun', date: '10:30 AM' },
    { id: '3', name: 'screenshot_fw_console.png', type: 'Screenshot', source: 'Upload', status: 'Linked', uploadedBy: 'Arjun', date: '10:29 AM' },
    { id: '4', name: 'vuln_scan_oct_2025.pdf', type: 'Report', source: 'Tenable', status: 'Unlinked', uploadedBy: 'Nina', date: '09:15 AM' },
    { id: '5', name: 'aws_config_snapshot.json', type: 'Log', source: 'AWS', status: 'Unlinked', uploadedBy: 'System', date: '08:00 AM' },
];

export const MOCK_RUNS: Run[] = [
    { id: 'RUN-2055', controlId: 'NET-01', controlName: 'Firewall Rule Review', period: 'Q3 2025', verdict: 'FAIL', risk: 65, owner: 'Arjun' },
    { id: 'RUN-2054', controlId: 'IAM-01', controlName: 'Monthly Access Review', period: 'Sep 2025', verdict: 'FAIL', risk: 72, owner: 'Raj' },
    { id: 'RUN-2053', controlId: 'CLOUD-01', controlName: 'S3 Bucket Permissions', period: 'Continuous', verdict: 'FAIL', risk: 88, owner: 'Sarah' },
    { id: 'RUN-2052', controlId: 'VULN-01', controlName: 'Monthly Vuln Scan', period: 'Sep 2025', verdict: 'PASS', risk: 30, owner: 'Nina' },
    { id: 'RUN-2051', controlId: 'BACKUP-01', controlName: 'Backup Success Rate', period: 'Oct 8 2025', verdict: 'PASS', risk: 2, owner: 'System' },
];

export const MOCK_CASES: Case[] = [
    { id: 'INC-201', title: 'Open S3 Bucket Detected', severity: 'High', status: 'In Progress', owner: 'Sarah', dueDate: '2025-10-12' },
    { id: 'INC-202', title: 'Firewall "ANY ANY" Rule Found', severity: 'High', status: 'New', owner: 'Arjun', dueDate: '2025-10-10' },
    { id: 'REM-305', title: 'Missing Evidence for IAM-01', severity: 'Medium', status: 'Waiting', owner: 'Raj', dueDate: '2025-10-15' },
    { id: 'REM-301', title: 'Patching SLA Breach', severity: 'Low', status: 'Closed', owner: 'Nina', dueDate: '2025-09-30' },
];

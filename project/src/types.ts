// Core domain types for GrievanceIQ — shared across all 6 pipeline stages

export type Stage =
  | 'submission'
  | 'nlp_processing'
  | 'routed'
  | 'in_progress'
  | 'resolved'
  | 'manual_review';

export type ComplaintStatus = Stage | 'appealed' | 'closed';

export type Urgency = 'critical' | 'high' | 'medium' | 'low';

export type Department =
  | 'Municipal Corporation'
  | 'Public Works Department'
  | 'Electricity Board'
  | 'Water Supply & Sewerage'
  | 'Police Department'
  | 'Health & Family Welfare'
  | 'Transport Authority'
  | 'Revenue & Land Records'
  | 'Education Department'
  | 'Environment & Pollution Control';

export type OfficerAction = 'accept' | 'reject' | 'resolve' | 'forward';

export interface Attachment {
  id: string;
  name: string;
  type: string;
  size: number;
  previewUrl?: string;
}

export interface NLPResult {
  language: string;
  intent: string;
  entities: string[];
  sentiment: 'positive' | 'neutral' | 'negative' | 'very negative';
  urgency: Urgency;
  confidence: number;
  flaggedForReview: boolean;
}

export interface RoutingReason {
  module: string;
  detail: string;
}

export interface RoutingResult {
  department: Department;
  subCategory: string;
  jurisdiction: string;
  assignedOfficer: string;
  reasons: RoutingReason[];
}

export interface Complaint {
  id: string;
  caseId?: string;
  citizenName: string;
  citizenContact: string;
  text: string;
  attachments: Attachment[];
  location: string;
  submittedAt: string;
  status: ComplaintStatus;
  nlpResult?: NLPResult;
  routing?: RoutingResult;
  slaDeadline: string;
  slaTotalMinutes: number;
  duplicateGroupId?: string;
  duplicateGroupSize?: number;
  officerAction?: OfficerAction;
  feedback?: 'satisfied' | 'not_satisfied' | null;
  appealCount?: number;
}

export interface DuplicateGroup {
  caseId: string;
  complaintIds: string[];
  rootCause: string;
  clusterArea: string;
  severity: Urgency;
}

export type View =
  | 'home'
  | 'submit'
  | 'processing'
  | 'routing_result'
  | 'track'
  | 'dashboard'
  | 'analytics';

export interface PipelineStep {
  num: number;
  label: string;
  stage: string;
  color: 'orange' | 'green' | 'navy' | 'orange' | 'green' | 'navy';
}

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { Complaint, View, NLPResult, RoutingResult, OfficerAction, Attachment } from './types';
import { MOCK_COMPLAINTS, simulateNLP, MOCK_LOCATIONS } from './mockData';

interface AppContextValue {
  complaints: Complaint[];
  currentView: View;
  setView: (v: View) => void;
  activeComplaintId: string | null;
  setActiveComplaintId: (id: string | null) => void;
  pendingSubmission: {
    text: string;
    attachments: Attachment[];
    location: string;
    citizenName: string;
    citizenContact: string;
  } | null;
  setPendingSubmission: (data: AppContextValue['pendingSubmission']) => void;
  nlpResult: NLPResult | null;
  setNlpResult: (r: NLPResult | null) => void;
  routingResult: RoutingResult | null;
  setRoutingResult: (r: RoutingResult | null) => void;
  submitComplaint: (data: { text: string; attachments: Attachment[]; location: string; citizenName: string; citizenContact: string }) => void;
  processComplaint: () => void;
  confirmRouting: (complaintId: string) => void;
  officerAction: (complaintId: string, action: OfficerAction) => void;
  verifyManualReview: (complaintId: string) => void;
  submitFeedback: (complaintId: string, feedback: 'satisfied' | 'not_satisfied') => void;
  getComplaintById: (id: string) => Complaint | undefined;
  sidebarOpen: boolean;
  setSidebarOpen: (v: boolean) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [complaints, setComplaints] = useState<Complaint[]>(MOCK_COMPLAINTS);
  const [currentView, setCurrentView] = useState<View>('home');
  const [activeComplaintId, setActiveComplaintId] = useState<string | null>(null);
  const [pendingSubmission, setPendingSubmission] = useState<AppContextValue['pendingSubmission']>(null);
  const [nlpResult, setNlpResult] = useState<NLPResult | null>(null);
  const [routingResult, setRoutingResult] = useState<RoutingResult | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const setView = useCallback((v: View) => {
    setCurrentView(v);
    setSidebarOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const submitComplaint = useCallback((data: { text: string; attachments: Attachment[]; location: string; citizenName: string; citizenContact: string }) => {
    setPendingSubmission(data);
    setNlpResult(null);
    setRoutingResult(null);
    setView('processing');
  }, [setView]);

  const processComplaint = useCallback(() => {
    if (!pendingSubmission) return;
    const { nlpResult: nlp, routing } = simulateNLP(pendingSubmission.text);
    setNlpResult(nlp);
    setRoutingResult(routing);
  }, [pendingSubmission]);

  const confirmRouting = useCallback((complaintId: string) => {
    // Create the complaint and add to the list
    if (!pendingSubmission || !nlpResult || !routingResult) return;
    const slaMinutes = nlpResult.urgency === 'critical' ? 360 : nlpResult.urgency === 'high' ? 480 : nlpResult.urgency === 'medium' ? 960 : 1440;
    const newComplaint: Complaint = {
      id: complaintId,
      citizenName: pendingSubmission.citizenName || 'Anonymous Citizen',
      citizenContact: pendingSubmission.citizenContact || 'Not provided',
      text: pendingSubmission.text,
      attachments: pendingSubmission.attachments,
      location: pendingSubmission.location,
      submittedAt: new Date().toISOString(),
      status: nlpResult.flaggedForReview ? 'manual_review' : 'routed',
      nlpResult,
      routing: nlpResult.flaggedForReview ? undefined : routingResult,
      slaDeadline: new Date(Date.now() + slaMinutes * 60000).toISOString(),
      slaTotalMinutes: slaMinutes,
      duplicateGroupId: `CASE-${complaintId}`,
      duplicateGroupSize: 1,
    };
    setComplaints((prev) => [newComplaint, ...prev]);
    setActiveComplaintId(complaintId);
    setPendingSubmission(null);
  }, [pendingSubmission, nlpResult, routingResult]);

  const officerAction = useCallback((complaintId: string, action: OfficerAction) => {
    setComplaints((prev) =>
      prev.map((c) => {
        if (c.id !== complaintId) return c;
        let newStatus = c.status;
        if (action === 'accept') newStatus = 'in_progress';
        else if (action === 'resolve') newStatus = 'resolved';
        else if (action === 'reject') newStatus = 'closed';
        else if (action === 'forward') newStatus = 'routed';
        return { ...c, status: newStatus, officerAction: action };
      })
    );
  }, []);

  const verifyManualReview = useCallback((complaintId: string) => {
    setComplaints((prev) =>
      prev.map((c) => {
        if (c.id !== complaintId) return c;
        // Officer verified — push back into Stage 3 routing
        const { routing } = simulateNLP(c.text);
        return {
          ...c,
          status: 'routed',
          nlpResult: c.nlpResult ? { ...c.nlpResult, flaggedForReview: false } : c.nlpResult,
          routing,
        };
      })
    );
  }, []);

  const submitFeedback = useCallback((complaintId: string, feedback: 'satisfied' | 'not_satisfied') => {
    setComplaints((prev) =>
      prev.map((c) => {
        if (c.id !== complaintId) return c;
        if (feedback === 'satisfied') {
          return { ...c, status: 'closed', feedback };
        } else {
          // Not satisfied → appeal → re-opened, loop back to Stage 3
          return {
            ...c,
            status: 'routed',
            feedback,
            appealCount: (c.appealCount ?? 0) + 1,
          };
        }
      })
    );
  }, []);

  const getComplaintById = useCallback((id: string) => complaints.find((c) => c.id === id), [complaints]);

  return (
    <AppContext.Provider
      value={{
        complaints,
        currentView,
        setView,
        activeComplaintId,
        setActiveComplaintId,
        pendingSubmission,
        setPendingSubmission,
        nlpResult,
        setNlpResult,
        routingResult,
        setRoutingResult,
        submitComplaint,
        processComplaint,
        confirmRouting,
        officerAction,
        verifyManualReview,
        submitFeedback,
        getComplaintById,
        sidebarOpen,
        setSidebarOpen,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}

export { MOCK_LOCATIONS };

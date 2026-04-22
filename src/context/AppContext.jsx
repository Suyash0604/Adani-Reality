import { useCallback, useMemo, useState } from 'react';
import { defaultQaBreakdown, defaultSoftSkills, leads, projects as initialProjects, campaignData } from '../data/mockData';
import { AppContext } from './appContextObject';

const sentimentFromTranscript = (messages) => {
  const text = messages.map((m) => m.text.toLowerCase()).join(' ');
  if (text.includes('book') || text.includes('great') || text.includes('perfect')) return 'Positive';
  if (text.includes('price') || text.includes('decide')) return 'Neutral';
  return 'Mixed';
};

const computeQaFromCall = ({ transcript, visitBooked, disposition, durationSeconds }) => {
  const customerMessages = transcript.filter((m) => m.sender === 'customer').length;
  const keywordText = transcript.map((m) => m.text.toLowerCase()).join(' ');

  const hasPrice = keywordText.includes('price');
  const hasLocation = keywordText.includes('location');
  const hasExploring = keywordText.includes('exploring');

  const greeting = transcript.length > 0 ? 16 : 10;
  const productExplanation = Math.min(20, 12 + customerMessages + (hasExploring ? 2 : 0));
  const pricing = hasPrice ? 16 : 11;
  const objectionHandling = hasLocation || hasPrice ? 14 : 11;
  const closing = visitBooked ? 18 : disposition ? 14 : 11;

  const breakdown = [
    { category: 'Greeting', score: greeting, max: 20 },
    { category: 'Product explanation', score: productExplanation, max: 20 },
    { category: 'Pricing', score: pricing, max: 20 },
    { category: 'Objection handling', score: objectionHandling, max: 20 },
    { category: 'Closing', score: closing, max: 20 },
  ];

  const total = breakdown.reduce((acc, item) => acc + item.score, 0);

  const softSkills = defaultSoftSkills.map((item) => {
    if (item.label === 'Energy') {
      return { ...item, value: durationSeconds > 240 ? 'Strong' : 'Moderate' };
    }
    if (item.label === 'Empathy') {
      return { ...item, value: customerMessages >= 3 ? 'Good' : 'Average' };
    }
    return item;
  });

  return { total, breakdown, softSkills };
};

export const AppProvider = ({ children }) => {
  const [callState, setCallState] = useState('idle');
  const [activeCustomer, setActiveCustomer] = useState(leads[0]);
  const [transcriptMessages, setTranscriptMessages] = useState([]);
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [qaResult, setQaResult] = useState({
    total: 71,
    breakdown: defaultQaBreakdown,
    softSkills: defaultSoftSkills,
  });
  const [callRecords, setCallRecords] = useState([
    {
      id: 'seed-1',
      date: '20/04/2026',
      time: '11:45 AM',
      agent: 'Riya Sharma',
      customer: 'Rohan Nair',
      duration: '07m 15s',
      durationSeconds: 435,
      sentiment: 'Positive',
      score: 84,
      outcome: 'Visit Booked',
      summary: 'Rohan Nair discussed Adani Western Heights - 4 BHK. Visit booked.',
      transcript: [],
      sentimentProgress: 84,
    },
    {
      id: 'seed-2',
      date: '19/04/2026',
      time: '02:30 PM',
      agent: 'Amit Singh',
      customer: 'Sneha Desai',
      duration: '03m 45s',
      durationSeconds: 225,
      sentiment: 'Neutral',
      score: 72,
      outcome: 'Follow-up',
      summary: 'Sneha Desai discussed Adani Codename Capital - 2 BHK. Needs follow-up.',
      transcript: [],
      sentimentProgress: 72,
    },
    {
      id: 'seed-3',
      date: '20/04/2026',
      time: '04:15 PM',
      agent: 'Priya Das',
      customer: 'Vikram Patel',
      duration: '09m 20s',
      durationSeconds: 560,
      sentiment: 'Positive',
      score: 91,
      outcome: 'Visit Booked',
      summary: 'High quality interaction. Customer very satisfied with 3BHK pricing.',
      transcript: [],
      sentimentProgress: 91,
    },
    {
      id: 'seed-4',
      date: '18/04/2026',
      time: '01:00 PM',
      agent: 'Rahul Varma',
      customer: 'Anita Reddy',
      duration: '02m 10s',
      durationSeconds: 130,
      sentiment: 'Mixed',
      score: 58,
      outcome: 'Escalated',
      summary: 'Customer had complaints about previous site visit experience.',
      transcript: [],
      sentimentProgress: 58,
    },
    {
      id: 'seed-5',
      date: '20/04/2026',
      time: '09:00 AM',
      agent: 'Priya Das',
      customer: 'Suresh Raina',
      duration: '05m 40s',
      durationSeconds: 340,
      sentiment: 'Positive',
      score: 88,
      outcome: 'Visit Booked',
      summary: 'Follow up on payment plan. Successful site visit scheduled.',
      transcript: [],
      sentimentProgress: 88,
    },
    {
      id: 'seed-6',
      date: '19/04/2026',
      time: '11:15 AM',
      agent: 'Riya Sharma',
      customer: 'Sneha Desai',
      duration: '04m 50s',
      durationSeconds: 290,
      sentiment: 'Positive',
      score: 86,
      outcome: 'Visit Booked',
      summary: 'Follow up on 2 BHK requirement. Visit booked for next Tuesday.',
      transcript: [],
      sentimentProgress: 86,
    }
  ]);
  const [visitBooked, setVisitBooked] = useState(false);
  const [lastCallSummary, setLastCallSummary] = useState(null);
  const [selectedLeadId, setSelectedLeadId] = useState(leads[0]?.id ?? null);
  const [disposition, setDisposition] = useState('');

  // Global Dashboard State
  const [supervisorView, setSupervisorView] = useState('agent');

  // Global Campaign & Project State
  const [allProjects, setAllProjects] = useState(initialProjects);
  const [outboundCampaigns, setOutboundCampaigns] = useState(campaignData.outbound);
  const [inboundCampaigns, setInboundCampaigns] = useState(campaignData.inbound);

  // Incoming Call State
  const [incomingCall, setIncomingCall] = useState(null);
  const [customerHistory, setCustomerHistory] = useState([]);

  const addProject = useCallback((project) => {
    setAllProjects((prev) => [...prev, project]);
  }, []);

  const addCampaign = useCallback((campaign) => {
    setOutboundCampaigns((prev) => [campaign, ...prev]);
  }, []);

  const updateCampaignStatus = useCallback((campaignId, status, callsMadeIncrement = 0) => {
    setOutboundCampaigns((prev) => prev.map(c => 
      c.id === campaignId ? { ...c, status, callsMade: c.callsMade + callsMadeIncrement } : c
    ));
  }, []);

  const [escalations, setEscalations] = useState([
    {
      id: 'esc-1',
      sessionDate: '18/04/2026',
      customer: 'Anita Reddy',
      escalatedTo: 'Rahul Mehra',
      reason: 'Critical pricing dispute over 3 BHK availability.',
      status: 'Resolved',
      timestamp: '2 hours ago'
    }
  ]);

  const addEscalation = useCallback((escalation) => {
    setEscalations((prev) => [
      {
        id: `esc-${Date.now()}`,
        timestamp: 'Just now',
        status: 'Pending',
        ...escalation
      },
      ...prev
    ]);
  }, []);

  const triggerIncomingCall = useCallback((leadId) => {
    const lead = leads.find(l => l.id === leadId) || leads[0];
    setIncomingCall({
      id: `call-${Date.now()}`,
      lead,
      type: 'Incoming',
      timestamp: new Date().toLocaleTimeString(),
      aiHistory: [
        { id: 'h1', sender: 'customer', text: 'Hi, I saw your Adani Western Heights project. Is it still available?' },
        { id: 'h2', sender: 'agent', text: 'Hello! Yes, we have limited 4 BHK units available. Would you like to know about the pricing or location features?' },
        { id: 'h3', sender: 'customer', text: 'Both. But first, tell me about the proximity to the airport.' },
        { id: 'h4', sender: 'agent', text: 'Western Heights is just 15 minutes from the International Airport. Regarding pricing, would you like a detailed brochure?' },
        { id: 'h5', sender: 'customer', text: 'Yes, but I have some specific questions about the floor plan. Can I speak to an agent?' }
      ]
    });
  }, []);

  const acceptCall = useCallback(() => {
    if (incomingCall) {
      setActiveCustomer(incomingCall.lead);
      setTranscriptMessages(incomingCall.aiHistory);
      setIncomingCall(null);
      setCallState('active');
    }
  }, [incomingCall]);

  const addTranscriptMessage = useCallback((message) => {
    setTranscriptMessages((prev) => [...prev, message]);
  }, []);

  const resetCallSession = useCallback(() => {
    setCallState('idle');
    setTranscriptMessages([]);
    setAiSuggestions([]);
    setVisitBooked(false);
    setDisposition('');
    setIncomingCall(null);
  }, []);

  const completeCallWithQa = useCallback(
    ({ startedAt, endedAt }) => {
      const durationSeconds = Math.max(10, Math.floor((endedAt - startedAt) / 1000));
      const qa = computeQaFromCall({
        transcript: transcriptMessages,
        visitBooked,
        disposition,
        durationSeconds,
      });

      const minutes = Math.floor(durationSeconds / 60);
      const seconds = durationSeconds % 60;
      const duration = `${minutes}m ${String(seconds).padStart(2, '0')}s`;

      const summary = {
        customerName: activeCustomer?.name || 'Unknown Customer',
        customerId: activeCustomer?.id,
        duration,
        durationSeconds,
        visitBooked,
        disposition: disposition || 'No disposition recorded',
        transcriptCount: transcriptMessages.length,
      };

      setQaResult(qa);
      setLastCallSummary(summary);

      if (activeCustomer) {
        setCallRecords((prev) => [
          {
            id: `record-${Date.now()}`,
            date: new Date().toLocaleDateString('en-IN'),
            time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
            agent: 'Riya Sharma',
            customer: activeCustomer.name,
            duration,
            durationSeconds,
            outcome: visitBooked ? 'Visit Booked' : disposition || 'Follow-up',
            sentiment: sentimentFromTranscript(transcriptMessages),
            score: qa.total,
            breakdown: qa.breakdown,
            softSkills: qa.softSkills,
            summary: `${activeCustomer.name} discussed ${activeCustomer.propertyInterest}. ${visitBooked ? 'Visit booked.' : 'Needs follow-up.'}`,
            transcript: transcriptMessages,
            sentimentProgress: qa.total,
          },
          ...prev,
        ]);
      }

      return qa;
    },
    [activeCustomer, transcriptMessages, visitBooked, disposition],
  );

  const value = useMemo(
    () => ({
      callState,
      setCallState,
      activeCustomer,
      setActiveCustomer,
      transcriptMessages,
      setTranscriptMessages,
      addTranscriptMessage,
      aiSuggestions,
      setAiSuggestions,
      qaResult,
      setQaResult,
      callRecords,
      setCallRecords,
      resetCallSession,
      completeCallWithQa,
      visitBooked,
      setVisitBooked,
      lastCallSummary,
      setLastCallSummary,
      selectedLeadId,
      setSelectedLeadId,
      disposition,
      setDisposition,
      allProjects,
      setAllProjects,
      outboundCampaigns,
      setOutboundCampaigns,
      addProject,
      addCampaign,
      updateCampaignStatus,
      supervisorView,
      setSupervisorView,
      incomingCall,
      setIncomingCall,
      triggerIncomingCall,
      acceptCall,
      customerHistory,
      setCustomerHistory,
      inboundCampaigns,
      campaignData: { outbound: outboundCampaigns, inbound: inboundCampaigns },
      escalations,
      addEscalation,
    }),
    [
      callState,
      activeCustomer,
      transcriptMessages,
      aiSuggestions,
      qaResult,
      callRecords,
      addTranscriptMessage,
      resetCallSession,
      completeCallWithQa,
      visitBooked,
      lastCallSummary,
      selectedLeadId,
      disposition,
      allProjects,
      outboundCampaigns,
      inboundCampaigns,
      addProject,
      addCampaign,
      updateCampaignStatus,
      supervisorView,
      incomingCall,
      triggerIncomingCall,
      acceptCall,
      customerHistory,
      escalations,
      addEscalation,
    ],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

import { useCallback, useMemo, useState } from 'react';
import { defaultQaBreakdown, defaultSoftSkills, leads } from '../data/mockData';
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
      transcript: [
        { id: 't1', sender: 'agent', text: 'Hello Rohan, glad you called back about Western Heights.' },
        { id: 't2', sender: 'customer', text: 'Yes, is the price still the same as we discussed last week?' },
        { id: 't3', sender: 'agent', text: 'We have a small festive revision, but I can honor previous pricing if we book the site visit today.' },
        { id: 't4', sender: 'customer', text: 'Okay, let\'s do it for Sunday.' }
      ],
      breakdown: [
        { category: 'Greeting', score: 18, max: 20 },
        { category: 'Product explanation', score: 17, max: 20 },
        { category: 'Pricing', score: 16, max: 20 },
        { category: 'Objection handling', score: 15, max: 20 },
        { category: 'Closing', score: 18, max: 20 },
      ],
      softSkills: [
        { label: 'Empathy', value: 'Excellent' },
        { label: 'Clarity', value: 'Strong' },
        { label: 'Energy', value: 'High' },
        { label: 'Tone', value: 'Professional' },
        { label: 'Language match', value: 'Strong' },
      ],
      sentimentProgress: 84,
    },
    {
      id: 'seed-2',
      date: '19/04/2026',
      time: '02:30 PM',
      agent: 'Riya Sharma',
      customer: 'Sneha Desai',
      duration: '03m 45s',
      durationSeconds: 225,
      sentiment: 'Neutral',
      score: 62,
      outcome: 'Follow-up',
      summary: 'Sneha Desai discussed Adani Codename Capital - 2 BHK. Needs follow-up.',
      transcript: [
        { id: 't1', sender: 'agent', text: 'Hi Sneha, checking if you had a look at the brochure.' },
        { id: 't2', sender: 'customer', text: 'I did, but the 2 BHK seems a bit small for my family.' },
        { id: 't3', sender: 'agent', text: 'We have variant layouts, maybe I can show you the larger configuration.' },
        { id: 't4', sender: 'customer', text: 'Maybe next month, I am traveling right now.' }
      ],
      breakdown: [
        { category: 'Greeting', score: 14, max: 20 },
        { category: 'Product explanation', score: 12, max: 20 },
        { category: 'Pricing', score: 10, max: 20 },
        { category: 'Objection handling', score: 11, max: 20 },
        { category: 'Closing', score: 15, max: 20 },
      ],
      softSkills: [
        { label: 'Empathy', value: 'Average' },
        { label: 'Clarity', value: 'Moderate' },
        { label: 'Energy', value: 'Low' },
        { label: 'Tone', value: 'Neutral' },
        { label: 'Language match', value: 'Average' },
      ],
      sentimentProgress: 62,
    }
  ]);
  const [visitBooked, setVisitBooked] = useState(false);
  const [lastCallSummary, setLastCallSummary] = useState(null);
  const [selectedLeadId, setSelectedLeadId] = useState(leads[0]?.id ?? null);
  const [disposition, setDisposition] = useState('');

  const addTranscriptMessage = useCallback((message) => {
    setTranscriptMessages((prev) => [...prev, message]);
  }, []);

  const resetCallSession = useCallback(() => {
    setCallState('idle');
    setTranscriptMessages([]);
    setAiSuggestions([]);
    setVisitBooked(false);
    setDisposition('');
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
    ],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

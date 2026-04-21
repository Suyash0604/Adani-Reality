export const demoUsers = {
  agent: { id: 'u-agent-1', name: 'Riya Sharma', email: 'agent@adani.com', role: 'agent' },
  supervisor: { id: 'u-supervisor-1', name: 'Arjun Mehta', email: 'supervisor@adani.com', role: 'supervisor' },
  admin: { id: 'u-admin-1', name: 'Neha Kapoor', email: 'admin@adani.com', role: 'admin' },
};

export const leads = [
  {
    id: 'lead-1001',
    name: 'Vikram Patel',
    phone: '+91 98765 43210',
    city: 'Ahmedabad',
    leadSource: 'Google Ads',
    propertyInterest: 'Adani Atelier Greens - 3 BHK',
    budget: '1.5 Cr - 1.8 Cr',
    leadCreatedDate: '2026-04-18',
    previousInteractions: 'Asked for possession timeline and clubhouse amenities.',
    aiIntentScore: 82,
  },
  {
    id: 'lead-1002',
    name: 'Sneha Desai',
    phone: '+91 97654 32109',
    city: 'Pune',
    leadSource: 'Website Form',
    propertyInterest: 'Adani Codename Capital - 2 BHK',
    budget: '95L - 1.2 Cr',
    leadCreatedDate: '2026-04-19',
    previousInteractions: 'Requested virtual walkthrough and financing options.',
    aiIntentScore: 74,
  },
  {
    id: 'lead-1003',
    name: 'Rohan Nair',
    phone: '+91 99887 76655',
    city: 'Mumbai',
    leadSource: 'Referral',
    propertyInterest: 'Adani Western Heights - 4 BHK',
    budget: '2.2 Cr - 2.8 Cr',
    leadCreatedDate: '2026-04-17',
    previousInteractions: 'Interested in sea-facing units and parking allocation.',
    aiIntentScore: 89,
  },
];

export const transcriptScript = [
  { sender: 'agent', text: 'Hello Vikram ji, this is Riya from Adani Realty. Is this a good time to talk?' },
  { sender: 'customer', text: 'Hi, yes. I am exploring options in Ahmedabad right now.' },
  { sender: 'agent', text: 'Great. Are you looking for end-use or investment?' },
  { sender: 'customer', text: 'Mostly end-use, but I also want to understand future value.' },
  { sender: 'agent', text: 'Understood. Which configuration are you considering?' },
  { sender: 'customer', text: 'I am interested in a 3 BHK, but price will decide finally.' },
  { sender: 'agent', text: 'We have premium units with flexible payment plans.' },
  { sender: 'customer', text: 'Location is also important for me. Commute matters.' },
  { sender: 'agent', text: 'Perfect, I can help shortlist options near your office corridor.' },
  { sender: 'customer', text: 'Okay... also, what is the possession timeline?' },
  { sender: 'agent', text: 'Current phase possession is projected in Q4 2028, with construction updates every month.' },
  { sender: 'customer', text: 'Hmm, good. Any metro or highway connectivity nearby?' },
  { sender: 'agent', text: 'Yes, direct access to SG Highway and upcoming metro connectivity within a short drive.' },
  { sender: 'customer', text: 'That helps. Can you share approximate all-inclusive price for 3 BHK?' },
  { sender: 'agent', text: 'Sure, all-inclusive range is around 1.55 to 1.82 Cr depending on tower and floor preference.' },
  { sender: 'customer', text: 'Do you have any festive offer or payment flexibility?' },
  { sender: 'agent', text: 'Yes, we have a construction-linked plan and partner bank offers for lower EMI burden.' },
  { sender: 'customer', text: 'Sounds good. I would prefer a weekend visit with my family.' },
  { sender: 'agent', text: 'Excellent. I can block a guided site visit slot for Saturday at 11:30 AM.' },
  { sender: 'customer', text: 'Okay, please book it. Also share brochure and floor plan on WhatsApp.' },
  { sender: 'agent', text: 'Done. Visit is tentatively reserved. I will send brochure, floor plan and payment breakup right away.' },
  { sender: 'customer', text: 'Perfect, thank you. We can discuss final details after the visit.' },
  { sender: 'agent', text: 'Absolutely, looking forward to hosting you. I will stay available for any quick questions.' },
];

export const supervisorKpis = {
  activeCalls: 3,
  avgHandleTime: '06m 42s',
  siteVisitsBooked: 2,
  avgIntentScore: 79,
};

export const supervisorAgents = [
  {
    id: 'agent-1',
    name: 'Riya Sharma',
    status: 'On Call',
    customer: 'Vikram Patel',
    duration: '06:14',
    sentiment: '🙂',
    scriptScore: 81,
    alert: true,
  },
  {
    id: 'agent-2',
    name: 'Kunal Joshi',
    status: 'Hold',
    customer: 'Sneha Desai',
    duration: '03:52',
    sentiment: '😐',
    scriptScore: 69,
    alert: false,
  },
  {
    id: 'agent-3',
    name: 'Maya Rao',
    status: 'Available',
    customer: '-',
    duration: '-',
    sentiment: '🙂',
    scriptScore: 88,
    alert: false,
  },
];

export const defaultQaBreakdown = [
  { category: 'Greeting', score: 14, max: 20 },
  { category: 'Product explanation', score: 16, max: 20 },
  { category: 'Pricing', score: 13, max: 20 },
  { category: 'Objection handling', score: 12, max: 20 },
  { category: 'Closing', score: 16, max: 20 },
];

export const defaultSoftSkills = [
  { label: 'Empathy', value: 'Good' },
  { label: 'Clarity', value: 'Excellent' },
  { label: 'Energy', value: 'Moderate' },
  { label: 'Tone', value: 'Positive' },
  { label: 'Language match', value: 'Strong' },
];

export const securityMatrix = [
  {
    role: 'Admin',
    callRecordings: 'Full access',
    qaAccess: 'Full access',
    dataAccess: 'All regions',
  },
  {
    role: 'Supervisor',
    callRecordings: 'Team only',
    qaAccess: 'Team + escalations',
    dataAccess: 'Assigned projects',
  },
  {
    role: 'Agent',
    callRecordings: 'Own calls',
    qaAccess: 'Own scorecards',
    dataAccess: 'Assigned leads only',
  },
];

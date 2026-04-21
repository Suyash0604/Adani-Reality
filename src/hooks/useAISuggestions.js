import { useMemo } from 'react';

const suggestionsMap = {
  exploring: {
    trigger: 'exploring',
    title: 'Discovery Prompt',
    bullets: [
      'Ask move-in timeline and preferred unit size.',
      'Confirm whether this is end-use or investment.',
      'Suggest a guided walkthrough to build trust.',
    ],
    script:
      'I can shortlist 2 options aligned to your family needs and timeline. Would this weekend work for a site tour?',
  },
  price: {
    trigger: 'price',
    title: 'Pricing Assist',
    bullets: [
      'Lead with value before quoting sticker price.',
      'Introduce payment plans and limited-time offers.',
      'Offer EMI estimate for easier decision-making.',
    ],
    script: 'For this inventory, we have flexible payment plans and bank tie-ups. I can share a detailed breakup right now.',
  },
  location: {
    trigger: 'location',
    title: 'Location Positioning',
    bullets: [
      'Highlight connectivity and commute convenience.',
      'Mention schools, hospitals, and retail ecosystem.',
      'Reinforce appreciation potential in this micro-market.',
    ],
    script: 'This project is 12 minutes from the business district and close to key schools and hospitals.',
  },
};

const useAISuggestions = (latestCustomerMessage) => {
  return useMemo(() => {
    if (!latestCustomerMessage) return [];
    const text = latestCustomerMessage.toLowerCase();

    const matched = Object.entries(suggestionsMap)
      .filter(([keyword]) => text.includes(keyword))
      .map(([, suggestion]) => suggestion);

    if (matched.length > 0) return matched;

    return [
      {
        trigger: 'context',
        title: 'Conversation Continuity',
        bullets: [
          'Acknowledge customer response before next question.',
          'Reconfirm preference and urgency to maintain momentum.',
          'Move discussion toward conversion outcome.',
        ],
        script: 'Thanks, that helps. Based on this, may I schedule a guided site visit to help you compare options faster?',
      },
    ];
  }, [latestCustomerMessage]);
};

export default useAISuggestions;

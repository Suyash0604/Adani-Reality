import { useState } from 'react';
import { Phone, PauseCircle, MicOff, CalendarPlus, PhoneOff, Play, FileCheck2, Share2, MessageSquare, ShieldAlert, Search } from 'lucide-react';

const baseBtn =
  'inline-flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-[11px] font-black uppercase tracking-widest transition-all duration-200 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-45';

const outlineBtn = 'border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 hover:shadow-md';

const CallControlBar = ({
  callState,
  muted,
  onToggleMute,
  onStartCall,
  onHold,
  onResume,
  onBookVisit,
  onEndCall,
  onStartNewCall,
  onGoToQa,
  incomingCall,
  onAcceptCall,
  onRejectCall,
}) => {
  const [showTransfer, setShowTransfer] = useState(false);
  const isActive = callState === 'active';
  const isOnHold = callState === 'on_hold';
  const inLiveCall = isActive || isOnHold;
  const isEnded = callState === 'ended';

  const handleTransfer = (dept) => {
    onRejectCall(); // Resets call session
    setShowTransfer(false);
  };

  if (isEnded) {
    return (
      <div className="sticky bottom-0 z-20 border-t border-slate-200 bg-white/95 px-3 py-3 backdrop-blur-sm">
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            className={`${baseBtn} bg-emerald-600 text-white hover:bg-emerald-700 hover:shadow-lg`}
            onClick={onStartNewCall}
          >
            <Phone size={14} /> Start New Call
          </button>
          <button
            type="button"
            className={`${baseBtn} ${outlineBtn}`}
            onClick={onGoToQa}
          >
            <FileCheck2 size={14} /> View QA Report
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="sticky bottom-0 z-20 border-t border-slate-200 bg-white/95 px-3 py-3 backdrop-blur-sm">
      {showTransfer && (
        <div className="absolute bottom-full left-0 mb-2 w-48 bg-white rounded-xl shadow-2xl border border-slate-100 overflow-hidden animate-in slide-in-from-bottom-2">
          <div className="p-2 bg-slate-50 border-b border-slate-100">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Transfer Call to</p>
          </div>
          <button onClick={() => handleTransfer('Support')} className="w-full flex items-center gap-3 px-4 py-2.5 text-[11px] font-bold text-slate-600 hover:bg-blue-50 hover:text-blue-600 transition-colors">
            <MessageSquare size={14} /> Customer Service
          </button>
          <button onClick={() => handleTransfer('Grievance')} className="w-full flex items-center gap-3 px-4 py-2.5 text-[11px] font-bold text-slate-600 hover:bg-rose-50 hover:text-rose-600 transition-colors">
            <ShieldAlert size={14} /> Grievance Redressal
          </button>
          <button onClick={() => handleTransfer('Inquiry')} className="w-full flex items-center gap-3 px-4 py-2.5 text-[11px] font-bold text-slate-600 hover:bg-emerald-50 hover:text-emerald-600 transition-colors">
            <Search size={14} /> Sales Enquiry
          </button>
        </div>
      )}

      <div className="flex gap-2">
        <button
          type="button"
          className={`${baseBtn} flex-1 bg-emerald-600 text-white hover:bg-emerald-700 hover:shadow-lg`}
          onClick={incomingCall ? onAcceptCall : onStartCall}
          disabled={inLiveCall || callState === 'dialing'}
        >
          <Phone size={14} /> {incomingCall ? 'Accept' : 'Call'}
        </button>

        {incomingCall && (
          <button
            type="button"
            className={`${baseBtn} flex-1 border border-slate-300 bg-white text-slate-600 hover:bg-slate-50`}
            onClick={() => setShowTransfer(!showTransfer)}
          >
            <Share2 size={14} /> Transfer
          </button>
        )}

        <button 
          type="button" 
          className={`${baseBtn} flex-1 ${outlineBtn}`} 
          onClick={isOnHold ? onResume : onHold} 
          disabled={!inLiveCall}
        >
          {isOnHold ? (
            <><Play size={14} /> Resume</>
          ) : (
            <><PauseCircle size={14} /> Hold</>
          )}
        </button>

        <button type="button" className={`${baseBtn} flex-1 ${outlineBtn}`} onClick={onToggleMute} disabled={!inLiveCall}>
          <MicOff size={14} /> {muted ? 'Unmute' : 'Mute'}
        </button>

        <button
          type="button"
          className={`${baseBtn} flex-1 bg-amber-500 text-white hover:bg-amber-600 hover:shadow-lg`}
          onClick={onBookVisit}
          disabled={!inLiveCall}
        >
          <CalendarPlus size={14} /> Book Visit
        </button>

        <button
          type="button"
          className={`${baseBtn} flex-1 bg-[#D71920] text-white hover:bg-[#bf161c] hover:shadow-lg`}
          onClick={onEndCall}
          disabled={!inLiveCall}
        >
          <PhoneOff size={14} /> End Call
        </button>
      </div>
    </div>
  );
};


export default CallControlBar;

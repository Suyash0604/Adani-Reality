import { useState } from 'react';
import { Phone, PauseCircle, MicOff, CalendarPlus, PhoneOff, Play, FileCheck2, Share2, MessageSquare, ShieldAlert, Search, Mic, XCircle, CheckCircle2 } from 'lucide-react';

const CallControlBar = ({
  callState,
  callType,
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
  
  const isPreCall = callState === 'pre-call';
  const isActive = callState === 'active';
  const isOnHold = callState === 'on_hold';
  const isEnded = callState === 'ended';
  const isDialing = callState === 'dialing';
  const inLiveCall = isActive || isOnHold;

  const btnBase = "h-11 px-6 rounded-xl flex items-center justify-center gap-2.5 text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed shadow-sm";

  // State: ENDED
  if (isEnded) {
    return (
      <div className="flex gap-3 justify-center animate-in slide-in-from-bottom-2">
        <button
          onClick={onStartNewCall}
          className={`${btnBase} bg-blue-600 text-white hover:bg-blue-700 shadow-blue-200 shadow-lg`}
        >
          <Phone size={14} fill="currentColor" /> Start New Call
        </button>
        <button
          onClick={onGoToQa}
          className={`${btnBase} bg-white border border-slate-200 text-slate-600 hover:bg-slate-50`}
        >
          <FileCheck2 size={14} /> View QA Report
        </button>
      </div>
    );
  }

  // State: PRE-CALL (Incoming Preview)
  if (isPreCall) {
    return (
      <div className="flex gap-3 justify-center animate-in slide-in-from-bottom-2">
        <button
          onClick={onAcceptCall}
          className={`${btnBase} bg-blue-600 text-white hover:bg-blue-700 shadow-blue-200 shadow-xl px-12`}
        >
          <CheckCircle2 size={16} /> Accept Call
        </button>
        <button
          onClick={() => setShowTransfer(!showTransfer)}
          className={`${btnBase} bg-white border border-slate-200 text-slate-600 hover:bg-slate-50`}
        >
          <Share2 size={16} /> Transfer
        </button>
        <button
          onClick={onRejectCall}
          className={`${btnBase} bg-rose-50 text-rose-600 border border-rose-100 hover:bg-rose-100`}
        >
          <XCircle size={16} /> Reject
        </button>

        {showTransfer && (
          <div className="absolute bottom-16 left-1/2 -translate-x-1/2 w-56 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden animate-in zoom-in-95 duration-200 z-[60]">
            <div className="p-3 bg-slate-50 border-b border-slate-100"><p className="text-[9px] font-black text-slate-400 uppercase tracking-widest text-center">Transfer Call To</p></div>
            <div className="p-1">
              {[
                { id: 'Support', label: 'Customer Service', icon: MessageSquare, color: 'hover:bg-blue-50 hover:text-blue-600' },
                { id: 'Grievance', label: 'Grievance Dept', icon: ShieldAlert, color: 'hover:bg-rose-50 hover:text-rose-600' },
                { id: 'Inquiry', label: 'Sales Enquiry', icon: Search, color: 'hover:bg-emerald-50 hover:text-emerald-600' },
              ].map((dept) => (
                <button key={dept.id} onClick={() => onRejectCall()} className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-[10px] font-bold text-slate-600 transition-colors ${dept.color}`}><dept.icon size={14} /> {dept.label}</button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative flex items-center justify-center gap-3">
      {/* State: IDLE / DIALING */}
      {!inLiveCall && (
        <button
          onClick={onStartCall}
          disabled={isDialing}
          className={`${btnBase} bg-blue-600 text-white shadow-xl min-w-[200px]`}
        >
          <Phone size={16} fill="currentColor" /> 
          {isDialing ? 'Dialing...' : 'Start Outgoing Call'}
        </button>
      )}

      {/* State: ACTIVE / ON HOLD */}
      {inLiveCall && (
        <div className="flex gap-2 items-center bg-white/90 backdrop-blur-md p-1.5 rounded-2xl border border-slate-200 shadow-2xl animate-in slide-in-from-bottom-2">
          {/* Transfer button only for incoming calls as per request */}
          {callType === 'incoming' && (
            <button
              onClick={() => setShowTransfer(!showTransfer)}
              className={`${btnBase} bg-slate-50 text-slate-600 hover:bg-slate-100`}
            >
              <Share2 size={14} /> Transfer
            </button>
          )}

          <button
            onClick={isOnHold ? onResume : onHold}
            className={`${btnBase} bg-slate-50 text-slate-600 hover:bg-slate-100`}
          >
            {isOnHold ? <><Play size={14} fill="currentColor" /> Resume</> : <><PauseCircle size={14} /> Hold</>}
          </button>

          <button
            onClick={onToggleMute}
            className={`${btnBase} ${muted ? 'bg-rose-50 text-rose-600 border-rose-100' : 'bg-slate-50 text-slate-600'}`}
          >
            {muted ? <><MicOff size={14} /> Unmuted</> : <><Mic size={14} /> Mute</>}
          </button>

          <div className="w-px h-8 bg-slate-200 mx-1" />

          <button
            onClick={onBookVisit}
            className={`${btnBase} bg-amber-500 text-white hover:bg-amber-600 shadow-amber-200 shadow-lg`}
          >
            <CalendarPlus size={14} /> Book Visit
          </button>

          <button
            onClick={onEndCall}
            className={`${btnBase} bg-rose-600 text-white hover:bg-rose-700 shadow-rose-200 shadow-lg`}
          >
            <PhoneOff size={14} /> End Call
          </button>

          {showTransfer && (
            <div className="absolute bottom-16 left-1/2 -translate-x-1/2 w-56 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden animate-in zoom-in-95 duration-200 z-[60]">
              <div className="p-3 bg-slate-50 border-b border-slate-100"><p className="text-[9px] font-black text-slate-400 uppercase tracking-widest text-center">Transfer Call To</p></div>
              <div className="p-1">
                {[
                  { id: 'Support', label: 'Customer Service', icon: MessageSquare, color: 'hover:bg-blue-50 hover:text-blue-600' },
                  { id: 'Grievance', label: 'Grievance Dept', icon: ShieldAlert, color: 'hover:bg-rose-50 hover:text-rose-600' },
                  { id: 'Inquiry', label: 'Sales Enquiry', icon: Search, color: 'hover:bg-emerald-50 hover:text-emerald-600' },
                ].map((dept) => (
                  <button key={dept.id} onClick={() => onRejectCall()} className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-[10px] font-bold text-slate-600 transition-colors ${dept.color}`}><dept.icon size={14} /> {dept.label}</button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CallControlBar;

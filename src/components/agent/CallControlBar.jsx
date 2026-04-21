import { Phone, PauseCircle, MicOff, CalendarPlus, PhoneOff, Play, FileCheck2 } from 'lucide-react';

const baseBtn =
  'inline-flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition-all duration-200 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-45';

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
}) => {
  const isActive = callState === 'active';
  const isOnHold = callState === 'on_hold';
  const inLiveCall = isActive || isOnHold;
  const isEnded = callState === 'ended';

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
      <div className="grid grid-cols-6 gap-2">
        <button
          type="button"
          className={`${baseBtn} bg-emerald-600 text-white hover:bg-emerald-700 hover:shadow-lg`}
          onClick={onStartCall}
          disabled={inLiveCall || callState === 'dialing'}
        >
          <Phone size={14} /> Call
        </button>

        <button type="button" className={`${baseBtn} ${outlineBtn}`} onClick={onHold} disabled={!isActive}>
          <PauseCircle size={14} /> Hold
        </button>

        <button type="button" className={`${baseBtn} ${outlineBtn}`} onClick={onResume} disabled={!isOnHold}>
          <Play size={14} /> Resume
        </button>

        <button type="button" className={`${baseBtn} ${outlineBtn}`} onClick={onToggleMute} disabled={!inLiveCall}>
          <MicOff size={14} /> {muted ? 'Unmute' : 'Mute'}
        </button>

        <button
          type="button"
          className={`${baseBtn} bg-amber-500 text-white hover:bg-amber-600 hover:shadow-lg`}
          onClick={onBookVisit}
          disabled={!inLiveCall}
        >
          <CalendarPlus size={14} /> Book Visit
        </button>

        <button
          type="button"
          className={`${baseBtn} bg-[#D71920] text-white hover:bg-[#bf161c] hover:shadow-lg`}
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

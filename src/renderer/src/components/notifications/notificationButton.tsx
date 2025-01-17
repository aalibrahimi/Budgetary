
import '../componentAssets/notificationButton.css'

interface Props {
  category: string
  msg: string
}

const NotifyButton = (props: Props) => {
  return (
    <button className="group relative" id="notif-trans">
      <div className="absolute -right-2 -top-2 z-10">
        <div className="flex h-5 w-5 items-center justify-center">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
          <span className="relative inline-flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white"></span>
        </div>
      </div>
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-bl from-gray-900 via-gray-950 to-black p-[1px] shadow-2xl shadow-emerald-500/20">
        <div className="relative flex items-center gap-4 rounded-xl bg-gray-950 px-6 py-3 transition-all duration-300 group-hover:bg-gray-950/50">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-400 to-emerald-600 transition-transform duration-300 group-hover:scale-110">
            <svg stroke="currentColor" viewBox="0 0 24 24" fill="none" className="h-5 w-5 text-white">
              <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
            </svg>
            <div className="absolute inset-0 rounded-lg bg-emerald-500/50 blur-sm transition-all duration-300 group-hover:blur-md" />
          </div>
          <div className="flex flex-col items-start">
            <span className="text-sm font-semibold text-white">{props.category}</span>
            <span className="text-[10px] font-medium text-emerald-400/80">{props.msg}</span>
          </div>
          {/* <div className="ml-auto flex items-center gap-1">
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 transition-transform duration-300 group-hover:scale-150" />
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500/50 transition-transform duration-300 group-hover:scale-150 group-hover:delay-100" />
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500/30 transition-transform duration-300 group-hover:scale-150 group-hover:delay-200" />
          </div> */}
        </div>
        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-emerald-400 via-emerald-500 to-emerald-600 opacity-20 transition-opacity duration-300 group-hover:opacity-40" />
      </div>
    </button>
  );
}

export default NotifyButton;


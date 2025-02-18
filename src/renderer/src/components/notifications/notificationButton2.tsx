import React from 'react';
import '../componentAssets/notificationButton.css'

interface Props {
  category: string;
  msg: string;
  isVisible: boolean;
  onClose: () => void;
}

const NotifyButton2: React.FC<Props> = ({ category, msg, isVisible, onClose }) => {
  return (
    <div className={`notif-trans ${isVisible ? '' : 'hidden'}`}>
      <div className="flex w-3/4 h-24 overflow-hidden bg-white shadow-lg max-w-96 rounded-xl">
        <svg width={16} height={96} xmlns="http://www.w3.org/2000/svg">
          <path
            d="M 8 0
               Q 4 4.8, 8 9.6
               T 8 19.2
               Q 4 24, 8 28.8
               T 8 38.4
               Q 4 43.2, 8 48
               T 8 57.6
               Q 4 62.4, 8 67.2
               T 8 76.8
               Q 4 81.6, 8 86.4
               T 8 96
               L 0 96
               L 0 0
               Z"
            fill="tan"
            stroke="tan"
            strokeWidth={2}
            strokeLinecap="round"
          />
        </svg>
        <div className="mx-2.5 overflow-hidden w-full">
          <p className="mt-1.5 text-xl font-bold text-[peru] leading-8 mr-3 overflow-hidden text-ellipsis whitespace-nowrap">
            {category}
          </p>
          <p className="overflow-hidden leading-5 break-all text-zinc-400 max-h-10">
            {msg}
          </p>
        </div>
        <button className="w-16 cursor-pointer focus:outline-none" aria-label="Close notification" onClick={onClose}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" strokeWidth={2} stroke="peru" fill="none" className="w-7 h-7">
            <path d="M6 18L18 6M6 6l12 12" strokeLinejoin="round" strokeLinecap="round" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default NotifyButton2;

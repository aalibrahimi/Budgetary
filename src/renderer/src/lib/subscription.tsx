import React from 'react';
import {
  Music,
  Video,
  Tv,
  Headphones,
  Cloud,
  ShoppingBag,
  Newspaper,
  Book,
  Gamepad2,
  MessageSquare,
  Shield,
  Server,
  Coffee,
  Dumbbell,
  CreditCard,
  Globe,
  Mail,
  HardDrive,
  Film,
  Ticket,
  PenTool,
  Mic,
  Gift,
  Radio,
  Lightbulb,
  Zap,
  MonitorSmartphone,
  PartyPopper,
  LayoutGrid,
  BookOpen,
  AppWindow,
  Bot,
  BadgeCheck
} from 'lucide-react';

export type SubscriptionIconType = {
  icon: React.ReactNode;
  color: string;
  backgroundColor: string;
}

// Define subscription service categories with their icons and colors
const subscriptionIcons: Record<string, SubscriptionIconType> = {
  // Streaming Video
  'Netflix': {
    icon: <Tv />,
    color: '#E50914',
    backgroundColor: 'rgba(229, 9, 20, 0.1)'
  },
  'Disney+': {
    icon: <Tv />,
    color: '#0063e5',
    backgroundColor: 'rgba(0, 99, 229, 0.1)'
  },
  'Hulu': {
    icon: <Tv />,
    color: '#1ce783',
    backgroundColor: 'rgba(28, 231, 131, 0.1)'
  },
  'HBO Max': {
    icon: <Tv />,
    color: '#5822b4',
    backgroundColor: 'rgba(88, 34, 180, 0.1)'
  },
  'Amazon Prime': {
    icon: <ShoppingBag />,
    color: '#00A8E1',
    backgroundColor: 'rgba(0, 168, 225, 0.1)'
  },
  'Apple TV+': {
    icon: <Tv />,
    color: '#000000',
    backgroundColor: 'rgba(0, 0, 0, 0.1)'
  },
  'YouTube Premium': {
    icon: <Video />,
    color: '#FF0000',
    backgroundColor: 'rgba(255, 0, 0, 0.1)'
  },
  'Paramount+': {
    icon: <Tv />,
    color: '#0064FF',
    backgroundColor: 'rgba(0, 100, 255, 0.1)'
  },
  'Peacock': {
    icon: <Tv />,
    color: '#00C298',
    backgroundColor: 'rgba(0, 194, 152, 0.1)'
  },
  'Discovery+': {
    icon: <Tv />,
    color: '#0A77E8',
    backgroundColor: 'rgba(10, 119, 232, 0.1)'
  },
  'Crunchyroll': {
    icon: <Tv />,
    color: '#F47521',
    backgroundColor: 'rgba(244, 117, 33, 0.1)'
  },
  
  // Music Streaming
  'Spotify': {
    icon: <Music />,
    color: '#1DB954',
    backgroundColor: 'rgba(29, 185, 84, 0.1)'
  },
  'Apple Music': {
    icon: <Music />,
    color: '#FB233B',
    backgroundColor: 'rgba(251, 35, 59, 0.1)'
  },
  'Tidal': {
    icon: <Music />,
    color: '#000000',
    backgroundColor: 'rgba(0, 0, 0, 0.1)'
  },
  'YouTube Music': {
    icon: <Music />,
    color: '#FF0000',
    backgroundColor: 'rgba(255, 0, 0, 0.1)'
  },
  'SoundCloud': {
    icon: <Music />,
    color: '#FF5500',
    backgroundColor: 'rgba(255, 85, 0, 0.1)'
  },
  'Amazon Music': {
    icon: <Music />,
    color: '#00A8E1',
    backgroundColor: 'rgba(0, 168, 225, 0.1)'
  },
  'Pandora': {
    icon: <Music />,
    color: '#3668FF',
    backgroundColor: 'rgba(54, 104, 255, 0.1)'
  },
  'Deezer': {
    icon: <Music />,
    color: '#00C7F2',
    backgroundColor: 'rgba(0, 199, 242, 0.1)'
  },
  
  // Software and Productivity
  'Microsoft 365': {
    icon: <AppWindow />,
    color: '#0078D4',
    backgroundColor: 'rgba(0, 120, 212, 0.1)'
  },
  'Adobe Creative Cloud': {
    icon: <PenTool />,
    color: '#FF0000',
    backgroundColor: 'rgba(255, 0, 0, 0.1)'
  },
  'Google Workspace': {
    icon: <LayoutGrid />,
    color: '#4285F4',
    backgroundColor: 'rgba(66, 133, 244, 0.1)'
  },
  'Dropbox': {
    icon: <Cloud />,
    color: '#0061FF',
    backgroundColor: 'rgba(0, 97, 255, 0.1)'
  },
  'Google Drive': {
    icon: <Cloud />,
    color: '#4285F4',
    backgroundColor: 'rgba(66, 133, 244, 0.1)'
  },
  'iCloud': {
    icon: <Cloud />,
    color: '#3D9AE8',
    backgroundColor: 'rgba(61, 154, 232, 0.1)'
  },
  'OneDrive': {
    icon: <Cloud />,
    color: '#0078D4',
    backgroundColor: 'rgba(0, 120, 212, 0.1)'
  },
  'LastPass': {
    icon: <Shield />,
    color: '#D32D27',
    backgroundColor: 'rgba(211, 45, 39, 0.1)'
  },
  '1Password': {
    icon: <Shield />,
    color: '#0964FF',
    backgroundColor: 'rgba(9, 100, 255, 0.1)'
  },
  'Notion': {
    icon: <BookOpen />,
    color: '#000000',
    backgroundColor: 'rgba(0, 0, 0, 0.1)'
  },
  'Evernote': {
    icon: <BookOpen />,
    color: '#00A82D',
    backgroundColor: 'rgba(0, 168, 45, 0.1)'
  },
  
  // Gaming
  'Xbox Game Pass': {
    icon: <Gamepad2 />,
    color: '#107C10',
    backgroundColor: 'rgba(16, 124, 16, 0.1)'
  },
  'PlayStation Plus': {
    icon: <Gamepad2 />,
    color: '#006FCD',
    backgroundColor: 'rgba(0, 111, 205, 0.1)'
  },
  'Nintendo Switch Online': {
    icon: <Gamepad2 />,
    color: '#E60012',
    backgroundColor: 'rgba(230, 0, 18, 0.1)'
  },
  'EA Play': {
    icon: <Gamepad2 />,
    color: '#FF4747',
    backgroundColor: 'rgba(255, 71, 71, 0.1)'
  },
  'Ubisoft+': {
    icon: <Gamepad2 />,
    color: '#0070FF',
    backgroundColor: 'rgba(0, 112, 255, 0.1)'
  },
  'Humble Bundle': {
    icon: <Gift />,
    color: '#CB272C',
    backgroundColor: 'rgba(203, 39, 44, 0.1)'
  },
  
  // Communication and Social
  'Discord Nitro': {
    icon: <MessageSquare />,
    color: '#5865F2',
    backgroundColor: 'rgba(88, 101, 242, 0.1)'
  },
  'Slack': {
    icon: <MessageSquare />,
    color: '#4A154B',
    backgroundColor: 'rgba(74, 21, 75, 0.1)'
  },
  'Zoom': {
    icon: <Video />,
    color: '#2D8CFF',
    backgroundColor: 'rgba(45, 140, 255, 0.1)'
  },
  'Twitch': {
    icon: <Video />,
    color: '#9146FF',
    backgroundColor: 'rgba(145, 70, 255, 0.1)'
  },
  'LinkedIn Premium': {
    icon: <BadgeCheck />,
    color: '#0077B5',
    backgroundColor: 'rgba(0, 119, 181, 0.1)'
  },
  
  // VPN Services
  'NordVPN': {
    icon: <Shield />,
    color: '#4687FF',
    backgroundColor: 'rgba(70, 135, 255, 0.1)'
  },
  'ExpressVPN': {
    icon: <Shield />,
    color: '#DA3940',
    backgroundColor: 'rgba(218, 57, 64, 0.1)'
  },
  'Surfshark': {
    icon: <Shield />,
    color: '#008485',
    backgroundColor: 'rgba(0, 132, 133, 0.1)'
  },
  'CyberGhost': {
    icon: <Shield />,
    color: '#FDD035',
    backgroundColor: 'rgba(253, 208, 53, 0.1)'
  },
  
  // News and Information
  'New York Times': {
    icon: <Newspaper />,
    color: '#000000',
    backgroundColor: 'rgba(0, 0, 0, 0.1)'
  },
  'Wall Street Journal': {
    icon: <Newspaper />,
    color: '#0274B6',
    backgroundColor: 'rgba(2, 116, 182, 0.1)'
  },
  'Washington Post': {
    icon: <Newspaper />,
    color: '#000000',
    backgroundColor: 'rgba(0, 0, 0, 0.1)'
  },
  'Financial Times': {
    icon: <Newspaper />,
    color: '#FFF1E5',
    backgroundColor: 'rgba(255, 241, 229, 0.1)'
  },
  'The Athletic': {
    icon: <Newspaper />,
    color: '#000000',
    backgroundColor: 'rgba(0, 0, 0, 0.1)'
  },
  'Medium': {
    icon: <Book />,
    color: '#000000',
    backgroundColor: 'rgba(0, 0, 0, 0.1)'
  },
  'Substack': {
    icon: <Mail />,
    color: '#FF6719',
    backgroundColor: 'rgba(255, 103, 25, 0.1)'
  },
  
  // Books and Reading
  'Kindle Unlimited': {
    icon: <Book />,
    color: '#FF9900',
    backgroundColor: 'rgba(255, 153, 0, 0.1)'
  },
  'Audible': {
    icon: <Headphones />,
    color: '#F29111',
    backgroundColor: 'rgba(242, 145, 17, 0.1)'
  },
  'Scribd': {
    icon: <Book />,
    color: '#1E7B85',
    backgroundColor: 'rgba(30, 123, 133, 0.1)'
  },
  'Blinkist': {
    icon: <Book />,
    color: '#3DDD91',
    backgroundColor: 'rgba(61, 221, 145, 0.1)'
  },
  
  // Health and Fitness
  'Peloton': {
    icon: <Dumbbell />,
    color: '#D80026',
    backgroundColor: 'rgba(216, 0, 38, 0.1)'
  },
  'Fitbit Premium': {
    icon: <Dumbbell />,
    color: '#00B0B9',
    backgroundColor: 'rgba(0, 176, 185, 0.1)'
  },
  'Apple Fitness+': {
    icon: <Dumbbell />,
    color: '#FC2C03',
    backgroundColor: 'rgba(252, 44, 3, 0.1)'
  },
  'Strava': {
    icon: <Dumbbell />,
    color: '#FC4C02',
    backgroundColor: 'rgba(252, 76, 2, 0.1)'
  },
  'Headspace': {
    icon: <Lightbulb />,
    color: '#F47D31',
    backgroundColor: 'rgba(244, 125, 49, 0.1)'
  },
  'Calm': {
    icon: <Lightbulb />,
    color: '#2D97D3',
    backgroundColor: 'rgba(45, 151, 211, 0.1)'
  },
  
  // Food and Dining
  'DoorDash DashPass': {
    icon: <Coffee />,
    color: '#FF3008',
    backgroundColor: 'rgba(255, 48, 8, 0.1)'
  },
  'Uber Eats Pass': {
    icon: <Coffee />,
    color: '#000000',
    backgroundColor: 'rgba(0, 0, 0, 0.1)'
  },
  'Grubhub+': {
    icon: <Coffee />,
    color: '#FF8000',
    backgroundColor: 'rgba(255, 128, 0, 0.1)'
  },
  'HelloFresh': {
    icon: <Coffee />,
    color: '#6CB33F',
    backgroundColor: 'rgba(108, 179, 63, 0.1)'
  },
  'Blue Apron': {
    icon: <Coffee />,
    color: '#00A0DF',
    backgroundColor: 'rgba(0, 160, 223, 0.1)'
  },
  
  // Smart Home
  'Ring Protect': {
    icon: <MonitorSmartphone />,
    color: '#1E9FD6',
    backgroundColor: 'rgba(30, 159, 214, 0.1)'
  },
  'Nest Aware': {
    icon: <MonitorSmartphone />,
    color: '#00AFC6',
    backgroundColor: 'rgba(0, 175, 198, 0.1)'
  },
  'SimpliSafe': {
    icon: <MonitorSmartphone />,
    color: '#E50B0B',
    backgroundColor: 'rgba(229, 11, 11, 0.1)'
  },
  
  // Shopping
  'Walmart+': {
    icon: <ShoppingBag />,
    color: '#0071DC',
    backgroundColor: 'rgba(0, 113, 220, 0.1)'
  },
  'Instacart+': {
    icon: <ShoppingBag />,
    color: '#43B02A',
    backgroundColor: 'rgba(67, 176, 42, 0.1)'
  },
  
  // Email & Web
  'Proton Mail': {
    icon: <Mail />,
    color: '#6D4AFF',
    backgroundColor: 'rgba(109, 74, 255, 0.1)'
  },
  'Fastmail': {
    icon: <Mail />,
    color: '#11B4FF',
    backgroundColor: 'rgba(17, 180, 255, 0.1)'
  },
  'Wix': {
    icon: <Globe />,
    color: '#000000',
    backgroundColor: 'rgba(0, 0, 0, 0.1)'
  },
  'Squarespace': {
    icon: <Globe />,
    color: '#000000',
    backgroundColor: 'rgba(0, 0, 0, 0.1)'
  },
  'WordPress': {
    icon: <Globe />,
    color: '#21759B',
    backgroundColor: 'rgba(33, 117, 155, 0.1)'
  },
  
  // AI and Special Services
  'ChatGPT Plus': {
    icon: <Bot />,
    color: '#10A37F',
    backgroundColor: 'rgba(16, 163, 127, 0.1)'
  },
  'Midjourney': {
    icon: <PenTool />,
    color: '#1B87DE',
    backgroundColor: 'rgba(27, 135, 222, 0.1)'
  },
  'Canva Pro': {
    icon: <PenTool />,
    color: '#00C4CC',
    backgroundColor: 'rgba(0, 196, 204, 0.1)'
  },
  
  // Generic Categories
  'Entertainment': {
    icon: <PartyPopper />,
    color: '#FF4081',
    backgroundColor: 'rgba(255, 64, 129, 0.1)'
  },
  'Music': {
    icon: <Music />,
    color: '#1DB954',
    backgroundColor: 'rgba(29, 185, 84, 0.1)'
  },
  'Video': {
    icon: <Video />,
    color: '#FF0000',
    backgroundColor: 'rgba(255, 0, 0, 0.1)'
  },
  'Software': {
    icon: <AppWindow />,
    color: '#0078D4',
    backgroundColor: 'rgba(0, 120, 212, 0.1)'
  },
  'Gaming': {
    icon: <Gamepad2 />,
    color: '#7611F5',
    backgroundColor: 'rgba(118, 17, 245, 0.1)'
  },
  'Cloud Storage': {
    icon: <Cloud />,
    color: '#0061FF',
    backgroundColor: 'rgba(0, 97, 255, 0.1)'
  },
  'VPN': {
    icon: <Shield />,
    color: '#4687FF',
    backgroundColor: 'rgba(70, 135, 255, 0.1)'
  },
  'News': {
    icon: <Newspaper />,
    color: '#000000',
    backgroundColor: 'rgba(0, 0, 0, 0.1)'
  },
  'Books': {
    icon: <Book />,
    color: '#FF9900',
    backgroundColor: 'rgba(255, 153, 0, 0.1)'
  },
  'Fitness': {
    icon: <Dumbbell />,
    color: '#00B0B9',
    backgroundColor: 'rgba(0, 176, 185, 0.1)'
  },
  'Food': {
    icon: <Coffee />,
    color: '#FF3008',
    backgroundColor: 'rgba(255, 48, 8, 0.1)'
  },
  'Shopping': {
    icon: <ShoppingBag />,
    color: '#FF9900',
    backgroundColor: 'rgba(255, 153, 0, 0.1)'
  },
  'Email': {
    icon: <Mail />,
    color: '#6D4AFF',
    backgroundColor: 'rgba(109, 74, 255, 0.1)'
  },
  'Web': {
    icon: <Globe />,
    color: '#000000',
    backgroundColor: 'rgba(0, 0, 0, 0.1)'
  },
  'Smart Home': {
    icon: <MonitorSmartphone />,
    color: '#00AFC6',
    backgroundColor: 'rgba(0, 175, 198, 0.1)'
  },
  'Productivity': {
    icon: <Zap />,
    color: '#0078D4',
    backgroundColor: 'rgba(0, 120, 212, 0.1)'
  },
  'Communication': {
    icon: <MessageSquare />,
    color: '#5865F2',
    backgroundColor: 'rgba(88, 101, 242, 0.1)'
  },
  'Security': {
    icon: <Shield />,
    color: '#4687FF',
    backgroundColor: 'rgba(70, 135, 255, 0.1)'
  },
  'AI': {
    icon: <Bot />,
    color: '#10A37F',
    backgroundColor: 'rgba(16, 163, 127, 0.1)'
  },
  'Services': {
    icon: <Server />,
    color: '#0078D4',
    backgroundColor: 'rgba(0, 120, 212, 0.1)'
  },
  'Health': {
    icon: <Lightbulb />,
    color: '#2D97D3',
    backgroundColor: 'rgba(45, 151, 211, 0.1)'
  },
  'Other': {
    icon: <CreditCard />,
    color: '#6E6E6E',
    backgroundColor: 'rgba(110, 110, 110, 0.1)'
  }
};

// Function to get subscription icon data
export const getSubscriptionIcon = (serviceName: string): SubscriptionIconType => {
  // First try to match exactly
  if (subscriptionIcons[serviceName]) {
    return subscriptionIcons[serviceName];
  }
  
  // Try to match by checking if the service name contains any of our known services
  const lowerServiceName = serviceName.toLowerCase();
  for (const [key, value] of Object.entries(subscriptionIcons)) {
    if (lowerServiceName.includes(key.toLowerCase())) {
      return value;
    }
  }
  
  // If no match, try to determine category
  if (lowerServiceName.includes('music') || lowerServiceName.includes('sound') || lowerServiceName.includes('audio')) {
    return subscriptionIcons['Music'];
  } else if (lowerServiceName.includes('video') || lowerServiceName.includes('tv') || lowerServiceName.includes('stream')) {
    return subscriptionIcons['Video'];
  } else if (lowerServiceName.includes('game') || lowerServiceName.includes('play')) {
    return subscriptionIcons['Gaming'];
  } else if (lowerServiceName.includes('cloud') || lowerServiceName.includes('storage')) {
    return subscriptionIcons['Cloud Storage'];
  } else if (lowerServiceName.includes('vpn') || lowerServiceName.includes('security')) {
    return subscriptionIcons['VPN'];
  } else if (lowerServiceName.includes('news') || lowerServiceName.includes('times') || lowerServiceName.includes('journal')) {
    return subscriptionIcons['News'];
  } else if (lowerServiceName.includes('book') || lowerServiceName.includes('read')) {
    return subscriptionIcons['Books'];
  } else if (lowerServiceName.includes('fitness') || lowerServiceName.includes('gym') || lowerServiceName.includes('workout')) {
    return subscriptionIcons['Fitness'];
  }
  
  // Default to Other
  return subscriptionIcons['Other'];
};

export default subscriptionIcons;
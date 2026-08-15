export interface SupportMessageReply {
  id: string;
  sender: 'admin' | 'user';
  senderName: string;
  senderEmail?: string;
  message: string;
  timestamp: number;
}

export interface SupportDeviceInfo {
  os: string;
  browser: string;
  deviceType: 'mobile' | 'tablet' | 'desktop';
  screen: string;
  language: string;
  platform: string;
  isOnline: boolean;
  appVersion?: string;
}

export type SupportCategory = 
  | 'general' 
  | 'spiritual_guidance' 
  | 'premium_issue' 
  | 'payment_support' 
  | 'technical_bug' 
  | 'custom_khatim' 
  | 'suggestion'
  | 'other';

export type SupportPriority = 'normal' | 'high' | 'urgent';

export type SupportStatus = 'unread' | 'read' | 'in_progress' | 'resolved' | 'archived';

export interface SupportMessage {
  id: string;
  ticketNumber: string; // e.g. #ASR-2026-8491
  userId: string;
  userName: string;
  userEmail: string;
  userPhoto?: string | null;
  userPhone?: string;
  userCountry?: string;
  accountTier: 'free' | 'standard' | 'premium' | 'pro' | 'trial';
  isPremium: boolean;
  isTrialActive?: boolean;
  spiritualPoints?: number;
  subject: string;
  category: SupportCategory;
  priority: SupportPriority;
  message: string;
  deviceInfo: SupportDeviceInfo;
  createdAt: number;
  updatedAt: number;
  status: SupportStatus;
  adminNotes?: string;
  replies?: SupportMessageReply[];
  emailDispatchedTo?: string; // Gmail address the ticket was dispatched to
}

export interface AdminSupportConfig {
  linkedGmail: string;
  autoOpenGmailCompose: boolean;
  emailNotificationsEnabled: boolean;
  supportPhoneWhatsapp?: string;
  autoReplyMessage?: string;
  updatedAt?: number;
}

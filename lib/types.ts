export type UserRole = "gestao" | "cliente";

export type GuestStatus = "pending" | "save_date_sent" | "invited" | "confirmed" | "maybe" | "declined";

export type Profile = {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  eventSlug: string | null;
  active: boolean;
  mustChangePassword?: boolean;
};

export type EventInfo = {
  id: string;
  slug: string;
  title: string;
  honoreeFullName: string;
  honoreePhotoUrl: string;
  headline: string;
  description: string;
  eventDate: string;
  startTime: string;
  endTime: string;
  locationName: string;
  locationUrl: string;
  address: string;
  bandName: string;
  bandUrl: string;
  bandStartTime: string;
  bandEndTime: string;
  buffetName: string;
  buffetUrl: string;
  isSurprise: boolean;
  theme: string;
  privacyNote: string;
};

export type GuestGroup = {
  id: string;
  eventId: string;
  name: string;
  tone: string;
};

export type Guest = {
  id: string;
  eventId: string;
  groupId: string | null;
  fullName: string;
  shortName: string;
  phone: string;
  token: string;
  status: GuestStatus;
  invitedNames: string[];
  maxCompanionsAdults: number;
  maxCompanionsChildren: number;
  companionsAdults: number;
  companionsChildren: number;
  dietaryNotes: string;
  notes: string;
  lastMessageStage: string;
  updatedAt: string;
};

export type MessageTemplate = {
  id: string;
  eventId: string;
  stage: string;
  audience: string;
  title: string;
  body: string;
};

export type TaskItem = {
  id: string;
  eventId: string;
  title: string;
  category: string;
  status: "pending" | "done";
  dueDate: string;
};

export type MemoryItem = {
  id: string;
  eventId: string;
  guestId: string | null;
  guestName: string;
  message: string;
  isApproved: boolean;
  createdAt: string;
};

export type SalesItem = {
  id: string;
  name: string;
  stage: string;
  nextStep: string;
  owner: string;
};

export type ContractItem = {
  id: string;
  clientName: string;
  plan: string;
  status: string;
  monthlyValue: string;
};


export type AcquisitionPlan = {
  id: string;
  slug: string;
  name: string;
  tag: string;
  description: string;
  idealFor: string;
  referencePrice: string;
  founderPrice: string;
  founderSlotsTotal: number;
  founderSlotsUsed: number;
  isActive: boolean;
  sortOrder: number;
  features: string[];
  ctaLabel: string;
};

export type ClientItem = {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: string;
  planSlug: string | null;
  eventSlug: string | null;
  createdAt: string;
};

export type PromotionItem = {
  id: string;
  planSlug: string | null;
  title: string;
  description: string;
  slotsTotal: number;
  slotsUsed: number;
  isActive: boolean;
};

export type EventBundle = {
  event: EventInfo;
  groups: GuestGroup[];
  guests: Guest[];
  messageTemplates: MessageTemplate[];
  tasks: TaskItem[];
  memories: MemoryItem[];
  sales: SalesItem[];
  contracts: ContractItem[];
};


export type SiteSettings = {
  solutionName: string;
  solutionDescription: string;
  aeSiteUrl: string;
  whatsappNumber: string;
  instagramUrl: string;
  facebookUrl: string;
  tiktokUrl: string;
  youtubeUrl: string;
  footerNote: string;
};

export type LeadDiagnostic = {
  id: string;
  name: string;
  whatsapp: string;
  email: string;
  eventType: string;
  eventDate: string;
  guestCount: string;
  hasGuestList: string;
  interestPlan: string;
  needsHelp: string;
  messageTone: string;
  urgency: string;
  notes: string;
  source: string;
  createdAt: string;
};

export type GuestStatus = "pending" | "save_date_sent" | "invited" | "confirmed" | "maybe" | "declined";

export type EventInfo = {
  id: string;
  slug: string;
  title: string;
  honoreeFullName: string;
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

export type EventBundle = {
  event: EventInfo;
  groups: GuestGroup[];
  guests: Guest[];
  messageTemplates: MessageTemplate[];
  tasks: TaskItem[];
};

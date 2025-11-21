// src/types.ts

// ==================================
// 전역 ActionType
// ==================================
export type ActionType = 
  | 'login' | 'logout' | 'get_profile'
  | 'get_properties' | 'add_property'
  | 'get_documents' | 'upload_document'
  | 'get_conversations' | 'send_chat_message'
  | 'get_links' | 'create_link' | 'update_link' | 'delete_link'
  | 'search_legal' | 'analyze_document'
  | 'export_pdf' | 'send_email' | 'add_to_calendar';

// ==================================
// 페이지 타입
// ==================================
export type Page = "home" | "search" | "checklist" | "chatbot" | "mypage";


// ==================================
// 데이터 모델 타입
// ==================================

export interface UserProfile {
  username: string;
  email: string;
  created_at: string;
}

export interface Document {
  id: number;
  doc_type: string;
  issued_at: string;
  address?: string; // 주소 정보는 있을 수도 있고 없을 수도 있음
}

export interface Property {
  id: number;
  address: string;
  documentCount: number;
  documents: Document[];
}

export interface Conversation {
  id: number;
  title: string;
  lastMessage: string;
  updated_at: string;
}

export interface ChatMessage {
  id?: string; // ID는 옵셔널
  role: 'user' | 'assistant';
  content: string;
  timestamp?: Date; // timestamp는 옵셔널
}

export interface Link {
  id: number;
  name: string;
  url: string;
  description: string;
}

export interface SearchResult {
  type: string;
  title: string;
  content: string;
  reference: string;
  fullContent?: string;
  date?: string;
  court?: string;
}

export interface ChecklistItemData {
  id: string;
  title: string;
  description?: string;
  what?: string;
  why?: string;
  isChecked: boolean;
  isCustom: boolean;
  links?: Array<{ label: string; url: string }>;
  guidelines?: string;
  hasCalendar?: boolean;
  isImportant?: boolean;
  isEditing?: boolean;
  hasRiskDiagnosis?: boolean;
  hasOwnerCheck?: boolean;
  hasRegistryAnalysis?: boolean;
  hasEmptyJeonseCheck?: boolean;
  actionType?: string;
  actionLabel?: string;
}

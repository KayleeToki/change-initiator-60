export interface BillSponsor {
  sponsor_id: number;
  sponsor_name: string;
  sponsor_type: string;
  party?: string;
  district?: string;
  role?: string;
}

export interface BillHistoryItem {
  date: string;
  action: string;
  chamber: string;
}

export interface Bill {
  bill_id: string;
  bill_number: string;
  title: string;
  description: string;
  state: string;
  state_id: number;
  urgency: 'high' | 'medium' | 'low';
  last_action_date: string;
  last_action: string;
  status: string;
  sponsors: BillSponsor[];
  url?: string;
  text_url?: string;
  aliases?: string[];
  history?: BillHistoryItem[];
  media?: {
    documents?: string[];
  };
}

export interface Comment {
  id: string;
  bill_id: string;
  state_abbr: string;
  author_name: string;
  author_email?: string;
  body: string;
  status: 'pending' | 'approved' | 'denied';
  created_at: string;
}

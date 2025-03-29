
// API service for fetching legislative data
import { toast } from "sonner";

export interface Bill {
  id: string;
  title: string;
  summary: string;
  state: string;
  county?: string;
  urgency: 'high' | 'medium' | 'low';
  expectedVoteDate: string;
  status: string;
  sponsors: string[];
  mediaUrls?: {
    images?: string[];
    videos?: string[];
    audio?: string[];
    documents?: string[];
  };
}

export interface MutualAidResource {
  id: string;
  name: string;
  type: 'food' | 'shelter' | 'event' | 'other';
  description: string;
  address?: string;
  date?: string;
  contactInfo?: string;
  url?: string;
}

export interface ForumPost {
  id: string;
  userId: string;
  username: string;
  title: string;
  content: string;
  mediaType?: 'text' | 'audio' | 'video';
  mediaUrl?: string;
  createdAt: string;
  likes: number;
  comments: number;
}

// Mock data for development - would be replaced with actual API calls
const MOCK_BILLS: Bill[] = [
  {
    id: "SB1234",
    title: "Clean Energy Act",
    summary: "A bill to promote renewable energy sources and reduce carbon emissions.",
    state: "California",
    urgency: 'high',
    expectedVoteDate: "2023-06-15",
    status: "In committee",
    sponsors: ["Sen. John Smith", "Sen. Jane Doe"],
    mediaUrls: {
      images: ["https://placehold.co/600x400?text=Clean+Energy"],
      documents: ["https://example.com/bill-pdf"]
    }
  },
  {
    id: "HB5678",
    title: "Education Funding Reform",
    summary: "Increases funding for public schools and teacher salaries.",
    state: "New York",
    urgency: 'medium',
    expectedVoteDate: "2023-07-20",
    status: "Passed House",
    sponsors: ["Rep. Michael Johnson", "Rep. Sarah Williams"],
    mediaUrls: {
      videos: ["https://example.com/video1"]
    }
  },
  {
    id: "AB9012",
    title: "Healthcare Accessibility Act",
    summary: "Expands healthcare coverage for low-income families.",
    state: "Texas",
    urgency: 'high',
    expectedVoteDate: "2023-06-10",
    status: "Pending vote",
    sponsors: ["Rep. Robert Brown", "Sen. Elizabeth Taylor"],
    mediaUrls: {
      documents: ["https://example.com/healthcare-pdf"]
    }
  },
  {
    id: "SB3456",
    title: "Housing Affordability Act",
    summary: "Creates incentives for affordable housing development.",
    state: "Florida",
    urgency: 'medium',
    expectedVoteDate: "2023-08-05",
    status: "In committee",
    sponsors: ["Sen. Christopher Lee", "Sen. Amanda Martinez"],
    mediaUrls: {
      images: ["https://placehold.co/600x400?text=Affordable+Housing"]
    }
  },
  {
    id: "HB7890",
    title: "Infrastructure Investment",
    summary: "Allocates funding for roads, bridges, and public transportation.",
    state: "Michigan",
    urgency: 'low',
    expectedVoteDate: "2023-09-15",
    status: "Introduced",
    sponsors: ["Rep. David Wilson", "Rep. Maria Garcia"],
    mediaUrls: {
      documents: ["https://example.com/infrastructure-pdf"]
    }
  },
  {
    id: "SB2468",
    title: "Criminal Justice Reform",
    summary: "Reforms sentencing guidelines and promotes rehabilitation programs.",
    state: "Illinois",
    urgency: 'high',
    expectedVoteDate: "2023-06-20",
    status: "Passed Senate",
    sponsors: ["Sen. Thomas White", "Sen. Patricia Brown"],
    mediaUrls: {
      videos: ["https://example.com/video2"]
    }
  }
];

const MOCK_MUTUAL_AID: MutualAidResource[] = [
  {
    id: "1",
    name: "Community Food Bank",
    type: "food",
    description: "Weekly food distribution for families in need.",
    address: "123 Main St, Springfield, IL",
    date: "Every Saturday, 9 AM - 12 PM",
    contactInfo: "info@communityfoodbank.org",
    url: "https://communityfoodbank.org"
  },
  {
    id: "2",
    name: "Shelter for Hope",
    type: "shelter",
    description: "Emergency shelter providing beds, meals, and support services.",
    address: "456 Oak Ave, Springfield, IL",
    contactInfo: "contact@shelterforhope.org",
    url: "https://shelterforhope.org"
  },
  {
    id: "3",
    name: "Neighborhood Cleanup",
    type: "event",
    description: "Community event to clean local parks and streets.",
    address: "Lincoln Park, Springfield, IL",
    date: "June 15, 2023, 10 AM - 2 PM",
    contactInfo: "events@cleanneighborhood.org",
    url: "https://signup.com/cleanup"
  }
];

const MOCK_FORUM_POSTS: ForumPost[] = [
  {
    id: "post1",
    userId: "user1",
    username: "CivicChampion",
    title: "Thoughts on the new infrastructure bill",
    content: "I've read through the proposed infrastructure bill and have some concerns about section 5...",
    mediaType: "text",
    createdAt: "2023-05-21T14:32:00Z",
    likes: 15,
    comments: 7
  },
  {
    id: "post2",
    userId: "user2",
    username: "EnvironmentalAdvocate",
    title: "Our community's response to climate policy",
    content: "I recorded this discussion from our town hall meeting about the local climate action plan.",
    mediaType: "audio",
    mediaUrl: "https://example.com/audio1",
    createdAt: "2023-05-20T09:15:00Z",
    likes: 23,
    comments: 12
  },
  {
    id: "post3",
    userId: "user3",
    username: "EducationReformer",
    title: "School board meeting highlights",
    content: "Key moments from yesterday's school board meeting discussing the budget for next year.",
    mediaType: "video",
    mediaUrl: "https://example.com/video1",
    createdAt: "2023-05-19T16:45:00Z",
    likes: 42,
    comments: 18
  }
];

// API functions
export async function getBillsByState(state: string): Promise<Bill[]> {
  // In a real app, this would make an actual API call
  console.log(`Fetching bills for state: ${state}`);
  return new Promise((resolve) => {
    setTimeout(() => {
      const filteredBills = MOCK_BILLS.filter(bill => bill.state.toLowerCase() === state.toLowerCase());
      resolve(filteredBills);
    }, 500); // Simulate network delay
  });
}

export async function getBillsByCounty(state: string, county: string): Promise<Bill[]> {
  console.log(`Fetching bills for county: ${county}, state: ${state}`);
  return new Promise((resolve) => {
    setTimeout(() => {
      // In a real app, this would filter by county as well
      const filteredBills = MOCK_BILLS.filter(bill => 
        bill.state.toLowerCase() === state.toLowerCase() && 
        (bill.county?.toLowerCase() === county.toLowerCase() || !bill.county)
      );
      resolve(filteredBills);
    }, 500);
  });
}

export async function getBillById(id: string): Promise<Bill | null> {
  console.log(`Fetching bill by ID: ${id}`);
  return new Promise((resolve) => {
    setTimeout(() => {
      const bill = MOCK_BILLS.find(bill => bill.id === id) || null;
      resolve(bill);
    }, 300);
  });
}

export async function getMutualAidByZipCode(zipCode: string): Promise<MutualAidResource[]> {
  console.log(`Fetching mutual aid resources for ZIP: ${zipCode}`);
  return new Promise((resolve) => {
    setTimeout(() => {
      // In a real app, this would filter by zip code
      resolve(MOCK_MUTUAL_AID);
    }, 500);
  });
}

export async function getForumPosts(): Promise<ForumPost[]> {
  console.log("Fetching forum posts");
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(MOCK_FORUM_POSTS);
    }, 500);
  });
}

export async function createForumPost(post: Omit<ForumPost, 'id' | 'createdAt' | 'likes' | 'comments'>): Promise<ForumPost> {
  console.log("Creating forum post", post);
  return new Promise((resolve) => {
    setTimeout(() => {
      const newPost: ForumPost = {
        ...post,
        id: `post${Date.now()}`,
        createdAt: new Date().toISOString(),
        likes: 0,
        comments: 0
      };
      toast.success("Post created successfully!");
      resolve(newPost);
    }, 700);
  });
}

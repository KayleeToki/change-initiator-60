// API service for fetching legislative data from LegiScan
import { toast } from "sonner";
import { statesList, getStateAbbreviation } from './states';

// LegiScan API configuration
const LEGISCAN_API_URL = "https://api.legiscan.com/";
const LEGISCAN_API_KEY = "e9117f10376dda025b85705917ec997e"; // Updated admin-provided API key

export interface Bill {
  bill_id: string;
  bill_number: string;
  title: string;
  description: string;
  state: string;
  state_id: number;
  county?: string;
  urgency: 'high' | 'medium' | 'low';
  last_action_date: string;
  last_action: string;
  status: string;
  sponsors: Array<{
    sponsor_id: number;
    sponsor_name: string;
    sponsor_type: string;
  }>;
  media?: {
    images?: string[];
    videos?: string[];
    audio?: string[];
    documents?: string[];
  };
  url?: string;
  text_url?: string;
  history?: Array<{
    date: string;
    action: string;
    chamber: string;
  }>;
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

// Mock data for forum and mutual aid (still needed until we implement those backends)
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

// Helper function to calculate bill urgency based on last action date
const calculateUrgency = (lastActionDate: string): 'high' | 'medium' | 'low' => {
  const today = new Date();
  const actionDate = new Date(lastActionDate);
  const diffTime = Math.abs(today.getTime() - actionDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays <= 14) return 'high';
  if (diffDays <= 30) return 'medium';
  return 'low';
};

// LegiScan API Functions
export async function getBillsByState(state: string): Promise<Bill[]> {
  console.log(`Fetching bills for state: ${state}`);

  try {
    // Convert state name to two-letter code
    const stateAbbreviation = getStateAbbreviation(state);
    
    // Get the master list of bills for the state
    const url = `${LEGISCAN_API_URL}/?key=${LEGISCAN_API_KEY}&op=getMasterList&state=${stateAbbreviation}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Error fetching bills: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if (data.status !== 'OK') {
      throw new Error(`API Error: ${data.status}`);
    }
    
    // Process the master list
    const billsList: Bill[] = [];
    const masterList = data.masterlist || {};
    
    // Limit to first 10 bills for performance (can be adjusted)
    let count = 0;
    for (const key in masterList) {
      if (key !== 'session' && masterList.hasOwnProperty(key) && count < 10) {
        const item = masterList[key];
        
        // Get detailed bill information for each bill
        const detailedBill = await getBillById(item.bill_id.toString());
        
        if (detailedBill) {
          billsList.push(detailedBill);
          count++;
        }
      }
    }
    
    return billsList;
  } catch (error) {
    console.error("Failed to fetch bills:", error);
    toast.error("Failed to fetch bills. Please try again later.");
    return [];
  }
}

export async function getBillsByCounty(state: string, county: string): Promise<Bill[]> {
  console.log(`Fetching bills for county: ${county}, state: ${state}`);
  
  // LegiScan doesn't support filtering by county directly
  // So we'll fetch all state bills and filter client-side
  const stateBills = await getBillsByState(state);
  
  // This is a placeholder for county filtering logic
  // In a real scenario, you'd need additional data to know which bills affect specific counties
  return stateBills.filter(bill => 
    bill.description && bill.description.toLowerCase().includes(county.toLowerCase())
  );
}

export async function getBillById(id: string): Promise<Bill | null> {
  console.log(`Fetching bill by ID: ${id}`);
  
  try {
    const url = `${LEGISCAN_API_URL}/?key=${LEGISCAN_API_KEY}&op=getBill&id=${id}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Error fetching bill: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if (data.status !== 'OK') {
      throw new Error(`API Error: ${data.status}`);
    }
    
    const billData = data.bill;
    
    // Transform the data to match our interface
    const bill: Bill = {
      bill_id: billData.bill_id.toString(),
      bill_number: billData.bill_number,
      title: billData.title,
      description: billData.description || billData.title,
      state: billData.state,
      state_id: billData.state_id,
      urgency: calculateUrgency(billData.last_action_date),
      last_action_date: billData.last_action_date,
      last_action: billData.last_action,
      status: billData.status || 'Pending',
      sponsors: billData.sponsors || [],
      url: billData.url,
      text_url: billData.texts && billData.texts.length > 0 ? billData.texts[0].url : undefined,
      history: billData.history || [],
      media: {
        documents: billData.texts ? billData.texts.map((text: any) => text.url) : []
      }
    };
    
    return bill;
  } catch (error) {
    console.error("Failed to fetch bill details:", error);
    toast.error("Failed to fetch bill details. Please try again later.");
    return null;
  }
}

export async function getMutualAidByZipCode(zipCode: string): Promise<MutualAidResource[]> {
  console.log(`Fetching mutual aid resources for ZIP: ${zipCode}`);
  return new Promise((resolve) => {
    setTimeout(() => {
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

// Remove API key management functions since we're using a hardcoded key

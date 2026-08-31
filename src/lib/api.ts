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
    party?: string;
    district?: string;
    role?: string;
  }>;

  media?: {
    images?: string[];
    videos?: string[];
    audio?: string[];
    documents?: string[];
  };
  url?: string;
  aliases?: string[];
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

const STATUS_LABELS: Record<number, string> = {
  1: 'Introduced',
  2: 'Engrossed',
  3: 'Enrolled',
  4: 'Passed',
  5: 'Vetoed',
  6: 'Failed / Died',
};

const decodeEntities = (value: string): string => {
  const el = document.createElement('textarea');
  el.innerHTML = value;
  return el.value;
};

// LegiScan formats numbers like "H1003" / "S0022"; users often type "HB1003" / "SB22"
const buildNumberAliases = (number: string): string[] => {
  const match = number.match(/^([A-Z]+)0*(\d+)$/i);
  if (!match) return [number];
  const [, prefix, digits] = match;
  const aliases = new Set<string>([number, `${prefix}${digits}`]);
  if (/^[HS]$/i.test(prefix)) {
    aliases.add(`${prefix}B${digits}`);
    aliases.add(`${prefix}B${digits.padStart(4, '0')}`);
  }
  return [...aliases];
};

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
    
    // Process the master list — every bill in the session, sorted by most recent activity
    const masterList = data.masterlist || {};

    const entries = Object.keys(masterList)
      .filter((key) => key !== 'session' && masterList[key]?.bill_id)
      .map((key) => masterList[key])
      .sort((a: any, b: any) => {
        const dateA = new Date(a.last_action_date || 0).getTime();
        const dateB = new Date(b.last_action_date || 0).getTime();
        if (dateB !== dateA) return dateB - dateA;
        return (b.bill_id || 0) - (a.bill_id || 0);
      });

    const billsList: Bill[] = entries.map((item: any) => {
      const number: string = item.number || '';
      return {
        bill_id: item.bill_id.toString(),
        bill_number: number,
        title: decodeEntities(item.title || ''),
        description: decodeEntities(item.description || item.title || ''),
        state: stateAbbreviation,
        state_id: 0,
        urgency: calculateUrgency(item.last_action_date),
        last_action_date: item.last_action_date || '',
        last_action: item.last_action || '',
        status: STATUS_LABELS[item.status] || 'Pending',
        sponsors: [],
        url: item.url,
        aliases: buildNumberAliases(number),
        history: [],
      };
    });

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
      sponsors: Array.isArray(billData.sponsors)
        ? billData.sponsors.map((s: any) => {
            const fullName =
              s.name ||
              [s.first_name, s.middle_name, s.last_name, s.suffix]
                .filter(Boolean)
                .join(' ')
                .trim() ||
              'Unknown sponsor';
            const type =
              s.sponsor_type_desc ||
              (s.sponsor_type_id === 1 ? 'Primary Sponsor' : s.sponsor_type_id === 2 ? 'Co-Sponsor' : 'Sponsor');
            return {
              sponsor_id: s.people_id ?? s.sponsor_id ?? 0,
              sponsor_name: fullName,
              sponsor_type: type,
              party: s.party || undefined,
              district: s.district || undefined,
              role: s.role || s.role_abbr || undefined,
            };
          })
        : [],

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

export interface ZipLocation {
  zip: string;
  city: string;
  state: string;
  stateAbbr: string;
}

export async function lookupZipCode(zipCode: string): Promise<ZipLocation | null> {
  const zip = zipCode.trim();
  if (!/^\d{5}$/.test(zip)) return null;

  try {
    const response = await fetch(`https://api.zippopotam.us/us/${zip}`);
    if (!response.ok) return null;
    const data = await response.json();
    const place = data?.places?.[0];
    if (!place) return null;
    return {
      zip,
      city: place['place name'],
      state: place['state'],
      stateAbbr: place['state abbreviation'],
    };
  } catch (error) {
    console.error('ZIP lookup failed:', error);
    return null;
  }
}

export async function getMutualAidByZipCode(zipCode: string): Promise<MutualAidResource[]> {
  const location = await lookupZipCode(zipCode);
  if (!location) {
    toast.error('Please enter a valid 5-digit US ZIP code.');
    return [];
  }

  const { zip, city, state, stateAbbr } = location;
  const area = `${city}, ${stateAbbr}`;
  const q = encodeURIComponent(`${city} ${stateAbbr} ${zip}`);

  return [
    {
      id: `${zip}-food-bank`,
      name: `Food Bank Locator — ${area}`,
      type: 'food',
      description: `Find Feeding America partner food banks and pantries serving ${area} and the surrounding ${state} area.`,
      address: area,
      contactInfo: 'Dial 211 for local food assistance',
      url: `https://www.feedingamerica.org/find-your-local-foodbank?zip=${zip}`,
    },
    {
      id: `${zip}-pantry`,
      name: `Community Pantries near ${zip}`,
      type: 'food',
      description: `Directory of free pantries, soup kitchens, and food-sharing sites listed near ZIP ${zip}.`,
      address: area,
      url: `https://www.foodpantries.org/searchzip/${zip}`,
    },
    {
      id: `${zip}-shelter`,
      name: `Emergency Shelters — ${area}`,
      type: 'shelter',
      description: `Emergency shelters, transitional housing, and cold-weather beds serving ${area}.`,
      address: area,
      contactInfo: 'Dial 211 for shelter placement',
      url: `https://www.homelessshelterdirectory.org/searchzip/${zip}`,
    },
    {
      id: `${zip}-housing`,
      name: `Housing & Utility Assistance — ${state}`,
      type: 'shelter',
      description: `Rent, utility, and eviction-prevention programs available to residents of ${area}.`,
      address: `${state} statewide`,
      url: `https://www.211.org/search/all?search=${q}`,
    },
    {
      id: `${zip}-events`,
      name: `Volunteer & Community Events near ${area}`,
      type: 'event',
      description: `Upcoming mutual aid drives, cleanups, and volunteer opportunities posted for ${area}.`,
      address: area,
      url: `https://www.volunteermatch.org/search?l=${q}`,
    },
    {
      id: `${zip}-org`,
      name: `Local Mutual Aid Networks — ${area}`,
      type: 'other',
      description: `Neighbor-to-neighbor mutual aid groups and community organizing hubs active around ${area}.`,
      address: area,
      url: `https://www.mutualaidhub.org/`,
    },
  ];
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

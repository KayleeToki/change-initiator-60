import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Bill, getBillsByState } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ArrowLeft, AlertTriangle, RefreshCw, Info } from 'lucide-react';
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

type Category =
  | 'Education'
  | 'Environment'
  | 'Health'
  | 'Transportation'
  | 'Public Safety'
  | 'Economy & Taxes'
  | 'Civil Rights'
  | 'Government & Elections'
  | 'Housing'
  | 'Labor'
  | 'Other';

const CATEGORY_RULES: { category: Category; keywords: RegExp }[] = [
  { category: 'Education', keywords: /\b(school|education|student|teacher|university|college|curriculum|tuition)\b/i },
  { category: 'Environment', keywords: /\b(environment|climate|pollut|conservation|wildlife|water|energy|emission|renewable|forest)\b/i },
  { category: 'Health', keywords: /\b(health|medicaid|medicare|hospital|insurance|abortion|mental|vaccin|disease|opioid|pharma)\b/i },
  { category: 'Transportation', keywords: /\b(transport|road|highway|transit|vehicle|traffic|infrastructure|bridge|rail)\b/i },
  { category: 'Public Safety', keywords: /\b(police|crime|firearm|gun|safety|prison|sentenc|drug|law enforcement|emergenc)\b/i },
  { category: 'Civil Rights', keywords: /\b(civil right|discriminat|equal|lgbt|gender|race|religion|free speech|voting right)\b/i },
  { category: 'Government & Elections', keywords: /\b(election|ballot|voter|campaign|ethics|government|legislat|redistrict)\b/i },
  { category: 'Economy & Taxes', keywords: /\b(tax|revenue|budget|appropriat|fund|fiscal|economic|business|commerce|trade)\b/i },
  { category: 'Housing', keywords: /\b(housing|rent|tenant|landlord|homeless|zoning|property)\b/i },
  { category: 'Labor', keywords: /\b(labor|worker|employ|wage|union|workplace|overtime)\b/i },
];

const categorize = (bill: Bill): Category => {
  const text = `${bill.title} ${bill.description ?? ''}`;
  for (const rule of CATEGORY_RULES) if (rule.keywords.test(text)) return rule.category;
  return 'Other';
};

const CATEGORY_COLORS: Record<Category, string> = {
  Education: 'bg-blue-600 text-white',
  Environment: 'bg-emerald-600 text-white',
  Health: 'bg-rose-600 text-white',
  Transportation: 'bg-slate-600 text-white',
  'Public Safety': 'bg-amber-600 text-white',
  'Economy & Taxes': 'bg-yellow-600 text-white',
  'Civil Rights': 'bg-purple-600 text-white',
  'Government & Elections': 'bg-indigo-600 text-white',
  Housing: 'bg-orange-600 text-white',
  Labor: 'bg-teal-600 text-white',
  Other: 'bg-zinc-600 text-white',
};

const BillsList = () => {
  const { state } = useParams<{ state: string }>();
  const navigate = useNavigate();
  const [bills, setBills] = useState<Bill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBills = async () => {
      if (state) {
        setLoading(true);
        setError(null);
        try {
          const data = await getBillsByState(state);
          const sortedBills = [...data].sort((a, b) => {
            const urgencyOrder = { high: 0, medium: 1, low: 2 };
            const urgencyDiff = urgencyOrder[a.urgency] - urgencyOrder[b.urgency];
            if (urgencyDiff !== 0) return urgencyDiff;
            return new Date(b.last_action_date).getTime() - new Date(a.last_action_date).getTime();
          });
          setBills(sortedBills);
        } catch (error) {
          console.error("Failed to fetch bills:", error);
          setError("Failed to fetch legislative data. Please try again later or check if the API service is available.");
          toast.error("API connection issue. This may be due to CORS restrictions or API availability.");
        } finally {
          setLoading(false);
        }
      }
    };
    fetchBills();
  }, [state]);

  const formatDate = (dateString: string) => {
    if (!dateString) return 'No date available';
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const urgencyExplanation = `"Sorted by urgency" means the docket is ordered from the most time-sensitive matters to the least. High-priority items — emergency motions, bills with imminent hearings or deadlines, and legislation that could cause significant harm if delayed — appear at the top so they can be reviewed and acted on first.`;

  return (
    <div className="theme-rook min-h-screen p-6 relative bg-background text-foreground">
      <Button
        variant="outline"
        className="mb-6 relative z-10"
        onClick={() => navigate('/map')}
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Map
      </Button>

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="mb-8 border-l-4 border-primary pl-5 py-2">
          <p className="text-primary uppercase tracking-[0.3em] text-xs font-semibold mb-2">
            The Rook's Watch · {state}
          </p>
          <h1 className="text-5xl font-serif font-bold mb-3 text-foreground">
            Legislation in {state}
          </h1>
          <p className="text-muted-foreground max-w-2xl">
            Browse proposed legislation currently on the docket in {state}. Bills are sorted by urgency —
            click any bill to read its summary, status, and research links. Head to the Forum to discuss
            these bills with neighbors, organize protests, and coordinate local civic action.
          </p>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="mt-3 inline-flex items-center gap-1.5 text-xs text-primary hover:underline">
                  <Info className="h-3.5 w-3.5" /> What does "sorted by urgency" mean?
                </button>
              </TooltipTrigger>
              <TooltipContent className="max-w-sm text-sm leading-relaxed">
                {urgencyExplanation}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        {loading ? (
          <div className="space-y-4 mt-4">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardHeader className="pb-2"><Skeleton className="h-6 w-3/4" /></CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-5/6" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : error ? (
          <Card className="w-full p-6 text-center mt-4">
            <div className="flex flex-col items-center justify-center">
              <AlertTriangle className="h-12 w-12 text-orange-500 mb-4" />
              <p className="text-foreground mb-2">{error}</p>
              <Button onClick={() => window.location.reload()} className="mt-2">
                <RefreshCw className="mr-2 h-4 w-4" /> Try Again
              </Button>
            </div>
          </Card>
        ) : bills.length > 0 ? (
          <div className="space-y-4 mt-4">
            {bills.map((bill) => {
              const category = categorize(bill);
              return (
                <Card
                  key={bill.bill_id}
                  className="w-full cursor-pointer transition-all bg-card border-border hover:border-primary/60 hover:shadow-lg hover:shadow-primary/10"
                  onClick={() => navigate(`/bill/${bill.bill_id}`)}
                >
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xl font-semibold flex items-center gap-3 text-card-foreground">
                      <Badge className={CATEGORY_COLORS[category]}>{category}</Badge>
                      {bill.bill_number}: {bill.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-3 text-muted-foreground">{bill.description}</p>
                    <div className="flex flex-wrap gap-2 text-sm">
                      <Badge variant="outline" className="font-normal">Bill ID: {bill.bill_id}</Badge>
                      <Badge variant="outline" className="font-normal">Last action: {formatDate(bill.last_action_date)}</Badge>
                      <Badge variant="outline" className="font-normal">Status: {bill.status}</Badge>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card className="w-full p-6 text-center mt-4">
            <p className="text-muted-foreground">No bills found for {state}.</p>
          </Card>
        )}
      </div>
    </div>
  );
};

export default BillsList;

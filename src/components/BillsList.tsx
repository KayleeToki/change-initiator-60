
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Bill, getBillsByState } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, AlertTriangle, RefreshCw } from 'lucide-react';
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

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
          // Sort by urgency and then by last action date
          const sortedBills = [...data].sort((a, b) => {
            // First sort by urgency
            const urgencyOrder = { high: 0, medium: 1, low: 2 };
            const urgencyDiff = urgencyOrder[a.urgency] - urgencyOrder[b.urgency];
            if (urgencyDiff !== 0) return urgencyDiff;
            
            // Then sort by last action date (most recent first)
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
  
  const getUrgencyClass = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'bg-red-500 text-white';
      case 'medium': return 'bg-orange-400 text-white';
      case 'low': return 'bg-yellow-300 text-gray-800';
      default: return 'bg-gray-300 text-gray-800';
    }
  };
  
  const formatDate = (dateString: string) => {
    if (!dateString) return 'No date available';
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  const isFlorida = state === 'Florida';

  return (
    <div
      className="min-h-screen p-6 relative"
      style={
        isFlorida
          ? {
              background:
                'radial-gradient(ellipse at top, #1a1a2e 0%, #0a0a14 60%, #000 100%)',
              color: '#e8e8e8',
            }
          : { background: '#f9fafb' }
      }
    >
      {isFlorida && (
        <>
          {/* Decorative rook bird silhouette */}
          <svg
            aria-hidden="true"
            className="absolute top-10 right-10 pointer-events-none"
            style={{ width: 'min(20vw, 220px)', opacity: 0.18 }}
            viewBox="0 0 200 200"
            fill="#c9a84c"
          >
            <path d="M40 130 c5 -30 25 -55 55 -60 c-8 -8 -10 -18 -6 -28 c6 6 14 8 22 6 c-2 8 0 16 6 22 c20 2 38 14 48 32 c4 8 6 18 4 28 c-4 -4 -10 -6 -16 -4 c2 6 0 14 -6 18 c-4 -6 -12 -8 -18 -4 c0 8 -6 14 -14 16 c-4 -6 -12 -8 -18 -4 c-2 6 -8 10 -16 10 c-2 -4 -6 -8 -12 -8 c-12 0 -22 -8 -29 -24 z" />
          </svg>
          {/* Decorative chess rook silhouette */}
          <svg
            aria-hidden="true"
            className="absolute bottom-10 left-10 pointer-events-none"
            style={{ width: 'min(18vw, 200px)', opacity: 0.15 }}
            viewBox="0 0 200 200"
            fill="#c9a84c"
          >
            <path d="M50 170 h100 v15 H50z M55 158 h90 v10 H55z M65 75 h70 v82 H65z M60 55 h12 v22 H60z M82 55 h12 v22 H82z M104 55 h12 v22 H104z M126 55 h12 v22 H126z M55 50 h90 v10 H55z" />
          </svg>
        </>
      )}

      <Button
        variant="outline"
        className={`mb-6 relative z-10 ${isFlorida ? 'bg-amber-100/90 border-amber-300 text-amber-950 hover:bg-amber-100' : ''}`}
        onClick={() => navigate('/map')}
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Map
      </Button>

      <div className="max-w-6xl mx-auto relative z-10">
        {isFlorida ? (
          <div className="mb-8 border-l-4 border-amber-400 pl-5 py-2">
            <p className="text-amber-400 uppercase tracking-[0.3em] text-xs font-semibold mb-2">
              The Rook's Watch · Florida
            </p>
            <h1 className="text-5xl font-serif font-bold mb-3 text-amber-50">
              Legislation in Florida
            </h1>
            <p className="text-amber-100/85 max-w-2xl">
              Browse proposed legislation currently on the docket in Florida. Bills are sorted by urgency —
              click any bill to read its summary, status, and research links. Head to the Forum to discuss
              these bills with neighbors, organize protests, and coordinate local civic action.
            </p>
          </div>
        ) : (
          <>
            <h1 className="text-3xl font-bold mb-2">Legislation in {state}</h1>
            <p className="text-gray-600 mb-6">
              Viewing current and upcoming bills sorted by urgency. Click on any bill for more details.
            </p>
          </>
        )}

        
        {loading ? (
          <div className="space-y-4 mt-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="w-full">
                <CardHeader className="pb-2">
                  <Skeleton className="h-6 w-3/4" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-5/6" />
                  <div className="flex gap-2 mt-4">
                    <Skeleton className="h-5 w-16" />
                    <Skeleton className="h-5 w-24" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : error ? (
          <Card className="w-full p-6 text-center mt-4">
            <div className="flex flex-col items-center justify-center">
              <AlertTriangle className="h-12 w-12 text-orange-500 mb-4" />
              <p className="text-gray-700 mb-2">{error}</p>
              <p className="text-sm text-gray-500 mb-4">
                The LegiScan API may have connection issues or CORS restrictions. 
              </p>
              <Button
                onClick={() => window.location.reload()}
                className="mt-2"
              >
                <RefreshCw className="mr-2 h-4 w-4" /> Try Again
              </Button>
            </div>
          </Card>
        ) : bills.length > 0 ? (
          <div className="space-y-4 mt-4">
            {bills.map((bill) => (
              <Card
                key={bill.bill_id}
                className={`w-full cursor-pointer transition-all ${
                  isFlorida
                    ? 'bg-gradient-to-br from-slate-900/90 to-slate-950/90 border-amber-500/30 hover:border-amber-400/70 hover:shadow-amber-500/20 hover:shadow-lg backdrop-blur'
                    : 'hover:shadow-md'
                }`}
                onClick={() => navigate(`/bill/${bill.bill_id}`)}
              >
                <CardHeader className="pb-2">
                  <CardTitle className={`text-xl font-semibold flex items-center gap-3 ${isFlorida ? 'text-amber-50' : ''}`}>
                    <Badge className={getUrgencyClass(bill.urgency)}>
                      {bill.urgency.charAt(0).toUpperCase() + bill.urgency.slice(1)} Priority
                    </Badge>
                    {bill.bill_number}: {bill.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className={`mb-3 ${isFlorida ? 'text-amber-100/75' : 'text-gray-600'}`}>{bill.description}</p>
                  <div className="flex flex-wrap gap-2 text-sm">
                    <Badge variant="outline" className={`font-normal ${isFlorida ? 'border-amber-500/40 text-amber-200' : ''}`}>
                      Bill ID: {bill.bill_id}
                    </Badge>
                    <Badge variant="outline" className={`font-normal ${isFlorida ? 'border-amber-500/40 text-amber-200' : ''}`}>
                      Last action: {formatDate(bill.last_action_date)}
                    </Badge>
                    <Badge variant="outline" className={`font-normal ${isFlorida ? 'border-amber-500/40 text-amber-200' : ''}`}>
                      Status: {bill.status}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}

          </div>
        ) : (
          <Card className="w-full p-6 text-center mt-4">
            <p className="text-gray-500">No bills found for {state}.</p>
          </Card>
        )}
      </div>
    </div>
  );
};

export default BillsList;

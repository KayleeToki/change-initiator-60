
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Bill, getBillById } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowLeft, 
  Calendar, 
  FileText, 
  Users, 
  Download, 
  Link, 
  AlertTriangle, 
  History 
} from 'lucide-react';
import { Skeleton } from "@/components/ui/skeleton";
import ApiKeyForm from '@/components/ApiKeyForm';

const BillDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [bill, setBill] = useState<Bill | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchBill = async () => {
      if (id) {
        setLoading(true);
        setError(null);
        try {
          const data = await getBillById(id);
          setBill(data);
          if (!data) {
            setError("Bill not found. It may have been removed or the ID is incorrect.");
          }
        } catch (err) {
          console.error("Failed to fetch bill:", err);
          setError("Failed to fetch bill details. Please try again later.");
        } finally {
          setLoading(false);
        }
      }
    };
    
    fetchBill();
  }, [id]);
  
  const getUrgencyClass = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'bg-red-500 text-white';
      case 'medium': return 'bg-orange-400 text-white';
      case 'low': return 'bg-yellow-300 text-foreground';
      default: return 'bg-gray-300 text-foreground';
    }
  };
  
  const formatDate = (dateString: string) => {
    if (!dateString) return 'No date available';
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  if (loading) {
    return (
      <div className="theme-bill min-h-screen bg-background text-foreground p-6">
        <Button 
          variant="outline" 
          className="mb-6"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        
        <div className="max-w-4xl mx-auto">
          <Card className="w-full">
            <CardHeader>
              <Skeleton className="h-8 w-3/4 mb-2" />
              <Skeleton className="h-5 w-1/3" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-6 w-1/2" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }
  
  if (error || !bill) {
    return (
      <div className="theme-bill min-h-screen bg-background text-foreground p-6">
        <Button 
          variant="outline" 
          className="mb-6"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        
        <div className="max-w-4xl mx-auto">
          <ApiKeyForm />
          
          <Card className="w-full p-8 mt-4 text-center">
            <AlertTriangle className="h-12 w-12 text-orange-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-4">{error || "Bill Not Found"}</h2>
            <p className="text-muted-foreground mb-6">
              {!error && "The bill you are looking for could not be found. It may have been removed or the ID is incorrect."}
            </p>
            <Button onClick={() => navigate(-1)}>
              Go Back
            </Button>
          </Card>
        </div>
      </div>
    );
  }
  
  return (
    <div className="theme-bill min-h-screen bg-background text-foreground p-6">
      <Button 
        variant="outline" 
        className="mb-6"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Back
      </Button>
      
      <div className="max-w-4xl mx-auto">
        <Card className="w-full mb-6">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <Badge className={getUrgencyClass(bill.urgency)}>
                {bill.urgency.charAt(0).toUpperCase() + bill.urgency.slice(1)} Priority
              </Badge>
              <Badge variant="outline">{bill.bill_number}</Badge>
            </div>
            <CardTitle className="text-2xl">{bill.title}</CardTitle>
            <CardDescription className="text-muted-foreground">
              <span className="inline-flex items-center">
                <Calendar className="h-4 w-4 mr-1" /> Last action: {formatDate(bill.last_action_date)}
              </span>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-background p-4 rounded-lg mb-6">
              <h3 className="font-semibold mb-2">Summary</h3>
              <p className="text-foreground/85">{bill.description || "No summary available."}</p>
            </div>
            
            <div className="mb-6">
              <h3 className="font-semibold mb-2 flex items-center">
                <Users className="h-4 w-4 mr-1" /> Sponsors
              </h3>
              {bill.sponsors && bill.sponsors.length > 0 ? (
                <ul className="space-y-2">
                  {bill.sponsors.map((sponsor, index) => {
                    const meta = [
                      sponsor.role,
                      sponsor.party,
                      sponsor.district ? `District ${sponsor.district}` : null,
                    ]
                      .filter(Boolean)
                      .join(' · ');
                    return (
                      <li
                        key={sponsor.sponsor_id || index}
                        className="flex flex-wrap items-baseline gap-x-2 bg-card border rounded-md p-3"
                      >
                        <span className="font-medium">{sponsor.sponsor_name}</span>
                        <Badge variant="outline" className="text-xs">
                          {sponsor.sponsor_type}
                        </Badge>
                        {meta && (
                          <span className="text-sm text-muted-foreground">{meta}</span>
                        )}
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No sponsors listed for this bill yet.
                </p>
              )}
            </div>

            
            <Tabs defaultValue="details">
              <TabsList className="mb-4">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="history">History</TabsTrigger>
                <TabsTrigger value="documents">Documents</TabsTrigger>
                <TabsTrigger value="actions">Take Action</TabsTrigger>
              </TabsList>
              
              <TabsContent value="details" className="space-y-4">
                <div className="bg-card p-4 rounded-lg border">
                  <h4 className="font-medium">Current Status</h4>
                  <p className="text-foreground/85">{bill.status}</p>
                </div>
                <div className="bg-card p-4 rounded-lg border">
                  <h4 className="font-medium">State</h4>
                  <p className="text-foreground/85">{bill.state}</p>
                </div>
                {bill.county && (
                  <div className="bg-card p-4 rounded-lg border">
                    <h4 className="font-medium">County</h4>
                    <p className="text-foreground/85">{bill.county}</p>
                  </div>
                )}
                <div className="bg-card p-4 rounded-lg border">
                  <h4 className="font-medium">Last Action</h4>
                  <p className="text-foreground/85">{bill.last_action}</p>
                </div>
              </TabsContent>
              
              <TabsContent value="history">
                {bill.history && bill.history.length > 0 ? (
                  <div className="space-y-2">
                    {bill.history.map((event, index) => (
                      <div key={index} className="bg-card p-4 rounded-lg border">
                        <div className="flex items-start gap-2">
                          <History className="h-5 w-5 text-muted-foreground mt-0.5" />
                          <div>
                            <p className="text-sm text-muted-foreground">{formatDate(event.date)}</p>
                            <p className="font-medium">{event.action}</p>
                            <p className="text-sm text-foreground/85">Chamber: {event.chamber}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center p-8 text-muted-foreground">
                    <p>No history available for this bill.</p>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="documents">
                {bill.media?.documents && bill.media.documents.length > 0 ? (
                  <div className="bg-card p-4 rounded-lg border">
                    <h4 className="font-medium mb-2">Official Documents</h4>
                    <div className="space-y-2">
                      {bill.media.documents.map((url, index) => (
                        <Button
                          key={index}
                          asChild
                          variant="outline"
                          className="w-full justify-start"
                        >
                          <a href={url} target="_blank" rel="noopener noreferrer">
                            <FileText className="h-4 w-4 mr-2" />
                            <span className="mr-2">Document {index + 1}</span>
                            <span className="text-blue-500 ml-auto">
                              <Download className="h-4 w-4" />
                            </span>
                          </a>
                        </Button>
                      ))}

                    </div>
                  </div>
                ) : bill.text_url ? (
                  <div className="bg-card p-4 rounded-lg border">
                    <h4 className="font-medium mb-2">Bill Text</h4>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={() => window.open(bill.text_url, '_blank')}
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      <span className="mr-2">View Bill Text</span>
                      <span className="text-blue-500 ml-auto">
                        <Download className="h-4 w-4" />
                      </span>
                    </Button>
                  </div>
                ) : (
                  <div className="text-center p-8 text-muted-foreground">
                    <p>No documents available for this bill.</p>
                  </div>
                )}

                {bill.url && (
                  <div className="bg-card p-4 rounded-lg border mt-4">
                    <h4 className="font-medium mb-2">Official Bill Page</h4>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={() => window.open(bill.url, '_blank')}
                    >
                      <Link className="h-4 w-4 mr-2" />
                      <span>Visit Official Bill Page</span>
                    </Button>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="actions">
                <div className="space-y-4">
                  <div className="bg-card p-4 rounded-lg border">
                    <h4 className="font-medium mb-2">Contact Your Representatives</h4>
                    <p className="text-foreground/85 mb-4">
                      Let your representatives know your thoughts on this bill.
                    </p>
                    <Button className="w-full sm:w-auto">
                      Find Your Representatives
                    </Button>
                  </div>
                  
                  <div className="bg-card p-4 rounded-lg border">
                    <h4 className="font-medium mb-2">Share This Bill</h4>
                    <p className="text-foreground/85 mb-4">
                      Spread awareness by sharing with your community.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <Button variant="outline" size="sm">
                        <Link className="h-4 w-4 mr-2" /> Copy Link
                      </Button>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex justify-between border-t pt-6">
            <Button variant="outline" onClick={() => navigate(-1)}>
              Back to List
            </Button>
            <Button onClick={() => navigate('/forum')}>
              Discuss in Forum
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default BillDetail;

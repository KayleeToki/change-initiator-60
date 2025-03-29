
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MutualAidResource, getMutualAidByZipCode } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Search, MapPin, CalendarDays, Phone, ExternalLink, Utensils, Home, Calendar } from 'lucide-react';
import { Skeleton } from "@/components/ui/skeleton";

const MutualAid = () => {
  const navigate = useNavigate();
  const [zipCode, setZipCode] = useState('');
  const [resources, setResources] = useState<MutualAidResource[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  
  const handleSearch = async () => {
    if (zipCode.trim() === '') return;
    
    setLoading(true);
    try {
      const data = await getMutualAidByZipCode(zipCode);
      setResources(data);
      setSearched(true);
    } catch (error) {
      console.error("Failed to fetch mutual aid resources:", error);
    } finally {
      setLoading(false);
    }
  };
  
  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'food': return <Utensils className="h-6 w-6 text-green-500" />;
      case 'shelter': return <Home className="h-6 w-6 text-blue-500" />;
      case 'event': return <Calendar className="h-6 w-6 text-purple-500" />;
      default: return <MapPin className="h-6 w-6 text-gray-500" />;
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <Button 
            variant="outline" 
            onClick={() => navigate('/')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
          </Button>
          
          <h1 className="text-3xl font-bold">Mutual Aid Resources</h1>
        </div>
        
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Find Local Resources</CardTitle>
            <CardDescription>
              Enter your ZIP code to discover food sharing events, shelters, and community support in your area.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Input
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value)}
                placeholder="Enter ZIP code"
                className="max-w-xs"
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
              <Button onClick={handleSearch} disabled={loading}>
                {loading ? (
                  <div className="flex items-center">
                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Searching...
                  </div>
                ) : (
                  <>
                    <Search className="mr-2 h-4 w-4" /> Search
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
        
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-6 w-1/2" />
                  <Skeleton className="h-4 w-3/4 mt-2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-16 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : searched ? (
          resources.length > 0 ? (
            <div>
              <Tabs defaultValue="all">
                <TabsList className="mb-6">
                  <TabsTrigger value="all">All Resources</TabsTrigger>
                  <TabsTrigger value="food">Food</TabsTrigger>
                  <TabsTrigger value="shelter">Shelter</TabsTrigger>
                  <TabsTrigger value="events">Events</TabsTrigger>
                </TabsList>
                
                <TabsContent value="all" className="space-y-4">
                  {resources.map((resource) => (
                    <Card key={resource.id}>
                      <CardHeader className="flex flex-row items-start space-y-0 pb-2">
                        <div className="mr-4">
                          {getResourceIcon(resource.type)}
                        </div>
                        <div>
                          <CardTitle>{resource.name}</CardTitle>
                          <CardDescription>
                            {resource.type.charAt(0).toUpperCase() + resource.type.slice(1)}
                          </CardDescription>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-700 mb-4">{resource.description}</p>
                        <div className="space-y-2 text-sm">
                          {resource.address && (
                            <div className="flex items-center">
                              <MapPin className="h-4 w-4 text-gray-500 mr-2" />
                              <span>{resource.address}</span>
                            </div>
                          )}
                          {resource.date && (
                            <div className="flex items-center">
                              <CalendarDays className="h-4 w-4 text-gray-500 mr-2" />
                              <span>{resource.date}</span>
                            </div>
                          )}
                          {resource.contactInfo && (
                            <div className="flex items-center">
                              <Phone className="h-4 w-4 text-gray-500 mr-2" />
                              <span>{resource.contactInfo}</span>
                            </div>
                          )}
                        </div>
                      </CardContent>
                      {resource.url && (
                        <CardFooter>
                          <Button 
                            variant="outline" 
                            className="w-full"
                            onClick={() => window.open(resource.url, '_blank')}
                          >
                            <ExternalLink className="h-4 w-4 mr-2" /> Learn More
                          </Button>
                        </CardFooter>
                      )}
                    </Card>
                  ))}
                </TabsContent>
                
                <TabsContent value="food" className="space-y-4">
                  {resources.filter(r => r.type === 'food').map((resource) => (
                    <Card key={resource.id}>
                      <CardHeader className="flex flex-row items-start space-y-0 pb-2">
                        <div className="mr-4">
                          {getResourceIcon(resource.type)}
                        </div>
                        <div>
                          <CardTitle>{resource.name}</CardTitle>
                          <CardDescription>
                            {resource.type.charAt(0).toUpperCase() + resource.type.slice(1)}
                          </CardDescription>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-700 mb-4">{resource.description}</p>
                        <div className="space-y-2 text-sm">
                          {resource.address && (
                            <div className="flex items-center">
                              <MapPin className="h-4 w-4 text-gray-500 mr-2" />
                              <span>{resource.address}</span>
                            </div>
                          )}
                          {resource.date && (
                            <div className="flex items-center">
                              <CalendarDays className="h-4 w-4 text-gray-500 mr-2" />
                              <span>{resource.date}</span>
                            </div>
                          )}
                          {resource.contactInfo && (
                            <div className="flex items-center">
                              <Phone className="h-4 w-4 text-gray-500 mr-2" />
                              <span>{resource.contactInfo}</span>
                            </div>
                          )}
                        </div>
                      </CardContent>
                      {resource.url && (
                        <CardFooter>
                          <Button 
                            variant="outline" 
                            className="w-full"
                            onClick={() => window.open(resource.url, '_blank')}
                          >
                            <ExternalLink className="h-4 w-4 mr-2" /> Learn More
                          </Button>
                        </CardFooter>
                      )}
                    </Card>
                  ))}
                </TabsContent>
                
                <TabsContent value="shelter" className="space-y-4">
                  {resources.filter(r => r.type === 'shelter').map((resource) => (
                    <Card key={resource.id}>
                      <CardHeader className="flex flex-row items-start space-y-0 pb-2">
                        <div className="mr-4">
                          {getResourceIcon(resource.type)}
                        </div>
                        <div>
                          <CardTitle>{resource.name}</CardTitle>
                          <CardDescription>
                            {resource.type.charAt(0).toUpperCase() + resource.type.slice(1)}
                          </CardDescription>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-700 mb-4">{resource.description}</p>
                        <div className="space-y-2 text-sm">
                          {resource.address && (
                            <div className="flex items-center">
                              <MapPin className="h-4 w-4 text-gray-500 mr-2" />
                              <span>{resource.address}</span>
                            </div>
                          )}
                          {resource.contactInfo && (
                            <div className="flex items-center">
                              <Phone className="h-4 w-4 text-gray-500 mr-2" />
                              <span>{resource.contactInfo}</span>
                            </div>
                          )}
                        </div>
                      </CardContent>
                      {resource.url && (
                        <CardFooter>
                          <Button 
                            variant="outline" 
                            className="w-full"
                            onClick={() => window.open(resource.url, '_blank')}
                          >
                            <ExternalLink className="h-4 w-4 mr-2" /> Learn More
                          </Button>
                        </CardFooter>
                      )}
                    </Card>
                  ))}
                </TabsContent>
                
                <TabsContent value="events" className="space-y-4">
                  {resources.filter(r => r.type === 'event').map((resource) => (
                    <Card key={resource.id}>
                      <CardHeader className="flex flex-row items-start space-y-0 pb-2">
                        <div className="mr-4">
                          {getResourceIcon(resource.type)}
                        </div>
                        <div>
                          <CardTitle>{resource.name}</CardTitle>
                          <CardDescription>
                            {resource.type.charAt(0).toUpperCase() + resource.type.slice(1)}
                          </CardDescription>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-700 mb-4">{resource.description}</p>
                        <div className="space-y-2 text-sm">
                          {resource.address && (
                            <div className="flex items-center">
                              <MapPin className="h-4 w-4 text-gray-500 mr-2" />
                              <span>{resource.address}</span>
                            </div>
                          )}
                          {resource.date && (
                            <div className="flex items-center">
                              <CalendarDays className="h-4 w-4 text-gray-500 mr-2" />
                              <span>{resource.date}</span>
                            </div>
                          )}
                          {resource.contactInfo && (
                            <div className="flex items-center">
                              <Phone className="h-4 w-4 text-gray-500 mr-2" />
                              <span>{resource.contactInfo}</span>
                            </div>
                          )}
                        </div>
                      </CardContent>
                      {resource.url && (
                        <CardFooter>
                          <Button 
                            variant="outline" 
                            className="w-full"
                            onClick={() => window.open(resource.url, '_blank')}
                          >
                            <ExternalLink className="h-4 w-4 mr-2" /> Learn More
                          </Button>
                        </CardFooter>
                      )}
                    </Card>
                  ))}
                </TabsContent>
              </Tabs>
            </div>
          ) : (
            <Card className="w-full p-8 text-center">
              <CardContent>
                <p className="text-gray-500">No resources found for ZIP code {zipCode}.</p>
                <p className="text-gray-500 mt-2">Try another ZIP code or check back later.</p>
              </CardContent>
            </Card>
          )
        ) : (
          <Card className="w-full p-8 text-center">
            <CardContent>
              <p className="text-gray-500">Enter your ZIP code above to find resources in your area.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default MutualAid;

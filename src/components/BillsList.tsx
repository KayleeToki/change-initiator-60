
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Bill, getBillsByState } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, AlertTriangle, RefreshCw, Search } from 'lucide-react';
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const BillsList = () => {
  const { state } = useParams<{ state: string }>();
  const navigate = useNavigate();
  const [bills, setBills] = useState<Bill[]>([]);
  const [filteredBills, setFilteredBills] = useState<Bill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
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
          setFilteredBills(sortedBills);
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
  
  // Filter bills based on search term
  useEffect(() => {
    if (searchTerm) {
      const filtered = bills.filter(bill => 
        bill.bill_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bill.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bill.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredBills(filtered);
      setCurrentPage(1); // Reset to first page on new search
    } else {
      setFilteredBills(bills);
    }
  }, [searchTerm, bills]);
  
  // Calculate pagination values
  const totalPages = Math.ceil(filteredBills.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredBills.slice(indexOfFirstItem, indexOfLastItem);
  
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
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;
    
    if (totalPages <= maxPagesToShow) {
      // Show all pages if total is less than max
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always include first and last page
      pages.push(1);
      
      // Add middle pages
      const leftBound = Math.max(2, currentPage - 1);
      const rightBound = Math.min(totalPages - 1, currentPage + 1);
      
      // Add ellipsis after first page if needed
      if (leftBound > 2) {
        pages.push('ellipsis-start');
      }
      
      // Add pages around current page
      for (let i = leftBound; i <= rightBound; i++) {
        pages.push(i);
      }
      
      // Add ellipsis before last page if needed
      if (rightBound < totalPages - 1) {
        pages.push('ellipsis-end');
      }
      
      pages.push(totalPages);
    }
    
    return pages;
  };
  
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <Button 
        variant="outline" 
        className="mb-6"
        onClick={() => navigate('/map')}
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Map
      </Button>
      
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Legislation in {state}</h1>
        <p className="text-gray-600 mb-6">
          Viewing current and upcoming bills sorted by urgency. Click on any bill for more details.
        </p>
        
        {/* Search box */}
        <div className="relative mb-6">
          <div className="flex items-center border rounded-md overflow-hidden">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              className="pl-10 py-2 border-none focus-visible:ring-0"
              placeholder="Search bills by number or keyword..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          {filteredBills.length !== bills.length && (
            <p className="text-sm text-gray-500 mt-2">
              Showing {filteredBills.length} of {bills.length} bills
              {searchTerm && ` matching "${searchTerm}"`}
            </p>
          )}
        </div>
        
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
        ) : filteredBills.length > 0 ? (
          <>
            <div className="space-y-4 mt-4">
              {currentItems.map((bill) => (
                <Card 
                  key={bill.bill_id} 
                  className="w-full cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => navigate(`/bill/${bill.bill_id}`)}
                >
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xl font-semibold flex items-center gap-3">
                      <Badge className={getUrgencyClass(bill.urgency)}>
                        {bill.urgency.charAt(0).toUpperCase() + bill.urgency.slice(1)} Priority
                      </Badge>
                      {bill.bill_number}: {bill.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-3">{bill.description}</p>
                    <div className="flex flex-wrap gap-2 text-sm">
                      <Badge variant="outline" className="font-normal">
                        Bill ID: {bill.bill_id}
                      </Badge>
                      <Badge variant="outline" className="font-normal">
                        Last action: {formatDate(bill.last_action_date)}
                      </Badge>
                      <Badge variant="outline" className="font-normal">
                        Status: {bill.status}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            {/* Pagination */}
            {totalPages > 1 && (
              <Pagination className="mt-8">
                <PaginationContent>
                  {currentPage > 1 && (
                    <PaginationItem>
                      <PaginationPrevious 
                        href="#" 
                        onClick={(e) => {
                          e.preventDefault();
                          handlePageChange(currentPage - 1);
                        }} 
                      />
                    </PaginationItem>
                  )}
                  
                  {getPageNumbers().map((page, index) => (
                    page === 'ellipsis-start' || page === 'ellipsis-end' ? (
                      <PaginationItem key={`ellipsis-${index}`}>
                        <PaginationEllipsis />
                      </PaginationItem>
                    ) : (
                      <PaginationItem key={index}>
                        <PaginationLink 
                          href="#" 
                          isActive={page === currentPage}
                          onClick={(e) => {
                            e.preventDefault();
                            handlePageChange(page as number);
                          }}
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    )
                  ))}
                  
                  {currentPage < totalPages && (
                    <PaginationItem>
                      <PaginationNext 
                        href="#" 
                        onClick={(e) => {
                          e.preventDefault();
                          handlePageChange(currentPage + 1);
                        }} 
                      />
                    </PaginationItem>
                  )}
                </PaginationContent>
              </Pagination>
            )}
            
            <p className="text-center text-sm text-gray-500 mt-4">
              Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredBills.length)} of {filteredBills.length} bills
            </p>
          </>
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

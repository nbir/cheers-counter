
import React from "react";
import { ArrowLeft, Clock, Beer } from "lucide-react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useDrinkStorage } from "@/hooks/useDrinkStorage";
import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody, 
  TableCell 
} from "@/components/ui/table";

const DateDetail: React.FC = () => {
  const { dateId } = useParams<{ dateId: string }>();
  const navigate = useNavigate();
  
  const { parseUrlDate, getEntriesForDate } = useDrinkStorage();
  
  if (!dateId) {
    navigate("/my-data");
    return null;
  }
  
  // Parse the URL date parameter to get the actual date
  const date = parseUrlDate(dateId);
  
  // Get entries for this date
  const entries = getEntriesForDate(date);
  
  // Format the date for display
  const formatDisplayDate = (dateString: string): string => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      weekday: 'long',
      month: 'long', 
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };
  
  // Function to format time
  const formatTime = (timestamp: number): string => {
    return new Intl.DateTimeFormat('en-US', { 
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    }).format(new Date(timestamp));
  };
  
  return (
    <div className="container max-w-md mx-auto pt-16 px-4">
      {/* Back button */}
      <div className="mb-6">
        <Link to="/my-data" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200">
          <ArrowLeft size={20} />
          <span>Back to My Data</span>
        </Link>
      </div>
      
      {/* Page title */}
      <h1 className="text-2xl md:text-3xl font-bold mb-2 text-center dark:text-white">Drink Log</h1>
      <p className="text-center text-gray-500 dark:text-gray-400 mb-6">
        {formatDisplayDate(date)}
      </p>
      
      {/* Entries table */}
      <div className="border rounded-lg overflow-hidden dark:border-gray-700">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Time</TableHead>
              <TableHead className="text-right">Count</TableHead>
              <TableHead className="text-right">Change</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {entries.length > 0 ? (
              entries.map((entry, index) => {
                const prevEntry = index > 0 ? entries[index - 1] : null;
                const change = prevEntry ? entry.count - prevEntry.count : entry.count;
                
                return (
                  <TableRow key={entry.timestamp}>
                    <TableCell className="flex items-center gap-2">
                      <Clock size={14} className="text-gray-400" />
                      {formatTime(entry.timestamp)}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {entry.count}
                    </TableCell>
                    <TableCell className="text-right">
                      <span className={`inline-flex items-center ${change > 0 ? 'text-green-600 dark:text-green-400' : change < 0 ? 'text-red-600 dark:text-red-400' : 'text-gray-500'}`}>
                        {change > 0 && '+'}
                        {change}
                        {change !== 0 && (
                          <Beer size={14} className="ml-1" />
                        )}
                      </span>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-4 text-gray-500 dark:text-gray-400">
                  No drink entries found for this date
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
      {/* Summary */}
      {entries.length > 0 && (
        <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800">
          <h2 className="text-lg font-medium text-blue-800 dark:text-blue-300 mb-2">Summary</h2>
          <p className="text-gray-700 dark:text-gray-300">
            You had a total of{' '}
            <span className="font-bold">
              {entries.reduce((max, entry, idx, arr) => {
                // Find the highest count on this day
                return Math.max(max, entry.count);
              }, 0)}
            </span>{' '}
            drinks on this day.
          </p>
        </div>
      )}
    </div>
  );
};

export default DateDetail;

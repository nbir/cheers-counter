
import React from "react";
import { Calendar, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody, 
  TableCell 
} from "@/components/ui/table";
import { useDrinkStorage } from "@/hooks/useDrinkStorage";

interface DailyDrinkSummary {
  date: string;
  totalDrinks: number;
}

interface DrinkHistoryTableProps {
  drinkSummary: DailyDrinkSummary[];
}

const DrinkHistoryTable: React.FC<DrinkHistoryTableProps> = ({ drinkSummary }) => {
  const { getDateForUrl } = useDrinkStorage();
  
  // Function to format the date in a more readable way
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString + "T00:00:00");
    return new Intl.DateTimeFormat('en-US', { 
      weekday: 'short',
      month: 'short', 
      day: 'numeric',
    }).format(date);
  };

  if (drinkSummary.length === 0) {
    return (
      <div className="w-full max-w-md mx-auto mt-8 p-4 text-center text-gray-500 dark:text-gray-400">
        <Calendar className="w-8 h-8 mx-auto mb-2 text-gray-400 dark:text-gray-500" />
        <p>No drink history for the last 30 days</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto mt-8">
      <h2 className="text-xl font-bold mb-4 text-center font-display dark:text-white">Drink History</h2>
      <div className="border rounded-lg overflow-hidden dark:border-gray-700">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Drinks</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {drinkSummary.map((day) => (
              <TableRow key={day.date}>
                <TableCell>
                  <Link 
                    to={`/my-data/${getDateForUrl(day.date)}`}
                    className="flex items-center gap-1 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    {formatDate(day.date)}
                    <ExternalLink size={14} className="inline-block ml-1 opacity-60" />
                  </Link>
                </TableCell>
                <TableCell className="text-right font-medium">
                  {day.totalDrinks}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default DrinkHistoryTable;

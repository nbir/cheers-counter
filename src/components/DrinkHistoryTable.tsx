
import React from "react";
import { Calendar } from "lucide-react";
import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody, 
  TableCell 
} from "@/components/ui/table";

interface DailyDrinkSummary {
  date: string;
  totalDrinks: number;
}

interface DrinkHistoryTableProps {
  drinkSummary: DailyDrinkSummary[];
}

const DrinkHistoryTable: React.FC<DrinkHistoryTableProps> = ({ drinkSummary }) => {
  // Function to format the date in a more readable way
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      weekday: 'short',
      month: 'short', 
      day: 'numeric',
    }).format(date);
  };

  if (drinkSummary.length === 0) {
    return (
      <div className="w-full max-w-md mx-auto mt-8 p-4 text-center text-gray-500">
        <Calendar className="w-8 h-8 mx-auto mb-2 text-gray-400" />
        <p>No drink history for the last 30 days</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto mt-8">
      <h2 className="text-xl font-bold mb-4 text-center font-display">Drink History</h2>
      <div className="border rounded-lg overflow-hidden">
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
                <TableCell>{formatDate(day.date)}</TableCell>
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

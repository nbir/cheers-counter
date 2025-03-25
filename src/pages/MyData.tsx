
import React, { useState } from "react";
import { ArrowLeft, Trash2, AlertTriangle, ExternalLink } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { useDrinkStorage } from "@/hooks/useDrinkStorage";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

type ViewMode = "date" | "month";
type DeleteItem = { type: ViewMode; value: string } | null;

const MyData: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>("date");
  const [itemToDelete, setItemToDelete] = useState<DeleteItem>(null);
  
  const {
    getDailyDrinkSummary,
    getMonthlyDrinkSummary,
    deleteDrinksByDate,
    deleteDrinksByMonth,
    getDateForUrl
  } = useDrinkStorage();
  
  const dailySummary = getDailyDrinkSummary();
  const monthlySummary = getMonthlyDrinkSummary();
  
  const handleDeleteClick = (type: ViewMode, value: string) => {
    setItemToDelete({ type, value });
  };
  
  const handleConfirmDelete = () => {
    if (itemToDelete) {
      if (itemToDelete.type === "date") {
        deleteDrinksByDate(itemToDelete.value);
      } else {
        deleteDrinksByMonth(itemToDelete.value);
      }
    }
    setItemToDelete(null);
  };
  
  // Function to format the date in a more readable way
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString + "T00:00:00");
    return new Intl.DateTimeFormat('en-US', { 
      weekday: 'short',
      month: 'short', 
      day: 'numeric',
    }).format(date);
  };
  
  // Function to format the month in a more readable way
  const formatMonth = (monthString: string): string => {
    const date = new Date(`${monthString}-01`);
    return new Intl.DateTimeFormat('en-US', { 
      month: 'long', 
      year: 'numeric',
    }).format(date);
  };
  
  return (
    <div className="container max-w-md mx-auto pt-16 px-4">
      {/* Back button */}
      <div className="mb-6">
        <Link to="/" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200">
          <ArrowLeft size={20} />
          <span>Back to Home</span>
        </Link>
      </div>
      
      {/* Page title */}
      <h1 className="text-3xl font-bold mb-6 text-center dark:text-white">My Drink Data</h1>
      
      {/* Toggle between date and month view */}
      <div className="flex justify-center mb-6">
        <ToggleGroup type="single" value={viewMode} onValueChange={(value) => value && setViewMode(value as ViewMode)}>
          <ToggleGroupItem value="date" aria-label="By Date">By Date</ToggleGroupItem>
          <ToggleGroupItem value="month" aria-label="By Month">By Month</ToggleGroupItem>
        </ToggleGroup>
      </div>
      
      {/* Data table */}
      <div className="border rounded-lg overflow-hidden dark:border-gray-700">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{viewMode === "date" ? "Date" : "Month"}</TableHead>
              <TableHead className="text-right">Drinks</TableHead>
              <TableHead className="w-16 text-center">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {viewMode === "date" ? (
              dailySummary.length > 0 ? (
                dailySummary.map((day) => (
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
                    <TableCell className="text-center">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                        onClick={() => handleDeleteClick("date", day.date)}
                      >
                        <Trash2 size={18} />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-4 text-gray-500 dark:text-gray-400">
                    No data available
                  </TableCell>
                </TableRow>
              )
            ) : (
              monthlySummary.length > 0 ? (
                monthlySummary.map((month) => (
                  <TableRow key={month.month}>
                    <TableCell>{formatMonth(month.month)}</TableCell>
                    <TableCell className="text-right font-medium">
                      {month.totalDrinks}
                    </TableCell>
                    <TableCell className="text-center">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                        onClick={() => handleDeleteClick("month", month.month)}
                      >
                        <Trash2 size={18} />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-4 text-gray-500 dark:text-gray-400">
                    No data available
                  </TableCell>
                </TableRow>
              )
            )}
          </TableBody>
        </Table>
      </div>
      
      {/* Confirmation Dialog */}
      <AlertDialog open={!!itemToDelete} onOpenChange={(open) => !open && setItemToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="text-amber-500 h-5 w-5" />
              Delete Data
            </AlertDialogTitle>
            <AlertDialogDescription>
              {itemToDelete?.type === "date" 
                ? `Are you sure you want to delete data for ${formatDate(itemToDelete.value)}?` 
                : itemToDelete 
                  ? `Are you sure you want to delete all data for ${formatMonth(itemToDelete.value)}?`
                  : "Are you sure you want to delete this data?"}
              <p className="mt-2 font-medium text-destructive">This action cannot be undone.</p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-red-500 hover:bg-red-600" onClick={handleConfirmDelete}>
              Yes, Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default MyData;

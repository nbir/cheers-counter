
import React, { useState, useEffect } from "react";
import { ArrowLeft, Calendar, Clock } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { useDrinkStorage } from "@/hooks/useDrinkStorage";
import { Calendar as CalendarUI } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const AddDrink: React.FC = () => {
  const navigate = useNavigate();
  const { addDrinkAtDateTime } = useDrinkStorage();
  
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [time, setTime] = useState<string>(format(new Date(), "HH:mm"));
  const [calendarOpen, setCalendarOpen] = useState(false);
  
  // Prevent future dates selection
  const disableFutureDates = (date: Date) => {
    return date > new Date();
  };
  
  // Handle time input change
  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTime(e.target.value);
  };
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!date) {
      toast.error("Please select a date");
      return;
    }
    
    // Combine date and time into a local datetime
    const [hours, minutes] = time.split(':').map(Number);
    
    // Create a date object in the user's local time zone
    const localDateTime = new Date(date);
    localDateTime.setHours(hours, minutes);
    
    // Check if the datetime is in the future
    if (localDateTime > new Date()) {
      toast.error("Cannot add drinks in the future");
      return;
    }
    
    // Add the drink at the specified date and time
    // The ISO string will be converted to a timestamp in UTC
    const success = addDrinkAtDateTime(localDateTime.toISOString());
    
    if (success) {
      toast.success("Drink added successfully");
      // Wait a moment for the toast to show before navigating
      setTimeout(() => navigate('/my-data'), 1500);
    } else {
      toast.error("Failed to add drink");
    }
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
      <h1 className="text-3xl font-bold mb-6 text-center dark:text-white">Add Missed Drink</h1>
      
      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Date picker */}
        <div className="space-y-2">
          <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Date
          </label>
          <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
            <PopoverTrigger asChild>
              <Button 
                variant="outline" 
                className="w-full justify-start text-left font-normal"
              >
                <Calendar className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <CalendarUI
                mode="single"
                selected={date}
                onSelect={(date) => {
                  setDate(date);
                  setCalendarOpen(false);
                }}
                disabled={disableFutureDates}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        
        {/* Time picker */}
        <div className="space-y-2">
          <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Time
          </label>
          <div className="flex w-full items-center space-x-2">
            <Clock className="h-4 w-4 text-gray-400" />
            <Input
              type="time"
              value={time}
              onChange={handleTimeChange}
              className="flex-1"
            />
          </div>
        </div>
        
        {/* Submit button */}
        <Button type="submit" className="w-full">
          Add Drink
        </Button>
      </form>
    </div>
  );
};

export default AddDrink;

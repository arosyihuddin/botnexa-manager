
import { useState, useEffect } from "react";
import { Calendar as CalendarIcon, Clock, Plus, Search, Filter, Check, X, AlertCircle, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import DashboardLayout from "@/components/DashboardLayout";
import { useToast } from "@/hooks/use-toast";

// Define reminder interface
interface Reminder {
  id: string;
  title: string;
  description: string;
  date: string;
  priority: "low" | "medium" | "high";
  status: "pending" | "completed" | "cancelled";
}

const Reminders = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [showNewReminder, setShowNewReminder] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");
  const [showCompleted, setShowCompleted] = useState(true);
  const [activeTab, setActiveTab] = useState("upcoming");
  const [reminders, setReminders] = useState<Reminder[]>([
    {
      id: "1",
      title: "Team Meeting",
      description: "Discuss project progress with the development team",
      date: "Tomorrow, 2:00 PM",
      priority: "medium",
      status: "pending"
    },
    {
      id: "2",
      title: "Client Follow-up",
      description: "Send proposal updates to ABC Corp",
      date: "Friday, 10:00 AM",
      priority: "high",
      status: "pending"
    },
    {
      id: "3",
      title: "Weekly Report",
      description: "Prepare analytics summary for management",
      date: "Friday, 4:00 PM",
      priority: "medium",
      status: "pending"
    },
    {
      id: "4",
      title: "Project Deadline",
      description: "Submit final deliverables for the marketing campaign",
      date: "Today, 5:00 PM",
      priority: "high",
      status: "pending"
    },
    {
      id: "5",
      title: "Team Lunch",
      description: "Company cafeteria, first floor",
      date: "Today, 12:30 PM",
      priority: "low",
      status: "completed"
    },
    {
      id: "6",
      title: "Client Meeting",
      description: "Initial consultation with XYZ Inc.",
      date: "Yesterday, 11:00 AM",
      priority: "medium",
      status: "completed"
    },
    {
      id: "7",
      title: "Software Update",
      description: "Update all systems to latest version",
      date: "Monday, 9:00 AM",
      priority: "high",
      status: "cancelled"
    }
  ]);
  
  // Filter reminders based on search, status, priority, and showCompleted
  const filteredReminders = reminders.filter(reminder => {
    // Apply search filter
    const matchesSearch = 
      reminder.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reminder.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Apply status filter
    const matchesStatus = 
      filterStatus === "all" || 
      reminder.status === filterStatus;
    
    // Apply priority filter
    const matchesPriority = 
      filterPriority === "all" || 
      reminder.priority === filterPriority;
    
    // Apply show completed filter
    const matchesCompleted = 
      showCompleted || 
      reminder.status !== "completed";
    
    // Apply tab filter
    let matchesTab = true;
    if (activeTab === "today") {
      matchesTab = reminder.date.includes("Today");
    } else if (activeTab === "upcoming") {
      matchesTab = reminder.date.includes("Tomorrow") || reminder.date.includes("Friday");
    } else if (activeTab === "past") {
      matchesTab = reminder.date.includes("Yesterday") || reminder.date.includes("Monday");
    }
    
    return matchesSearch && matchesStatus && matchesPriority && matchesCompleted && matchesTab;
  });

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };
  
  return (
    <DashboardLayout title="Reminders">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold tracking-tight">Reminders</h2>
            <p className="text-muted-foreground">
              Schedule and manage automated reminders for yourself and your contacts.
            </p>
          </div>
          <Button onClick={() => setShowNewReminder(true)} className="bg-botnexa-500 hover:bg-botnexa-600">
            <Plus className="mr-2 h-4 w-4" /> New Reminder
          </Button>
        </div>
        
        <div className="flex flex-col md:flex-row gap-6">
          {/* Left column - Calendar */}
          <div className="md:w-[300px] w-full">
            <Card>
              <CardHeader className="px-4 py-3 border-b">
                <CardTitle className="text-md">Calendar</CardTitle>
              </CardHeader>
              <CardContent className="p-2 overflow-hidden">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  className="rounded-md w-full"
                />
              </CardContent>
            </Card>
            
            <Card className="mt-4">
              <CardHeader className="px-4 py-3 border-b">
                <CardTitle className="text-md">Filters</CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-3">
                <div className="space-y-1.5">
                  <Label htmlFor="status">Status</Label>
                  <Select 
                    defaultValue="all" 
                    value={filterStatus}
                    onValueChange={setFilterStatus}
                  >
                    <SelectTrigger id="status">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-1.5">
                  <Label htmlFor="priority">Priority</Label>
                  <Select 
                    defaultValue="all"
                    value={filterPriority}
                    onValueChange={setFilterPriority}
                  >
                    <SelectTrigger id="priority">
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="showCompleted">Show Completed</Label>
                  <Switch 
                    id="showCompleted" 
                    checked={showCompleted}
                    onCheckedChange={setShowCompleted}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Right column - Reminders List */}
          <div className="flex-1">
            {showNewReminder ? (
              <NewReminderForm 
                onCancel={() => setShowNewReminder(false)} 
                onSubmit={(newReminder) => {
                  setReminders([...reminders, {
                    ...newReminder,
                    id: `${Date.now()}`,
                    status: "pending"
                  }]);
                  setShowNewReminder(false);
                }}
              />
            ) : (
              <RemindersList 
                reminders={filteredReminders} 
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                activeTab={activeTab}
                onTabChange={handleTabChange}
                onStatusChange={(id, status) => {
                  setReminders(reminders.map(reminder => 
                    reminder.id === id ? { ...reminder, status } : reminder
                  ));
                }}
                onDelete={(id) => {
                  setReminders(reminders.filter(reminder => reminder.id !== id));
                }}
              />
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

interface NewReminderFormProps {
  onCancel: () => void;
  onSubmit: (reminder: Omit<Reminder, 'id' | 'status'>) => void;
}

const NewReminderForm = ({ onCancel, onSubmit }: NewReminderFormProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState<Date>();
  const [time, setTime] = useState("");
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium");
  const [isRecurring, setIsRecurring] = useState(false);
  const { toast } = useToast();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title) {
      toast({
        title: "Missing information",
        description: "Please enter a title for your reminder",
        variant: "destructive"
      });
      return;
    }
    
    if (!date) {
      toast({
        title: "Missing information",
        description: "Please select a date for your reminder",
        variant: "destructive"
      });
      return;
    }
    
    if (!time) {
      toast({
        title: "Missing information",
        description: "Please select a time for your reminder",
        variant: "destructive"
      });
      return;
    }
    
    const formattedDate = `${format(date, "EEEE")}, ${time}`;
    
    onSubmit({
      title,
      description,
      date: formattedDate,
      priority
    });
  };
  
  return (
    <Card>
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle>Create New Reminder</CardTitle>
          <CardDescription>Set up a new reminder to be sent automatically</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Reminder Title</Label>
            <Input 
              id="title" 
              placeholder="Meeting with Client" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea 
              id="description" 
              placeholder="Add details about this reminder..." 
              className="min-h-20"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="space-y-2">
              <Label>Time</Label>
              <Select onValueChange={setTime}>
                <SelectTrigger>
                  <SelectValue placeholder="Select time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="9:00 AM">9:00 AM</SelectItem>
                  <SelectItem value="10:00 AM">10:00 AM</SelectItem>
                  <SelectItem value="11:00 AM">11:00 AM</SelectItem>
                  <SelectItem value="12:00 PM">12:00 PM</SelectItem>
                  <SelectItem value="1:00 PM">1:00 PM</SelectItem>
                  <SelectItem value="2:00 PM">2:00 PM</SelectItem>
                  <SelectItem value="3:00 PM">3:00 PM</SelectItem>
                  <SelectItem value="4:00 PM">4:00 PM</SelectItem>
                  <SelectItem value="5:00 PM">5:00 PM</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Priority</Label>
            <div className="flex items-center gap-2">
              <Button 
                type="button"
                variant="outline" 
                className={`flex-1 ${priority === 'low' ? 'border-botnexa-200 bg-botnexa-50' : ''}`}
                onClick={() => setPriority("low")}
              >
                Low
              </Button>
              <Button 
                type="button"
                variant="outline" 
                className={`flex-1 ${priority === 'medium' ? 'border-botnexa-200 bg-botnexa-50' : ''}`}
                onClick={() => setPriority("medium")}
              >
                Medium
              </Button>
              <Button 
                type="button"
                variant="outline" 
                className={`flex-1 ${priority === 'high' ? 'border-botnexa-200 bg-botnexa-50' : ''}`}
                onClick={() => setPriority("high")}
              >
                High
              </Button>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="recurring">Recurring Reminder</Label>
              <Switch 
                id="recurring" 
                checked={isRecurring}
                onCheckedChange={setIsRecurring}
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" type="button" onClick={onCancel}>Cancel</Button>
          <Button className="bg-botnexa-500 hover:bg-botnexa-600" type="submit">Create Reminder</Button>
        </CardFooter>
      </form>
    </Card>
  );
};

interface RemindersListProps {
  reminders: Reminder[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
  onStatusChange: (id: string, status: "pending" | "completed" | "cancelled") => void;
  onDelete: (id: string) => void;
}

const RemindersList = ({ 
  reminders, 
  searchQuery, 
  setSearchQuery, 
  activeTab, 
  onTabChange,
  onStatusChange,
  onDelete 
}: RemindersListProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search reminders..." 
            className="pl-8 w-full bg-background"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button size="icon" variant="outline">
          <Filter className="h-4 w-4" />
        </Button>
      </div>
      
      <Tabs value={activeTab} onValueChange={onTabChange}>
        <TabsList className="grid grid-cols-3 w-full sm:w-auto">
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="today">Today</TabsTrigger>
          <TabsTrigger value="past">Past</TabsTrigger>
        </TabsList>
        
        <TabsContent value="upcoming" className="space-y-4 mt-4">
          {reminders.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No upcoming reminders found
            </div>
          ) : (
            reminders.map(reminder => (
              <ReminderItem
                key={reminder.id}
                reminder={reminder}
                onStatusChange={onStatusChange}
                onDelete={onDelete}
              />
            ))
          )}
        </TabsContent>
        
        <TabsContent value="today" className="space-y-4 mt-4">
          {reminders.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No reminders for today
            </div>
          ) : (
            reminders.map(reminder => (
              <ReminderItem
                key={reminder.id}
                reminder={reminder}
                onStatusChange={onStatusChange}
                onDelete={onDelete}
              />
            ))
          )}
        </TabsContent>
        
        <TabsContent value="past" className="space-y-4 mt-4">
          {reminders.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No past reminders found
            </div>
          ) : (
            reminders.map(reminder => (
              <ReminderItem
                key={reminder.id}
                reminder={reminder}
                onStatusChange={onStatusChange}
                onDelete={onDelete}
              />
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

interface ReminderItemProps {
  reminder: Reminder;
  onStatusChange: (id: string, status: "pending" | "completed" | "cancelled") => void;
  onDelete: (id: string) => void;
}

const ReminderItem = ({ reminder, onStatusChange, onDelete }: ReminderItemProps) => {
  const { id, title, description, date, priority, status } = reminder;
  
  const priorityColors = {
    low: "bg-green-50 text-green-700 border-green-200",
    medium: "bg-amber-50 text-amber-700 border-amber-200",
    high: "bg-red-50 text-red-700 border-red-200",
  };
  
  const statusIcons = {
    pending: <Clock className="h-4 w-4" />,
    completed: <Check className="h-4 w-4" />,
    cancelled: <X className="h-4 w-4" />,
  };
  
  const statusColors = {
    pending: "bg-blue-50 text-blue-700 border-blue-200",
    completed: "bg-green-50 text-green-700 border-green-200",
    cancelled: "bg-gray-50 text-gray-700 border-gray-200",
  };
  
  return (
    <Card className={`border-l-4 ${status === 'completed' ? 'border-l-green-500' : status === 'cancelled' ? 'border-l-gray-400' : `border-l-${priority === 'high' ? 'red' : priority === 'medium' ? 'amber' : 'green'}-500`}`}>
      <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className={`font-medium ${status === 'completed' ? 'line-through text-muted-foreground' : ''}`}>{title}</h3>
            <Badge variant="outline" className={priorityColors[priority]}>
              {priority.charAt(0).toUpperCase() + priority.slice(1)}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">{description}</p>
          <div className="flex items-center gap-2 mt-2">
            <CalendarIcon className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">{date}</span>
            <Badge variant="outline" className={`ml-1 text-xs ${statusColors[status]}`}>
              <span className="flex items-center gap-1">
                {statusIcons[status]}
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </span>
            </Badge>
          </div>
        </div>
        
        <div className="flex items-center gap-2 self-end sm:self-center">
          {status === 'pending' && (
            <>
              <Button 
                size="sm" 
                variant="outline" 
                className="h-8 px-2 text-xs"
                onClick={() => onStatusChange(id, "completed")}
              >
                <Check className="h-3.5 w-3.5 mr-1" /> Complete
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                className="h-8 px-2 text-xs text-destructive border-destructive hover:bg-destructive/10"
                onClick={() => onStatusChange(id, "cancelled")}
              >
                <X className="h-3.5 w-3.5 mr-1" /> Cancel
              </Button>
            </>
          )}
          <Button 
            size="icon" 
            variant="ghost" 
            className="h-8 w-8"
            onClick={() => onDelete(id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default Reminders;

import { useState, useEffect } from "react";
import { format, parseISO } from "date-fns";
import { CheckCircle, XCircle, Calendar, Bell, Clock, Plus } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DashboardLayout from "@/components/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { ReminderService } from "@/services/reminders.service";
import CreateReminderModal from "@/components/CreateReminderModal";

const Reminders = () => {
  const [reminders, setReminders] = useState<any[]>([]);
  const [completedReminders, setCompletedReminders] = useState<any[]>([]);
  const [upcomingReminders, setUpcomingReminders] = useState<any[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    loadReminders();
  }, []);

  const loadReminders = async () => {
    try {
      const remindersData = await ReminderService.getReminders();
      setReminders(remindersData);
    } catch (error) {
      console.error("Error loading reminders:", error);
      toast({
        title: "Error",
        description: "Failed to load reminders",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    // Filter reminders into completed and upcoming
    const now = new Date();
    const completed = reminders.filter((reminder) => reminder.completed);
    const upcoming = reminders.filter((reminder) => !reminder.completed && parseISO(reminder.date + 'T' + reminder.time) >= now);

    setCompletedReminders(completed);
    setUpcomingReminders(upcoming);
  }, [reminders]);

  const handleCreateReminder = async (newReminder: any) => {
    try {
      await ReminderService.createReminder(newReminder);
      setReminders([...reminders, newReminder]);
    } catch (error) {
      console.error("Error creating reminder:", error);
      toast({
        title: "Error",
        description: "Failed to create reminder",
        variant: "destructive",
      });
    }
  };

  const handleUpdateReminder = async (reminderId: string, updatedFields: any) => {
    try {
      await ReminderService.updateReminder(reminderId, updatedFields);
      setReminders(reminders.map(reminder =>
        reminder.id === reminderId ? { ...reminder, ...updatedFields } : reminder
      ));
    } catch (error) {
      console.error("Error updating reminder:", error);
      toast({
        title: "Error",
        description: "Failed to update reminder",
        variant: "destructive",
      });
    }
  };

  const handleDeleteReminder = async (reminderId: string) => {
    try {
      await ReminderService.deleteReminder(reminderId);
      setReminders(reminders.filter(reminder => reminder.id !== reminderId));
    } catch (error) {
      console.error("Error deleting reminder:", error);
      toast({
        title: "Error",
        description: "Failed to delete reminder",
        variant: "destructive",
      });
    }
  };

  return (
    <DashboardLayout title="Reminders">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Manage Reminders</h1>
            <p className="text-muted-foreground">Create and manage your scheduled reminders.</p>
          </div>
          <CreateReminderModal onCreateReminder={handleCreateReminder} />
        </div>
        
        <Tabs defaultValue="upcoming" className="w-full">
          <TabsList>
            <TabsTrigger value="upcoming">Upcoming <Badge variant="secondary">{upcomingReminders.length}</Badge></TabsTrigger>
            <TabsTrigger value="completed">Completed <Badge variant="secondary">{completedReminders.length}</Badge></TabsTrigger>
          </TabsList>
          <TabsContent value="upcoming">
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
              {upcomingReminders.length > 0 ? (
                upcomingReminders.map((reminder) => (
                  <Card key={reminder.id}>
                    <CardHeader>
                      <CardTitle>{reminder.title}</CardTitle>
                      <CardDescription>{reminder.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-2">
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4" />
                        <span>{format(parseISO(reminder.date), "PPP")}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4" />
                        <span>{reminder.time}</span>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between items-center">
                      <Button variant="outline" size="sm" onClick={() => handleUpdateReminder(reminder.id, { completed: true })}>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Mark Complete
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDeleteReminder(reminder.id)}>
                        <XCircle className="h-4 w-4 mr-2" />
                        Delete
                      </Button>
                    </CardFooter>
                  </Card>
                ))
              ) : (
                <div className="col-span-full text-center">
                  <Bell className="mx-auto h-6 w-6 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">No upcoming reminders.</p>
                </div>
              )}
            </div>
          </TabsContent>
          <TabsContent value="completed">
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
              {completedReminders.length > 0 ? (
                completedReminders.map((reminder) => (
                  <Card key={reminder.id}>
                    <CardHeader>
                      <CardTitle>{reminder.title}</CardTitle>
                      <CardDescription>{reminder.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-2">
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4" />
                        <span>{format(parseISO(reminder.date), "PPP")}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4" />
                        <span>{reminder.time}</span>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-end">
                      <Button variant="destructive" size="sm" onClick={() => handleDeleteReminder(reminder.id)}>
                        <XCircle className="h-4 w-4 mr-2" />
                        Delete
                      </Button>
                    </CardFooter>
                  </Card>
                ))
              ) : (
                <div className="col-span-full text-center">
                  <CheckCircle className="mx-auto h-6 w-6 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">No completed reminders.</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Reminders;

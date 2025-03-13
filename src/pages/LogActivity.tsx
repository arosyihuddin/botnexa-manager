
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Activity, Database, Search, AlertTriangle, CheckCircle2, Filter, Download, 
  Calendar, Zap, RefreshCw, Bot, MessageSquare, Server, Info
} from "lucide-react";
import { cn } from "@/lib/utils";
import DashboardLayout from "@/components/DashboardLayout";

// Sample log data
const logData = [
  {
    id: 1,
    timestamp: "2023-06-15 14:32:45",
    type: "bot",
    action: "Message received",
    status: "success",
    details: "Incoming message from +1234567890",
  },
  {
    id: 2,
    timestamp: "2023-06-15 14:33:01",
    type: "bot",
    action: "Response sent",
    status: "success",
    details: "Bot replied to user query about pricing",
  },
  {
    id: 3,
    timestamp: "2023-06-15 14:45:22",
    type: "api",
    action: "API Request",
    status: "error",
    details: "Failed to connect to OpenAI API: Timeout",
  },
  {
    id: 4,
    timestamp: "2023-06-15 15:12:35",
    type: "system",
    action: "User login",
    status: "success",
    details: "Admin user logged in from 192.168.1.105",
  },
  {
    id: 5,
    timestamp: "2023-06-15 15:30:12",
    type: "api",
    action: "API Request",
    status: "success",
    details: "Successfully fetched data from external CRM API",
  },
  {
    id: 6,
    timestamp: "2023-06-15 16:05:44",
    type: "bot",
    action: "Message received",
    status: "warning",
    details: "Message parsing partially failed, fallback response sent",
  },
  {
    id: 7,
    timestamp: "2023-06-15 16:10:18",
    type: "system",
    action: "Configuration updated",
    status: "success",
    details: "Bot personality settings updated by admin",
  },
  {
    id: 8,
    timestamp: "2023-06-15 16:45:30",
    type: "api",
    action: "Database query",
    status: "success",
    details: "Customer data retrieved from database",
  },
  {
    id: 9,
    timestamp: "2023-06-15 17:01:24",
    type: "system",
    action: "Scheduled task",
    status: "success",
    details: "Daily analytics report generated",
  },
  {
    id: 10,
    timestamp: "2023-06-15 17:15:55",
    type: "bot",
    action: "Message received",
    status: "success",
    details: "Incoming message from +9876543210",
  },
  {
    id: 11,
    timestamp: "2023-06-15 17:20:33",
    type: "api",
    action: "API Request",
    status: "error",
    details: "Failed to connect to payment gateway: Invalid credentials",
  },
  {
    id: 12,
    timestamp: "2023-06-15 17:45:11",
    type: "system",
    action: "User logout",
    status: "success",
    details: "User session ended",
  },
];

const LogActivity = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  
  // Filter logs based on search query and filters
  const filteredLogs = logData.filter(log => {
    const matchesSearch = 
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.details.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || log.status === statusFilter;
    const matchesType = typeFilter === "all" || log.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });
  
  return (
    <DashboardLayout title="Log Activity">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">System Activity Logs</h2>
            <p className="text-muted-foreground">
              Monitor WhatsApp bot activities and API integrations
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="h-8 gap-1">
              <RefreshCw className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Refresh</span>
            </Button>
            <Button variant="outline" size="sm" className="h-8 gap-1">
              <Download className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Export</span>
            </Button>
          </div>
        </div>
        
        <Tabs defaultValue="all">
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <TabsList>
              <TabsTrigger value="all" className="text-xs sm:text-sm">All Logs</TabsTrigger>
              <TabsTrigger value="bot" className="text-xs sm:text-sm">Bot Activity</TabsTrigger>
              <TabsTrigger value="api" className="text-xs sm:text-sm">API Integrations</TabsTrigger>
              <TabsTrigger value="system" className="text-xs sm:text-sm">System Events</TabsTrigger>
            </TabsList>
            
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  type="search" 
                  placeholder="Search logs..." 
                  className="w-full sm:w-[200px] pl-8 h-9" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-3 my-4">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Filters:</span>
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="h-8 text-xs border-dashed w-[110px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="success">Success</SelectItem>
                <SelectItem value="warning">Warning</SelectItem>
                <SelectItem value="error">Error</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="h-8 text-xs border-dashed w-[110px]">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="bot">Bot</SelectItem>
                <SelectItem value="api">API</SelectItem>
                <SelectItem value="system">System</SelectItem>
              </SelectContent>
            </Select>
            
            <Button variant="outline" size="sm" className="h-8 text-xs border-dashed gap-1">
              <Calendar className="h-3.5 w-3.5" />
              Date Range
            </Button>
          </div>
          
          <TabsContent value="all" className="m-0">
            <LogTable logs={filteredLogs} />
          </TabsContent>
          
          <TabsContent value="bot" className="m-0">
            <LogTable logs={filteredLogs.filter(log => log.type === 'bot')} />
          </TabsContent>
          
          <TabsContent value="api" className="m-0">
            <LogTable logs={filteredLogs.filter(log => log.type === 'api')} />
          </TabsContent>
          
          <TabsContent value="system" className="m-0">
            <LogTable logs={filteredLogs.filter(log => log.type === 'system')} />
          </TabsContent>
        </Tabs>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <MetricCard
            title="Total Bot Messages"
            value="1,284"
            icon={<MessageSquare className="h-5 w-5 text-botnexa-500" />}
            trend="+12.5%"
            trendUp={true}
          />
          <MetricCard
            title="API Calls Today"
            value="4,392"
            icon={<Zap className="h-5 w-5 text-botnexa-500" />}
            trend="+8.3%"
            trendUp={true}
          />
          <MetricCard
            title="Error Rate"
            value="1.7%"
            icon={<AlertTriangle className="h-5 w-5 text-botnexa-500" />}
            trend="-0.3%"
            trendUp={false}
          />
        </div>
      </div>
    </DashboardLayout>
  );
};

interface LogTableProps {
  logs: typeof logData;
}

const LogTable = ({ logs }: LogTableProps) => {
  return (
    <Card>
      <CardContent className="p-0">
        <ScrollArea className="h-[500px] w-full rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[180px]">Timestamp</TableHead>
                <TableHead className="w-[100px]">Type</TableHead>
                <TableHead className="w-[180px]">Action</TableHead>
                <TableHead className="w-[100px]">Status</TableHead>
                <TableHead>Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.length > 0 ? (
                logs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="font-mono text-xs">
                      {log.timestamp}
                    </TableCell>
                    <TableCell>
                      <LogTypeLabel type={log.type} />
                    </TableCell>
                    <TableCell className="font-medium">{log.action}</TableCell>
                    <TableCell>
                      <LogStatusBadge status={log.status} />
                    </TableCell>
                    <TableCell className="max-w-[300px] truncate">
                      {log.details}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    No logs found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

interface LogStatusBadgeProps {
  status: string;
}

const LogStatusBadge = ({ status }: LogStatusBadgeProps) => {
  return (
    <Badge 
      variant="outline"
      className={cn(
        "capitalize",
        status === "success" && "bg-green-50 text-green-700 border-green-200 dark:bg-green-950/30 dark:text-green-400 dark:border-green-900",
        status === "warning" && "bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-950/30 dark:text-yellow-400 dark:border-yellow-900",
        status === "error" && "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/30 dark:text-red-400 dark:border-red-900"
      )}
    >
      {status === "success" && <CheckCircle2 className="mr-1 h-3 w-3" />}
      {status === "warning" && <AlertTriangle className="mr-1 h-3 w-3" />}
      {status === "error" && <AlertTriangle className="mr-1 h-3 w-3" />}
      {status}
    </Badge>
  );
};

interface LogTypeLabelProps {
  type: string;
}

const LogTypeLabel = ({ type }: LogTypeLabelProps) => {
  return (
    <div className="flex items-center gap-1">
      {type === "bot" && <Bot className="h-3.5 w-3.5 text-botnexa-500" />}
      {type === "api" && <Server className="h-3.5 w-3.5 text-purple-500" />}
      {type === "system" && <Info className="h-3.5 w-3.5 text-blue-500" />}
      <span className="capitalize text-sm">{type}</span>
    </div>
  );
};

interface MetricCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  trend: string;
  trendUp: boolean;
}

const MetricCard = ({ title, value, icon, trend, trendUp }: MetricCardProps) => {
  return (
    <Card>
      <CardContent className="flex justify-between items-center p-6">
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">{title}</p>
          <div className="flex items-baseline gap-2">
            <p className="text-2xl font-bold">{value}</p>
            <span className={cn(
              "text-xs font-medium",
              trendUp ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
            )}>
              {trend}
            </span>
          </div>
        </div>
        <div className="h-12 w-12 rounded-full bg-botnexa-50 dark:bg-botnexa-900/30 flex items-center justify-center">
          {icon}
        </div>
      </CardContent>
    </Card>
  );
};

export default LogActivity;

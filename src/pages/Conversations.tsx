
import { useState, useRef, useEffect } from "react";
import { Search, Plus, Filter, MessageSquare, User, MoreVertical, ArrowUpRight, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import DashboardLayout from "@/components/DashboardLayout";

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'contact';
  timestamp: string;
}

interface Chat {
  id: string;
  name: string;
  lastMessage: string;
  time: string;
  unread: number;
  messages: Message[];
}

const Conversations = () => {
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTab, setFilterTab] = useState('all');
  const [messageInput, setMessageInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const [mockChats, setMockChats] = useState<Chat[]>([
    { 
      id: "1", 
      name: "John Smith", 
      lastMessage: "I need help with my order", 
      time: "2m ago", 
      unread: 2,
      messages: [
        { id: "1-1", content: "Hello, I need help with my order #12345", sender: 'contact', timestamp: "10:30 AM" },
        { id: "1-2", content: "What seems to be the issue with your order?", sender: 'user', timestamp: "10:32 AM" },
        { id: "1-3", content: "I ordered the wrong size and would like to change it", sender: 'contact', timestamp: "10:33 AM" },
        { id: "1-4", content: "I need help with my order", sender: 'contact', timestamp: "10:35 AM" },
      ]
    },
    { 
      id: "2", 
      name: "Sarah Johnson", 
      lastMessage: "Thank you for the information", 
      time: "1h ago", 
      unread: 0,
      messages: [
        { id: "2-1", content: "Hi, I'm looking for information about your premium plan", sender: 'contact', timestamp: "Yesterday" },
        { id: "2-2", content: "Our premium plan includes 24/7 support, unlimited messages, and priority feature access.", sender: 'user', timestamp: "Yesterday" },
        { id: "2-3", content: "That sounds great! Can you send me a detailed pricing sheet?", sender: 'contact', timestamp: "Yesterday" },
        { id: "2-4", content: "Of course! I'll send it right away. Anything else you'd like to know?", sender: 'user', timestamp: "Yesterday" },
        { id: "2-5", content: "Thank you for the information", sender: 'contact', timestamp: "1h ago" },
      ]
    },
    { 
      id: "3", 
      name: "Michael Brown", 
      lastMessage: "When will my order arrive?", 
      time: "3h ago", 
      unread: 1,
      messages: [
        { id: "3-1", content: "I placed an order yesterday, #54321", sender: 'contact', timestamp: "Yesterday" },
        { id: "3-2", content: "I can see your order has been processed. It should ship today.", sender: 'user', timestamp: "Yesterday" },
        { id: "3-3", content: "When will my order arrive?", sender: 'contact', timestamp: "3h ago" },
      ]
    },
    { 
      id: "4", 
      name: "Emily Davis", 
      lastMessage: "I'd like to schedule a call", 
      time: "1d ago", 
      unread: 0,
      messages: [
        { id: "4-1", content: "I'd like to schedule a call to discuss your services", sender: 'contact', timestamp: "1d ago" },
      ]
    },
    { 
      id: "5", 
      name: "David Wilson", 
      lastMessage: "Can you provide more details?", 
      time: "2d ago", 
      unread: 0,
      messages: [
        { id: "5-1", content: "I'm interested in your RAG feature", sender: 'contact', timestamp: "3d ago" },
        { id: "5-2", content: "The RAG feature allows you to integrate your knowledge base with our AI responses", sender: 'user', timestamp: "3d ago" },
        { id: "5-3", content: "Can you provide more details?", sender: 'contact', timestamp: "2d ago" },
      ]
    },
  ]);
  
  const filteredChats = mockChats.filter(chat => {
    // Apply search filter
    const matchesSearch = chat.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Apply tab filter
    if (filterTab === 'all') return matchesSearch;
    if (filterTab === 'unread') return matchesSearch && chat.unread > 0;
    if (filterTab === 'archived') return false; // No archived chats in this demo
    
    return matchesSearch;
  });

  useEffect(() => {
    // Scroll to bottom of messages when a chat is selected or messages change
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [selectedChat, mockChats]);

  const handleSendMessage = () => {
    if (!messageInput.trim() || !selectedChat) return;
    
    const updatedChats = mockChats.map(chat => {
      if (chat.id === selectedChat) {
        const newMessage = {
          id: `${chat.id}-${chat.messages.length + 1}`,
          content: messageInput,
          sender: 'user' as const,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        
        // Update the chat with new message
        return {
          ...chat,
          lastMessage: messageInput,
          time: 'Just now',
          messages: [...chat.messages, newMessage]
        };
      }
      return chat;
    });
    
    setMockChats(updatedChats);
    setMessageInput('');
  };

  const handleChatSelect = (chatId: string) => {
    setSelectedChat(chatId);
    
    // Mark as read when selected
    setMockChats(prev => 
      prev.map(chat => 
        chat.id === chatId ? { ...chat, unread: 0 } : chat
      )
    );
  };
  
  return (
    <DashboardLayout title="Conversations">
      <div className="grid md:grid-cols-[350px_1fr] gap-4 h-[calc(100vh-8rem)]">
        {/* Conversations List */}
        <div className="border rounded-lg overflow-hidden flex flex-col">
          <div className="p-3 border-b">
            <div className="flex items-center gap-2 mb-3">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search conversations..." 
                  className="pl-8 w-full bg-muted/30"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button size="icon" variant="outline" className="shrink-0">
                <Filter className="h-4 w-4" />
              </Button>
              <Button size="icon" className="shrink-0 bg-botnexa-500 hover:bg-botnexa-600">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            
            <Tabs defaultValue="all" onValueChange={setFilterTab}>
              <TabsList className="w-full">
                <TabsTrigger value="all" className="flex-1">All</TabsTrigger>
                <TabsTrigger value="unread" className="flex-1">Unread</TabsTrigger>
                <TabsTrigger value="archived" className="flex-1">Archived</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          
          <div className="overflow-y-auto flex-1">
            {filteredChats.length === 0 ? (
              <div className="p-4 text-center text-muted-foreground">
                No conversations found
              </div>
            ) : (
              filteredChats.map((chat) => (
                <button
                  key={chat.id}
                  className={`w-full text-left px-3 py-3 border-b hover:bg-muted/30 transition-colors ${
                    selectedChat === chat.id ? "bg-muted/50" : ""
                  }`}
                  onClick={() => handleChatSelect(chat.id)}
                >
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={`https://i.pravatar.cc/150?u=${chat.id}`} />
                      <AvatarFallback>{chat.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="font-medium truncate">{chat.name}</p>
                        <span className="text-xs text-muted-foreground">{chat.time}</span>
                      </div>
                      <p className="text-sm text-muted-foreground truncate">{chat.lastMessage}</p>
                    </div>
                    {chat.unread > 0 && (
                      <Badge className="bg-botnexa-500 hover:bg-botnexa-600 rounded-full shrink-0">
                        {chat.unread}
                      </Badge>
                    )}
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
        
        {/* Chat Content */}
        {selectedChat ? (
          <Card className="flex flex-col h-full">
            {/* Chat Header */}
            <div className="p-3 border-b flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={`https://i.pravatar.cc/150?u=${selectedChat}`} />
                  <AvatarFallback>
                    {mockChats.find(c => c.id === selectedChat)?.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">
                    {mockChats.find(c => c.id === selectedChat)?.name}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon">
                  <ArrowUpRight className="h-4 w-4" />
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>View Contact</DropdownMenuItem>
                    <DropdownMenuItem>Archive</DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">Delete Conversation</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            
            {/* Chat Messages */}
            <CardContent className="flex-1 p-4 overflow-y-auto space-y-4">
              {mockChats.find(c => c.id === selectedChat)?.messages.map((message) => (
                <div 
                  key={message.id} 
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`max-w-[75%] rounded-lg p-3 ${
                      message.sender === 'user' 
                        ? 'bg-botnexa-500 text-white' 
                        : 'bg-secondary'
                    }`}
                  >
                    <p>{message.content}</p>
                    <p className={`text-xs mt-1 ${message.sender === 'user' ? 'text-white/70' : 'text-muted-foreground'}`}>
                      {message.timestamp}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </CardContent>
            
            {/* Message Input */}
            <div className="p-3 border-t">
              <form 
                className="flex items-end gap-2"
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
              >
                <Input 
                  placeholder="Type a message..." 
                  className="flex-1"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                />
                <Button 
                  type="submit" 
                  className="bg-botnexa-500 hover:bg-botnexa-600"
                  disabled={!messageInput.trim()}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </Card>
        ) : (
          <Card className="flex items-center justify-center h-full">
            <div className="text-center p-6">
              <div className="mx-auto bg-muted/50 rounded-full w-12 h-12 flex items-center justify-center mb-3">
                <MessageSquare className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium mb-1">No Conversation Selected</h3>
              <p className="text-muted-foreground text-sm max-w-sm">
                Select a conversation from the list to view messages or start a new conversation.
              </p>
              <Button className="mt-4 bg-botnexa-500 hover:bg-botnexa-600">
                <Plus className="h-4 w-4 mr-2" />
                New Conversation
              </Button>
            </div>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Conversations;

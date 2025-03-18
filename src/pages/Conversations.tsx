
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import DashboardLayout from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Search, MessageSquare, Send, Phone, VideoIcon, MoreVertical, X, Paperclip, Image, Smile } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import ChatHistory from '@/components/ChatHistory';
import { dummyContacts, dummyConversations } from '@/lib/dummy-data';
import { Conversation } from '@/types/app-types';

const Conversations = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const contactId = searchParams.get('contact');
  
  const [selectedChat, setSelectedChat] = useState<Conversation | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [message, setMessage] = useState('');
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState('all');

  const conversations = dummyConversations;
  
  // Filter conversations based on search and tab
  const filteredConversations = conversations.filter(conv => {
    const matchesSearch = conv.contactName.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (selectedTab === 'all') return matchesSearch;
    if (selectedTab === 'active') return matchesSearch && conv.status === 'active';
    if (selectedTab === 'pending') return matchesSearch && conv.status === 'pending';
    if (selectedTab === 'closed') return matchesSearch && conv.status === 'closed';
    
    return matchesSearch;
  });

  useEffect(() => {
    // Find conversation by contact ID from URL params
    if (contactId) {
      const conversation = conversations.find(conv => conv.contactId === contactId);
      if (conversation) {
        setSelectedChat(conversation);
      }
    } else if (conversations.length > 0 && !selectedChat) {
      // Select first conversation by default
      setSelectedChat(conversations[0]);
    }
  }, [contactId, conversations, selectedChat]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    
    console.log("Sending message:", message);
    setMessage('');
  };

  const getContactDetails = (contactId: string) => {
    return dummyContacts.find(contact => contact.id === contactId);
  };

  return (
    <DashboardLayout title="Conversations">
      <div className="flex h-[calc(100vh-4rem)] overflow-hidden">
        {/* Conversation List - Hidden on mobile when chat is selected */}
        <div className={`w-full md:w-80 lg:w-96 border-r border-border flex-shrink-0 flex flex-col ${selectedChat && 'hidden md:flex'}`}>
          <div className="p-4 border-b border-border">
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Tabs defaultValue="all" onValueChange={setSelectedTab}>
              <TabsList className="w-full">
                <TabsTrigger value="all" className="flex-1">All</TabsTrigger>
                <TabsTrigger value="active" className="flex-1">Active</TabsTrigger>
                <TabsTrigger value="pending" className="flex-1">Pending</TabsTrigger>
                <TabsTrigger value="closed" className="flex-1">Closed</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {filteredConversations.length === 0 ? (
              <div className="p-4 text-center text-muted-foreground">
                No conversations found
              </div>
            ) : (
              filteredConversations.map((conversation) => (
                <div
                  key={conversation.id}
                  className={`p-4 border-b border-border hover:bg-accent/50 cursor-pointer transition-colors ${
                    selectedChat?.id === conversation.id ? 'bg-accent/50' : ''
                  }`}
                  onClick={() => {
                    setSelectedChat(conversation);
                    setIsMobileMenuOpen(false);
                  }}
                >
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback className="bg-botnexa-100 text-botnexa-700 dark:bg-botnexa-950/30 dark:text-botnexa-400">
                        {conversation.contactName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <h3 className="font-medium truncate">{conversation.contactName}</h3>
                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                          {new Date(conversation.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <p className="text-sm text-muted-foreground truncate pr-2">
                          {conversation.lastMessage}
                        </p>
                        {conversation.unreadCount > 0 && (
                          <Badge className="bg-botnexa-500 hover:bg-botnexa-500/90 text-white">
                            {conversation.unreadCount}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        
        {/* Chat View */}
        {selectedChat ? (
          <div className={`flex-1 flex flex-col h-full ${!selectedChat && 'hidden md:flex'}`}>
            {/* Chat Header */}
            <div className="border-b border-border p-4 flex justify-between items-center bg-card">
              <div className="flex items-center gap-3">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="md:hidden"
                  onClick={() => setSelectedChat(null)}
                >
                  <X className="h-5 w-5" />
                </Button>
                <Avatar>
                  <AvatarFallback className="bg-botnexa-100 text-botnexa-700 dark:bg-botnexa-950/30 dark:text-botnexa-400">
                    {selectedChat.contactName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="font-medium">{selectedChat.contactName}</h2>
                  <div className="flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full bg-green-500"></span>
                    <span className="text-xs text-muted-foreground">Online</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon">
                  <Phone className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon">
                  <VideoIcon className="h-5 w-5" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setIsInfoOpen(true)}
                >
                  <MoreVertical className="h-5 w-5" />
                </Button>
              </div>
            </div>
            
            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 bg-accent/20">
              <ChatHistory contactName={selectedChat.contactName} />
            </div>
            
            {/* Message Input */}
            <div className="p-4 border-t border-border bg-card">
              <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                <Button type="button" variant="ghost" size="icon">
                  <Paperclip className="h-5 w-5" />
                </Button>
                <Button type="button" variant="ghost" size="icon">
                  <Image className="h-5 w-5" />
                </Button>
                <Input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1"
                />
                <Button type="button" variant="ghost" size="icon">
                  <Smile className="h-5 w-5" />
                </Button>
                <Button type="submit" size="icon" className="bg-botnexa-500 hover:bg-botnexa-600">
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-accent/20 hidden md:flex">
            <div className="text-center">
              <MessageSquare className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h2 className="text-xl font-medium mb-2">No Conversation Selected</h2>
              <p className="text-muted-foreground">
                Select a conversation from the list to start chatting
              </p>
            </div>
          </div>
        )}
        
        {/* Mobile Menu Button - Only shown on mobile when chat is selected */}
        {selectedChat && (
          <Button
            variant="outline"
            size="icon"
            className="fixed bottom-4 right-4 rounded-full h-12 w-12 shadow-lg md:hidden z-10 bg-botnexa-500 text-white hover:bg-botnexa-600 border-0"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <MessageSquare className="h-5 w-5" />
          </Button>
        )}
        
        {/* Mobile Sheet for Conversations */}
        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetContent side="left" className="p-0 w-4/5">
            <SheetHeader className="p-4 border-b border-border">
              <SheetTitle>Conversations</SheetTitle>
            </SheetHeader>
            <div className="p-4">
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search conversations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Tabs defaultValue={selectedTab} onValueChange={setSelectedTab}>
                <TabsList className="w-full">
                  <TabsTrigger value="all" className="flex-1">All</TabsTrigger>
                  <TabsTrigger value="active" className="flex-1">Active</TabsTrigger>
                  <TabsTrigger value="pending" className="flex-1">Pending</TabsTrigger>
                  <TabsTrigger value="closed" className="flex-1">Closed</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            <div className="overflow-y-auto">
              {filteredConversations.map((conversation) => (
                <div
                  key={conversation.id}
                  className={`p-4 border-b border-border hover:bg-accent/50 cursor-pointer transition-colors ${
                    selectedChat?.id === conversation.id ? 'bg-accent/50' : ''
                  }`}
                  onClick={() => {
                    setSelectedChat(conversation);
                    setIsMobileMenuOpen(false);
                  }}
                >
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback className="bg-botnexa-100 text-botnexa-700 dark:bg-botnexa-950/30 dark:text-botnexa-400">
                        {conversation.contactName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <h3 className="font-medium truncate">{conversation.contactName}</h3>
                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                          {new Date(conversation.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <p className="text-sm text-muted-foreground truncate pr-2">
                          {conversation.lastMessage}
                        </p>
                        {conversation.unreadCount > 0 && (
                          <Badge className="bg-botnexa-500 hover:bg-botnexa-500/90 text-white">
                            {conversation.unreadCount}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </SheetContent>
        </Sheet>
        
        {/* Contact Info Dialog */}
        <Dialog open={isInfoOpen} onOpenChange={setIsInfoOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Contact Information</DialogTitle>
            </DialogHeader>
            
            {selectedChat && (
              <div className="space-y-4">
                <div className="flex flex-col items-center text-center">
                  <Avatar className="h-20 w-20 mb-2">
                    <AvatarFallback className="text-lg bg-botnexa-100 dark:bg-botnexa-950/30 text-botnexa-600 dark:text-botnexa-400">
                      {selectedChat.contactName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <h3 className="text-xl font-bold">{selectedChat.contactName}</h3>
                  
                  <div className="mt-1">
                    <Badge variant="outline" className="bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-400 border-green-200 dark:border-green-900">
                      Online
                    </Badge>
                  </div>
                </div>

                {/* Contact details */}
                {getContactDetails(selectedChat.contactId) && (
                  <div className="space-y-3 pt-2">
                    <div className="flex items-center gap-3">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{getContactDetails(selectedChat.contactId)?.phoneNumber}</span>
                    </div>
                    
                    {getContactDetails(selectedChat.contactId)?.email && (
                      <div className="flex items-center gap-3">
                        <MessageSquare className="h-4 w-4 text-muted-foreground" />
                        <span>{getContactDetails(selectedChat.contactId)?.email}</span>
                      </div>
                    )}
                    
                    <div className="flex flex-wrap gap-1 mt-2">
                      {getContactDetails(selectedChat.contactId)?.tags.map(tag => (
                        <Badge key={tag} variant="outline" className="capitalize">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="space-y-2 pt-2">
                  <h4 className="font-medium">Conversation Status</h4>
                  <Badge 
                    className={
                      selectedChat.status === 'active' ? 'bg-green-500' :
                      selectedChat.status === 'pending' ? 'bg-yellow-500' :
                      'bg-gray-500'
                    }
                  >
                    {selectedChat.status.charAt(0).toUpperCase() + selectedChat.status.slice(1)}
                  </Badge>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default Conversations;

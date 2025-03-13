
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  Search, Send, Paperclip, Smile, ArrowLeft, Phone, Video, MoreVertical, 
  Image, Mic, Plus, MessageSquare
} from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { useIsMobile } from "@/hooks/use-mobile";

// Sample conversation data
const conversations = [
  {
    id: "1",
    name: "Jane Cooper",
    photoUrl: "https://github.com/shadcn.png",
    lastMessage: "Hey there! How's it going?",
    timestamp: "10:42 AM",
    unread: 2,
  },
  {
    id: "2",
    name: "Alex Morgan",
    photoUrl: null,
    lastMessage: "Let me know when you're free",
    timestamp: "Yesterday",
    unread: 0,
  },
  {
    id: "3",
    name: "Sarah Williams",
    photoUrl: "https://github.com/shadcn.png",
    lastMessage: "Did you check the latest update?",
    timestamp: "Yesterday",
    unread: 1,
  },
  {
    id: "4",
    name: "Business Group",
    photoUrl: null,
    lastMessage: "John: I'll send the report later",
    timestamp: "3/24/2023",
    unread: 0,
  },
  {
    id: "5",
    name: "Customer Support",
    photoUrl: "https://github.com/shadcn.png",
    lastMessage: "Your ticket has been resolved.",
    timestamp: "3/23/2023",
    unread: 0,
  },
];

const messages = [
  {
    id: "1",
    content: "Hey there! How's it going?",
    timestamp: "10:30 AM",
    isMe: false,
  },
  {
    id: "2",
    content: "Hi! I'm good, thanks for asking. Just finishing up some work. How about you?",
    timestamp: "10:32 AM",
    isMe: true,
  },
  {
    id: "3",
    content: "Pretty good! I was wondering if you'd like to catch up this weekend?",
    timestamp: "10:33 AM",
    isMe: false,
  },
  {
    id: "4",
    content: "That sounds great! I'm free on Saturday afternoon. Does that work for you?",
    timestamp: "10:36 AM",
    isMe: true,
  },
  {
    id: "5",
    content: "Saturday works perfectly. How about we meet at the café downtown around 2PM?",
    timestamp: "10:38 AM",
    isMe: false,
  },
  {
    id: "6",
    content: "Perfect! I'll see you then.",
    timestamp: "10:40 AM",
    isMe: true,
  },
  {
    id: "7",
    content: "Looking forward to it! 😊",
    timestamp: "10:42 AM",
    isMe: false,
  },
];

const Conversations = () => {
  const isMobile = useIsMobile();
  const [selectedConversation, setSelectedConversation] = useState<string | null>(isMobile ? null : "1");
  const [newMessage, setNewMessage] = useState("");
  const navigate = useNavigate();
  
  const selectedContact = conversations.find(c => c.id === selectedConversation);
  
  const handleBack = () => {
    setSelectedConversation(null);
  };
  
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      // Here you would normally send the message to an API
      console.log("Sending message:", newMessage);
      setNewMessage("");
    }
  };

  return (
    <DashboardLayout 
      title={isMobile && selectedConversation ? selectedContact?.name || "Conversation" : "Conversations"}
      showBackButton={isMobile && !!selectedConversation}
      onBack={handleBack}
    >
      <div className="h-full flex-1 flex flex-col md:flex-row gap-4">
        {/* Conversation List - hide on mobile when a conversation is selected */}
        {(!isMobile || !selectedConversation) && (
          <Card className="md:w-1/3 w-full">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle>Chats</CardTitle>
                <Button variant="ghost" size="icon">
                  <Plus className="h-5 w-5" />
                </Button>
              </div>
              <div className="relative mt-2">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search conversations..."
                  className="pl-8 bg-background focus-visible:ring-botnexa-500"
                />
              </div>
            </CardHeader>
            <CardContent className="h-[calc(100vh-18rem)] overflow-auto">
              <div className="space-y-2">
                {conversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors ${
                      selectedConversation === conversation.id
                        ? "bg-secondary"
                        : "hover:bg-secondary/50"
                    }`}
                    onClick={() => setSelectedConversation(conversation.id)}
                  >
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={conversation.photoUrl || undefined} alt={conversation.name} />
                      <AvatarFallback>{conversation.name.slice(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center">
                        <h4 className="font-medium truncate">{conversation.name}</h4>
                        <span className="text-xs text-muted-foreground">
                          {conversation.timestamp}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground truncate">{conversation.lastMessage}</p>
                    </div>
                    {conversation.unread > 0 && (
                      <Badge className="rounded-full bg-botnexa-500 hover:bg-botnexa-600">
                        {conversation.unread}
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Chat Detail - hide on mobile when no conversation is selected */}
        {(!isMobile || selectedConversation) && (
          <Card className="flex-1 flex flex-col">
            {selectedConversation ? (
              <>
                <CardHeader className="border-b py-3 px-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage 
                          src={selectedContact?.photoUrl || undefined} 
                          alt={selectedContact?.name} 
                        />
                        <AvatarFallback>
                          {selectedContact?.name.slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-base">{selectedContact?.name}</CardTitle>
                        <CardDescription className="text-xs">Online</CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon">
                        <Phone className="h-5 w-5" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Video className="h-5 w-5" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="flex-1 overflow-auto p-4 h-[calc(100vh-26rem)]">
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.isMe ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[80%] px-4 py-2 rounded-lg ${
                            message.isMe
                              ? "bg-botnexa-500 text-white"
                              : "bg-secondary"
                          }`}
                        >
                          <p>{message.content}</p>
                          <div
                            className={`text-xs mt-1 ${
                              message.isMe ? "text-white/70" : "text-muted-foreground"
                            }`}
                          >
                            {message.timestamp}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>

                <CardFooter className="border-t p-3">
                  <form onSubmit={handleSendMessage} className="flex w-full gap-2">
                    <Button variant="ghost" size="icon" type="button">
                      <Paperclip className="h-5 w-5" />
                    </Button>
                    <Input
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type a message..."
                      className="flex-1"
                    />
                    <Button variant="ghost" size="icon" type="button">
                      <Smile className="h-5 w-5" />
                    </Button>
                    <Button 
                      type="submit" 
                      size="icon"
                      disabled={!newMessage.trim()}
                      className="bg-botnexa-500 hover:bg-botnexa-600 text-white"
                    >
                      <Send className="h-5 w-5" />
                    </Button>
                  </form>
                </CardFooter>
              </>
            ) : (
              <div className="flex items-center justify-center h-full p-8 text-center">
                <div>
                  <MessageSquare className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No conversation selected</h3>
                  <p className="text-muted-foreground">
                    Choose a conversation from the list to start chatting
                  </p>
                </div>
              </div>
            )}
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Conversations;


import React, { useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { User, Users, Search, Plus } from 'lucide-react';

const Contact = () => {
  const [selectedTab, setSelectedTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const contacts = [
    { id: 1, name: 'John Doe', email: 'john@example.com', type: 'contact' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', type: 'contact' },
    { id: 3, name: 'Marketing Team', members: 12, type: 'group' },
    { id: 4, name: 'Support Team', members: 8, type: 'group' },
  ];

  const filteredContacts = contacts.filter(contact => 
    contact.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout title="Contacts">
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Contacts</h1>
          <Button className="bg-botnexa-500 hover:bg-botnexa-600">
            <Plus className="h-4 w-4 mr-2" />
            Add Contact
          </Button>
        </div>

        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search contacts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <Card>
          <CardHeader className="pb-3">
            <Tabs defaultValue="all" onValueChange={setSelectedTab} className="w-full">
              <TabsList className="w-full justify-start">
                <TabsTrigger value="all" className="flex-1">All</TabsTrigger>
                <TabsTrigger value="contacts" className="flex-1">Contacts</TabsTrigger>
                <TabsTrigger value="groups" className="flex-1">Groups</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          <CardContent>
            <TabsContent value="all">
              <ContactList contacts={filteredContacts} />
            </TabsContent>
            <TabsContent value="contacts">
              <ContactList contacts={filteredContacts.filter(c => c.type === 'contact')} />
            </TabsContent>
            <TabsContent value="groups">
              <ContactList contacts={filteredContacts.filter(c => c.type === 'group')} />
            </TabsContent>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

const ContactList = ({ contacts }) => {
  return (
    <div className="space-y-2">
      {contacts.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          No contacts found
        </div>
      ) : (
        contacts.map(contact => (
          <div 
            key={contact.id} 
            className="p-4 rounded-lg border hover:bg-accent/50 transition-colors flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-botnexa-100 flex items-center justify-center">
                {contact.type === 'contact' ? (
                  <User className="h-5 w-5 text-botnexa-600" />
                ) : (
                  <Users className="h-5 w-5 text-botnexa-600" />
                )}
              </div>
              <div>
                <h3 className="font-medium">{contact.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {contact.type === 'contact' ? contact.email : `${contact.members} members`}
                </p>
              </div>
            </div>
            <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100">
              View
            </Button>
          </div>
        ))
      )}
    </div>
  );
};

export default Contact;

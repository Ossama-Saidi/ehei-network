'use client';
import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from "@/components/ui/label";
import { 
  Camera,
  Save,
  Loader2,
  X
} from 'lucide-react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';

interface GroupCreationData {
  
  name: string;
  description: string;
  groupBanner?: string;
}

export default function CreateGroupPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  
  // Form State
  const [groupName, setGroupName] = useState('');
  const [groupDescription, setGroupDescription] = useState('');
  const [groupBanner, setGroupBanner] = useState('/images/banner-default.png');
  
  // Image Preview States
  const [groupBannerPreview, setGroupBannerPreview] = useState<string | null>(null);
  
  // Dialog States
  const [groupBannerDialogOpen, setGroupBannerDialogOpen] = useState(false);
  
  // Refs for file inputs
  const groupBannerInputRef = useRef<HTMLInputElement>(null);

  const handleGroupBannerChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
        if (!allowedTypes.includes(file.type)) {
          toast.error('Invalid file type. Only JPEG, PNG, and GIF are allowed.');
          return;
        }
  
        const maxSize = 10 * 1024 * 1024;
        if (file.size > maxSize) {
          toast.error('File size exceeds the limit of 10 MB.');
          return;
        }
  
        const imageUrl = URL.createObjectURL(file);
        setGroupBannerPreview(imageUrl);
      } catch (error) {
        console.error('Error handling group banner change:', error);
        toast.error('Failed to update group banner');
      }
    }
  };
  const confirmGroupBannerChange = () => {
    if (groupBannerPreview) {
      setGroupBanner(groupBannerPreview);
      setGroupBannerPreview(null);
      setGroupBannerDialogOpen(false);
      toast.success('Group banner updated successfully!');
    }
  };

  const cancelGroupBannerUpload = () => {
    setGroupBannerPreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        router.push('/login');
        return;
      }

      if (!groupName.trim()) {
        toast.error('Group name is required');
        setIsLoading(false);
        return;
      }

      const groupData: GroupCreationData = {
        name: groupName,
        description: groupDescription || 'No description provided',
        groupBanner,
      };
      
      const response = await fetch('http://localhost:3002/groups', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(groupData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create group');
      }

      const result = await response.json();
      toast.success('Group created successfully!');
      const { id: groupid } = result; // Assuming the response contains an 'id' field
      router.push(`/groups/${groupid}`);
    } catch (error) {
      console.error('Error creating group:', error);
      toast.error('Unable to create group. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6">
      <form className="max-w-4xl mx-auto space-y-8" onSubmit={handleSubmit}>
        {/* Banner Section */}
        <div className="relative w-full h-56 sm:h-64 md:h-72 lg:h-80 rounded-xl overflow-hidden shadow-md">
          <img 
            src={groupBanner} 
            alt="Group Banner" 
            className="w-full h-full object-cover transition-all" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

          <button
            type="button"
            onClick={() => setGroupBannerDialogOpen(true)}
            className="absolute top-4 right-4 p-2 bg-white/90 hover:bg-white rounded-full shadow-lg transition-all"
            aria-label="Edit banner"
          >
            <Camera className="w-5 h-5 text-gray-700" />
          </button>
        </div>

        <div className="mt-14 relative">
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-gray-800">Create New Group</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-6">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="groupName" className="text-right">
                  Group Name
                </Label>
                <Input
                  name="groupName"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  placeholder="Enter group name"
                  className="col-span-3"
                  required
                />
              </div>

              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="groupDescription" className="text-right">
                  Description
                </Label>
                <Textarea
                  id="groupDescription"
                  value={groupDescription}
                  onChange={(e) => setGroupDescription(e.target.value)}
                  placeholder="Tell us about your group..."
                  rows={5}
                  className="col-span-3 resize-none"
                />
              </div>
            </CardContent>
          </Card>

          <div className="mt-8 mb-20 pb-10 flex justify-center">
            <Button 
              type="submit" 
              size="lg" 
              className="px-8 py-6 text-lg rounded-xl shadow-md flex items-center gap-2"
              disabled={isLoading}
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Save className="w-5 h-5 mr-2" />}
              {isLoading ? 'Creating Group...' : 'Create Group'}
            </Button>
          </div>
        </div>
      </form>

      <Dialog open={groupBannerDialogOpen} onOpenChange={setGroupBannerDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Change Group Banner</DialogTitle>
            <DialogDescription>
              Upload a new banner image for your group.
            </DialogDescription>
          </DialogHeader>

          <div className="grid w-full items-center gap-4 py-4">
            <div className="relative w-full h-48 rounded-lg overflow-hidden mb-2 bg-gray-100 border">
              <img 
                src={groupBannerPreview || groupBanner} 
                alt="Group Banner Preview" 
                className="w-full h-full object-cover" 
              />
              
              {groupBannerPreview && (
                <button
                  type="button"
                  onClick={cancelGroupBannerUpload}
                  className="absolute top-2 right-2 p-1 bg-red-500 hover:bg-red-600 rounded-full text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Input
                ref={groupBannerInputRef}
                type="file"
                accept="image/*"
                onChange={handleGroupBannerChange}
                className="hidden"
              />
              <Button
                type="button"
                onClick={() => groupBannerInputRef.current?.click()}
                className="w-full"
              >
                {groupBannerPreview ? 'Choose Different Image' : 'Choose Image'}
              </Button>
            </div>
          </div>

          <DialogFooter className="sm:justify-between">
            <Button variant="outline" onClick={() => {
              setGroupBannerPreview(null);
              setGroupBannerDialogOpen(false);
            }}>
              Cancel
            </Button>
            <Button 
              type="button" 
              onClick={confirmGroupBannerChange}
              disabled={!groupBannerPreview}
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}


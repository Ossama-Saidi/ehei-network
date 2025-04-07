'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Pencil, Upload, X } from "lucide-react";
import { toast } from "sonner";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogTrigger,
  DialogFooter,
  DialogClose 
} from "@/components/ui/dialog";

interface UserProfile {
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  role: string;
  bio?: string;
  profilePhoto?: string;
  bannerPhoto?: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const [userData, setUserData] = useState<UserProfile | null>(null);
  const [fullName, setFullName] = useState("");
  const [bio, setBio] = useState("Add bio");
  const [profilePhoto, setProfilePhoto] = useState("/images/profil.png");
  const [banner, setBanner] = useState("/images/banner.png");
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  
  const bannerInputRef = useRef<HTMLInputElement>(null);
  const profileInputRef = useRef<HTMLInputElement>(null);
  
  // Fetch user data when component mounts
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        // Check if the user is authenticated by getting the token from localStorage
        const token = localStorage.getItem('authToken');
        
        if (!token) {
          // Redirect to login if no token found
          router.push('/login');
          return;
        }
        
        const response = await fetch('http://localhost:3001/user/profil', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          if (response.status === 401) {
            // Token expired or invalid
            localStorage.removeItem('authToken');
            router.push('/login');
            return;
          }
          throw new Error('Failed to fetch user profile');
        }
        console.log(response.body);
        const data = await response.json();
        setUserData(data);
        
        // Update form values with the received data
        
        setFullName(`${data.prenom} ${data.nom}`);
        setBio(data.bio || "Add bio");
        
        // Set profile photo and banner if available
        if (data.profilePhoto) {
          setProfilePhoto(data.profilePhoto);
        }
        
        if (data.bannerPhoto) {
          setBanner(data.bannerPhoto);
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
        toast.error('Unable to load your profile. Please try again later.');
      } finally {
        setIsFetching(false);
      }
    };
    
    fetchUserProfile();
  }, [router]);

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const token = localStorage.getItem('authToken');
      
      if (!token) {
        router.push('/login');
        return;
      }
      
      // Extract first and last name from fullName
      const nameParts = fullName.trim().split(' ');
      const prenom = nameParts[0] || userData?.prenom || '';
      const nom = nameParts.slice(1).join(' ') || userData?.nom || '';
      
      // Prepare updated user data
      const updatedUserData = {
        nom,
        prenom,
        bio,
        profilePhoto,
        bannerPhoto: banner
      };
      
      const response = await fetch('http://localhost:3001/user/profil', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updatedUserData)
      });
      
      if (!response.ok) {
        throw new Error('Failed to update profile');
      }
      
      toast.success('Profile updated successfully!');
      
      // Optionally redirect or stay on the page
      // router.push('/dashboard');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Unable to update your profile. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBannerChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        // For now, we're just using URL.createObjectURL to preview the image
        // In a production environment, you would upload this to a server/cloud storage
        const imageUrl = URL.createObjectURL(file);
        setBanner(imageUrl);
        
        // Optional: Upload the image to server immediately
        // const formData = new FormData();
        // formData.append('bannerImage', file);
        // const response = await fetch('http://localhost:3001/user/upload-banner', {
        //   method: 'POST',
        //   headers: {
        //     'Authorization': Bearer ${localStorage.getItem('authToken')}
        //   },
        //   body: formData
        // });
        // const data = await response.json();
        // setBanner(data.imageUrl);
      } catch (error) {
        console.error('Error handling banner change:', error);
        toast.error('Failed to update banner image');
      }
    }
  };

  const handleProfileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        // For now, we're just using URL.createObjectURL to preview the image
        // In a production environment, you would upload this to a server/cloud storage
        const imageUrl = URL.createObjectURL(file);
        setProfilePhoto(imageUrl);
        
        // Optional: Upload the image to server immediately
        // const formData = new FormData();
        // formData.append('profileImage', file);
        // const response = await fetch('http://localhost:3001/user/upload-profile', {
        //   method: 'POST',
        //   headers: {
        //     'Authorization': Bearer ${localStorage.getItem('authToken')}
        //   },
        //   body: formData
        // });
        // const data = await response.json();
        // setProfilePhoto(data.imageUrl);
      } catch (error) {
        console.error('Error handling profile photo change:', error);
        toast.error('Failed to update profile photo');
      }
    }
  };

  // Show a loading state while fetching user data
  if (isFetching) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Loading profile...</p>
      </div>
    );
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div className="w-full mx-auto flex flex-col items-center">
        {/* Banner */}
        <div className="relative w-full max-w-3xl h-48 rounded-lg overflow-hidden">
          <img src={banner} alt="Banner" className="w-full h-full object-cover" />
          
          <Dialog>
            <DialogTrigger asChild>
              <button 
                type="button" 
                className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-100"
              >
                <Pencil className="w-5 h-5 text-gray-600" />
              </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Change Banner Image</DialogTitle>
                <DialogDescription>
                  Upload a new banner image for your profile.
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid w-full items-center gap-4 py-4">
                {banner && (
                  <div className="relative w-full h-48 rounded-lg overflow-hidden mb-4">
                    <img src={banner} alt="Banner Preview" className="w-full h-full object-cover" />
                  </div>
                )}
                
                <div className="flex flex-col gap-2">
                  <Input 
                    ref={bannerInputRef}
                    type="file" 
                    accept="image/*"
                    onChange={handleBannerChange}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    onClick={() => bannerInputRef.current?.click()}
                    className="w-full"
                  >
                    Choose Image
                  </Button>
                </div>
              </div>
              
              <DialogFooter className="sm:justify-end">
                <DialogClose asChild>
                  <Button type="button" variant="secondary">
                    Close
                  </Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Profile Photo */}
        <div className="relative w-32 h-32 max-w-3xl rounded-full overflow-hidden border-4 border-white -mt-16">
          <img src={profilePhoto} alt="Profile" className="w-full h-full object-cover" />
          
          <Dialog>
            <DialogTrigger asChild>
              <button 
                type="button"
                className="absolute bottom-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-100"
              >
                <Upload className="w-5 h-5 text-gray-600" />
              </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Change Profile Photo</DialogTitle>
                <DialogDescription>
                  Upload a new profile photo.
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid w-full items-center gap-4 py-4">
                {profilePhoto && (
                  <div className="mx-auto relative w-32 h-32 rounded-full overflow-hidden mb-4">
                    <img src={profilePhoto} alt="Profile Preview" className="w-full h-full object-cover" />
                  </div>
                )}
                
                <div className="flex flex-col gap-2">
                  <Input 
                    ref={profileInputRef}
                    type="file" 
                    accept="image/*"
                    onChange={handleProfileChange}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    onClick={() => profileInputRef.current?.click()}
                    className="w-full"
                  >
                    Choose Image
                  </Button>
                </div>
              </div>
              
              <DialogFooter className="sm:justify-end">
                <DialogClose asChild>
                  <Button type="button" variant="secondary">
                    Close
                  </Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Profile Details */}
        <Card className="mt-4 p-6 text-center w-full max-w-3xl">
          <CardContent>
            <div className="flex items-center justify-center gap-2">
              <Input
                className="text-2xl font-bold text-center border-none focus:ring-0"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
              <Pencil className="w-5 h-5 cursor-pointer" />
            </div>
            <p className="mt-2 text-sm text-gray-500">{userData?.email}</p>
            <p className="text-sm text-gray-500">{userData?.telephone}</p>
            <p className="text-sm text-gray-500 mb-4">Role: {userData?.role}</p>
            <Textarea
              className="mt-2 text-center border-none focus:ring-0"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            />
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="text-center mt-4 mb-4">
          <Button type="submit" disabled={isLoading} className="px-6 py-2 text-lg">
            {isLoading ? 'Chargement...' : "Save Changes"}
          </Button>
        </div>
      </div>
    </form>
  );
}
'use client';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from "@/components/ui/label";
import { 
  Pencil, 
  Upload, 
  X, 
  User, 
  Mail, 
  Phone, 
  Briefcase, 
  FileText,
  Camera,
  Save,
  Loader2
} from 'lucide-react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';

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
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const bannerInputRef = useRef<HTMLInputElement>(null);
  const profileInputRef = useRef<HTMLInputElement>(null);
  
  // Form state
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('');
  const [bio, setBio] = useState('');
  const [profilePhoto, setProfilePhoto] = useState('/images/profil.png');
  const [banner, setBanner] = useState('/images/banner.png');
  
  // Dialog states
  const [nameDialogOpen, setNameDialogOpen] = useState(false);
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);
  const [phoneDialogOpen, setPhoneDialogOpen] = useState(false);
  const [bioDialogOpen, setBioDialogOpen] = useState(false);
  const [profileDialogOpen, setProfileDialogOpen] = useState(false);
  const [bannerDialogOpen, setBannerDialogOpen] = useState(false);
  
  // Form edit states
  const [editedFirstName, setEditedFirstName] = useState('');
  const [editedLastName, setEditedLastName] = useState('');
  const [editedEmail, setEditedEmail] = useState('');
  const [editedPhone, setEditedPhone] = useState('');
  const [editedBio, setEditedBio] = useState('');
  
  // Image preview states
  const [profilePreview, setProfilePreview] = useState<string | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  
  // Fetch user data when component mounts
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) {
          router.push('/login');
          return;
        }

        const response = await fetch('http://localhost:3001/user/profil', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          if (response.status === 401) {
            localStorage.removeItem('authToken');
            router.push('/login');
            return;
          }
          throw new Error('Failed to fetch user profile');
        }

        const result = await response.json();

        if (!result.success || !result.data) {
          throw new Error('User data not found');
        }

        const data = result.data;
        console.log(data)
        setUserData(data);
        
        // Set form state
        setFirstName(data.prenom || '');
        setLastName(data.nom || '');
        setEmail(data.email || '');
        setPhone(data.telephone || '');
        setRole(data.role || '');
        setBio(data.bio || 'Add your bio here...');
        setProfilePhoto(data.profilePhoto || '/images/profil.png');
        setBanner(data.bannerPhoto || '/images/banner.png');
        
        // Set dialog form values
        setEditedFirstName(data.prenom || '');
        setEditedLastName(data.nom || '');
        setEditedEmail(data.email || '');
        setEditedPhone(data.telephone || '');
        setEditedBio(data.bio || 'Add your bio here...');
        
      } catch (error) {
        console.error('Error fetching user profile:', error);
        toast.error('Unable to load your profile. Please try again later.');
      } finally {
        setIsFetching(false);
      }
    };

    fetchUserProfile();
  }, [router]);

  // Submit form handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        router.push('/login');
        return;
      }

      const updatedUserData = {
        nom: lastName,
        prenom: firstName,
        email,
        telephone: phone,
        bio,
        profilePhoto,
        bannerPhoto: banner,
      };
      
      const response = await fetch('http://localhost:3001/user/profil', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(updatedUserData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Unable to update your profile. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  // Dialog save handlers
  const handleNameSave = () => {
    setFirstName(editedFirstName);
    setLastName(editedLastName);
    setNameDialogOpen(false);
    toast.success('Name updated successfully!');
  };

  const handleEmailSave = () => {
    setEmail(editedEmail);
    setEmailDialogOpen(false);
    toast.success('Email updated successfully!');
  };

  const handlePhoneSave = () => {
    setPhone(editedPhone);
    setPhoneDialogOpen(false);
    toast.success('Phone number updated successfully!');
  };

  const handleBioSave = () => {
    setBio(editedBio);
    setBioDialogOpen(false);
    toast.success('Bio updated successfully!');
  };

  // Handle banner image upload
  const handleBannerChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        // Validate file type
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
        if (!allowedTypes.includes(file.type)) {
          toast.error('Invalid file type. Only JPEG, PNG, and GIF are allowed.');
          return;
        }
  
        // Validate file size
        const maxSize = 10 * 1024 * 1024; // 10 MB in bytes
        if (file.size > maxSize) {
          toast.error('File size exceeds the limit of 10 MB.');
          return;
        }
  
        // Create temporary URL for preview
        const imageUrl = URL.createObjectURL(file);
        setBannerPreview(imageUrl);
         
      } catch (error) {
        console.error('Error handling banner change:', error);
        toast.error('Failed to update banner image');
      }
    }
  };

  // Handle banner image upload
const handleBannerUpload = async () => {
  if (!bannerPreview) return;
  
  try {
    // Get the file from the input
    const file = bannerInputRef.current?.files?.[0];
    if (!file) return;
    
    const token = localStorage.getItem('authToken');
    if (!token) {
      router.push('/login');
      return;
    }
    
    // Create FormData object
    const formData = new FormData();
    formData.append('images', file); // 'images' matches the field name in your backend
    
    // Upload the file
    const response = await fetch('http://localhost:3001/user/uploadBanner', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        // Don't set Content-Type header when sending FormData
      },
      body: formData,
    });
    
    if (!response.ok) {
      throw new Error('Failed to upload banner image');
    }
    
    const result = await response.json();
    
    // Update banner with the URL returned from server
    setBanner(result.url);
    setBannerPreview(null);
    setBannerDialogOpen(false);
    toast.success('Banner image uploaded successfully!');
    
  } catch (error) {
    console.error('Error uploading banner:', error);
    toast.error('Failed to upload banner image. Please try again.');
  }
};
  
  // Handle profile photo upload
  const handleProfileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        // Validate file type
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
        if (!allowedTypes.includes(file.type)) {
          toast.error('Invalid file type. Only JPEG, PNG, and GIF are allowed.');
          return;
        }
  
        // Validate file size
        const maxSize = 10 * 1024 * 1024; // 10 MB in bytes
        if (file.size > maxSize) {
          toast.error('File size exceeds the limit of 10 MB.');
          return;
        }
  
        // Create temporary URL for preview
        const imageUrl = URL.createObjectURL(file);
        setProfilePreview(imageUrl);
        
      } catch (error) {
        console.error('Error handling profile photo change:', error);
        toast.error('Failed to update profile photo');
      }
    }
  };
/*
  // Handle profile photo upload
const handleProfileUpload = async () => {
  if (!profilePreview) return;
  
  try {
    // Get the file from the input
    const file = profileInputRef.current?.files?.[0];
    if (!file) return;
    
    const token = localStorage.getItem('authToken');
    if (!token) {
      router.push('/login');
      return;
    }
    
    // Create FormData object
    const formData = new FormData();
    formData.append('images', file); // 'images' matches the field name in your backend
    
    // Upload the file
    const response = await fetch('http://localhost:3001/user/uploadProfile', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        // Don't set Content-Type header when sending FormData
      },
      body: formData,
    });
    
    if (!response.ok) {
      throw new Error('Failed to upload profile image');
    }
    
    const result = await response.json();
    
    // Update profile photo with the URL returned from server
    setProfilePhoto(result.url);
    setProfilePreview(null);
    setProfileDialogOpen(false);
    toast.success('Profile photo uploaded successfully!');
    
  } catch (error) {
    console.error('Error uploading profile photo:', error);
    toast.error('Failed to upload profile photo. Please try again.');
  }
};
*/

  // Confirm profile photo change
  const confirmProfilePhotoChange = () => {
    if (profilePreview) {
      setProfilePhoto(profilePreview);
      setProfilePreview(null);
      setProfileDialogOpen(false);
      toast.success('Profile photo updated successfully!');
    }
  };

  // Confirm banner change
  const confirmBannerChange = () => {
    if (bannerPreview) {
      setBanner(bannerPreview);
      setBannerPreview(null);
      setBannerDialogOpen(false);
      toast.success('Banner image updated successfully!');
    }
  };

  // Cancel image uploads
  const cancelProfileUpload = () => {
    setProfilePreview(null);
  };

  const cancelBannerUpload = () => {
    setBannerPreview(null);
  };

  if (isFetching) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="ml-2 text-lg">Loading your profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6">
      <form className="max-w-4xl mx-auto space-y-8" onSubmit={handleSubmit}>
        {/* Banner Section */}
        <div className="relative w-full h-56 sm:h-64 md:h-72 lg:h-80 rounded-xl overflow-hidden shadow-md">
          <img 
            src={banner} 
            alt="Profile Banner" 
            className="w-full h-full object-cover transition-all" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

          {/* Banner Edit Button */}
          <button
            type="button"
            onClick={() => setBannerDialogOpen(true)}
            className="absolute top-4 right-4 p-2 bg-white/90 hover:bg-white rounded-full shadow-lg transition-all"
            aria-label="Edit banner"
          >
            <Camera className="w-5 h-5 text-gray-700" />
          </button>
        </div>
          {/* Profile Photo */}
          <div className="sticky z-10 w-28 h-28 sm:w-32 sm:h-32 mx-auto -mt-5 md:mx-0 md:ml-12">
            <div className="relative group">
              <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-white bg-white shadow-lg">
                <img 
                  src={profilePhoto} 
                  alt="Profile" 
                  className="w-full h-full object-cover" 
                />
              </div>
              <button
                type="button"
                onClick={() => setProfileDialogOpen(true)}
                className="absolute bottom-1 right-1 p-2 bg-white/90 hover:bg-white rounded-full shadow-md transition-all"
                aria-label="Edit profile photo"
              >
                <Camera className="w-4 h-4 text-gray-700" />
              </button>
            </div>
          </div>

        {/* Profile Content */}
        <div className="mt-14 relative">
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-gray-800">Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-6">
              {/* Name Section */}
              <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-100 shadow-sm hover:border-gray-200 transition-all">
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
                    <User className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Name</p>
                    <p className="text-base font-semibold text-gray-900">{firstName} {lastName}</p>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="rounded-full" 
                  onClick={() => {
                    setEditedFirstName(firstName);
                    setEditedLastName(lastName);
                    setNameDialogOpen(true);
                  }}
                >
                  <Pencil className="w-4 h-4" />
                </Button>
              </div>

              {/* Email Section */}
              <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-100 shadow-sm hover:border-gray-200 transition-all">
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
                    <Mail className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Email</p>
                    <p className="text-base font-semibold text-gray-900">{email}</p>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="rounded-full" 
                  onClick={() => {
                    setEditedEmail(email);
                    setEmailDialogOpen(true);
                  }}
                >
                  <Pencil className="w-4 h-4" />
                </Button>
              </div>

              {/* Phone Section */}
              <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-100 shadow-sm hover:border-gray-200 transition-all">
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
                    <Phone className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Phone</p>
                    <p className="text-base font-semibold text-gray-900">{phone}</p>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="rounded-full" 
                  onClick={() => {
                    setEditedPhone(phone);
                    setPhoneDialogOpen(true);
                  }}
                >
                  <Pencil className="w-4 h-4" />
                </Button>
              </div>

              {/* Role Section */}
              <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-100 shadow-sm hover:border-gray-200 transition-all">
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
                    <Briefcase className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Role</p>
                    <p className="text-base font-semibold text-gray-900">{role}</p>
                  </div>
                </div>
              </div>

              {/* Bio Section */}
              <div className="p-4 bg-white rounded-lg border border-gray-100 shadow-sm hover:border-gray-200 transition-all">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10">
                      <FileText className="w-4 h-4 text-primary" />
                    </div>
                    <p className="text-sm font-medium text-gray-500">Bio</p>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="rounded-full" 
                    onClick={() => {
                      setEditedBio(bio);
                      setBioDialogOpen(true);
                    }}
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                </div>
                <div className="mt-1 text-gray-800 whitespace-pre-wrap">{bio}</div>
              </div>
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="mt-8 mb-20 pb-10 flex justify-center">
            <Button 
              onClick={() => router.push('/profil/index')}// type="submit" 
              size="lg" 
              className="px-8 py-6 text-lg rounded-xl shadow-md flex items-center gap-2"
              disabled={isLoading}
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Save className="w-5 h-5 mr-2" />}
              {isLoading ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </form>

      {/* Dialogs */}
      {/* Name Dialog */}
      <Dialog open={nameDialogOpen} onOpenChange={setNameDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Your Name</DialogTitle>
            <DialogDescription>
              Make changes to your name here.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="firstName" className="text-right">
                First Name
              </Label>
              <Input
                id="firstName"
                value={editedFirstName}
                onChange={(e) => setEditedFirstName(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="lastName" className="text-right">
                Last Name
              </Label>
              <Input
                id="lastName"
                value={editedLastName}
                onChange={(e) => setEditedLastName(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setNameDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleNameSave}>Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Email Dialog */}
      <Dialog open={emailDialogOpen} onOpenChange={setEmailDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Email Address</DialogTitle>
            <DialogDescription>
              Update your email address here.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={editedEmail}
                onChange={(e) => setEditedEmail(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEmailDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleEmailSave}>Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Phone Dialog */}
      <Dialog open={phoneDialogOpen} onOpenChange={setPhoneDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Phone Number</DialogTitle>
            <DialogDescription>
              Update your phone number here.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="phone" className="text-right">
                Phone
              </Label>
              <Input
                id="phone"
                type="tel"
                value={editedPhone}
                onChange={(e) => setEditedPhone(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPhoneDialogOpen(false)}>Cancel</Button>
            <Button onClick={handlePhoneSave}>Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Bio Dialog */}
      <Dialog open={bioDialogOpen} onOpenChange={setBioDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Your Bio</DialogTitle>
            <DialogDescription>
              Update your personal bio here.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Textarea
              value={editedBio}
              onChange={(e) => setEditedBio(e.target.value)}
              rows={5}
              placeholder="Tell us about yourself..."
              className="resize-none"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setBioDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleBioSave}>Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Profile Photo Dialog */}
      <Dialog open={profileDialogOpen} onOpenChange={setProfileDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Change Profile Photo</DialogTitle>
            <DialogDescription>
              Upload a new profile photo.
            </DialogDescription>
          </DialogHeader>

          <div className="grid w-full items-center gap-4 py-4">
            {/* Current profile photo or preview */}
            <div className="mx-auto relative w-32 h-32 rounded-full overflow-hidden mb-4 bg-gray-100 border">
              <img 
                src={profilePreview || profilePhoto} 
                alt="Profile Preview" 
                className="w-full h-full object-cover" 
              />
              
              {profilePreview && (
                <button
                  type="button"
                  onClick={cancelProfileUpload}
                  className="absolute top-0 right-0 p-1 bg-red-500 hover:bg-red-600 rounded-full text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

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
                {profilePreview ? 'Choose Different Image' : 'Choose Image'}
              </Button>
            </div>
          </div>

          <DialogFooter className="sm:justify-between">
            <Button variant="outline" onClick={() => {
              setProfilePreview(null);
              setProfileDialogOpen(false);
            }}>
              Cancel
            </Button>
            <Button 
              type="button" 
              onClick={confirmProfilePhotoChange}
              disabled={!profilePreview}
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Banner Image Dialog */}
      <Dialog open={bannerDialogOpen} onOpenChange={setBannerDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Change Banner Image</DialogTitle>
            <DialogDescription>
              Upload a new banner image for your profile.
            </DialogDescription>
          </DialogHeader>

          <div className="grid w-full items-center gap-4 py-4">
            {/* Current banner or preview */}
            <div className="relative w-full h-48 rounded-lg overflow-hidden mb-2 bg-gray-100 border">
              <img 
                src={bannerPreview || banner} 
                alt="Banner Preview" 
                className="w-full h-full object-cover" 
              />
              
              {bannerPreview && (
                <button
                  type="button"
                  onClick={cancelBannerUpload}
                  className="absolute top-2 right-2 p-1 bg-red-500 hover:bg-red-600 rounded-full text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

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
                {bannerPreview ? 'Choose Different Image' : 'Choose Image'}
              </Button>
            </div>
          </div>

          <DialogFooter className="sm:justify-between">
            <Button variant="outline" onClick={() => {
              setBannerPreview(null);
              setBannerDialogOpen(false);
            }}>
              Cancel
            </Button>
            <Button 
              type="button" 
              onClick={confirmBannerChange}
              disabled={!bannerPreview}
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
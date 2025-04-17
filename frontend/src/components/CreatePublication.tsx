'use client';

import { SetStateAction, useEffect, useState } from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import PrivacySelector from '@/components/PrivacySelector';
import { X, Users, CloudUpload, Loader2 } from 'lucide-react'; // ou les icônes équivalentes
import { CityButton, CompanyButton, EmploiButton, TechButton, ClubButton } from "@/components/buttons/SearchPopover";
import { EmojiButton } from "@/components/buttons/EmojiPopover";
import { toast } from 'sonner';
import { DecodedToken, getDecodedToken } from '@/utils/authUtils';


export default function CreatePublication ({ open, setImage, setOpen,description, setDescription, uploading, handleSubmit, loading }: any) {
    
    const decodedToken = getDecodedToken();
    const role = decodedToken?.role;

    const [user, setUser] = useState<DecodedToken | null>(null);    
        useEffect(() => {
          const tokenData = getDecodedToken();
          setUser(tokenData);
        }, []);
      
      // Get initials for avatar fallback
      const getInitials = () => {
        if (user && user.nom && user.prenom) {
          return `${user.prenom.charAt(0)}${user.nom.charAt(0)}`;
        }
        return 'U'; // Default fallback
      };

    const [privacy, setPrivacy] = useState("Public");
    // const [image, setImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [selectedValues, setSelectedValues] = useState({
        emoji: null,
        city: null,
        company: null,
        job: null,
        tech: null,
        club: null
    });
    const [highlight, setHighlight] = useState(false); // Track highlight state
    const [selectedTags, setSelectedTags] = useState([]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Validate file type
            const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
            if (!allowedTypes.includes(file.type)) {
            toast.error('Invalid file type. Please upload JPEG, PNG, or GIF.');
            return;
            }
            // Validate file size (e.g., max 5MB)
            const maxSize = 5 * 1024 * 1024; // 5MB
            if (file.size > maxSize) {
            toast.error('File is too large. Maximum size is 5MB.');
            return;
            }
            setImage(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSelection = (type: string, value: string) => {
        
        setSelectedValues((prev) => ({ ...prev, [type]: value }));
    
        // If an emoji is selected, append it to the description and highlight it
        if (type === "emoji") {
            setDescription((prevDescription: any) => prevDescription + value);
            setHighlight(true);
        } 
        
        // For city, company, and job, append them as hashtags with special styling
        if (["city", "company", "job", "tech", "club"].includes(type)) {
            const formattedTag = `#${value.replace(/\s+/g, "_")}`;
            setSelectedTags((prevTags): any => [...prevTags, formattedTag]);
            setHighlight(true);
        }
    };

    const handleDescriptionChange = (e: { target: { value: any; }; }) => {
        setDescription(e.target.value);
        setHighlight(false); // Remove highlight when the user manually types
    };

    function renderHashtags(tags: any[]) {
        return tags.map((tag, index) => (
            <span key={index} className="text-blue-500">{tag} </span>
        ));
    }
    
    return (
            <div className="bg-white p-4 rounded-lg shadow-sm flex items-center gap-4">
                <Avatar>
                    {/* <AvatarImage src="https://github.com/shadcn.png" /> */}
                    <AvatarFallback>{getInitials()}</AvatarFallback>
                </Avatar>
                <Input
                    placeholder="Que voulez-vous partager?"
                    className="bg-white w-full pl-4 pb-6 pt-5 ml-3 mr-12 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                    onFocus={() => setOpen(true)}
                />
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Créer une publication</DialogTitle>
                            {/* <DialogDescription>
                                 description if u want
                            </DialogDescription> */}
                        </DialogHeader>
                        <div className="flex items-center gap-3 py-4">
                            <Avatar>
                                {/* <AvatarImage src="https://github.com/shadcn.png" /> */}
                                <AvatarFallback>{getInitials()}</AvatarFallback>
                            </Avatar>
                            <div>
                            {/* <p className="text-base font-semibold">Ossama Saidi</p> */}
                            <PrivacySelector onChange={setPrivacy} />
                            </div>
                        </div>
                        <Textarea
                            placeholder="Que voulez-vous partager?"
                            className={`w-full h-20 font-medium text-base border-none focus:ring-0 ${
                                highlight ? "border-2 border-red-500" : "border"
                            }`}
                            value={description}
                            onChange={handleDescriptionChange}
                            disabled={loading}
                        />
                        <div className="mt-2">{renderHashtags(selectedTags)}</div>
                        <div className="border rounded-lg p-3 flex items-center gap-4">
                            <p className="text-sm font-medium">Ajouter à votre publication</p>
                            <div className="flex gap-2">
                                <EmojiButton onSelect={(value: string) => handleSelection("emoji", value)} />
                                <CityButton onSelect={(value: string) => handleSelection("city", value)} />
                                {role !== "ETUDIANT" ? (
                                <>
                                    <CompanyButton onSelect={(value: string) => handleSelection("company", value)} />
                                    <EmploiButton onSelect={(value: string) => handleSelection("job", value)} />
                                    <TechButton onSelect={(value: string) => handleSelection("tech", value)} />
                                </>
                                ) : (
                                    <ClubButton onSelect={(value: string) => handleSelection("club", value)} />
                                )}
                            </div>
                        </div>
                        {/* Zone de prévisualisation d'image */}
                            {uploading ? (
                            <div className="border rounded-lg p-6 mb-4 text-center flex items-center justify-center">
                                <div className="flex flex-col items-center">
                                <Loader2 className="h-6 w-6 animate-spin text-gray-500 mb-2" />
                                <p className="text-gray-600">Téléchargement en cours...</p>
                                </div>
                            </div>
                            ) : !imagePreview ? (
                            <div
                                className="border rounded-lg p-6 mb-4 text-center cursor-pointer"
                                onClick={() => document.getElementById('image-upload')?.click()}
                            >
                                <div className="bg-gray-100 h-10 w-10 rounded-full flex items-center justify-center mx-auto mb-2">
                                <CloudUpload className="h-5 w-5" />
                                </div>
                                <p className="font-medium">Ajouter des photos/vidéos</p>
                                <p className="text-sm text-gray-500">ou faites glisser-déposer</p>
                                <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                id="image-upload"
                                className="hidden"
                                aria-label="Upload image"
                                />
                            </div>
                            ) : (
                            <div className="relative mb-4 border rounded-lg overflow-hidden">
                                <img
                                src={imagePreview}
                                alt="Prévisualisation"
                                className="w-full h-auto max-h-[100px] object-contain"
                                />
                                <Button
                                onClick={() => {
                                    setImage(null);
                                    setImagePreview(null);
                                }}
                                className="absolute top-2 right-2 bg-gray-800 bg-opacity-70 text-white rounded-full p-1"
                                >
                                <X className="h-4 w-4" />
                                </Button>
                            </div>
                            )}
                        <DialogFooter>
                            <div className="flex justify-between items-center w-full">
                                <DialogClose asChild>
                                    <Button type="button" variant="secondary">Close</Button>
                                </DialogClose>
                                <Button 
                                className="bg-[#072BF2] mt-2" 
                                type="submit" 
                                onClick={() => handleSubmit(privacy,selectedValues)} // Passer la valeur privacy ici
                                disabled={loading}>
                                    {loading ? "Publication..." : "Publier"}
                                </Button>
                            </div>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
    );
}
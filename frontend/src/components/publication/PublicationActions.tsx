'use client';
import React, { useState } from 'react';
import { toast } from "sonner";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu";
  import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog";
import { Archive, Bookmark, Flag, Globe, GlobeLock, Lock, MoreHorizontal, X } from 'lucide-react';
import Publication from './Publication ';

interface PublicationActionsProps {
  id_publication: string | number;
  id_user: string | number;
  setPublications: React.Dispatch<React.SetStateAction<Publication[]>>;
  }
  const PublicationActions: React.FC<PublicationActionsProps> = ({ id_publication, id_user, setPublications }) => {
    const [audienceDialogOpen, setAudienceDialogOpen] = useState(false);
    const [reportDialogOpen, setReportDialogOpen] = useState(false);
    const [saveDialogOpen, setSaveDialogOpen] = useState(false);
    const [selectedAudience, setSelectedAudience] = useState('public');
    const [updating, setUpdating] = useState(false);
  
    const handleAudienceChange = (audience: string) => {
      setSelectedAudience(audience);
    };
    const handleAudienceConfirm = async () => {
      try {
        setUpdating(true);
        // Préparer les données pour la requête
        const requestData = {
          audience: selectedAudience,
          id_user: Number(id_user)
        };
        // Envoyer la requête PATCH au backend
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/publications/${id_publication}/audience`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestData),
        });
        
        if (!response.ok) {
          throw new Error(`Erreur HTTP: ${response.status}`);
        }
        // Afficher une notification de succès
        const audienceText = 
        selectedAudience === 'Public' ? 'Public' : 
        selectedAudience === 'Friends' ? 'Amis uniquement' : 
        'Privé';
        toast.success(`Audience modifiée`, {
          description: `La publication est maintenant visible par : ${audienceText}`,
        });
      } catch (error) {
        console.error('Erreur lors de la modification de l\'audience:', error);
        toast.error('Erreur lors de la modification de l\'audience', {
          description: 'Veuillez réessayer plus tard.',
        });
      } finally {
        setUpdating(false);
        setAudienceDialogOpen(false);
      }
        setAudienceDialogOpen(false);
    };
    const handleSaveConfirm = async () => {
      try {
        // Show loading state
        setUpdating(true);
        
        // Prepare data for the request
        const requestData = {
          id_publication: Number(id_publication),
          id_user: Number(id_user)
        };
        
        // Send POST request to the backend
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/publication-saves/save`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestData),
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || `Erreur HTTP: ${response.status}`);
        }
        
        // Show success notification
        toast.info(`Publication enregistrée`, {
          description: `La publication a été ajoutée à vos sauvegardes.`,
        });
        // Update UI state if needed (e.g., change save button appearance)
        // setSaved(true);
            
        } catch (error) {
          console.error('Erreur lors de l\'enregistrement de la publication:', error);
          
          // Show appropriate error message
          if (error.message.includes('already saved')) {
            toast.warning('Publication déjà enregistrée', {
              description: 'Cette publication est déjà dans vos sauvegardes.',
            });
          } else {
            toast.error('Erreur lors de l\'enregistrement', {
              description: 'Veuillez réessayer plus tard.',
            });
          }
        } finally {
          setUpdating(false);
          setSaveDialogOpen(false);
        }
    };

    const handleReportConfirm = () => {
      toast.warning(`Publication signalée`, {
        description: `Nous avons bien reçu votre signalement. Notre équipe l'examinera.`,
      });
      setReportDialogOpen(false);
    };
  
    return (
      <div className="flex items-center space-x-1">
        <DropdownMenu>
          <DropdownMenuTrigger>                            
            <MoreHorizontal className="w-5 h-5 text-gray-500" />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <div className="flex flex-col space-y-1">
              {/* Modifier l'audience */}
              <AlertDialog open={audienceDialogOpen} onOpenChange={setAudienceDialogOpen}>
                <AlertDialogTrigger asChild>
                  <DropdownMenuItem 
                    className="flex items-center space-x-2"
                    onSelect={(e) => e.preventDefault()}
                  >
                    <Globe className="w-4 h-4 text-blue-500" />
                    <span>Modifier l'audience</span>
                  </DropdownMenuItem>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Modifier l'audience de la publication</AlertDialogTitle>
                    <AlertDialogDescription>
                      Choisissez qui peut voir votre publication
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <div className="space-y-3">
                    <div 
                      className={`flex items-center space-x-2 p-2 rounded-lg cursor-pointer ${
                        selectedAudience === 'Public' 
                          ? 'bg-blue-100 border border-blue-300' 
                          : 'hover:bg-gray-100'
                      }`}
                      onClick={() => handleAudienceChange('Public')}
                    >
                      <Globe className="w-5 h-5 text-blue-500" />
                      <span>Public</span>
                    </div>
                    <div 
                      className={`flex items-center space-x-2 p-2 rounded-lg cursor-pointer ${
                        selectedAudience === 'Friends' 
                          ? 'bg-blue-100 border border-blue-300' 
                          : 'hover:bg-gray-100'
                      }`}
                      onClick={() => handleAudienceChange('Friends')}
                    >
                      <GlobeLock className="w-5 h-5 text-gray-500" />
                      <span>Amis uniquement</span>
                    </div>
                    <div 
                      className={`flex items-center space-x-2 p-2 rounded-lg cursor-pointer ${
                        selectedAudience === 'Only_me' 
                          ? 'bg-blue-100 border border-blue-300' 
                          : 'hover:bg-gray-100'
                      }`}
                      onClick={() => handleAudienceChange('Only_me')}
                    >
                      <Lock className="w-5 h-5 text-red-500" />
                      <span>Privé</span>
                    </div>
                  </div>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Annuler</AlertDialogCancel>
                    <AlertDialogAction onClick={handleAudienceConfirm} disabled={updating}>
                      {updating ? "Mise à jour..." : "Confirmer"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
    
              <DropdownMenuSeparator />
    
              {/* Archiver la publication */}
              <AlertDialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
                <AlertDialogTrigger asChild>
                  <DropdownMenuItem 
                    className="flex items-center space-x-2"
                    onSelect={(e) => e.preventDefault()}
                  >
                    <Bookmark className="w-4 h-4 text-gray-600" />
                    <span>Enregistrer la publication</span>
                  </DropdownMenuItem>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Enregistrer la publication</AlertDialogTitle>
                    <AlertDialogDescription>
                      Voulez-vous vraiment enregistrer cette publication ? Vous pourrez la retrouver dans vos sauvegardes.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Annuler</AlertDialogCancel>
                    <AlertDialogAction onClick={handleSaveConfirm} disabled={updating}>
                      {updating ? "Enregistrer..." : "Enregistrée"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
    
              {/* Signaler la publication */}
              <AlertDialog open={reportDialogOpen} onOpenChange={setReportDialogOpen}>
                <AlertDialogTrigger asChild>
                  <DropdownMenuItem 
                    className="flex items-center space-x-2 text-red-500 hover:bg-red-50"
                    onSelect={(e) => e.preventDefault()}
                  >
                    <Flag className="w-4 h-4" />
                    <span>Signaler la publication</span>
                  </DropdownMenuItem>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Signaler cette publication</AlertDialogTitle>
                    <AlertDialogDescription>
                      Êtes-vous sûr de vouloir signaler cette publication ? Cette action sera examinée par notre équipe.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Annuler</AlertDialogCancel>
                    <AlertDialogAction onClick={handleReportConfirm}>
                      Signaler
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
        {/* X button to remove publication from feed */}
        <button   
          onClick={(e) => {
            setPublications(prevPublications => 
              prevPublications.filter(pub => pub.id_publication !== id_publication)
            );
          }}
          className="p-1 rounded-full hover:bg-gray-200 transition-colors"
          title="Supprimer de mon fil"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>
      </div>
    );
  };
  export default PublicationActions;
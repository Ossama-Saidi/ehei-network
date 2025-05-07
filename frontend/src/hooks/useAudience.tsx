import { useState } from "react";
import axios from "axios";

const useAudience = (initialAudience: any) => {
    const [selectedAudience, setSelectedAudience] = useState(initialAudience);
    const [audienceDialogOpen, setAudienceDialogOpen] = useState(false);
    const [updating, setUpdating] = useState(false);

    const handleAudienceChange = (audience: any) => setSelectedAudience(audience);

    const handleAudienceConfirm = async (id_publication: any, id_user: any) => {
        if (!selectedAudience) return;
        setUpdating(true);

        try {
            await axios.patch(`/api/publications/${id_publication}/audience`, {
                audience: selectedAudience,
                id_user: id_user,
            });

            setAudienceDialogOpen(false); // Fermer la modal après mise à jour
        } catch (error) {
            console.error("Erreur mise à jour audience :", error);
        } finally {
            setUpdating(false);
        }
    };

    return {
        selectedAudience,
        audienceDialogOpen,
        updating,
        setAudienceDialogOpen,
        handleAudienceChange,
        handleAudienceConfirm,
    };
};

export default useAudience;
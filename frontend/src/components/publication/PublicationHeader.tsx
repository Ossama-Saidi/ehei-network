import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { BadgeCheck } from "lucide-react";

interface User {
  id: number;
  nom: string;
  prenom: string;
  nomComplet: string;
  role: string;
}

interface PublicationHeaderProps {
    id_user: number;
    date_publication: string;
  }
  const PublicationHeader: React.FC<PublicationHeaderProps> = ({ id_user, date_publication }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const fetchUser = async () => {
        try {
          // Fetch user data from your API (publication service)
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${id_user}`);
          if (!response.ok) {
            throw new Error('Failed to fetch user data');
          }
          const userData = await response.json();
          setUser(userData);
        } catch (error) {
          console.error("Error fetching user data:", error);
        } finally {
          setLoading(false);
        }
      };
  
      fetchUser();
    }, [id_user]);

     // Get initials for avatar fallback
      const getInitials = () => {
        if (user && user.nom && user.prenom) {
          return `${user.prenom.charAt(0)}${user.nom.charAt(0)}`;
        }
        return 'U'; // Default fallback
      };

    return (
      <div className="flex items-center gap-3">
        <Avatar>
          {/* <AvatarImage src="https://github.com/shadcn.png" /> */}
          <AvatarFallback>{getInitials()}</AvatarFallback>
        </Avatar>
        <div>
        {loading ? (
          <p className="font-semibold text-sm animate-pulse">Loading...</p>
        ) : (
          <p className="font-semibold text-sm flex items-center gap-1">
            {user ? (
              <>
                {user.nomComplet}
                {user.role !== "ETUDIANT" && (
                  <BadgeCheck className="w-4 h-4 text-blue-600" />
                )}
              </>
            ) : (
              `User ${id_user}`
            )}
          </p>
        )}
        <p className="text-xs text-gray-500">
          Publiée {formatDistanceToNow(new Date(date_publication), { addSuffix: true })}
        </p>
        </div>
      </div>
    );
  };
  export default PublicationHeader;

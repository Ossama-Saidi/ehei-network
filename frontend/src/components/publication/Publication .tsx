import { Card, CardContent } from "../ui/card";
import PublicationActions from "./PublicationActions";
import PublicationContent from "./PublicationContent";
import PublicationFooter from "./PublicationFooter";
import PublicationHeader from "./PublicationHeader";
import type { Publication } from "./publication.interface"; // Import the Publication interface
import { getDecodedToken } from '@/utils/authUtils';

interface PublicationProps {
  publication: Publication;
  setPublications: React.Dispatch<React.SetStateAction<Publication[]>>;
}

const Publication: React.FC<PublicationProps> = ({ publication, setPublications }) => {
  const decodedToken = getDecodedToken();
  // const nomComplet = decodedToken?.nomComplet || 'Anonymous User';
  const id_user = decodedToken?.sub || 0; // Assuming the user ID is in the token
  return (
      <Card className="rounded-lg shadow-sm">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <PublicationHeader
            id_user={publication.id_user}
            date_publication={publication.date_publication} 
            />
            <PublicationActions
              id_publication={publication.id_publication} 
              id_user={id_user} 
              setPublications={setPublications}
            />
          </div>
          <PublicationContent 
            description={publication.description}
            tags={publication.tags || ''}
            image={publication.image}
          />
          <PublicationFooter 
            id_publication={publication.id_publication} 
            id_user={id_user} 
          />
        </CardContent>
      </Card>
    );
  };
  export default Publication;
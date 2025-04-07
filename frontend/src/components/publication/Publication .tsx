import { Card, CardContent } from "../ui/card";
import PublicationActions from "./PublicationActions";
import PublicationContent from "./PublicationContent";
import PublicationFooter from "./PublicationFooter";
import PublicationHeader from "./PublicationHeader";
import type { Publication } from "./publication.interface"; // Import the Publication interface

interface PublicationProps {
  publication: Publication;
  setPublications: React.Dispatch<React.SetStateAction<Publication[]>>;
}

const Publication: React.FC<PublicationProps> = ({ publication, setPublications }) => {
  let id_user = 101;
  return (
      <Card className="rounded-lg shadow-sm">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <PublicationHeader
              id_user={id_user} 
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
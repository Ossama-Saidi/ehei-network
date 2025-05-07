import Publication from './Publication ';
import PublicationSkeleton from './PublicationSkeleton';

interface PublicationsListProps {
    loading: boolean;
    publications: Publication[];
    setPublications: React.Dispatch<React.SetStateAction<Publication[]>>;
  }
  
  const PublicationsList: React.FC<PublicationsListProps> = ({ loading, publications ,setPublications }) => {
    if (loading) {
      return (
        <div className="w-full space-y-8">
          <PublicationSkeleton />
          <PublicationSkeleton />
        </div>
      );
    }
  
    return (
      <div className="space-y-4">
        {publications.map((publication) => (
          <Publication key={publication.id_publication} publication={publication} setPublications={setPublications} />
        ))}
      </div>
    );
  };
  
  export default PublicationsList;
import Link from 'next/link';
import { JSX } from 'react';
import ExpandableImage from './ExpandableImage ';

interface PublicationContentProps {
    description: string;
    tags: string;
    image?: string;
  }
  const PublicationContent: React.FC<PublicationContentProps> = ({ description, tags, image }) => {
    const renderStyledDescription = (description: string, tags: string): JSX.Element => {
      const tagList = typeof tags === 'string' 
        ? tags.split(',').map(tag => tag.trim()) 
        : [];
  
      return (
        <>
          <p className="mt-3 text-sm">{description}</p>
          {tagList.length > 0 && (
            <div className="mt-2 text-blue-500 text-sm">
              {tagList.map((tag, index) => (
                <Link 
                  key={index} 
                  href={`/?tag=${encodeURIComponent(tag)}`} 
                  className="hover:underline mr-2"
                >
                  #{tag.replace(/\s+/g, '_')}
                </Link>
              ))}
            </div>
          )}
        </>
      );
    };
  
    return (
      <div>
        {renderStyledDescription(description, tags)}
        {image && (
          <ExpandableImage 
            src={`${process.env.NEXT_PUBLIC_STATIC_DIR}/uploads/${image}`} 
            alt="Image" 
          />
        )}
      </div>
    );
  };
  export default PublicationContent;
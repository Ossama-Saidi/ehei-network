import { MessageCircle, Send } from "lucide-react";
import Comments from "../Comments";
import { Separator } from "../ui/separator";
import { Button } from "../ui/button";
import LikeButton from "../LikeButton";
import { useState } from "react";

interface PublicationFooterProps {
    id_publication: number;
    id_user: number;
  }
  
  const PublicationFooter: React.FC<PublicationFooterProps> = ({ id_publication, id_user }) => {
    const [showComments, setShowComments] = useState(false);
  
    const toggleComments = () => {
      setShowComments(!showComments);
    };
  
    return (
      <>
        <Separator className="my-3" />
        <div className="flex justify-around text-gray-600 text-sm">
          <LikeButton id_publication={Number(id_publication)} id_user={Number(id_user)} />
          <Button 
            variant="ghost" 
            className="flex items-center gap-1"
            onClick={toggleComments}
          >
            <MessageCircle className="w-4 h-4" /> Commenter
          </Button>
          <Button variant="ghost" className="flex items-center gap-1">
            <Send className="w-4 h-4" /> Envoyer
          </Button>
        </div>
        {showComments && (
          <>
            <Separator className="my-3" />
            <Comments />
          </>
        )}
      </>
    );
  };
  export default PublicationFooter;
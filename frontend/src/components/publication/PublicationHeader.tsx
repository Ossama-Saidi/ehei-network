import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";

interface PublicationHeaderProps {
    id_user: number;
    date_publication: string;
  }
  const PublicationHeader: React.FC<PublicationHeaderProps> = ({ id_user, date_publication }) => {
    return (
      <div className="flex items-center gap-3">
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>OS</AvatarFallback>
        </Avatar>
        <div>
          <p className="font-semibold text-sm">{id_user}</p>
          <p className="text-xs text-gray-500">🌐 Publiée {formatDistanceToNow(new Date(date_publication), { addSuffix: true })}</p>
        </div>
      </div>
    );
  };
  export default PublicationHeader;

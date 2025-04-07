import { Skeleton } from "../ui/skeleton";

const PublicationSkeleton: React.FC = () => {
    return (
      <div className="flex flex-col space-y-5 w-full">
        <Skeleton className="h-32 w-full rounded-xl" />
        <div className="space-y-4 w-full">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-4/5" />
        </div>
      </div>
    );
  };
  export default PublicationSkeleton;
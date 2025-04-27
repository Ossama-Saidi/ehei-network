import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
// Removed incorrect import of 'group' from 'console'
// Define or import 'group' from the correct source if needed
import { Users } from 'lucide-react';

export interface Member {
  id: number;
  name: string;
  avatar?: string;
  role?: 'ADMIN' | 'MODERATOR' | 'MEMBER';
}

interface MemberPreviewProps {
  members: Array<{
    userId: number;
    role: string;
    user?: {
      name?: string;
      avatar?: string;
      email: string;
    };
  }>;
  totalCount: number;
  onViewAll: () => void;
}

export const MembersPreview: React.FC<MemberPreviewProps> = ({ members, totalCount, onViewAll }) => {
  console.log('MembersPreview props:', { members, totalCount }); // Debug log

  // Removed usage of 'group' as it is not defined
//   console.log('Group data:', {
//     memberCount: undefined, // Placeholder value
//     membersLength: undefined,
//     members: undefined
//   });

  return (
    <div className="bg-white rounded-lg shadow-md p-4 ">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-lg flex items-center gap-2">
          <Users className="h-5 w-5 text-gray-500" />
          Members Preview
        </h3>
        <span className="text-sm text-gray-500">{totalCount} total</span>
      </div>

      <div className="space-y-3">
        {members.slice(0, 5).map((member) => (
          <div key={member.userId} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src={member.user?.avatar} alt={member.user?.name || 'Member'} />
                <AvatarFallback>
                  {(member.user?.name || member.user?.email || 'U')[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">
                  {member.user?.name || member.user?.email?.split('@')[0] || `User ${member.userId}`}
                </p>
                <p className="text-xs text-gray-500 capitalize">
                  {member.role.toLowerCase()}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {totalCount > 5 && (
        <button
          onClick={onViewAll}
          className="w-full mt-4 text-sm text-blue-600 hover:text-blue-700 flex items-center justify-center gap-2 py-2 hover:bg-blue-50 rounded-md transition-colors"
        >
          View all members
          <span className="text-gray-500">({totalCount})</span>
        </button>
      )}
    </div>
  );
};
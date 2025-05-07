'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function RequestsTable({ requests, onAccept }) {

    // Get initials for avatar fallback
    const getInitials = (user) => {
        if (user.nom && user.prenom) {
          return `${user.prenom.charAt(0)}${user.nom.charAt(0)}`.toUpperCase();
        }
        return 'U';
      };

  return (
    <Card className="bg-white text-[#0e1320] shadow border rounded-lg">
      <CardHeader className="flex flex-row justify-between items-center">
        <CardTitle className="text-black text-lg font-semibold">Requests to Join</CardTitle>
        <div className="space-x-2">
          <Button variant="outline">Filter</Button>
          <Button variant="outline">See all</Button>
        </div>
      </CardHeader>
      <CardContent>
        <table className="w-full text-sm mt-2">
          <thead>
            <tr className="text-gray-500 border-b">
              <th className="text-left py-2">User</th>
              <th className="text-left">Email</th>
              <th className="text-left">Role</th>
              <th className="text-left">Requested</th>
              <th className="text-left">Status</th>
              <th className="text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((req) => (
              <tr
                key={req.id}
                className="border-b hover:bg-gray-50 transition"
              >
                <td className="flex items-center gap-3 py-2">
                    <Avatar>
                    <AvatarImage
                      src={req.avatar}
                      alt={`${req.nom} ${req.prenom}`}
                      className="w-8 h-8 rounded-full"
                    />
                    <AvatarFallback>{getInitials(req)}</AvatarFallback>
                  </Avatar>
                  <span>{req.prenom} {req.nom}</span>
                </td>
                <td>{req.email}</td>
                <td className="capitalize">{req.role.toLowerCase()}</td>
                <td className="text-gray-600">
                  {formatDistanceToNow(new Date(req.createdAt), { addSuffix: true })}
                </td>
                <td>
                    <span className="bg-amber-200 text-amber-800 text-xs p-3 py-1 rounded-full">
                        Pending
                    </span>
                </td>
                <td>
                  <Button variant="blue" size="sm" onClick={() => onAccept(req.id)}>
                    Accept
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}

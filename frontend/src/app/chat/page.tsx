import ChatView from '@/components/ChatView';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

export default function Chat() {
  return (
    <ProtectedRoute>
      <ChatView />
    </ProtectedRoute>
  );
}
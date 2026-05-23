import useAuthStore from '../../store/useAuthStore';
import LiveChat from '../chat/LiveChat';

const ChatInterface = () => {
  const { user } = useAuthStore();

  if (!user) return null;

  return (
    <div className="h-[calc(100vh-12rem)]">
      <LiveChat 
        patientId={user._id}
        doctorId={user.doctorId}
        currentUserType="Patient"
        contactName="My Doctor"
        token={user.token}
      />
    </div>
  );
};

export default ChatInterface;

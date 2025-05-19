import { Route, Routes } from "react-router-dom"
import HomePage from "./pages/HomePage"
import SignupPage from "./pages/SignupPage"
import LoginPage from "./pages/LoginPage"
import Settings from "./pages/Settings"
import { useThemeStore } from "./store/useThemeStore"
import ChatPage from "./pages/ChatPage"
import AiChatPage from "./pages/AiChatPage"
import { Toaster } from "react-hot-toast"
import { useAuthStore } from "./store/useAuthStore"
import { useEffect } from "react"
import CreateCompanion from "./components/CreateCompanion"
import ExploreCompanions from "./components/ExploreCompanions"
import CreatePage from "./pages/CreatePage"
import UserProfilePage from "./pages/UserProfilePage"
import EditProfile from "./components/EditProfile"
import UserPage from "./pages/UserPage"
import CreateOp from "./pages/CreateOp"
import CreateStory from "./components/CreateStory"
import CreateComp from "./components/CreateComp"
import GroupPage from "./pages/GroupPage"
import GroupChat from "./components/GroupChat"
import AiSubscriptionPage from "./pages/AiSubscriptionPage"
import SubscriptionSuccessPage from "./pages/SubscriptionSuccessPage"
import SubsSuccessPage from "./pages/SubsSuccessPage"
import PurchasesPage from "./pages/PurchasesPage"
import Navbar2 from "./components/Navbar2"
import socket from "./socket/socket"
import NotificationsPage from "./pages/NotificationsPage"
import NotifyPop from "./components/NotifyPop"
import AvatarPage from "./pages/AvatarPage"
import Aurora from "./components/Aurora"
import Express from "./components/Express"
import Discover from "./components/Discover"
import TinderPage from "./pages/TinderPage"
import TinderView from "./components/TinderView"
import SettingsPage from "./pages/SettingsPage"
import SearchPage from "./pages/SearchPage"
import BookmarkPage from "./pages/BookmarkPage"

function App() {
  const {theme} = useThemeStore();
  // eslint-disable-next-line no-unused-vars
  const {user, getprofile, updateUserStatus,setOnlineUsers,reconnectSocket} = useAuthStore();

  useEffect(() => {
    // Only set up socket connections if user is logged in
    if (user?._id) {
      console.log("Initializing socket connection for user:", user._id);
      
      // Connect socket if not connected
      if (!socket.connected) {
        socket.connect();
        console.log("Socket connecting...");
      }
      
      // Emit user online event
      socket.emit("user_online", user._id);
      console.log("Emitted user_online event for:", user._id);
      
      // Request current online users list from server
      socket.emit("get_online_users");
      console.log("Requested online users list");
    }
    
    // Listen for user status changes
    const handleUserStatusChange = ({ userId, status, onlineUsers: updatedOnlineUsers }) => {
      console.log("Received user_status_change:", { userId, status, updatedOnlineUsers });
      
      if (Array.isArray(updatedOnlineUsers)) {
        setOnlineUsers(updatedOnlineUsers);
      } else if (userId && status) {
        updateUserStatus(userId, status);
      }
    };
    
    // Listen for initial online users list
    const handleOnlineUsersList = (users) => {
      console.log("Received initial online users list:", users);
      if (Array.isArray(users)) {
        setOnlineUsers(users);
      }
    };
    
    // Handle socket reconnection
    const handleReconnect = () => {
      console.log("Socket reconnected, re-emitting user_online");
      if (user?._id) {
        socket.emit("user_online", user._id);
        socket.emit("get_online_users");
      }
    };
    
    // Set up event listeners
    socket.on("user_status_change", handleUserStatusChange);
    socket.on("online_users_list", handleOnlineUsersList);
    socket.io.on("reconnect", handleReconnect);
    
    // Cleanup
    return () => {
      socket.off("user_status_change", handleUserStatusChange);
      socket.off("online_users_list", handleOnlineUsersList);
      socket.io.off("reconnect", handleReconnect);
      console.log("Cleaned up socket listeners");
    };
  }, [user, updateUserStatus, setOnlineUsers]);

  // Handle page visibility changes
  useEffect(() => {
    if (!user?._id) return;
    
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        console.log('Page is now visible, reconnecting socket if needed');
        if (user?._id) {
          // Re-emit user_online and request online users list
          if (!socket.connected) {
            socket.connect();
          }
          socket.emit("user_online", user._id);
          socket.emit("get_online_users");
        }
      }
    };
    
    // Handle network reconnection
    const handleOnline = () => {
      console.log('Browser reports online status, reconnecting socket');
      if (user?._id) {
        if (!socket.connected) {
          socket.connect();
        }
        socket.emit("user_online", user._id);
        socket.emit("get_online_users");
      }
    };
    
    // Set up event listeners
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('online', handleOnline);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('online', handleOnline);
    };
  }, [user]);

  // Initial profile load
  useEffect(() => {
    getprofile();
  }, [getprofile]);
 
  return (
    <div data-theme={theme} className="min-h-screen flex flex-col sm:justify-center sm:pb-[88px] pb-[60px] relative">
      {/* Aurora positioned at the back using fixed position */}
      <div 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 9
        }}
      >
        <Aurora
          colorStops={["#ffffff", "#000000", "#ffffff"]}
          blend={0.5}
          amplitude={1.0}
          speed={0.5}
        />
      </div>
      
      <Navbar2/>
      <NotifyPop/>
      <div className="z-10 relative">
        <Routes>
          <Route path="/" element={user ? <HomePage/> : <LoginPage/>} />
          <Route path="/signup" element={user ? <HomePage/> : <SignupPage/>} />
          <Route path="/login" element={user ? <HomePage/> : <LoginPage/>} />
          <Route path="/settings" element={user ? <SettingsPage/> : <LoginPage/>} />
          <Route path="/themes" element={user ? <Settings/> : <LoginPage/>} />
          <Route path="/chat" element={user ? <ChatPage/> : <LoginPage/>} />
          <Route path="/Ai-chat" element={user ? <AiChatPage/> : <LoginPage/>} /> 
          <Route path="/create" element={user ? <CreateCompanion/> : <LoginPage/>} />
          <Route path="/create-comp" element={user ? <CreateComp/> : <LoginPage/>} />
          <Route path="/explore" element={user ? <ExploreCompanions/> : <LoginPage/>} />
          <Route path="/create-options" element={user ? <CreateOp/> : <LoginPage/>} />
          <Route path="/create-post" element={user ? <CreatePage/> : <LoginPage/>} />
          <Route path="/create-story" element={user ? <CreateStory/> : <LoginPage/>} />
          <Route path="/profile/:id" element={user ? <UserProfilePage/> : <LoginPage/>} />
          <Route path="/userProfile/:Uid" element={user ? <UserPage/> : <LoginPage/>} />
          <Route path="/edit-profile" element={user ? <EditProfile/> : <LoginPage/>} />
          <Route path="/group" element={user ? <GroupPage/> : <LoginPage/>} />
          <Route path="/group-chat/:id" element={user ? <GroupChat/> : <LoginPage/>} />
          <Route path="/subscribe-ai" element={user ? <AiSubscriptionPage/> : <LoginPage/>} />
          <Route path="/subscription/success" element={user ? <SubscriptionSuccessPage/> : <LoginPage/>} />
          <Route path="/subs/success/:creatorId" element={user ? <SubsSuccessPage/> : <LoginPage/>} />
          <Route path="/purchases" element={user ? <PurchasesPage/> : <LoginPage/>} />
          <Route path="/notifications" element={user ? <NotificationsPage/> : <LoginPage/>} />
          <Route path="/avatar" element={user ? <AvatarPage/> : <LoginPage/>} />
          <Route path="/express-yourself" element={user ? <Express/> : <LoginPage/>} />
          <Route path="/discover" element={user ? <Discover/> : <LoginPage/>} />
          <Route path="/facemash" element={user ? <TinderPage/> : <LoginPage/>} />
          <Route path="/tinder-profile/:id" element={user ? <TinderView/> : <LoginPage/>} />
          <Route path="/search-user" element={user ? <SearchPage/> : <LoginPage/>} />
          <Route path="/downloads" element={user ? <BookmarkPage/> : <LoginPage/>} />
        </Routes>
      </div>
      <Toaster/>
    </div>
  )
}

export default App
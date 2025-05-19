import { 
    FaPenAlt, 
    FaUsers, 
    FaComments, 
    FaRobot, 
    FaGem, 
    FaHeart 
  } from "react-icons/fa";
  import SpotlightCard from "./SpotlightCard"
  
  const NewUserFeed = () => {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12">
        <h1 className="text-5xl font-extrabold text-center bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Welcome to SimuLife
        </h1>
        <p className='text-center mt-3 text-lg text-gray-600'>
          Your all-in-one social platform for connecting, sharing, and discovering
        </p>
        
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12'>
          {/* Feature 1: Create Content */}
          <SpotlightCard spotlightColor="rgba(255, 107, 181, 0.6)">
            <div className="p-3 flex flex-col h-full">
              <div className="w-12 h-12 rounded-full bg-pink-600/20 flex items-center justify-center mb-4 border border-pink-600">
                <FaPenAlt className="text-2xl text-pink-600" />
              </div>
              <h2 className="text-2xl font-bold text-primary/50 mb-2">Express Yourself</h2>
              <p className="text-base-content/70 flex-grow">
                Share your thoughts with posts and stories. Create engaging content that reflects your personality.
              </p>
            </div>
          </SpotlightCard>
  
          {/* Feature 2: Social Interactions */}
          <SpotlightCard spotlightColor="rgba(101, 117, 255, 0.6)">
            <div className="p-3 flex flex-col h-full">
              <div className="w-12 h-12 rounded-full bg-blue-600/20 flex items-center justify-center mb-4 border border-blue-600">
                <FaUsers className="text-2xl text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-primary/50 mb-2">Connect & Engage</h2>
              <p className="text-base-content/70 flex-grow">
                Find friends, join communities, and interact through comments and reactions.
              </p>
            </div>
          </SpotlightCard>
  
          {/* Feature 3: Messaging */}
          <SpotlightCard spotlightColor="rgba(46, 213, 115, 0.6)">
            <div className="p-3 flex flex-col h-full">
              <div className="w-12 h-12 rounded-full bg-green-600/20 flex items-center justify-center mb-4 border border-green-600">
                <FaComments className="text-2xl text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-primary/50 mb-2">Seamless Chats</h2>
              <p className="text-base-content/70 flex-grow">
                Private messages and group chats with friends. Stay connected in real-time.
              </p>
            </div>
          </SpotlightCard>
  
          {/* Feature 4: AI Companion */}
          <SpotlightCard spotlightColor="rgba(253, 203, 110, 0.6)">
            <div className="p-3 flex flex-col h-full">
              <div className="w-12 h-12 rounded-full bg-yellow-600/20 flex items-center justify-center mb-4 border border-yellow-600">
                <FaRobot className="text-2xl text-yellow-600" />
              </div>
              <h2 className="text-2xl font-bold text-primary/50 mb-2">AI Companion</h2>
              <p className="text-base-content/70 flex-grow">
                Your personal AI friend (free tier available). Upgrade for advanced features and customization.
              </p>
            </div>
          </SpotlightCard>
  
          {/* Feature 5: Premium Content */}
          <SpotlightCard spotlightColor="rgba(162, 155, 254, 0.6)">
            <div className="p-3 flex flex-col h-full">
              <div className="w-12 h-12 rounded-full bg-purple-600/20 flex items-center justify-center mb-4 border border-purple-600">
                <FaGem className="text-2xl text-purple-600" />
              </div>
              <h2 className="text-2xl font-bold text-primary/50 mb-2">Exclusive Content</h2>
              <p className="text-base-content/70 flex-grow">
                Subscribe to creators for premium content. Monetize your own exclusive posts.
              </p>
            </div>
          </SpotlightCard>
  
          {/* Feature 6: Dating */}
          <SpotlightCard spotlightColor="rgba(255, 71, 87, 0.6)">
            <div className="p-3 flex flex-col h-full">
              <div className="w-12 h-12 rounded-full bg-red-600/20 flex items-center justify-center mb-4 border border-red-600">
                <FaHeart className="text-2xl text-red-600" />
              </div>
              <h2 className="text-2xl font-bold text-primary/50 mb-2">Find Your Match</h2>
              <p className="text-base-content/70 flex-grow">
                Discover meaningful connections based on shared interests and compatibility.
              </p>
            </div>
          </SpotlightCard>
        </div>
      </div>
    )
  }
  
  export default NewUserFeed

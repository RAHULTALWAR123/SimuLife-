import { motion } from 'framer-motion';

const UserProfileCard = () => {
  // Dummy user data
  const user = {
    name: "Alex Johnson",
    age: 28,
    height: 175,
    profilePic: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1287&q=80",
    about: "Digital designer and coffee enthusiast. Love hiking, photography, and trying new cuisines. Looking for someone to share adventures with!",
    sexuality: "Bisexual",
    lookingFor: "Long-term relationship",
    qualities: ["Creative", "Honest", "Adventurous", "Good listener", "Optimistic"],
    hopingToFind: ["Life partner", "Travel companion", "Deep conversations", "Shared hobbies"]
  };

  return (
    <motion.div 
      className="w-full max-w-md mx-auto bg-gradient-to-br from-base-100 to-base-200 rounded-2xl overflow-hidden shadow-xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Profile Header with Image */}
      <div className="relative h-72 w-full">
        <img 
          src={user.profilePic} 
          alt={user.name} 
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="text-3xl font-bold text-white">{user.name}</h2>
              <p className="text-white/90 mt-1">{user.age} years • {user.height} cm</p>
            </div>
            <div className="bg-primary/90 text-white px-3 py-1 rounded-full text-sm font-medium">
              {user.sexuality}
            </div>
          </div>
        </div>
      </div>

      {/* Profile Details */}
      <div className="p-6 space-y-5">
        {/* About Section */}
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-primary/80 uppercase tracking-wider">About</h3>
          <p className="text-base-content/90 leading-relaxed">{user.about}</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Looking For */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-primary/80 uppercase tracking-wider">Looking For</h3>
            <p className="text-base-content/90 font-medium">{user.lookingFor}</p>
          </div>

          {/* Qualities */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-primary/80 uppercase tracking-wider">Qualities</h3>
            <div className="flex flex-wrap gap-2">
              {user.qualities.map((quality, index) => (
                <span 
                  key={index}
                  className="px-3 py-1 bg-primary/10 text-primary text-xs rounded-full font-medium"
                >
                  {quality}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Relationship Goals */}
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-primary/80 uppercase tracking-wider">Relationship Goals</h3>
          <div className="flex flex-wrap gap-2">
            {user.hopingToFind.map((goal, index) => (
              <span 
                key={index}
                className="px-3 py-1 bg-secondary/10 text-secondary text-xs rounded-full font-medium"
              >
                {goal}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="px-6 pb-6 flex gap-3">
        <button className="flex-1 btn btn-outline btn-error rounded-full py-3 font-medium">
          ✕ Pass
        </button>
        <button className="flex-1 btn btn-primary rounded-full py-3 font-medium text-white">
          ♥ Like
        </button>
      </div>
    </motion.div>
  );
};

export default UserProfileCard;
import { useEffect, useState } from 'react';
import { useTinderStore } from '../store/useTinderStore';
import { Link, useNavigate } from 'react-router-dom';

const TinderPage = () => {
  const { matches: allMatches, matchLoading } = useTinderStore();
  const navigate = useNavigate();
  const [currentMatches, setCurrentMatches] = useState([]);
  const [remainingMatches, setRemainingMatches] = useState([]);

  // Initialize matches
  useEffect(() => {
    if (!matchLoading && allMatches.length === 0) {
      navigate('/discover');
    } else if (allMatches.length > 0) {
      // Start with first 2 matches
      setCurrentMatches(allMatches.slice(0, 2));
      // Store the remaining matches
      setRemainingMatches(allMatches.slice(2));
    }
  }, [allMatches, matchLoading, navigate]);

  const handleReject = (rejectedUserId) => {
    if (remainingMatches.length === 0) {
      // If no more matches, just remove the rejected one
      setCurrentMatches(currentMatches.filter(match => match._id !== rejectedUserId));
      return;
    }

    // Replace rejected match with next one from remaining
    const newCurrentMatches = currentMatches.map(match => 
      match._id === rejectedUserId ? remainingMatches[0] : match
    );

    setCurrentMatches(newCurrentMatches);
    setRemainingMatches(remainingMatches.slice(1));
  };

  if (matchLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl">Finding your perfect matches...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Your Potential Matches</h1>
      
      {allMatches.length === 0 ? (
        <div className="text-center text-xl">
          No matches found. Try adjusting your preferences.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mx-auto max-w-6xl">
          {currentMatches.map((user) => (
            <div 
              key={user._id} 
              className="bg-base-300 rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 border border-base-300"
            >
              {/* Profile Image */}
              <div className="h-72 bg-gradient-to-br from-primary/10 to-secondary/10 relative">
                {user.profilePic ? (
                  <img 
                    src={user.profilePic} 
                    alt={user.name} 
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-8xl text-primary/20">👤</span>
                  </div>
                )}
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
                  <h2 className="text-2xl font-bold text-white">{user.name}, <span className="font-normal">{user.age}</span></h2>
                  <p className="text-white/90">{user.height} cm • {user.sexuality}</p>
                </div>
              </div>
  
              {/* Profile Details */}
              <div className="p-6">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <h3 className="text-xs font-semibold text-primary/80 uppercase tracking-wider mb-1">Looking For</h3>
                    <p className="text-base-content">{user.lookingFor}</p>
                  </div>
                  <div>
                    <h3 className="text-xs font-semibold text-primary/80 uppercase tracking-wider mb-1">Relationship Goals</h3>
                    <div className="flex flex-wrap gap-1">
                      {user.hopingToFind?.slice(0, 3).map((goal, i) => (
                        <span key={i} className="px-2 py-1 bg-secondary/10 text-secondary text-xs rounded-full">
                          {goal}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
  
                <div className="mb-4">
                  <h3 className="text-xs font-semibold text-primary/80 uppercase tracking-wider mb-1">About</h3>
                  <p className="text-base-content/90 line-clamp-3">{user.about}</p>
                </div>
  
                <div className="mb-6">
                  <h3 className="text-xs font-semibold text-primary/80 uppercase tracking-wider mb-1">Qualities</h3>
                  <div className="flex flex-wrap gap-2">
                    {user.qualities?.map((quality, i) => (
                      <span key={i} className="px-3 py-1 bg-secondary/10 text-secondary text-sm rounded-full">
                        {quality}
                      </span>
                    ))}
                  </div>
                </div>
  
                <div className="flex justify-between gap-4">
                  {currentMatches.length > 1 && (
                    <button 
                      onClick={() => handleReject(user._id)}
                      className="flex-1 px-4 bg-base-100 text-base-content rounded-2xl py-3"
                    >
                      ✕ Reject
                    </button>
                  )}
                  <Link 
                    to={`/userProfile/${user._id}`} 
                    className="flex-1 btn btn-primary rounded-2xl py-3 text-primary-content"
                  >
                    ♥ View Profile
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
  
      {currentMatches.length === 1 && (
        <div className="text-center mt-8">
          <div className="inline-block bg-primary/10 text-primary px-6 py-3 rounded-full text-lg font-medium">
            You&apos;ve reached your final match!
          </div>
        </div>
      )}
    </div>
  );
};

export default TinderPage;
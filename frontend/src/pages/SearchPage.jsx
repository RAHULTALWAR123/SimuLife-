import { useState, useEffect } from 'react';
import { FiSearch } from 'react-icons/fi';
import { useAuthStore } from '../store/useAuthStore';
import { Link } from 'react-router-dom';

const SearchPage = () => {
    const [query, setQuery] = useState('');
    const { searchUsers, searchedUsers } = useAuthStore();
    const [isTyping, setIsTyping] = useState(false);

    // Debounced search as user types
    useEffect(() => {
        const timer = setTimeout(() => {
            if (query.length > 1) {
                searchUsers(query);
                setIsTyping(true);
            } else {
                searchUsers('');
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [query, searchUsers]);

    const handleSearch = () => {
        if (query.length > 1) {
            searchUsers(query);
            setIsTyping(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center pt-24 px-4">
            <div className="w-full max-w-2xl">
                <h1 className="font-extrabold sm:text-5xl text-4xl text-center mb-10 bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                    Discover People
                </h1>
                
                <div className="relative flex items-center">
                    <div className="absolute left-4 flex items-center pointer-events-none">
                        <FiSearch className="h-5 w-5 text-base-content/70" />
                    </div>
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="flex-1 pl-12 pr-20 py-4 border border-primary rounded-2xl bg-base-100 shadow-sm text-lg placeholder-base-content/40 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                        placeholder="Search by name or username..."
                    />
                    <button 
                        onClick={handleSearch}
                        className="absolute right-2 px-6 py-2 bg-gradient-to-r from-primary to-secondary text-primary-content font-medium rounded-xl hover:opacity-90 active:scale-95 transition-all">
                        Search
                    </button>
                </div>
                
                <p className="mt-4 text-center text-base-content/60">
                    {query.length < 2 ? 'Type at least 2 characters' : isTyping ? 'Keep typing for suggestions...' : 'Press enter to search'}
                </p>

                {/* Search Results */}
                {searchedUsers.length > 0 && (
                    <div className="mt-8 space-y-4">
                        <h2 className="text-xl font-semibold text-base-content">
                            {isTyping ? 'Suggestions' : 'Search Results'}
                        </h2>
                        <div className="bg-base-100 rounded-2xl border border-base-300 divide-y divide-base-300 overflow-hidden shadow-sm">
                            {searchedUsers.map(user => (
                                <Link 
                                    key={user._id} 
                                    to={`/userProfile/${user._id}`}
                                    className="flex items-center p-4 hover:bg-base-200 transition-colors"
                                >
                                    <div className="w-14 h-14 rounded-full mr-4">
                                        <img src={user.profilePic || "/avatar.jpg"} alt="" className='w-full h-full rounded-full' />
                                    </div>
                                    <div>
                                        <h3 className="font-medium">{user.name}</h3>
                                        <p className="text-sm text-base-content/60">@{user.username}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SearchPage;
// import React from 'react'
import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { LogIn, Mail, Lock, Loader } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
// import { useUserStore } from "../stores/useUserStore";

const LoginPage = () => {
  const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
  const {login , userLoading} = useAuthStore();

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(email, password);

    login(email, password);

    setEmail("");
    setPassword("");
    
  };


  return (
    <div className="min-h-screen  flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center"
            >
                <div className="relative">
                <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-primary rounded-full mb-1"></div>
                <h2 className="font-extrabold sm:text-4xl text-3xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                    Welcome back
                </h2>
                <p className="mt-2 text-sm text-gray-300">
                    Sign in to your account
                </p>
                </div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-gradient-to-t from-base-200 to-base-100 rounded-2xl shadow-xl overflow-hidden"
            >
                <div className="p-8 space-y-6">
                   

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-base-content mb-1">
                                Email address
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="email"
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="block w-full pl-10 pr-3 py-2 bg-base-200 border border-gray-600 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                    placeholder="you@example.com"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-base-content mb-1">
                                Password
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="password"
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="block w-full pl-10 pr-3 py-2 bg-base-200 border border-gray-600 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        

                        <div>
                            <button
                                type="submit"
                                className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-2xl shadow-sm text-sm font-medium text-primary-content bg-primary hover:bg-primary-focus focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-200 disabled:opacity-50"
                                disabled={userLoading}
                            >
                                {userLoading ? (
                                    <>
                                        <Loader className="mr-2 h-4 w-4 animate-spin" />
                                        Signing in...
                                    </>
                                ) : (
                                    <>
                                        <LogIn className="mr-2 h-4 w-4" />
                                        Sign in
                                    </>
                                )}
                            </button>
                        </div>
                    </form>

                    <p className="text-center text-sm text-gray-400">
                        Not a member?{" "}
                        <Link 
                            to="/signup" 
                            className="font-medium text-primary hover:text-primary-focus transition-colors duration-200"
                        >
                            Sign up now
                        </Link>
                    </p>
                </div>
            </motion.div>
        </div>
    </div>
)
}

export default LoginPage

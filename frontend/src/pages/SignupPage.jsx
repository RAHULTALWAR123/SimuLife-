// import React from 'react'
import { useState } from "react";
import { Link } from "react-router-dom";
import { UserPlus, Mail, Lock, User, Loader, AtSign } from "lucide-react";
import { motion } from "framer-motion";
import { useAuthStore } from "../store/useAuthStore";
// import { useUserStore } from "../stores/useUserStore";

const SignUpPage = () => {
    // const loading = false;
    const [formData, setFormData] = useState({
        name: "",
		username: "",
        email: "",
        password: "",
        confirmPassword: ""
    })

	const {signup,userLoading} = useAuthStore();

    const handleSubmit = (e) =>{
        e.preventDefault()
        console.log(formData);
		signup(formData);
		setFormData({name:"",username:"",email:"",password:"",confirmPassword:""})

    }

	return (
		<div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
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
						Create your account
					</h2>
					<p className="mt-2 text-sm text-gray-300">
						Join our community today
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
							<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
								<div>
									<label htmlFor="name" className="block text-sm font-medium text-base-content mb-1">
										Full name
									</label>
									<div className="relative">
										<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
											<User className="h-5 w-5 text-gray-400" />
										</div>
										<input
											id="name"
											type="text"
											required
											value={formData.name}
											onChange={(e) => setFormData({ ...formData, name: e.target.value })}
											className="block w-full pl-10 pr-3 py-2 bg-base-200 border border-gray-600 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
											placeholder="John Doe"
										/>
									</div>
								</div>
	
								<div>
									<label htmlFor="username" className="block text-sm font-medium text-base-content mb-1">
										Username
									</label>
									<div className="relative">
										<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
											<AtSign className="h-5 w-5 text-gray-400" />
										</div>
										<input
											id="username"
											type="text"
											required
											value={formData.username}
											onChange={(e) => setFormData({ ...formData, username: e.target.value })}
											className="block w-full pl-10 pr-3 py-2 bg-base-200 border border-gray-600 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
											placeholder="johndoe"
										/>
									</div>
								</div>
							</div>
	
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
										value={formData.email}
										onChange={(e) => setFormData({ ...formData, email: e.target.value })}
										className="block w-full pl-10 pr-3 py-2 bg-base-200 border border-gray-600 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
										placeholder="you@example.com"
									/>
								</div>
							</div>
	
							<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
											value={formData.password}
											onChange={(e) => setFormData({ ...formData, password: e.target.value })}
											className="block w-full pl-10 pr-3 py-2 bg-base-200 border border-gray-600 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
											placeholder="••••••••"
										/>
									</div>
								</div>
	
								<div>
									<label htmlFor="confirmPassword" className="block text-sm font-medium text-base-content mb-1">
										Confirm Password
									</label>
									<div className="relative">
										<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
											<Lock className="h-5 w-5 text-gray-400" />
										</div>
										<input
											id="confirmPassword"
											type="password"
											required
											value={formData.confirmPassword}
											onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
											className="block w-full pl-10 pr-3 py-2 bg-base-200 border border-gray-600 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
											placeholder="••••••••"
										/>
									</div>
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
											Creating account...
										</>
									) : (
										<>
											<UserPlus className="mr-2 h-4 w-4" />
											Sign up
										</>
									)}
								</button>
							</div>
						</form>
	
						<p className="text-center text-sm text-gray-400">
							Already have an account?{" "}
							<Link 
								to="/login" 
								className="font-medium text-primary hover:text-primary-focus transition-colors duration-200"
							>
								Log in here
							</Link>
						</p>
					</div>
				</motion.div>
			</div>
		</div>
	)
}

export default SignUpPage

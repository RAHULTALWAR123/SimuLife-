import { motion } from "framer-motion"
import { IoAddCircleSharp } from "react-icons/io5"
import { useAuthStore } from "../store/useAuthStore"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { useGroupStore } from "../store/useGroupStore"
import { Plus, Users } from "lucide-react"
// import { MdDone } from "react-icons/md"


// import React from 'react'

const GroupPage = () => {

    const {getfriends,user,friends} = useAuthStore()
    const {getGroup,groups,createGroups,joinAGroup} = useGroupStore()

    const [group,setGroup] = useState({
        name: "",
        logo:"",
        members: []
    })

    const [id,setId] = useState("")



    const [selectedMembers, setSelectedMembers] = useState([])

    const joinG = () => {
        joinAGroup(id);
        setId("")
    } 



    const handleMemberToggle = (memberId, memberName, memberImg) => {

       setGroup((prev) => {
            const isAlreadyAdded = prev.members.includes(memberId);
            if (isAlreadyAdded) {
                return { ...prev, members: prev.members.filter((id) => id !== memberId) };
            } else {
                return { ...prev, members: [...prev.members, memberId] };
            }
        });


        setSelectedMembers((prev) => {
            const isAlreadyAdded = prev.some((member) => member.id === memberId);
            if (isAlreadyAdded) {
                return prev.filter((m) => m.id !== memberId);
            } else {
                return [...prev, { id: memberId, name: memberName, img: memberImg }];
            }
        });
    };


    

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
    
          reader.onloadend = () => {
            setGroup({ ...group, logo: reader.result });
          };
    
          reader.readAsDataURL(file); // Convert to base64
        }
      };



    useEffect(()=>{
        getfriends(user?._id)
    },[getfriends,user?._id])

    useEffect(()=>{
        getGroup(user?._id)
    },[getGroup,user?._id])


    const handleSubmit = async(e) => {
        e.preventDefault()
        console.log(group);
try{
    await createGroups(group);
}
catch(error){
    console.log(error);
}
        setGroup({name:"",logo:"",members:[]})
    }

  return (
    <motion.div
    className="bg-base-300 shadow-lg sm:rounded-3xl sm:my-20 container mx-auto sm:px-16 px-5 py-10 max-w-3xl relative overflow-hidden"
    initial={{ opacity: 0, y: 100 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8 }}
    >

<div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-primary/10 blur-xl transform translate-x-1/2 -translate-y-1/2"></div>
<div className="absolute bottom-0 left-0 w-32 h-32 rounded-full bg-secondary/10 blur-xl transform -translate-x-1/2 translate-y-1/2"></div>

    <div className="relative mb-4">
    <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-primary rounded-full"></div>
        <h1 className="font-extrabold sm:text-5xl text-4xl text-center bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Group Chat</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2 text-center">
            Create a group to chat with your friends
        </p>
    </div>

    <div>

<div className="flex flex-col justify-center items-center gap-5">
        <motion.button
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1 }}
        className="mt-10 px-8 py-3 rounded-2xl bg-primary text-primary-content font-medium"
        onClick={()=>document.getElementById('group_modal').showModal()}
        >
            Create Group
        </motion.button>

        <dialog id="group_modal" className="modal">
                    <div className="modal-box h-2/3 overflow-auto scroll-container">
                        <h3 className="font-bold text-lg text-center">Create a Group</h3>

<form action="" onSubmit={handleSubmit}>


                        {/* Group Name & Image */}
                        <div className="flex items-center justify-center mt-5">
                            <img src={group.logo || "/avatar.jpg"} alt="" className="w-12 h-12 rounded-full relative" />
                            <input type="file" id="image" className="sr-only" accept="image/*" onChange={handleImageChange} />
                            <label htmlFor="image">
                                <IoAddCircleSharp size={24} className="relative right-6 top-4 text-primary-content" />
                            </label>
                            <input
                                type="text"
                                placeholder="Group Name"
                                value={group?.name}
                                onChange={(e) => setGroup({ ...group, name: e.target.value })}
                                className="input input-bordered w-full max-w-xs"
                            />
                        </div>

                        {/* Selected Members */}
                        <div className="mt-5 text-left text-lg">
                            <h1>Selected Members</h1>
                            <div className="h-60 overflow-auto scroll-container p-2 rounded-lg">
                            {selectedMembers.length === 0 ? (
                                        <p className="text-primary">No members added yet.</p>
                                    ) : (
                                        selectedMembers.map((member) => (
                                            <div key={member.id} className="flex items-center gap-3 bg-base-200 p-3 rounded-2xl my-2">
                                                <img src={member.img} alt={member.name} className="w-10 h-10 rounded-full" />
                                                <h1 className="font-bold">{member.name}</h1>
                                            </div>
                                        ))
                                    )}
                            </div>
                        </div>

<div className="text-right">
                        <button className="px-8 py-3 rounded-2xl bg-primary text-primary-content font-medium text-lg" type="submit">
                            Create
                        </button>
</div>

                        {/* Friends List (Add Members) */}
                        <div className="mt-5 text-left text-lg">
                            <h1>Add Members</h1>
                            <div className="h-60 overflow-auto scroll-container">
                                {friends.map((friend) => (
                                    <div className="flex items-center justify-between mt-2" key={friend?._id}>
                                        <div className="flex items-center bg-base-200 w-full p-3 rounded-2xl gap-3 hover:bg-base-200 transition duration-300">
                                            {/* Profile Image */}
                                            <img
                                                src={friend?.profilePic}
                                                alt={friend?.name}
                                                className="w-12 h-12 rounded-full object-cover border border-gray-300"
                                            />

                                            {/* Name */}
                                            <div className="flex-1">
                                                <h1 className="text-left font-bold text-lg">{friend?.name}</h1>
                                            </div>

                                            {/* Checkbox */}
                                            <input
                                                type="checkbox"
                                                checked={group.members.includes(friend._id)}
                                                onChange={() => handleMemberToggle(friend._id, friend.name, friend.profilePic)}
                                                className="checkbox checkbox-primary scale-125"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                                </form>
                    </div>

                    <form method="dialog" className="modal-backdrop">
                        <button>Close</button>
                    </form>
                </dialog>

        <div>
            <p>or</p>
        </div>

        <motion.div 
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1 }}
        className="flex items-center justify-center gap-3">
        <input type="text"
        placeholder="enter room code"
        value={id}
        onChange={(e) => setId(e.target.value)}
        className="input input-bordered w-full max-w-xs" />
        <button 
        onClick={joinG}
        className="px-8 py-3 rounded-2xl bg-primary text-primary-content font-medium">Join</button>
        </motion.div>
</div>

<div className="border-b-4 w-full mt-10 border-primary rounded-3xl"></div>

<div>
<h1 className="text-left font-extrabold text-xl mt-5">My Groups</h1>

<div className="h-60 overflow-auto scroll-container mt-5">

    {groups.length === 0 && (
    <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col items-center justify-center py-12 px-4 text-center"
    >
        <div className="relative">
            <div className="absolute inset-0 z-0 bg-primary/20 rounded-full blur-xl scale-125"></div>
            <Users size={64} className="relative z-10 text-primary drop-shadow-lg" />
          </div>
        <h3 className="text-lg font-medium text-primary mb-2 mt-2">
            No groups yet
        </h3>
        <p className="text-base-content/70 max-w-md mb-6 text-sm">
            You haven&apos;t joined or created any groups. Start by creating a new group or exploring existing ones.
        </p>
        
    </motion.div>
)}
    {groups.map((group) => (
        <>
    <Link to={`/group-chat/${group?._id}`}>
    <div className="flex items-center justify-between mt-5" key={group?._id}>
        <div className="flex items-center gap-4 bg-base-100 w-full p-4 sm:rounded-3xl rounded-xl shadow-md hover:shadow-lg hover:shadow-primary transition duration-300">
            {/* Group Logo */}
            <img src={group?.logo || "/avatar.jpg"} alt="" className="sm:w-14 sm:h-14 h-10 w-10 rounded-full" />

            {/* Group Details */}
            <div className="flex-1">
                <h1 className="text-left font-medium sm:text-lg">{group?.name}</h1>
                <p className="text-left sm:text-sm text-xs text-base-content/50">{group?.members?.length} members</p>
            </div>

            {/* Group Owner Info */}
            <div className="text-right">
                <p className="text-sm text-primary/50 font-medium">Owner: {group?.owner?.name}</p>
            </div>
        </div>
    </div>
    </Link>
        </>
))}

</div>

</div>

        {/* <div className="flex justify-center items-center gap-3">
            <p>Create Group</p>
        <input type="text" placeholder="Type here" className="input input-bordered w-full max-w-xs" /> */}
        {/* </div> */}
    </div>

    </motion.div>
  )
}

export default GroupPage

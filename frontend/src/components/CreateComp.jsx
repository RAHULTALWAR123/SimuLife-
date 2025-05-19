// import React from 'react'
import { motion } from "framer-motion"
import CompName from "./CompName"
import CompIdentity from "./CompIdentity"
import CompBack from "./CompBack"
import Comptrait from "./Comptrait"
import CompImg from "./CompImg"
import { useState } from "react"
import { useCompanionStore } from "../store/useCompanionStore"

const CreateComp = () => {

    const {createCompanion,compLoading} = useCompanionStore();


    const [component, setComponent] = useState("1");
    const [traitInput, setTraitInput] = useState("");

    const [newPlayer, setNewPlayer] = useState({
        img: "",
        name: "",
        background: "",
        identity: "",
        traits: [],
      });

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(newPlayer);

        try {
            await createCompanion(newPlayer);
            setNewPlayer({ name: "", background: "", identity: "", traits: "", img: ""});
        } catch {
            console.log("error creating a companion");
        }
    }

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
    
          reader.onloadend = () => {
            setNewPlayer({ ...newPlayer, img: reader.result });
          };
    
          reader.readAsDataURL(file); // Convert to base64
        }
      };


      const handleAddTrait = () => {
        if (traitInput.trim()) {
          setNewPlayer((prev) => ({
            ...prev,
            traits: [...prev.traits, traitInput.trim()],
          }));
          setTraitInput(""); // Clear input after adding
        }
      };
    
      const handleRemoveTrait = (index) => {
        setNewPlayer((prev) => ({
          ...prev,
          traits: prev.traits.filter((_, i) => i !== index),
        }));
      };

  return (
    <motion.div
    className="bg-base-300 shadow-lg sm:rounded-3xl sm:my-20 container mx-auto sm:px-20 px-5 py-10 max-w-3xl relative overflow-hidden border border-base-200 "
    initial={{ opacity: 0, y: 100 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8 }}
    >
      <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-primary/10 blur-xl"></div>
      <div className="absolute -bottom-10 -left-10 w-32 h-32 rounded-full bg-secondary/10 blur-xl"></div>

<div className="relative z-10">
<div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-primary rounded-full mb-1"></div>
        <h1 className="font-extrabold sm:text-5xl text-4xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary text-center">Create Companion</h1>
        <p className="mt-2 text-base-content/70 text-center text-sm sm:text-md">Bring your unique characters to life</p>
</div>

{/* <button className="btn btn-primary mt-5 mx-24 hover:btn-secondary" onClick={() => setComponent("2")}>test</button> */}

<form action="" onSubmit={handleSubmit}>

<div className="w-full mt-10 flex justify-center">
<ul className="steps w-auto sm:text-sm text-xs">
  <li className={`step ${component === "1" || component === "2" || component === "3" || component === "4" || component === "5" ? "step-primary" : ""}`}>Name</li>
  <li className={`step ${component === "2" || component === "3" || component === "4" || component === "5" ? "step-primary" : ""}`}>Background</li>
  <li className={`step ${component === "3" || component === "4" || component === "5" ? "step-primary" : ""}`}>Identity</li>
  <li className={`step ${component === "4" || component === "5" ? "step-primary" : ""}`}>Traits</li>
  <li className={`step ${component === "5" ? "step-primary" : ""}`}>Image</li>
</ul>
</div>

<div className="flex justify-center">

    {component === "1" && (
        <CompName setComponent={setComponent} newPlayer={newPlayer} setNewPlayer={setNewPlayer}/>
    )}
    {component === "3" && (
        <CompIdentity setComponent={setComponent} newPlayer={newPlayer} setNewPlayer={setNewPlayer}/>
    )}
    {component === "2" && (
        <CompBack setComponent={setComponent} newPlayer={newPlayer} setNewPlayer={setNewPlayer}/>
    )}
    {component === "5" && (
        <CompImg setComponent={setComponent} newPlayer={newPlayer} setNewPlayer={setNewPlayer} handleImageChange={handleImageChange} compLoading={compLoading}/>
    )}
    {component === "4" && (
        <Comptrait setComponent={setComponent} handleRemoveTrait={handleRemoveTrait} handleAddTrait={handleAddTrait} traitInput={traitInput} setTraitInput={setTraitInput} newPlayer={newPlayer}/>
    )}
    </div>
</form>



    </motion.div>
  )
}

export default CreateComp

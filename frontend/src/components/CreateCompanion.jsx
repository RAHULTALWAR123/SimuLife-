import { useState } from "react";
import { motion } from "framer-motion";
import { Loader, Upload, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useCompanionStore } from "../store/useCompanionStore";

const CreateCompanion = () => {
  const [newPlayer, setNewPlayer] = useState({
    img: "",
    name: "",
    background: "",
    identity: "",
    traits: [],
  });

  const [traitInput, setTraitInput] = useState(""); // For individual trait input
//   const loading = false;

const {createCompanion,compLoading} = useCompanionStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(newPlayer);

    try {
        await createCompanion(newPlayer);
        setNewPlayer({ name: "", description: "", price: "", category: "", img: "" ,basePrice:""});
    } catch {
        console.log("error creating a companion");
    }
    
  };

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
      className="bg-base-300 shadow-lg rounded-3xl my-20 container mx-auto px-20 py-10 max-w-3xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
<div className="flex justify-between">
    <h2 className="text-2xl font-bold mb-6 text-primary">Create New Companion</h2>
    <Link to = "/explore">
    <button className= "py-3 px-3 border border-transparent rounded-xl shadow-sm text-md font-medium text-secondary-content bg-secondary hover:bg-secondary disabled:opacity-50">
        Explore More
    </button>
    </Link>
</div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-base-content">
            Name
          </label>
          <input
            type="text"
            value={newPlayer.name}
            onChange={(e) => setNewPlayer({ ...newPlayer, name: e.target.value })}
            placeholder="Christiano Ronaldo"
            className="input input-bordered input-primary w-full max-w-xs mt-1"
          />
        </div>

        <div>
          <label htmlFor="background" className="block text-sm font-medium text-base-content">
            Background
          </label>
          <textarea
            value={newPlayer.background}
            onChange={(e) => setNewPlayer({ ...newPlayer, background: e.target.value })}
            className="textarea textarea-primary w-full h-32 mt-1"
            placeholder="Born in Madeira, Portugal. Started career with Sporting CP.Won multiple Champions League titles, Ballon d'Or awards, and set numerous goal-scoring records.Known for incredible athleticism, dedication to fitness, and competitive spirit."
          ></textarea>
        </div>

        <div>
          <label htmlFor="identity" className="block text-sm font-medium text-base-content">
            Identity
          </label>
          <textarea
            value={newPlayer.identity}
            onChange={(e) => setNewPlayer({ ...newPlayer, identity: e.target.value })}
            className="textarea textarea-primary w-full h-32 mt-1"
            placeholder="I am Cristiano Ronaldo, one of the most successful footballers in history. I've played for clubs like Manchester United, Real Madrid, and Juventus. I'm known for my work ethic, goal-scoring ability, and signature 'SIUUU' celebration."
          ></textarea>
        </div>

        {/* Traits Input */}
        <div>
          <label htmlFor="traits" className="block text-sm font-medium text-base-content">
            Traits
          </label>
          <div className="flex items-center space-x-3">
            <input
              type="text"
              value={traitInput}
              onChange={(e) => setTraitInput(e.target.value)}
              placeholder="Confident and ambitious,Extremely competitive,Dedicated to fitness and excellence,Direct and passionate about football"
              className="input input-bordered input-primary w-full"
            />
            <button
              type="button"
              onClick={handleAddTrait}
              className="btn btn-primary rounded-xl"
            >
              Add
            </button>
          </div>
          {/* Display traits */}
          {newPlayer.traits.length > 0 && (
            <ul className="mt-3 space-y-2">
              {newPlayer.traits.map((trait, index) => (
                <li
                  key={index}
                  className="flex items-center justify-between bg-base-100 p-2 rounded-lg"
                >
                  <span>{trait}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveTrait(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Image Upload */}
        <div className="mt-6 flex items-center">
          <input
            type="file"
            id="image"
            className="sr-only"
            accept="image/*"
            onChange={handleImageChange}
          />
          <label
            htmlFor="image"
            className="cursor-pointer bg-base-100 py-2 px-3 border border-primary rounded-xl shadow-sm text-sm leading-4 font-medium text-base-content hover:bg-base-300"
          >
            <Upload className="h-5 w-5 inline-block mr-2" />
            Upload Image
          </label>
          {newPlayer.img && (
            <span className="ml-3 text-sm text-gray-400">Image uploaded</span>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-1/3 flex justify-center py-4 px-4 border border-transparent rounded-xl mx-auto 
          shadow-sm text-lg font-bold text-primary-content bg-primary hover:bg-secondary disabled:opacity-50"
          disabled={compLoading}
        >
          {compLoading ? (
            <>
              <Loader className="mr-2 h-5 w-5 animate-spin" aria-hidden="true" />
              Loading...
            </>
          ) : (
            "Generate"
          )}
        </button>
      </form>
    </motion.div>
  );
};

export default CreateCompanion;

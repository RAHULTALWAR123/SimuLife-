import { motion } from "framer-motion"
import { useState } from "react"
import { useTinderStore } from "../store/useTinderStore"
import { useNavigate } from "react-router-dom"

const Express = () => {
  const [formData, setFormData] = useState({
    gender: '',
    age: '',
    height: '',
    about: '',
    sexuality: '',
    lookingFor: '',
    qualities: [],
    hopingToFind: []
  })

  const {shareU} = useTinderStore()
  const navigate = useNavigate();

  const handleRadioChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

  };


  const handleCheckboxChange = (name, value) => {
    setFormData(prev => {
      const currentValues = prev[name];
      const newValues = currentValues.includes(value)
        ? currentValues.filter(item => item !== value)
        : [...currentValues, value];
      
      console.log(`Updated ${name}:`, newValues);
      return {
        ...prev,
        [name]: newValues
      };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    shareU(formData);
    setFormData({
      gender: '',
      age: '',
      height: '',
      about: '',
      sexuality: '',
      lookingFor: '',
      qualities: [],
      hopingToFind: []
    })
    navigate('/');
  };

  return (
    <motion.div
      className="bg-base-300 shadow-xl sm:rounded-3xl sm:my-20 container mx-auto px-8 py-12 max-w-3xl relative overflow-hidden"
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >

<div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-primary/10 blur-xl"></div>
      <div className="absolute -bottom-10 -left-10 w-32 h-32 rounded-full bg-secondary/10 blur-xl"></div>


      {/* Content container */}
      <div className="relative z-10 space-y-8">
        <div className="text-center relative z-10">
        <div className="absolute -bottom-5 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-primary rounded-full mb-1"></div>
          <h1 className="font-extrabold sm:text-5xl text-4xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary text-center">Create Profile</h1>
          <p className="mt-2 text-base-content/70 text-center text-sm sm:text-md">Let&apos;s get to know you better</p>
        </div>

        <div className="space-y-8">
          {/* Gender Section */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Gender</h3>
            <div className="flex flex-wrap gap-4">
              {['male', 'female', 'other'].map((gender) => (
                <label key={gender} className="flex items-center gap-2 cursor-pointer px-4 py-3 rounded-2xl hover:bg-base-200 transition-colors bg-base-100">
                  <input 
                    type="radio" 
                    name="gender" 
                    checked={formData.gender === gender}
                    onChange={() => handleRadioChange('gender', gender)}
                    className="radio radio-primary" 
                  />
                  <span>{gender}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Age & Height */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-lg font-semibold">Age</label>
              <div className="relative">
                <input 
                  type="number" 
                  className="input input-bordered w-full pl-4 pr-12 py-3 rounded-2xl"
                  min="18" 
                  max="70"
                  value={formData.age}
                  onChange={(e) => handleRadioChange('age', e.target.value)}
                  placeholder="Your age"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-base-content/60">years</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-lg font-semibold">Height</label>
              <div className="relative">
                <input 
                  type="number" 
                  className="input input-bordered w-full pl-4 pr-12 py-3 rounded-2xl"
                  min="50" 
                  max="250"
                  value={formData.height}
                  onChange={(e) => handleRadioChange('height', e.target.value)}
                  placeholder="Your height"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-base-content/60">cm</span>
              </div>
            </div>
          </div>

          {/* About */}
          <div className="space-y-2">
            <label className="text-lg font-semibold">About You</label>
            <textarea 
              className="textarea textarea-bordered w-full py-3 min-h-[120px] rounded-2xl"
              placeholder="Share something interesting about yourself..."
              value={formData.about}
              onChange={(e) => handleRadioChange('about', e.target.value)}
            />
            <div className="text-right text-sm text-base-content/60">Max 500 characters</div>
          </div>

          {/* Looking For */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Looking For</h3>
            <div className="flex flex-wrap gap-3">
              {['Dating', 'BFF', 'Bizz'].map((option) => (
                <label key={option} className="flex items-center gap-2 cursor-pointer px-4 py-3 rounded-2xl hover:bg-base-200 transition-colors bg-base-100">
                  <input 
                    type="radio" 
                    name="lookingFor" 
                    checked={formData.lookingFor === option}
                    onChange={() => handleRadioChange('lookingFor', option)}
                    className="radio radio-primary" 
                  />
                  <span>{option}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Orientation */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Orientation</h3>
            <div className="flex flex-wrap gap-3">
              {['Straight', 'Bisexual', 'Lesbian', 'Gay', 'Trans', 'Pansexual'].map((sexuality) => (
                <label key={sexuality} className="flex items-center gap-2 cursor-pointer px-4 py-3 rounded-2xl hover:bg-base-200 transition-colors bg-base-100">
                  <input 
                    type="radio" 
                    name="orientation" 
                    checked={formData.sexuality === sexuality}
                    onChange={() => handleRadioChange('sexuality', sexuality)}
                    className="radio radio-primary" 
                  />
                  <span>{sexuality}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Hoping To Find */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Hoping To Find</h3>
            <div className="flex flex-wrap gap-3">
              {['long-term Relationship', 'A life partner', 'Fun,casual relationship', 'Marriage', 'Intimacy without commitment'].map((option) => (
                <label key={option} className="flex items-center gap-2 cursor-pointer px-4 py-3 rounded-2xl hover:bg-base-200 transition-colors bg-base-100">
                  <input 
                    type="checkbox" 
                    className="checkbox checkbox-primary" 
                    checked={formData.hopingToFind.includes(option)}
                    defaultChecked={option === 'long-term Relationship'}
                    onChange={() => handleCheckboxChange('hopingToFind', option)}
                  />
                  <span>{option}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Qualities */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Valued Qualities</h3>
            <div className="flex flex-wrap gap-3">
              {['Intelligence', 'Charisma', 'Sociability', 'Honesty', 'Kindness', 'Loyalty', 'Humor'].map((quality) => (
                <label key={quality} className="flex items-center gap-2 cursor-pointer px-4 py-3 rounded-2xl hover:bg-base-200 transition-colors bg-base-100">
                  <input 
                    type="checkbox" 
                    className="checkbox checkbox-primary" 
                    checked={formData.qualities.includes(quality)}
                    defaultChecked={quality === 'Intelligence'}
                    onChange={() => handleCheckboxChange('qualities', quality)}
                  />
                  <span>{quality}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end gap-3 items-end">

        <button 
          // type="submit" 
          className="bg-base-100 px-5 py-3 text-base-content font-medium sm:w-1/4 mt-5 rounded-2xl"
          
          >
          Reset
        </button>

        <button 
          type="submit" 
          className="bg-primary px-5 py-3 text-primary-content font-medium sm:w-1/4 mt-5 rounded-2xl"
          onClick={handleSubmit}
          >
          Submit
        </button>
        </div>
      </div>
    </motion.div>
  )
}

export default Express
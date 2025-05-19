import { useState } from 'react';
import Stepper, { Step } from './Stepper';
import { useTinderStore } from '../store/useTinderStore';

const Discover = () => {
  // Initialize form state with all fields
  const [formData, setFormData] = useState({
    lookingFor: '',
    sexuality: '',
    hopingToFind: [],
    qualities: []
  });

  const {findMatch} = useTinderStore();

  // Handle radio button changes
  const handleRadioChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    console.log(`Updated ${name}:`, value);
  };

  // Handle checkbox changes
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

  // Log complete form data
  const handleComplete = () => {
    console.log('Final form data:', formData);
    findMatch(formData);
    // Navigation will be handled by the Stepper component
  };

  return (
    <div>
      <h1 className="font-extrabold sm:text-5xl text-4xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary text-center mt-10">Discover Love</h1>
      <Stepper
        initialStep={1}
        onStepChange={(step) => console.log(`Step ${step}`)}
        onFinalStepCompleted={handleComplete}
        backButtonText="Previous"
        nextButtonText="Next"
      > 
        <Step>
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-center">What are you Looking For?</h3>
            <div className="flex flex-col items-center gap-3">
              {['Dating', 'BFF', 'Bizz'].map((option) => (
                <label key={option} className="flex items-start gap-3 cursor-pointer px-4 py-3 rounded-2xl hover:bg-base-200 transition-colors bg-base-100 w-full max-w-sm">
                  <input 
                    type="radio" 
                    name="lookingFor" 
                    className="radio radio-primary mt-1 flex-shrink-0" 
                    checked={formData.lookingFor === option}
                    onChange={() => handleRadioChange('lookingFor', option)}
                  />
                  <span className="whitespace-nowrap">{option}</span>
                </label>
              ))}
            </div>
          </div>
        </Step>
        <Step>
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-center">What Sexuality You Desire?</h3>
            <div className="flex flex-col items-center gap-3">
              {['Straight', 'Bisexual', 'Lesbian', 'Gay', 'Trans', 'Pansexual'].map((option) => (
                <label key={option} className="flex items-start gap-3 cursor-pointer px-4 py-3 rounded-2xl hover:bg-base-200 transition-colors bg-base-100 w-full max-w-sm">
                  <input 
                    type="radio" 
                    name="sexuality" 
                    className="radio radio-primary mt-1 flex-shrink-0" 
                    checked={formData.sexuality === option}
                    onChange={() => handleRadioChange('sexuality', option)}
                  />
                  <span className="whitespace-nowrap">{option}</span>
                </label>
              ))}
            </div>
          </div>
        </Step>
        <Step>
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-center">What Type Of Relationship You need?</h3>
            <div className="flex flex-col items-center gap-3">
              {['long-term Relationship', 'A life partner', 'Fun,casual relationship', 'Marriage', 'Intimacy without commitment'].map((option) => (
                <label key={option} className="flex items-start gap-3 cursor-pointer px-4 py-3 rounded-2xl hover:bg-base-200 transition-colors bg-base-100 w-full max-w-sm">
                  <input 
                    type="checkbox" 
                    className="checkbox checkbox-primary mt-1 flex-shrink-0" 
                    checked={formData.hopingToFind.includes(option)}
                    onChange={() => handleCheckboxChange('hopingToFind', option)}
                  />
                  <span className="whitespace-nowrap">{option}</span>
                </label>
              ))}
            </div>
          </div>
        </Step>
        <Step>
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-center">What qualities you want in your partner?</h3>
            <div className="flex flex-col items-center gap-3">
              {['Intelligence', 'Charisma', 'Sociability', 'Honesty', 'Kindness', 'Loyalty', 'Humor'].map((option) => (
                <label key={option} className="flex items-start gap-3 cursor-pointer px-4 py-3 rounded-2xl hover:bg-base-200 transition-colors bg-base-100 w-full max-w-sm">
                  <input 
                    type="checkbox" 
                    className="checkbox checkbox-primary mt-1 flex-shrink-0" 
                    checked={formData.qualities.includes(option)}
                    onChange={() => handleCheckboxChange('qualities', option)}
                  />
                  <span className="whitespace-nowrap">{option}</span>
                </label>
              ))}
            </div>
          </div>
        </Step>
      </Stepper>
    </div>
  );
};

export default Discover;
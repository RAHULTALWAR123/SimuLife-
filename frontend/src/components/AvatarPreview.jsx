import { useState } from 'react';

const AvatarPreview = () => {
  const [settings, setSettings] = useState({
    skinTone: '#FFDBAC',
    hair: { style: 'short', color: '#3A2D1D' },
    eyes: { color: '#2C3E50', shape: 'round' },
    mouth: 'smile',
    shirt: { color: '#3498DB', style: 't-shirt' }
  });

  // Available options
  const hairStyles = {
    short: 'M70,120 Q150,60 230,120 Q190,160 150,140 Q110,160 70,120',
    long: 'M70,120 Q150,40 230,120 L210,180 L90,180 L70,120',
    curly: 'M70,120 Q90,80 110,120 Q130,60 150,120 Q170,80 190,120 Q210,60 230,120 Q190,160 150,140 Q110,160 70,120'
  };

  const mouthStyles = {
    smile: 'M110,170 Q150,200 190,170',
    neutral: 'M110,170 L190,170',
    frown: 'M110,170 Q150,140 190,170'
  };

  return (
    <div style={{ display: 'flex', gap: '2rem' }}>
      {/* Avatar Display */}
      <svg width="200" height="250" viewBox="0 0 300 300">
        {/* Head */}
        <circle cx="150" cy="150" r="100" fill={settings.skinTone} />
        
        {/* Hair */}
        <path d={hairStyles[settings.hair.style]} fill={settings.hair.color} />
        
        {/* Eyes */}
        <circle cx="120" cy="130" r="15" fill={settings.eyes.color} />
        <circle cx="180" cy="130" r="15" fill={settings.eyes.color} />
        
        {/* Mouth */}
        <path d={mouthStyles[settings.mouth]} fill="none" stroke="#2C3E50" strokeWidth="5" />
        
        {/* Shirt */}
        <rect x="70" y="250" width="160" height="80" fill={settings.shirt.color} />
      </svg>

      {/* Customization Controls */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div>
          <label>Skin Tone: </label>
          <input 
            type="color" 
            value={settings.skinTone} 
            onChange={(e) => setSettings({...settings, skinTone: e.target.value})}
          />
        </div>
        
        <div>
          <label>Hair Style: </label>
          <select 
            value={settings.hair.style}
            onChange={(e) => setSettings({...settings, hair: {...settings.hair, style: e.target.value}})}
          >
            <option value="short">Short</option>
            <option value="long">Long</option>
            <option value="curly">Curly</option>
          </select>
        </div>
        
        <div>
          <label>Hair Color: </label>
          <input 
            type="color" 
            value={settings.hair.color} 
            onChange={(e) => setSettings({...settings, hair: {...settings.hair, color: e.target.value}})}
          />
        </div>
        
        <div>
          <label>Shirt Color: </label>
          <input 
            type="color" 
            value={settings.shirt.color} 
            onChange={(e) => setSettings({...settings, shirt: {...settings.shirt, color: e.target.value}})}
          />
        </div>
        
        <div>
          <label>Mouth: </label>
          <select 
            value={settings.mouth}
            onChange={(e) => setSettings({...settings, mouth: e.target.value})}
          >
            <option value="smile">Smile</option>
            <option value="neutral">Neutral</option>
            <option value="frown">Frown</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default AvatarPreview
let stateDisplay = ''

const setDay = () =>{
    document.getElementById('night-style').classList.remove('active');
    document.getElementById('day-style').classList.add('active');
    const root = document.querySelector(':root')
    root.style.setProperty('--background-black', '#fff')
    root.style.setProperty('--nav-bg', '#fafafa')
    root.style.setProperty('--bg-search', '#f4f4f4')
    root.style.setProperty('--text-white', '#3c3a39')
    root.style.setProperty('--bg-recipe', '#fafafa')
    root.style.setProperty('--box-container', '#fff')
  
    const create = document.getElementById('create-day')
    if(create) {
      create.style.setProperty('color', '#3c3a39', 'important')
      create.classList.remove('hide')
    }
    if(night) { 
      const night = document.getElementById('create-night')
      night.style.display = 'none';
    }
  
    stateDisplay = 'day'
  }
  
const setNight = () => {
    const root = document.querySelector(':root')
    document.getElementById('night-style').classList.add('active');
    document.getElementById('day-style').classList.remove('active');
    root.style.setProperty('--background-black', '#212121')
    root.style.setProperty('--nav-bg', '#161618')
    root.style.setProperty('--bg-search', '#3b3734')
    root.style.setProperty('--text-white', '#c9c9c9')
    root.style.setProperty('--bg-recipe', 'black')
    
    const create = document.getElementById('create-day')
    if(create) {
      create.classList.add('hide')
    }
  
    const night = document.getElementById('create-night')
    if(night) { 
      night.style.display = 'inline-block';
    }
  
    stateDisplay = 'night'
  }

  module.exports = { setDay, setNight, stateDisplay }
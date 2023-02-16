// https://developer.mozilla.org/en-US/docs/Web/API/Window/DOMContentLoaded_event
document.addEventListener("DOMContentLoaded", () => {
  
  //*** FOOTER POSITIONING ***//
  const footer = document.getElementById("footer");
  const footerHeight = footer.offsetHeight;
  const bodyHeight = document.body.offsetHeight;
  const windowHeight = window.innerHeight;
  
  if( bodyHeight < windowHeight ) {
    footer.style.top = (windowHeight + footerHeight*2) + "px";
  } else {
    footer.style.top = (bodyHeight + footerHeight*2) + "px";
  }
  //*** WINDOW EVENTS ***//
  //*** WINDOW EVENTS ***//
  
  window.onscroll = () => {
    
    const about = document.getElementById('about')
    const elementTop = about.getBoundingClientRect().top;
    const windowY = window.scrollY + window.innerHeight;
    const elementHeight = about.offsetHeight;
    const footerTop = footer.getBoundingClientRect().top;
        
  
    //** SHOW ABOUT TEXT ON SCROLL **/
    if (windowY - elementHeight/2 > elementTop) {
      console.log('show');
      about.classList.remove('hide');
      about.classList.add('in-right');
    } else {
      about.classList.add('hide');
      about.classList.remove('in-right');
    }
  }

  console.log("bartender_crud JS imported successfully!");

  //*** EDIT PROFILE ***//
  //*** EDIT PROFILE ***//
  //*** EDIT PROFILE ***//

  document.getElementById("edit-btn").addEventListener("click", (e) => {
    e.preventDefault();
    const edits = document.querySelectorAll('.edit')

    edits.forEach(item => {item.classList.add('underline')})
    edits.forEach(item => {item.classList.remove('prevent')})
    document.getElementById("edit-btn").style.display = "none";
    document.getElementById("cancel-edit").style.display = "block";

    edits.forEach(item => item.addEventListener('click', (e) =>{
      e.preventDefault();
  
      const datakey = item.dataset.name;
      console.log("edit button clicked: ", datakey);
      
      if (datakey !== 'image'){
        item.style.display = "none";      
        document.getElementById(`${datakey}`).classList.add('underline');
      } 
      if (datakey === 'image'){ 
        document.getElementById('image-modal').style.display = "block";
        document.getElementById(`${datakey}`).style.display = "block";
      } else {
        document.getElementById(`${datakey}`).style.display = "block";
        document.querySelector('.h1-profile').style.display = "block";
      }
      //document.querySelector(`[data-value="${datakey}"]`).style.display = "none";
    }))

  })

  document.getElementById("cancel-edit").addEventListener("click", (e) => {
    e.preventDefault();
    
    document.getElementById("edit-btn").style.display = "block";
    document.getElementById("cancel-edit").style.display = "none";
    document.getElementById(`username`).classList.remove('underline');
    document.querySelector('.h1-profile').classList.remove('underline');
    
    const edits = document.querySelectorAll('.edit')
    edits.forEach(item => {
      const datakey = item.dataset.name;
      item.classList.add('prevent')
      item.classList.remove('underline')
      item.style.display = "block";
      document.querySelectorAll(`[data-value]`).forEach(item => item.style.display = "block");
      document.getElementById(`${datakey}`).classList.remove('underline');
      document.getElementById(`${datakey}`).style.display = "none";
      // item.setAttribute("disabled", true);
    })

  })

  //*** DELETE PROFILE MODAL ***//

  document.getElementById(`delete`).addEventListener('click', (e) => {
    e.preventDefault();
    document.querySelector('#delete-modal').style.display = "block";;
  })

  //*** MODAL ***//
  //*** MODAL ***//
  //*** MODAL ***//

  document.getElementById('close-modal').addEventListener('click', (e) => { 
    e.preventDefault();
    console.log("close modal clicked");
    document.querySelector('.modal-container').style.display = "none";
  })

  const modalClose = document.querySelectorAll('.close-modal')
  
  modalClose.forEach(item => item.addEventListener('click', (e) => {
      e.preventDefault();
      const child = item.parentElement
      const parent = child.parentElement
      const container = parent.parentElement
      container.style.display = "none";
    })
  )


  document.getElementById("save-changes").addEventListener("click", (e) => {
    
    const edits = document.querySelectorAll('.edit')

    edits.forEach(item => item.classList.remove('underline'))

  })

  document.getElementById("close-modal").addEventListener("click", (e) => { 
    e.preventDefault();
  })

});


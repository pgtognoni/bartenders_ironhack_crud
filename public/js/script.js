// https://developer.mozilla.org/en-US/docs/Web/API/Window/DOMContentLoaded_event
document.addEventListener("DOMContentLoaded", () => {
  
  window.onscroll = () => {
    const about = document.getElementById('about')
    const elementTop = about.getBoundingClientRect().top;
    const windowY = window.scrollY + window.innerHeight;
    const elementHeight = about.offsetHeight;

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
      
      item.style.display = "none";
      document.querySelector(`[data-value="${datakey}"]`).style.display = "none";
      document.getElementById(`${datakey}`).classList.add('underline');
      document.getElementById(`${datakey}`).style.display = "block";
      document.querySelector('.h1-profile').style.display = "block";
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

  document.getElementById(`delete`).addEventListener('click', (e) => {
    e.preventDefault();
    document.querySelector('.delete-container').showModal();
  })

  const modalClose = document.querySelectorAll('.close-modal')
  
  modalClose.forEach(item => item.addEventListener('click', (e) => {
      e.preventDefault();
      const parent = item.parentElement
      parent.close()
    })
  )

  document.getElementById(`image-profile`).addEventListener('click', (e) => {
    e.preventDefault();
    console.log("image-profile clicked");
    document.querySelector('.image-edit').showModal();
  })

  document.getElementById("save-changes").addEventListener("click", (e) => {
    
    const edits = document.querySelectorAll('.edit')

    edits.forEach(item => item.classList.remove('underline'))

  })

});


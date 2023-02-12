// https://developer.mozilla.org/en-US/docs/Web/API/Window/DOMContentLoaded_event
document.addEventListener("DOMContentLoaded", () => {
  console.log("bartender_crud JS imported successfully!");
 
  document.getElementById("edit-btn").addEventListener("click", (e) => {
    e.preventDefault();
    const edits = document.querySelectorAll('.edit')

    edits.forEach(item => {item.classList.add('underline')})
    document.getElementById("edit-btn").style.display = "none";
    document.getElementById("cancel-edit").style.display = "block";

    edits.forEach(item => item.addEventListener('click', (e) => {
      e.preventDefault();
      const datakey = item.dataset.name;
      console.log("edit button clicked: ", datakey);
      item.style.display = "none";
      document.querySelector(`[data-value="${datakey}"`).style.display = "none";
      document.getElementById(`${datakey}`).classList.add('underline');
      document.getElementById(`${datakey}`).style.display = "block";
      document.querySelector('.h1-profile').style.display = "block";
    }))

  })

  document.getElementById("cancel-edit").addEventListener("click", (e) => {
    e.preventDefault();
    const edits = document.querySelectorAll('.edit')

    edits.forEach(item => {item.classList.remove('underline')})
    document.getElementById("edit-btn").style.display = "block";
    document.getElementById("cancel-edit").style.display = "none";
    document.getElementById(`username`).classList.remove('underline');
    document.querySelector('.h1-profile').classList.remove('underline');

    edits.forEach(item => {
      e.preventDefault();
      const datakey = item.dataset.name;
      console.log("edit button clicked: ", datakey);
      item.style.display = "block";
      document.querySelector(`[data-value="${datakey}"`).style.display = "block";
      document.getElementById(`${datakey}`).classList.remove('underline');
      document.getElementById(`${datakey}`).style.display = "none";
      
    })

    edits.forEach(item => item.removeEventListener('click', (e) => {
  })

  document.getElementById(`delete`).addEventListener('click', (e) => {
    e.preventDefault();
    document.querySelector('.delete-container').showModal();
  })

  document.getElementById(`image-profile`).addEventListener('click', (e) => {
    e.preventDefault();
    console.log("image-profile clicked");
    document.querySelector('.image-edit').showModal();
  })

  document.getElementById("save-changes").addEventListener("click", (e) => {
    e.preventDefault();
    const edits = document.querySelectorAll('.edit')

    edits.forEach(item => item.classList.remove('underline'))

  })

});


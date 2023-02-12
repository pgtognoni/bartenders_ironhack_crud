// https://developer.mozilla.org/en-US/docs/Web/API/Window/DOMContentLoaded_event
document.addEventListener("DOMContentLoaded", () => {
  console.log("bartender_crud JS imported successfully!");
 
  document.getElementById("edit-btn").addEventListener("click", (e) => {
    e.preventDefault();
    const edits = document.querySelectorAll('.edit')

    edits.forEach(item => {item.classList.add('underline')})

    edits.forEach(item => item.addEventListener('click', (e) => {
      e.preventDefault();
      const datakey = item.dataset.name;
      console.log("edit button clicked: ", datakey);
      item.style.display = "none";
      document.querySelector(`[data-value="${datakey}"`).style.display = "none";
      document.getElementById(`${datakey}`).classList.add('underline');
      document.getElementById(`${datakey}`).style.display = "block";
      document.querySelector('.h1-profile').style.display = 'block';
    }))

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


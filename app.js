document.querySelectorAll('.col-list').forEach(item => {
  item.addEventListener('click', function(){
  document.querySelector('.bg-modal').style.display = "flex";
})
});


document.querySelectorAll('.close').forEach(item => {
  item.addEventListener('click', function(){
  document.querySelector('.bg-modal').style.display = "none";
})
});

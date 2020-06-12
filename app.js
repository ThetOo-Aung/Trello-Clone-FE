var currListNode;
var listId;

const END_POINT_API = "http://localhost:8080/";

window.onload = function () {
  console.log("DOM is ready");

  fetchdata();
};

function fetchdata() {
  fetch(END_POINT_API + "/list")
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      document.querySelector(".trello-body").innerHTML = getList(data) + addListBtn;
    })
    .catch(err => {
      console.log(err);
    });
}

var addListBtn = `<div class="col-div to-add-list">  
<div class="add-another-list">
  <a href=""><i class="fas fa-plus"></i>&nbsp; Add another List</a>
</div>`;

const getMember = () => {};

const getCheckList = (checklists) => {
  var chklistStr = "";
  if(checklists.length != 0){
    for(var i = 0; i< checklists.length; i++){
      
      chklistStr += `
                <header> <i class="far fa-check-circle"></i> &nbsp;&nbsp;&nbsp; ${checklists[i].title}</header>
                <div class="checklistItem">
                  <input type="checkbox">
                  <label> &nbsp;&nbsp; ${checklists[i].item}</label>
                </div>`;
    }
  }
  return chklistStr;
  
}


const getLabel = (labels) => {
  var lblStr = "";

  if(labels.length != 0){
    for(var i = 0; i < labels.length; i++){
      lblStr += 
      `<span class="card-labels" style="background-color: ${labels[i].color};"></span> `;
     
    }
  }
  return lblStr;
};

const getCards = (cards) => {
  var cardStr = "";
  for(var i = 0 ; i< cards.length; i++){
    cardStr += `
            <div class="col-lists">
              <button class="col-list" onclick="cardClicked($(this).attr('card-id'))" card-id="${cards[i].id}">
                  ${getLabel(cards[i].labels)}
                  <p>${cards[i].title}</p>
                <div class="col-list-icons">
                  <a href=""><i class="fas fa-bars"></i></a>
                  <a href=""><i class="fas fa-paperclip"></i></a>
                </div>
              </button>
            </div>
    `
  } 
  return cardStr;

};

const getList = (list) => {
  var listStr = "";
  currListNode = list.length;
  console.log(currListNode);
  for(var i = 0; i < list.length; i++){
    listStr += `
    <div class="col-div">
      <div class="col-content" onclick="getListId($(this).attr('list-id'))" list-id="${list[i].id}">
        <p>${list[i].title}</p>
        
        <a href=""><i class="fas fa-ellipsis-h"></i></a>
      </div>

      ${getCards(list[i].cards)}
      
        
          <button class="add-another-card">
            <a href=""><i class="fas fa-plus"></i>&nbsp; Add another card</a>
            <a href=""><i class="far fa-clone"></i></a>
          </button>
      </div> 
    </div>`
  }
  return listStr;
};


function cardClicked(cardId){
  document.querySelector(".bg-modal").style.display = "flex";
	fetch(END_POINT_API+"card/"+cardId)
  .then((res)=>  res.json())
  .then((card) => {
      console.log(card);

      document.getElementById('checklists').innerHTML = getCheckList(card.checklists);

  })
  	.catch(function (err) {
   		console.log(err);
  	});

}
function getListId(listId){
	listId = listId;
	console.log(listId);
}


document.querySelectorAll(".close").forEach((item) => {
  item.addEventListener("click", function () {
    document.querySelector(".bg-modal").style.display = "none";
  });
});


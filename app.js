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
      document.querySelector(".trello-body").innerHTML = getList(data) + addAnotherList();
    })
    .catch(err => {
      console.log(err);
    });
}

function addAnotherList() {
    var addListBtn = 
              ` <div class="col-div remove" id="to-add-list"> 
                  <div class="add-another-list">
                    <a onclick="addList()"><i class="fas fa-plus" ></i>&nbsp; Add another List</a>
                  </div>
                </div>
                <div class="col-div add" id="to-add-list"> 
                    <div class="add-another-list2">
                      <input type="text" placeholder="Enter List Title..." id="list-title"></input>
                      <div>
                      <button onclick="addNewList()">Add List</button>
                      <a href="" onclick="closeAddList()"  style="margin-left:7px"><i class="fas fa-times"></i></a>
                      </div>
                    </div>
                </div>
                `;
  return addListBtn;
}
function addNewList() {
  var listTitle = document.getElementById('list-title').value;
  console.log(listTitle);
  if(listTitle !== ""){

    fetch(END_POINT_API + "/list",{
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        title: listTitle,
        position: currListNode + 1,
        status: 1
      })
    })
    .then(res => res.json())
    .then((data) =>{
      console.log(data);
      this.fetchdata();
    })
    }
}


function addList(){

  console.log("addList is reached");
  document.querySelector('.add').style.display = "flex";
  document.querySelector('.remove').style.display = "none";

}

function closeAddList(){
  document.querySelector('.remove').style.display = 'none';
  document.querySelector('.add').style.display = "block";
}


const getMember = () => {};

const getCheckList = (checklists) => {
  var chklistStr = "";
  if(checklists.length != 0){
    for(var i = 0; i< checklists.length; i++){
      
      chklistStr += `
                <header> <i class="far fa-check-circle"></i> &nbsp;&nbsp;${checklists[i].title}</header>
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
  console.log( "Current List Node Number is "+currListNode);
  for(var i = 0; i < list.length; i++){
    listStr += `
    <div class="col-div">
      <div class="col-content" onclick="getListId($(this).attr('list-id'))" list-id="${list[i].id}">
        <p>${list[i].title}</p>
        
        <a onclick="showMenu(${list[i].id})" id="idForRect${list[i].id}"><i class="fas fa-ellipsis-h"></i></a>
          <div class="show-menu showmenu${list[i].id}">
            <div class="row-div">
                <p>List Actions</p>
                <i class="fas fa-times" onclick="closeMenu(${list[i].id})"></i>
            </div>
            <div class="sm-separator"></div>
            <a href="#">Add Card...</a>
            <a href="#">Copy List...</a>
            <a href="#">Move List...</a>
            <a href="#">Watch</a>
            <div class="sm-separator"></div>
            <a href="#">Sort By...</a>
            <div class="sm-separator"></div>
            <a href="#">Move All Cards in This List...</a>
            <a href="#">Archive All Cards in This List...</a>
            <div class="sm-separator"></div>
            <a href="#" onclick="deleteList(${list[i].id})">Archive This List...</a>
            </div>

      </div>

      
      ${getCards(list[i].cards)}
      
        
          <button class="add-another-card">
            <a href="#"><i class="fas fa-plus"></i>&nbsp; Add another card</a>
            <a href="#"><i class="far fa-clone"></i></a>
          </button>
      </div> 
    </div>`
  }
  return listStr;
};


function showMenu(id) {

  console.log("This is List Id "+ id);
  var rect = document.getElementById('idForRect'+id).getBoundingClientRect();

  console.log("This is Rect" + rect);
  console.log("Top is " + rect.top + ", Left is " + rect.left);


  
  
  var listMenu = document.querySelector('.showmenu'+id);
  listMenu.style.display = "flex";

  listMenu.style.left =  rect.left-15 + "px";
  listMenu.style.top = rect.top+27 + "px";
  
}

function closeMenu(id){
  document.querySelector('.showmenu'+id).style.display="none";
}

function deleteList(listId) {
  fetch(END_POINT_API+"list/"+listId, {
    method: "DELETE"
  })
  .then(function(){
    fetchdata();
    window.onload();
  })
}

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


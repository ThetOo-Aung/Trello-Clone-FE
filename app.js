const END_POINT_API = "http://localhost:8080/";
var CURR_LIST_NODE;
var listId;

window.onload = function () {
  console.log("Ready!!!");
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

const getList = (list) => {
  var listStr = "";
  CURR_LIST_NODE = list.length;
  console.log( "Current List Node Number is " + CURR_LIST_NODE);
  for(var i = 0; i < list.length; i++){
    listStr += `
    <div class="col-div">
      <div class="col-content" onclick="getListId($(this).attr('list-id'))" list-id="${list[i].id}">

        <input type="text" value="${list[i].title}" onfocus="showInputBtn(${list[i].id})" class="list-update${list[i].id}">
        <input type="button" value="Save" class="inputbtn${list[i].id}" onclick="updateList(${list[i].id},${list[i].position})">
        <a onclick="hideInputBtn(${list[i].id})" class="hide hideBtn${list[i].id}"><i class="fas fa-times"></i></a>

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
    </div>`;
  }
  return listStr;
};

const getCards = (cards) => {
  var cardStr = "";
  for(var i = 0 ; i< cards.length; i++){
    cardStr += `
            <div class="col-lists">
              <button class="col-list" onclick="cardClicked($(this).attr('card-id'))" card-id="${cards[i].id}">
                  <div class="labelParent">${getLabel(cards[i].labels)}</div>
                  <div class="card-member">
                    <p>${cards[i].title}</p>
                    ${getMember(cards[i].members)}
                  </div>
                <div class="col-list-icons">
                  <a href=""><i class="fas fa-bars"></i></a>
                  <a href=""><i class="fas fa-paperclip"></i></a>
                </div>
              </button>
            </div>`;
  } 
  return cardStr;

};

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

const getCheckList = (checklists) => {
  var chklistStr = "";
  if(checklists.length != 0){
    for(var i = 0; i< checklists.length; i++){
      
      chklistStr += `
                <header> <i class="fas fa-check" style="margin-right:15px"></i>${checklists[i].title}</header>
                <div class="checklistItem">
                  <input type="checkbox">
                  <label> &nbsp;&nbsp; ${checklists[i].item}</label>
                </div>`;
    }
  }
  return chklistStr;
}

const getMember = (members) => {
  // console.log(members);

  var memberStr = "";
  if(members.length !== 0 ){
    for(let i = 0; i< members.length; i++){
      memberStr += `
      <span>${getInitials(members[i].name)}</span>
      ` 
    }
  }
  return memberStr;
};
// ------------------------------Get Function Done------------------------------ !!!

function updateList(listId,listPosition) {
  var listTitle = document.querySelector('.list-update'+listId).value;
  // console.log("Title of the list selected is "+ listTitle);
  // console.log("===============> List Position is "+ listPosition);    

  fetch(END_POINT_API + "list/" + listId ,{
  method: "PUT",
  headers: {
    "Content-Type": "application/json"
    },
    body: JSON.stringify({
      title: listTitle,
      position: listPosition,
      status: 1
    })
  })
  .then((res) => res.json())
  .then((data) => {
    console.log(data);
    fetchdata();
    window.onload();
  })
  .catch((err) => {
    console.log(err);
    
  })

}
// ------------------------------Update Function Done------------------------------ !!!


function deleteList(listId) {
  fetch(END_POINT_API+"list/"+listId, {
    method: "DELETE"
  })
  .then(function(){
    fetchdata();
    window.onload();
  })
}
// ------------------------------Delete Function Done------------------------------ !!!




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
        position: CURR_LIST_NODE + 1,
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
// ------------------------------Update Function Done------------------------------ !!!



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
                    <a href="" onclick="closeAddList()" style="margin-left:7px"><i class="fas fa-times"></i></a>
                    </div>
                  </div>
              </div>
              `;
return addListBtn;
}




// +++++++++++++++++++++....Functions....+++++++++++++++++++++


function addList(){
  console.log("addList is reached");
  document.querySelector('.add').style.display = "flex";
  document.querySelector('.remove').style.display = "none";
}

function closeAddList(){
  document.querySelector('.remove').style.display = 'none';
  document.querySelector('.add').style.display = "block";
}

function getInitials(name){
  var initials;
  var names = name.split(' ');
  initials = names[0].substring(0,1).toUpperCase();
  if (names.length > 1) {
    initials += names[names.length - 1].substring(0, 1).toUpperCase();
  }
  return initials;
}

const getCardName = ((cardTitle) => {
  return `<i class="far fa-credit-card"></i>&nbsp;&thinsp;&thinsp;${cardTitle}`;
  
});

function getListName(listTitle){
  var listT = `<i class="far fa-credit-card" style="display:none"></i>In List ${listTitle}`;
  // console.log("List title for card is "+ listTitle);
  return listT;
}

function hideInputBtn(id){
  document.querySelector('.inputbtn'+id).style.display = "none";
  document.querySelector('.hideBtn'+id).style.display = "none";
}

function showInputBtn(id){
  var saveBtn = document.querySelector('.inputbtn'+id).style.display = "inline-block";
  var closeBtn = document.querySelector('.hideBtn'+id).style.display = "inline-block";
}

function showMenu(id) {
  // console.log("This is List Id "+ id);
  // console.log("This is Rect" + rect);
  // console.log("Top is " + rect.top + ", Left is " + rect.left);

  var rect = document.getElementById('idForRect'+id).getBoundingClientRect();
  var listMenu = document.querySelector('.showmenu'+id);
  listMenu.style.display = "flex";
  listMenu.style.left =  rect.left-15 + "px";
  listMenu.style.top = rect.top+27 + "px";
}

function closeMenu(id){
  document.querySelector('.showmenu'+id).style.display="none";
}


function cardClicked(cardId){
  document.querySelector(".bg-modal").style.display = "flex";
  document.getElementById('section2').style.overflowX = "hidden";

	fetch(END_POINT_API+"card/"+cardId)
  .then((res)=>  res.json())
  .then((card) => {
      console.log(card);
      document.getElementById('titlelist').innerHTML = getListName(card.list.title);
      document.getElementById('card-title').innerHTML = getCardName(card.title);
      document.getElementById('card-des').innerHTML = getDescription(card.description);
      document.getElementById('checklists').innerHTML = getCheckList(card.checklists);
      document.getElementById('labelShow').innerHTML =  getlblName(card.labels);
      document.getElementById('memShow').innerHTML = getmemberName(card.members);
  })
  	.catch(function (err) {
   		console.log(err);
  	});

}
function getlblName(lbl){
  console.log(lbl);
  var lblStr = "";
  if(lbl.length !== 0){
    document.getElementById('labelh4tag').style.display = "block";

    for(let i = 0; i < lbl.length; i++){
    lblStr += `
   <input class="lblEdit" type="button" style="background-color:${lbl[i].color};" value="${lbl[i].name}">
    `;
  }
  }else{
    document.getElementById('labelh4tag').style.display = "none";
  }
  return lblStr;
}

function getmemberName(mem){
  console.log(mem);
  var memStr = "";
  if(mem.length !== 0){
    document.getElementById('memberh4tag').style.display = "block";
    for(let i = 0 ; i < mem.length; i++){
      memStr += `
      <span>${getInitials(mem[i].name)}</span>`;
    }
  }else{
    document.getElementById('memberh4tag').style.display = "none";
  }
  return memStr;
}


function getListId(listId){
	listId = listId;
	console.log(listId);
}
const getDescription = ((des) =>{
  return `<i class="fas fa-stream"></i> &nbsp; Description - ${des}`;
});



document.querySelectorAll(".close").forEach((item) => {
  item.addEventListener("click", function () {
    document.querySelector(".bg-modal").style.display = "none";
    document.getElementById('section2').style.overflowX = "auto";
    // document.getElementById('labelh4tag').style.display = "block";
  });
});


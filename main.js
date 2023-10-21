const DATALIST = "dataList";

let dataList = [];

//2. 값 편집의 테이블
const dataTable = document.querySelector(".dataTable");
const editTableBtn_start = document.getElementById("editBtn_start");
const editTableBtn_finish = document.getElementById("editBtn_finish");

//3. 값 추가 폼
const addForm = document.querySelector(".addForm");

// 4. 값 고급 편집 박스
const dataBox = document.querySelector(".dataBox");
const advancedEditBtn_start = document.getElementById("advancedEditBtn_start");
const advancedEditBtn_finish = document.getElementById(
  "advancedEditBtn_finish"
);

function createData(event) {
  event.preventDefault();

  let dataObj = {
    //id: number, value: number
    id: +event.target.id.value,
    value: +event.target.value.value,
  };

  paintTdOn2(dataObj);
  saveData(dataObj);
  //input 값 초기화
  event.target.id.value = "";
  event.target.value.value = "";
}

function startEditTableData() {
  // 버튼 변경
  editTableBtn_start.hidden = true;
  editTableBtn_finish.hidden = false;

  // 테이블 안의 '값'에 해당하는 td를 contentaditable로 만들기
  let allValueTds = Array.from(document.querySelectorAll(".editable"));
  allValueTds.forEach((td) => {
    td.setAttribute("contenteditable", "true");
  });
}

function finishEditTableData() {
  // 버튼 변경
  editTableBtn_finish.hidden = true;
  editTableBtn_start.hidden = false;

  // 테이블 안의 '값'에 해당하는 td를 contentaditable을 false로.
  let allValueTds = Array.from(document.querySelectorAll(".editable"));
  allValueTds.forEach((td) => {
    td.setAttribute("contenteditable", "false");
  });

  //수정한 값 가져오기
  let tempData = [];
  let newData = Array.from(document.querySelectorAll("tr"));
  newData.forEach((tr) => {
    if (tr.getAttribute("id") !== null) {
      let dataObj = {
        id: Number(tr.getAttribute("id")),
        value: Number(tr.getElementsByClassName("editable")[0].textContent),
      };
      tempData.push(dataObj);
    }
  });

  dataList = tempData;

  saveDataList();
}

function startAdvancedEditing() {
  // 버튼 변경
  advancedEditBtn_start.hidden = true;
  advancedEditBtn_finish.hidden = false;

  dataBox.setAttribute("contenteditable", "true");
}

function finishAdvancedEditing() {
  // 버튼 변경
  advancedEditBtn_finish.hidden = true;
  advancedEditBtn_start.hidden = false;

  dataBox.setAttribute("contenteditable", "false");

  //수정한 값 가져오기
  let newData = dataBox.textContent;

  dataList = JSON.parse(newData);

  saveDataList();
  rePaintTable();
}

function rePaintTable(){
  //테이블을 초기화 한다음
  while(dataTable.hasChildNodes()&&dataTable.childNodes[2]){
    dataTable.removeChild(dataTable.childNodes[2]);
  }
  //다시 반복문 돌려서 페인팅하기
  for (let dataObj of dataList ) {
    paintTdOn2(dataObj);
  }
}


function saveData(dataObj) {
  dataList.push(dataObj);
  saveDataList();
}

function paintTdOn2(dataObj) {
  const tr = document.createElement("tr");
  const tdId = document.createElement("td");
  const tdValue = document.createElement("td");
  const tdBtnContainer = document.createElement("td");

  tdValue.classList.add("editable");

  const delButton = document.createElement("button");
  tdBtnContainer.appendChild(delButton);
  delButton.innerText = "삭제하기";
  delButton.addEventListener("click", deleteData);

  tdId.innerHTML = dataObj.id;
  tdValue.innerHTML = dataObj.value;
  tr.setAttribute("id", dataObj.id);
  tr.appendChild(tdId);
  tr.appendChild(tdValue);
  tr.appendChild(tdBtnContainer);
  dataTable.appendChild(tr);
}

function paintDataOn4(text) {
  dataBox.textContent = `${text}`;
}

function deleteData(event) {
  const { target: button } = event;
  const tr = button.parentNode.parentNode;
  dataTable.removeChild(tr);
  dataList = dataList.filter(
    (data) => data.id !== Number(tr.getAttribute("id"))
  );

  saveDataList();
}

function saveDataList() {
  let text = JSON.stringify(dataList);

  localStorage.setItem(DATALIST, text);
  paintDataOn4(text);
}

function loadDataList() {
  const loadedDataList = localStorage.getItem(DATALIST);
  if (loadedDataList !== null) {
    const parsedDataList = JSON.parse(loadedDataList);
    for (let dataObj of parsedDataList) {
      paintTdOn2(dataObj);
      saveData(dataObj);
    }
  }
}

function init() {
  // let text = JSON.stringify(dataList);
  // localStorage.setItem(DATALIST, text);
  loadDataList();
  addForm.addEventListener("submit", createData);
  editTableBtn_start.addEventListener("click", startEditTableData);
  editTableBtn_finish.addEventListener("click", finishEditTableData);
  advancedEditBtn_start.addEventListener("click", startAdvancedEditing);
  advancedEditBtn_finish.addEventListener("click", finishAdvancedEditing);
}

init();

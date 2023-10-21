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

function createData(event) {
  event.preventDefault();

  let dataObj = {
    //id: number, value: number
    id: +event.target.id.value,
    value: +event.target.value.value,
  };

  paintData(dataObj);
  saveData(dataObj);
  //input 값 초기화
  event.target.id.value = "";
  event.target.value.value = "";
}

// 값 부분만 수정할 수 있게 변경하기
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

// 수정된 데이터로 저장하기.
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

  //수정한 데이터 저장하기
}

function saveData(dataObj) {
  dataList.push(dataObj);
  saveDataList();
}

function paintData(dataObj) {
  const tr = document.createElement("tr");
  const tdId = document.createElement("td");
  const tdValue = document.createElement("td");
  const tdBtnContainer = document.createElement("td");

  tdValue.classList.add("editable");
  // tdValue.contentEditable = "false";

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
      paintData(dataObj);
      saveData(dataObj);
    }
  }
}

function init() {
  loadDataList();
  addForm.addEventListener("submit", createData);
  editTableBtn_start.addEventListener("click", startEditTableData);
  editTableBtn_finish.addEventListener("click", finishEditTableData);
}

init();

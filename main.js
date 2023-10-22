const DATALIST = "dataList";

let dataList = [];

// 1. 그래프
const graphList = document.querySelector(".graph_list");
const yAxis = document.querySelector(".y_axis");
const graphBox = document.querySelector(".graphBox");

//2. 값 편집
const dataTable = document.querySelector(".dataTable");
const editTableBtn_start = document.getElementById("editBtn_start");
const editTableBtn_finish = document.getElementById("editBtn_finish");

//3. 값 추가
const addForm = document.querySelector(".addForm");

// 4. 값 고급
const dataBox = document.querySelector(".dataBox");
const advancedEditBtn_start = document.getElementById("advancedEditBtn_start");
const advancedEditBtn_finish = document.getElementById(
  "advancedEditBtn_finish"
);

function init() {
  loadDataList();
  getYAxis();
  addForm.addEventListener("submit", createData);
  editTableBtn_start.addEventListener("click", startEditTableData);
  editTableBtn_finish.addEventListener("click", finishEditTableData);
  advancedEditBtn_start.addEventListener("click", startAdvancedEditing);
  advancedEditBtn_finish.addEventListener("click", finishAdvancedEditing);
}

function loadDataList() {
  const loadedDataList = localStorage.getItem(DATALIST);

  if (loadedDataList !== null) {
    const parsedDataList = JSON.parse(loadedDataList);
    for (let dataObj of parsedDataList) {
      paintEachGraphOn1(dataObj);
      paintTdOn2(dataObj);
      saveData(dataObj);
    }
  }
}

//1. 그래프 - y축 생성
function getYAxis() {
  const yArr = new Array();

  //10 단위로 값 구하기
  for (let i = 100; i >= 0; i--) {
    if (i % 10 === 0) yArr.push(i);
  }

  yArr.forEach((num) =>
    yAxis.insertAdjacentHTML("beforeend", `<span><p>${num}</p></span>`)
  );
  yAxis.insertAdjacentHTML("beforeend", `<span><p> </p></span>`);
}

//1. 그래프 - 그래프 생성
function paintEachGraphOn1(dataObj) {
  const li = document.createElement("li");
  const spanId = document.createElement("span");

  spanId.classList.add("id");
  spanId.innerHTML = dataObj.id;

  li.setAttribute("id", dataObj.id);

  //막대 그래프 그리기
  const barContainer = document.createElement("div");
  const bar = document.createElement("div");
  barContainer.className = "barContainer";
  bar.className = "bar";
  barContainer.style.height = "100%";
  bar.style.height = `${dataObj.value}%`;
  bar.style.width = "20px";
  bar.style.backgroundColor = "black";

  li.appendChild(barContainer);
  barContainer.appendChild(bar);
  li.appendChild(spanId);
  graphList.appendChild(li);
}

//1. 그래프 - 그래프 리페인팅
function rePaintGraph() {
  //그래프를 모두 없앤 다음에
  while (graphList.hasChildNodes()) {
    graphList.removeChild(graphList.firstChild);
  }

  //다시 그래프를 페인팅하기
  for (let dataObj of dataList) {
    paintEachGraphOn1(dataObj);
  }
}

//2. 값 편집 - 표 생성
function paintTdOn2(dataObj) {
  const tr = document.createElement("tr");
  const tdId = document.createElement("td");
  const tdValue = document.createElement("td");
  const tdBtnContainer = document.createElement("td");

  tdValue.classList.add("editable");

  const delButton = document.createElement("button");
  tdBtnContainer.appendChild(delButton);
  delButton.innerText = "삭제";
  delButton.addEventListener("click", deleteData);

  tdId.innerHTML = dataObj.id;
  tdValue.innerHTML = dataObj.value;
  tr.setAttribute("id", dataObj.id);
  tr.appendChild(tdId);
  tr.appendChild(tdValue);
  tr.appendChild(tdBtnContainer);
  dataTable.appendChild(tr);
}

//2. 값 편집 - 표 리페인팅
function rePaintTable() {
  //테이블 비운 다음에
  while (dataTable.hasChildNodes() && dataTable.childNodes[2]) {
    dataTable.removeChild(dataTable.childNodes[2]);
  }
  //다시 반복문 돌려서 페인팅하기
  for (let dataObj of dataList) {
    paintTdOn2(dataObj);
  }
}

//2. 값 편집 - 수정 시작
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

//2. 값 편집 - 수정 끝
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

  //수정한 값을 dataList에 넣기
  dataList = tempData;

  saveDataList();
}

//2. 값 편집 - 삭제하기
function deleteData(event) {
  const { target: button } = event;
  const tr = button.parentNode.parentNode;
  dataTable.removeChild(tr);
  dataList = dataList.filter(
    (data) => data.id !== Number(tr.getAttribute("id"))
  );
  saveDataList();
  rePaintGraph();
}

//3. 값 추가 - 값 추가하기
function createData(event) {
  event.preventDefault();
  let dataObj = {
    //id: number, value: number
    id: +event.target.id.value,
    value: +event.target.value.value,
  };

  //ID 중복 검사
  if (checkId(+event.target.id.value)) {
    paintEachGraphOn1(dataObj);
    paintTdOn2(dataObj);
    saveData(dataObj);
  } else {
    alert("중복된 아이디입니다.");
  }

  //input 값 초기화
  event.target.id.value = "";
  event.target.value.value = "";
}

//3. 값 추가 - ID 중복 검사하기
function checkId(inputedId) {
  for (let data of dataList) {
    console.log(data.id);
    if (inputedId === data.id) {
      //아이디가 중복인 경우
      return false;
    }
  }
  return true;
}

//4. 값 고급 편집 - 수정 시작
function startAdvancedEditing() {
  // 버튼 변경
  advancedEditBtn_start.hidden = true;
  advancedEditBtn_finish.hidden = false;

  dataBox.setAttribute("contenteditable", "true");
}

//4. 값 고급 편집 - 수정 끝
function finishAdvancedEditing() {
  //수정한 값 가져오기
  let newData = dataBox.textContent;

  let tempData;

  //JSON 형식에 맞게 되었는지 체크
  try {
    tempData = JSON.parse(newData);
  } catch (err) {
    alert("JSON 형식에 맞게 써주세요. " + err);
    return;
  }

  //ID 중복 체크
  if (!checkAdvancedID(tempData)) {
    alert("ID가 중복되었습니다.");
    return;
  }

  dataList = JSON.parse(newData);

  // 버튼 변경
  advancedEditBtn_finish.hidden = true;
  advancedEditBtn_start.hidden = false;

  dataBox.setAttribute("contenteditable", "false");

  saveDataList();
  rePaintTable();
  rePaintGraph();
}

//4. 값 고급 편집 - 페인팅 & 리페인팅 시 사용.
function paintDataOn4(text) {
  dataBox.textContent = `${text}`;
}

//4. 값 고급 편집 - ID 중복 검사
function checkAdvancedID(tempData) {
  let idObject = {};
  for (let data of tempData) {
    idObject[data.id] = (idObject[data.id] || 0) + 1;
  }

  for (let key in idObject) {
    if (idObject[key] > 1) {
      //아이디 중복
      return false;
    }
  }
  return true;
}

// 저장할 때 사용
function saveData(dataObj) {
  dataList.push(dataObj);
  saveDataList();
}

function saveDataList() {
  let text = JSON.stringify(dataList);
  localStorage.setItem(DATALIST, text);
  paintDataOn4(text);
}

init();

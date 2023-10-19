let dummy_data = [
  {
    id: 0,
    value: 75,
  },
  {
    id: 1,
    value: 20,
  },
  {
    id: 2,
    value: 100,
  },
  {
    id: 3,
    value: 50,
  },
  {
    id: 4,
    value: 80,
  },
];


//



//3. 값 추가
const addForm = document.querySelector(".addForm");
const addIdInput = addForm.getAttributeNames("id");
const addValueInput = addForm.getAttributeNames("value");
const dataTable = document.querySelector(".dataTable");

addForm.addEventListener("submit", addValue);

function addValue(event){
  event.preventDefault();
  console.log("addValue 작동!");
 
  let tempData = {
    //id: string, value: number
    id: event.target.id.value, 
    value: +event.target.value.value
  };

  dummy_data.push(tempData);
  console.log(dummy_data);
}

// 4. 값 고급 편집
const dataBox = document.querySelector(".dataBox");

let txt = JSON.stringify(dummy_data);

dataBox.textContent = `${txt}`;

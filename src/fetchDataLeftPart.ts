// import { filterCards } from "./showCards";

const taskInputElement = document.querySelector('.titleContainer--input') as HTMLInputElement;
const descriptionInputelement = document.querySelector('.descriptionContainer--input') as HTMLInputElement;
const duedateInputElement= document.querySelector('.duePriorityContainer__left--input') as HTMLInputElement;
const priorityInputElement = document.querySelector('.duePriorityContainer__right__select') as HTMLInputElement;
const categoryInputElement = document.querySelector('.categoryContainer__inputContainer__select') as HTMLInputElement;
const addbuttonElement = document.querySelector('.leftwrapper__form--button') as HTMLButtonElement;
const leftPartMesaageElement = document.querySelector('.mainwrapper__left--message') as HTMLDivElement;
const taskContainerElement = document.querySelector('.mainwrapper__right__taskContainer ') as HTMLDivElement;
const tagsContainerElement = document.querySelector('.categoryContainer__inputContainer__tagContainer') as HTMLDivElement  ;




 type Task = {
  id:string,
  task:string,
  description:string,
  date:string,
  priority:string,
  category:string[]
}

let alltaskArray: Task[] =[];
let categoryArray :string[]=[];



const stringArray = localStorage.getItem('allTask');
if(stringArray !== null){
   alltaskArray = JSON.parse(stringArray);
}
else{
  alltaskArray =[];
}


traverseCardsArray(alltaskArray);






categoryInputElement.addEventListener('change',(e)=>{
let categoryValue = categoryInputElement.value;
if(categoryValue !== ''){

if(categoryArray.length === 0){
  categoryArray.push(categoryValue);
}
else{
   if(categoryArray.indexOf(categoryValue) === -1) {
  categoryArray.push(categoryValue);
 }

}

  
}
console.log(categoryArray);
tagsContainerElement.innerHTML = '';
categoryArray.forEach((tag)=>{
  createTag(tag)
})
})

addbuttonElement.addEventListener('click',(e)=>{
  e.preventDefault();
 let taskValue : string = taskInputElement.value;
 const descriptionValue :string = descriptionInputelement.value;
 const duedateValue = duedateInputElement.value;
 let dateObj = new Date(duedateValue );
 const formattedDate = dateObj.toDateString();
const prorityValue = priorityInputElement.value;

if(prorityValue === '' || taskValue === '' || descriptionValue === '' || duedateValue === '' || categoryArray.length === 0){
  console.log("error");
  leftPartMesaageElement.classList.add('show-message');
  return
}

const uniqueId = Date.now().toString(36);


alltaskArray.push({
  id:uniqueId,
  task:taskValue,
  description:descriptionValue,
  date:formattedDate,
  priority:prorityValue,
  category:categoryArray
});

const stringAllTaskArray = JSON.stringify(alltaskArray) 

localStorage.setItem('allTask',stringAllTaskArray);

traverseCardsArray(alltaskArray);


 taskInputElement.value = '';
 descriptionInputelement.value = '';
 duedateInputElement.value ='';
 priorityInputElement.value='';
 categoryInputElement.value='';
 tagsContainerElement.innerHTML = '';

})



function traverseCardsArray(allTaskArray:Task[]){
  taskContainerElement.innerHTML ='';
  allTaskArray.forEach((element)=>{
    createCards(element);

});
}

function createCards(element:Task){
  const singleTaskContainer = document.createElement('div');
  singleTaskContainer.className = 'taskContainer__singleTaskContainer';

  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.className = 'taskContainer__singleTaskContainer--checkbox';
  singleTaskContainer.appendChild(checkbox);
  
  const middlePart = document.createElement('div');
  middlePart.className = 'taskContainer__singleTaskContainer__middle middlePart';

  const heading = document.createElement('h3');
  heading.className = 'middlePart--heading';
  heading.textContent = element.task;
  middlePart.appendChild(heading);
  

  const datePriorityContainer = document.createElement('div');
  datePriorityContainer.className = 'middlePart__datePriorityContainer';

  const date = document.createElement('div');
  date.className = 'middlePart__datePriorityContainer--date';
  date.textContent = element.date;
  datePriorityContainer.appendChild(date);

  const separator1 = document.createElement('div');
  separator1.className = 'middlePart__datePriorityContainer--separation';
  separator1.textContent = '|';
  datePriorityContainer.appendChild(separator1);

  const deadline = document.createElement('div');
  deadline.className = 'middlePart__datePriorityContainer--deadline';
  deadline.textContent = '12:10 in the afternoon';
  datePriorityContainer.appendChild(deadline);

  const separator2 = document.createElement('div');
  separator2.className = 'middlePart__datePriorityContainer--separation';
  separator2.textContent = '|';
  datePriorityContainer.appendChild(separator2);
  

  const priority = document.createElement('div');
  priority.className = 'middlePart__datePriorityContainer--priority';
  priority.textContent = element.priority;
  datePriorityContainer.appendChild(priority);
  

  middlePart.appendChild(datePriorityContainer);

  const tagContainer = document.createElement('div');
  tagContainer.className = 'middlePart__tagContainer';
  

  element.category.forEach((category)=>{
    const tag1 = document.createElement('div');
    tag1.className = 'middlePart__tagContainer--tag';
    tag1.textContent = category;
    tagContainer.appendChild(tag1);
  })
 

  middlePart.appendChild(tagContainer);
  

  const content = document.createElement('div');
  content.className = 'middlePart--content';
  content.textContent = element.description;
  middlePart.appendChild(content);
  

  singleTaskContainer.appendChild(middlePart);
  

  const imgContainer = document.createElement('div');
  imgContainer.className = 'taskContainer__singleTaskContainer__imgContainer';


  const deleteIcon = document.createElement('i');
deleteIcon.className = 'fa-regular fa-trash-can ';
deleteIcon.setAttribute('data-task-id', element.id);
  imgContainer.appendChild (deleteIcon);
  

  singleTaskContainer.appendChild(imgContainer);

  taskContainerElement.appendChild(singleTaskContainer);
  deleteButtonFunctionality();
}

function createTag(tagName:string){
  const tagContainer = document.createElement('div');
  tagContainer.classList.add('categoryContainer__inputContainer__tagContainer__tag', 'tag');


  const span = document.createElement('span');
  span.classList.add('tag--name');
  span.textContent = tagName;

  const icon = document.createElement('i');
  icon.classList.add('fa-regular', 'fa-circle-xmark', 'tag--cross');
  tagContainer.appendChild(span);
  tagContainer.appendChild(icon);
  tagsContainerElement.appendChild(tagContainer);
}





function removeCard(clickedElement:HTMLElement){
  const taskId = clickedElement.getAttribute('data-task-id');
//  console.log(taskId);
 const parentElement = clickedElement.closest(".taskContainer__singleTaskContainer") as HTMLElement;  
parentElement.remove();
const indexOfTaskInArray = alltaskArray.findIndex((task)=>task.id === taskId);
// console.log(indexOfTaskInArray);
// console.log("taskarray1",alltaskArray);
alltaskArray.splice(indexOfTaskInArray, 1);
// console.log("taskarray2",alltaskArray);
 const striggifyArray = JSON.stringify(alltaskArray);
 localStorage.setItem('allTask',striggifyArray);
}



function deleteButtonFunctionality(){
  
  const deleteButtonElement = document.querySelectorAll('.taskContainer__singleTaskContainer__imgContainer');


  deleteButtonElement.forEach((singleButton)=>{
    singleButton.addEventListener('click',(e)=>{
      const clickedElement = e.target as HTMLElement ;
         console.log("hii")
        if (clickedElement!== null) {
          removeCard(clickedElement);
        }
    })
  })
}

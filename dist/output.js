"use strict";
// import { filterCards } from "./showCards";
const taskInputElement = document.querySelector('.titleContainer--input');
const descriptionInputelement = document.querySelector('.descriptionContainer--input');
const duedateInputElement = document.querySelector('.duePriorityContainer__left--input');
const priorityInputElement = document.querySelector('.duePriorityContainer__right__select');
const categoryInputElement = document.querySelector('.categoryContainer__inputContainer__select');
const addbuttonElement = document.querySelector('.leftwrapper__form--button');
const leftPartMesaageElement = document.querySelector('.mainwrapper__left--message');
const taskContainerElement = document.querySelector('.mainwrapper__right__taskContainer ');
const tagsContainerElement = document.querySelector('.categoryContainer__inputContainer__tagContainer');
const searchElement = document.querySelector(".topContainer__searchContainer--input");
const selectPriorityElementRight = document.querySelector(".topContainer__bottom__sortContainer__select");
const filterInputElementRight = document.querySelector('.topContainer__bottom__filterContainer__select');
const filterTagContainerRight = document.querySelector('.filterContainer__tagcontainer');
const selectCategoryRightElement = document.querySelector(".filterContainer__select");
let alltaskArray = [];
let categoryArray = [];
let categoryRightArray = [];
let afterAllEditInCard = [];
let beforeSortingArray = [];
let isChanged = false;
let catagoryDeleted = false;
const stringArray = localStorage.getItem('allTask');
if (stringArray !== null) {
    alltaskArray = JSON.parse(stringArray);
    afterAllEditInCard = [...alltaskArray];
    beforeSortingArray = [...afterAllEditInCard];
}
else {
    alltaskArray = [];
    afterAllEditInCard = [];
    beforeSortingArray = [];
}
traverseCardsArray(alltaskArray);
categoryInputElement.addEventListener('change', (e) => {
    let categoryValue = categoryInputElement.value;
    if (categoryValue !== '') {
        if (categoryArray.length === 0) {
            categoryArray.push(categoryValue);
        }
        else {
            if (categoryArray.indexOf(categoryValue) === -1) {
                categoryArray.push(categoryValue);
            }
        }
    }
    // console.log(categoryArray);
    tagsContainerElement.innerHTML = '';
    categoryArray.forEach((tag) => {
        createTag(tag);
    });
});
addbuttonElement.addEventListener('click', (e) => {
    e.preventDefault();
    let taskValue = taskInputElement.value;
    const descriptionValue = descriptionInputelement.value;
    const duedateValue = duedateInputElement.value;
    let dateObj = new Date(duedateValue);
    const formattedDate = dateObj.toDateString();
    const prorityValue = priorityInputElement.value;
    if (prorityValue === '' || taskValue === '' || descriptionValue === '' || duedateValue === '' || categoryArray.length === 0) {
        console.log("error");
        leftPartMesaageElement.classList.add('show-message');
        return;
    }
    const uniqueId = Date.now().toString(36);
    let sortedValue;
    if (prorityValue === 'Low Priority') {
        sortedValue = 0;
    }
    else if (prorityValue == "Medium") {
        sortedValue = 1;
    }
    else if (prorityValue === 'High Priority') {
        sortedValue = 2;
    }
    else {
        sortedValue = -1;
    }
    leftPartMesaageElement.classList.remove('show-message');
    alltaskArray.push({
        id: uniqueId,
        task: taskValue,
        description: descriptionValue,
        date: formattedDate,
        priority: prorityValue,
        category: categoryArray,
        sortValue: sortedValue,
        isChecked: false
    });
    const stringAllTaskArray = JSON.stringify(alltaskArray);
    localStorage.setItem('allTask', stringAllTaskArray);
    afterAllEditInCard = [...alltaskArray];
    beforeSortingArray = [...alltaskArray];
    traverseCardsArray(alltaskArray);
    taskInputElement.value = '';
    descriptionInputelement.value = '';
    duedateInputElement.value = '';
    priorityInputElement.value = '';
    categoryInputElement.value = '';
    tagsContainerElement.innerHTML = '';
    categoryArray = [];
});
searchElement.addEventListener('input', () => {
    runAllFilterTogether();
});
function searchTaskFunction() {
    const valueInInput = searchElement.value;
    const afterSearchFilteredArray = alltaskArray.filter((card) => {
        const taskName = card.task;
        const descriptionDetail = card.description;
        if (taskName.includes(valueInInput) && descriptionDetail.includes(valueInInput)) {
            return true;
        }
        else if (taskName.includes(valueInInput)) {
            return true;
        }
        else if (descriptionDetail.includes(valueInInput)) {
            return true;
        }
        else {
            return false;
        }
    });
    return afterSearchFilteredArray;
}
selectCategoryRightElement.addEventListener('change', (e) => {
    runAllFilterTogether();
});
function categoryFilterFunction(afterSortPriorityArray) {
    let categoryValue = selectCategoryRightElement.value;
    if (categoryValue !== '') {
        if (categoryRightArray.length === 0) {
            categoryRightArray.push(categoryValue);
        }
        else {
            if (categoryRightArray.indexOf(categoryValue) === -1) {
                categoryRightArray.push(categoryValue);
            }
        }
        filterTagContainerRight.innerHTML = '';
        if (categoryRightArray.length !== 0) {
            categoryRightArray.forEach((tag) => {
                createTagsRight(tag);
            });
            const afterTagsArray = afterSortPriorityArray.filter(task => task.category.some(category => categoryRightArray.indexOf(category) !== -1));
            return afterTagsArray;
        }
        else {
            return afterSortPriorityArray;
        }
    }
    else {
        return afterSortPriorityArray;
    }
    ;
}
selectPriorityElementRight.addEventListener('change', (e) => {
    runAllFilterTogether();
});
function sortByPriorityFunction(afterCompUncompArray) {
    const priorityValue = selectPriorityElementRight.value;
    if (priorityValue === 'Low-to-high') {
        afterCompUncompArray.sort((a, b) => b.sortValue - a.sortValue);
        return afterCompUncompArray;
    }
    else if (priorityValue === 'High-to-low') {
        afterCompUncompArray.sort((a, b) => a.sortValue - b.sortValue);
        return afterCompUncompArray;
    }
    else {
        return afterCompUncompArray;
    }
}
filterInputElementRight.addEventListener('change', () => {
    runAllFilterTogether();
});
function filterTaskFunction(afterSearchArray) {
    const filterValue = filterInputElementRight.value;
    if (filterValue === "Completed") {
        const completedTaskArray = afterSearchArray.filter(((task) => task.isChecked));
        return completedTaskArray;
    }
    else if (filterValue === "Uncompleted") {
        const completedTaskArray = afterSearchArray.filter(((task) => !task.isChecked));
        return completedTaskArray;
    }
    else {
        return afterSearchArray;
    }
}
function traverseCardsArray(allTaskArray) {
    taskContainerElement.innerHTML = '';
    allTaskArray.forEach((element) => {
        createCards(element);
    });
}
function createCards(element) {
    const singleTaskContainer = document.createElement('div');
    singleTaskContainer.className = 'taskContainer__singleTaskContainer';
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = element.isChecked;
    checkbox.className = 'taskContainer__singleTaskContainer--checkbox';
    singleTaskContainer.appendChild(checkbox);
    const middlePart = document.createElement('div');
    middlePart.className = 'taskContainer__singleTaskContainer__middle middlePart';
    const heading = document.createElement('h3');
    heading.className = 'middlePart--heading';
    heading.textContent = element.task;
    if (element.isChecked) {
        heading.classList.add('strikethrough');
    }
    else {
        heading.classList.remove('strikethrough');
    }
    middlePart.appendChild(heading);
    const datePriorityContainer = document.createElement('div');
    datePriorityContainer.className = 'middlePart__datePriorityContainer';
    if (element.sortValue === 0) {
        datePriorityContainer.classList.add('low-priority');
    }
    else if (element.sortValue === 1) {
        datePriorityContainer.classList.add('medium-priority');
    }
    else if (element.sortValue === 2) {
        datePriorityContainer.classList.add('high-priority');
    }
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
    element.category.forEach((category) => {
        const tag1 = document.createElement('div');
        tag1.className = 'middlePart__tagContainer--tag';
        tag1.textContent = category;
        tagContainer.appendChild(tag1);
    });
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
    deleteIcon.addEventListener('click', () => {
        const indexOfTaskInArray = alltaskArray.findIndex((task) => task.id === element.id);
        alltaskArray.splice(indexOfTaskInArray, 1);
        const striggifyArray = JSON.stringify(alltaskArray);
        localStorage.setItem('allTask', striggifyArray);
        singleTaskContainer.remove();
        runAllFilterTogether();
    });
    imgContainer.appendChild(deleteIcon);
    singleTaskContainer.appendChild(imgContainer);
    taskContainerElement.insertBefore(singleTaskContainer, taskContainerElement.firstChild);
    checkbox.addEventListener('click', () => {
        if (checkbox.checked) {
            heading.classList.add('strikethrough');
            const indexOfElementInAlltask = alltaskArray.findIndex((arr) => arr.id === element.id);
            alltaskArray[indexOfElementInAlltask].isChecked = true;
            let arr = JSON.stringify(alltaskArray);
            localStorage.setItem("allTask", arr);
        }
        else {
            heading.classList.remove('strikethrough');
            const indexOfElementInAlltask = alltaskArray.findIndex((arr) => arr.id === element.id);
            alltaskArray[indexOfElementInAlltask].isChecked = false;
            let arr = JSON.stringify(alltaskArray);
            localStorage.setItem("allTask", arr);
        }
    });
}
function createTag(tagName) {
    const tagContainer = document.createElement('div');
    tagContainer.classList.add('categoryContainer__inputContainer__tagContainer__tag', 'tag');
    const span = document.createElement('span');
    span.classList.add('tag--name');
    span.textContent = tagName;
    const icon = document.createElement('i');
    icon.classList.add('fa-regular', 'fa-circle-xmark', 'tag--cross');
    icon.addEventListener("click", () => {
        const indexOfCategory = categoryArray.indexOf(tagName);
        if (indexOfCategory !== -1) {
            categoryArray.splice(indexOfCategory, 1);
        }
        tagContainer.remove();
    });
    tagContainer.appendChild(span);
    tagContainer.appendChild(icon);
    tagsContainerElement.appendChild(tagContainer);
}
function createTagsRight(tagName) {
    const tagDiv = document.createElement('div');
    tagDiv.classList.add('filterContainer__tagcontainer__tags', 'tagRight');
    const tagNameSpan = document.createElement('span');
    tagNameSpan.classList.add('tagRight--name');
    tagNameSpan.textContent = tagName;
    const tagCrossIcon = document.createElement('i');
    tagCrossIcon.classList.add('fa-regular', 'fa-circle-xmark', 'tagRight--cross');
    tagCrossIcon.addEventListener("click", () => {
        const indexOfCategory = categoryRightArray.indexOf(tagName);
        if (indexOfCategory !== -1) {
            categoryRightArray.splice(indexOfCategory, 1);
        }
        catagoryDeleted = true;
        runAllFilterTogether();
        tagDiv.remove();
    });
    tagDiv.appendChild(tagNameSpan);
    tagDiv.appendChild(tagCrossIcon);
    filterTagContainerRight.appendChild(tagDiv);
}
function runAllFilterTogether() {
    const afterSearchArray = searchTaskFunction();
    const afterCompUncompArray = filterTaskFunction(afterSearchArray);
    const afterSortPriorityArray = sortByPriorityFunction(afterCompUncompArray);
    const afterCategoryArray = catagoryDeleted ? afterDeleetetagsCard(afterSortPriorityArray) : categoryFilterFunction(afterSortPriorityArray);
    traverseCardsArray(afterCategoryArray);
}
function afterDeleetetagsCard(afterSortPriorityArray) {
    filterTagContainerRight.innerHTML = '';
    if (categoryRightArray.length !== 0) {
        categoryRightArray.forEach((tag) => {
            createTagsRight(tag);
        });
        const afterTagsArray = afterSortPriorityArray.filter(task => task.category.some(category => categoryRightArray.indexOf(category) !== -1));
        catagoryDeleted = false;
        return afterTagsArray;
    }
    else {
        catagoryDeleted = false;
        return afterSortPriorityArray;
    }
}

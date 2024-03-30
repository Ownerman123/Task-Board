// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks"));
let nextId = JSON.parse(localStorage.getItem("nextId"));

const modal = $("#formModal");
const today = dayjs();
const todaysDate = $("#current-date");
todaysDate.text("Todays date is: " + dayjs(today).format("MM/D/YYYY"));



function generateTaskId() {
    const id = crypto.randomUUID();
    return id;

}

// Todo: create a function to create a task card
function createTaskCard(task) {

    const cardContainer = $('div').attr('data-task-id', task.id).addClass('fluid-container card task-card draggable my-3');

    const cardHeader = $('h5').addClass('card-header h4').text(task.title);

    const cardBody = $('div').addClass('card-body');
    
    const cardDescription = $('p').addClass('card-text').text(task.description);
    
    const cardDueDate = $('p').addClass('card-text').text(task.date);
    
    const cardBtn = $('button')
    .addClass('btn btn-danger delete')
    .text('Delete')
    .attr('data-task-id', task.id);
   

    if (task.dueDate && task.status !== 'done') {
        const now = dayjs();
        const taskDueDate = dayjs(task.dueDate, 'DD/MM/YYYY');
    }

    if (now.isSame(taskDueDate, 'day')) {
        cardContainer.addClass('bg-warning text-white');
      } else if (now.isAfter(taskDueDate)) {
        cardContainer.addClass('bg-danger text-white');
        cardBtn.addClass('border-light');
      }

      cardBody.append(cardDescription, cardDueDate, cardBtn);
      cardContainer.append(cardHeader, cardBody);
      return cardContainer;
   
    

}

// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {

}

// Todo: create a function to handle adding a new task
function handleAddTask(event){



}

// Todo: create a function to handle deleting a task
function handleDeleteTask(event){

}

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {

}

// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {
    renderTaskList();

    $('#due-date').datepicker({
        changeMonth: true,
        changeYear: true,
      });
    
      // ? Make lanes droppable
      $('.lane').droppable({
        accept: '.draggable',
        drop: handleDrop,
      });


});

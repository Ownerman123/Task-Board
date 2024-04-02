// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks"));
let nextId = JSON.parse(localStorage.getItem("nextId"));

const modal = $("#formModal");
const taskFormEl = $('#form-container');
const titleInputEl = $('#task');
const dueDateInputEl = $('#due-date');
const descriptionInputEl = $('#task-desc');
const submitBtn = $('#submit-btn');

const today = dayjs();
const todaysDate = $("#current-date");
todaysDate.text("Todays date is: " + dayjs(today).format("MM/D/YYYY"));



function generateTaskId() {
    const id = crypto.randomUUID();
    return id;

}

function readTasksInStorage() {
  
  
  let tasks = JSON.parse(localStorage.getItem('tasks'));

  
  if (!tasks) {
    tasks = [];
  }

  
  return tasks;
}

function saveTasksToStorage(tasks) {

  localStorage.setItem('tasks', JSON.stringify(tasks));

  

}

// Todo: create a function to create a task card
function createTaskCard(task) {

    const cardContainer = $('<div>').attr('data-task-id', task.id).attr('data-task-status', task.status).addClass('fluid-container card task-card draggable my-3');

    const cardHeader = $('<h5>').addClass('card-header h4').text(task.title);

    const cardBody = $('<div>').addClass('card-body');
    
    const cardDescription = $('<p>').addClass('card-text').text(task.description);
    
    const cardDueDate = $('<p>').addClass('card-text').text(task.date);
    
    const cardBtn = $('<button>')
    .addClass('btn btn-danger delete')
    .text('Delete')
    .attr('data-task-id', task.id);
   

    

    if (today.isSame(task.date, 'day')) {
        cardContainer.addClass('bg-warning text-white');
      } else if (today.isAfter(task.dueDate)) {
        cardContainer.addClass('bg-danger text-white');
        cardBtn.addClass('border-light');
      }

    if (task.status === 'done') {
        cardContainer.removeClass('bg-warning')
        cardContainer.addClass('bg-success text-white');
        cardBtn.addClass('border-light');
    }

      cardBtn.on('click', handleDeleteTask)

      cardBody.append(cardDescription, cardDueDate, cardBtn);
      cardContainer.append(cardHeader, cardBody);
      return cardContainer;
   
    

}

// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {

  const tasks = readTasksInStorage();
  
  const todoList = $('#todo-cards');
  todoList.empty();

  const inProgressList = $('#in-progress-cards');
  inProgressList.empty();

  const doneList = $('#done-cards');
  doneList.empty();

  for (let task of tasks) {
    if (task.status === 'to-do') {
      todoList.append(createTaskCard(task));
    } else if (task.status === 'in-progress') {
      inProgressList.append(createTaskCard(task));
    } else if (task.status === 'done') {
      doneList.append(createTaskCard(task));
    }
  }

  $('.draggable').draggable({
    opacity: 0.7,
    zIndex: 100,
    
    helper: function (e) {
      
      const original = $(e.target).hasClass('ui-draggable')
        ? $(e.target)
        : $(e.target).closest('.ui-draggable');
      
      return original.clone().css({
        width: original.outerWidth(),
      });
    },
  });



}

// Todo: create a function to handle adding a new task
function handleAddTask(event){

  event.preventDefault()
  console.log('task being handled baby')

  const taskTitle = titleInputEl.val().trim();
  const taskDescription = descriptionInputEl.val(); 
  const taskDueDate = dueDateInputEl.val(); 

  const newTask = {
        
    id: generateTaskId(),
    title: taskTitle,
    description: taskDescription,
    date: taskDueDate,
    status: 'to-do',
  }

  const tasks = readTasksInStorage();
  tasks.push(newTask);
  saveTasksToStorage(tasks);
  renderTaskList();

  // clear inputs
  titleInputEl.val('');
  descriptionInputEl.val('');
  dueDateInputEl.val('');  

}

// Todo: create a function to handle deleting a task
function handleDeleteTask(event){
  const taskId = $(this).attr('data-task-id');
  const tasks = readTasksInStorage();

  // ? Remove project from the array. There is a method called `filter()` for this that is better suited which we will go over in a later activity. For now, we will use a `forEach()` loop to remove the project.
  tasks.forEach((task) => {
    if (task.id === taskId) {
      tasks.splice(tasks.indexOf(task), 1);
    }
  });

  // ? We will use our helper function to save the projects to localStorage
  saveTasksToStorage(tasks);

  // ? Here we use our other function to print projects back to the screen
 renderTaskList();
}

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {
  const tasks = readTasksInStorage();
  

  // ? Get the project id from the event
  const taskId = ui.draggable[0].dataset.taskId;

  // ? Get the id of the lane that the card was dropped into
  const newStatus = event.target.id;

  for (let task of tasks) {
    // ? Find the project card by the `id` and update the project status.
    if (task.id === taskId) {
      task.status = newStatus;
    }
  }
  // ? Save the updated projects array to localStorage (overwritting the previous one) and render the new project data to the screen.
  saveTasksToStorage(tasks);
    renderTaskList();

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

submitBtn.on('click', handleAddTask);

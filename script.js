// script.js

import { grades } from './grades.js';
// Import the CSV functions
import { exportDataToCSV, importDataFromCSV } from './csv_functions.js';

// DEV toggle: set to 1 to show import/export menu, 0 to hide
const DEV = 1; // Default is 1

// Grading system preference: default to 'French' grading system
let gradingSystem = 'French'; // Default to French

// Load Grading System Preference from local storage
function loadGradingSystemPreference() {
  const storedPreference = localStorage.getItem('gradingSystem');
  if (storedPreference) {
    gradingSystem = storedPreference;
  } else {
    gradingSystem = 'French'; // Ensure default is French if no preference is stored
    saveGradingSystemPreference();
  }
}

// Save Grading System Preference to local storage
function saveGradingSystemPreference() {
  localStorage.setItem('gradingSystem', gradingSystem);
}

// Get Grade Name based on grade ID and type
function getGradeName(gradeId, type) {
  // Find the grade object by id and type
  let gradeObj = grades.find(g => g.id === gradeId && g.type === type);

  if (!gradeObj) return '-';

  // Return the grade name in the current grading system
  return gradingSystem === 'American' ? gradeObj.american : gradeObj.french;
}

// Get Converted Grade Name from original grading system to current grading system
function getConvertedGradeName(gradeId, type, originalGradingSystem) {
  const targetGradingSystem = gradingSystem;

  // Find the grade object by id, type, and originalGradingSystem
  let gradeObj = grades.find(
    g =>
      g.id === gradeId &&
      g.type === type &&
      g.original.toLowerCase() === originalGradingSystem.toLowerCase()
  );

  if (!gradeObj) return '-';

  // Return the grade name in the target grading system
  return targetGradingSystem === 'American' ? gradeObj.american : gradeObj.french;
}

// State Variables
let selectedDate = new Date(); // Currently selected date
let currentMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1); // First day of the current month
let workouts = []; // Array to store workouts
let currentWorkout = null; // Currently editing or creating workout
let editingWorkoutId = null; // ID of the workout being edited
let selectedWorkoutType = null; // Type of workout selected ('Bouldering' or 'Sport Climbing')

// Initialize App when the DOM content is loaded
document.addEventListener('DOMContentLoaded', () => {
  loadGradingSystemPreference(); // Load grading system preference
  loadWorkoutsFromStorage(); // Load workouts from local storage
  migrateWorkoutData(); // Migrate old workout data if necessary
  renderCalendar(); // Render the calendar UI
  updateStatistics(); // Update the statistics UI
  setupEventListeners(); // Set up event listeners for user interactions

  // Set the grading system toggle based on the preference
  const gradingSystemToggle = document.getElementById('gradingSystemToggle');
  gradingSystemToggle.checked = gradingSystem === 'French';

  // Show or hide import/export menu items based on DEV toggle
  if (DEV === 1) {
    document.getElementById('exportDataItem').style.display = 'flex';
    document.getElementById('importDataItem').style.display = 'flex';
    document.getElementById('randomizeItem').style.display = 'flex'; // Add this line
  } else {
    document.getElementById('exportDataItem').style.display = 'none';
    document.getElementById('importDataItem').style.display = 'none';
    document.getElementById('randomizeItem').style.display = 'none'; // Add this line
  }
});

// Data Migration Function to update old workout data structures
function migrateWorkoutData() {
  workouts.forEach(workout => {
    workout.grades.forEach(gradeEntry => {
      if (gradeEntry.gradeId && !gradeEntry.type) {
        // If the 'type' property is missing, find the grade object to fill in missing data
        const gradeObj = grades.find(g => g.id === gradeEntry.gradeId);
        if (gradeObj) {
          // Assign missing properties if necessary
          gradeEntry.type = gradeObj.type;
          gradeEntry.originalGradingSystem = gradeObj.original;
        }
      }
    });
  });
}

// Function to render the calendar UI
function renderCalendar() {
  const calendarEl = document.getElementById('calendar');
  const monthYearEl = document.getElementById('month-year');
  calendarEl.innerHTML = ''; // Clear existing calendar

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  // Adjusted for week starting on Monday
  let firstDayIndex = new Date(year, month, 1).getDay() - 1;
  if (firstDayIndex < 0) firstDayIndex = 6; // Adjust for Sunday

  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Set month and year in the UI
  const monthNames = [
    "January", "February", "March", "April", "May", "June", "July",
    "August", "September", "October", "November", "December"
  ];
  monthYearEl.textContent = `${monthNames[month]} ${year}`;

  // Days of the week headers starting from Monday
  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  daysOfWeek.forEach(dayName => {
    const dayEl = document.createElement('div');
    dayEl.classList.add('day-name');
    dayEl.textContent = dayName;
    calendarEl.appendChild(dayEl);
  });

  const prevMonthDays = new Date(year, month, 0).getDate(); // Days in previous month
  const totalCells = 42; // Total cells in the calendar grid

  // Add days from previous month
  for (let x = firstDayIndex; x > 0; x--) {
    const dayEl = document.createElement('div');
    dayEl.classList.add('day', 'other-month');
    dayEl.textContent = prevMonthDays - x + 1;
    calendarEl.appendChild(dayEl);
  }

  // Add days of the current month
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    const dayEl = document.createElement('div');
    dayEl.classList.add('day');
    dayEl.textContent = day;

    if (isToday(date)) {
      dayEl.classList.add('today'); // Highlight today's date
    }

    if (isSameDate(date, selectedDate)) {
      dayEl.classList.add('selected'); // Highlight selected date
    }

    // Add workout indicator if workouts exist on that date
    const dayWorkouts = workouts.filter(w => isSameDate(w.date, date));

    if (dayWorkouts.length > 0) {
      const indicator = document.createElement('div');
      indicator.classList.add('workout-indicator');

      // Get unique workout types for the day
      const workoutTypes = [...new Set(dayWorkouts.map(w => w.type))];

      workoutTypes.forEach(type => {
        const dot = document.createElement('div');
        dot.classList.add('indicator-dot');
        if (type === 'Bouldering') {
          dot.classList.add('bouldering-dot'); // Style for bouldering
        } else {
          dot.classList.add('sport-climbing-dot'); // Style for sport climbing
        }
        indicator.appendChild(dot);
      });

      dayEl.appendChild(indicator); // Add indicator to day element
    }

    // Add click event to day element
    dayEl.addEventListener('click', () => {
      selectedDate = date;
      renderCalendar();
      onDateSelect(); // Handle date selection
    });

    calendarEl.appendChild(dayEl);
  }

  // Calculate remaining cells to fill the calendar grid
  const totalFilledCells = firstDayIndex + daysInMonth;
  const remainingCells = totalCells - totalFilledCells;

  // Add days from next month
  for (let i = 1; i <= remainingCells; i++) {
    const dayEl = document.createElement('div');
    dayEl.classList.add('day', 'other-month');
    dayEl.textContent = i;
    calendarEl.appendChild(dayEl);
  }
}

// Helper functions to compare dates
function isToday(date) {
  const today = new Date();
  return isSameDate(date, today);
}

function isSameDate(d1, d2) {
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
}

// Check if a date is within a given month
function isSameDateMonth(date, startOfMonth, endOfMonth) {
  return date >= startOfMonth && date <= endOfMonth;
}

// Event when a date is selected on the calendar
function onDateSelect() {
  const existingWorkouts = workouts.filter(w => isSameDate(w.date, selectedDate));
  if (existingWorkouts.length > 0) {
    showWorkoutSummary(); // Show summary if workouts exist
  } else {
    openModal('workout-type-modal'); // Open workout type selection modal
  }
}

// Modal functions to open and close modals
function openModal(modalId) {
  document.getElementById(modalId).style.display = 'block';
}

function closeModal(modalId) {
  document.getElementById(modalId).style.display = 'none';
}

function requestStoragePermissions(callback) {
  if (window.cordova && cordova.plugins.permissions) {
      var permissions = cordova.plugins.permissions;
      permissions.hasPermission(permissions.WRITE_EXTERNAL_STORAGE, function(status) {
          if (status.hasPermission) {
              callback();
          } else {
              permissions.requestPermission(permissions.WRITE_EXTERNAL_STORAGE, function(status) {
                  if (status.hasPermission) {
                      callback();
                  } else {
                      alert('Storage permission is required to export/import data.');
                  }
              }, function() {
                  alert('Storage permission is required to export/import data.');
              });
          }
      }, null);
  } else {
      // No permissions plugin available or not in Cordova
      callback();
  }
}

// Setup Event Listeners for user interactions
function setupEventListeners() {
  // Close modals when close buttons are clicked
  document.querySelectorAll('.close-button').forEach(button => {
    button.addEventListener('click', (e) => {
      const modalId = e.target.getAttribute('data-close');
      closeModal(modalId);
    });
  });

 // Randomize Data (DEV only)
 document.getElementById('randomizeItem').addEventListener('click', () => {
  generateRandomData();
  document.getElementById('sideMenu').classList.remove('open');
});


  // Workout Type Selection with Single Session per Type per Day
  document.getElementById('select-bouldering').addEventListener('click', () => {
    const existingWorkout = workouts.find(
      w => isSameDate(w.date, selectedDate) && w.type === 'Bouldering'
    );
    if (existingWorkout) {
      if (confirm('A Bouldering session already exists on this date. Do you want to edit it?')) {
        editWorkout(existingWorkout); // Edit existing workout
      } else {
        closeModal('workout-type-modal');
      }
    } else {
      editingWorkoutId = null; // Ensure we're adding a new workout
      selectedWorkoutType = 'Bouldering';
      closeModal('workout-type-modal');
      openGradeSelectionModal(); // Open grade selection modal
    }
  });

  document.getElementById('select-sport-climbing').addEventListener('click', () => {
    const existingWorkout = workouts.find(
      w => isSameDate(w.date, selectedDate) && w.type === 'Sport Climbing'
    );
    if (existingWorkout) {
      if (confirm('A Sport Climbing session already exists on this date. Do you want to edit it?')) {
        editWorkout(existingWorkout); // Edit existing workout
      } else {
        closeModal('workout-type-modal');
      }
    } else {
      editingWorkoutId = null; // Ensure we're adding a new workout
      selectedWorkoutType = 'Sport Climbing';
      closeModal('workout-type-modal');
      openGradeSelectionModal(); // Open grade selection modal
    }
  });

  // Save Workout when the save button is clicked
  document.getElementById('save-workout-button').addEventListener('click', saveWorkout);

  // Add Another Workout from the summary modal
  document.getElementById('add-another-workout-button').addEventListener('click', () => {
    closeModal('workout-summary-modal');
    openModal('workout-type-modal');
  });

  // Tabs navigation
  document.querySelectorAll('.tab-button').forEach(button => {
    button.addEventListener('click', (e) => {
      const tab = e.target.getAttribute('data-tab');
      switchTab(tab); // Switch to the selected tab
    });
  });

  // Month Navigation in the calendar
  document.getElementById('prev-month').addEventListener('click', () => {
    currentMonth.setMonth(currentMonth.getMonth() - 1); // Go to previous month
    renderCalendar();
    updateStatistics();
  });

  document.getElementById('next-month').addEventListener('click', () => {
    currentMonth.setMonth(currentMonth.getMonth() + 1); // Go to next month
    renderCalendar();
    updateStatistics();
  });

  // Burger Menu Toggle for mobile view
  document.getElementById('burgerMenu').addEventListener('click', () => {
    document.getElementById('sideMenu').classList.toggle('open');
  });

  // Close the menu when clicking outside
  document.addEventListener('click', (e) => {
    const sideMenu = document.getElementById('sideMenu');
    const burgerMenu = document.getElementById('burgerMenu');
    if (!sideMenu.contains(e.target) && !burgerMenu.contains(e.target)) {
      sideMenu.classList.remove('open');
    }
  });

  // Grading System Toggle (French/American)
  document.getElementById('gradingSystemToggle').addEventListener('change', (e) => {
    gradingSystem = e.target.checked ? 'French' : 'American';
    saveGradingSystemPreference();
    renderCalendar();
    updateStatistics();
  });

      // Export Data to CSV file
      document.getElementById('exportDataItem').addEventListener('click', () => {
        if (window.cordova) {
            requestStoragePermissions(() => {
                exportDataToCSV(workouts, grades);
                document.getElementById('sideMenu').classList.remove('open');
            });
        } else {
            exportDataToCSV(workouts, grades);
            document.getElementById('sideMenu').classList.remove('open');
        }
    });

    // Import Data from CSV file
    document.getElementById('importDataItem').addEventListener('click', () => {
        if (window.cordova) {
            requestStoragePermissions(() => {
                importDataFromCSV(workouts, grades, saveWorkoutsToStorage, renderCalendar, updateStatistics);
                document.getElementById('sideMenu').classList.remove('open');
            });
        } else {
            importDataFromCSV(workouts, grades, saveWorkoutsToStorage, renderCalendar, updateStatistics);
            document.getElementById('sideMenu').classList.remove('open');
        }
    });


  // Grade Conversion Menu Item
  document.getElementById('gradeConversionItem').addEventListener('click', () => {
    window.open('grade_conversion.html', '_blank'); // Open grade conversion page
    document.getElementById('sideMenu').classList.remove('open');
  });
}

// Switch between tabs in the statistics section
function switchTab(tab) {
  // Remove 'active' class from all tab buttons and contents
  document.querySelectorAll('.tab-button').forEach(button => {
    button.classList.remove('active');
  });
  document.querySelectorAll('.tab-content').forEach(content => {
    content.classList.remove('active');
  });

  // Add 'active' class to selected tab button and content
  document.querySelector(`.tab-button[data-tab="${tab}"]`).classList.add('active');
  document.getElementById(`${tab}-stats`).classList.add('active');
}

// Open Grade Selection Modal for adding/editing workout grades
function openGradeSelectionModal() {
  if (editingWorkoutId) {
    // Deep copy the existing workout to avoid modifying the original before saving
    currentWorkout = JSON.parse(JSON.stringify(workouts.find(w => w.id === editingWorkoutId)));
    // Convert date strings back to Date objects
    currentWorkout.date = new Date(currentWorkout.date);
  } else {
    // Initialize a new workout object
    currentWorkout = {
      id: Date.now().toString(), // Unique ID based on current time
      date: selectedDate,
      type: selectedWorkoutType,
      grades: []
    };
  }

  const gradeModalTitle = document.getElementById('grade-modal-title');
  gradeModalTitle.textContent = `${selectedWorkoutType} Workout`;

  const gradeList = document.getElementById('grade-list');
  gradeList.innerHTML = ''; // Clear existing grade items

  // Get grades for the selected workout type and grading system
  const gradeOptions = grades.filter(
    g => g.type === selectedWorkoutType && g.original.toLowerCase() === gradingSystem.toLowerCase()
  );

  // Map existing grades by gradeId for quick lookup
  const existingGradesMap = {};
  currentWorkout.grades.forEach(grade => {
    if (grade.originalGradingSystem === gradingSystem) {
      existingGradesMap[grade.gradeId] = grade;
    }
  });

  // Prepare an array to hold updated grades in the current grading system
  const updatedGrades = [];

  gradeOptions.forEach((gradeObj) => {
    // Use existing grade data if available
    let gradeData = existingGradesMap[gradeObj.id] || {
      gradeId: gradeObj.id,
      type: gradeObj.type,
      originalGradingSystem: gradingSystem,
      attempts: 0,
      sends: 0,
      flashesOnsights: 0
    };

    // Add gradeData to updatedGrades
    updatedGrades.push(gradeData);

    // Create gradeItem element
    const gradeItem = document.createElement('div');
    gradeItem.classList.add('grade-item', 'closed'); // Start as closed

    // Set background color and text color from gradeObj
    gradeItem.style.backgroundColor = gradeObj.backgroundColor || '#ffffff';
    gradeItem.style.color = gradeObj.color || '#000000';

    // Grade Header
    const gradeHeader = document.createElement('div');
    gradeHeader.classList.add('grade-header');
    gradeHeader.innerHTML = `
      <span class="grade-title">${getGradeName(gradeObj.id, gradeObj.type)}</span>
      <i class="fas fa-chevron-down toggle-icon"></i>
    `;
    gradeItem.appendChild(gradeHeader);

    // Grade Controls (Initially hidden)
    const gradeControls = document.createElement('div');
    gradeControls.classList.add('grade-controls');
    gradeControls.style.display = 'none'; // Start hidden

    // Create control groups for Attempts, Sends, Flashes/Onsights
    const labels = ['Attempts', 'Sends', selectedWorkoutType === 'Bouldering' ? 'Flashes' : 'Onsights'];
    const countElements = []; // To store the count display elements

    labels.forEach((label) => {
      const controlGroup = document.createElement('div');
      controlGroup.classList.add('control-group');

      const gradeLabel = document.createElement('span');
      gradeLabel.classList.add('grade-label');
      gradeLabel.textContent = label;

      const gradeInput = document.createElement('div');
      gradeInput.classList.add('grade-input');

      const decrementButton = document.createElement('button');
      decrementButton.classList.add('control-button', 'styled-button');
      decrementButton.textContent = '-';
      decrementButton.type = 'button'; // Ensure type is button

      const countDisplay = document.createElement('span');
      countDisplay.classList.add('count-display');

      // Determine the field type based on label
      let fieldType;
      if (label === 'Attempts') {
        fieldType = 'attempts';
      } else if (label === 'Sends') {
        fieldType = 'sends';
      } else {
        fieldType = 'flashesOnsights'; // 'Flashes' or 'Onsights'
      }

      // Set countDisplay.textContent to the existing value in gradeData
      countDisplay.textContent = gradeData[fieldType] || '0';

      const incrementButton = document.createElement('button');
      incrementButton.classList.add('control-button', 'styled-button');
      incrementButton.textContent = '+';
      incrementButton.type = 'button'; // Ensure type is button

      gradeInput.appendChild(decrementButton);
      gradeInput.appendChild(countDisplay);
      gradeInput.appendChild(incrementButton);

      controlGroup.appendChild(gradeLabel);
      controlGroup.appendChild(gradeInput);
      gradeControls.appendChild(controlGroup);

      countElements.push(countDisplay);

      // Event Listeners for Increment/Decrement buttons
      decrementButton.addEventListener('click', () => {
        let currentValue = parseInt(countDisplay.textContent) || 0;
        countDisplay.textContent = Math.max(0, currentValue - 1);
        updateGradeData(fieldType, gradeData, countElements);
      });

      incrementButton.addEventListener('click', () => {
        let currentValue = parseInt(countDisplay.textContent) || 0;
        countDisplay.textContent = currentValue + 1;
        updateGradeData(fieldType, gradeData, countElements);
      });
    });

    // Error Message display
    const errorMessage = document.createElement('div');
    errorMessage.classList.add('error-message');
    gradeControls.appendChild(errorMessage);

    gradeItem.appendChild(gradeControls);
    gradeList.appendChild(gradeItem);

    // Event Listener for Grade Header Click (Expand/Collapse)
    gradeHeader.addEventListener('click', () => {
      const isClosed = gradeItem.classList.toggle('closed');
      gradeControls.style.display = isClosed ? 'none' : 'block';
    });

    // Update Grade Data Function to keep counts consistent
    function updateGradeData(changedField, gradeData, countElements) {
      let attempts = parseInt(countElements[0].textContent) || 0;
      let sends = parseInt(countElements[1].textContent) || 0;
      let flashesOnsights = parseInt(countElements[2].textContent) || 0;

      if (changedField === 'flashesOnsights') {
        if (flashesOnsights > sends) {
          sends = flashesOnsights;
          countElements[1].textContent = sends;
        }
        if (sends > attempts) {
          attempts = sends;
          countElements[0].textContent = attempts;
        }
      } else if (changedField === 'sends') {
        if (sends > attempts) {
          attempts = sends;
          countElements[0].textContent = attempts;
        }
        if (sends < flashesOnsights) {
          flashesOnsights = sends;
          countElements[2].textContent = flashesOnsights;
        }
      } else if (changedField === 'attempts') {
        if (attempts < sends) {
          sends = attempts;
          countElements[1].textContent = sends;
        }
        if (sends < flashesOnsights) {
          flashesOnsights = sends;
          countElements[2].textContent = flashesOnsights;
        }
      }

      gradeData.attempts = attempts;
      gradeData.sends = sends;
      gradeData.flashesOnsights = flashesOnsights;

      validateInputs();
    }

    // Validation Function to check for logical inconsistencies
    function validateInputs() {
      let error = '';
      if (gradeData.sends > gradeData.attempts) {
        error = 'Sends cannot exceed attempts.';
      }
      if (gradeData.flashesOnsights > gradeData.sends) {
        error = `${selectedWorkoutType === 'Bouldering' ? 'Flashes' : 'Onsights'} cannot exceed sends.`;
      }
      errorMessage.textContent = error;
    }
  });

  // Store updated grades in a temporary property
  currentWorkout.updatedGrades = updatedGrades;

  openModal('grade-selection-modal');
}

// Save Workout data after editing or creating
function saveWorkout() {
  // Filter out grades with zero attempts
  const updatedGrades = currentWorkout.updatedGrades.filter(g => g.attempts > 0);

  // Validate all grades
  for (let grade of updatedGrades) {
    if (grade.sends > grade.attempts) {
      const gradeName = getGradeName(grade.gradeId, grade.type);
      alert(`For grade ${gradeName}, sends cannot exceed attempts.`);
      return;
    }
    if (grade.flashesOnsights > grade.sends) {
      const gradeName = getGradeName(grade.gradeId, grade.type);
      alert(`For grade ${gradeName}, flashes/onsights cannot exceed sends.`);
      return;
    }
  }

  if (editingWorkoutId) {
    // Editing an existing workout
    let existingWorkoutIndex = workouts.findIndex(w => w.id === editingWorkoutId);
    if (existingWorkoutIndex !== -1) {
      // Merge grades
      let existingWorkout = workouts[existingWorkoutIndex];

      // Remove grades in current grading system
      existingWorkout.grades = existingWorkout.grades.filter(
        grade => grade.originalGradingSystem !== gradingSystem
      );

      // Add updated grades
      existingWorkout.grades = existingWorkout.grades.concat(updatedGrades);

      if (existingWorkout.grades.length === 0) {
        // No grades left, cannot save an empty workout
        alert('Cannot save a session with no attempts. Please add at least one attempt.');
        return;
      } else {
        // Ensure existingWorkout.date is a Date object
        if (!(existingWorkout.date instanceof Date)) {
          existingWorkout.date = new Date(existingWorkout.date);
        }
        workouts[existingWorkoutIndex] = existingWorkout;
      }
    }
    editingWorkoutId = null;
  } else {
    // Creating a new workout
    if (updatedGrades.length === 0) {
      // No grades to save, do not add the workout
      alert('Cannot save a session with no attempts. Please add at least one attempt.');
      return;
    } else {
      currentWorkout.grades = updatedGrades;

      // Ensure currentWorkout.date is a Date object
      if (!(currentWorkout.date instanceof Date)) {
        currentWorkout.date = new Date(currentWorkout.date);
      }
      workouts.push(currentWorkout);
    }
  }

  saveWorkoutsToStorage(); // Save workouts to local storage
  closeModal('grade-selection-modal');
  currentWorkout = null;
  renderCalendar(); // Re-render calendar to reflect changes
  updateStatistics(); // Update statistics
}

// Show Workout Summary for a selected date
function showWorkoutSummary() {
  const summaryContent = document.getElementById('workout-summary-content');
  summaryContent.innerHTML = ''; // Clear existing content

  const dayWorkouts = workouts.filter(w => isSameDate(w.date, selectedDate));

  dayWorkouts.forEach(workout => {
    // Create the workout summary card
    const card = document.createElement('div');
    card.classList.add('card');

    // Set card background to light gray
    card.style.backgroundColor = '#f3f4f6';

    // Create card content container
    const cardContent = document.createElement('div');
    cardContent.classList.add('card-content');

    // Header row with date and action buttons
    const headerRow = document.createElement('div');
    headerRow.classList.add('header-row');

    const dateDiv = document.createElement('div');
    dateDiv.classList.add('date');
    dateDiv.innerHTML = `${workout.type} <br> ${workout.date.toDateString()}`;
    headerRow.appendChild(dateDiv);

    const buttonContainer = document.createElement('div');

    // Edit Button
    const editButton = document.createElement('button');
    editButton.classList.add('icon-button');
    editButton.innerHTML = `
      <!-- Edit Icon -->
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
      </svg>
    `;
    editButton.addEventListener('click', () => {
      editWorkout(workout); // Edit the workout
    });
    buttonContainer.appendChild(editButton);

    // Delete Button
    const deleteButton = document.createElement('button');
    deleteButton.classList.add('icon-button', 'delete');
    deleteButton.innerHTML = `
      <!-- Delete Icon -->
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="3 6 5 6 21 6"></polyline>
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
      </svg>
    `;
    deleteButton.addEventListener('click', () => {
      // Confirmation dialog before deleting
      if (confirm('Are you sure you want to delete this workout?')) {
        deleteWorkout(workout.id); // Delete the workout
      }
    });
    buttonContainer.appendChild(deleteButton);

    headerRow.appendChild(buttonContainer);
    cardContent.appendChild(headerRow);

    // Stats Grid showing total attempts, sends, flashes/onsights
    const statsGrid = document.createElement('div');
    statsGrid.classList.add('stats-grid');

    // Calculate total attempts, sends, flashes/onsights for the workout
    const totalAttempts = workout.grades.reduce((sum, grade) => sum + grade.attempts, 0);
    const totalSends = workout.grades.reduce((sum, grade) => sum + grade.sends, 0);
    const totalFlashesOnsights = workout.grades.reduce((sum, grade) => sum + grade.flashesOnsights, 0);

    // Stat Item: Attempts
    const attemptsStat = document.createElement('div');
    attemptsStat.classList.add('stat-item');
    const attemptsLabel = document.createElement('div');
    attemptsLabel.classList.add('stat-label');
    attemptsLabel.textContent = 'Attempts';
    const attemptsValue = document.createElement('div');
    attemptsValue.classList.add('stat-value');
    attemptsValue.textContent = totalAttempts;
    attemptsStat.appendChild(attemptsLabel);
    attemptsStat.appendChild(attemptsValue);
    statsGrid.appendChild(attemptsStat);

    // Stat Item: Sends
    const sendsStat = document.createElement('div');
    sendsStat.classList.add('stat-item');
    const sendsLabel = document.createElement('div');
    sendsLabel.textContent = 'Sends';
    sendsLabel.classList.add('stat-label');
    const sendsValue = document.createElement('div');
    sendsValue.classList.add('stat-value');
    sendsValue.textContent = totalSends;
    sendsStat.appendChild(sendsLabel);
    sendsStat.appendChild(sendsValue);
    statsGrid.appendChild(sendsStat);

    // Stat Item: Flashes or Onsights
    const flashesOnsightsStat = document.createElement('div');
    flashesOnsightsStat.classList.add('stat-item');
    const flashesOnsightsLabel = document.createElement('div');
    flashesOnsightsLabel.classList.add('stat-label');
    flashesOnsightsLabel.textContent = workout.type === 'Bouldering' ? 'Flashes' : 'Onsights';
    const flashesOnsightsValue = document.createElement('div');
    flashesOnsightsValue.classList.add('stat-value');
    flashesOnsightsValue.textContent = totalFlashesOnsights;
    flashesOnsightsStat.appendChild(flashesOnsightsLabel);
    flashesOnsightsStat.appendChild(flashesOnsightsValue);
    statsGrid.appendChild(flashesOnsightsStat);

    cardContent.appendChild(statsGrid);

    // Sort the grades from easiest to hardest
    workout.grades.sort((a, b) => {
      // Get the grade objects for comparison
      const gradeObjA = grades.find(
        g =>
          g.id === a.gradeId &&
          g.type === a.type &&
          g.original.toLowerCase() === a.originalGradingSystem.toLowerCase()
      );
      const gradeObjB = grades.find(
        g =>
          g.id === b.gradeId &&
          g.type === b.type &&
          g.original.toLowerCase() === b.originalGradingSystem.toLowerCase()
      );

      // Extract grade values, default to 0 if not found
      const gradeValueA = gradeObjA ? gradeObjA.gradeValue : 0;
      const gradeValueB = gradeObjB ? gradeObjB.gradeValue : 0;

      // Compare the grade values
      return gradeValueA - gradeValueB;
    });

    // For each grade, create difficulty-level div
    workout.grades.forEach(grade => {
      const difficultyLevel = document.createElement('div');
      difficultyLevel.classList.add('difficulty-level');

      // Set rounded corners and shadow
      difficultyLevel.style.borderRadius = '8px';
      difficultyLevel.style.boxShadow = '0 1px 2px rgba(0, 0, 0, 0.1)';
      difficultyLevel.style.backgroundColor = '#ffffff'; // White background

      const difficultyHeader = document.createElement('div');
      difficultyHeader.classList.add('difficulty-header');

      // Get the grade object
      const gradeObj = grades.find(
        g =>
          g.id === grade.gradeId &&
          g.type === grade.type &&
          g.original.toLowerCase() === grade.originalGradingSystem.toLowerCase()
      );

      const gradeSpan = document.createElement('span');
      gradeSpan.classList.add('grade');
      let gradeName = getConvertedGradeName(grade.gradeId, grade.type, grade.originalGradingSystem);
      gradeSpan.textContent = gradeName;

      // Only color the grade name
      if (gradeObj) {
        gradeSpan.style.color = gradeObj.color || '#000000';
      }

      difficultyHeader.appendChild(gradeSpan);

      const difficultyStats = document.createElement('div');
      difficultyStats.classList.add('difficulty-stats');

      // Create stats icons and values
      // Attempts icon and value
      const attemptsStat = document.createElement('div');
      attemptsStat.classList.add('stat');
      attemptsStat.innerHTML = `
        <!-- Attempts Icon -->
        <img src="icons/attempt.svg" width="16" height="16" alt="Attempts icon">
        <span class="stat-text">${grade.attempts}</span>
      `;
      difficultyStats.appendChild(attemptsStat);

      // Sends icon and value
      const sendsStat = document.createElement('div');
      sendsStat.classList.add('stat');
      sendsStat.innerHTML = `
        <!-- Sends Icon -->
        <img src="icons/check.svg" width="16" height="16" alt="Sends icon">
        <span class="stat-text">${grade.sends}</span>
      `;
      difficultyStats.appendChild(sendsStat);

      // Flashes/Onsights icon and value (only if value is greater than zero)
      if (grade.flashesOnsights) {
        const flashesOnsightsStat = document.createElement('div');
        flashesOnsightsStat.classList.add('stat');
        flashesOnsightsStat.innerHTML = `
          <!-- Flashes/Onsights Icon -->
          <img src="icons/flash.svg" width="16" height="16" alt="Flash icon">
          <span class="stat-text">${grade.flashesOnsights}</span>
        `;
        difficultyStats.appendChild(flashesOnsightsStat);
      }

      difficultyHeader.appendChild(difficultyStats);
      difficultyLevel.appendChild(difficultyHeader);
      cardContent.appendChild(difficultyLevel);
    });

    card.appendChild(cardContent);
    summaryContent.appendChild(card);
  });

  // Update the 'Add Another Workout' button state
  const addAnotherWorkoutButton = document.getElementById('add-another-workout-button');
  if (dayWorkouts.length >= 2) {
    // Both sessions exist, disable the button
    addAnotherWorkoutButton.disabled = true;
    addAnotherWorkoutButton.textContent = 'All Sessions Added';
  } else {
    addAnotherWorkoutButton.disabled = false;
    addAnotherWorkoutButton.textContent = 'Add Another Workout';
  }

  openModal('workout-summary-modal');
}


// Edit Workout by opening the grade selection modal with existing data
function editWorkout(workout) {
  editingWorkoutId = workout.id;
  selectedWorkoutType = workout.type;
  closeModal('workout-summary-modal');
  openGradeSelectionModal();
}

// Delete Workout from the workouts array and update UI
function deleteWorkout(workoutId) {
  // Confirmation dialog before deleting
  workouts = workouts.filter(w => w.id !== workoutId);
  saveWorkoutsToStorage();
  renderCalendar();
  updateStatistics();
  showWorkoutSummary();
}

// Update Statistics in the statistics section
function updateStatistics() {
  const boulderingStatsEl = document.getElementById('bouldering-stats-content');
  const sportClimbingStatsEl = document.getElementById('sport-climbing-stats-content');

  boulderingStatsEl.innerHTML = ''; // Clear existing stats
  sportClimbingStatsEl.innerHTML = '';

  const monthlyStats = calculateMonthlyStats(currentMonth.getFullYear(), currentMonth.getMonth());

  // Calculate progression stats for the last three months
  const progressionStats = calculateProgressionStats();

  // Function to display stats as cards
  function displayStats(type, statsEl) {
    const canvas = document.getElementById(
      type === 'Bouldering' ? 'bouldering-grade-chart' : 'sport-climbing-grade-chart'
    );

    if (monthlyStats[type] && monthlyStats[type].totalAttempts > 0) {
      // Show the canvas element
      canvas.style.display = 'block';

      const statsCards = document.createElement('div');
      statsCards.classList.add('stats-cards');

      // Calculate additional stats
      const totalSessions = monthlyStats[type].totalSessions;
      const totalAttempts = monthlyStats[type].totalAttempts;
      const totalSends = monthlyStats[type].totalSends;
      const totalFlashesOnsights = monthlyStats[type].totalFlashesOnsights;

      const completionRate = (((totalSends + totalFlashesOnsights) / totalAttempts) * 100).toFixed(0) + '%';
      const flashRatio = totalSends > 0 ? ((totalFlashesOnsights / totalSends) * 100).toFixed(0) + '%' : '0%';
      const sendsPerSession = (totalSends / totalSessions).toFixed(0);
      const attemptsPerSession = (totalAttempts / totalSessions).toFixed(0);

      // Create stat cards with calculated data
      const totalSessionsCard = createStatCard('Sessions', totalSessions, `Avg. attempts per session:<br><strong>${attemptsPerSession}</strong>`);
      const totalAttemptsCard = createStatCard('Attempts', totalAttempts, `Completion rate:<br><strong>${completionRate}</strong>`);
      const totalSendsCard = createStatCard('Sends', totalSends, `Avg. per session:<br><strong>${sendsPerSession}</strong>`);
      const totalFlashesOnsightsCard = createStatCard(
        type === 'Bouldering' ? 'Flashes' : 'Onsights',
        totalFlashesOnsights,
        `${type === 'Bouldering' ? 'Flash' : 'Onsight'} to send ratio:<br><strong>${flashRatio}</strong>`
      );

      const hardestFlashOnsightGrade = monthlyStats.hardestFlashOnsight[type]
        ? getConvertedGradeName(
            monthlyStats.hardestFlashOnsight[type].gradeId,
            type,
            monthlyStats.hardestFlashOnsight[type].originalGradingSystem
          )
        : '-';

      const flashOnsightProgression = progressionStats[type].flashOnsightProgression.length > 1
        ? `Progression:<br><strong>${progressionStats[type].flashOnsightProgression.join(' → ')}</strong>`
        : '';

      const hardestFlashOnsightCard = createStatCard(
        `Hardest ${type === 'Bouldering' ? 'Flash' : 'Onsight'}`,
        hardestFlashOnsightGrade,
        flashOnsightProgression
      );

      const hardestRouteTitle = type === 'Bouldering' ? 'Hardest Boulder' : 'Hardest Route';
      const hardestRouteGrade = monthlyStats[type].hardestGradeId !== null
        ? getConvertedGradeName(
            monthlyStats[type].hardestGradeId,
            type,
            monthlyStats[type].hardestGradeOriginal
          )
        : '-';

      const routeProgression = progressionStats[type].hardestGradeProgression.length > 1
        ? `Progression:<br><strong>${progressionStats[type].hardestGradeProgression.join(' → ')}</strong>`
        : '';

      const hardestRouteCard = createStatCard(hardestRouteTitle, hardestRouteGrade, routeProgression);

      // Append stat cards to the stats container
      statsCards.appendChild(totalSessionsCard);
      statsCards.appendChild(totalAttemptsCard);
      statsCards.appendChild(totalSendsCard);
      statsCards.appendChild(totalFlashesOnsightsCard);
      statsCards.appendChild(hardestFlashOnsightCard);
      statsCards.appendChild(hardestRouteCard);

      statsEl.appendChild(statsCards);

      // Render the grade distribution chart
      renderGradeDistributionChart(type);
    } else {
      const noData = document.createElement('p');
      noData.textContent = 'No data for this month.';
      statsEl.appendChild(noData);

      // Hide the canvas element if no data
      canvas.style.display = 'none';
    }
  }

  // Helper function to create a stat card with formatted subtext
  function createStatCard(title, value, subtext) {
    const card = document.createElement('div');
    card.classList.add('stat-card');

    const cardTitle = document.createElement('h3');
    cardTitle.textContent = title;
    card.appendChild(cardTitle);

    const cardValue = document.createElement('p');
    cardValue.textContent = value;
    cardValue.classList.add('stat-value');
    card.appendChild(cardValue);

    if (subtext) {
      const cardSubtext = document.createElement('p');
      // Subtext is already formatted with HTML tags
      cardSubtext.innerHTML = subtext;
      cardSubtext.classList.add('stat-subtext');
      card.appendChild(cardSubtext);
    }

    return card;
  }

  // Display statistics for Bouldering and Sport Climbing
  displayStats('Bouldering', boulderingStatsEl);
  displayStats('Sport Climbing', sportClimbingStatsEl);
}

// Calculate Monthly Stats for the current month
function calculateMonthlyStats(year, month) {
  const stats = {
    Bouldering: {
      gradeCounts: {},
      totalSessions: 0,
      totalAttempts: 0,
      totalSends: 0,
      totalFlashesOnsights: 0,
      hardestGradeValue: null,
      hardestGradeId: null,
      hardestGradeOriginal: null
    },
    'Sport Climbing': {
      gradeCounts: {},
      totalSessions: 0,
      totalAttempts: 0,
      totalSends: 0,
      totalFlashesOnsights: 0,
      hardestGradeValue: null,
      hardestGradeId: null,
      hardestGradeOriginal: null
    },
    hardestFlashOnsight: { Bouldering: null, 'Sport Climbing': null }
  };

  const startOfMonth = new Date(year, month, 1);
  const endOfMonth = new Date(year, month + 1, 0);

  const monthWorkouts = workouts.filter(w => isSameDateMonth(w.date, startOfMonth, endOfMonth));

  monthWorkouts.forEach(workout => {
    stats[workout.type].totalSessions += 1;

    workout.grades.forEach(grade => {
      const gradeId = grade.gradeId;
      const type = grade.type;
      const originalGradingSystem = grade.originalGradingSystem;

      // Get the grade object
      const gradeObj = grades.find(
        g =>
          g.id === gradeId &&
          g.type === type &&
          g.original.toLowerCase() === originalGradingSystem.toLowerCase()
      );

      if (!gradeObj) return;

      const gradeValue = gradeObj.gradeValue;

      // Get the grade name in the current grading system
      const gradeName = getConvertedGradeName(gradeId, type, originalGradingSystem);

      if (!stats[workout.type].gradeCounts[gradeName]) {
        stats[workout.type].gradeCounts[gradeName] = {
          attempts: 0,
          sends: 0,
          flashesOnsights: 0,
          gradeValue: gradeValue // Store gradeValue for sorting
        };
      }

      const gradeCountObj = stats[workout.type].gradeCounts[gradeName];

      gradeCountObj.attempts += grade.attempts;
      gradeCountObj.sends += grade.sends;
      gradeCountObj.flashesOnsights += grade.flashesOnsights;

      stats[workout.type].totalAttempts += grade.attempts;
      stats[workout.type].totalSends += grade.sends;
      stats[workout.type].totalFlashesOnsights += grade.flashesOnsights;

      // Update hardest route based on gradeValue
      if (
        grade.sends > 0 &&
        (stats[workout.type].hardestGradeValue === null || gradeValue > stats[workout.type].hardestGradeValue)
      ) {
        stats[workout.type].hardestGradeValue = gradeValue;
        stats[workout.type].hardestGradeId = gradeId; // Keep track of gradeId
        stats[workout.type].hardestGradeOriginal = originalGradingSystem;
      }

      // Update hardest Flash/Onsight
      if (
        grade.flashesOnsights > 0 &&
        (stats.hardestFlashOnsight[workout.type]?.gradeValue === undefined ||
          gradeValue > stats.hardestFlashOnsight[workout.type].gradeValue)
      ) {
        stats.hardestFlashOnsight[workout.type] = {
          gradeValue: gradeValue,
          gradeId: gradeId,
          originalGradingSystem: originalGradingSystem
        };
      }
    });
  });

  return stats;
}

// Calculate Progression Stats over the last three months
function calculateProgressionStats() {
  const progressionStats = {
    Bouldering: {
      hardestGradeProgression: [],
      flashOnsightProgression: []
    },
    'Sport Climbing': {
      hardestGradeProgression: [],
      flashOnsightProgression: []
    }
  };

  const currentDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
  const monthsToInclude = [0, -1, -2]; // Current month and previous two months

  monthsToInclude.forEach(offset => {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth() + offset, 1);
    const stats = calculateMonthlyStats(date.getFullYear(), date.getMonth());

    ['Bouldering', 'Sport Climbing'].forEach(type => {
      // Hardest Grade
      if (stats[type].hardestGradeId !== null) {
        const gradeName = getConvertedGradeName(
          stats[type].hardestGradeId,
          type,
          stats[type].hardestGradeOriginal
        );
        progressionStats[type].hardestGradeProgression.push(gradeName);
      }

      // Hardest Flash/Onsight
      if (stats.hardestFlashOnsight[type]?.gradeId !== undefined) {
        const gradeName = getConvertedGradeName(
          stats.hardestFlashOnsight[type].gradeId,
          type,
          stats.hardestFlashOnsight[type].originalGradingSystem
        );
        progressionStats[type].flashOnsightProgression.push(gradeName);
      }
    });
  });

  // Reverse the arrays to show oldest to newest
  ['Bouldering', 'Sport Climbing'].forEach(type => {
    progressionStats[type].hardestGradeProgression.reverse();
    progressionStats[type].flashOnsightProgression.reverse();

    // Limit progression to last 3 grades if more than 3 months have data
    progressionStats[type].hardestGradeProgression = progressionStats[type].hardestGradeProgression.slice(-3);
    progressionStats[type].flashOnsightProgression = progressionStats[type].flashOnsightProgression.slice(-3);
  });

  return progressionStats;
}

// Function to render the grade distribution chart
// Function to render the grade distribution chart
function renderGradeDistributionChart(type) {
  const chartId = type === 'Bouldering' ? 'bouldering-grade-chart' : 'sport-climbing-grade-chart';
  const monthlyStats = calculateMonthlyStats(currentMonth.getFullYear(), currentMonth.getMonth());
  const gradeCounts = monthlyStats[type].gradeCounts;

  // Get the canvas element
  const canvas = document.getElementById(chartId);
  const ctx = canvas.getContext('2d');

  // Prepare data
  const gradeNames = Object.keys(gradeCounts);

  if (gradeNames.length === 0) {
    // No data to display
    return;
  }

  // Prepare data arrays for the chart
  const failedAttemptsData = [];
  const sendsData = [];
  const flashesOnsightsData = [];
  const totalAttemptsPerGrade = [];

  // Sort grade names based on gradeValue
  gradeNames.sort((a, b) => {
    return gradeCounts[a].gradeValue - gradeCounts[b].gradeValue;
  });

  gradeNames.forEach((gradeName) => {
    const counts = gradeCounts[gradeName];
    const attempts = counts.attempts;
    const sends = counts.sends;
    const flashesOnsights = counts.flashesOnsights;
    const failedAttempts = Math.max(0, attempts - sends);
    const sendsWithoutFlashes = Math.max(0, sends - flashesOnsights);

    failedAttemptsData.push(failedAttempts);
    sendsData.push(sendsWithoutFlashes);
    flashesOnsightsData.push(flashesOnsights);
    totalAttemptsPerGrade.push(attempts);
  });

  // Destroy existing chart instance if any
  if (canvas.chart) {
    canvas.chart.destroy();
  }

  // Calculate dynamic bar thickness
  let barThickness = 15; // Default bar thickness
  const maxBarThickness = 15; // Maximum bar thickness
  const minBarThickness = 8; // Minimum bar thickness

  // Adjust bar thickness based on the number of grades
  if (gradeNames.length > 10) {
    barThickness = Math.max(minBarThickness, maxBarThickness - (gradeNames.length - 10));
  }

  // Adjust font size for labels
  const labelFontSize = gradeNames.length > 15 ? 8 : 10;

  // Create stacked bar chart using Chart.js
  canvas.chart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: gradeNames,
      datasets: [
        {
          label: 'Failed Attempts',
          data: failedAttemptsData,
          backgroundColor: '#f56565', // Red color
        },
        {
          label: 'Sends',
          data: sendsData,
          backgroundColor: '#48bb78', // Green color
        },
        {
          label: type === 'Bouldering' ? 'Flashes' : 'Onsights',
          data: flashesOnsightsData,
          backgroundColor: '#4299e1', // Blue color
        }
      ]
    },
    options: {
      scales: {
        x: {
          stacked: true,
          title: { display: false },
          ticks: {
            maxRotation: 45,
            minRotation: 0,
            autoSkip: false, // Do not skip labels
            font: {
              size: labelFontSize
            }
          },
          grid: {
            display: false
          }
        },
        y: {
          stacked: true,
          ticks: {
            display: false,
            max: Math.max(...totalAttemptsPerGrade) + 2 // Add extra space above the tallest bar
          },
          grid: {
            display: false,
            drawBorder: false // Remove y-axis line
          }
        }
      },
      plugins: {
        tooltip: {
          callbacks: {
            label: function(context) {
              const datasetLabel = context.dataset.label || '';
              const dataPoint = context.parsed.y;
              const index = context.dataIndex;
              const totalAttempts = totalAttemptsPerGrade[index];
              return `${datasetLabel}: ${dataPoint} from ${totalAttempts} total attempts`;
            }
          }
        },
        legend: { display: false } // Remove legend
      },
      layout: {
        padding: {
          top: 20 // Adjust the padding value as needed
        }
      },
      barThickness: barThickness,
      responsive: true,
      maintainAspectRatio: false
    }
  });
}


// Local Storage Functions to save and load workouts
function saveWorkoutsToStorage() {
  const workoutsData = workouts.map(workout => ({
    ...workout,
    date: new Date(workout.date).toISOString()
  }));
  localStorage.setItem('workouts', JSON.stringify(workoutsData));
}

function loadWorkoutsFromStorage() {
  const storedData = localStorage.getItem('workouts');
  if (storedData) {
    workouts = JSON.parse(storedData).map(workout => ({
      ...workout,
      date: new Date(workout.date)
    }));
  }
}


// Function to generate random data for testing
function generateRandomData() {
  // First, clear existing workouts or you can comment this out if you want to keep existing data
  // workouts = [];

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Create an array of day numbers
  const dayNumbers = Array.from({ length: daysInMonth }, (_, i) => i + 1); // [1, 2, ..., daysInMonth]

  // Shuffle the dayNumbers array
  for (let i = dayNumbers.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [dayNumbers[i], dayNumbers[j]] = [dayNumbers[j], dayNumbers[i]];
  }

  // Pick the first 10 days
  const randomDays = dayNumbers.slice(0, 10);

  randomDays.forEach(day => {
    const date = new Date(year, month, day);

    // Decide randomly whether to have bouldering, sport climbing, or both sessions
    const sessionTypes = ['Bouldering', 'Sport Climbing'];
    const numSessions = Math.floor(Math.random() * 2) + 1; // 1 or 2 sessions
    const sessionTypesForDay = sessionTypes.slice();

    for (let s = 0; s < numSessions; s++) {
      // Randomly pick a session type
      const index = Math.floor(Math.random() * sessionTypesForDay.length);
      const sessionType = sessionTypesForDay.splice(index, 1)[0]; // Remove to avoid duplicate sessions

      // Generate 5 to 10 grades
      const numGrades = Math.floor(Math.random() * 6) + 5; // 5 to 10 grades

      // Get available grades for the session type
      const availableGrades = grades.filter(g => g.type === sessionType && g.original.toLowerCase() === gradingSystem.toLowerCase());

      // Shuffle the available grades
      const shuffledGrades = availableGrades.slice();
      for (let i = shuffledGrades.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledGrades[i], shuffledGrades[j]] = [shuffledGrades[j], shuffledGrades[i]];
      }

      // Pick the first numGrades grades
      const selectedGrades = shuffledGrades.slice(0, numGrades);

      const gradesData = selectedGrades.map(gradeObj => {
        // Random send and flash rates
        const attempts = Math.floor(Math.random() * 5) + 1; // 1 to 5 attempts
        const sends = Math.floor(Math.random() * (attempts + 1)); // 0 to attempts
        const flashesOnsights = Math.floor(Math.random() * (sends + 1)); // 0 to sends

        return {
          gradeId: gradeObj.id,
          type: gradeObj.type,
          originalGradingSystem: gradingSystem,
          attempts: attempts,
          sends: sends,
          flashesOnsights: flashesOnsights
        };
      });

      const workout = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9), // Unique ID
        date: date,
        type: sessionType,
        grades: gradesData
      };

      workouts.push(workout);
    }
  });

  saveWorkoutsToStorage();
  renderCalendar();
  updateStatistics();
}
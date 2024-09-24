// script.js

// Unified Grades Array with all grades included
const grades = [
  // Bouldering Grades
  { id: 1, type: 'Bouldering', american: 'V0', french: '4', gradeValue: 1 },
  { id: 2, type: 'Bouldering', american: 'V1', french: '5', gradeValue: 2 },
  { id: 3, type: 'Bouldering', american: 'V2', french: '5+', gradeValue: 3 },
  { id: 4, type: 'Bouldering', american: 'V3', french: '6A', gradeValue: 4 },
  { id: 5, type: 'Bouldering', american: 'V4', french: '6A+', gradeValue: 5 },
  { id: 6, type: 'Bouldering', american: 'V5', french: '6B', gradeValue: 6 },
  { id: 7, type: 'Bouldering', american: 'V6', french: '6B+', gradeValue: 7 },
  { id: 8, type: 'Bouldering', american: 'V7', french: '6C', gradeValue: 8 },
  { id: 9, type: 'Bouldering', american: 'V8', french: '6C+', gradeValue: 9 },
  { id: 10, type: 'Bouldering', american: 'V9', french: '7A', gradeValue: 10 },
  { id: 11, type: 'Bouldering', american: 'V10', french: '7A+', gradeValue: 11 },
  { id: 12, type: 'Bouldering', american: 'V11', french: '7B', gradeValue: 12 },
  { id: 13, type: 'Bouldering', american: 'V12', french: '7B+', gradeValue: 13 },
  { id: 14, type: 'Bouldering', american: 'V13', french: '7C', gradeValue: 14 },
  { id: 15, type: 'Bouldering', american: 'V14', french: '7C+', gradeValue: 15 },
  { id: 16, type: 'Bouldering', american: 'V15', french: '8A', gradeValue: 16 },
  { id: 17, type: 'Bouldering', american: 'V16', french: '8A+', gradeValue: 17 },
  { id: 18, type: 'Bouldering', american: 'V17', french: '8B', gradeValue: 18 },

  // Sports Climbing Grades
  { id: 1, type: 'Sports Climbing', american: '5.6', french: '4c', gradeValue: 1 },
  { id: 2, type: 'Sports Climbing', american: '5.7', french: '5a', gradeValue: 2 },
  { id: 3, type: 'Sports Climbing', american: '5.8', french: '5b', gradeValue: 3 },
  { id: 4, type: 'Sports Climbing', american: '5.9', french: '5c', gradeValue: 4 },
  { id: 5, type: 'Sports Climbing', american: '5.10a', french: '6a', gradeValue: 5 },
  { id: 6, type: 'Sports Climbing', american: '5.10b', french: '6a+', gradeValue: 6 },
  { id: 7, type: 'Sports Climbing', american: '5.10c', french: '6b', gradeValue: 7 },
  { id: 8, type: 'Sports Climbing', american: '5.10d', french: '6b+', gradeValue: 8 },
  { id: 9, type: 'Sports Climbing', american: '5.11a', french: '6c', gradeValue: 9 },
  { id: 10, type: 'Sports Climbing', american: '5.11b', french: '6c+', gradeValue: 10 },
  { id: 11, type: 'Sports Climbing', american: '5.11c', french: '7a', gradeValue: 11 },
  { id: 12, type: 'Sports Climbing', american: '5.11d', french: '7a+', gradeValue: 12 },
  { id: 13, type: 'Sports Climbing', american: '5.12a', french: '7b', gradeValue: 13 },
  { id: 14, type: 'Sports Climbing', american: '5.12b', french: '7b+', gradeValue: 14 },
  { id: 15, type: 'Sports Climbing', american: '5.12c', french: '7c', gradeValue: 15 },
  { id: 16, type: 'Sports Climbing', american: '5.12d', french: '7c+', gradeValue: 16 },
  { id: 17, type: 'Sports Climbing', american: '5.13a', french: '8a', gradeValue: 17 },
  { id: 18, type: 'Sports Climbing', american: '5.13b', french: '8a+', gradeValue: 18 },
  { id: 19, type: 'Sports Climbing', american: '5.13c', french: '8b', gradeValue: 19 },
  { id: 20, type: 'Sports Climbing', american: '5.13d', french: '8b+', gradeValue: 20 },
  { id: 21, type: 'Sports Climbing', american: '5.14a', french: '8c', gradeValue: 21 },
  { id: 22, type: 'Sports Climbing', american: '5.14b', french: '8c+', gradeValue: 22 },
  { id: 23, type: 'Sports Climbing', american: '5.14c', french: '9a', gradeValue: 23 },
  { id: 24, type: 'Sports Climbing', american: '5.14d', french: '9a+', gradeValue: 24 },
  { id: 25, type: 'Sports Climbing', american: '5.15a', french: '9b', gradeValue: 25 },
  { id: 26, type: 'Sports Climbing', american: '5.15b', french: '9b+', gradeValue: 26 },
  { id: 27, type: 'Sports Climbing', american: '5.15c', french: '9c', gradeValue: 27 },
  { id: 28, type: 'Sports Climbing', american: '5.15d', french: '9c+', gradeValue: 28 },
];

// Grading system preference
let gradingSystem = 'American'; // Default to American

// Load Grading System Preference
function loadGradingSystemPreference() {
  const storedPreference = localStorage.getItem('gradingSystem');
  if (storedPreference) {
    gradingSystem = storedPreference;
  }
}

// Save Grading System Preference
function saveGradingSystemPreference() {
  localStorage.setItem('gradingSystem', gradingSystem);
}

// Get Grade Name
function getGradeName(gradeId, type) {
  const grade = grades.find(g => g.id === gradeId && g.type === type);
  if (!grade) return 'N/A';
  return gradingSystem === 'American' ? grade.american : grade.french;
}

// State Variables
let selectedDate = new Date();
let currentMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
let workouts = [];
let currentWorkout = null;
let editingWorkoutId = null;
let selectedWorkoutType = null;

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
  loadGradingSystemPreference();
  loadWorkoutsFromStorage();
  migrateWorkoutData();
  renderCalendar();
  updateStatistics();
  setupEventListeners();
  populateGradeConversionTables();
});

// Data Migration Function
function migrateWorkoutData() {
  workouts.forEach(workout => {
    workout.grades.forEach(gradeEntry => {
      if (gradeEntry.grade) {
        // Convert old grade names to gradeId
        const grade = grades.find(
          g =>
            (g.american === gradeEntry.grade || g.french === gradeEntry.grade) &&
            g.type === workout.type
        );
        if (grade) {
          gradeEntry.gradeId = grade.id;
          delete gradeEntry.grade;
        }
      }
    });
  });
}

// Function to render the calendar
function renderCalendar() {
  const calendarEl = document.getElementById('calendar');
  const monthYearEl = document.getElementById('month-year');
  calendarEl.innerHTML = '';

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  // Adjusted for week starting on Monday
  let firstDayIndex = new Date(year, month, 1).getDay() - 1;
  if (firstDayIndex < 0) firstDayIndex = 6; // Adjust for Sunday

  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Set month and year
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

  const prevMonthDays = new Date(year, month, 0).getDate();
  const totalCells = 42;

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
      dayEl.classList.add('today');
    }

    if (isSameDate(date, selectedDate)) {
      dayEl.classList.add('selected');
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
          dot.classList.add('bouldering-dot');
        } else {
          dot.classList.add('sports-climbing-dot');
        }
        indicator.appendChild(dot);
      });

      dayEl.appendChild(indicator);
    }

    // Add click event
    dayEl.addEventListener('click', () => {
      selectedDate = date;
      renderCalendar();
      onDateSelect();
    });

    calendarEl.appendChild(dayEl);
  }

  // Calculate remaining cells
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

// Helper functions
function isToday(date) {
  const today = new Date();
  return isSameDate(date, today);
}

function isSameDate(d1, d2) {
  return d1.getFullYear() === d2.getFullYear() &&
         d1.getMonth() === d2.getMonth() &&
         d1.getDate() === d2.getDate();
}

// Event when a date is selected
function onDateSelect() {
  const existingWorkouts = workouts.filter(w => isSameDate(w.date, selectedDate));
  if (existingWorkouts.length > 0) {
    showWorkoutSummary();
  } else {
    openModal('workout-type-modal');
  }
}

// Modal functions
function openModal(modalId) {
  document.getElementById(modalId).style.display = 'block';
}

function closeModal(modalId) {
  document.getElementById(modalId).style.display = 'none';
}


// Setup Event Listeners
function setupEventListeners() {
  // Close modals
  document.querySelectorAll('.close-button').forEach(button => {
    button.addEventListener('click', (e) => {
      const modalId = e.target.getAttribute('data-close');
      closeModal(modalId);
    });
  });

  // Workout Type Selection
  document.getElementById('select-bouldering').addEventListener('click', () => {
    selectedWorkoutType = 'Bouldering';
    closeModal('workout-type-modal');
    openGradeSelectionModal();
  });

  document.getElementById('select-sports-climbing').addEventListener('click', () => {
    selectedWorkoutType = 'Sports Climbing';
    closeModal('workout-type-modal');
    openGradeSelectionModal();
  });

  // Save Workout
  document.getElementById('save-workout-button').addEventListener('click', saveWorkout);

  // Add Another Workout
  document.getElementById('add-another-workout-button').addEventListener('click', () => {
    closeModal('workout-summary-modal');
    openModal('workout-type-modal');
  });

  // Tabs
  document.querySelectorAll('.tab-button').forEach(button => {
    button.addEventListener('click', (e) => {
      const tab = e.target.getAttribute('data-tab');
      switchTab(tab);
    });
  });

  // Month Navigation
  document.getElementById('prev-month').addEventListener('click', () => {
    currentMonth.setMonth(currentMonth.getMonth() - 1);
    renderCalendar();
    updateStatistics();
  });

  document.getElementById('next-month').addEventListener('click', () => {
    currentMonth.setMonth(currentMonth.getMonth() + 1);
    renderCalendar();
    updateStatistics();
  });

  // Burger Menu Toggle
  document.getElementById('burgerMenu').addEventListener('click', () => {
    document.getElementById('sideMenu').classList.toggle('open');
  });

  // Close the menu when clicking outside
  document.addEventListener('click', (e) => {
    const sideMenu = document.getElementById('sideMenu');
    const settingsMenu = document.getElementById('settingsMenu');
    const burgerMenu = document.getElementById('burgerMenu');
    if (
      !sideMenu.contains(e.target) &&
      !burgerMenu.contains(e.target) &&
      !settingsMenu.contains(e.target)
    ) {
      sideMenu.classList.remove('open');
      settingsMenu.classList.remove('open');
    }
  });

  // Menu Item Click Events
  document.getElementById('settingsItem').addEventListener('click', () => {
    // Close side menu and open settings menu
    document.getElementById('sideMenu').classList.remove('open');
    document.getElementById('settingsMenu').classList.add('open');

    // Set the current grading system in the select
    document.getElementById('gradingSystemSelect').value = gradingSystem;
  });

  // Close Settings Button
  document.getElementById('closeSettingsButton').addEventListener('click', () => {
    document.getElementById('settingsMenu').classList.remove('open');

    // Save the selected grading system
    gradingSystem = document.getElementById('gradingSystemSelect').value;
    saveGradingSystemPreference();

    // Update the UI to reflect the new grading system
    renderCalendar();
    updateStatistics();
  });

  // Export Data
  document.getElementById('exportDataItem').addEventListener('click', () => {
    exportDataToCSV();
    document.getElementById('sideMenu').classList.remove('open');
  });

  // Grade Conversion
  document.getElementById('gradeConversionItem').addEventListener('click', () => {
    openModal('gradeConversionModal');
    document.getElementById('sideMenu').classList.remove('open');
  });
}

// Open Grade Selection Modal
function openGradeSelectionModal() {
  if (editingWorkoutId) {
    currentWorkout = workouts.find(w => w.id === editingWorkoutId);
  } else {
    currentWorkout = {
      id: Date.now().toString(),
      date: selectedDate,
      type: selectedWorkoutType,
      grades: []
    };
  }

  const gradeModalTitle = document.getElementById('grade-modal-title');
  gradeModalTitle.textContent = `${selectedWorkoutType} Workout`;

  const gradeList = document.getElementById('grade-list');
  gradeList.innerHTML = '';

  // Get grades for the selected workout type
  const gradeOptions = grades.filter(g => g.type === selectedWorkoutType);

  gradeOptions.forEach(gradeObj => {
    const gradeItem = document.createElement('div');
    gradeItem.classList.add('grade-item');

    const gradeLabel = document.createElement('span');
    gradeLabel.textContent = getGradeName(gradeObj.id, gradeObj.type);
    gradeItem.appendChild(gradeLabel);

    const gradeControls = document.createElement('div');
    gradeControls.classList.add('grade-controls');

    // Attempts Controls
    const attemptsGroup = document.createElement('div');
    attemptsGroup.classList.add('control-group');

    const attemptsLabel = document.createElement('label');
    attemptsLabel.textContent = 'Attempts';
    attemptsGroup.appendChild(attemptsLabel);

    const attemptsControls = document.createElement('div');
    attemptsControls.classList.add('controls');

    const attemptsMinusButton = document.createElement('button');
    attemptsMinusButton.classList.add('control-button');
    attemptsMinusButton.textContent = '-';

    const attemptsDisplay = document.createElement('span');
    attemptsDisplay.classList.add('control-display');
    attemptsDisplay.textContent = '0';

    const attemptsPlusButton = document.createElement('button');
    attemptsPlusButton.classList.add('control-button');
    attemptsPlusButton.textContent = '+';

    attemptsControls.appendChild(attemptsMinusButton);
    attemptsControls.appendChild(attemptsDisplay);
    attemptsControls.appendChild(attemptsPlusButton);

    attemptsGroup.appendChild(attemptsControls);
    gradeControls.appendChild(attemptsGroup);

    // Sends Controls
    const sendsGroup = document.createElement('div');
    sendsGroup.classList.add('control-group');

    const sendsLabel = document.createElement('label');
    sendsLabel.textContent = 'Sends';
    sendsGroup.appendChild(sendsLabel);

    const sendsControls = document.createElement('div');
    sendsControls.classList.add('controls');

    const sendsMinusButton = document.createElement('button');
    sendsMinusButton.classList.add('control-button');
    sendsMinusButton.textContent = '-';

    const sendsDisplay = document.createElement('span');
    sendsDisplay.classList.add('control-display');
    sendsDisplay.textContent = '0';

    const sendsPlusButton = document.createElement('button');
    sendsPlusButton.classList.add('control-button');
    sendsPlusButton.textContent = '+';

    sendsControls.appendChild(sendsMinusButton);
    sendsControls.appendChild(sendsDisplay);
    sendsControls.appendChild(sendsPlusButton);

    sendsGroup.appendChild(sendsControls);
    gradeControls.appendChild(sendsGroup);

    // Flashes/Onsights Controls
    const flashesGroup = document.createElement('div');
    flashesGroup.classList.add('control-group');

    const flashesLabel = document.createElement('label');
    flashesLabel.textContent = selectedWorkoutType === 'Bouldering' ? 'Flashes' : 'Onsights';
    flashesGroup.appendChild(flashesLabel);

    const flashesControls = document.createElement('div');
    flashesControls.classList.add('controls');

    const flashesMinusButton = document.createElement('button');
    flashesMinusButton.classList.add('control-button');
    flashesMinusButton.textContent = '-';

    const flashesDisplay = document.createElement('span');
    flashesDisplay.classList.add('control-display');
    flashesDisplay.textContent = '0';

    const flashesPlusButton = document.createElement('button');
    flashesPlusButton.classList.add('control-button');
    flashesPlusButton.textContent = '+';

    flashesControls.appendChild(flashesMinusButton);
    flashesControls.appendChild(flashesDisplay);
    flashesControls.appendChild(flashesPlusButton);

    flashesGroup.appendChild(flashesControls);
    gradeControls.appendChild(flashesGroup);

    // Error Message
    const errorMessage = document.createElement('div');
    errorMessage.classList.add('error-message');
    gradeControls.appendChild(errorMessage);

    gradeItem.appendChild(gradeControls);
    gradeList.appendChild(gradeItem);

    // Initialize grade data
    let gradeData = {
      gradeId: gradeObj.id,
      attempts: 0,
      sends: 0,
      flashesOnsights: 0
    };

    currentWorkout.grades.push(gradeData);

    // Event Listeners for Attempts Controls
    attemptsMinusButton.addEventListener('click', () => {
      gradeData.attempts = Math.max(0, gradeData.attempts - 1);
      // Ensure attempts >= sends
      if (gradeData.attempts < gradeData.sends) {
        gradeData.sends = gradeData.attempts;
        sendsDisplay.textContent = gradeData.sends;
        // Ensure sends >= flashesOnsights
        if (gradeData.sends < gradeData.flashesOnsights) {
          gradeData.flashesOnsights = gradeData.sends;
          flashesDisplay.textContent = gradeData.flashesOnsights;
        }
      }
      attemptsDisplay.textContent = gradeData.attempts;
      validateInputs();
    });

    attemptsPlusButton.addEventListener('click', () => {
      gradeData.attempts += 1;
      attemptsDisplay.textContent = gradeData.attempts;
      validateInputs();
    });

    // Event Listeners for Sends Controls
    sendsMinusButton.addEventListener('click', () => {
      gradeData.sends = Math.max(0, gradeData.sends - 1);
      // Ensure sends >= flashesOnsights
      if (gradeData.sends < gradeData.flashesOnsights) {
        gradeData.flashesOnsights = gradeData.sends;
        flashesDisplay.textContent = gradeData.flashesOnsights;
      }
      sendsDisplay.textContent = gradeData.sends;
      // Ensure attempts >= sends
      if (gradeData.attempts < gradeData.sends) {
        gradeData.attempts = gradeData.sends;
        attemptsDisplay.textContent = gradeData.attempts;
      }
      validateInputs();
    });

    sendsPlusButton.addEventListener('click', () => {
      gradeData.sends += 1;
      sendsDisplay.textContent = gradeData.sends;
      // Ensure attempts >= sends
      if (gradeData.attempts < gradeData.sends) {
        gradeData.attempts = gradeData.sends;
        attemptsDisplay.textContent = gradeData.attempts;
      }
      validateInputs();
    });

    // Event Listeners for Flashes/Onsights Controls
    flashesMinusButton.addEventListener('click', () => {
      gradeData.flashesOnsights = Math.max(0, gradeData.flashesOnsights - 1);
      flashesDisplay.textContent = gradeData.flashesOnsights;
      // Ensure sends >= flashesOnsights
      if (gradeData.sends < gradeData.flashesOnsights) {
        gradeData.sends = gradeData.flashesOnsights;
        sendsDisplay.textContent = gradeData.sends;
      }
      // Ensure attempts >= sends
      if (gradeData.attempts < gradeData.sends) {
        gradeData.attempts = gradeData.sends;
        attemptsDisplay.textContent = gradeData.attempts;
      }
      validateInputs();
    });

    flashesPlusButton.addEventListener('click', () => {
      gradeData.flashesOnsights += 1;
      flashesDisplay.textContent = gradeData.flashesOnsights;
      // Ensure sends >= flashesOnsights
      if (gradeData.sends < gradeData.flashesOnsights) {
        gradeData.sends = gradeData.flashesOnsights;
        sendsDisplay.textContent = gradeData.sends;
      }
      // Ensure attempts >= sends
      if (gradeData.attempts < gradeData.sends) {
        gradeData.attempts = gradeData.sends;
        attemptsDisplay.textContent = gradeData.attempts;
      }
      validateInputs();
    });

    // Validation Function
    function validateInputs() {
      let error = '';
      if (gradeData.sends > gradeData.attempts) {
        error = 'Sends cannot exceed attempts.';
      } else if (gradeData.flashesOnsights > gradeData.sends) {
        error = `${flashesLabel.textContent} cannot exceed sends.`;
      }
      errorMessage.textContent = error;
    }

    // If editing, load existing data
    let existingGrade;
    if (editingWorkoutId) {
      existingGrade = currentWorkout.grades.find(g => g.gradeId === gradeObj.id);
    }

    if (existingGrade) {
      gradeData.attempts = existingGrade.attempts || 0;
      gradeData.sends = existingGrade.sends || 0;
      gradeData.flashesOnsights = existingGrade.flashesOnsights || 0;
      attemptsDisplay.textContent = gradeData.attempts;
      sendsDisplay.textContent = gradeData.sends;
      flashesDisplay.textContent = gradeData.flashesOnsights;
      validateInputs();
    }
  });

  openModal('grade-selection-modal');
}

// Save Workout
function saveWorkout() {
  // Filter out grades with zero attempts
  currentWorkout.grades = currentWorkout.grades.filter(g => g.attempts > 0);

  // Validate all grades
  for (let grade of currentWorkout.grades) {
    if (grade.sends > grade.attempts) {
      const gradeName = getGradeName(grade.gradeId, currentWorkout.type);
      alert(`For grade ${gradeName}, sends cannot exceed attempts.`);
      return;
    }
    if (grade.flashesOnsights > grade.sends) {
      const gradeName = getGradeName(grade.gradeId, currentWorkout.type);
      alert(`For grade ${gradeName}, flashes/onsights cannot exceed sends.`);
      return;
    }
  }

  if (currentWorkout.grades.length === 0) {
    alert('Please add at least one attempt to save the workout.');
    return;
  }

  if (editingWorkoutId) {
    workouts = workouts.map(w => w.id === editingWorkoutId ? currentWorkout : w);
    editingWorkoutId = null;
  } else {
    workouts.push(currentWorkout);
  }

  saveWorkoutsToStorage();
  closeModal('grade-selection-modal');
  currentWorkout = null;
  renderCalendar();
  updateStatistics();
}

// Show Workout Summary
function showWorkoutSummary() {
  const summaryContent = document.getElementById('workout-summary-content');
  summaryContent.innerHTML = '';

  const dayWorkouts = workouts.filter(w => isSameDate(w.date, selectedDate));

  dayWorkouts.forEach(workout => {
    const workoutItem = document.createElement('div');
    workoutItem.classList.add('workout-summary-item');

    const header = document.createElement('div');
    header.classList.add('workout-summary-header');

    const title = document.createElement('h3');
    title.textContent = `${workout.type} - ${workout.date.toDateString()}`;
    header.appendChild(title);

    // Edit and Delete Buttons
    const buttons = document.createElement('div');
    buttons.classList.add('workout-summary-buttons');

    const editButton = document.createElement('button');
    editButton.textContent = 'Edit';
    editButton.addEventListener('click', () => {
      editWorkout(workout);
    });
    buttons.appendChild(editButton);

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.addEventListener('click', () => {
      deleteWorkout(workout.id);
    });
    buttons.appendChild(deleteButton);

    header.appendChild(buttons);
    workoutItem.appendChild(header);

    // Grades List
    const gradesList = document.createElement('div');
    gradesList.classList.add('workout-summary-grades');

    workout.grades.forEach(grade => {
      const gradeText = document.createElement('p');
      let gradeName = getGradeName(grade.gradeId, workout.type);
      let text = `${gradeName}: Attempts ${grade.attempts}, Sends ${grade.sends}`;
      if (grade.flashesOnsights) {
        text += `, ${workout.type === 'Bouldering' ? 'Flashes' : 'Onsights'} ${grade.flashesOnsights}`;
      }
      gradeText.textContent = text;
      gradesList.appendChild(gradeText);
    });

    workoutItem.appendChild(gradesList);

    // Stats
    const stats = document.createElement('div');
    stats.classList.add('workout-summary-stats');

    const totalAttempts = workout.grades.reduce((sum, grade) => sum + grade.attempts, 0);
    const totalSends = workout.grades.reduce((sum, grade) => sum + grade.sends, 0);
    const totalFlashesOnsights = workout.grades.reduce((sum, grade) => sum + grade.flashesOnsights, 0);

    stats.innerHTML = `
      <p>Total attempts: <strong>${totalAttempts}</strong></p>
      <p>Total sends: <strong>${totalSends}</strong></p>
      <p>${workout.type === 'Bouldering' ? 'Flashes' : 'Onsights'}: <strong>${totalFlashesOnsights}</strong></p>
    `;

    workoutItem.appendChild(stats);

    summaryContent.appendChild(workoutItem);
  });

  openModal('workout-summary-modal');
}

// Edit Workout
function editWorkout(workout) {
  editingWorkoutId = workout.id;
  selectedWorkoutType = workout.type;
  closeModal('workout-summary-modal');
  openGradeSelectionModal();
}

// Delete Workout
function deleteWorkout(workoutId) {
  workouts = workouts.filter(w => w.id !== workoutId);
  saveWorkoutsToStorage();
  renderCalendar();
  updateStatistics();
  showWorkoutSummary();
}

// Switch Tabs
function switchTab(tab) {
  document.querySelectorAll('.tab-button').forEach(button => {
    button.classList.remove('active');
  });
  document.querySelectorAll('.tab-content').forEach(content => {
    content.classList.remove('active');
  });

  document.querySelector(`.tab-button[data-tab="${tab}"]`).classList.add('active');
  document.getElementById(`${tab}-stats`).classList.add('active');
}

// Update Statistics
function updateStatistics() {
  const boulderingStatsEl = document.getElementById('bouldering-stats-content');
  const sportsClimbingStatsEl = document.getElementById('sports-climbing-stats-content');

  boulderingStatsEl.innerHTML = '';
  sportsClimbingStatsEl.innerHTML = '';

  const monthlyStats = calculateMonthlyStats(currentMonth.getFullYear(), currentMonth.getMonth());
  const prevMonthlyStats = calculateMonthlyStats(currentMonth.getFullYear(), currentMonth.getMonth() - 1);

  // Function to display stats
  function displayStats(type, statsEl) {
    if (monthlyStats[type] && monthlyStats[type].totalAttempts > 0) {
      const totalAttempts = document.createElement('p');
      totalAttempts.innerHTML = `Total attempts: <strong>${monthlyStats[type].totalAttempts}</strong>`;
      statsEl.appendChild(totalAttempts);

      const totalSends = document.createElement('p');
      totalSends.innerHTML = `Total sends: <strong>${monthlyStats[type].totalSends}</strong>`;
      statsEl.appendChild(totalSends);

      const totalFlashesOnsights = document.createElement('p');
      totalFlashesOnsights.innerHTML = `${type === 'Bouldering' ? 'Flashes' : 'Onsights'}: <strong>${monthlyStats[type].totalFlashesOnsights}</strong>`;
      statsEl.appendChild(totalFlashesOnsights);

      const hardestFlashOnsight = document.createElement('p');
      const hardestFlashGrade = monthlyStats.hardestFlashOnsight[type]
        ? getGradeName(monthlyStats.hardestFlashOnsight[type].gradeId, type)
        : 'N/A';
      hardestFlashOnsight.innerHTML = `Hardest ${type === 'Bouldering' ? 'Flash' : 'Onsight'}: <strong>${hardestFlashGrade}</strong>`;
      statsEl.appendChild(hardestFlashOnsight);

      const hardestRoute = document.createElement('p');
      const hardestRouteGrade = monthlyStats[type].hardestRouteId
        ? getGradeName(monthlyStats[type].hardestRouteId, type)
        : 'N/A';
      hardestRoute.innerHTML = `Hardest Route: <strong>${hardestRouteGrade}</strong>`;
      statsEl.appendChild(hardestRoute);

      const averageGrade = document.createElement('p');
      const averageGradeName = monthlyStats[type].averageGradeId
        ? getGradeName(monthlyStats[type].averageGradeId, type)
        : 'N/A';
      averageGrade.innerHTML = `Average Grade: <strong>${averageGradeName}</strong>`;
      statsEl.appendChild(averageGrade);

      // Bar Chart
      renderGradeDistributionChart(type);
    } else {
      const noData = document.createElement('p');
      noData.textContent = 'No data for this month.';
      statsEl.appendChild(noData);
    }
  }

  displayStats('Bouldering', boulderingStatsEl);
  displayStats('Sports Climbing', sportsClimbingStatsEl);
}

// Calculate Monthly Stats
function calculateMonthlyStats(year, month) {
  const stats = {
    Bouldering: {
      gradeCounts: {},
      totalAttempts: 0,
      totalSends: 0,
      totalFlashesOnsights: 0,
      hardestRouteValue: 0,
      hardestRouteId: null,
      totalGradeValue: 0,
      totalGradeCount: 0,
      averageGradeValue: 0,
      averageGradeId: null
    },
    'Sports Climbing': {
      gradeCounts: {},
      totalAttempts: 0,
      totalSends: 0,
      totalFlashesOnsights: 0,
      hardestRouteValue: 0,
      hardestRouteId: null,
      totalGradeValue: 0,
      totalGradeCount: 0,
      averageGradeValue: 0,
      averageGradeId: null
    },
    hardestFlashOnsight: { Bouldering: null, 'Sports Climbing': null }
  };

  const startOfMonth = new Date(year, month, 1);
  const endOfMonth = new Date(year, month + 1, 0);

  const monthWorkouts = workouts.filter(w => isSameDateMonth(w.date, startOfMonth, endOfMonth));

  monthWorkouts.forEach(workout => {
    workout.grades.forEach(grade => {
      const gradeObj = grades.find(g => g.id === grade.gradeId && g.type === workout.type);
      if (!gradeObj) return;

      if (!stats[workout.type].gradeCounts[grade.gradeId]) {
        stats[workout.type].gradeCounts[grade.gradeId] = {
          attempts: 0,
          sends: 0,
          flashesOnsights: 0
        };
      }
      const gradeCountObj = stats[workout.type].gradeCounts[grade.gradeId];

      gradeCountObj.attempts += grade.attempts;
      gradeCountObj.sends += grade.sends;
      gradeCountObj.flashesOnsights += grade.flashesOnsights;

      stats[workout.type].totalAttempts += grade.attempts;
      stats[workout.type].totalSends += grade.sends;
      stats[workout.type].totalFlashesOnsights += grade.flashesOnsights;

      const gradeValue = gradeObj.gradeValue;

      // Update hardest route
      if (grade.sends > 0 && gradeValue > stats[workout.type].hardestRouteValue) {
        stats[workout.type].hardestRouteValue = gradeValue;
        stats[workout.type].hardestRouteId = grade.gradeId;
      }

      // Update hardest Flash/Onsight
      if (grade.flashesOnsights > 0 && gradeValue > (stats.hardestFlashOnsight[workout.type]?.gradeValue || 0)) {
        stats.hardestFlashOnsight[workout.type] = { gradeId: grade.gradeId, gradeValue };
      }

      // For average grade calculation
      stats[workout.type].totalGradeValue += gradeValue * grade.sends;
      stats[workout.type].totalGradeCount += grade.sends;
    });

    // Calculate average grade
    if (stats[workout.type].totalGradeCount > 0) {
      stats[workout.type].averageGradeValue =
        stats[workout.type].totalGradeValue / stats[workout.type].totalGradeCount;
      const avgGradeValue = Math.round(stats[workout.type].averageGradeValue);
      stats[workout.type].averageGradeId = avgGradeValue;
    }
  });

  return stats;
}

// Helper function to check if date is within the month
function isSameDateMonth(date, startOfMonth, endOfMonth) {
  return date >= startOfMonth && date <= endOfMonth;
}

// Function to render the grade distribution chart
function renderGradeDistributionChart(type) {
  const chartId = type === 'Bouldering' ? 'bouldering-grade-chart' : 'sports-climbing-grade-chart';
  const gradeCounts = calculateMonthlyStats(currentMonth.getFullYear(), currentMonth.getMonth())[type].gradeCounts;

  // Get the canvas element
  const canvas = document.getElementById(chartId);
  const ctx = canvas.getContext('2d');

  // Prepare data
  const gradeIds = Object.keys(gradeCounts)
    .map(id => parseInt(id))
    .sort((a, b) => a - b);

  const labels = gradeIds.map(id => getGradeName(id, type));

  const attemptsData = [];
  const sendsData = [];
  const flashesOnsightsData = [];
  const totalAttemptsPerGrade = [];

  gradeIds.forEach((gradeId, index) => {
    const counts = gradeCounts[gradeId];
    const attempts = counts.attempts;
    const sends = counts.sends;
    const flashesOnsights = counts.flashesOnsights;
    const failedAttempts = Math.max(0, attempts - sends);
    const sendsWithoutFlashes = Math.max(0, sends - flashesOnsights);

    attemptsData.push(failedAttempts);
    sendsData.push(sendsWithoutFlashes);
    flashesOnsightsData.push(flashesOnsights);
    totalAttemptsPerGrade.push(attempts);
  });

  // Destroy existing chart instance if any
  if (canvas.chart) {
    canvas.chart.destroy();
  }

  // Create stacked bar chart
  canvas.chart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [
        {
          label: 'Failed Attempts',
          data: attemptsData,
          backgroundColor: '#f56565', // Red
        },
        {
          label: 'Sends',
          data: sendsData,
          backgroundColor: '#48bb78', // Green
        },
        {
          label: type === 'Bouldering' ? 'Flashes' : 'Onsights',
          data: flashesOnsightsData,
          backgroundColor: '#4299e1', // Blue
        }
      ]
    },
    options: {
      scales: {
        x: {
          stacked: true,
          title: { display: false },
          ticks: {
            maxRotation: 0,
            minRotation: 0,
            autoSkip: false,
          }
        },
        y: {
          stacked: true,
          ticks: {
            display: false
          },
          grid: {
            display: false
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
        legend: { display: true }
      },
      barThickness: 15
    }
  });
}

// Local Storage Functions
function saveWorkoutsToStorage() {
  const workoutsData = workouts.map(workout => ({
    ...workout,
    date: workout.date.toISOString()
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

// Populate Grade Conversion Tables
function populateGradeConversionTables() {
  const boulderingTableBody = document.getElementById('gradeTable');
  const sportsClimbingTableBody = document.getElementById('sportsGradeTable');

  boulderingTableBody.innerHTML = '';
  sportsClimbingTableBody.innerHTML = '';

  const boulderingGrades = grades.filter(g => g.type === 'Bouldering');
  const sportsClimbingGrades = grades.filter(g => g.type === 'Sports Climbing');

  boulderingGrades.forEach(grade => {
    const row = document.createElement('tr');
    const americanCell = document.createElement('td');
    const frenchCell = document.createElement('td');

    americanCell.textContent = grade.american;
    frenchCell.textContent = grade.french;

    row.appendChild(americanCell);
    row.appendChild(frenchCell);
    boulderingTableBody.appendChild(row);
  });

  sportsClimbingGrades.forEach(grade => {
    const row = document.createElement('tr');
    const americanCell = document.createElement('td');
    const frenchCell = document.createElement('td');

    americanCell.textContent = grade.american;
    frenchCell.textContent = grade.french;

    row.appendChild(americanCell);
    row.appendChild(frenchCell);
    sportsClimbingTableBody.appendChild(row);
  });
}

// Export Data Function
function exportDataToCSV() {
  let csvContent = "data:text/csv;charset=utf-8,";
  csvContent += "Workout ID,Date,Workout Type,Grade (American),Grade (French),Attempts,Sends,Flashes/Onsights\n"; // Header

  workouts.forEach(workout => {
    workout.grades.forEach(grade => {
      const gradeAmerican = grades.find(g => g.id === grade.gradeId && g.type === workout.type)?.american || 'N/A';
      const gradeFrench = grades.find(g => g.id === grade.gradeId && g.type === workout.type)?.french || 'N/A';
      const row = [
        workout.id,
        workout.date.toISOString(),
        workout.type,
        gradeAmerican,
        gradeFrench,
        grade.attempts,
        grade.sends,
        grade.flashesOnsights
      ];
      csvContent += row.join(",") + "\n";
    });
  });

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "climbing_workouts.csv");
  document.body.appendChild(link);

  link.click();
  document.body.removeChild(link);
}

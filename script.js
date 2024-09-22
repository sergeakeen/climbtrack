// Data
const boulderingGrades = [
  "V0 (4)", "V1 (5)", "V2 (5+)", "V3 (6A)", "V4 (6B)", "V5 (6C)", "V6 (7A)",
  "V7 (7A+)", "V8 (7B)", "V9 (7C)", "V10 (7C+)", "V11 (8A)", "V12 (8A+)",
  "V13 (8B)", "V14 (8B+)", "V15 (8C)", "V16 (8C+)", "V17 (9A)"
];

const sportsClimbingGrades = [
  "4a", "4b", "4c", "5a", "5b", "5c", "6a", "6a+", "6b", "6b+", "6c", "6c+",
  "7a", "7a+", "7b", "7b+", "7c", "7c+", "8a", "8a+", "8b", "8b+", "8c", "8c+",
  "9a", "9a+", "9b", "9b+", "9c"
];

// Grade values for average calculation
const boulderingGradeValues = {};
boulderingGrades.forEach((grade, index) => {
  boulderingGradeValues[grade] = index + 1;
});

const sportsClimbingGradeValues = {};
sportsClimbingGrades.forEach((grade, index) => {
  sportsClimbingGradeValues[grade] = index + 1;
});

let selectedDate = new Date();
let currentMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
let workouts = [];
let currentWorkout = null;
let editingWorkoutId = null;
let selectedWorkoutType = null;

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
  loadWorkoutsFromStorage();
  renderCalendar();
  updateStatistics();
  setupEventListeners();
});

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
    const burgerMenu = document.getElementById('burgerMenu');
    if (!sideMenu.contains(e.target) && !burgerMenu.contains(e.target)) {
      sideMenu.classList.remove('open');
    }
  });

  // Menu Item Click Events
  document.getElementById('settingsItem').addEventListener('click', () => {
    // Open Settings Modal or perform settings action
    alert('Settings clicked');
  });

  document.getElementById('exportDataItem').addEventListener('click', () => {
    exportDataToCSV();
  });

  // Info Dialogs
  const openButton = document.getElementById('openDialog');
  const closeButton = document.getElementById('closeDialog');
  const dialog = document.getElementById('dialog');

  openButton.addEventListener('click', () => {
    dialog.style.display = 'flex';
  });

  closeButton.addEventListener('click', () => {
    dialog.style.display = 'none';
  });

  dialog.addEventListener('click', (e) => {
    if (e.target === dialog) {
      dialog.style.display = 'none';
    }
  });

  populateGradeTable();

  // Sports Grade Conversion Dialog
  const openSportsButton = document.getElementById('openSportsDialog');
  const closeSportsButton = document.getElementById('closeSportsDialog');
  const sportsDialog = document.getElementById('sportsDialog');

  openSportsButton.addEventListener('click', () => {
    sportsDialog.style.display = 'flex';
  });

  closeSportsButton.addEventListener('click', () => {
    sportsDialog.style.display = 'none';
  });

  sportsDialog.addEventListener('click', (e) => {
    if (e.target === sportsDialog) {
      sportsDialog.style.display = 'none';
    }
  });

  populateSportsGradeTable();
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

  const grades = selectedWorkoutType === 'Bouldering' ? boulderingGrades : sportsClimbingGrades;

  grades.forEach(gradeName => {
    const gradeItem = document.createElement('div');
    gradeItem.classList.add('grade-item');

    const gradeLabel = document.createElement('span');
    gradeLabel.textContent = gradeName;
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
      grade: gradeName,
      attempts: 0,
      sends: 0,
      flashesOnsights: 0
    };

    currentWorkout.grades.push(gradeData);

    // Event Listeners for Attempts Controls
    attemptsMinusButton.addEventListener('click', () => {
      gradeData.attempts = Math.max(0, gradeData.attempts - 1);
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
      sendsDisplay.textContent = gradeData.sends;
      validateInputs();
    });

    sendsPlusButton.addEventListener('click', () => {
      gradeData.sends += 1;
      sendsDisplay.textContent = gradeData.sends;
      validateInputs();
    });

    // Event Listeners for Flashes/Onsights Controls
    flashesMinusButton.addEventListener('click', () => {
      gradeData.flashesOnsights = Math.max(0, gradeData.flashesOnsights - 1);
      flashesDisplay.textContent = gradeData.flashesOnsights;
      validateInputs();
    });

    flashesPlusButton.addEventListener('click', () => {
      gradeData.flashesOnsights += 1;
      flashesDisplay.textContent = gradeData.flashesOnsights;
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
      existingGrade = currentWorkout.grades.find(g => g.grade === gradeName);
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
      alert(`For grade ${grade.grade}, sends cannot exceed attempts.`);
      return;
    }
    if (grade.flashesOnsights > grade.sends) {
      alert(`For grade ${grade.grade}, flashes/onsights cannot exceed sends.`);
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
      let text = `${grade.grade}: Attempts ${grade.attempts}, Sends ${grade.sends}`;
      if (grade.flashesOnsights) {
        text += `, ${selectedWorkoutType === 'Bouldering' ? 'Flashes' : 'Onsights'} ${grade.flashesOnsights}`;
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
      <p>${selectedWorkoutType === 'Bouldering' ? 'Flashes' : 'Onsights'}: <strong>${totalFlashesOnsights}</strong></p>
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
      hardestFlashOnsight.innerHTML = `Hardest ${type === 'Bouldering' ? 'Flash' : 'Onsight'}: <strong>${monthlyStats.hardestFlashOnsight[type] || 'N/A'}</strong>`;
      statsEl.appendChild(hardestFlashOnsight);

      const hardestRoute = document.createElement('p');
      hardestRoute.innerHTML = `Hardest Route: <strong>${monthlyStats[type].hardestRoute || 'N/A'}</strong>`;
      statsEl.appendChild(hardestRoute);

      const averageGrade = document.createElement('p');
      averageGrade.innerHTML = `Average Grade: <strong>${monthlyStats[type].averageGrade || 'N/A'}</strong>`;
      statsEl.appendChild(averageGrade);

      // Bar Chart
      renderGradeDistributionChart(type);

      // Comparison to Previous Month
      displayComparison(type, statsEl);
    } else {
      const noData = document.createElement('p');
      noData.textContent = 'No data for this month.';
      statsEl.appendChild(noData);
    }
  }

  displayStats('Bouldering', boulderingStatsEl);
  displayStats('Sports Climbing', sportsClimbingStatsEl);
}

// Modified calculateMonthlyStats function
function calculateMonthlyStats(year, month) {
  const stats = {
    Bouldering: {
      gradeCounts: {},
      totalAttempts: 0,
      totalSends: 0,
      totalFlashesOnsights: 0,
      hardestRoute: '',
      totalGradeValue: 0,
      totalGradeCount: 0,
      averageGradeValue: 0,
      averageGrade: ''
    },
    'Sports Climbing': {
      gradeCounts: {},
      totalAttempts: 0,
      totalSends: 0,
      totalFlashesOnsights: 0,
      hardestRoute: '',
      totalGradeValue: 0,
      totalGradeCount: 0,
      averageGradeValue: 0,
      averageGrade: ''
    },
    hardestFlashOnsight: { Bouldering: '', 'Sports Climbing': '' }
  };

  const startOfMonth = new Date(year, month, 1);
  const endOfMonth = new Date(year, month + 1, 0);

  const monthWorkouts = workouts.filter(w => isSameDateMonth(w.date, startOfMonth, endOfMonth));

  monthWorkouts.forEach(workout => {
    workout.grades.forEach(grade => {
      if (!stats[workout.type].gradeCounts[grade.grade]) {
        stats[workout.type].gradeCounts[grade.grade] = {
          attempts: 0,
          sends: 0,
          flashesOnsights: 0
        };
      }
      const gradeCountObj = stats[workout.type].gradeCounts[grade.grade];

      gradeCountObj.attempts += grade.attempts;
      gradeCountObj.sends += grade.sends;
      gradeCountObj.flashesOnsights += grade.flashesOnsights;

      stats[workout.type].totalAttempts += grade.attempts;
      stats[workout.type].totalSends += grade.sends;
      stats[workout.type].totalFlashesOnsights += grade.flashesOnsights;

      const gradesList = workout.type === 'Bouldering' ? boulderingGrades : sportsClimbingGrades;
      const gradeValues = workout.type === 'Bouldering' ? boulderingGradeValues : sportsClimbingGradeValues;
      const gradeIndex = gradesList.indexOf(grade.grade);
      const gradeValue = gradeValues[grade.grade];

      // Update hardest route
      const currentHardestIndex = gradesList.indexOf(stats[workout.type].hardestRoute);
      if (grade.sends > 0 && gradeIndex > currentHardestIndex) {
        stats[workout.type].hardestRoute = grade.grade;
      }

      // Update hardest Flash/Onsight
      if (grade.flashesOnsights > 0) {
        const currentHardestFlashIndex = gradesList.indexOf(stats.hardestFlashOnsight[workout.type]);
        if (gradeIndex > currentHardestFlashIndex) {
          stats.hardestFlashOnsight[workout.type] = grade.grade;
        }
      }

      // For average grade calculation
      stats[workout.type].totalGradeValue += gradeValue * grade.sends;
      stats[workout.type].totalGradeCount += grade.sends;
    });

    // Calculate average grade
    if (stats[workout.type].totalGradeCount > 0) {
      stats[workout.type].averageGradeValue =
        stats[workout.type].totalGradeValue / stats[workout.type].totalGradeCount;
      const avgIndex = Math.round(stats[workout.type].averageGradeValue) - 1;
      const gradeList = workout.type === 'Bouldering' ? boulderingGrades : sportsClimbingGrades;
      stats[workout.type].averageGrade = gradeList[avgIndex] || 'N/A';
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
  const labels = Object.keys(gradeCounts);
  const attemptsData = [];
  const sendsData = [];
  const flashesOnsightsData = [];

  labels.forEach(grade => {
    const counts = gradeCounts[grade];
    const attempts = counts.attempts;
    const sends = counts.sends;
    const flashesOnsights = counts.flashesOnsights;
    const failedAttempts = Math.max(0, attempts - sends);
    const sendsWithoutFlashes = Math.max(0, sends - flashesOnsights);

    attemptsData.push(failedAttempts);
    sendsData.push(sendsWithoutFlashes);
    flashesOnsightsData.push(flashesOnsights);
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
          label: 'Attempts',
          data: attemptsData,
          backgroundColor: '#f56565', // Red
        },
        {
          label: 'Sends',
          data: sendsData,
          backgroundColor: '#48bb78', // Green
        },
        {
          label: 'Flashes/Onsights',
          data: flashesOnsightsData,
          backgroundColor: '#4299e1', // Blue
        }
      ]
    },
    options: {
      scales: {
        x: {
          stacked: true,
          title: { display: true, text: 'Grades' },
          ticks: {
            maxRotation: 90,
            minRotation: 90,
            autoSkip: false,
          }
        },
        y: {
          stacked: true,
          ticks: {
            display: false // Remove Y-axis ticks and labels
          },
          grid: {
            display: false
          }
        }
      },
      plugins: {
        legend: { display: true }
      },
      barThickness: 15 // Adjusted bar thickness to make bars narrower
    }
  });
}

// Function to display comparison with previous month
function displayComparison(type, statsEl) {
  const prevMonthDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1);
  const prevMonthStats = calculateMonthlyStats(prevMonthDate.getFullYear(), prevMonthDate.getMonth());

  const prevStats = prevMonthStats[type];
  const currentStats = calculateMonthlyStats(currentMonth.getFullYear(), currentMonth.getMonth())[type];

  const comparisonHeader = document.createElement('h3');
  comparisonHeader.textContent = 'Comparison to Previous Month';
  statsEl.appendChild(comparisonHeader);

  if (prevStats && prevStats.totalAttempts > 0) {
    const gradeList = type === 'Bouldering' ? boulderingGrades : sportsClimbingGrades;

    // Total Attempts
    const currentTotalAttempts = currentStats.totalAttempts;
    const prevTotalAttempts = prevStats.totalAttempts;
    const totalAttemptsChange = ((currentTotalAttempts - prevTotalAttempts) / prevTotalAttempts) * 100;

    const totalAttemptsComp = document.createElement('p');
    totalAttemptsComp.innerHTML = `Total attempts last month: <strong>${prevTotalAttempts}</strong> `;
    const totalAttemptsChangeEl = document.createElement('small');
    totalAttemptsChangeEl.style.color = totalAttemptsChange >= 0 ? 'green' : 'red';
    const arrow = totalAttemptsChange >= 0 ? '↑' : '↓';
    totalAttemptsChangeEl.innerHTML = `${arrow} ${Math.abs(totalAttemptsChange.toFixed(1))}%`;
    totalAttemptsComp.appendChild(totalAttemptsChangeEl);
    statsEl.appendChild(totalAttemptsComp);

    // Hardest Route
    const currentHardestIndex = gradeList.indexOf(currentStats.hardestRoute);
    const prevHardestIndex = gradeList.indexOf(prevStats.hardestRoute);
    const hardestRouteChange = currentHardestIndex - prevHardestIndex;

    const hardestRouteComp = document.createElement('p');
    hardestRouteComp.innerHTML = `Hardest Route last month: <strong>${prevStats.hardestRoute || 'N/A'}</strong> `;
    const hardestRouteChangeEl = document.createElement('small');

    if (hardestRouteChange > 0) {
      hardestRouteChangeEl.style.color = 'green';
      hardestRouteChangeEl.innerHTML = `↑ ${currentStats.hardestRoute}`;
    } else if (hardestRouteChange < 0) {
      hardestRouteChangeEl.style.color = 'red';
      hardestRouteChangeEl.innerHTML = `↓ ${currentStats.hardestRoute}`;
    } else {
      hardestRouteChangeEl.innerHTML = 'No change';
    }

    hardestRouteComp.appendChild(hardestRouteChangeEl);
    statsEl.appendChild(hardestRouteComp);

    // You can repeat similar calculations for totalSends, totalFlashesOnsights, etc.
  } else {
    const noData = document.createElement('p');
    noData.textContent = 'No data for previous month.';
    statsEl.appendChild(noData);
  }
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

// Grade Conversion Data
const gradeConversionTable = [
  { american: "V0", french: "4" },
  { american: "V1", french: "5" },
  { american: "V2", french: "5+" },
  { american: "V3", french: "6A-6A+" },
  { american: "V4", french: "6B-6B+" },
  { american: "V5", french: "6C-6C+" },
  { american: "V6", french: "7A" },
  { american: "V7", french: "7A+" },
  { american: "V8", french: "7B-7B+" },
  { american: "V9", french: "7C" },
  { american: "V10", french: "7C+" },
  { american: "V11", french: "8A" },
  { american: "V12", french: "8A+" },
  { american: "V13", french: "8B" },
  { american: "V14", french: "8B+" },
  { american: "V15", french: "8C" },
  { american: "V16", french: "8C+" },
  { american: "V17", french: "9A" },
];

function populateGradeTable() {
  const tableBody = document.getElementById('gradeTable');
  tableBody.innerHTML = ''; // Clear existing content
  gradeConversionTable.forEach(grade => {
    const row = document.createElement('tr');
    const americanCell = document.createElement('td');
    const frenchCell = document.createElement('td');

    americanCell.textContent = grade.american;
    frenchCell.textContent = grade.french;

    row.appendChild(americanCell);
    row.appendChild(frenchCell);
    tableBody.appendChild(row);
  });
}

// Sports Climbing Grade Conversion Data
const sportsGradeConversionTable = [
  { french: "4a", yosemite: "5.5" },
  { french: "4b", yosemite: "5.6" },
  { french: "4c", yosemite: "5.7" },
  { french: "5a", yosemite: "5.8" },
  { french: "5b", yosemite: "5.9" },
  { french: "5c", yosemite: "5.10a" },
  { french: "6a", yosemite: "5.10b" },
  { french: "6a+", yosemite: "5.10c" },
  { french: "6b", yosemite: "5.10d" },
  { french: "6b+", yosemite: "5.11a" },
  { french: "6c", yosemite: "5.11b" },
  { french: "6c+", yosemite: "5.11c" },
  { french: "7a", yosemite: "5.11d" },
  { french: "7a+", yosemite: "5.12a" },
  { french: "7b", yosemite: "5.12b" },
  { french: "7b+", yosemite: "5.12c" },
  { french: "7c", yosemite: "5.12d" },
  { french: "7c+", yosemite: "5.13a" },
  { french: "8a", yosemite: "5.13b" },
  { french: "8a+", yosemite: "5.13c" },
  { french: "8b", yosemite: "5.13d" },
  { french: "8b+", yosemite: "5.14a" },
  { french: "8c", yosemite: "5.14b" },
  { french: "8c+", yosemite: "5.14c" },
  { french: "9a", yosemite: "5.14d" },
  { french: "9a+", yosemite: "5.15a" },
  { french: "9b", yosemite: "5.15b" },
  { french: "9b+", yosemite: "5.15c" },
  { french: "9c", yosemite: "5.15d" },
];

function populateSportsGradeTable() {
  const tableBody = document.getElementById('sportsGradeTable');
  tableBody.innerHTML = ''; // Clear existing content
  sportsGradeConversionTable.forEach(grade => {
    const row = document.createElement('tr');
    const frenchCell = document.createElement('td');
    const yosemiteCell = document.createElement('td');

    frenchCell.textContent = grade.french;
    yosemiteCell.textContent = grade.yosemite;

    row.appendChild(frenchCell);
    row.appendChild(yosemiteCell);
    tableBody.appendChild(row);
  });
}

// Export Data Function
function exportDataToCSV() {
  let csvContent = "data:text/csv;charset=utf-8,";
  csvContent += "Workout ID,Date,Workout Type,Grade,Attempts,Sends,Flashes/Onsights\n"; // Header

  workouts.forEach(workout => {
    workout.grades.forEach(grade => {
      const row = [
        workout.id,
        workout.date.toISOString(),
        workout.type,
        grade.grade,
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
  document.body.appendChild(link); // Required for FF

  link.click();
  document.body.removeChild(link);
}

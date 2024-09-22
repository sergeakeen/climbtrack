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

    // Attempts Counter
    const attemptsControls = document.createElement('div');
    attemptsControls.classList.add('attempts-controls');

    const attemptsMinusButton = document.createElement('button');
    attemptsMinusButton.classList.add('attempts-button');
    attemptsMinusButton.textContent = '-';

    const attemptsDisplay = document.createElement('span');
    attemptsDisplay.classList.add('attempts-display');
    attemptsDisplay.textContent = '0';

    const attemptsPlusButton = document.createElement('button');
    attemptsPlusButton.classList.add('attempts-button');
    attemptsPlusButton.textContent = '+';

    attemptsControls.appendChild(attemptsMinusButton);
    attemptsControls.appendChild(attemptsDisplay);
    attemptsControls.appendChild(attemptsPlusButton);

    gradeControls.appendChild(attemptsControls);

    // Split Button for Flash/Onsight
    const splitButton = document.createElement('div');
    splitButton.classList.add('split-button');

    const flashButton = document.createElement('button');
    flashButton.classList.add('split-button-half');
    flashButton.textContent = 'Flash';

    const onsiteButton = document.createElement('button');
    onsiteButton.classList.add('split-button-half');
    onsiteButton.textContent = 'Onsight';

    // Conditionally display Flash/Onsight buttons
    if (selectedWorkoutType === 'Bouldering') {
      // Remove Onsight button for Bouldering
      splitButton.appendChild(flashButton);
    } else {
      // Remove Flash button for Sports Climbing
      splitButton.appendChild(onsiteButton);
    }

    gradeControls.appendChild(splitButton);

    // Count Controls
    const countControls = document.createElement('div');
    countControls.classList.add('count-controls');

    const minusButton = document.createElement('button');
    minusButton.classList.add('count-button');
    minusButton.textContent = '-';

    const countDisplay = document.createElement('span');
    countDisplay.classList.add('count-display');
    countDisplay.textContent = '0';

    const plusButton = document.createElement('button');
    plusButton.classList.add('count-button');
    plusButton.textContent = '+';

    countControls.appendChild(minusButton);
    countControls.appendChild(countDisplay);
    countControls.appendChild(plusButton);

    gradeControls.appendChild(countControls);
    gradeItem.appendChild(gradeControls);
    gradeList.appendChild(gradeItem);

    // Initialize grade data
    let gradeData = {
      grade: gradeName,
      type: null, // 'flash' or 'onsight'
      count: 0,
      attempts: 0 // Default attempts to 0
    };

    currentWorkout.grades.push(gradeData);

    // Event Listeners for Attempts Counter
    attemptsMinusButton.addEventListener('click', () => {
      gradeData.attempts = Math.max(0, gradeData.attempts - 1);
      attemptsDisplay.textContent = gradeData.attempts;
      // Disable Flash/Onsight if attempts > 1
      checkAttemptAndDisableFlashOnsight();
    });

    attemptsPlusButton.addEventListener('click', () => {
      gradeData.attempts += 1;
      attemptsDisplay.textContent = gradeData.attempts;
      // Disable Flash/Onsight if attempts > 1
      checkAttemptAndDisableFlashOnsight();
    });

    // Function to check attempts and disable Flash/Onsight
    function checkAttemptAndDisableFlashOnsight() {
      if (gradeData.attempts > 1) {
        if (flashButton) {
          flashButton.disabled = true;
          flashButton.classList.remove('selected');
          if (gradeData.type === 'flash') gradeData.type = null;
        }
        if (onsiteButton) {
          onsiteButton.disabled = true;
          onsiteButton.classList.remove('selected');
          if (gradeData.type === 'onsight') gradeData.type = null;
        }
      } else {
        if (flashButton) flashButton.disabled = false;
        if (onsiteButton) onsiteButton.disabled = false;
      }
    }

    // Event Listeners for Flash/Onsight Buttons
    if (flashButton) {
      flashButton.addEventListener('click', () => {
        if (selectedWorkoutType !== 'Bouldering') return; // Prevent assigning flash to non-bouldering
        if (gradeData.type === 'flash') {
          gradeData.type = null;
          flashButton.classList.remove('selected');
        } else {
          gradeData.type = 'flash';
          flashButton.classList.add('selected');
          if (onsiteButton) onsiteButton.classList.remove('selected');
          if (gradeData.count < 1) {
            gradeData.count = 1;
            countDisplay.textContent = gradeData.count;
          }
          // Set attempts to 1 if zero
          if (gradeData.attempts === 0) {
            gradeData.attempts = 1;
            attemptsDisplay.textContent = gradeData.attempts;
          }
        }
      });
    }

    if (onsiteButton) {
      onsiteButton.addEventListener('click', () => {
        if (selectedWorkoutType !== 'Sports Climbing') return; // Prevent assigning onsight to non-sports climbing
        if (gradeData.type === 'onsight') {
          gradeData.type = null;
          onsiteButton.classList.remove('selected');
        } else {
          gradeData.type = 'onsight';
          onsiteButton.classList.add('selected');
          if (flashButton) flashButton.classList.remove('selected');
          if (gradeData.count < 1) {
            gradeData.count = 1;
            countDisplay.textContent = gradeData.count;
          }
          // Set attempts to 1 if zero
          if (gradeData.attempts === 0) {
            gradeData.attempts = 1;
            attemptsDisplay.textContent = gradeData.attempts;
          }
        }
      });
    }

    // Event Listeners for Count Controls
    minusButton.addEventListener('click', () => {
      gradeData.count = Math.max(0, gradeData.count - 1);
      countDisplay.textContent = gradeData.count;
    });

    plusButton.addEventListener('click', () => {
      gradeData.count += 1;
      countDisplay.textContent = gradeData.count;
      // If attempts are zero, set attempts to 1
      if (gradeData.attempts === 0) {
        gradeData.attempts = 1;
        attemptsDisplay.textContent = gradeData.attempts;
      }
    });

    // If editing, load existing data
    let existingGrade;
    if (editingWorkoutId) {
      existingGrade = currentWorkout.grades.find(g => g.grade === gradeName);
    }

    if (existingGrade) {
      gradeData.count = existingGrade.count;
      gradeData.type = existingGrade.type;
      gradeData.attempts = existingGrade.attempts || 0;
      countDisplay.textContent = gradeData.count;
      attemptsDisplay.textContent = gradeData.attempts;
      if (gradeData.type === 'flash' && flashButton) {
        flashButton.classList.add('selected');
      } else if (gradeData.type === 'onsight' && onsiteButton) {
        onsiteButton.classList.add('selected');
      }
      checkAttemptAndDisableFlashOnsight();
    }
  });

  openModal('grade-selection-modal');
}

// Save Workout
function saveWorkout() {
  // Filter out grades with zero attempts
  currentWorkout.grades = currentWorkout.grades.filter(g => g.attempts > 0);

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
      let text = `${grade.grade} x${grade.count}`;
      if (grade.attempts) text += ` (${grade.attempts} attempts)`;
      if (grade.type) text += ` (${grade.type})`;
      gradeText.textContent = text;
      gradesList.appendChild(gradeText);
    });

    workoutItem.appendChild(gradesList);

    // Stats
    const stats = document.createElement('div');
    stats.classList.add('workout-summary-stats');

    const totalRoutes = workout.grades.reduce((sum, grade) => sum + grade.count, 0);
    const totalFlashes = workout.grades.reduce((sum, grade) => sum + (grade.type === 'flash' ? grade.count : 0), 0);
    const totalOnsights = workout.grades.reduce((sum, grade) => sum + (grade.type === 'onsight' ? grade.count : 0), 0);

    stats.innerHTML = `
      <p>Total routes climbed: <strong>${totalRoutes}</strong></p>
      <p>Flashes: <strong>${totalFlashes}</strong></p>
      <p>Onsights: <strong>${totalOnsights}</strong></p>
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
    if (monthlyStats[type] && monthlyStats[type].totalRoutes > 0) {
      const totalRoutes = document.createElement('p');
      totalRoutes.innerHTML = `Total routes climbed: <strong>${monthlyStats[type].totalRoutes}</strong>`;
      statsEl.appendChild(totalRoutes);

      const totalAttempts = document.createElement('p');
      totalAttempts.innerHTML = `Total attempts: <strong>${monthlyStats[type].totalAttempts}</strong>`;
      statsEl.appendChild(totalAttempts);

      const hardestFlash = document.createElement('p');
      hardestFlash.innerHTML = `Hardest Flash: <strong>${monthlyStats.hardestFlash[type] || 'N/A'}</strong>`;
      statsEl.appendChild(hardestFlash);

      const hardestOnsite = document.createElement('p');
      hardestOnsite.innerHTML = `Hardest Onsight: <strong>${monthlyStats.hardestOnsite[type] || 'N/A'}</strong>`;
      statsEl.appendChild(hardestOnsite);

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
      totalRoutes: 0,
      totalAttempts: 0,
      hardestRoute: '',
      totalGradeValue: 0,
      totalGradeCount: 0,
      averageGradeValue: 0,
      averageGrade: ''
    },
    'Sports Climbing': {
      gradeCounts: {},
      totalRoutes: 0,
      totalAttempts: 0,
      hardestRoute: '',
      totalGradeValue: 0,
      totalGradeCount: 0,
      averageGradeValue: 0,
      averageGrade: ''
    },
    hardestFlash: { Bouldering: '', 'Sports Climbing': '' },
    hardestOnsite: { Bouldering: '', 'Sports Climbing': '' }
  };

  const startOfMonth = new Date(year, month, 1);
  const endOfMonth = new Date(year, month + 1, 0);

  const monthWorkouts = workouts.filter(w => isSameDateMonth(w.date, startOfMonth, endOfMonth));

  monthWorkouts.forEach(workout => {
    workout.grades.forEach(grade => {
      if (!stats[workout.type].gradeCounts[grade.grade]) {
        stats[workout.type].gradeCounts[grade.grade] = {
          sends: 0,
          attempts: 0,
          flashesOnsights: 0
        };
      }
      const gradeCountObj = stats[workout.type].gradeCounts[grade.grade];

      gradeCountObj.sends += grade.count;
      gradeCountObj.attempts += grade.attempts;
      if (grade.type === 'flash' || grade.type === 'onsight') {
        gradeCountObj.flashesOnsights += grade.count;
      }

      stats[workout.type].totalRoutes += grade.count;
      stats[workout.type].totalAttempts += grade.attempts;

      const gradesList = workout.type === 'Bouldering' ? boulderingGrades : sportsClimbingGrades;
      const gradeValues = workout.type === 'Bouldering' ? boulderingGradeValues : sportsClimbingGradeValues;
      const gradeIndex = gradesList.indexOf(grade.grade);
      const gradeValue = gradeValues[grade.grade];

      // Update hardest route
      const currentHardestIndex = gradesList.indexOf(stats[workout.type].hardestRoute);
      if (gradeIndex > currentHardestIndex) {
        stats[workout.type].hardestRoute = grade.grade;
      }

      // Update hardest Flash
      if (grade.type === 'flash') {
        const currentHardestFlashIndex = gradesList.indexOf(stats.hardestFlash[workout.type]);
        if (gradeIndex > currentHardestFlashIndex) {
          stats.hardestFlash[workout.type] = grade.grade;
        }
      }

      // Update hardest Onsight
      if (grade.type === 'onsight') {
        const currentHardestOnsiteIndex = gradesList.indexOf(stats.hardestOnsite[workout.type]);
        if (gradeIndex > currentHardestOnsiteIndex) {
          stats.hardestOnsite[workout.type] = grade.grade;
        }
      }

      // For average grade calculation
      stats[workout.type].totalGradeValue += gradeValue * grade.count;
      stats[workout.type].totalGradeCount += grade.count;
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
  const failedAttemptsData = [];
  const sendsData = [];
  const flashesOnsightsData = [];

  labels.forEach(grade => {
    const counts = gradeCounts[grade];
    const attempts = counts.attempts;
    const sends = counts.sends;
    const flashesOnsights = counts.flashesOnsights;
    const failedAttempts = Math.max(0, attempts - sends);

    const sendsWithoutFlashes = Math.max(0, sends - flashesOnsights);

    failedAttemptsData.push(failedAttempts);
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
          label: 'Failed Attempts',
          data: failedAttemptsData,
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

  if (prevStats && prevStats.totalRoutes > 0) {
    const gradeList = type === 'Bouldering' ? boulderingGrades : sportsClimbingGrades;

    // Total Routes
    const currentTotalRoutes = currentStats.totalRoutes;
    const prevTotalRoutes = prevStats.totalRoutes;
    const totalRoutesChange = ((currentTotalRoutes - prevTotalRoutes) / prevTotalRoutes) * 100;

    const totalRoutesComp = document.createElement('p');
    totalRoutesComp.innerHTML = `Total routes climbed last month: <strong>${prevTotalRoutes}</strong> `;
    const totalRoutesChangeEl = document.createElement('small');
    totalRoutesChangeEl.style.color = totalRoutesChange >= 0 ? 'green' : 'red';
    const arrow = totalRoutesChange >= 0 ? '↑' : '↓';
    totalRoutesChangeEl.innerHTML = `${arrow} ${Math.abs(totalRoutesChange.toFixed(1))}%`;
    totalRoutesComp.appendChild(totalRoutesChangeEl);
    statsEl.appendChild(totalRoutesComp);

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

    // You can repeat similar calculations for totalAttempts, hardestFlash, hardestOnsite
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
  csvContent += "Workout ID,Date,Workout Type,Grade,Attempts,Sends,Type\n"; // Header

  workouts.forEach(workout => {
    workout.grades.forEach(grade => {
      let type = '';
      if ((workout.type === 'Bouldering' && grade.type === 'flash') ||
          (workout.type === 'Sports Climbing' && grade.type === 'onsight')) {
        type = grade.type;
      }
      const row = [
        workout.id,
        workout.date.toISOString(),
        workout.type,
        grade.grade,
        grade.attempts,
        grade.count,
        type
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

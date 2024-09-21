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

      dayWorkouts.forEach(workout => {
        const dot = document.createElement('div');
        dot.classList.add('indicator-dot');
        if (workout.type === 'Bouldering') {
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
}

// Open Grade Selection Modal
function openGradeSelectionModal() {
  currentWorkout = {
    id: Date.now().toString(),
    date: selectedDate,
    type: selectedWorkoutType,
    grades: []
  };

  const gradeModalTitle = document.getElementById('grade-modal-title');
  gradeModalTitle.textContent = `${selectedWorkoutType} Workout`;

  const gradeList = document.getElementById('grade-list');
  gradeList.innerHTML = '';

  const grades = selectedWorkoutType === 'Bouldering' ? boulderingGrades : sportsClimbingGrades;

  grades.forEach(grade => {
    const gradeItem = document.createElement('div');
    gradeItem.classList.add('grade-item');

    const gradeLabel = document.createElement('span');
    gradeLabel.textContent = grade;
    gradeItem.appendChild(gradeLabel);

    const gradeControls = document.createElement('div');
    gradeControls.classList.add('grade-controls');

    // Split Button for Flash/Onsite
    const splitButton = document.createElement('div');
    splitButton.classList.add('split-button');

    const flashButton = document.createElement('button');
    flashButton.classList.add('split-button-half');
    flashButton.textContent = 'Flash';
    flashButton.addEventListener('click', () => {
      selectGradeType(grade, 'flash', flashButton, onsiteButton);
    });

    const onsiteButton = document.createElement('button');
    onsiteButton.classList.add('split-button-half');
    onsiteButton.textContent = 'Onsite';
    onsiteButton.addEventListener('click', () => {
      selectGradeType(grade, 'onsite', onsiteButton, flashButton);
    });

    splitButton.appendChild(flashButton);
    splitButton.appendChild(onsiteButton);

    gradeControls.appendChild(splitButton);

    // Count Controls
    const countControls = document.createElement('div');
    countControls.classList.add('count-controls');

    const minusButton = document.createElement('button');
    minusButton.classList.add('count-button');
    minusButton.textContent = '-';
    minusButton.addEventListener('click', () => {
      adjustGradeCount(grade, -1);
    });
    countControls.appendChild(minusButton);

    const countDisplay = document.createElement('span');
    countDisplay.classList.add('count-display');
    countDisplay.textContent = '0';
    countControls.appendChild(countDisplay);

    const plusButton = document.createElement('button');
    plusButton.classList.add('count-button');
    plusButton.textContent = '+';
    plusButton.addEventListener('click', () => {
      adjustGradeCount(grade, 1);
    });
    countControls.appendChild(plusButton);

    gradeControls.appendChild(countControls);

    gradeItem.appendChild(gradeControls);
    gradeList.appendChild(gradeItem);

    // Store references for updates
    currentWorkout.grades.push({
      grade: grade,
      type: null, // 'flash' or 'onsite'
      count: 0,
      elements: {
        flashButton: flashButton,
        onsiteButton: onsiteButton,
        countDisplay: countDisplay
      }
    });
  });

  openModal('grade-selection-modal');
}

// Handle Grade Type Selection
function selectGradeType(grade, type, selectedButton, otherButton) {
  const gradeObj = currentWorkout.grades.find(g => g.grade === grade);
  if (gradeObj) {
    // Toggle selection
    if (gradeObj.type === type) {
      // Deselect if already selected
      gradeObj.type = null;
      selectedButton.classList.remove('selected');
    } else {
      gradeObj.type = type;
      selectedButton.classList.add('selected');
      otherButton.classList.remove('selected');
      // Set count to at least 1
      if (gradeObj.count < 1) {
        gradeObj.count = 1;
        gradeObj.elements.countDisplay.textContent = gradeObj.count;
      }
    }
  }
}

// Adjust Grade Count
function adjustGradeCount(grade, delta) {
  const gradeObj = currentWorkout.grades.find(g => g.grade === grade);
  if (gradeObj) {
    let newCount = gradeObj.count + delta;
    if (newCount < 0) newCount = 0;
    // If type is selected (flash or onsite), count cannot be less than 1
    if (gradeObj.type && newCount < 1) newCount = 1;
    gradeObj.count = newCount;
    gradeObj.elements.countDisplay.textContent = gradeObj.count;
  }
}

// Save Workout
function saveWorkout() {
  // Filter out grades with zero count
  currentWorkout.grades = currentWorkout.grades.filter(g => g.count > 0);

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
    const totalOnsights = workout.grades.reduce((sum, grade) => sum + (grade.type === 'onsite' ? grade.count : 0), 0);

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
  currentWorkout = JSON.parse(JSON.stringify(workout));
  editingWorkoutId = workout.id;
  selectedWorkoutType = workout.type;

  const gradeModalTitle = document.getElementById('grade-modal-title');
  gradeModalTitle.textContent = `${selectedWorkoutType} Workout`;

  const gradeList = document.getElementById('grade-list');
  gradeList.innerHTML = '';

  const grades = selectedWorkoutType === 'Bouldering' ? boulderingGrades : sportsClimbingGrades;

  grades.forEach(grade => {
    const gradeItem = document.createElement('div');
    gradeItem.classList.add('grade-item');

    const gradeLabel = document.createElement('span');
    gradeLabel.textContent = grade;
    gradeItem.appendChild(gradeLabel);

    const gradeControls = document.createElement('div');
    gradeControls.classList.add('grade-controls');

    // Split Button for Flash/Onsite
    const splitButton = document.createElement('div');
    splitButton.classList.add('split-button');

    const flashButton = document.createElement('button');
    flashButton.classList.add('split-button-half');
    flashButton.textContent = 'Flash';
    flashButton.addEventListener('click', () => {
      selectGradeType(grade, 'flash', flashButton, onsiteButton);
    });

    const onsiteButton = document.createElement('button');
    onsiteButton.classList.add('split-button-half');
    onsiteButton.textContent = 'Onsite';
    onsiteButton.addEventListener('click', () => {
      selectGradeType(grade, 'onsite', onsiteButton, flashButton);
    });

    splitButton.appendChild(flashButton);
    splitButton.appendChild(onsiteButton);

    gradeControls.appendChild(splitButton);

    // Count Controls
    const countControls = document.createElement('div');
    countControls.classList.add('count-controls');

    const minusButton = document.createElement('button');
    minusButton.classList.add('count-button');
    minusButton.textContent = '-';
    minusButton.addEventListener('click', () => {
      adjustGradeCount(grade, -1);
    });
    countControls.appendChild(minusButton);

    const countDisplay = document.createElement('span');
    countDisplay.classList.add('count-display');
    countDisplay.textContent = '0';
    countControls.appendChild(countDisplay);

    const plusButton = document.createElement('button');
    plusButton.classList.add('count-button');
    plusButton.textContent = '+';
    plusButton.addEventListener('click', () => {
      adjustGradeCount(grade, 1);
    });
    countControls.appendChild(plusButton);

    gradeControls.appendChild(countControls);

    gradeItem.appendChild(gradeControls);
    gradeList.appendChild(gradeItem);

    // Store references for updates
    const existingGrade = currentWorkout.grades.find(g => g.grade === grade);
    if (existingGrade) {
      if (existingGrade.type === 'flash') {
        flashButton.classList.add('selected');
      } else if (existingGrade.type === 'onsite') {
        onsiteButton.classList.add('selected');
      }
      countDisplay.textContent = existingGrade.count;
      existingGrade.elements = {
        flashButton: flashButton,
        onsiteButton: onsiteButton,
        countDisplay: countDisplay
      };
    } else {
      currentWorkout.grades.push({
        grade: grade,
        type: null,
        count: 0,
        elements: {
          flashButton: flashButton,
          onsiteButton: onsiteButton,
          countDisplay: countDisplay
        }
      });
    }
  });

  closeModal('workout-summary-modal');
  openModal('grade-selection-modal');
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

  const monthlyStats = calculateMonthlyStats();

  // Bouldering Stats
  if (monthlyStats.Bouldering) {
    for (const [grade, count] of Object.entries(monthlyStats.Bouldering.gradeCounts)) {
      const statItem = document.createElement('div');
      statItem.classList.add('grade-item');
      statItem.innerHTML = `<span>${grade}</span><span>${count}</span>`;
      boulderingStatsEl.appendChild(statItem);
    }

    const totalRoutes = document.createElement('p');
    totalRoutes.innerHTML = `Total routes climbed: <strong>${monthlyStats.Bouldering.totalRoutes}</strong>`;
    boulderingStatsEl.appendChild(totalRoutes);

    const hardestRoute = document.createElement('p');
    hardestRoute.innerHTML = `Hardest route: <strong>${monthlyStats.Bouldering.hardestRoute || 'N/A'}</strong>`;
    boulderingStatsEl.appendChild(hardestRoute);

    const hardestFlash = document.createElement('p');
    hardestFlash.innerHTML = `Hardest Flash: <strong>${monthlyStats.hardestFlash.Bouldering || 'N/A'}</strong>`;
    boulderingStatsEl.appendChild(hardestFlash);

    const hardestOnsite = document.createElement('p');
    hardestOnsite.innerHTML = `Hardest Onsite: <strong>${monthlyStats.hardestOnsite.Bouldering || 'N/A'}</strong>`;
    boulderingStatsEl.appendChild(hardestOnsite);
  }

  // Sports Climbing Stats
  if (monthlyStats['Sports Climbing']) {
    for (const [grade, count] of Object.entries(monthlyStats['Sports Climbing'].gradeCounts)) {
      const statItem = document.createElement('div');
      statItem.classList.add('grade-item');
      statItem.innerHTML = `<span>${grade}</span><span>${count}</span>`;
      sportsClimbingStatsEl.appendChild(statItem);
    }

    const totalRoutes = document.createElement('p');
    totalRoutes.innerHTML = `Total routes climbed: <strong>${monthlyStats['Sports Climbing'].totalRoutes}</strong>`;
    sportsClimbingStatsEl.appendChild(totalRoutes);

    const hardestRoute = document.createElement('p');
    hardestRoute.innerHTML = `Hardest route: <strong>${monthlyStats['Sports Climbing'].hardestRoute || 'N/A'}</strong>`;
    sportsClimbingStatsEl.appendChild(hardestRoute);

    const hardestFlash = document.createElement('p');
    hardestFlash.innerHTML = `Hardest Flash: <strong>${monthlyStats.hardestFlash['Sports Climbing'] || 'N/A'}</strong>`;
    sportsClimbingStatsEl.appendChild(hardestFlash);

    const hardestOnsite = document.createElement('p');
    hardestOnsite.innerHTML = `Hardest Onsite: <strong>${monthlyStats.hardestOnsite['Sports Climbing'] || 'N/A'}</strong>`;
    sportsClimbingStatsEl.appendChild(hardestOnsite);
  }
}

// Calculate Monthly Stats
function calculateMonthlyStats() {
  const stats = {
    Bouldering: { gradeCounts: {}, totalRoutes: 0, hardestRoute: '' },
    'Sports Climbing': { gradeCounts: {}, totalRoutes: 0, hardestRoute: '' },
    hardestFlash: { Bouldering: '', 'Sports Climbing': '' },
    hardestOnsite: { Bouldering: '', 'Sports Climbing': '' }
  };

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  const startOfMonth = new Date(year, month, 1);
  const endOfMonth = new Date(year, month + 1, 0);

  const monthWorkouts = workouts.filter(w => w.date >= startOfMonth && w.date <= endOfMonth);

  monthWorkouts.forEach(workout => {
    if (!stats[workout.type]) {
      stats[workout.type] = { gradeCounts: {}, totalRoutes: 0, hardestRoute: '' };
    }

    workout.grades.forEach(grade => {
      if (!stats[workout.type].gradeCounts[grade.grade]) {
        stats[workout.type].gradeCounts[grade.grade] = 0;
      }
      stats[workout.type].gradeCounts[grade.grade] += grade.count;
      stats[workout.type].totalRoutes += grade.count;

      const gradesList = workout.type === 'Bouldering' ? boulderingGrades : sportsClimbingGrades;
      const gradeIndex = gradesList.indexOf(grade.grade);

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

      // Update hardest Onsite
      if (grade.type === 'onsite') {
        const currentHardestOnsiteIndex = gradesList.indexOf(stats.hardestOnsite[workout.type]);
        if (gradeIndex > currentHardestOnsiteIndex) {
          stats.hardestOnsite[workout.type] = grade.grade;
        }
      }
    });
  });

  return stats;
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

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
  if (!editingWorkoutId) {
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

    // Split Button for Flash/Onsite
    const splitButton = document.createElement('div');
    splitButton.classList.add('split-button');

    const flashButton = document.createElement('button');
    flashButton.classList.add('split-button-half');
    flashButton.textContent = 'Flash';

    const onsiteButton = document.createElement('button');
    onsiteButton.classList.add('split-button-half');
    onsiteButton.textContent = 'Onsite';

    splitButton.appendChild(flashButton);
    splitButton.appendChild(onsiteButton);
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
      type: null, // 'flash' or 'onsite'
      count: 0
    };

    currentWorkout.grades.push(gradeData);

    // Event Listeners
    flashButton.addEventListener('click', () => {
      if (gradeData.type === 'flash') {
        gradeData.type = null;
        flashButton.classList.remove('selected');
      } else {
        gradeData.type = 'flash';
        flashButton.classList.add('selected');
        onsiteButton.classList.remove('selected');
        if (gradeData.count < 1) {
          gradeData.count = 1;
          countDisplay.textContent = gradeData.count;
        }
      }
    });

    onsiteButton.addEventListener('click', () => {
      if (gradeData.type === 'onsite') {
        gradeData.type = null;
        onsiteButton.classList.remove('selected');
      } else {
        gradeData.type = 'onsite';
        onsiteButton.classList.add('selected');
        flashButton.classList.remove('selected');
        if (gradeData.count < 1) {
          gradeData.count = 1;
          countDisplay.textContent = gradeData.count;
        }
      }
    });

    minusButton.addEventListener('click', () => {
      gradeData.count = Math.max(gradeData.type ? 1 : 0, gradeData.count - 1);
      countDisplay.textContent = gradeData.count;
    });

    plusButton.addEventListener('click', () => {
      gradeData.count += 1;
      countDisplay.textContent = gradeData.count;
    });

    // If editing, load existing data
    if (editingWorkoutId) {
      const existingGrade = currentWorkout.grades.find(g => g.grade === gradeName);
      if (existingGrade) {
        gradeData.count = existingGrade.count;
        gradeData.type = existingGrade.type;
        countDisplay.textContent = gradeData.count;
        if (gradeData.type === 'flash') {
          flashButton.classList.add('selected');
        } else if (gradeData.type === 'onsite') {
          onsiteButton.classList.add('selected');
        }
      }
    }
  });

  openModal('grade-selection-modal');
}

// Save Workout
function saveWorkout() {
  // Filter out grades with zero count
  currentWorkout.grades = currentWorkout.grades.filter(g => g.count > 0);

  if (currentWorkout.grades.length === 0) {
    alert('Please add at least one climb to save the workout.');
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

  // Get previous month stats
  const prevMonthDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1);
  const prevMonthStats = calculateMonthlyStats(prevMonthDate.getFullYear(), prevMonthDate.getMonth());

  // Function to display stats
  function displayStats(type, statsEl) {
    if (monthlyStats[type] && monthlyStats[type].totalRoutes > 0) {
      const totalRoutes = document.createElement('p');
      totalRoutes.innerHTML = `Total routes climbed: <strong>${monthlyStats[type].totalRoutes}</strong>`;
      statsEl.appendChild(totalRoutes);

      const hardestFlash = document.createElement('p');
      hardestFlash.innerHTML = `Hardest Flash: <strong>${monthlyStats.hardestFlash[type] || 'N/A'}</strong>`;
      statsEl.appendChild(hardestFlash);

      const hardestOnsite = document.createElement('p');
      hardestOnsite.innerHTML = `Hardest Onsite: <strong>${monthlyStats.hardestOnsite[type] || 'N/A'}</strong>`;
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
      hardestRoute: '',
      totalGradeValue: 0,
      totalGradeCount: 0,
      averageGradeValue: 0,
      averageGrade: ''
    },
    'Sports Climbing': {
      gradeCounts: {},
      totalRoutes: 0,
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
        stats[workout.type].gradeCounts[grade.grade] = 0;
      }
      stats[workout.type].gradeCounts[grade.grade] += grade.count;
      stats[workout.type].totalRoutes += grade.count;

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

      // Update hardest Onsite
      if (grade.type === 'onsite') {
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
  const data = Object.values(gradeCounts);

  // Destroy existing chart instance if any
  if (canvas.chart) {
    canvas.chart.destroy();
  }

  // Create chart
  canvas.chart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Number of Climbs',
        data: data,
        backgroundColor: 'rgba(107, 70, 193, 0.6)',
        borderColor: 'rgba(107, 70, 193, 1)',
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        x: { title: { display: true, text: 'Grades' } },
        y: { beginAtZero: true, title: { display: true, text: 'Climbs' } }
      },
      plugins: {
        legend: { display: false }
      }
    }
  });
}

// Function to display comparison with previous month
function displayComparison(type, statsEl) {
  const prevMonthDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1);
  const prevMonthStats = calculateMonthlyStats(prevMonthDate.getFullYear(), prevMonthDate.getMonth());

  const prevStats = prevMonthStats[type];

  const comparisonHeader = document.createElement('h3');
  comparisonHeader.textContent = 'Comparison to Previous Month';
  statsEl.appendChild(comparisonHeader);

  if (prevStats && prevStats.totalRoutes > 0) {
    const totalRoutesComp = document.createElement('p');
    totalRoutesComp.innerHTML = `Total routes climbed last month: <strong>${prevStats.totalRoutes}</strong>`;
    statsEl.appendChild(totalRoutesComp);

    const hardestFlashComp = document.createElement('p');
    hardestFlashComp.innerHTML = `Hardest Flash last month: <strong>${prevMonthStats.hardestFlash[type] || 'N/A'}</strong>`;
    statsEl.appendChild(hardestFlashComp);

    const hardestOnsiteComp = document.createElement('p');
    hardestOnsiteComp.innerHTML = `Hardest Onsite last month: <strong>${prevMonthStats.hardestOnsite[type] || 'N/A'}</strong>`;
    statsEl.appendChild(hardestOnsiteComp);

    const hardestRouteComp = document.createElement('p');
    hardestRouteComp.innerHTML = `Hardest Route last month: <strong>${prevStats.hardestRoute || 'N/A'}</strong>`;
    statsEl.appendChild(hardestRouteComp);
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

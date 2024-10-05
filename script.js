// script.js

const grades = [
  // Bouldering Grades

    // GradeValue 1
    { id: 1, original: 'american', type: 'Bouldering', american: 'V0', conversion: '4', gradeValue: 1, backgroundColor: '#ffffff', color: '#ffffff' },
    { id: 2, original: 'french', type: 'Bouldering', french: '4', conversion: 'V0', gradeValue: 1, backgroundColor: '#ffffff', color: '#ffffff' },
  
    // GradeValue 2
    { id: 3, original: 'american', type: 'Bouldering', american: 'V1', conversion: '5', gradeValue: 2, backgroundColor: '#fef2f2', color: '#b91c1c' },
    { id: 4, original: 'french', type: 'Bouldering', french: '5', conversion: 'V1', gradeValue: 2, backgroundColor: '#fef2f2', color: '#b91c1c' },
  
    // GradeValue 3
    { id: 5, original: 'american', type: 'Bouldering', american: 'V2', conversion: '5+', gradeValue: 3, backgroundColor: '#fff7ed', color: '#c2410c' },
    { id: 6, original: 'french', type: 'Bouldering', french: '5+', conversion: 'V2', gradeValue: 3, backgroundColor: '#fff7ed', color: '#c2410c' },
  
    // GradeValue 4
    { id: 7, original: 'american', type: 'Bouldering', american: 'V3', conversion: '6A', gradeValue: 4, backgroundColor: '#fffbeb', color: '#b45309' },
    { id: 8, original: 'french', type: 'Bouldering', french: '6A', conversion: 'V3', gradeValue: 4, backgroundColor: '#fffbeb', color: '#b45309' },
  
    // GradeValue 5
    { id: 9, original: 'american', type: 'Bouldering', american: 'V4', conversion: '6A+', gradeValue: 5, backgroundColor: '#fefce8', color: '#a16207' },
    { id: 10, original: 'french', type: 'Bouldering', french: '6A+', conversion: 'V4', gradeValue: 5, backgroundColor: '#fefce8', color: '#a16207' },
  
    // GradeValue 6
    { id: 11, original: 'american', type: 'Bouldering', american: 'V5', conversion: '6B', gradeValue: 6, backgroundColor: '#f7fee7', color: '#4d7c0f' },
    { id: 12, original: 'french', type: 'Bouldering', french: '6B', conversion: 'V5', gradeValue: 6, backgroundColor: '#f7fee7', color: '#4d7c0f' },
  
    // GradeValue 7
    { id: 13, original: 'american', type: 'Bouldering', american: 'V6', conversion: '6B+', gradeValue: 7, backgroundColor: '#f0fdf4', color: '#15803d' },
    { id: 14, original: 'french', type: 'Bouldering', french: '6B+', conversion: 'V6', gradeValue: 7, backgroundColor: '#f0fdf4', color: '#15803d' },
  
    // GradeValue 8
    { id: 15, original: 'american', type: 'Bouldering', american: 'V7', conversion: '6C', gradeValue: 8, backgroundColor: '#ecfdf5', color: '#047857' },
    { id: 16, original: 'french', type: 'Bouldering', french: '6C', conversion: 'V7', gradeValue: 8, backgroundColor: '#ecfdf5', color: '#047857' },
  
    // GradeValue 9
    { id: 17, original: 'american', type: 'Bouldering', american: 'V8', conversion: '6C+', gradeValue: 9, backgroundColor: '#f0fdfa', color: '#0f766e' },
    { id: 18, original: 'french', type: 'Bouldering', french: '6C+', conversion: 'V8', gradeValue: 9, backgroundColor: '#f0fdfa', color: '#0f766e' },
  
    // GradeValue 10
    { id: 19, original: 'american', type: 'Bouldering', american: 'V9', conversion: '7A', gradeValue: 10, backgroundColor: '#ecfeff', color: '#0e7490' },
    { id: 20, original: 'french', type: 'Bouldering', french: '7A', conversion: 'V9', gradeValue: 10, backgroundColor: '#ecfeff', color: '#0e7490' },
  
    // GradeValue 11
    { id: 21, original: 'american', type: 'Bouldering', american: 'V10', conversion: '7A+', gradeValue: 11, backgroundColor: '#f0f9ff', color: '#0369a1' },
    { id: 22, original: 'french', type: 'Bouldering', french: '7A+', conversion: 'V10', gradeValue: 11, backgroundColor: '#f0f9ff', color: '#0369a1' },
  
    // GradeValue 12
    { id: 23, original: 'american', type: 'Bouldering', american: 'V11', conversion: '7B', gradeValue: 12, backgroundColor: '#eff6ff', color: '#1d4ed8' },
    { id: 24, original: 'french', type: 'Bouldering', french: '7B', conversion: 'V11', gradeValue: 12, backgroundColor: '#eff6ff', color: '#1d4ed8' },
  
    // GradeValue 13
    { id: 25, original: 'american', type: 'Bouldering', american: 'V12', conversion: '7B+', gradeValue: 13, backgroundColor: '#eef2ff', color: '#4338ca' },
    { id: 26, original: 'french', type: 'Bouldering', french: '7B+', conversion: 'V12', gradeValue: 13, backgroundColor: '#eef2ff', color: '#4338ca' },
  
    // GradeValue 14
    { id: 27, original: 'american', type: 'Bouldering', american: 'V13', conversion: '7C', gradeValue: 14, backgroundColor: '#f5f3ff', color: '#6d28d9' },
    { id: 28, original: 'french', type: 'Bouldering', french: '7C', conversion: 'V13', gradeValue: 14, backgroundColor: '#f5f3ff', color: '#6d28d9' },
  
    // GradeValue 15
    { id: 29, original: 'american', type: 'Bouldering', american: 'V14', conversion: '7C+', gradeValue: 15, backgroundColor: '#faf5ff', color: '#7e22ce' },
    { id: 30, original: 'french', type: 'Bouldering', french: '7C+', conversion: 'V14', gradeValue: 15, backgroundColor: '#faf5ff', color: '#7e22ce' },
  
    // GradeValue 16
    { id: 31, original: 'american', type: 'Bouldering', american: 'V15', conversion: '8A', gradeValue: 16, backgroundColor: '#fdf4ff', color: '#a21caf' },
    { id: 32, original: 'french', type: 'Bouldering', french: '8A', conversion: 'V15', gradeValue: 16, backgroundColor: '#fdf4ff', color: '#a21caf' },
  
    // GradeValue 17
    { id: 33, original: 'american', type: 'Bouldering', american: 'V16', conversion: '8A+', gradeValue: 17, backgroundColor: '#fdf2f8', color: '#be185d' },
    { id: 34, original: 'french', type: 'Bouldering', french: '8A+', conversion: 'V16', gradeValue: 17, backgroundColor: '#fdf2f8', color: '#be185d' },
  
    // GradeValue 18
    { id: 35, original: 'american', type: 'Bouldering', american: 'V17', conversion: '8B', gradeValue: 18, backgroundColor: '#fff1f2', color: '#be123c' },
    { id: 36, original: 'french', type: 'Bouldering', french: '8B', conversion: 'V17', gradeValue: 18, backgroundColor: '#fff1f2', color: '#be123c' },

  // Sport Climbing Grades

  // GradeValue 1
  { id: 37, original: 'american', type: 'Sport Climbing', american: '5.6', conversion: '4c', gradeValue: 1, color: '#ffffff' },
  { id: 38, original: 'french', type: 'Sport Climbing', french: '4c', conversion: '5.6', gradeValue: 1, color: '#ffffff' },

  // GradeValue 2
  { id: 39, original: 'american', type: 'Sport Climbing', american: '5.7', conversion: '5a', gradeValue: 2, color: '#fbf3c0' },
  { id: 40, original: 'french', type: 'Sport Climbing', french: '5a', conversion: '5.7', gradeValue: 2, color: '#fbf3c0' },

  // GradeValue 3
  { id: 41, original: 'american', type: 'Sport Climbing', american: '5.8', conversion: '5b', gradeValue: 3, color: '#f7e780' },
  { id: 42, original: 'french', type: 'Sport Climbing', french: '5b', conversion: '5.8', gradeValue: 3, color: '#f7e780' },

  // GradeValue 4
  { id: 43, original: 'american', type: 'Sport Climbing', american: '5.9', conversion: '5c', gradeValue: 4, color: '#b9e4c9' },
  { id: 44, original: 'french', type: 'Sport Climbing', french: '5c', conversion: '5.9', gradeValue: 4, color: '#b9e4c9' },

  // GradeValue 5
  { id: 45, original: 'american', type: 'Sport Climbing', american: '5.10a', conversion: '6a', gradeValue: 5, color: '#7adbb5' },
  { id: 46, original: 'french', type: 'Sport Climbing', french: '6a', conversion: '5.10a', gradeValue: 5, color: '#7adbb5' },

  // GradeValue 6
  { id: 47, original: 'american', type: 'Sport Climbing', american: '5.10b', conversion: '6a+', gradeValue: 6, color: '#34d399' },
  { id: 48, original: 'french', type: 'Sport Climbing', french: '6a+', conversion: '5.10b', gradeValue: 6, color: '#34d399' },

  // GradeValue 7
  { id: 49, original: 'american', type: 'Sport Climbing', american: '5.10c', conversion: '6b', gradeValue: 7, color: '#43c6e8' },
  { id: 50, original: 'french', type: 'Sport Climbing', french: '6b', conversion: '5.10c', gradeValue: 7, color: '#43c6e8' },

  // GradeValue 8
  { id: 51, original: 'american', type: 'Sport Climbing', american: '5.10d', conversion: '6b+', gradeValue: 8, color: '#51b6f1' },
  { id: 52, original: 'french', type: 'Sport Climbing', french: '6b+', conversion: '5.10d', gradeValue: 8, color: '#51b6f1' },

  // GradeValue 9
  { id: 53, original: 'american', type: 'Sport Climbing', american: '5.11a', conversion: '6c', gradeValue: 9, color: '#60a5fa' },
  { id: 54, original: 'french', type: 'Sport Climbing', french: '6c', conversion: '5.11a', gradeValue: 9, color: '#60a5fa' },

  // GradeValue 10
  { id: 55, original: 'american', type: 'Sport Climbing', american: '5.11b', conversion: '6c+', gradeValue: 10, color: '#f1a3a3' },
  { id: 56, original: 'french', type: 'Sport Climbing', french: '6c+', conversion: '5.11b', gradeValue: 10, color: '#f1a3a3' },

  // GradeValue 11
  { id: 57, original: 'american', type: 'Sport Climbing', american: '5.11c', conversion: '7a', gradeValue: 11, color: '#ec8a8a' },
  { id: 58, original: 'french', type: 'Sport Climbing', french: '7a', conversion: '5.11c', gradeValue: 11, color: '#ec8a8a' },

  // GradeValue 12
  { id: 59, original: 'american', type: 'Sport Climbing', american: '5.11d', conversion: '7a+', gradeValue: 12, color: '#e87171' },
  { id: 60, original: 'french', type: 'Sport Climbing', french: '7a+', conversion: '5.11d', gradeValue: 12, color: '#e87171' },

  // GradeValue 13
  { id: 61, original: 'american', type: 'Sport Climbing', american: '5.12a', conversion: '7b', gradeValue: 13, color: '#808080' },
  { id: 62, original: 'french', type: 'Sport Climbing', french: '7b', conversion: '5.12a', gradeValue: 13, color: '#808080' },

  // GradeValue 14
  { id: 63, original: 'american', type: 'Sport Climbing', american: '5.12b', conversion: '7b+', gradeValue: 14, color: '#404040' },
  { id: 64, original: 'french', type: 'Sport Climbing', french: '7b+', conversion: '5.12b', gradeValue: 14, color: '#404040' },

  // GradeValue 15
  { id: 65, original: 'american', type: 'Sport Climbing', american: '5.12c', conversion: '7c', gradeValue: 15, color: '#000000' },
  { id: 66, original: 'french', type: 'Sport Climbing', french: '7c', conversion: '5.12c', gradeValue: 15, color: '#000000' },

  // GradeValue 16
  { id: 67, original: 'american', type: 'Sport Climbing', american: '5.12d', conversion: '7c+', gradeValue: 16, color: '#fdb78b' },
  { id: 68, original: 'french', type: 'Sport Climbing', french: '7c+', conversion: '5.12d', gradeValue: 16, color: '#fdb78b' },

  // GradeValue 17
  { id: 69, original: 'american', type: 'Sport Climbing', american: '5.13a', conversion: '8a', gradeValue: 17, color: '#fca464' },
  { id: 70, original: 'french', type: 'Sport Climbing', french: '8a', conversion: '5.13a', gradeValue: 17, color: '#fca464' },

  // GradeValue 18
  { id: 71, original: 'american', type: 'Sport Climbing', american: '5.13b', conversion: '8a+', gradeValue: 18, color: '#fb923c' },
  { id: 72, original: 'french', type: 'Sport Climbing', french: '8a+', conversion: '5.13b', gradeValue: 18, color: '#fb923c' },

  // GradeValue 19
  { id: 73, original: 'american', type: 'Sport Climbing', american: '5.13c', conversion: '8b', gradeValue: 19, color: '#d8b4fe' },
  { id: 74, original: 'french', type: 'Sport Climbing', french: '8b', conversion: '5.13c', gradeValue: 19, color: '#d8b4fe' },

  // GradeValue 20
  { id: 75, original: 'american', type: 'Sport Climbing', american: '5.13d', conversion: '8b+', gradeValue: 20, color: '#c084fc' },
  { id: 76, original: 'french', type: 'Sport Climbing', french: '8b+', conversion: '5.13d', gradeValue: 20, color: '#c084fc' },

  // GradeValue 21
  { id: 77, original: 'american', type: 'Sport Climbing', american: '5.14a', conversion: '8c', gradeValue: 21, color: '#a855f7' },
  { id: 78, original: 'french', type: 'Sport Climbing', french: '8c', conversion: '5.14a', gradeValue: 21, color: '#a855f7' },

  // GradeValue 22
  { id: 79, original: 'american', type: 'Sport Climbing', american: '5.14b', conversion: '8c+', gradeValue: 22, color: '#9333ea' },
  { id: 80, original: 'french', type: 'Sport Climbing', french: '8c+', conversion: '5.14b', gradeValue: 22, color: '#9333ea' },

  // GradeValue 23
  { id: 81, original: 'american', type: 'Sport Climbing', american: '5.14c', conversion: '9a', gradeValue: 23, color: '#7e22ce' },
  { id: 82, original: 'french', type: 'Sport Climbing', french: '9a', conversion: '5.14c', gradeValue: 23, color: '#7e22ce' },

  // GradeValue 24
  { id: 83, original: 'american', type: 'Sport Climbing', american: '5.14d', conversion: '9a+', gradeValue: 24, color: '#6b21a8' },
  { id: 84, original: 'french', type: 'Sport Climbing', french: '9a+', conversion: '5.14d', gradeValue: 24, color: '#6b21a8' },

  // GradeValue 25
  { id: 85, original: 'american', type: 'Sport Climbing', american: '5.15a', conversion: '9b', gradeValue: 25, color: '#581c87' },
  { id: 86, original: 'french', type: 'Sport Climbing', french: '9b', conversion: '5.15a', gradeValue: 25, color: '#581c87' },

  // GradeValue 26
  { id: 87, original: 'american', type: 'Sport Climbing', american: '5.15b', conversion: '9b+', gradeValue: 26, color: '#3b0764' },
  { id: 88, original: 'french', type: 'Sport Climbing', french: '9b+', conversion: '5.15b', gradeValue: 26, color: '#3b0764' },

  // GradeValue 27
  { id: 89, original: 'american', type: 'Sport Climbing', american: '5.15c', conversion: '9c', gradeValue: 27, color: '#1e0442' },
  { id: 90, original: 'french', type: 'Sport Climbing', french: '9c', conversion: '5.15c', gradeValue: 27, color: '#1e0442' },

  // GradeValue 28
  { id: 91, original: 'american', type: 'Sport Climbing', american: '5.15d', conversion: '9c+', gradeValue: 28, color: '#0f0221' },
  { id: 92, original: 'french', type: 'Sport Climbing', french: '9c+', conversion: '5.15d', gradeValue: 28, color: '#0f0221' },
];
console.log('Grades loaded:', grades); // Debugging statement
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
function getGradeName(gradeId) {
  const grade = grades.find(g => g.id === gradeId);
  if (!grade) return 'N/A';

  // Find the grade with the same gradeValue and type in the current grading system
  const gradeInCurrentSystem = grades.find(
    g =>
      g.gradeValue === grade.gradeValue &&
      g.type === grade.type &&
      g.original.toLowerCase() === gradingSystem.toLowerCase()
  );

  if (!gradeInCurrentSystem) return 'N/A';

  return gradingSystem === 'American' ? gradeInCurrentSystem.american : gradeInCurrentSystem.french;
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

  // Set the grading system toggle based on the preference
  const gradingSystemToggle = document.getElementById('gradingSystemToggle');
  gradingSystemToggle.checked = gradingSystem === 'French';
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
          dot.classList.add('sport-climbing-dot');
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

function isSameDateMonth(date, startOfMonth, endOfMonth) {
  return date >= startOfMonth && date <= endOfMonth;
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

  // Workout Type Selection with Single Session per Type per Day
  document.getElementById('select-bouldering').addEventListener('click', () => {
    const existingWorkout = workouts.find(
      w => isSameDate(w.date, selectedDate) && w.type === 'Bouldering'
    );
    if (existingWorkout) {
      if (confirm('A Bouldering session already exists on this date. Do you want to edit it?')) {
        editWorkout(existingWorkout);
      } else {
        closeModal('workout-type-modal');
      }
    } else {
      editingWorkoutId = null; // Ensure we're adding a new workout
      selectedWorkoutType = 'Bouldering';
      closeModal('workout-type-modal');
      openGradeSelectionModal();
    }
  });

  document.getElementById('select-sport-climbing').addEventListener('click', () => {
    const existingWorkout = workouts.find(
      w => isSameDate(w.date, selectedDate) && w.type === 'Sport Climbing'
    );
    if (existingWorkout) {
      if (confirm('A Sport Climbing session already exists on this date. Do you want to edit it?')) {
        editWorkout(existingWorkout);
      } else {
        closeModal('workout-type-modal');
      }
    } else {
      editingWorkoutId = null; // Ensure we're adding a new workout
      selectedWorkoutType = 'Sport Climbing';
      closeModal('workout-type-modal');
      openGradeSelectionModal();
    }
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
    if (
      !sideMenu.contains(e.target) &&
      !burgerMenu.contains(e.target)
    ) {
      sideMenu.classList.remove('open');
    }
  });

  // Grading System Toggle
  document.getElementById('gradingSystemToggle').addEventListener('change', (e) => {
    gradingSystem = e.target.checked ? 'French' : 'American';
    saveGradingSystemPreference();
    renderCalendar();
    updateStatistics();
  });

  // Export Data
  document.getElementById('exportDataItem').addEventListener('click', () => {
    exportDataToCSV();
    document.getElementById('sideMenu').classList.remove('open');
  });

  // Grade Conversion Menu Item
  document.getElementById('gradeConversionItem').addEventListener('click', () => {
    window.open('grade_conversion.html', '_blank');
    document.getElementById('sideMenu').classList.remove('open');
  });
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

// Open Grade Selection Modal
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

  // Get grades for the selected workout type and grading system
  const gradeOptions = grades.filter(g => g.type === selectedWorkoutType && g.original.toLowerCase() === gradingSystem.toLowerCase());

  gradeOptions.forEach((gradeObj, index) => {
    // Create gradeItem
    const gradeItem = document.createElement('div');
    gradeItem.classList.add('grade-item', 'closed'); // Start as closed

    // Set background color and text color from gradeObj
    gradeItem.style.backgroundColor = gradeObj.backgroundColor || '#ffffff';
    gradeItem.style.color = gradeObj.color || '#000000';

    // Grade Header
    const gradeHeader = document.createElement('div');
    gradeHeader.classList.add('grade-header');
    gradeHeader.innerHTML = `
      <span class="grade-title">${getGradeName(gradeObj.id)}</span>
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

    labels.forEach((label, idx) => {
      const controlGroup = document.createElement('div');
      controlGroup.classList.add('control-group');

      const gradeLabel = document.createElement('span');
      gradeLabel.classList.add('grade-label');
      gradeLabel.textContent = label;

      const gradeInput = document.createElement('div');
      gradeInput.classList.add('grade-input');

      const decrementButton = document.createElement('button');
      decrementButton.classList.add('control-button');
      decrementButton.textContent = '-';
      decrementButton.type = 'button'; // Ensure type is button

      const countDisplay = document.createElement('span');
      countDisplay.classList.add('count-display');
      countDisplay.textContent = '0'; // Initial count

      const incrementButton = document.createElement('button');
      incrementButton.classList.add('control-button');
      incrementButton.textContent = '+';
      incrementButton.type = 'button'; // Ensure type is button

      gradeInput.appendChild(decrementButton);
      gradeInput.appendChild(countDisplay);
      gradeInput.appendChild(incrementButton);

      controlGroup.appendChild(gradeLabel);
      controlGroup.appendChild(gradeInput);
      gradeControls.appendChild(controlGroup);

      countElements.push(countDisplay);

      // Determine the field type based on label
      let fieldType;
      if (label === 'Attempts') {
        fieldType = 'attempts';
      } else if (label === 'Sends') {
        fieldType = 'sends';
      } else {
        fieldType = 'flashesOnsights'; // 'Flashes' or 'Onsights'
      }

      // Event Listeners for Increment/Decrement
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

    // If editing, load existing data
    let existingGrade;
    if (editingWorkoutId) {
      existingGrade = currentWorkout.grades.find(g => g.gradeId === gradeObj.id);
    }

    if (existingGrade) {
      gradeData.attempts = existingGrade.attempts || 0;
      gradeData.sends = existingGrade.sends || 0;
      gradeData.flashesOnsights = existingGrade.flashesOnsights || 0;
      countElements[0].textContent = gradeData.attempts;
      countElements[1].textContent = gradeData.sends;
      countElements[2].textContent = gradeData.flashesOnsights;
      validateInputs();
    }

    currentWorkout.grades.push(gradeData);

    // Event Listener for Grade Header Click (Expand/Collapse)
    gradeHeader.addEventListener('click', () => {
      const isClosed = gradeItem.classList.toggle('closed');
      gradeControls.style.display = isClosed ? 'none' : 'block';
    });

    // Update Grade Data Function
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

    // Validation Function
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

  openModal('grade-selection-modal');
}




// Save Workout
function saveWorkout() {
  // Filter out grades with zero attempts
  currentWorkout.grades = currentWorkout.grades.filter(g => g.attempts > 0);

  // Validate all grades
  for (let grade of currentWorkout.grades) {
    if (grade.sends > grade.attempts) {
      const gradeName = getGradeName(grade.gradeId);
      alert(`For grade ${gradeName}, sends cannot exceed attempts.`);
      return;
    }
    if (grade.flashesOnsights > grade.sends) {
      const gradeName = getGradeName(grade.gradeId);
      alert(`For grade ${gradeName}, flashes/onsights cannot exceed sends.`);
      return;
    }
  }

  if (currentWorkout.grades.length === 0) {
    alert('Please add at least one attempt to save the session.');
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

// Update Statistics
function updateStatistics() {
  const boulderingStatsEl = document.getElementById('bouldering-stats-content');
  const sportClimbingStatsEl = document.getElementById('sport-climbing-stats-content');

  boulderingStatsEl.innerHTML = '';
  sportClimbingStatsEl.innerHTML = '';

  const monthlyStats = calculateMonthlyStats(currentMonth.getFullYear(), currentMonth.getMonth());

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

      const totalSessionsCard = createStatCard('Sessions', monthlyStats[type].totalSessions);
      const totalAttemptsCard = createStatCard('Total Attempts', monthlyStats[type].totalAttempts);
      const totalSendsCard = createStatCard('Total Sends', monthlyStats[type].totalSends);
      const totalFlashesOnsightsCard = createStatCard(
        type === 'Bouldering' ? 'Flashes' : 'Onsights',
        monthlyStats[type].totalFlashesOnsights
      );
      const hardestFlashOnsightGrade = monthlyStats.hardestFlashOnsight[type]
        ? getGradeName(monthlyStats.hardestFlashOnsight[type].gradeId, type)
        : 'N/A';
      const hardestFlashOnsightCard = createStatCard(
        `Hardest ${type === 'Bouldering' ? 'Flash' : 'Onsight'}`,
        hardestFlashOnsightGrade
      );
      const hardestRouteTitle = type === 'Bouldering' ? 'Hardest Boulder' : 'Hardest Route';
      const hardestRouteGrade = monthlyStats[type].hardestRouteId
        ? getGradeName(monthlyStats[type].hardestRouteId, type)
        : 'N/A';
      const hardestRouteCard = createStatCard(hardestRouteTitle, hardestRouteGrade);
      const averageGradeName = monthlyStats[type].averageGradeId
        ? getGradeName(monthlyStats[type].averageGradeId, type)
        : 'N/A';
      const averageGradeCard = createStatCard('Average Grade', averageGradeName);

      statsCards.appendChild(totalSessionsCard);
      statsCards.appendChild(totalAttemptsCard);
      statsCards.appendChild(totalSendsCard);
      statsCards.appendChild(totalFlashesOnsightsCard);
      statsCards.appendChild(hardestFlashOnsightCard);
      statsCards.appendChild(hardestRouteCard);
      statsCards.appendChild(averageGradeCard);

      statsEl.appendChild(statsCards);

      // Bar Chart
      renderGradeDistributionChart(type);
    } else {
      const noData = document.createElement('p');
      noData.textContent = 'No data for this month.';
      statsEl.appendChild(noData);

      // Hide the canvas element
      canvas.style.display = 'none';
    }
  }

  // Helper function to create a stat card
  function createStatCard(title, value) {
    const card = document.createElement('div');
    card.classList.add('stat-card');

    const cardTitle = document.createElement('h3');
    cardTitle.textContent = title;
    card.appendChild(cardTitle);

    const cardValue = document.createElement('p');
    cardValue.textContent = value;
    card.appendChild(cardValue);

    return card;
  }

  displayStats('Bouldering', boulderingStatsEl);
  displayStats('Sport Climbing', sportClimbingStatsEl);
}

// Calculate Monthly Stats
function calculateMonthlyStats(year, month) {
  const stats = {
    Bouldering: {
      gradeCounts: {},
      totalSessions: 0,
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
    'Sport Climbing': {
      gradeCounts: {},
      totalSessions: 0,
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
    hardestFlashOnsight: { Bouldering: null, 'Sport Climbing': null }
  };

  const startOfMonth = new Date(year, month, 1);
  const endOfMonth = new Date(year, month + 1, 0);

  const monthWorkouts = workouts.filter(w => isSameDateMonth(w.date, startOfMonth, endOfMonth));

  monthWorkouts.forEach(workout => {
    stats[workout.type].totalSessions += 1;

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

// Function to render the grade distribution chart
function renderGradeDistributionChart(type) {
  const chartId = type === 'Bouldering' ? 'bouldering-grade-chart' : 'sport-climbing-grade-chart';
  const gradeCounts = calculateMonthlyStats(currentMonth.getFullYear(), currentMonth.getMonth())[type].gradeCounts;

  // Get the canvas element
  const canvas = document.getElementById(chartId);
  const ctx = canvas.getContext('2d');

  // Prepare data
  const gradeIds = Object.keys(gradeCounts)
    .map(id => parseInt(id))
    .sort((a, b) => a - b);

  if (gradeIds.length === 0) {
    // No data to display
    return;
  }

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

  // Calculate the maximum total attempts for Y-axis scaling
  const maxTotalAttempts = Math.max(...totalAttemptsPerGrade);
  const maxYValue = maxTotalAttempts;

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
            maxRotation: 45,
            minRotation: 0,
            autoSkip: true,
            font: {
              size: 10
            }
          }
        },
        y: {
          stacked: true,
          ticks: {
            display: false,
            max: maxYValue + 2 // Add extra space above the tallest bar
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
      barThickness: 15,
      responsive: true,
      maintainAspectRatio: false
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

// Export Data Function
function exportDataToCSV() {
  let csvContent = "data:text/csv;charset=utf-8,";
  csvContent += "Workout ID,Date,Workout Type,Grade (American),Grade (French),Attempts,Sends,Flashes/Onsights\n"; // Header

  workouts.forEach(workout => {
    workout.grades.forEach(grade => {
      const gradeAmerican = grades.find(g => g.id === grade.gradeId && g.type === workout.type && g.original === 'american')?.american || 'N/A';
      const gradeFrench = grades.find(g => g.id === grade.gradeId && g.type === workout.type && g.original === 'french')?.french || 'N/A';
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

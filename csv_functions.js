// csv_functions.js

// Exported functions: exportDataToCSV and importDataFromCSV
export async function exportDataToCSV(workouts, grades) {
    try {
        // Generate CSV content
        let csvContent = "Workout ID,Date,Workout Type,Grade (American),Grade (French),Attempts,Sends,Flashes/Onsights\n";

        workouts.forEach(workout => {
            workout.grades.forEach(grade => {
                // Only include grades with attempts > 0
                if (grade.attempts > 0) {
                    const gradeObj = grades.find(
                        g => g.id === grade.gradeId && g.original.toLowerCase() === grade.originalGradingSystem.toLowerCase()
                    );

                    if (!gradeObj) return; // Skip if gradeObj not found

                    let gradeAmerican = '';
                    let gradeFrench = '';

                    // Set the grade in the original grading system
                    if (grade.originalGradingSystem.toLowerCase() === 'american') {
                        gradeAmerican = gradeObj.american;
                    } else {
                        gradeFrench = gradeObj.french;
                    }

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
                }
            });
        });

        if (window.cordova) {
            // Cordova-specific export using plugins
            await cordovaExportCSV(csvContent);
        } else {
            // Web browser export using data URI
            webExportCSV(csvContent);
        }
    } catch (error) {
        alert('Failed to export data: ' + error.message);
    }
}

export async function importDataFromCSV(workouts, grades, saveWorkoutsToStorage, renderCalendar, updateStatistics) {
    try {
        if (window.cordova) {
            // Cordova-specific import using plugins
            const csvData = await cordovaImportCSV();
            parseAndMergeCSV(csvData, workouts, grades, saveWorkoutsToStorage, renderCalendar, updateStatistics);
        } else {
            // Web browser import using file input
            await webImportCSV(workouts, grades, saveWorkoutsToStorage, renderCalendar, updateStatistics);
        }
    } catch (error) {
        alert('Failed to import data: ' + error.message);
    }
}

// Helper function for Cordova export
function cordovaExportCSV(csvContent) {
    return new Promise((resolve, reject) => {
        // Ensure Cordova is ready
        if (document.readyState === 'complete') {
            proceed();
        } else {
            document.addEventListener('deviceready', proceed, false);
        }

        function proceed() {
            // Access the app's data directory
            window.resolveLocalFileSystemURL(cordova.file.dataDirectory, function(dirEntry) {
                // Create or overwrite the CSV file
                dirEntry.getFile("climbing_workouts.csv", { create: true, exclusive: false }, function (fileEntry) {
                    // Create a FileWriter object for the file
                    fileEntry.createWriter(function (fileWriter) {
                        fileWriter.onwriteend = function() {
                            // Share the file using Social Sharing plugin
                            window.plugins.socialsharing.share(
                                'Here is my climbing workouts data.',
                                'Climbing Workouts Data',
                                fileEntry.toURL(),
                                null,
                                function() {
                                    // Success callback
                                    resolve();
                                },
                                function(error) {
                                    // Error callback
                                    reject(new Error('Sharing failed: ' + error));
                                }
                            );
                        };
                        fileWriter.onerror = function(e) {
                            reject(new Error('File write failed: ' + e.toString()));
                        };
                        var blob = new Blob([csvContent], { type: 'text/csv' });
                        fileWriter.write(blob);
                    }, function(e) {
                        reject(new Error('Failed to write file: ' + e.toString()));
                    });
                }, function(e) {
                    reject(new Error('Failed to create file: ' + e.toString()));
                });
            }, function(e) {
                reject(new Error('Failed to access file system: ' + e.toString()));
            });
        }
    });
}

// Helper function for Cordova import
function cordovaImportCSV() {
    return new Promise((resolve, reject) => {
        // Ensure Cordova is ready
        if (document.readyState === 'complete') {
            proceed();
        } else {
            document.addEventListener('deviceready', proceed, false);
        }

        function proceed() {
            // Use FileChooser plugin to select a CSV file
            window.fileChooser.open(function(uri) {
                // Resolve the native path using FilePath plugin
                window.FilePath.resolveNativePath(uri, function(filePath) {
                    // Access the file entry
                    window.resolveLocalFileSystemURL(filePath, function(fileEntry) {
                        fileEntry.file(function(file) {
                            var reader = new FileReader();
                            reader.onloadend = function(e) {
                                var text = e.target.result;
                                resolve(text);
                            };
                            reader.onerror = function(e) {
                                reject(new Error('Failed to read file: ' + e.toString()));
                            };
                            reader.readAsText(file);
                        }, function(e) {
                            reject(new Error('Failed to access file: ' + e.toString()));
                        });
                    }, function(e) {
                        reject(new Error('Failed to resolve file path: ' + e.toString()));
                    });
                }, function(err) {
                    reject(new Error('Failed to resolve native path: ' + err));
                });
            }, function(err) {
                reject(new Error('File selection failed: ' + err));
            });
        }
    });
}

// Helper function for Web export
function webExportCSV(csvContent) {
    try {
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", "climbing_workouts.csv");
        document.body.appendChild(link);

        link.click(); // Trigger the download
        document.body.removeChild(link);
        URL.revokeObjectURL(url); // Clean up the URL object
    } catch (error) {
        alert('Failed to export data: ' + error.message);
    }
}

// Helper function for Web import
function webImportCSV(workouts, grades, saveWorkoutsToStorage, renderCalendar, updateStatistics) {
    return new Promise((resolve, reject) => {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = '.csv,text/csv';

        fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                readCSVFile(file, workouts, grades, saveWorkoutsToStorage, renderCalendar, updateStatistics)
                    .then(() => {
                        resolve();
                    })
                    .catch(err => {
                        reject(err);
                    });
            } else {
                reject(new Error('No file selected.'));
            }
        });
        fileInput.click();
    });
}

function readCSVFile(file, workouts, grades, saveWorkoutsToStorage, renderCalendar, updateStatistics) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const text = e.target.result;
            try {
                parseAndMergeCSV(text, workouts, grades, saveWorkoutsToStorage, renderCalendar, updateStatistics);
                resolve();
            } catch (error) {
                reject(new Error('Failed to parse CSV file: ' + error.message));
            }
        };
        reader.onerror = (e) => {
            reject(new Error('Failed to read file: ' + e.toString()));
        };
        reader.readAsText(file);
    });
}

function parseAndMergeCSV(csvData, workouts, grades, saveWorkoutsToStorage, renderCalendar, updateStatistics) {
    const lines = csvData.split('\n').filter(line => line.trim() !== '');
    if (lines.length === 0) {
        throw new Error('CSV file is empty.');
    }

    const headers = lines[0].split(',').map(h => h.trim());

    // Validate headers
    const expectedHeaders = ["Workout ID", "Date", "Workout Type", "Grade (American)", "Grade (French)", "Attempts", "Sends", "Flashes/Onsights"];
    if (headers.length !== expectedHeaders.length || !headers.every((h, i) => h === expectedHeaders[i])) {
        throw new Error('CSV file has incorrect headers.');
    }

    const newWorkouts = {};

    for (let i = 1; i < lines.length; i++) {
        const lineNumber = i + 1; // Adjust for header line
        const data = lines[i].split(',').map(d => d.trim());

        if (data.length !== expectedHeaders.length) {
            throw new Error(`Incorrect number of fields on line ${lineNumber}.`);
        }

        const workoutId = data[0];
        const dateStr = data[1];
        const type = data[2];
        const gradeAmerican = data[3];
        const gradeFrench = data[4];
        const attempts = parseInt(data[5]);
        const sends = parseInt(data[6]);
        const flashesOnsights = parseInt(data[7]);

        // Validate numeric fields
        if (isNaN(attempts) || isNaN(sends) || isNaN(flashesOnsights)) {
            throw new Error(`Invalid numeric value on line ${lineNumber}.`);
        }

        // Validate date
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) {
            throw new Error(`Invalid date format on line ${lineNumber}: "${dateStr}"`);
        }

        // Validate workout type
        if (type !== 'Bouldering' && type !== 'Sport Climbing') {
            throw new Error(`Invalid workout type on line ${lineNumber}: "${type}"`);
        }

        let originalGradingSystem = '';
        let gradeObj = null;

        if (gradeAmerican && !gradeFrench) {
            originalGradingSystem = 'american';
            gradeObj = grades.find(
                g => g.american === gradeAmerican && g.original.toLowerCase() === originalGradingSystem && g.type === type
            );
        } else if (gradeFrench && !gradeAmerican) {
            originalGradingSystem = 'french';
            gradeObj = grades.find(
                g => g.french === gradeFrench && g.original.toLowerCase() === originalGradingSystem && g.type === type
            );
        } else {
            throw new Error(`Invalid grade information on line ${lineNumber}. Provide either American or French grade.`);
        }

        if (!gradeObj) {
            throw new Error(`Grade not found on line ${lineNumber}: "${gradeAmerican || gradeFrench}"`);
        }

        // Validate logical consistency
        if (sends > attempts) {
            throw new Error(`Sends cannot exceed attempts on line ${lineNumber}.`);
        }
        if (flashesOnsights > sends) {
            throw new Error(`Flashes/Onsights cannot exceed sends on line ${lineNumber}.`);
        }

        if (!newWorkouts[workoutId]) {
            newWorkouts[workoutId] = {
                id: workoutId,
                date: date,
                type: type,
                grades: []
            };
        }

        newWorkouts[workoutId].grades.push({
            gradeId: gradeObj.id,
            type: gradeObj.type,
            originalGradingSystem: originalGradingSystem,
            attempts: attempts,
            sends: sends,
            flashesOnsights: flashesOnsights
        });
    }

    // Merge imported workouts with existing workouts
    const importedWorkouts = Object.values(newWorkouts);

    // Merge workouts with the same ID
    importedWorkouts.forEach(importedWorkout => {
        const existingWorkoutIndex = workouts.findIndex(w => w.id === importedWorkout.id);
        if (existingWorkoutIndex !== -1) {
            // Merge grades
            const existingWorkout = workouts[existingWorkoutIndex];

            // Avoid duplicates: check if grades already exist
            importedWorkout.grades.forEach(importedGrade => {
                const existingGradeIndex = existingWorkout.grades.findIndex(
                    grade => grade.gradeId === importedGrade.gradeId &&
                        grade.type === importedGrade.type &&
                        grade.originalGradingSystem === importedGrade.originalGradingSystem
                );

                if (existingGradeIndex === -1) {
                    existingWorkout.grades.push(importedGrade);
                } else {
                    // Update existing grade
                    const existingGrade = existingWorkout.grades[existingGradeIndex];
                    existingGrade.attempts += importedGrade.attempts;
                    existingGrade.sends += importedGrade.sends;
                    existingGrade.flashesOnsights += importedGrade.flashesOnsights;
                }
            });

            workouts[existingWorkoutIndex] = existingWorkout;
        } else {
            workouts.push(importedWorkout);
        }
    });

    saveWorkoutsToStorage();
    renderCalendar();
    updateStatistics();
}


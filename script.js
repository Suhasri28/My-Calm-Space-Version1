document.addEventListener("DOMContentLoaded", function () {
    generateCalendar();
    loadMoods();
    loadJournalEntries();
});

/** Generates the calendar */
function generateCalendar() {
    const calendar = document.getElementById("calendar");
    calendar.innerHTML = "";

    for (let i = 1; i <= 30; i++) { 
        let dayDiv = document.createElement("div");
        dayDiv.className = "day";
        dayDiv.innerText = i;
        dayDiv.onclick = function () {
            selectDate(i);
        };
        calendar.appendChild(dayDiv);
    }
}

let selectedDate = null;

/** Selects a date from the calendar */
function selectDate(date) {
    selectedDate = date;
}

/** Stores the selected mood for a date */
function selectMood(mood) {
    if (!selectedDate) {
        alert("Please select a date first!");
        return;
    }

    let moodData = JSON.parse(localStorage.getItem("moodData")) || {};
    moodData[selectedDate] = mood;
    localStorage.setItem("moodData", JSON.stringify(moodData));

    loadMoods();
}

/** Loads stored moods into the calendar */
function loadMoods() {
    let moodData = JSON.parse(localStorage.getItem("moodData")) || {};
    let days = document.querySelectorAll(".day");

    days.forEach(day => {
        let date = day.innerText;
        if (moodData[date]) {
            day.style.background = getMoodColor(moodData[date]);
        } else {
            day.style.background = ""; // Reset background color to default if no mood selected
        }
    });
}

/** Returns mood color based on mood */
function getMoodColor(mood) {
    switch (mood) {
        case "Happy": return "#ffadad";
        case "Calm": return "#ffd6a5";
        case "Neutral": return "#fdffb6";
        case "Sad": return "#9bf6ff";
        default: return "#fff";
    }
}

/** Shows the mood summary */
function showSummary() {
    let moodData = JSON.parse(localStorage.getItem("moodData")) || {};
    let moodCounts = { "Happy": 0, "Calm": 0, "Neutral": 0, "Sad": 0 };

    Object.values(moodData).forEach(mood => {
        if (moodCounts[mood] !== undefined) {
            moodCounts[mood]++;
        }
    });

    // Find the most frequent mood
    let mostFrequentMood = Object.keys(moodCounts).reduce((a, b) => moodCounts[a] > moodCounts[b] ? a : b);

    // Custom message based on mood
    let moodNotes = {
        "Happy": "Keep smiling, you're doing great! 😊",
        "Calm": "Peaceful mind, peaceful life. 🧘‍♀️",
        "Neutral": "Stay curious, explore new things! 🌎",
        "Sad": "It's okay to have bad days. Keep going! 💖"
    };

    // Display summary
    let summaryText = `
        Happy: ${moodCounts["Happy"]} times <br>
        Calm: ${moodCounts["Calm"]} times <br>
        Neutral: ${moodCounts["Neutral"]} times <br>
        Sad: ${moodCounts["Sad"]} times <br><br>
        <strong>Your frequent mood this month:</strong> ${mostFrequentMood} <br>
        <small>(${moodNotes[mostFrequentMood]})</small>
    `;

    document.getElementById("summary").innerHTML = summaryText;
}

/** Clears all mood selections */
function clearSelections() {
    localStorage.removeItem("moodData"); // Remove mood data from localStorage
    let days = document.querySelectorAll(".day");
    days.forEach(day => {
        day.style.background = ""; // Reset background color to default
    });
}

/** JOURNAL PAGE FIXES **/

/** Saves the journal entry */
function saveJournalEntry() {
    let journalText = document.getElementById("journalEntry").value.trim();

    if (journalText === "") {
        alert("Journal entry cannot be empty!");
        return;
    }

    let journalEntries = JSON.parse(localStorage.getItem("journalEntries")) || [];
    let entryID = new Date().getTime().toString(); // Unique ID based on timestamp

    let newEntry = {
        id: entryID, 
        date: new Date().toLocaleString(), 
        text: journalText
    };

    journalEntries.push(newEntry);

    localStorage.setItem("journalEntries", JSON.stringify(journalEntries));

    document.getElementById("journalEntry").value = ""; // Clear input field
    alert("Journal entry saved!");
   
}


/** Displays previous journal entries */
/** Displays previous journal entries */
function showJournalEntries() {
    let journalEntries = JSON.parse(localStorage.getItem("journalEntries")) || [];
    let journalContainer = document.getElementById("journalContainer");
    let entriesHeading = document.getElementById("entriesHeading");

    journalContainer.innerHTML = ""; // Clear previous display

    if (journalEntries.length === 0) {
        journalContainer.innerHTML = "<p>No journal entries yet.</p>";
    } else {
        journalEntries.slice().reverse().forEach((entry) => {
            let entryDiv = document.createElement("div");
            entryDiv.className = "journal-entry";
            entryDiv.innerHTML = `
                <strong>${entry.date}</strong>: ${entry.text} 
                <button class="delete-button" onclick="deleteEntry('${entry.id}')">❌</button>
            `;
            journalContainer.appendChild(entryDiv);
        });
    }

    // Show the entries and heading
    journalContainer.style.display = "block";
    entriesHeading.style.display = "block";
}


/** Deletes a specific journal entry */
function deleteEntry(entryID) {
    let journalEntries = JSON.parse(localStorage.getItem("journalEntries")) || [];

    // Keep only entries that DON'T match the given ID
    journalEntries = journalEntries.filter(entry => entry.id !== entryID);

    localStorage.setItem("journalEntries", JSON.stringify(journalEntries));
    showJournalEntries(); // Refresh the displayed list
}


/** Clears all journal entries */
function clearJournal() {
    if (confirm("Are you sure you want to clear all journal entries?")) {
        localStorage.removeItem("journalEntries");
        document.getElementById("journalContainer").innerHTML = "<p>No journal entries yet.</p>";
        document.getElementById("journalContainer").style.display = "block";
        document.getElementById("entriesHeading").style.display = "block";
    }
}


const quotes = [
    "Happiness is a journey, not a destination.",
    "Your mindset determines your reality.",
    "Every day may not be good, but there's something good in every day.",
    "Peace begins with a smile.",
    "You are enough, just as you are.",
    "To succeed in your mission you must have single minded devotion.",
    "Hardword beats talent when talent doesn't work hard."
];
function changeQuote() {
    document.getElementById('quote').innerText = quotes[Math.floor(Math.random() * quotes.length)];
}
setInterval(changeQuote, 4000);
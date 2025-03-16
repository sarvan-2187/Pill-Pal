document.addEventListener("DOMContentLoaded", function () {
  // DOM Elements
  const addButton = document.querySelector(".btnAdd");
  const reminderList = document.querySelector("#mra_body");
  const medicineFilter = document.querySelector("select[name='medicine']");
  const dateItems = document.querySelectorAll("#mra_date_bar ul li");
  const monthItems = document.querySelectorAll("#mra_months_bar ul li");
  const medicineFormModal = document.querySelector("#medicineFormModal");
  const medicineForm = document.querySelector("#medicineForm");
  const cancelFormButton = document.querySelector("#cancelForm");
  const footerItems = document.querySelectorAll("#mra_footer ul li");
  const monthsBar = document.querySelector("#mra_months_bar ul");
  const datesBar = document.querySelector("#mra_date_bar ul");

  // Audio for notifications
  const notificationSound = new Audio('audio.mp3'); // Add your audio file path here

  // Initialize reminders array
  let reminders = [];

  // Load reminders from localStorage (if any)
  if (localStorage.getItem("reminders")) {
    reminders = JSON.parse(localStorage.getItem("reminders"));
  }

  // Initialize live calendar
  initializeCalendar();

  // Render Reminders
  function renderReminders(filteredReminders = reminders) {
    reminderList.innerHTML = `
      <div class="row mra_body_header">
        <div class="col-3">Time</div>
        <div class="col-9">
          Medicine
          <select name="medicine">
            <option value="0">All</option>
            ${[...new Set(reminders.map((r) => r.name))]
              .map((name) => <option value="${name}">${name}</option>)
              .join("")}
          </select>
        </div>
      </div>
    `;

    filteredReminders.forEach((reminder) => {
      const reminderItem = document.createElement("div");
      reminderItem.className = row mra_body_data color-${reminder.color};
      reminderItem.innerHTML = `
        <div class="col-3">
          <ul>
            ${reminder.time
              .split(" - ")[0]
              .split(":")
              .map((t) => <li>${t}</li>)
              .join("")}
          </ul>
        </div>
        <div class="col-9">
          <div class="medicine_info">
            <span class="m_icon">
              <img src="${
                reminder.color === "violet" ? "capsule.png" : "injection.png"
              }" alt="">
            </span>
            <span class="m_info">
              <span class="m_name">${reminder.name}</span>
              <span class="m_dosage">${reminder.dosage}</span>
              <span class="m_time">
                <i class='bx bx-time-five'></i>&nbsp; ${reminder.time}
              </span>
            </span>
            <span class="m_status ${reminder.status ? "true" : "false"}">
              <i class='bx bx-time-five'></i>
            </span>
          </div>
        </div>
      `;
      reminderList.appendChild(reminderItem);

      // Add event listener to mark as taken
      const statusButton = reminderItem.querySelector(".m_status");
      statusButton.addEventListener("click", () => {
        if (reminder.status) {
          // If the medicine is already taken, remove it from the list
          reminders = reminders.filter(r => r.id !== reminder.id);
        } else {
          // If the medicine is not taken, mark it as taken
          reminder.status = true;
        }
        saveReminders();
        renderReminders();
      });
    });
    
    // Reattach event listener to the medicine filter after DOM regeneration
    const newMedicineFilter = document.querySelector("select[name='medicine']");
    if (newMedicineFilter) {
      newMedicineFilter.addEventListener("change", handleMedicineFilter);
    }
  }

  // Initialize the calendar with live data
  function initializeCalendar() {
    // Clear existing content
    monthsBar.innerHTML = '';
    datesBar.innerHTML = '';
    
    // Get current date information
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentDay = currentDate.getDate();
    
    // Generate months (current month and 3 before/after)
    const months = [];
    for (let i = -3; i <= 3; i++) {
      const monthDate = new Date(currentDate);
      monthDate.setMonth(currentMonth + i);
      months.push({
        name: monthDate.toLocaleString('default', { month: 'long' }),
        active: i === 0
      });
    }
    
    // Render months
    months.forEach(month => {
      const li = document.createElement('li');
      if (month.active) li.classList.add('active');
      li.textContent = month.name;
      li.addEventListener('click', () => handleMonthClick(li, month.name));
      monthsBar.appendChild(li);
    });
    
    // Generate dates for the current month
    renderDatesForMonth(currentDate.toLocaleString('default', { month: 'long' }));
  }
  
  // Render dates for the selected month
  function renderDatesForMonth(monthName) {
    datesBar.innerHTML = '';
    
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const monthIndex = new Date(Date.parse(${monthName} 1, ${year})).getMonth();
    
    // Create a date object for the first day of the selected month
    const firstDay = new Date(year, monthIndex, 1);
    
    // Get the number of days in the month
    const lastDay = new Date(year, monthIndex + 1, 0);
    const totalDays = lastDay.getDate();
    
    // Create a window of 6 days centered around today if it's the current month
    // or show the first 6 days for other months
    let startDay = 1;
    let endDay = Math.min(6, totalDays);
    
    if (monthIndex === currentDate.getMonth()) {
      startDay = Math.max(1, currentDate.getDate() - 2);
      endDay = Math.min(totalDays, startDay + 5);
    }
    
    // Generate date elements
    for (let i = startDay; i <= endDay; i++) {
      const dateObj = new Date(year, monthIndex, i);
      const isToday = 
        dateObj.getDate() === currentDate.getDate() && 
        dateObj.getMonth() === currentDate.getMonth() && 
        dateObj.getFullYear() === currentDate.getFullYear();
      
      // Check if there are reminders for this date
      const dateStr = i.toString();
      const remindersForDate = reminders.filter(r => 
        r.date === dateStr && r.month === monthName
      );
      
      const li = document.createElement('li');
      if (isToday) li.classList.add('active');
      
      // Create indicator dots for different medicines
      const medicineColors = remindersForDate.map(r => r.color);
      const uniqueColors = [...new Set(medicineColors)];
      
      const medicineIndicators = uniqueColors.length > 0 
        ? `<span class="medicines">
            ${uniqueColors.map(color => <span class="color-${color}"></span>).join('')}
           </span>`
        : '';
      
      li.innerHTML = `
        <div>
          ${medicineIndicators}
          <span class="date">${i}</span>
          <span class="day">${dateObj.toLocaleString('en-US', { weekday: 'short' })}</span>
        </div>
      `;
      
      li.addEventListener('click', () => handleDateClick(li, dateStr, monthName));
      datesBar.appendChild(li);
    }
  }
  
  // Handle month click
  function handleMonthClick(element, monthName) {
    // Remove active class from all month items
    const monthItems = monthsBar.querySelectorAll('li');
    monthItems.forEach(item => item.classList.remove('active'));
    
    // Add active class to clicked month
    element.classList.add('active');
    
    // Update dates for the selected month
    renderDatesForMonth(monthName);
    
    // Filter reminders for the selected month
    const filteredReminders = reminders.filter(r => r.month === monthName);
    renderReminders(filteredReminders);
  }
  
  // Handle date click
  function handleDateClick(element, dateStr, monthName) {
    // Remove active class from all date items
    const dateItems = datesBar.querySelectorAll('li');
    dateItems.forEach(item => item.classList.remove('active'));
    
    // Add active class to clicked date
    element.classList.add('active');
    
    // Filter reminders for the selected date and month
    const filteredReminders = reminders.filter(
      r => r.date === dateStr && r.month === monthName
    );
    
    renderReminders(filteredReminders);
  }

  // Save reminders to localStorage
  function saveReminders() {
    localStorage.setItem("reminders", JSON.stringify(reminders));
  }
  
  // Handle medicine filter change
  function handleMedicineFilter(e) {
    const selectedMedicine = e.target.value;
    const filteredReminders =
      selectedMedicine === "0"
        ? reminders
        : reminders.filter((r) => r.name === selectedMedicine);
    renderReminders(filteredReminders);
  }

  // Check for medicine reminders that need notifications
  function checkMedicineReminders() {
    const now = new Date();
    const currentHour = now.getHours().toString().padStart(2, '0');
    const currentMinute = now.getMinutes().toString().padStart(2, '0');
    const currentTimeStr = ${currentHour}:${currentMinute};
    const currentDate = now.getDate().toString();
    const currentMonth = now.toLocaleString('default', { month: 'long' });
    
    // Find reminders due now
    const dueReminders = reminders.filter(reminder => {
      // Check if reminder is for today
      if (reminder.date !== currentDate || reminder.month !== currentMonth) {
        return false;
      }
      
      // Check if it's time for this reminder and it's not taken yet
      return reminder.exactTime === currentTimeStr && !reminder.status;
    });
    
    // Show notification for each due reminder
    dueReminders.forEach(reminder => {
      showNotification(reminder);
    });
  }
  
  // Show notification for a due medicine
  function showNotification(reminder) {
    // Play sound
    notificationSound.play();
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'medicine-notification';
    notification.innerHTML = `
      <div class="notification-content">
        <h3>Medicine Reminder</h3>
        <p>It's time to take your ${reminder.name} (${reminder.dosage})</p>
        <button class="notification-close">Dismiss</button>
        <button class="notification-take">Mark as Taken</button>
      </div>
    `;
    
    document.body.appendChild(notification);
    
    // Add event listeners for buttons
    notification.querySelector('.notification-close').addEventListener('click', () => {
      document.body.removeChild(notification);
    });
    
    notification.querySelector('.notification-take').addEventListener('click', () => {
      // Mark reminder as taken
      reminder.status = true;
      saveReminders();
      renderReminders();
      document.body.removeChild(notification);
    });
    
    // Auto-dismiss after 30 seconds
    setTimeout(() => {
      if (document.body.contains(notification)) {
        document.body.removeChild(notification);
      }
    }, 30000);
  }

  // Show the form when the "New Medicine" button is clicked
  addButton.addEventListener("click", () => {
    medicineFormModal.style.display = "block";
  });

  // Handle form submission
  medicineForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const medicineName = document.querySelector("#medicineName").value;
    const medicineTime = document.querySelector("#medicineTime").value;
    const medicineDosage = document.querySelector("#medicineDosage").value;
    const medicineQuantity = document.querySelector("#medicineQuantity").value;
    
    // Get selected date and month
    const selectedDate = document.querySelector("#mra_date_bar ul li.active .date").textContent;
    const selectedMonth = document.querySelector("#mra_months_bar ul li.active").textContent;

    const newReminder = {
      id: reminders.length + 1,
      name: medicineName,
      dosage: ${medicineQuantity} ${medicineDosage},
      time: ${medicineTime} - ${medicineTime},
      date: selectedDate,
      month: selectedMonth,
      status: false,
      color: Math.random() > 0.5 ? "violet" : "orange", // Random color for demonstration
      exactTime: medicineTime
    };
    
    reminders.push(newReminder);
    saveReminders();
    renderReminders();
    medicineFormModal.style.display = "none";
    medicineForm.reset();
  });

  // Handle form cancellation
  cancelFormButton.addEventListener("click", () => {
    medicineFormModal.style.display = "none";
    medicineForm.reset();
  });

  // Handle Footer Navigation
  footerItems.forEach((item, index) => {
    item.addEventListener("click", () => {
      // Remove active class from all items
      footerItems.forEach(el => el.classList.remove("active"));
      
      // Add active class to clicked item
      item.classList.add("active");
      
      // Update the content based on the clicked item
      switch(index) {
        case 0: // Reminders
          renderReminders();
          document.getElementById("mra_app").querySelector(".mra_header_title").textContent = "My Reminders";
          break;
        case 1: // Settings
          document.getElementById("mra_app").querySelector(".mra_header_title").textContent = "Settings";
          reminderList.innerHTML = `
            <div class="row p-3">
              <div class="col-12">
                <h2>App Settings</h2>
                <div class="p-2">
                  <div class="mb-2"><strong>Notifications</strong>: Enabled</div>
                  <div class="mb-2"><strong>Sound Alerts</strong>: Enabled</div>
                  <div class="mb-2"><strong>Theme</strong>: Light</div>
                </div>
              </div>
            </div>
          `;
          break;
        case 2: // Treatments
          document.getElementById("mra_app").querySelector(".mra_header_title").textContent = "Treatments";
          reminderList.innerHTML = `
            <div class="row p-3">
              <div class="col-12">
                <h2>Active Treatments</h2>
                <div class="p-2">
                  <div class="mb-2"><strong>Blood Pressure</strong>: 3 medications</div>
                  <div class="mb-2"><strong>Diabetes</strong>: 1 medication</div>
                </div>
              </div>
            </div>
          `;
          break;
        case 3: // My Account
          document.getElementById("mra_app").querySelector(".mra_header_title").textContent = "My Account";
          reminderList.innerHTML = `
            <div class="row p-3">
              <div class="col-12">
                <h2>User Profile</h2>
                <div class="p-2">
                  <div class="mb-2"><strong>Name</strong>: John Doe</div>
                  <div class="mb-2"><strong>Email</strong>: john.doe@example.com</div>
                  <div class="mb-2"><strong>Doctor</strong>: Dr. Smith</div>
                </div>
              </div>
            </div>
          `;
          break;
      }
    });
  });

  // Start checking for medicine reminders every minute
  setInterval(checkMedicineReminders, 60000);
  
  // Also check on initial load
  checkMedicineReminders();

  // Initial Render
  renderReminders();
});

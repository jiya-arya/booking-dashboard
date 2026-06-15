console.log("script.js loaded");

//dom elements
const bookingForm = document.getElementById("booking-form");

const nameInput = document.getElementById("name");
const phoneInput = document.getElementById("phone");
const serviceInput = document.getElementById("service");
const dateInput = document.getElementById("date");
const timeInput = document.getElementById("time");

const bookingList = document.getElementById("booking-list");

const searchInput = document.getElementById("search");

const submitButton =
  bookingForm.querySelector("button");

const totalBookingsElement =
  document.getElementById("total-bookings");

const upcomingBookingsElement =
  document.getElementById("upcoming-bookings");

const completedBookingsElement =
  document.getElementById("completed-bookings");

const cancelledBookingsElement =
  document.getElementById("cancelled-bookings");

// array to hold bookings
let bookings = [];
let editBookingId = null;

//form submission
bookingForm.addEventListener(
  "submit",
  function (event) {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    const booking = {
      id: Date.now(),
      name: nameInput.value.trim(),
      phone: phoneInput.value.trim(),
      service: serviceInput.value.trim(),
      date: dateInput.value,
      time: timeInput.value,
      status: "upcoming",
    };

    // Create Booking
    if (editBookingId === null) {
      bookings.push(booking);
    }

    // Update Booking
    else {
      bookings = bookings.map((item) => {
        if (item.id === editBookingId) {
          return {
            ...booking,
            id: editBookingId,
          };
        }

        return item;
      });

      editBookingId = null;

      submitButton.textContent =
        "Add Booking";
    }

    bookingForm.reset();

    renderBookings();
    updateStatistics();
    saveBookings();
  }
);

//render bookings
function renderBookings(
  bookingsToRender = bookings
) {
  bookingList.innerHTML = "";

  if (bookingsToRender.length === 0) {
    bookingList.innerHTML = `
      <p class="empty-state">
        No bookings yet. Add your first booking above.
      </p>
    `;

    return;
  }

  bookingsToRender.forEach((booking) => {
    bookingList.innerHTML +=
      createBookingCard(booking);
  });

  attachDeleteEvents();
  attachEditEvents();
  attachStatusEvents();
}

//create booking card
function createBookingCard(booking) {
  return `
    <div class="booking-card">

      <h3>${booking.name}</h3>

      <p>${booking.phone}</p>

      <p>${booking.service}</p>

      <p>${formatDate(
        booking.date
      )}</p>

      <p>${formatTime(
        booking.time
      )}</p>

      <select
        class="status-select status-${booking.status}"
        data-id="${booking.id}"
      >
        <option
          value="upcoming"
          ${
            booking.status === "upcoming"
              ? "selected"
              : ""
          }
        >
          Upcoming
        </option>

        <option
          value="completed"
          ${
            booking.status === "completed"
              ? "selected"
              : ""
          }
        >
          Completed
        </option>

        <option
          value="cancelled"
          ${
            booking.status === "cancelled"
              ? "selected"
              : ""
          }
        >
          Cancelled
        </option>
      </select>

      <div class="card-actions">

        <button
          class="edit-btn"
          data-id="${booking.id}"
        >
          Edit
        </button>

        <button
          class="delete-btn"
          data-id="${booking.id}"
        >
          Delete
        </button>

      </div>

    </div>
  `;
}

//attach events to dynamically created buttons
function attachDeleteEvents() {
  const deleteButtons =
    document.querySelectorAll(".delete-btn");

  deleteButtons.forEach((button) => {
    button.addEventListener(
      "click",
      function () {
        const bookingId = Number(
          button.dataset.id
        );

        deleteBooking(bookingId);
      }
    );
  });
}

function attachEditEvents() {
  const editButtons =
    document.querySelectorAll(".edit-btn");

  editButtons.forEach((button) => {
    button.addEventListener(
      "click",
      function () {
        const bookingId = Number(
          button.dataset.id
        );

        editBooking(bookingId);
      }
    );
  });
}

function attachStatusEvents() {
  const statusSelects =
    document.querySelectorAll(
      ".status-select"
    );

  statusSelects.forEach((select) => {
    select.addEventListener(
      "change",
      function () {
        const bookingId = Number(
          select.dataset.id
        );

        const newStatus =
          select.value;

        updateBookingStatus(
          bookingId,
          newStatus
        );
      }
    );
  });
}

//delete booking
function deleteBooking(id) {
  const shouldDelete = confirm(
    "Are you sure you want to delete this booking?"
  );

  if (!shouldDelete) {
    return;
  }

  bookings = bookings.filter(
    (booking) => booking.id !== id
  );

  renderBookings();
  updateStatistics();
  saveBookings();
}

//edit booking
function editBooking(id) {
  const booking = bookings.find(
    (booking) => booking.id === id
  );

  if (!booking) return;

  nameInput.value = booking.name;
  phoneInput.value = booking.phone;
  serviceInput.value =
    booking.service;
  dateInput.value = booking.date;
  timeInput.value = booking.time;

  editBookingId = id;

  submitButton.textContent =
    "Update Booking";
}

//update booking status
function updateBookingStatus(
  id,
  newStatus
) {
  bookings = bookings.map((booking) => {
    if (booking.id === id) {
      return {
        ...booking,
        status: newStatus,
      };
    }

    return booking;
  });

  renderBookings();
  updateStatistics();
  saveBookings();
}

//statistics
function updateStatistics() {
  const totalBookings =
    bookings.length;

  const upcomingBookings =
    bookings.filter(
      (booking) =>
        booking.status === "upcoming"
    ).length;

  const completedBookings =
    bookings.filter(
      (booking) =>
        booking.status === "completed"
    ).length;

  const cancelledBookings =
    bookings.filter(
      (booking) =>
        booking.status === "cancelled"
    ).length;

  totalBookingsElement.textContent =
    totalBookings;

  upcomingBookingsElement.textContent =
    upcomingBookings;

  completedBookingsElement.textContent =
    completedBookings;

  cancelledBookingsElement.textContent =
    cancelledBookings;
}

//search functionality
searchInput.addEventListener(
  "input",
  function () {
    const searchTerm =
      searchInput.value.toLowerCase();

    const filteredBookings =
      bookings.filter((booking) =>
        booking.name
          .toLowerCase()
          .includes(searchTerm)
      );

    renderBookings(filteredBookings);
  }
);

//form validation
function validateForm() {
  if (
    nameInput.value.trim().length < 2
  ) {
    alert(
      "Customer name must be at least 2 characters."
    );
    return false;
  }

  const phoneRegex = /^\d{10}$/;

  if (
    !phoneRegex.test(
      phoneInput.value.trim()
    )
  ) {
    alert(
      "Please enter a valid 10-digit phone number."
    );
    return false;
  }

  if (
    serviceInput.value.trim().length < 3
  ) {
    alert(
      "Service must be at least 3 characters."
    );
    return false;
  }

  const selectedDate =
    new Date(dateInput.value);

  const today = new Date();

  today.setHours(0, 0, 0, 0);

  if (selectedDate < today) {
    alert(
      "Booking date cannot be in the past."
    );
    return false;
  }

  if (!timeInput.value) {
    alert(
      "Please select a booking time."
    );
    return false;
  }

  return true;
}

//date formatter
function formatDate(dateString) {
  const date = new Date(dateString);

  return date.toLocaleDateString(
    "en-IN",
    {
      day: "numeric",
      month: "long",
      year: "numeric",
    }
  );
}

//time formatter
function formatTime(timeString) {
  const [hours, minutes] =
    timeString.split(":");

  const date = new Date();

  date.setHours(hours);
  date.setMinutes(minutes);

  return date.toLocaleTimeString(
    "en-IN",
    {
      hour: "numeric",
      minute: "2-digit",
    }
  );
}

//local storage functions
function saveBookings() {
  localStorage.setItem(
    "bookings",
    JSON.stringify(bookings)
  );
}

function loadBookings() {
  const savedBookings =
    localStorage.getItem(
      "bookings"
    );

  if (savedBookings) {
    bookings =
      JSON.parse(savedBookings);
  }
}

// initial load
loadBookings();
renderBookings();
updateStatistics();
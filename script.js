console.log("script.js loaded");

// dom elements
const bookingForm = document.getElementById("booking-form");

const nameInput = document.getElementById("name");
const phoneInput = document.getElementById("phone");
const serviceInput = document.getElementById("service");
const dateInput = document.getElementById("date");
const timeInput = document.getElementById("time");

const bookingList = document.getElementById("booking-list");

const searchInput = document.getElementById("search");

const submitButton = bookingForm.querySelector("button");

const totalBookingsElement = document.getElementById("total-bookings");

const upcomingBookingsElement = document.getElementById("upcoming-bookings");

const completedBookingsElement = document.getElementById("completed-bookings");

const cancelledBookingsElement = document.getElementById("cancelled-bookings");

//form validation
function validateForm() {
  if (nameInput.value.trim().length < 2) {
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

//array to store bookings
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
      name: nameInput.value,
      phone: phoneInput.value,
      service: serviceInput.value,
      date: dateInput.value,
      time: timeInput.value,
      status: "upcoming",
    };

    // Add New Booking
    if (editBookingId === null) {
      bookings.push(booking);
    }

    // Update Existing Booking
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

  // Empty State
  if (bookingsToRender.length === 0) {
    bookingList.innerHTML = `
      <p class="empty-state">
        No bookings yet. Add your first booking above.
      </p>
    `;

    return;
  }

  // Render Cards
  bookingsToRender.forEach((booking) => {
    const bookingCard = `
      <div class="booking-card">

        <h3>${booking.name}</h3>

        <p>${booking.phone}</p>

        <p>${booking.service}</p>

        <p>${booking.date}</p>

        <p>${booking.time}</p>

        <select
          class="status-select"
          data-id="${booking.id}"
        >
          <option
            value="upcoming"
            ${booking.status === "upcoming"
        ? "selected"
        : ""
      }
          >
            Upcoming
          </option>

          <option
            value="completed"
            ${booking.status === "completed"
        ? "selected"
        : ""
      }
          >
            Completed
          </option>

          <option
            value="cancelled"
            ${booking.status === "cancelled"
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

    bookingList.innerHTML += bookingCard;
  });

  // Delete Buttons
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

  // Edit Buttons
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

  // Status Dropdowns
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

//delete booking status
function deleteBooking(id) {
  bookings = bookings.filter(
    (booking) => booking.id !== id
  );

  renderBookings();
  updateStatistics();
  saveBookings();
}

// edit booking status
function editBooking(id) {
  const booking = bookings.find(
    (booking) => booking.id === id
  );

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

// Initial Render - meaning when the page loads, we want to render the bookings and update the statistics
loadBookings();
renderBookings();
updateStatistics();

// Save bookings to localStorage
// jason.stringify(bookings) converts the bookings array into a JSON string so that it can be stored in localStorage.
function saveBookings() {
  localStorage.setItem(
    "bookings",
    JSON.stringify(bookings)
  );
}

// Load bookings from localStorage
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
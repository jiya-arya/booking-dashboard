console.log("script.js loaded");

// DOM Elements
const bookingForm = document.getElementById("booking-form");

const nameInput = document.getElementById("name");
const phoneInput = document.getElementById("phone");
const serviceInput = document.getElementById("service");
const dateInput = document.getElementById("date");
const timeInput = document.getElementById("time");

const bookingList = document.getElementById("booking-list");

const submitButton = bookingForm.querySelector("button");

const totalBookingsElement = document.getElementById("total-bookings");

const upcomingBookingsElement = document.getElementById("upcoming-bookings");

const completedBookingsElement = document.getElementById("completed-bookings");

const cancelledBookingsElement = document.getElementById("cancelled-bookings");

// Application State
let bookings = [];

// Edit Booking State
let editBookingId = null;

// Form Submit Event
bookingForm.addEventListener("submit", function (event) {
  event.preventDefault();

  // Create Booking Object
  const booking = {
    id: Date.now(),
    name: nameInput.value,
    phone: phoneInput.value,
    service: serviceInput.value,
    date: dateInput.value,
    time: timeInput.value,
    status: "upcoming",
  };

  // Add booking to state
  // bookings.push(booking);

  // If editBookingId is null, we are adding a new booking. Otherwise, we are updating an existing booking.
  if (editBookingId === null) {
    bookings.push(booking);
  } else {
    bookings = bookings.map((item) => {
      if (item.id === editBookingId) {
        return {
          // ... in short is a way to copy all properties of an object into a new object.
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

  // Reset form
  bookingForm.reset();

  // Update UI
  renderBookings();
  updateStatistics();
});

// Render Bookings
function renderBookings() {
  bookingList.innerHTML = "";

  // Guard Clause
  if (bookings.length === 0) {
    bookingList.innerHTML = `
      <p class="empty-state">
        No bookings yet. Add your first booking above.
      </p>
    `;

    return;
  }

  // Render each booking card
  bookings.forEach((booking) => {
    const bookingCard = `
      <div class="booking-card">
        <h3>${booking.name}</h3>
        <p>${booking.phone}</p>
        <p>${booking.service}</p>
        <p>${booking.date}</p>
        <p>${booking.time}</p>
        <p>${booking.status}</p>

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

  // Attach delete button events
  const deleteButtons =
    document.querySelectorAll(".delete-btn");

  //in short dataset is a way to access data attributes in HTML.
  deleteButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const bookingId = Number(button.dataset.id);

      deleteBooking(bookingId);
    });
  });

  // Attach edit button events
  const editButtons =
    document.querySelectorAll(".edit-btn");

  editButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const bookingId = Number(button.dataset.id);

      editBooking(bookingId);
    });
  });
}

// Delete Booking
function deleteBooking(id) {
  bookings = bookings.filter(
    (booking) => booking.id !== id
  );

  renderBookings();
}

// Edit Booking
function editBooking(id) {
  const booking = bookings.find(
    (booking) => booking.id === id
  );

  // Populate form with booking data
  nameInput.value = booking.name;
  phoneInput.value = booking.phone;
  serviceInput.value = booking.service;
  dateInput.value = booking.date;
  timeInput.value = booking.time;

  // Set edit state
  editBookingId = id;

  // Change button text of form to indicate update mode
  submitButton.textContent = "Update Booking";

}

// Update Statistics
function updateStatistics() {
  const totalBookings = bookings.length;

  const upcomingBookings = bookings.filter(
    (booking) => booking.status === "upcoming"
  ).length;

  const completedBookings = bookings.filter(
    (booking) => booking.status === "completed"
  ).length;

  const cancelledBookings = bookings.filter(
    (booking) => booking.status === "cancelled"
  ).length;

  totalBookingsElement.textContent = totalBookings;
  upcomingBookingsElement.textContent = upcomingBookings;
  completedBookingsElement.textContent = completedBookings;
  cancelledBookingsElement.textContent = cancelledBookings;
}
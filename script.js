console.log("script.js loaded");

// DOM Elements
const bookingForm = document.getElementById("booking-form");

const nameInput = document.getElementById("name");
const phoneInput = document.getElementById("phone");
const serviceInput = document.getElementById("service");
const dateInput = document.getElementById("date");
const timeInput = document.getElementById("time");

const bookingList = document.getElementById("booking-list");

// Application State
let bookings = [];

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
  bookings.push(booking);

  // Reset form
  bookingForm.reset();

  // Update UI
  renderBookings();
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
          <button>Edit</button>

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

  deleteButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const bookingId = Number(button.dataset.id);

      deleteBooking(bookingId);
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
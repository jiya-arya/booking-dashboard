console.log("script.js loaded");

// getting elements
// dom elements

const bookingForm = document.getElementById("booking-form");

const nameInput = document.getElementById("name");
const phoneInput = document.getElementById("phone");
const serviceInput = document.getElementById("service");
const dateInput = document.getElementById("date");
const timeInput = document.getElementById("time");

const bookingList = document.getElementById("booking-list");

// state
// this array will hold all the bookings (objects) made by the user
let bookings = [];

// form submit event
// yeh event listerner tab trigger hoga jab user form ko submit karega
// preventDefault() method is used to prevent the default behavior of the form submission, which is to reload the page. This allows us to handle the form submission with JavaScript instead.

bookingForm.addEventListener("submit", function (event) {
  event.preventDefault();

  // create a booking object that will hold the data entered by the user in the form
  const booking = {
    id: Date.now(),
    name: nameInput.value,
    phone: phoneInput.value,
    service: serviceInput.value,
    date: dateInput.value,
    time: timeInput.value,

    status: "upcoming", // default status is upcoming
  };

  bookings.push(booking);

  //   reset
  bookingForm.reset();

  console.log("Current Booking:", booking);
  console.log("All Bookings:", bookings);

  console.log("Form Submitted");

  // call the render function to display the bookings on the page
  renderBookings();
});

// render function jo bookings ko display karega
function renderBookings() {
  console.log("Rendering Bookings");
  bookingList.innerHTML = "";

  //   gaurd clause - agar bookings array empty hai to ek message show karo aur function se return kar do taki aage ka code execute na ho
  if (bookings.length === 0) {
    bookingList.innerHTML = `
    <p class="empty-state">
      No bookings yet. Add your first booking above.
    </p>
  `;

    return;
  }

  // foreach loop jo bookings array ke har booking object ko iterate karega aur usko console me print karega

  bookings.forEach((booking) => {
    console.log(booking);

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
            <button>Delete</button>
        </div>
    </div>`;
    bookingList.innerHTML += bookingCard;
  });
}

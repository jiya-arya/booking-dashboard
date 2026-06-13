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
           <button class="delete-btn" data-id="${booking.id}"> Delete </button>
        </div>
    </div>`;
    bookingList.innerHTML += bookingCard;
  });

  //   call deletebooking();
  deleteBooking();
}

// yha hum event delegation ka use karenge taki hum delete button ke click event ko handle kar sake kyunki delete button dynamically generate ho raha hai. delegation mean ki hum parent element (bookingList) par event listener lagayenge aur jab click event trigger hoga to hum check karenge ki kya click hua element delete button hai ya nahi. agar delete button hai to hum uski id ko get karenge aur deleteBooking function ko call karenge.

function deleteBooking(id) {
  console.log(id);
//   filter method ka use karke hum bookings array me se us booking ko remove karenge jiska id match karta hai delete button ke data-id attribute se. filter method ek naya array return karta hai jisme wo sare elements hote hai jo condition ko satisfy karte hai. yaha hum condition laga rahe hai ki booking.id !== id, iska matlab hai ki hum us booking ko rakhenge jiska id delete button ke id se match nahi karta.
  bookings = bookings.filter((booking) => booking.id !== id);

//   render booking isliye call kar rahe hai taki page update ho jaye aur delete hone ke baad ki bookings dikhai de.
  renderBookings();

  const deleteButtons = document.querySelectorAll(".delete-btn");

  deleteButtons.forEach((button) => {
    button.addEventListener("click", function () {
      console.log("Delete clicked");

      //   button data.id kya kr rha hai , yeh us button ke data-id attribute ki value ko get kr rha hai jo ki booking id hai. isse hume pata chalega ki kaunse booking ko delete karna hai.

      const bookingId = Number(button.dataset.id);

      console.log(bookingId);
      deleteBooking(bookingId);
    });
  });
}

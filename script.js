const bookingModal = document.getElementById("bookingModal");
const openBooking = document.getElementById("openBooking");
const heroBook = document.getElementById("heroBook");
const ctaBook = document.getElementById("ctaBook");
const closeBooking = document.getElementById("closeBooking");
const bookingForm = document.getElementById("bookingForm");
const mobileMenu = document.getElementById("mobileMenu");
const nav = document.querySelector(".navbar nav");
const roomButtons = document.querySelectorAll(".room-book");
const roomSelect = document.getElementById("room");

const fullName = document.getElementById("fullName");
const email = document.getElementById("email");
const phone = document.getElementById("phone");
const checkIn = document.getElementById("checkIn");
const checkOut = document.getElementById("checkOut");
const guests = document.getElementById("guests");
const notes = document.getElementById("notes");

const fullNameError = document.getElementById("fullNameError");
const emailError = document.getElementById("emailError");
const phoneError = document.getElementById("phoneError");
const checkInError = document.getElementById("checkInError");
const checkOutError = document.getElementById("checkOutError");
const roomError = document.getElementById("roomError");
const guestsError = document.getElementById("guestsError");

const successMessage = document.getElementById("successMessage");

function getToday() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

function getNextDay(dateValue) {
    const date = new Date(dateValue + "T00:00:00");
    date.setDate(date.getDate() + 1);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

function setDateRules() {
    const today = getToday();

    checkIn.min = today;
    checkOut.min = getNextDay(today);

    if (checkIn.value && checkIn.value < today) {
        checkIn.value = "";
    }

    if (checkOut.value && checkOut.value <= checkIn.value) {
        checkOut.value = "";
    }
}

function openModal() {
    bookingModal.classList.add("active");
    document.body.style.overflow = "hidden";
    setDateRules();
}

function closeModal() {
    bookingModal.classList.remove("active");
    document.body.style.overflow = "";
}

openBooking.addEventListener("click", openModal);
heroBook.addEventListener("click", openModal);
ctaBook.addEventListener("click", openModal);

closeBooking.addEventListener("click", closeModal);

bookingModal.addEventListener("click", function (event) {
    if (event.target === bookingModal) {
        closeModal();
    }
});

document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
        closeModal();
    }
});

roomButtons.forEach(function (button) {
    button.addEventListener("click", function () {
        roomSelect.value = button.dataset.room;
        openModal();
    });
});

mobileMenu.addEventListener("click", function () {
    if (nav.style.display === "flex") {
        nav.style.display = "none";
        mobileMenu.textContent = "☰";
    } else {
        nav.style.display = "flex";
        nav.style.flexDirection = "column";
        nav.style.position = "absolute";
        nav.style.top = "68px";
        nav.style.left = "0";
        nav.style.width = "100%";
        nav.style.padding = "25px";
        nav.style.background = "#080808";
        nav.style.borderBottom = "1px solid #2a2a2a";
        mobileMenu.textContent = "×";
    }
});

checkIn.addEventListener("change", function () {
    if (checkIn.value) {
        checkOut.min = getNextDay(checkIn.value);

        if (checkOut.value && checkOut.value <= checkIn.value) {
            checkOut.value = "";
        }
    } else {
        checkOut.min = getNextDay(getToday());
    }
});

function clearErrors() {
    fullNameError.textContent = "";
    emailError.textContent = "";
    phoneError.textContent = "";
    checkInError.textContent = "";
    checkOutError.textContent = "";
    roomError.textContent = "";
    guestsError.textContent = "";
}

bookingForm.addEventListener("submit", function (event) {
    event.preventDefault();

    clearErrors();

    let isValid = true;
    const today = getToday();

    if (fullName.value.trim() === "") {
        fullNameError.textContent = "Please enter your full name.";
        isValid = false;
    }

    if (email.value.trim() === "") {
        emailError.textContent = "Please enter your email address.";
        isValid = false;
    } else if (!email.validity.valid) {
        emailError.textContent = "Please enter a valid email address.";
        isValid = false;
    }

    if (phone.value.trim() === "") {
        phoneError.textContent = "Please enter your phone number.";
        isValid = false;
    }

    if (checkIn.value === "") {
        checkInError.textContent = "Please select your check-in date.";
        isValid = false;
    } else if (checkIn.value < today) {
        checkInError.textContent = "Check-in date cannot be in the past.";
        isValid = false;
    }

    if (checkOut.value === "") {
        checkOutError.textContent = "Please select your check-out date.";
        isValid = false;
    }

    if (checkIn.value !== "" && checkOut.value !== "") {
        const checkInDate = new Date(checkIn.value);
        const checkOutDate = new Date(checkOut.value);

        if (checkOutDate <= checkInDate) {
            checkOutError.textContent =
                "Check-out must be at least one day after check-in.";
            isValid = false;
        }
    }

    if (room.value === "") {
        roomError.textContent = "Please select a room.";
        isValid = false;
    }

    if (guests.value === "") {
        guestsError.textContent = "Please enter the number of guests.";
        isValid = false;
    } else if (guests.value < 1 || guests.value > 20) {
        guestsError.textContent =
            "Number of guests must be between 1 and 20.";
        isValid = false;
    }

    if (!isValid) {
        successMessage.style.display = "none";
        return;
    }

    const booking = {
        id: Date.now(),
        fullName: fullName.value.trim(),
        email: email.value.trim(),
        phone: phone.value.trim(),
        checkIn: checkIn.value,
        checkOut: checkOut.value,
        room: room.value,
        guests: guests.value,
        notes: notes.value.trim(),
        submittedAt: new Date().toLocaleString()
    };

    const existingBookings =
        JSON.parse(localStorage.getItem("azureHavenBookings")) || [];

    existingBookings.push(booking);

    localStorage.setItem(
        "azureHavenBookings",
        JSON.stringify(existingBookings)
    );

    successMessage.style.display = "block";

    bookingForm.reset();
    setDateRules();

    setTimeout(function () {
        closeModal();
        successMessage.style.display = "none";
    }, 2000);
});

setDateRules();
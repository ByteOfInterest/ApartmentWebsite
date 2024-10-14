// Get modal element and close button
const modal = document.getElementById("roomModal");
const closeBtn = document.querySelector(".close");

// Room data for modal content
const roomData = {
    "luxus-szoba": {
        title: "Luxus Szoba",
        description: "A Luxus Szoba lenyűgöző king-size ággyal, privát erkéllyel és pazar kilátással rendelkezik. Ingyenes Wi-Fi, síkképernyős TV és szobaszerviz is elérhető.",
        img1: "https://place-hold.it/300x200",
        img2: "https://place-hold.it/300x200",
    },
    "standard-szoba": {
        title: "Standard Szoba",
        description: "A Standard Szoba kényelmes szállást biztosít, franciaággyal, privát fürdőszobával és ingyenes reggelivel. Ideális egyéni utazóknak vagy pároknak.",
        img1: "https://place-hold.it/300x200",
        img2: "https://place-hold.it/300x200",
    },
    "csalad-szoba": {
        title: "Családi Lakosztály",
        description: "A Családi Lakosztály tökéletes választás családok számára. Két hálószobával, nappalival és teljesen felszerelt konyhával várja vendégeit. Ideális hosszabb tartózkodásra.",
        img1: "https://place-hold.it/300x200",
        img2: "https://place-hold.it/300x200",
    }
};

// Handle click event for room containers
document.querySelectorAll(".room-container").forEach((room) => {
    room.addEventListener("click", () => {
        const roomType = room.getAttribute("data-room");
        const roomInfo = roomData[roomType];

        // Update modal content
        document.getElementById("modal-title").textContent = roomInfo.title;
        document.getElementById("modal-description").textContent = roomInfo.description;
        document.getElementById("modal-img-1").src = roomInfo.img1;
        document.getElementById("modal-img-2").src = roomInfo.img2;

        // Show the modal
        modal.style.display = "block";
    });
});

// Close modal when "x" is clicked
closeBtn.onclick = function() {
    modal.style.display = "none";
}

// Close modal when clicking outside the modal content
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

// Redirect to booking page when "Foglalás" button is clicked
document.getElementById("book-now").addEventListener("click", function() {
    window.location.href = "../booking/index.html";
});

// JavaScript for menu toggle (hamurger icon)
// Get the menu icon and navbar elements
const menuIcon = document.getElementById('menu-icon');
const navbar = document.getElementById('navbar');

// Add click event to toggle the menu visibility and change the icon
menuIcon.addEventListener('click', () => {
    // Toggle the navbar display
    navbar.classList.toggle('active');

    // Change the icon from bars to X and vice versa
    if (navbar.classList.contains('active')) {
        menuIcon.innerHTML = '<i class="fa fa-times"></i>'; // Change to X
    } else {
        menuIcon.innerHTML = '<i class="fa fa-bars"></i>';  // Change to 3 bars
    }
});


// Get modal element and close button
const modal = document.getElementById("roomModal");
const closeBtn = document.querySelector(".close");

// Room data for modal content
const roomData = {
    "studio-kozoskonyha-4": {
        title: "Stúdiószoba közös konyhával - Nr.4",
        description: "Emeleti szoba közös, felszerelt konyhával, TV-vel, hűtővel, tusolóval, WC-vel, terasszal és légkondicionálóval.",
        img1: "https://place-hold.it/300x200",
        img2: "https://place-hold.it/300x200"
    },
    "studio-kozoskonyha-5": {
        title: "Stúdiószoba közös konyhával - Nr.5",
        description: "Emeleti szoba közös konyhával, TV-vel, hűtővel, tusolóval, WC-vel, légkondicionálóval, terasszal és szúnyoghálóval.",
        img1: "https://place-hold.it/300x200",
        img2: "https://place-hold.it/300x200"
    },
    "studio-sajatkonyha-2": {
        title: "Stúdiószoba saját konyhával - Nr.2",
        description: "Földszinti szoba felszerelt konyhával, TV-vel, hűtővel, tusolóval, WC-vel, terasz résszel és szúnyoghálóval.",
        img1: "https://place-hold.it/300x200",
        img2: "https://place-hold.it/300x200"
    },
    "studio-sajatkonyha-3": {
        title: "Stúdiószoba saját konyhával - Nr.3",
        description: "Emeleti szoba felszerelt minikonyhával, TV-vel, hűtővel, tusolóval, WC-vel, terasszal, légkondicionálóval és szúnyoghálóval.",
        img1: "https://place-hold.it/300x200",
        img2: "https://place-hold.it/300x200"
    },
    "apartman-15-emelet": {
        title: "1,5 szobás apartman - Emeleti",
        description: "Emeleti, légkondicionált apartman franciaággyal, kanapéval, hálófülkével, teljesen felszerelt konyhával, terasszal és szúnyoghálóval.",
        img1: "https://place-hold.it/300x200",
        img2: "https://place-hold.it/300x200"
    },
    "apartman-15-foldszint": {
        title: "1,5 szobás apartman - Földszinti",
        description: "Földszinti, nagy hálószoba franciaággyal, nappali étkezővel, felszerelt konyhával, fürdőszobával, terasszal, TV-vel, redőnnyel és szúnyoghálóval.",
        img1: "https://place-hold.it/300x200",
        img2: "https://place-hold.it/300x200"
    },
    "apartman-2-app2": {
        title: "2 szobás apartman - App.2",
        description: "Emeleti apartman 2 hálószobával, 2 TV-vel, felszerelt konyhával, étkezővel, fürdőszobával, terasszal, szúnyoghálóval és redőnnyel.",
        img1: "https://place-hold.it/300x200",
        img2: "https://place-hold.it/300x200"
    },
    "apartman-2-app3": {
        title: "2 szobás apartman - App.3",
        description: "Emeleti apartman 2 hálószobával, 2 TV-vel, felszerelt konyhával, étkezővel, fürdőszobával, terasszal és szúnyoghálóval.",
        img1: "https://place-hold.it/300x200",
        img2: "https://place-hold.it/300x200"
    },
    "studio-apartman": {
        title: "Stúdió apartman",
        description: "Emeleti stúdió hálószobával, nappalival (kihúzható kanapéval), felszerelt konyhával, tusolóval, WC-vel, terasszal és szúnyoghálóval.",
        img1: "https://place-hold.it/300x200",
        img2: "https://place-hold.it/300x200"
    }
};

// Handle click event for room containers
document.querySelectorAll(".room-container").forEach((room) => {
    room.addEventListener("click", () => {
        const roomType = room.getAttribute("data-room");
        const roomInfo = roomData[roomType];

        console.log("Room clicked:", roomType);  // Add this for debugging

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

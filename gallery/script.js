document.addEventListener("DOMContentLoaded", function() {
    const modal = document.getElementById("imageModal");
    const fullSizeImage = document.getElementById("fullSizeImage");
    const modalClose = document.getElementById("modalClose");

    document.querySelectorAll(".gallery-grid img").forEach((img) => {
        img.addEventListener("click", () => {
            console.log("Image clicked:", img.src);  // Logs image path
            fullSizeImage.src = img.src;
            modal.style.display = "flex";
        });
    });

    // Close the modal when the close button is clicked
    modalClose.addEventListener("click", () => {
        modal.style.display = "none";
    });

    // Close the modal when clicking outside the image
    modal.addEventListener("click", (e) => {
        if (e.target === modal) {
            modal.style.display = "none";
        }
    });
});

// Modal for full size image
// Get elements
const galleryImages = document.querySelectorAll('.gallery-img');
const modal = document.getElementById('imageModal');
const fullSizeImage = document.getElementById('fullSizeImage');
const modalClose = document.getElementById('modalClose');

// Open modal with the clicked image
galleryImages.forEach(image => {
    image.addEventListener('click', () => {
        fullSizeImage.src = image.src;
        modal.style.display = 'flex';
    });
});

// Close modal when the close button or outside the image is clicked
modalClose.addEventListener('click', () => {
    modal.style.display = 'none';
});

modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.style.display = 'none';
    }
});
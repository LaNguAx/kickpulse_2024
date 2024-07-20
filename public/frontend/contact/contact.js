document.getElementById('contactForm').addEventListener('submit', function(event) {
    event.preventDefault();
    console.log('Form submission prevented');

    // Replace the <h2> content with the success message
    var h2Element = document.querySelector('.card h2');
    h2Element.textContent = 'Your message has been sent successfully ✔';
    h2Element.classList.add('success-message-style'); // Add a class to apply the success message style

    // Reset the form
    event.target.reset();
    console.log('Form reset');
});

const video = document.getElementById('myVideo');
if (video)
     {
    video.addEventListener('ended', function() 
    {
        this.currentTime = 0;
        this.play();
    });
}
document.addEventListener("DOMContentLoaded", function() 
{
    const slideContainer = document.querySelector('.slide-brand');
    const slideButtons = document.querySelectorAll('.slide-brand button');
    const prevButton = document.getElementById('prev-slide');
    const nextButton = document.getElementById('next-slide');

    let currentIndex = 0;
    const visibleButtons = 4;
    let totalButtons = slideButtons.length;

    function updateSlidePosition() 
    {
        if (totalButtons === 0) return;

        const buttonWidth = slideButtons[0].offsetWidth;
        const gap = parseInt(window.getComputedStyle(slideContainer).gap, 10) || 0;
        const totalWidth = buttonWidth + gap;
        const offset = -currentIndex * totalWidth;

        slideContainer.style.transition = 'transform 0.5s ease-in-out';
        slideContainer.style.transform =` translateX(${offset}px)`;

        slideButtons.forEach((button, index) => 
            {
            if (index >= currentIndex && index < currentIndex + visibleButtons)
                 {
                button.style.display = 'block';
            } else {
                button.style.display = 'none';
            }
        });
    }

    prevButton.addEventListener('click', () => {
        if (currentIndex > 0) {
            currentIndex--;
            updateSlidePosition();
        }
    });

    nextButton.addEventListener('click', () => {
        if (currentIndex < totalButtons - visibleButtons) {
            currentIndex++;
            updateSlidePosition();
        }
    });

    updateSlidePosition();

    window.addEventListener('resize', updateSlidePosition);

    setInterval(() => {
        totalButtons = slideButtons.length;
        updateSlidePosition();
    }, 0);
});
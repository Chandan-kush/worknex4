// ===========================
// WORKNEX Loading Screen JS
// ===========================
if (sessionStorage.getItem("loaderShown")) {
    document.getElementById("loader-container").style.display = "none";
} else {
    sessionStorage.setItem("loaderShown", "true");
}
(function() {
    'use strict';
    document.body.style.overflow = "hidden";
    // Configuration
    const LOADER_MIN_DISPLAY_TIME = 600; // Minimum time to show loader (ms)
    const FADE_OUT_DURATION = 600; // Fade out animation duration (ms)

    // Elements
    const loaderContainer = document.getElementById('loader-container');
    const progressBar = document.querySelector('.progress-bar');

    // Track when page starts loading
    const pageStartTime = Date.now();

    // Simulate progress
    function simulateProgress() {
        let currentProgress = 0;
        const progressInterval = setInterval(() => {
            // Increase progress gradually, slowing down as it approaches 95%
            const increment = Math.random() * (100 - currentProgress) * 0.08;
            currentProgress = Math.min(currentProgress + increment, 95);
            
            progressBar.style.width = currentProgress + '%';

            // Stop interval when we reach 95%
            if (currentProgress >= 95) {
                clearInterval(progressInterval);
            }
        }, 200);

        return progressInterval;
    }

    // Start progress simulation
    let progressInterval = simulateProgress();

    // Hide loader with fade animation
    function hideLoader() {
        const elapsedTime = Date.now() - pageStartTime;
        const remainingTime = Math.max(0, LOADER_MIN_DISPLAY_TIME - elapsedTime);

        // Ensure minimum display time before hiding
        setTimeout(() => {
            // Complete the progress bar
            progressBar.style.width = '100%';

            // Add fade-out animation
            loaderContainer.classList.add('fade-out');

            // Remove loader from DOM after fade completes
            setTimeout(() => {
loaderContainer.style.display = 'none';
document.body.style.overflow = "auto";
}, FADE_OUT_DURATION);
        }, remainingTime);
    }

    // Listen for page load completion
    if (document.readyState === 'loading') {
        // Page is still loading
        document.addEventListener('DOMContentLoaded', hideLoader);
        window.addEventListener('load', hideLoader);
    } else {
        // Page is already loaded
        hideLoader();
    }

    // Fallback: Hide loader after maximum time (safety net)
    setTimeout(() => {
        if (loaderContainer && loaderContainer.style.display !== 'none') {
            hideLoader();
        }
    }, 5000); // 5 second maximum display time

    // Cleanup on page unload
    window.addEventListener('beforeunload', () => {
        if (progressInterval) {
            clearInterval(progressInterval);
        }
    });
})();

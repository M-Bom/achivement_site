// Scroll animation observer
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
            observer.unobserve(entry.target); // Stop observing once it's visible
        }
    });
}, observerOptions);

// Select all elements to animate
document.addEventListener('DOMContentLoaded', () => {
    const fadeElements = document.querySelectorAll('.animate-on-scroll');
    fadeElements.forEach(el => observer.observe(el));
});

// --- DRAGGABLE WINDOW LOGIC ---

// 1. Logic to OPEN windows (same as modals)
const openBtns = document.querySelectorAll('.open-window-btn'); // Updated to match HTML
openBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const targetId = btn.getAttribute('data-target');
        const windowEl = document.getElementById(targetId);

        // Put the opened window on top of others
        document.querySelectorAll('.draggable-window').forEach(w => w.style.zIndex = 1000);
        windowEl.style.zIndex = 1001;

        windowEl.classList.add('visible');
    });
});

// 2. Logic to CLOSE windows
const closeBtns = document.querySelectorAll('.close-draggable');
closeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        btn.closest('.draggable-window').classList.remove('visible');
    });
});

// 3. Logic to DRAG windows
const draggableWindows = document.querySelectorAll('.draggable-window');

draggableWindows.forEach(win => {
    const titlebar = win.querySelector('.window-titlebar');

    let isDragging = false;
    let offsetX = 0;
    let offsetY = 0;

    titlebar.addEventListener('mousedown', (e) => {
        isDragging = true;
        // Calculate offset so the window doesn't snap its top-left corner to your mouse
        offsetX = e.clientX - win.getBoundingClientRect().left;
        offsetY = e.clientY - win.getBoundingClientRect().top;

        // Bring active window to front
        document.querySelectorAll('.draggable-window').forEach(w => w.style.zIndex = 1000);
        win.style.zIndex = 1001;
    });

    // We add mousemove/mouseup to the WHOLE document, not just the titlebar,
    // so if you drag your mouse really fast off the titlebar, it doesn't break.
    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;

        // Calculate new position relative to the page
        const newX = e.clientX - offsetX + window.scrollX;
        const newY = e.clientY - offsetY + window.scrollY;

        // Apply new position via inline CSS
        win.style.left = `${newX}px`;
        win.style.top = `${newY}px`;
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
    });
});

// --- OS BOOT SEQUENCE LOGIC ---
document.addEventListener("DOMContentLoaded", () => {
    const bootScreen = document.getElementById("boot-screen");

    if (bootScreen) {
        // Check if the page is being reloaded
        const navEntries = performance.getEntriesByType("navigation");
        if (navEntries.length > 0 && navEntries[0].type === "reload") {
            
            // Prevent scrolling while booting
            document.body.style.overflow = "hidden";

            // Wait 2500ms (2.5 seconds) then hide the boot screen
            // (I bounced this back up slightly so you can actually see it run since it only happens rarely now! Change back to 5 if you want the instant flash.)
            setTimeout(() => {
                bootScreen.classList.add("hidden");
                document.body.style.overflow = "auto";
            }, 2500);

        } else {
            // If they just navigated here normally, hide it instantly
            bootScreen.classList.add("hidden");
        }
    }
});

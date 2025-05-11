// Navigation bar scroll effect
document.addEventListener('DOMContentLoaded', function() {
    // Load and inject navbar

    const navbar = document.getElementById('main-navbar');
    const placeholder = document.getElementById('navbar-placeholder');
    
    // Initial check for scroll position
    // if (window.scrollY > 0) {
    //     navbar.style.opacity = '1';
    //     placeholder.style.opacity = '0';
    // } else {
    //     navbar.style.opacity = '0';
    //     placeholder.style.opacity = '1';
    // }
    
    // Scroll event to toggle nav appearance
    // window.addEventListener('scroll', function() {
    //     console.log('Scroll position:', window.scrollY);
    //     console.log(window.innerHeight);
    //     const scrollThreshold = window.innerHeight * 0.8; // 50% of viewport height
    //     if (window.scrollY > scrollThreshold) {
    //         navbar.style.opacity = '1';
    //         placeholder.style.opacity = '0';
    //     } else {
    //         navbar.style.opacity = '0';
    //         placeholder.style.opacity = '1';
    //     }
    // });


    const navbarContainer = document.getElementById('navbar-container');
    if (navbarContainer) {
     
        fetch('components/navbar.html')
            .then(response => response.text())
            .then(html => {
                navbarContainer.innerHTML = html;
                
                // Set active navigation link based on current page
                const currentPage = window.location.pathname;
                let linkId;
                
                // Handle both direct pages and subpages
                if (currentPage.includes('index.html') || currentPage.endsWith('/')) {
                    // Homepage - no active link
                } else if (currentPage.includes('videos') || currentPage.includes('/pages/videos/')) {
                    linkId = 'videos-link';
                } else if (currentPage.includes('photos') || currentPage.includes('/pages/photos/')) {
                    linkId = 'photos-link';
                } else if (currentPage.includes('paintings') || currentPage.includes('/pages/paintings/')) {
                    linkId = 'paintings-link';
                } else if (currentPage.includes('about')) {
                    linkId = 'about-link';
                }
                
                if (linkId) {
                    const activeLink = document.getElementById(linkId);
                    if (activeLink) {
                        activeLink.classList.add('active');
                    }
                }
                
                // Apply navbar scroll effects after navbar is loaded
                applyNavbarScrollEffects();
            })
            .catch(error => {
                console.error('Error loading navbar:', error);
                navbarContainer.innerHTML = '<p>Error loading navigation. Please refresh the page.</p>';
            });
    }
});

// Navbar scroll effect - extracted to a separate function
function applyNavbarScrollEffects() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;
    
    // Scroll event
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.style.backgroundColor = 'rgba(255, 255, 255, 0.98)';
            navbar.style.padding = '15px 0';
        } else {
            navbar.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
            navbar.style.padding = '20px 0';
        }
    });
    
    // Initial state
    if (window.scrollY > 50) {
        navbar.style.backgroundColor = 'rgba(255, 255, 255, 0.98)';
        navbar.style.padding = '15px 0';
    } else {
        navbar.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
        navbar.style.padding = '20px 0';
    }
}

// Smooth scrolling for anchor links
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80, // Offset for fixed navbar
                    behavior: 'smooth'
                });
            }
        });
    });
});

// Image loading animation
window.addEventListener('load', function() {
    const thumbnails = document.querySelectorAll('.thumbnail-item img');
    
    thumbnails.forEach((img, index) => {
        setTimeout(() => {
            img.style.opacity = '1';
        }, index * 100); // Staggered appearance
    });
});

// Painting modal functionality
document.addEventListener('DOMContentLoaded', function() {
    // Only run on the paintings page
    if (!document.querySelector('.paintings-grid')) return;
    
    // Reference to the grid container
    const paintingsGrid = document.getElementById('paintings-grid');
    
    // Fetch the painting data from JSON file
    fetch('data/paintingData.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // Store painting data for modal navigation
            window.paintingData = data.paintings;
            
            // Generate the grid items
            generatePaintingsGrid(data.paintings);
            
            // Initialize modal functionality
            initializePaintingModal();
        })
        .catch(error => {
            console.error('Error loading painting data:', error);
            paintingsGrid.innerHTML = '<p>Error loading paintings. Please refresh the page.</p>';
        });
    
    // Generate the paintings grid
    function generatePaintingsGrid(paintings) {
        // Clear any existing content
        paintingsGrid.innerHTML = '';
        
        // Generate HTML for each painting
        paintings.forEach(painting => {
            const paintingItem = document.createElement('div');
            paintingItem.className = 'painting-item';
            paintingItem.dataset.id = painting.id;
            paintingItem.dataset.status = painting.status;
            
            paintingItem.innerHTML = `
                <a href="#" class="painting-link">
                    <img src="${painting.imgSrc}" alt="${painting.alt}">
                    <div class="painting-item-overlay">
                        <h3>${painting.title}</h3>
                        <p>${painting.shortDescription}</p>
                    </div>
                </a>
            `;
            
            paintingsGrid.appendChild(paintingItem);
        });
    }
    
    // Initialize modal functionality
    function initializePaintingModal() {
        // Elements
        const modal = document.getElementById('painting-modal');
        const modalImage = document.getElementById('modal-image');
        const modalTitle = document.getElementById('modal-title');
        const modalCaption = document.getElementById('modal-caption');
        const modalDescription = document.getElementById('modal-description');
        const modalBuyBtn = document.getElementById('modal-buy-btn');
        const modalCloseBtn = document.getElementById('modal-close-btn');
        const modalPrevBtn = document.getElementById('modal-prev-btn');
        const modalNextBtn = document.getElementById('modal-next-btn');
        
        // Add click event to all painting items
        document.querySelectorAll('.painting-link').forEach(item => {
            item.addEventListener('click', function(e) {
                e.preventDefault();
                
                const paintingItem = this.closest('.painting-item');
                const paintingId = parseInt(paintingItem.dataset.id);
                const data = getPaintingById(paintingId);
                
                if (data) {
                    openModal(data, paintingItem);
                }
            });
        });
        
        // Add click events for navigation buttons
        modalPrevBtn.addEventListener('click', navigatePrevious);
        modalNextBtn.addEventListener('click', navigateNext);
        
        // Navigate to previous painting
        function navigatePrevious() {
            const currentId = parseInt(modal.dataset.currentId);
            let prevId = currentId - 1;
            
            // Loop back to the end if at the beginning
            if (prevId < 1) {
                prevId = window.paintingData.length;
            }
            
            navigateToId(prevId);
        }
        
        // Navigate to next painting
        function navigateNext() {
            const currentId = parseInt(modal.dataset.currentId);
            let nextId = currentId + 1;
            
            // Loop back to the beginning if at the end
            if (nextId > window.paintingData.length) {
                nextId = 1;
            }
            
            navigateToId(nextId);
        }
        
        // Navigate to a specific painting ID
        function navigateToId(id) {
            const targetItem = document.querySelector(`.painting-item[data-id="${id}"]`);
            const data = getPaintingById(id);
            
            if (targetItem && data) {
                // Animate the transition
                // modal.querySelector('.modal-content').style.opacity = '0';
                
                setTimeout(() => {
                    openModal(data, targetItem);
                    // modal.querySelector('.modal-content').style.opacity = '1';
                }, 200);
            }
        }
        
        // Close modal when clicking the close button
        modalCloseBtn.addEventListener('click', closeModal);
        
        // Close modal when clicking outside the content
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeModal();
            }
        });
        
        // Close modal with Escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && modal.style.display === 'block') {
                closeModal();
            }
        });
        
        // Navigate with keyboard arrows
        document.addEventListener('keydown', function(e) {
            if (modal.style.display === 'block') {
                if (e.key === 'ArrowRight') {
                    navigateNext();
                } else if (e.key === 'ArrowLeft') {
                    navigatePrevious();
                }
            }
        });
        
        // Get painting data by ID
        function getPaintingById(id) {
            return window.paintingData.find(painting => painting.id === id);
        }
        
        // Open modal with painting data
        function openModal(data, item) {
            // Set modal content
            modalImage.src = data.imgSrc;
            modalTitle.textContent = data.title;
            modalCaption.textContent = `${data.materials}, ${data.year}`;
            
            // Fix for description display
            modalDescription.innerHTML = `
                <p>${data.description}</p>
                <p><strong>Price:</strong> ${data.price}</p>
            `;
            
            // Set buy button state
            if (data.status === 'sold') {
                modalBuyBtn.disabled = true;
                modalBuyBtn.textContent = 'Sold Out';
            } else {
                modalBuyBtn.disabled = false;
                modalBuyBtn.textContent = 'Buy Now';
            }
            
            // Add click event to buy button (redirect to about page)
            modalBuyBtn.onclick = function() {
                window.location.href = 'about.html';
            };
            
            // Store current painting ID for navigation
            modal.dataset.currentId = data.id;
            
            // Display modal and prevent body scrolling
            modal.style.display = 'block';
            document.body.classList.add('modal-open');
        }
        
        // Close modal
        function closeModal() {
            modal.style.display = 'none';
            document.body.classList.remove('modal-open');
        }
    }
});

// Hero text scroll effect
document.addEventListener('scroll', function() {
    const heroTextContainer = document.querySelector('.hero-text');
    if (!heroTextContainer) return;
    
    // Calculate an offset factor for vertical movement
    const offset = window.scrollY * 0.2;
    heroTextContainer.style.transform = `translate(-50%, calc(-50% - ${offset}px))`;
    
    // Non-linear fadeout opacity:
    // Start fading after 100px scroll, completely fade out at 300px scroll
    const fadeStart = 100;
    const fadeEnd = 800;
    const scrollY = window.scrollY;
    let opacity = 1;
    if (scrollY > fadeStart) {
        let progress = (scrollY - fadeStart) / (fadeEnd - fadeStart);
        progress = Math.min(progress, 1);
        // Using quadratic easing for fadeout effect
        opacity = 1 - (progress * progress);
    }
    heroTextContainer.style.opacity = opacity;
});
// Smooth scrolling
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
}

// 3D Tour functionality
let currentTour = null;
let tourRotation = 0;
let tourZoom = 1;

function loadTour(tourType) {
    currentTour = tourType;
    tourRotation = 0;
    tourZoom = 1;
    
    const tourModal = new bootstrap.Modal(document.getElementById('tourModal'));
    const tourTitle = document.getElementById('tourModalTitle');
    const tourContent = document.getElementById('tour-3d-content');
    
    // Set tour title
    const tourNames = {
        'studio': 'Studio 250 - 3D Tour',
        'one-bedroom': 'One Bedroom 350 - 3D Tour',
        'loft': 'Loft 400 - 3D Tour'
    };
    tourTitle.textContent = tourNames[tourType] || '3D Apartment Tour';
    
    // Create 3D visualization
    tourContent.innerHTML = `
        <div class="apartment-model" id="apartment-model">
            <div class="apartment-view">
                <div class="room-view" style="transform: rotateY(${tourRotation}deg) scale(${tourZoom});">
                    ${generateApartmentView(tourType)}
                </div>
            </div>
        </div>
    `;
    
    tourModal.show();
}

function generateApartmentView(tourType) {
    const views = {
        'studio': `
            <div class="room-layout studio-layout">
                <div class="wall wall-front"></div>
                <div class="wall wall-back"></div>
                <div class="wall wall-left"></div>
                <div class="wall wall-right"></div>
                <div class="floor"></div>
                <div class="ceiling"></div>
                <div class="furniture murphy-bed" style="left: 20%; top: 30%; width: 30%; height: 25%;">
                    <i class="bi bi-layout-text-sidebar-reverse"></i>
                    <span>Murphy Bed</span>
                </div>
                <div class="furniture kitchen-module" style="right: 10%; top: 10%; width: 25%; height: 30%;">
                    <i class="bi bi-cup-straw"></i>
                    <span>Kitchen</span>
                </div>
                <div class="furniture desk" style="left: 10%; bottom: 20%; width: 20%; height: 15%;">
                    <i class="bi bi-layout-text-window-reverse"></i>
                    <span>Desk</span>
                </div>
            </div>
        `,
        'one-bedroom': `
            <div class="room-layout one-bedroom-layout">
                <div class="wall wall-front"></div>
                <div class="wall wall-back"></div>
                <div class="wall wall-left"></div>
                <div class="wall wall-right"></div>
                <div class="wall divider" style="left: 50%; top: 0; width: 2%; height: 100%;"></div>
                <div class="floor"></div>
                <div class="ceiling"></div>
                <div class="furniture bed" style="left: 10%; top: 30%; width: 25%; height: 30%;">
                    <i class="bi bi-layout-text-sidebar-reverse"></i>
                    <span>Bed</span>
                </div>
                <div class="furniture kitchen-module" style="right: 10%; top: 10%; width: 30%; height: 25%;">
                    <i class="bi bi-cup-straw"></i>
                    <span>Kitchen</span>
                </div>
                <div class="furniture sofa" style="right: 10%; bottom: 20%; width: 30%; height: 20%;">
                    <i class="bi bi-layout-sidebar-inset-reverse"></i>
                    <span>Sofa</span>
                </div>
            </div>
        `,
        'loft': `
            <div class="room-layout loft-layout">
                <div class="wall wall-front"></div>
                <div class="wall wall-back"></div>
                <div class="wall wall-left"></div>
                <div class="wall wall-right"></div>
                <div class="floor"></div>
                <div class="ceiling"></div>
                <div class="furniture loft-bed" style="left: 10%; top: 10%; width: 35%; height: 40%;">
                    <i class="bi bi-layout-text-sidebar-reverse"></i>
                    <span>Loft Bed</span>
                </div>
                <div class="furniture kitchen-module" style="right: 10%; top: 10%; width: 30%; height: 30%;">
                    <i class="bi bi-cup-straw"></i>
                    <span>Kitchen</span>
                </div>
                <div class="furniture desk" style="right: 10%; bottom: 20%; width: 30%; height: 20%;">
                    <i class="bi bi-layout-text-window-reverse"></i>
                    <span>Work Area</span>
                </div>
                <div class="furniture storage" style="left: 10%; bottom: 20%; width: 25%; height: 25%;">
                    <i class="bi bi-boxes"></i>
                    <span>Storage</span>
                </div>
            </div>
        `
    };
    
    return views[tourType] || views['studio'];
}

function rotateView(direction) {
    if (!currentTour) return;
    
    tourRotation += direction === 'left' ? -45 : 45;
    const model = document.querySelector('.room-view');
    if (model) {
        model.style.transform = `rotateY(${tourRotation}deg) scale(${tourZoom})`;
    }
}

function zoomView(direction) {
    if (!currentTour) return;
    
    tourZoom += direction === 'in' ? 0.1 : -0.1;
    tourZoom = Math.max(0.5, Math.min(2, tourZoom));
    const model = document.querySelector('.room-view');
    if (model) {
        model.style.transform = `rotateY(${tourRotation}deg) scale(${tourZoom})`;
    }
}

// Furniture Configurator
let furnitureItems = [];
let draggedElement = null;
let offsetX = 0;
let offsetY = 0;

function addFurniture(type) {
    const furnitureTypes = {
        'bed': { name: 'Murphy Bed', icon: 'bi-layout-text-sidebar-reverse', width: '120px', height: '100px' },
        'desk': { name: 'Wall Desk', icon: 'bi-layout-text-window-reverse', width: '100px', height: '80px' },
        'storage': { name: 'Storage Unit', icon: 'bi-boxes', width: '90px', height: '90px' },
        'kitchen': { name: 'Kitchen Module', icon: 'bi-cup-straw', width: '110px', height: '90px' },
        'sofa': { name: 'Convertible Sofa', icon: 'bi-layout-sidebar-inset-reverse', width: '130px', height: '70px' }
    };
    
    const furniture = furnitureTypes[type];
    if (!furniture) return;
    
    const canvas = document.getElementById('furniture-items');
    const furnitureId = 'furniture-' + Date.now();
    
    const furnitureElement = document.createElement('div');
    furnitureElement.className = 'furniture-piece';
    furnitureElement.id = furnitureId;
    furnitureElement.style.width = furniture.width;
    furnitureElement.style.height = furniture.height;
    furnitureElement.style.left = Math.random() * (canvas.offsetWidth - parseInt(furniture.width)) + 'px';
    furnitureElement.style.top = Math.random() * (canvas.offsetHeight - parseInt(furniture.height)) + 'px';
    furnitureElement.innerHTML = `
        <i class="bi ${furniture.icon}"></i>
        <span style="font-size: 0.7rem; margin-top: 0.5rem;">${furniture.name}</span>
    `;
    
    // Add drag functionality
    furnitureElement.addEventListener('mousedown', startDrag);
    furnitureElement.addEventListener('touchstart', startDrag);
    
    // Add click to rotate
    furnitureElement.addEventListener('dblclick', () => rotateFurniture(furnitureElement));
    
    canvas.appendChild(furnitureElement);
    furnitureItems.push({ id: furnitureId, type, element: furnitureElement });
}

function startDrag(e) {
    e.preventDefault();
    draggedElement = e.target.closest('.furniture-piece');
    if (!draggedElement) return;
    
    draggedElement.classList.add('dragging');
    
    const rect = draggedElement.getBoundingClientRect();
    const canvas = document.getElementById('furniture-canvas');
    const canvasRect = canvas.getBoundingClientRect();
    
    if (e.type === 'mousedown') {
        offsetX = e.clientX - rect.left;
        offsetY = e.clientY - rect.top;
        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', stopDrag);
    } else {
        const touch = e.touches[0];
        offsetX = touch.clientX - rect.left;
        offsetY = touch.clientY - rect.top;
        document.addEventListener('touchmove', drag);
        document.addEventListener('touchend', stopDrag);
    }
}

function drag(e) {
    if (!draggedElement) return;
    
    e.preventDefault();
    const canvas = document.getElementById('furniture-canvas');
    const canvasRect = canvas.getBoundingClientRect();
    
    let clientX, clientY;
    if (e.type === 'mousemove') {
        clientX = e.clientX;
        clientY = e.clientY;
    } else {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
    }
    
    let newX = clientX - canvasRect.left - offsetX;
    let newY = clientY - canvasRect.top - offsetY;
    
    // Constrain to canvas bounds
    newX = Math.max(0, Math.min(newX, canvas.offsetWidth - draggedElement.offsetWidth));
    newY = Math.max(0, Math.min(newY, canvas.offsetHeight - draggedElement.offsetHeight));
    
    draggedElement.style.left = newX + 'px';
    draggedElement.style.top = newY + 'px';
}

function stopDrag() {
    if (draggedElement) {
        draggedElement.classList.remove('dragging');
        draggedElement = null;
    }
    document.removeEventListener('mousemove', drag);
    document.removeEventListener('mouseup', stopDrag);
    document.removeEventListener('touchmove', drag);
    document.removeEventListener('touchend', stopDrag);
}

function rotateFurniture(element) {
    const currentRotation = element.style.transform.match(/rotate\((\d+)deg\)/) || [0, 0];
    const newRotation = (parseInt(currentRotation[1]) + 90) % 360;
    element.style.transform = `rotate(${newRotation}deg)`;
}

function resetConfigurator() {
    const canvas = document.getElementById('furniture-items');
    canvas.innerHTML = '';
    furnitureItems = [];
}

// Form submission
document.querySelector('.contact-form')?.addEventListener('submit', function(e) {
    e.preventDefault();
    alert('Thank you for your message! We will get back to you soon.');
    this.reset();
});

// Animate elements on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe tour cards and other elements
document.addEventListener('DOMContentLoaded', () => {
    const tourCards = document.querySelectorAll('.tour-card');
    tourCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
});


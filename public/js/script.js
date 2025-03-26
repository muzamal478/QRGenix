document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const generateBtn = document.getElementById('generateBtn');
    const qrInput = document.getElementById('qrInput');
    const qrResult = document.getElementById('qrResult');
    const navbar = document.getElementById('mainNav'); // Updated to use mainNav ID

    // Smooth scroll for navigation
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(link.getAttribute('href'));
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });

    $('.feature-card').tilt({
        maxTilt: 15,
        speed: 400,
        perspective: 1000,
        glare: true,
        maxGlare: 0.2
    });


    // QR Code Generation Function
    function generateQRCode() {
        const url = qrInput.value.trim();

        // Input validation
        if (!url) {
            alert('Please enter a URL or text to generate a QR code');
            qrInput.focus();
            return;
        }

        // Prepare UI for generation
        generateBtn.disabled = true;
        generateBtn.textContent = 'Generating...';
        qrResult.innerHTML = ''; // Clear previous QR code

        try {
            // Responsive QR code size
            const qrSize = window.innerWidth < 768 ? 150 : 250;

            // Generate QR code
            new QRCode(qrResult, {
                text: url,
                width: qrSize,
                height: qrSize,
                colorDark: '#000000',
                colorLight: '#ffffff',
                correctLevel: QRCode.CorrectLevel.H
            });

            // Ensure QR code is rendered before adding buttons
            requestAnimationFrame(() => {
                const qrImg = qrResult.querySelector('img');
                if (qrImg) {
                    qrImg.alt = 'Generated QR Code'; // Accessibility improvement
                    qrResult.insertAdjacentHTML('beforeend', `
                        <div class="qr-actions">
                            <button class="btn btn-edit" onclick="editQR()">Edit</button>
                            <button class="btn btn-share" onclick="shareQR()">Share</button>
                            <button class="btn btn-download" onclick="downloadQR()">Download</button>
                        </div>
                    `);
                } else {
                    throw new Error('QR code image failed to render');
                }
            });
        } catch (error) {
            console.error('QR Generation Error:', error);
            qrResult.innerHTML = '<p class="text-danger">Failed to generate QR code. Please try again.</p>';
        } finally {
            generateBtn.disabled = false;
            generateBtn.textContent = 'Generate QR Code';
        }
    }

    // Event Listeners for QR Generation
    generateBtn.addEventListener('click', generateQRCode);
    qrInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            generateQRCode();
        }
    });

    // Navbar Scroll Effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Highlight Active Nav Link Based on Scroll Position
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100; // Offset for navbar height
            if (window.scrollY >= sectionTop) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').slice(1) === current) {
                link.classList.add('active');
            }
        });
    });

    // Handle Window Resize for Responsive QR Code
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout); // Debounce resize event
        resizeTimeout = setTimeout(() => {
            if (qrResult.querySelector('img') && qrInput.value.trim()) {
                generateQRCode(); // Regenerate QR with updated size
            }
        }, 200); // 200ms debounce delay
    });

    // Contact Form Submission (Frontend Demo)
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const message = document.getElementById('message').value.trim();

            if (!name || !email || !message) {
                alert('Please fill in all fields.');
                return;
            }

            if (!/\S+@\S+\.\S+/.test(email)) {
                alert('Please enter a valid email address.');
                return;
            }

            alert('Message sent successfully! (Demo)');
            contactForm.reset(); // Clear form after submission
        });
    }

});

// QR Action Functions
function editQR() {
    const qrInput = document.getElementById('qrInput');
    const currentUrl = qrInput.value;
    const newUrl = prompt('Enter new URL or text:', currentUrl);
    if (newUrl && newUrl.trim()) {
        qrInput.value = newUrl.trim();
        document.getElementById('generateBtn').click();
        qrInput.focus();
    }
}

function shareQR() {
    const qrImg = document.querySelector('#qrResult img');
    if (!qrImg) {
        alert('Please generate a QR code first');
        return;
    }

    const canvas = document.createElement('canvas');
    canvas.width = qrImg.width;
    canvas.height = qrImg.height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(qrImg, 0, 0);

    canvas.toBlob(blob => {
        const file = new File([blob], 'qr-code.png', { type: 'image/png' });
        const shareData = {
            files: [file],
            title: 'QR Code from QRGenix',
            text: 'Check out this QR code generated by QRGenix!'
        };

        if (navigator.share && navigator.canShare(shareData)) {
            navigator.share(shareData)
                .then(() => console.log('QR code shared successfully'))
                .catch(err => {
                    console.error('Share failed:', err);
                    alert('Failed to share QR code. Try downloading instead.');
                });
        } else {
            alert('Sharing not supported on this device. Download and share manually.');
        }
    }, 'image/png');
}

function downloadQR() {
    const qrImg = document.querySelector('#qrResult img');
    if (!qrImg) {
        alert('Please generate a QR code first');
        return;
    }

    const link = document.createElement('a');
    link.href = qrImg.src;
    link.download = `qrgenix-qr-${new Date().toISOString().split('T')[0]}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}


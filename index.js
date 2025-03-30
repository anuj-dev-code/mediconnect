// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize Feather icons
    feather.replace();

    // Get DOM elements
    const form = document.getElementById('assessment-form');
    const chatMessages = document.getElementById('chat-messages');
    const nextBtn = document.getElementById('next-btn');
    const backBtn = document.getElementById('back-btn');
    const submitBtn = document.getElementById('submit-btn');
    const assessmentResult = document.getElementById('assessment-result');
    const resultContent = document.getElementById('result-content');
    
    // Get all steps
    const steps = document.querySelectorAll('.assessment-step');
    let currentStep = 0;

    // Navigation buttons functionality
    nextBtn.addEventListener('click', function() {
        if (validateCurrentStep()) {
            // If the current step is validated, add a user message to the chat
            addUserMessage(getCurrentStepValue());
            
            // Add bot response for the next step
            addBotMessage(getBotPromptForStep(currentStep + 1));
            
            // Hide current step and show next
            steps[currentStep].classList.add('hidden');
            currentStep++;
            steps[currentStep].classList.remove('hidden');
            
            // Update buttons
            updateNavigationButtons();
        }
    });

    backBtn.addEventListener('click', function() {
        // Hide current step and show previous
        steps[currentStep].classList.add('hidden');
        currentStep--;
        steps[currentStep].classList.remove('hidden');
        
        // Update buttons
        updateNavigationButtons();
    });

    // Form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validateCurrentStep()) {
            // Add the final user message
            addUserMessage(getCurrentStepValue());
            
            // Show loading message
            addBotMessage("Analyzing your information. Please wait a moment while I generate your assessment...");
            
            // Simulate processing (in a real app, this would be an API call)
            setTimeout(function() {
                // Generate and display assessment
                generateAssessment();
                
                // Scroll to assessment
                assessmentResult.scrollIntoView({ behavior: 'smooth' });
            }, 1500);
        }
    });

    // Function to update navigation buttons based on current step
    function updateNavigationButtons() {
        // Show/hide back button based on current step
        if (currentStep > 0) {
            backBtn.classList.remove('hidden');
        } else {
            backBtn.classList.add('hidden');
        }
        
        // Show/hide next and submit buttons based on current step
        if (currentStep === steps.length - 1) {
            nextBtn.classList.add('hidden');
            submitBtn.classList.remove('hidden');
        } else {
            nextBtn.classList.remove('hidden');
            submitBtn.classList.add('hidden');
        }
    }

    // Function to validate the current step
    function validateCurrentStep() {
        const currentStepElement = steps[currentStep];
        const inputElement = currentStepElement.querySelector('input, textarea, select');
        const errorElement = currentStepElement.querySelector('.error-message');
        
        if (inputElement.hasAttribute('required') && !inputElement.value.trim()) {
            errorElement.classList.remove('hidden');
            inputElement.classList.add('border-red-500');
            return false;
        }
        
        // Additional validation for age field
        if (inputElement.id === 'user-age') {
            const age = parseInt(inputElement.value);
            if (isNaN(age) || age < 1 || age > 120) {
                errorElement.classList.remove('hidden');
                inputElement.classList.add('border-red-500');
                return false;
            }
        }
        
        // Clear any previous errors
        if (errorElement) {
            errorElement.classList.add('hidden');
        }
        inputElement.classList.remove('border-red-500');
        
        return true;
    }

    // Function to get the value from the current step's input
    function getCurrentStepValue() {
        const currentStepElement = steps[currentStep];
        const inputElement = currentStepElement.querySelector('input, textarea, select');
        
        if (inputElement.tagName === 'SELECT') {
            return inputElement.options[inputElement.selectedIndex].text;
        }
        
        return inputElement.value.trim();
    }

    // Function to get the appropriate bot prompt for the next step
    function getBotPromptForStep(stepIndex) {
        const prompts = [
            "Hello! I'm your MediConnect assistant. To provide you with personalized health insights, I'll need some information. Let's start with your name.",
            "Thanks! Now, could you tell me your age?",
            "Great. Now please describe your symptoms in detail.",
            "Do you have any known medical conditions or diagnoses that might be relevant?",
            "For how long have you been experiencing these symptoms?",
            "Thank you for providing all the information. I'll analyze it and provide you with a personalized health assessment."
        ];
        
        return prompts[stepIndex] || "";
    }

    // Function to add a user message to the chat
    function addUserMessage(message) {
        const messageElement = document.createElement('div');
        messageElement.className = 'user-message mb-4';
        messageElement.innerHTML = `
            <div class="flex items-start justify-end">
                <div class="bg-blue-600 rounded-lg p-3 max-w-xs md:max-w-md">
                    <p class="text-white">${escapeHtml(message)}</p>
                </div>
                <div class="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center ml-3">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-gray-600 w-4 h-4">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                </div>
            </div>
        `;
        
        chatMessages.appendChild(messageElement);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Function to add a bot message to the chat
    function addBotMessage(message) {
        const messageElement = document.createElement('div');
        messageElement.className = 'bot-message mb-4';
        messageElement.innerHTML = `
            <div class="flex items-start">
                <div class="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-white w-4 h-4">
                        <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
                    </svg>
                </div>
                <div class="bg-blue-100 rounded-lg p-3 max-w-xs md:max-w-md">
                    <p class="text-gray-800">${escapeHtml(message)}</p>
                </div>
            </div>
        `;
        
        chatMessages.appendChild(messageElement);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Function to generate a personalized health assessment
    function generateAssessment() {
        // Get user information
        const name = document.getElementById('user-name').value;
        const age = parseInt(document.getElementById('user-age').value);
        const symptoms = document.getElementById('user-symptoms').value;
        const medicalConditions = document.getElementById('user-condition').value;
        const duration = document.getElementById('user-duration').value;
        
        // Create personalized assessment based on input
        // (In a real application, this would involve more sophisticated analysis)
        let assessment = '';
        
        // Add personalized greeting
        assessment += `<p class="mb-3">Hello ${escapeHtml(name)}, based on the information you've provided, here's your preliminary health assessment:</p>`;
        
        // Analyze symptoms based on age and duration
        assessment += `<div class="mb-4">
            <h4 class="font-semibold text-blue-700 mb-2">Symptom Analysis</h4>
            <p class="mb-2">You reported: "${escapeHtml(symptoms)}"</p>`;
        
        // Generate different responses based on symptom duration
        if (duration === 'hours') {
            assessment += `<p>Since these symptoms are recent (less than a day), they may be related to a minor acute condition. Monitor your symptoms and rest if possible.</p>`;
        } else if (duration === 'days') {
            assessment += `<p>Your symptoms have persisted for several days, which suggests they should be evaluated. Consider scheduling an appointment with your healthcare provider if they worsen or don't improve within 48 hours.</p>`;
        } else if (duration === 'weeks') {
            assessment += `<p>Symptoms lasting weeks may indicate a persistent condition that requires professional medical attention. We recommend consulting with a healthcare provider soon.</p>`;
        } else if (duration === 'months') {
            assessment += `<p>The chronic nature of your symptoms (months or longer) suggests a need for comprehensive evaluation. Please schedule an appointment with a healthcare provider as soon as possible.</p>`;
        }
        assessment += `</div>`;
        
        // Add recommendations based on age
        assessment += `<div class="mb-4">
            <h4 class="font-semibold text-blue-700 mb-2">Recommendations</h4>
            <ul class="list-disc pl-5 space-y-1">`;
        
        // Age-specific recommendations
        if (age < 18) {
            assessment += `<li>Consult with a pediatrician about these symptoms</li>`;
        } else if (age >= 65) {
            assessment += `<li>Schedule an appointment with your primary care physician</li>
                          <li>Consider reviewing your medications with your doctor</li>`;
        } else {
            assessment += `<li>Schedule an appointment with a healthcare provider if symptoms persist</li>`;
        }
        
        // Generic recommendations
        assessment += `<li>Stay hydrated and get adequate rest</li>
                      <li>Track any changes in your symptoms</li>
                      <li>Bring a list of your current medications to any doctor appointments</li>
                    </ul>
                  </div>`;
        
        // Add disclaimer
        assessment += `<div class="bg-yellow-50 p-3 rounded-lg border border-yellow-200 mt-4">
            <p class="text-sm text-yellow-800">
                <strong>Disclaimer:</strong> This is an AI-generated preliminary assessment and does not constitute medical advice or diagnosis. 
                Always consult with qualified healthcare professionals for proper evaluation, diagnosis, and treatment.
            </p>
        </div>`;
        
        // Add the assessment to the result content
        resultContent.innerHTML = assessment;
        
        // Show the assessment result
        assessmentResult.classList.remove('hidden');
        
        // Add final bot message
        addBotMessage("I've generated your personalized health assessment based on the information you provided. Please review it below.");
    }

    // Helper function to escape HTML to prevent XSS
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Dark mode toggle functionality
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    const htmlElement = document.documentElement;
    
    darkModeToggle.addEventListener('click', function() {
        htmlElement.classList.toggle('dark-mode');
        
        // Update icon based on current mode
        const moonIcon = darkModeToggle.querySelector('[data-feather="moon"]');
        const sunIcon = darkModeToggle.querySelector('[data-feather="sun"]');
        
        if (htmlElement.classList.contains('dark-mode')) {
            if (moonIcon) {
                moonIcon.remove();
                darkModeToggle.innerHTML = '<i data-feather="sun"></i>';
                feather.replace();
            }
        } else {
            if (sunIcon) {
                sunIcon.remove();
                darkModeToggle.innerHTML = '<i data-feather="moon"></i>';
                feather.replace();
            }
        }
    });

    // Mobile menu toggle
    const menuToggle = document.getElementById('menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    
    menuToggle.addEventListener('click', function() {
        mobileMenu.classList.toggle('hidden');
        
        // Update icon based on menu state
        const menuIcon = menuToggle.querySelector('[data-feather="menu"]');
        const closeIcon = menuToggle.querySelector('[data-feather="x"]');
        
        if (mobileMenu.classList.contains('hidden')) {
            if (closeIcon) {
                closeIcon.remove();
                menuToggle.innerHTML = '<i data-feather="menu"></i>';
                feather.replace();
            }
        } else {
            if (menuIcon) {
                menuIcon.remove();
                menuToggle.innerHTML = '<i data-feather="x"></i>';
                feather.replace();
            }
        }
    });

    // Back to top button functionality
    const backToTopButton = document.getElementById('back-to-top');
    
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTopButton.classList.remove('hidden');
        } else {
            backToTopButton.classList.add('hidden');
        }
    });
    
    backToTopButton.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                if (!mobileMenu.classList.contains('hidden')) {
                    mobileMenu.classList.add('hidden');
                    menuToggle.innerHTML = '<i data-feather="menu"></i>';
                    feather.replace();
                }
            }
        });
    });
});


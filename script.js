document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const resumeForm = document.getElementById('resumeForm');
    const generateBtn = document.getElementById('generateBtn');
    const editBtn = document.getElementById('editBtn');
    const downloadBtn = document.getElementById('downloadBtn');
    const paypalButton = document.getElementById('paypalButton');
    const previewSection = document.getElementById('previewSection');
    const resumePreview = document.getElementById('resumePreview');
    const loadingOverlay = document.getElementById('loadingOverlay');
    
    // Copy buttons for marketing content
    const copyTwitterBtn = document.getElementById('copyTwitterBtn');
    const copyRedditBtn = document.getElementById('copyRedditBtn');
    const copyLinkedinBtn = document.getElementById('copyLinkedinBtn');
    
    // Fill marketing content
    document.getElementById('twitterContent').textContent = twitterContent;
    document.getElementById('redditContent').textContent = redditContent;
    document.getElementById('linkedinContent').textContent = linkedinContent;
    
    // Payment status tracking
    let paymentMade = false;
    // Check if user was redirected back with ?paid=true
const urlParams = new URLSearchParams(window.location.search);
if (urlParams.get("paid") === "true") {
    paymentMade = true;
    handleSuccessfulPayment();
}
    // Generate resume with OpenAI GPT-4
    async function generateResume(formData) {
        // IMPORTANT: In a production environment, API calls should be made through a server
        // to avoid exposing your API key in client-side code
        const apiKey = "YOUR_OPENAI_API_KEY"; // Replace with your actual API key
        const apiUrl = "https://api.openai.com/v1/chat/completions";
        
        // Create a detailed prompt for GPT-4
        const messages = [
            {
                role: "system",
                content: `You are an expert resume writer specializing in creating professional one-page resumes.
                
                Create a resume in HTML format that follows these guidelines:
                1. Use clean, semantic HTML compatible with these CSS classes: 
                   - resume-container (main container)
                   - section (for main sections like work, education, skills)
                   - work-entry (for individual jobs)
                   - role (for job titles)
                2. Structure with these sections: Header (name/title), Summary (if provided), 
                   Work Experience, Education, and Skills
                3. Format work experience with company names, roles, and bullet points
                4. Use professional language focused on accomplishments and impact
                5. Format education with degrees, institutions, and relevant details
                6. Organize skills in a clear, scannable format
                
                Return ONLY valid HTML with NO markdown formatting or explanations.`
            },
            {
                role: "user",
                content: `Generate a professional resume with this information:
                
                Full Name: ${formData.fullName}
                Job Title: ${formData.jobTitle}
                ${formData.summary ? `Summary: ${formData.summary}` : ''}
                
                Work Experience:
                ${formData.workExperience}
                
                Education:
                ${formData.education}
                
                Skills:
                ${formData.skills}`
            }
        ];
        
        try {
            console.log("Calling OpenAI API to generate resume...");
            
            const response = await fetch(apiUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    model: "gpt-4",
                    messages: messages,
                    temperature: 0.7,
                    max_tokens: 2048
                })
            });
            
            if (!response.ok) {
                throw new Error(`API request failed with status ${response.status}`);
            }
            
            const data = await response.json();
            let resumeHTML = data.choices[0].message.content.trim();
            
            // Clean up any markdown code block syntax if present
            resumeHTML = resumeHTML.replace(/```html|```/g, '').trim();
            
            console.log("Resume generated successfully!");
            return resumeHTML;
        } catch (error) {
            console.error("Error generating resume with OpenAI:", error);
            
            // Fallback to local formatter if API call fails
            console.log("Falling back to local formatter");
            return formatResume(formData);
        }
    }
    
    // Copy marketing content to clipboard
    copyTwitterBtn.addEventListener('click', function(e) {
        e.preventDefault();
        copyToClipboard(twitterContent, 'Twitter content copied to clipboard!');
    });
    
    copyRedditBtn.addEventListener('click', function(e) {
        e.preventDefault();
        copyToClipboard(redditContent, 'Reddit content copied to clipboard!');
    });
    
    copyLinkedinBtn.addEventListener('click', function(e) {
        e.preventDefault();
        copyToClipboard(linkedinContent, 'LinkedIn content copied to clipboard!');
    });
    
    // Function to copy text to clipboard
    function copyToClipboard(text, successMessage) {
        navigator.clipboard.writeText(text).then(function() {
            alert(successMessage);
        }, function() {
            alert('Failed to copy. Please try again.');
        });
    }
    
    // Resume form submission
    resumeForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Show loading overlay
        loadingOverlay.classList.remove('hidden');
        
        // Collect form data
        const formData = {
            fullName: document.getElementById('fullName').value,
            jobTitle: document.getElementById('jobTitle').value,
            workExperience: document.getElementById('workExperience').value,
            education: document.getElementById('education').value,
            skills: document.getElementById('skills').value,
            summary: document.getElementById('summary').value
        };
        
        try {
            // Generate resume using OpenAI GPT-4
            const resumeHTML = await generateResume(formData);
            
            // Display resume in preview section
            resumePreview.innerHTML = resumeHTML;
            previewSection.classList.remove('hidden');
            previewSection.classList.add('fade-in');
            
            // Scroll to preview section
            previewSection.scrollIntoView({ behavior: 'smooth' });
            
            // Setup PayPal return handler
            window.addEventListener('focus', checkPayPalPayment);
            
        } catch (error) {
            console.error('Error generating resume:', error);
            alert('Error generating resume. Please try again.');
        } finally {
            // Hide loading overlay
            loadingOverlay.classList.add('hidden');
        }
    });
    
    // Check if PayPal payment was completed when window regains focus
    function checkPayPalPayment() {
        // In a real implementation, this would verify the payment with PayPal's API
        const paymentConfirmed = confirm("Did you complete the PayPal payment? (Click OK if you've paid)");
        
        if (paymentConfirmed) {
            paymentMade = true;
            handleSuccessfulPayment();
            // Remove the event listener after payment is confirmed
            window.removeEventListener('focus', checkPayPalPayment);
        }
    }
    
    // Handle successful payment
    function handleSuccessfulPayment() {
        // Enable download button
        downloadBtn.disabled = false;
        downloadBtn.classList.remove('bg-gray-200', 'text-gray-400', 'cursor-not-allowed');
        downloadBtn.classList.add('bg-green-600', 'hover:bg-green-700', 'text-white', 'payment-success');
        
        // Update PayPal button
        paypalButton.innerHTML = '<svg class="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>Payment Completed';
        paypalButton.classList.add('payment-success');
        paypalButton.classList.remove('bg-[#0070BA]', 'hover:bg-[#005EA6]');
        paypalButton.href = '#';
        paypalButton.onclick = function(e) { e.preventDefault(); };
    }
    
    // Edit button functionality
    editBtn.addEventListener('click', function() {
        previewSection.classList.add('hidden');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    
    // Download PDF button
    downloadBtn.addEventListener('click', function() {
        if (!paymentMade) {
            alert('Please complete the payment to download your resume.');
            return;
        }
        
        // Create a clone of the resume preview for PDF generation
        const resumeContent = resumePreview.cloneNode(true);
        resumeContent.classList.add('resume-pdf');
        
        // Configure PDF options
        const opt = {
            margin: [0.5, 0.5, 0.5, 0.5],
            filename: 'professional_resume.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
        };
        
        // Generate and download PDF
        html2pdf().set(opt).from(resumeContent).save();
    });
});

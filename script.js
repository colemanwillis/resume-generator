
// Resume template function for formatting user data
// This serves as a fallback in case the OpenAI API call fails
function formatResume(data) {
    // Clean and format the input data
    const fullName = data.fullName.trim();
    const jobTitle = data.jobTitle.trim();
    const summary = data.summary.trim();
    
    // Format work experience
    let workExperience = '';
    const workExperienceLines = data.workExperience.split('\n').filter(line => line.trim() !== '');
    
    if (workExperienceLines.length > 0) {
        let currentCompany = '';
        let currentRole = '';
        let currentBullets = [];
        
        workExperienceLines.forEach((line, index) => {
            // Try to identify company and role entries
            if (index === 0 || (line.includes('-') && !line.startsWith('-') && !line.startsWith('•'))) {
                // Save previous company info if it exists
                if (currentCompany !== '') {
                    workExperience += formatWorkEntry(currentCompany, currentRole, currentBullets);
                    currentBullets = [];
                }
                
                // Parse new company/role
                const parts = line.split('-').map(part => part.trim());
                currentCompany = parts[0];
                currentRole = parts.length > 1 ? parts[1] : '';
            } else {
                // This is a bullet point for the current role
                let bullet = line.trim();
                if (!bullet.startsWith('-') && !bullet.startsWith('•')) {
                    bullet = '• ' + bullet;
                }
                currentBullets.push(bullet);
            }
        });
        
        // Add the last company
        if (currentCompany !== '') {
            workExperience += formatWorkEntry(currentCompany, currentRole, currentBullets);
        }
    }
    
    // Format education
    let education = '';
    const educationLines = data.education.split('\n').filter(line => line.trim() !== '');
    
    if (educationLines.length > 0) {
        let currentSchool = '';
        let currentDegree = '';
        let currentBullets = [];
        
        educationLines.forEach((line, index) => {
            // Try to identify school and degree entries
            if (index === 0 || (line.includes('-') && !line.startsWith('-') && !line.startsWith('•'))) {
                // Save previous education info if it exists
                if (currentSchool !== '') {
                    education += formatEducationEntry(currentSchool, currentDegree, currentBullets);
                    currentBullets = [];
                }
                
                // Parse new school/degree
                const parts = line.split('-').map(part => part.trim());
                currentSchool = parts[0];
                currentDegree = parts.length > 1 ? parts[1] : '';
            } else {
                // This is a bullet point
                let bullet = line.trim();
                if (!bullet.startsWith('-') && !bullet.startsWith('•')) {
                    bullet = '• ' + bullet;
                }
                currentBullets.push(bullet);
            }
        });
        
        // Add the last education entry
        if (currentSchool !== '') {
            education += formatEducationEntry(currentSchool, currentDegree, currentBullets);
        }
    }
    
    // Format skills
    let skills = '<ul>';
    const skillLines = data.skills.split('\n').filter(line => line.trim() !== '');
    
    if (skillLines.length > 0) {
        skillLines.forEach(skill => {
            let skillItem = skill.trim();
            if (!skillItem.startsWith('-') && !skillItem.startsWith('•')) {
                skillItem = '• ' + skillItem;
            }
            skills += `<li>${skillItem.replace(/^[-•]\s*/, '')}</li>`;
        });
    }
    skills += '</ul>';
    
    // Professional resume template
    return `
        <div class="resume-container">
            <header>
                <h1>${fullName}</h1>
                <div class="job-title">${jobTitle}</div>
                ${summary ? `<div class="summary-section">
                    <p>${summary}</p>
                </div>` : ''}
            </header>
            
            <div class="section">
                <h2>Work Experience</h2>
                ${workExperience}
            </div>
            
            <div class="section">
                <h2>Education</h2>
                ${education}
            </div>
            
            <div class="section">
                <h2>Skills</h2>
                ${skills}
            </div>
        </div>
    `;
}

// Helper function to format work entries
function formatWorkEntry(company, role, bullets) {
    let bulletList = '';
    if (bullets.length > 0) {
        bulletList = '<ul>';
        bullets.forEach(bullet => {
            bulletList += `<li>${bullet.replace(/^[-•]\s*/, '')}</li>`;
        });
        bulletList += '</ul>';
    }
    
    return `
        <div class="work-entry">
            <h3>${company}</h3>
            ${role ? `<div class="role">${role}</div>` : ''}
            ${bulletList}
        </div>
    `;
}

// Helper function to format education entries
function formatEducationEntry(school, degree, bullets) {
    let bulletList = '';
    if (bullets.length > 0) {
        bulletList = '<ul>';
        bullets.forEach(bullet => {
            bulletList += `<li>${bullet.replace(/^[-•]\s*/, '')}</li>`;
        });
        bulletList += '</ul>';
    }
    
    return `
        <div class="education-entry">
            <h3>${school}</h3>
            ${degree ? `<div class="role">${degree}</div>` : ''}
            ${bulletList}
        </div>
    `;
}


// Twitter (X) post content
const twitterContent = `🚀 Just discovered this amazing AI Resume Generator! It created a professional resume for me in seconds - completely free to use.

Try it yourself and level up your job applications. The tool even formats everything perfectly!

#Resume #JobSearch #CareerAdvice #AI`;

// Reddit post content
const redditContent = `# I built an AI Resume Generator that creates professional resumes in seconds

Hey r/resumes,

I wanted to share a tool I created that might help many of you with your job search. It's a free AI-powered resume generator that takes your basic information and formats it into a clean, professional resume.

**How it works:**
1. Enter your work experience, education, and skills
2. The AI formats everything into a proper resume
3. Preview the result and download as PDF

It's completely free to use, with an optional $5 payment for the PDF download.

I'd love your feedback on how it could be improved!`;

// LinkedIn post content
const linkedinContent = `📄 Excited to share my latest project: an AI Resume Generator!

Are you struggling to format your resume professionally? This tool uses AI to transform your work experience, education and skills into a polished resume in seconds.

✅ Free to use
✅ Professional formatting
✅ One-page design
✅ Instant preview
✅ PDF download option

#JobSearch #Resume #CareerAdvice #AI #ProductLaunch`;

// TikTok script (bonus)
const tiktokScript = `[Start with person looking frustrated at computer]
"Spending hours formatting your resume?"

[Transition to showing the tool]
"This AI tool builds you a professional resume in just 10 seconds"

[Show typing information and generating]
"Just enter your info, click generate, and..."

[Show beautiful resume result]
"Boom! A perfectly formatted resume ready for your job search"`;


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

    const copyTwitterBtn = document.getElementById('copyTwitterBtn');
    const copyRedditBtn = document.getElementById('copyRedditBtn');
    const copyLinkedinBtn = document.getElementById('copyLinkedinBtn');

    // Fill marketing content
    document.getElementById('twitterContent').textContent = twitterContent;
    document.getElementById('redditContent').textContent = redditContent;
    document.getElementById('linkedinContent').textContent = linkedinContent;

    let paymentMade = false;

    // Check URL for ?paid=true param
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get("paid") === "true") {
        paymentMade = true;
        handleSuccessfulPayment();
    }

    async function generateResume(formData) {
        const apiKey = "YOUR_OPENAI_API_KEY"; // Optional: add API key
        const apiUrl = "https://api.openai.com/v1/chat/completions";

        const messages = [
            {
                role: "system",
                content: `You are an expert resume writer specializing in creating professional one-page resumes...
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

            if (!response.ok) throw new Error(`API request failed with status ${response.status}`);
            let resumeHTML = (await response.json()).choices[0].message.content.trim();
            return resumeHTML.replace(/```html|```/g, '').trim();
        } catch (err) {
            console.warn("Falling back to local formatter:", err);
            return formatResume(formData);
        }
    }

    function handleSuccessfulPayment() {
        downloadBtn.disabled = false;
        downloadBtn.classList.remove('bg-gray-200', 'text-gray-400', 'cursor-not-allowed');
        downloadBtn.classList.add('bg-green-600', 'hover:bg-green-700', 'text-white', 'payment-success');
        paypalButton.innerHTML = '<svg class="w-5 h-5 mr-2"...></svg>Payment Completed';
        paypalButton.classList.add('payment-success');
        paypalButton.href = '#';
        paypalButton.onclick = function(e) { e.preventDefault(); };
    }

    function checkPayPalPayment() {
        const paymentConfirmed = confirm("Did you complete the PayPal payment? (Click OK if you've paid)");
        if (paymentConfirmed) {
            paymentMade = true;
            handleSuccessfulPayment();
            window.removeEventListener('focus', checkPayPalPayment);
        }
    }

    resumeForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        loadingOverlay.classList.remove('hidden');

        const formData = {
            fullName: document.getElementById('fullName').value,
            jobTitle: document.getElementById('jobTitle').value,
            workExperience: document.getElementById('workExperience').value,
            education: document.getElementById('education').value,
            skills: document.getElementById('skills').value,
            summary: document.getElementById('summary').value
        };

        try {
            const resumeHTML = await generateResume(formData);
            resumePreview.innerHTML = resumeHTML;
            previewSection.classList.remove('hidden');
            previewSection.classList.add('fade-in');
            previewSection.scrollIntoView({ behavior: 'smooth' });

            if (!paymentMade) {
                window.addEventListener('focus', checkPayPalPayment);
            }
        } catch (error) {
            alert('Error generating resume. Please try again.');
        } finally {
            loadingOverlay.classList.add('hidden');
        }
    });

    downloadBtn.addEventListener('click', function() {
        if (!paymentMade) {
            alert('Please complete the payment to download your resume.');
            return;
        }

        const resumeContent = resumePreview.cloneNode(true);
        resumeContent.classList.add('resume-pdf');

        const opt = {
            margin: [0.5, 0.5, 0.5, 0.5],
            filename: 'professional_resume.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
        };

        html2pdf().set(opt).from(resumeContent).save();
    });

    editBtn.addEventListener('click', function() {
        previewSection.classList.add('hidden');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    function copyToClipboard(text, msg) {
        navigator.clipboard.writeText(text).then(() => alert(msg));
    }

    copyTwitterBtn.addEventListener('click', e => {
        e.preventDefault();
        copyToClipboard(twitterContent, 'Twitter content copied!');
    });
    copyRedditBtn.addEventListener('click', e => {
        e.preventDefault();
        copyToClipboard(redditContent, 'Reddit content copied!');
    });
    copyLinkedinBtn.addEventListener('click', e => {
        e.preventDefault();
        copyToClipboard(linkedinContent, 'LinkedIn content copied!');
    });
});

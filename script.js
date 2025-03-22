
document.addEventListener('DOMContentLoaded', function() {
    const resumeForm = document.getElementById('resumeForm');
    const generateBtn = document.getElementById('generateBtn');
    const editBtn = document.getElementById('editBtn');
    const downloadBtn = document.getElementById('downloadBtn');
    const paypalButton = document.getElementById('paypalButton');
    const previewSection = document.getElementById('previewSection');
    const resumePreview = document.getElementById('resumePreview');
    const loadingOverlay = document.getElementById('loadingOverlay');

    let paymentMade = false;

    // Check for payment and restore resume
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get("paid") === "true") {
        paymentMade = true;
        handleSuccessfulPayment();
        loadSavedResume();
    }

    // Handle resume generation
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

            // Save resume data to localStorage
            localStorage.setItem('resumeData', JSON.stringify({
                formData,
                resumeHTML,
                timestamp: Date.now()
            }));
        } catch (error) {
            console.error("Error generating resume:", error);
            alert("Error generating resume. Please try again.");
        } finally {
            loadingOverlay.classList.add('hidden');
        }
    });

    // Load from localStorage after redirect
    function loadSavedResume() {
        const saved = localStorage.getItem("resumeData");
        if (saved) {
            const { resumeHTML, timestamp } = JSON.parse(saved);
            if (Date.now() - timestamp > 24 * 60 * 60 * 1000) {
                alert("Saved resume expired. Please generate a new one.");
                localStorage.removeItem("resumeData");
                return;
            }
            resumePreview.innerHTML = resumeHTML;
            previewSection.classList.remove('hidden');
        } else {
            alert("No saved resume found. Please generate a new one.");
        }
    }

    // Final unlock behavior
    function handleSuccessfulPayment() {
        downloadBtn.disabled = false;
        downloadBtn.classList.remove('bg-gray-200', 'text-gray-400', 'cursor-not-allowed');
        downloadBtn.classList.add('bg-green-600', 'hover:bg-green-700', 'text-white', 'payment-success');
        paypalButton.innerHTML = '✅ Payment Completed';
        paypalButton.href = "#";
        paypalButton.onclick = e => e.preventDefault();
    }

    // Download handler
    downloadBtn.addEventListener('click', function() {
        if (!paymentMade) {
            alert("Please complete payment before downloading.");
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
        localStorage.removeItem('resumeData'); // Optional: cleanup
    });

    // Dummy fallback resume generator
    async function generateResume(formData) {
        // Replace this with real API call to OpenAI if needed
        return `
        <div class='resume-container'>
            <h1>${formData.fullName}</h1>
            <h2>${formData.jobTitle}</h2>
            <div class='section'>
                <h3>Work Experience</h3>
                <p>${formData.workExperience}</p>
            </div>
            <div class='section'>
                <h3>Education</h3>
                <p>${formData.education}</p>
            </div>
            <div class='section'>
                <h3>Skills</h3>
                <p>${formData.skills}</p>
            </div>
        </div>`;
    }

    editBtn.addEventListener('click', function() {
        previewSection.classList.add('hidden');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
});


document.addEventListener('DOMContentLoaded', function () {
    const resumeForm = document.getElementById('resumeForm');
    const downloadBtn = document.getElementById('downloadBtn');
    const paypalButton = document.getElementById('paypalButton');
    const previewSection = document.getElementById('previewSection');
    const resumePreview = document.getElementById('resumePreview');
    const loadingOverlay = document.getElementById('loadingOverlay');

    let paymentMade = false;

    // Check for PayPal redirect
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get("paid") === "true") {
        paymentMade = true;
        handleSuccessfulPayment();
        loadSavedResume();
    }

    // Handle form submission and preview
    resumeForm.addEventListener('submit', function (e) {
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

        const resumeHTML = generateFakeResume(formData);
        resumePreview.innerHTML = resumeHTML;
        previewSection.classList.remove('hidden');
        previewSection.scrollIntoView({ behavior: 'smooth' });

        localStorage.setItem("resumeData", JSON.stringify({
            resumeHTML: resumeHTML,
            timestamp: Date.now()
        }));

        loadingOverlay.classList.add('hidden');
    });

    function generateFakeResume(formData) {
        return \`
            <div class='resume-container'>
                <h1>\${formData.fullName}</h1>
                <h2>\${formData.jobTitle}</h2>
                \${formData.summary ? `<p><strong>Summary:</strong> \${formData.summary}</p>` : ''}
                <div class='section'><h3>Work Experience</h3><p>\${formData.workExperience}</p></div>
                <div class='section'><h3>Education</h3><p>\${formData.education}</p></div>
                <div class='section'><h3>Skills</h3><p>\${formData.skills}</p></div>
            </div>
        \`;
    }

    function loadSavedResume() {
        const saved = localStorage.getItem("resumeData");
        if (saved) {
            const { resumeHTML, timestamp } = JSON.parse(saved);
            if (Date.now() - timestamp > 24 * 60 * 60 * 1000) {
                alert("Resume expired. Please generate a new one.");
                localStorage.removeItem("resumeData");
                return;
            }
            resumePreview.innerHTML = resumeHTML;
            previewSection.classList.remove("hidden");
        } else {
            alert("No saved resume found. Please generate a new one.");
        }
    }

    function handleSuccessfulPayment() {
        downloadBtn.disabled = false;
        downloadBtn.classList.remove("bg-gray-200", "text-gray-400", "cursor-not-allowed");
        downloadBtn.classList.add("bg-green-600", "hover:bg-green-700", "text-white");
        paypalButton.innerHTML = "✅ Payment Complete";
        paypalButton.href = "#";
        paypalButton.onclick = e => e.preventDefault();
    }

    downloadBtn.addEventListener("click", function () {
        if (!paymentMade) {
            alert("Please complete the PayPal payment first.");
            return;
        }

        const saved = localStorage.getItem("resumeData");
        if (!saved) {
            alert("No resume found. Please generate one first.");
            return;
        }

        const resumeContent = resumePreview.cloneNode(true);
        resumeContent.classList.add("resume-pdf");

        const opt = {
            margin: [0.5, 0.5, 0.5, 0.5],
            filename: "resume.pdf",
            image: { type: "jpeg", quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: "in", format: "letter", orientation: "portrait" }
        };

        html2pdf().set(opt).from(resumeContent).save();
        localStorage.removeItem("resumeData");
    });
});

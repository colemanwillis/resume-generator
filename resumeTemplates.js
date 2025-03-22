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

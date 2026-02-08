import { IResume } from '../models/Resume';

export const generateResumeHtml = (resume: IResume): string => {
  const { personalDetails, experience, education, skills } = resume;

  // Basic HTML Template - In production, use Handlebars/EJS or React SSR
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; max-width: 800px; margin: 0 auto; padding: 20px; }
        h1 { text-transform: uppercase; border-bottom: 2px solid #333; padding-bottom: 10px; }
        h2 { color: #666; border-bottom: 1px solid #ccc; padding-bottom: 5px; margin-top: 30px; }
        .contact-info { margin-bottom: 20px; font-size: 0.9em; color: #666; }
        .job, .school { margin-bottom: 15px; }
        .job-title, .school-name { font-weight: bold; }
        .dates { color: #999; font-size: 0.85em; font-style: italic; }
        .skills-list { display: flex; flex-wrap: wrap; gap: 10px; }
        .skill-tag { background: #eee; padding: 4px 8px; border-radius: 4px; font-size: 0.9em; }
      </style>
    </head>
    <body>
      <header>
        <h1>${personalDetails.fullName}</h1>
        <div class="contact-info">
          ${personalDetails.email ? `📧 ${personalDetails.email}` : ''} | 
          ${personalDetails.phone ? `📱 ${personalDetails.phone}` : ''} | 
          ${personalDetails.address ? `📍 ${personalDetails.address}` : ''}
        </div>
        <p>${personalDetails.summary}</p>
      </header>

      <section>
        <h2>Experience</h2>
        ${experience.map(job => `
          <div class="job">
            <div class="job-title">${job.position} at ${job.company}</div>
            <div class="dates">${job.startDate} - ${job.endDate}</div>
            <p>${job.description}</p>
          </div>
        `).join('')}
      </section>

      <section>
        <h2>Education</h2>
        ${education.map(edu => `
          <div class="school">
            <div class="school-name">${edu.institution}</div>
            <div>${edu.degree}</div>
            <div class="dates">${edu.startDate} - ${edu.endDate}</div>
          </div>
        `).join('')}
      </section>

      <section>
        <h2>Skills</h2>
        <div class="skills-list">
          ${skills.map(skill => `
            <span class="skill-tag">${skill.name}</span>
          `).join('')}
        </div>
      </section>
    </body>
    </html>
  `;
};

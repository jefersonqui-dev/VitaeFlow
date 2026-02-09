import React, { useMemo } from 'react';
import { Resume } from '../../types/resume';
import { Theme } from '../../types/theme';
import styles from './styles.module.css';

// SVG Icons Component (Lucide style)
const Icons = {
  Phone: () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.contactIcon}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>,
  Mail: () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.contactIcon}><rect width="20" height="16" x="2" y="4" rx="2"></rect><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path></svg>,
  MapPin: () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.contactIcon}><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path><circle cx="12" cy="10" r="3"></circle></svg>,
  Link: () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.contactIcon}><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>,
  Calendar: () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.contactIcon}><rect width="18" height="18" x="3" y="4" rx="2" ry="2"></rect><line x1="16" x2="16" y1="2" y2="6"></line><line x1="8" x2="8" y1="2" y2="6"></line><line x1="3" x2="21" y1="10" y2="10"></line></svg>,
  Flag: () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.contactIcon}><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path><line x1="4" x2="4" y1="22" y2="15"></line></svg>
};

interface ModernWaveLayoutProps {
  data: Resume;
  theme: Theme;
}

// Estimates for height calculation (in px, assuming 96dpi approx)
// A4 Height = 1123px. Margins top/bottom ~100px total.
// Header ~ 250px (Page 1 only).
const MAX_HEIGHT_PAGE_1 = 1123 - 80; // Safety margin
const MAX_HEIGHT_PAGE_N = 1123 - 80;

// Helper to estimate height of content items
const estimateHeight = {
  header: 250,
  sectionTitle: 40,
  experienceItem: (desc: string) => 80 + Math.ceil(desc.length / 90) * 18, // Base + lines
  educationItem: 60,
  projectItem: (desc: string) => 70 + Math.ceil(desc.length / 90) * 18,
  skillItem: 30, // Per row of skills
  profile: (text: string) => 50 + Math.ceil(text.length / 100) * 18,
  certificationItem: 50,
};

export const ModernWaveLayout: React.FC<ModernWaveLayoutProps> = ({ data, theme }) => {
  const { personalDetails, experience, education, skills, projects, certifications } = data;
  const { colors, typography, headerConfig, columnConfig } = theme;

  // Configuration Defaults
  const config = headerConfig || {
    showTitle: true,
    showPhone: true,
    showEmail: true,
    showLocation: true,
    showLink: true,
    showAdditionalLink: true,
    showPhoto: true,
    uppercaseName: true,
    showDob: false,
    showNationality: false,
    photoStyle: 'circle' as const,
  };

  const columns = columnConfig || { leftColumnWidth: 60, rightColumnWidth: 40 };
  const leftFr = columns.leftColumnWidth / 10;
  const rightFr = columns.rightColumnWidth / 10;
  const backgroundUrl = colors.backgroundImage || '/backgrounds/ondas.png';

  const dynamicStyles = {
    '--primary-color': colors.primary || '#2563EB',
    '--secondary-color': colors.secondary || '#64748B',
    '--text-color': colors.text || '#1E293B',
    '--bg-color': colors.background || '#FFFFFF',
    '--accent-color': colors.accent || '#3B82F6',
    '--font-heading': typography.fontFamily || 'Inter',
    '--font-body': typography.fontFamily || 'Inter',
    '--font-size-base': typography.fontSize.base || '14px',
    '--line-height-body': typography.lineHeight || '1.5',
    '--left-col-width': `${leftFr}fr`,
    '--right-col-width': `${rightFr}fr`,
  } as React.CSSProperties;

  // PAGINATION LOGIC (Simplified Heuristic)
  const pages = useMemo(() => {
    // We will distribute content into "buckets" for Left and Right columns per page.
    const buckets: { left: React.ReactNode[], right: React.ReactNode[] }[] = [];
    
    // Initial Page
    let currentPageIndex = 0;
    let currentLeftHeight = estimateHeight.header; // Start with header on Page 1
    let currentRightHeight = estimateHeight.header + 50; // Offset for profile usually starting lower

    const ensurePage = (idx: number) => {
      if (!buckets[idx]) buckets[idx] = { left: [], right: [] };
    };
    ensurePage(0);

    // --- LEFT COLUMN DISTRIBUTION ---
    const leftItems: { type: string, data: any, height: number }[] = [];
    
    // Experience
    if (experience.length > 0) {
      leftItems.push({ type: 'title', data: 'Experiencia', height: estimateHeight.sectionTitle });
      experience.forEach(exp => {
        leftItems.push({ type: 'experience', data: exp, height: estimateHeight.experienceItem(exp.description) });
      });
    }
    // Education
    if (education.length > 0) {
      leftItems.push({ type: 'title', data: 'Educación', height: estimateHeight.sectionTitle });
      education.forEach(edu => {
        leftItems.push({ type: 'education', data: edu, height: estimateHeight.educationItem });
      });
    }
    // Projects
    if (projects && projects.length > 0) {
      leftItems.push({ type: 'title', data: 'Proyectos', height: estimateHeight.sectionTitle });
      projects.forEach(proj => {
        leftItems.push({ type: 'project', data: proj, height: estimateHeight.projectItem(proj.description) });
      });
    }

    // Distribute Left Items
    leftItems.forEach(item => {
      const maxH = currentPageIndex === 0 ? MAX_HEIGHT_PAGE_1 : MAX_HEIGHT_PAGE_N;
      
      if (currentLeftHeight + item.height > maxH) {
        // Move to next page
        currentPageIndex++;
        ensurePage(currentPageIndex);
        currentLeftHeight = 80; // Top padding next page
        
        // If it's a section title causing break, just put it on next page.
        // If it's an item, ideally we should check if title is "orphaned" on prev page, but keep simple.
      }

      // Add to current bucket
      buckets[currentPageIndex].left.push(renderLeftItem(item));
      currentLeftHeight += item.height;
    });


    // --- RIGHT COLUMN DISTRIBUTION ---
    // Reset page index to 0 to fill right columns from start
    currentPageIndex = 0;
    // Right column starts below header on page 1, but we can assume it has same space constraints
    // except it's narrower. Height limit is same.
    // However, visual layout has header spanning both.
    
    // Calculate initial used height for Page 1 Right Col (header area)
    // Actually, header pushes BOTH down. So starting height is same.
    // BUT we need to track right column height separately because it might overflow DIFFERENTLY.
    // Wait, if left column overflows to page 2, does right column also HAVE to be on page 2?
    // In a grid layout per page: Yes. Page 2 has a Left and Right col.
    // If Left content goes to Page 3, Right content might still be on Page 1 if it's short.
    // So we track pages independently but aligned.
    
    currentRightHeight = estimateHeight.header; 

    const rightItems: { type: string, data: any, height: number }[] = [];
    
    // Profile
    if (personalDetails.summary) {
      rightItems.push({ type: 'title', data: 'Perfil Profesional', height: estimateHeight.sectionTitle });
      rightItems.push({ type: 'profile', data: personalDetails.summary, height: estimateHeight.profile(personalDetails.summary) });
    }
    // Skills
    if (skills.length > 0) {
      rightItems.push({ type: 'title', data: 'Habilidades', height: estimateHeight.sectionTitle });
      // Group skills
      // Simplified estimate: total skills / 2 (cols) * row height
      rightItems.push({ type: 'skills', data: skills, height: Math.ceil(skills.length / 2) * estimateHeight.skillItem + 50 });
    }
    // Certifications
    if (certifications && certifications.length > 0) {
      rightItems.push({ type: 'title', data: 'Certificaciones', height: estimateHeight.sectionTitle });
      certifications.forEach(cert => {
        rightItems.push({ type: 'certification', data: cert, height: estimateHeight.certificationItem });
      });
    }

    // Distribute Right Items
    rightItems.forEach(item => {
      // Ensure page exists (if left col didn't create it yet)
      ensurePage(currentPageIndex);
      const maxH = currentPageIndex === 0 ? MAX_HEIGHT_PAGE_1 : MAX_HEIGHT_PAGE_N;

      if (currentRightHeight + item.height > maxH) {
         currentPageIndex++;
         ensurePage(currentPageIndex);
         currentRightHeight = 80;
      }

      buckets[currentPageIndex].right.push(renderRightItem(item));
      currentRightHeight += item.height;
    });

    return buckets;
  }, [data]);

  // RENDER HELPERS
  function renderLeftItem(item: any) {
    switch (item.type) {
      case 'title':
        return <h3 key={`t-${item.data}`} className={styles.sectionTitle}>{item.data}</h3>;
      case 'experience':
        const exp = item.data;
        return (
          <div key={`exp-${exp.id}`} className={styles.item}>
            <div className={styles.itemTitle}>{exp.position}</div>
            <div className={styles.itemSubtitle}>{exp.company}</div>
            <div className={styles.itemMeta}>
              <span>{exp.startDate} - {exp.endDate}</span>
              {exp.location && <span>• {exp.location}</span>}
            </div>
            <div className={styles.itemDescription}>
              {exp.description.includes('\n') ? (
                <ul>
                  {exp.description.split('\n').map((line: string, i: number) => (
                    line.trim() && <li key={i}>{line.trim().replace(/^-\s*/, '')}</li>
                  ))}
                </ul>
              ) : <p>{exp.description}</p>}
            </div>
          </div>
        );
      case 'education':
        const edu = item.data;
        return (
          <div key={`edu-${edu.id}`} className={styles.item}>
            <div className={styles.itemTitle}>{edu.degree}</div>
            <div className={styles.itemSubtitle}>{edu.institution}</div>
            <div className={styles.itemMeta}><span>{edu.startDate} - {edu.endDate}</span></div>
          </div>
        );
      case 'project':
        const proj = item.data;
        return (
          <div key={`proj-${proj.id}`} className={styles.item}>
             <div className={styles.itemHeader} style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div className={styles.itemTitle}>{proj.name}</div>
                {proj.link && (
                  <a href={proj.link} target="_blank" rel="noreferrer" style={{ fontSize: '0.8rem', textDecoration: 'underline' }}>Link</a>
                )}
             </div>
             <div className={styles.itemDescription}>
                <p>{proj.description}</p>
             </div>
          </div>
        );
      default: return null;
    }
  }

  function renderRightItem(item: any) {
     switch (item.type) {
      case 'title':
        return <h3 key={`rt-${item.data}`} className={styles.sectionTitle}>{item.data}</h3>;
      case 'profile':
        return <p key="profile" className={styles.profileText}>{item.data}</p>;
      case 'skills':
        const allSkills = item.data;
        // Logic to group skills
        const grouped = allSkills.reduce((acc: any, skill: any) => {
          const cat = skill.category || 'Otras';
          if (!acc[cat]) acc[cat] = [];
          acc[cat].push(skill);
          return acc;
        }, {});
        return (
          <div key="skills-block">
             {Object.keys(grouped).map((cat: string) => (
                <div key={cat} className={styles.skillsGroup}>
                   <h4 className={styles.skillCategoryTitle}>{cat}</h4>
                   <div className={styles.skillsList}>
                      {grouped[cat].map((s: any) => (
                        <span key={s.id} className={styles.skillTag}>{s.name}</span>
                      ))}
                   </div>
                </div>
             ))}
          </div>
        );
      case 'certification':
        const cert = item.data;
        return (
          <div key={`cert-${cert.id}`} className={styles.item}>
            <div className={styles.itemTitle}>{cert.name}</div>
            <div className={styles.itemSubtitle}>{cert.issuer}</div>
            <div className={styles.itemMeta}>{cert.date}</div>
          </div>
        );
      default: return null;
     }
  }

  return (
    <div className={styles.container} style={dynamicStyles}>
      {pages.map((pageContent, index) => (
        <React.Fragment key={index}>
          {index > 0 && (
             <div className={styles.pageIndicator}>
                <span>— Página {index + 1} —</span>
             </div>
          )}
          
          <div className={styles.page} id={`page-${index + 1}`}>
             {/* Background for every page */}
             {colors.backgroundImage && (
                <div 
                  className={index === 0 ? styles.waveBackground : styles.waveBackgroundSmall}
                  style={{ backgroundImage: `url(${backgroundUrl})`, backgroundSize: 'cover' }} 
                />
             )}

             {/* Header - Only full on Page 1 */}
             {index === 0 ? (
                <header className={styles.header}>
                   <div className={styles.headerContent}>
                      <h1 className={`${styles.name} ${config.uppercaseName ? styles.uppercase : ''}`}>
                        {personalDetails.fullName}
                      </h1>
                      {config.showTitle && <div className={styles.role}>{personalDetails.jobTitle || 'Role'}</div>}
                      
                      <div className={styles.contactInfo}>
                        {config.showEmail && personalDetails.email && (
                          <div className={styles.contactItem}><Icons.Mail /><span>{personalDetails.email}</span></div>
                        )}
                        {config.showPhone && personalDetails.phone && (
                          <div className={styles.contactItem}><Icons.Phone /><span>{personalDetails.phone}</span></div>
                        )}
                        {config.showLocation && personalDetails.address && (
                          <div className={styles.contactItem}><Icons.MapPin /><span>{personalDetails.address}</span></div>
                        )}
                        {config.showLink && personalDetails.links?.[0] && (
                           <div className={styles.contactItem}><Icons.Link /><a href={personalDetails.links[0].url}>{personalDetails.links[0].url.replace(/^https?:\/\//, '')}</a></div>
                        )}
                      </div>
                   </div>

                   {config.showPhoto && personalDetails.profilePicture && (
                      <div className={`${styles.photoContainer} ${styles[config.photoStyle]}`}>
                        <img src={personalDetails.profilePicture} alt={personalDetails.fullName} className={styles.photo} />
                      </div>
                   )}
                </header>
             ) : (
                /* Small Spacer for subsequent pages */
                <div style={{ height: '60px' }}></div>
             )}

             {/* BODY GRID */}
             <div className={styles.body}>
                <div className={styles.columnLeft}>
                   {pageContent.left}
                </div>
                <div className={styles.columnRight}>
                   {pageContent.right}
                </div>
             </div>
          </div>
        </React.Fragment>
      ))}
    </div>
  );
};

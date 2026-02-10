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

// Updated estimates for height calculation (in px, assuming 96dpi)
// A4 Height = 1123px (297mm). 
// Margins Top 12mm (~45px) + Bottom 18mm (~68px) = 113px reserved.
// Usable Height = 1123 - 113 = 1010px.
// Header ~ 160px.
const USABLE_HEIGHT = 1010;
const HEADER_HEIGHT = 160; 

// SVG de Fondo "Enhancv Waves Blue"
const DEFAULT_BG_SVG = `data:image/svg+xml,%3csvg width='940' height='1329' viewBox='0 0 940 1329' fill='none' xmlns='http://www.w3.org/2000/svg'%3e%3cg clip-path='url(%23clip0_896_3211)'%3e%3crect width='940' height='1329' fill='%231E90FF'/%3e%3cmask id='mask0_896_3211' style='mask-type:alpha' maskUnits='userSpaceOnUse' x='0' y='0' width='940' height='1329'%3e%3crect width='940' height='1329' fill='%231E90FF'/%3e%3c/mask%3e%3cg mask='url(%23mask0_896_3211)'%3e%3crect width='940' height='1329' fill='white'/%3e%3c/g%3e%3cpath opacity='0.2' d='M222.119 1213.34C136.227 1131.03 29.024 1081.65 -73.8811 1141.34C-162.238 1192.6 -197.081 1298.14 -177.881 1381.34C-153.881 1485.34 -101.881 1637.34 114.119 1641.34C330.119 1645.34 448.371 1554.85 426.119 1421.34C406.119 1301.34 318.119 1305.34 222.119 1213.34Z' fill='%231E90FF'/%3e%3cpath d='M204.745 1242.07C133.986 1174.21 45.6698 1133.5 -39.1056 1182.71C-111.896 1224.97 -140.6 1311.97 -124.783 1380.56C-105.011 1466.29 -62.1725 1591.6 115.773 1594.89C293.718 1598.19 391.136 1523.6 372.805 1413.54C356.328 1314.61 283.832 1317.91 204.745 1242.07Z' stroke='white'/%3e%3cpath d='M139.038 1260.63C87.9343 1206.53 24.1504 1174.08 -37.0762 1213.31C-89.6471 1247 -110.378 1316.36 -98.9543 1371.04C-84.6748 1439.39 -53.7357 1539.29 74.7803 1541.92C203.296 1544.55 273.654 1485.07 260.415 1397.33C248.515 1318.47 196.157 1321.09 139.038 1260.63Z' stroke='white'/%3e%3ccircle cx='58' cy='1336' r='58' stroke='white'/%3e%3cpath opacity='0.2' d='M290 77C194 45 118 -52.3333 114 -87C358 -96.3333 1046 -87 1046 -87C1046 -87 1190 213 1046 237C902 261 858 137 690 77C542.891 24.461 410 117 290 77Z' fill='%231E90FF'/%3e%3cpath d='M309 -34.5C322.667 -8.33333 360.9 42.9 404.5 38.5C459 33 563.5 -23 646 18C728.5 59 834 110 918 100.5C985.2 92.9 989.667 7.33333 983.5 -34.5L309 -44' stroke='white'/%3e%3ccircle cx='881' cy='2' r='58' stroke='white'/%3e%3c/g%3e%3cdefs%3e%3cclipPath id='clip0_896_3211'%3e%3crect width='940' height='1329' fill='%231E90FF'/%3e%3c/clipPath%3e%3c/defs%3e%3c/svg%3e`;

// Helper to estimate height of content items
const estimateHeight = {
  header: HEADER_HEIGHT, 
  sectionTitle: 55, 
  experienceItem: (desc: string) => 80 + Math.ceil(desc.length / 85) * 20, 
  educationItem: 70,
  projectItem: (desc: string) => 75 + Math.ceil(desc.length / 85) * 20,
  skillItem: 32, 
  profile: (text: string) => 40 + Math.ceil(text.length / 90) * 20,
  certificationItem: 55,
};

export const ModernWaveLayout: React.FC<ModernWaveLayoutProps> = ({ data, theme }) => {
  const { personalDetails, experience, education, skills, projects, certifications } = data;
  const { colors, typography, headerConfig, columnConfig } = theme;

  // Helper para limpiar HTML sucio de TipTap (párrafos vacíos al final)
  const cleanHtml = (html: string) => {
    if (!html) return '';
    let cleaned = html;
    // Regex mejorado para detectar <p> vacíos, con <br>, &nbsp; o espacios al final
    const emptyParagraphRegex = /<p>(\s*<br\s*\/?>\s*|&nbsp;|\s)*<\/p>\s*$/i;
    while (cleaned.match(emptyParagraphRegex)) {
      cleaned = cleaned.replace(emptyParagraphRegex, '');
    }
    return cleaned;
  };

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
  // Use user selected background or the default complex wave SVG
  const backgroundUrl = colors.backgroundImage || DEFAULT_BG_SVG;

  const dynamicStyles = {
    '--primary-color': colors.primary || '#2563EB',
    '--secondary-color': colors.secondary || '#64748B',
    '--text-color': colors.text || '#1E293B',
    '--bg-color': colors.background || '#FFFFFF',
    '--accent-color': colors.accent || '#3B82F6',
    '--font-heading': typography.fontFamily || 'Rubik',
    '--font-body': typography.fontFamily || 'Rubik',
    '--left-col-width': `${leftFr}fr`,
    '--right-col-width': `${rightFr}fr`,
    '--base-scale': `${parseInt(typography.fontSize.base) / 14}`, // 14px es la base por defecto
    '--dynamic-lh': typography.lineHeight,
  } as React.CSSProperties;

  // PAGINATION LOGIC
  const pages = useMemo(() => {
    const buckets: { left: React.ReactNode[], right: React.ReactNode[] }[] = [];
    
    // Initial Page
    let currentPageIndex = 0;
    let currentLeftHeight = estimateHeight.header; 
    let currentRightHeight = estimateHeight.header; 

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
      const maxH = USABLE_HEIGHT;
      
      if (currentLeftHeight + item.height > maxH) {
        currentPageIndex++;
        ensurePage(currentPageIndex);
        currentLeftHeight = 60; 
      }

      buckets[currentPageIndex].left.push(renderLeftItem(item));
      currentLeftHeight += item.height;
    });


    // --- RIGHT COLUMN DISTRIBUTION ---
    currentPageIndex = 0;
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
      ensurePage(currentPageIndex);
      const maxH = USABLE_HEIGHT;

      if (currentRightHeight + item.height > maxH) {
         currentPageIndex++;
         ensurePage(currentPageIndex);
         currentRightHeight = 60;
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
              <Icons.Calendar />
              <span>{exp.startDate} - {exp.endDate}</span>
              {exp.location && <span>• {exp.location}</span>}
            </div>
            <div className={styles.itemDescription} dangerouslySetInnerHTML={{ __html: cleanHtml(exp.description) }} />
          </div>
        );
      case 'education':
        const edu = item.data;
        return (
          <div key={`edu-${edu.id}`} className={styles.item}>
            <div className={styles.itemTitle}>{edu.degree}</div>
            <div className={styles.itemSubtitle}>{edu.institution}</div>
            <div className={styles.itemMeta}>
              <Icons.Calendar />
              <span>{edu.startDate} - {edu.endDate}</span>
            </div>
          </div>
        );
      case 'project':
        const proj = item.data;
        return (
          <div key={`proj-${proj.id}`} className={styles.item}>
             <div className={styles.itemHeader} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <div className={styles.itemTitle}>{proj.name}</div>
                {proj.link && (
                  <a href={proj.link} target="_blank" rel="noreferrer" style={{ fontSize: '0.75rem', textDecoration: 'underline', color: 'var(--primary-color)' }}>Link</a>
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
        return <div key="profile" className={styles.profileText} dangerouslySetInnerHTML={{ __html: item.data }} />;
      case 'skills':
        const allSkills = item.data;
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
            <div className={styles.itemMeta}>
               <Icons.Calendar />
               {cert.date}
            </div>
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
             {/* Wrapper interno para manejar overflow y background sin cortar sombras externas */}
             <div className={styles.pageInner}>
               {/* Background Layers - Always render background if URL exists (now defaults to SVG) */}
               <div 
                 className={styles.waveBackground}
                 style={{ backgroundImage: `url("${backgroundUrl}")`, backgroundSize: 'cover' }} 
               />

               {/* Content Wrapper for Margins */}
               <div className={styles.pageContentWrapper}>
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

                     {config.showPhoto && (
                        <div className={`${styles.photoContainer} ${styles[config.photoStyle]}`}>
                          {personalDetails.profilePicture && !personalDetails.profilePicture.includes('placeholder') ? (
                             <img src={personalDetails.profilePicture} alt={personalDetails.fullName} className={styles.photo} />
                          ) : (
                             <div className={styles.placeholderContent}>
                                <svg className={styles.placeholderIcon} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                                  <circle cx="12" cy="13" r="4"/>
                                </svg>
                                <span className={styles.placeholderText}>Subir Foto</span>
                             </div>
                          )}
                        </div>
                     )}
                  </header>
               ) : (
                  /* Spacer for subsequent pages */
                  <div style={{ height: '15mm' }}></div>
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
             </div>
          </div>
        </React.Fragment>
      ))}
    </div>
  );
};

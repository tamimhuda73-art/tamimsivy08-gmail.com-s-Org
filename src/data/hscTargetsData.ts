import { MonthlyAssignment, MonthSectionData, RevisionChapterRecord } from '../types/tracker';

export const MONTH_SECTIONS: MonthSectionData[] = [
  { key: 'nov-2026', name: 'November 2026', targetCount: 17, subtext: '4 Subjects • Focus on Paper 2 Foundations' },
  { key: 'dec-2026', name: 'December 2026', targetCount: 20, subtext: 'Core Intensive • Paper 1 & 2 Integration' },
  { key: 'jan-2027', name: 'January 2027', targetCount: 16, subtext: 'Advanced Calculus, Genetics & Dynamics' },
  { key: 'feb-2027', name: 'February 2027', targetCount: 15, subtext: 'Modern Physics, Organic & Equilibrium' },
  { key: 'mar-2027', name: 'March 2027', targetCount: 11, subtext: 'Syllabus Wrap-Up & Astrophysics' },
  { key: 'rev-2027', name: 'April–May 2027', targetCount: 68, subtext: 'Full Syllabus Board CQ & MCQ Mastery' }
];

// Helper to construct assignments
const makeAssignment = (
  id: string,
  monthKey: string,
  monthName: string,
  subjectKey: string,
  chapterNumber: number,
  chapterName: string,
  subjectId?: string,
  paperId?: string
): MonthlyAssignment => ({
  id,
  monthKey,
  monthName,
  subjectKey,
  subjectId,
  paperId,
  chapterNumber,
  chapterName,
  status: 'NOT STARTED',
  completed: false
});

export const INITIAL_MONTHLY_ASSIGNMENTS: MonthlyAssignment[] = [
  // ==========================================
  // NOVEMBER 2026 — 17 ASSIGNMENTS
  // ==========================================
  // Physics 2 (4)
  makeAssignment('asg-nov-phy2-1', 'nov-2026', 'November 2026', 'Physics 2', 1, 'Thermal Physics & Heat Engines', 'subj-physics', 'subj-physics-paper-2'),
  makeAssignment('asg-nov-phy2-2', 'nov-2026', 'November 2026', 'Physics 2', 2, 'Electrostatics & Coulomb\'s Law', 'subj-physics', 'subj-physics-paper-2'),
  makeAssignment('asg-nov-phy2-3', 'nov-2026', 'November 2026', 'Physics 2', 3, 'Current Electricity & Circuits', 'subj-physics', 'subj-physics-paper-2'),
  makeAssignment('asg-nov-phy2-4', 'nov-2026', 'November 2026', 'Physics 2', 4, 'Magnetic Effects of Electric Current', 'subj-physics', 'subj-physics-paper-2'),

  // Chemistry 2 (2)
  makeAssignment('asg-nov-chm2-1', 'nov-2026', 'November 2026', 'Chemistry 2', 1, 'Environmental Chemistry & Atmospheric Gases', 'subj-chem', 'subj-chem-paper-2'),
  makeAssignment('asg-nov-chm2-2', 'nov-2026', 'November 2026', 'Chemistry 2', 2, 'Organic Chemistry & Reaction Mechanisms', 'subj-chem', 'subj-chem-paper-2'),

  // Higher Mathematics 2 (4)
  makeAssignment('asg-nov-mth2-3', 'nov-2026', 'November 2026', 'Higher Mathematics 2', 3, 'Complex Numbers & De Moivre\'s Theorem', 'subj-math', 'subj-math-paper-2'),
  makeAssignment('asg-nov-mth2-6', 'nov-2026', 'November 2026', 'Higher Mathematics 2', 6, 'Inverse Trigonometric Functions', 'subj-math', 'subj-math-paper-2'),
  makeAssignment('asg-nov-mth2-8', 'nov-2026', 'November 2026', 'Higher Mathematics 2', 8, 'Statics & Equilibrium of Forces', 'subj-math', 'subj-math-paper-2'),
  makeAssignment('asg-nov-mth2-9', 'nov-2026', 'November 2026', 'Higher Mathematics 2', 9, 'Dynamics & Motion of Projectiles', 'subj-math', 'subj-math-paper-2'),

  // Biology 2 (5)
  makeAssignment('asg-nov-bio2-3', 'nov-2026', 'November 2026', 'Biology 2', 3, 'Human Physiology: Digestion & Absorption', 'subj-bio', 'subj-bio-paper-2'),
  makeAssignment('asg-nov-bio2-4', 'nov-2026', 'November 2026', 'Biology 2', 4, 'Human Physiology: Blood & Circulation', 'subj-bio', 'subj-bio-paper-2'),
  makeAssignment('asg-nov-bio2-5', 'nov-2026', 'November 2026', 'Biology 2', 5, 'Human Physiology: Respiration & Gas Exchange', 'subj-bio', 'subj-bio-paper-2'),
  makeAssignment('asg-nov-bio2-6', 'nov-2026', 'November 2026', 'Biology 2', 6, 'Human Physiology: Excretion & Osmoregulation', 'subj-bio', 'subj-bio-paper-2'),
  makeAssignment('asg-nov-bio2-7', 'nov-2026', 'November 2026', 'Biology 2', 7, 'Human Physiology: Locomotion & Bone Mechanics', 'subj-bio', 'subj-bio-paper-2'),

  // ICT (2)
  makeAssignment('asg-nov-ict-2', 'nov-2026', 'November 2026', 'ICT', 2, 'Communication Systems & Networking', 'subj-ict', 'subj-ict-paper-1'),
  makeAssignment('asg-nov-ict-3', 'nov-2026', 'November 2026', 'ICT', 3, 'Number Systems & Digital Logic', 'subj-ict', 'subj-ict-paper-1'),

  // ==========================================
  // DECEMBER 2026 — 20 ASSIGNMENTS
  // ==========================================
  // Physics 1 (1)
  makeAssignment('asg-dec-phy1-2', 'dec-2026', 'December 2026', 'Physics 1', 2, 'Vector Analysis & Calculus', 'subj-physics', 'subj-physics-paper-1'),

  // Physics 2 (4)
  makeAssignment('asg-dec-phy2-6', 'dec-2026', 'December 2026', 'Physics 2', 6, 'Geometrical & Ray Optics', 'subj-physics', 'subj-physics-paper-2'),
  makeAssignment('asg-dec-phy2-7', 'dec-2026', 'December 2026', 'Physics 2', 7, 'Physical & Wave Optics', 'subj-physics', 'subj-physics-paper-2'),
  makeAssignment('asg-dec-phy2-8', 'dec-2026', 'December 2026', 'Physics 2', 8, 'Introduction to Modern Physics & Relativity', 'subj-physics', 'subj-physics-paper-2'),
  makeAssignment('asg-dec-phy2-9', 'dec-2026', 'December 2026', 'Physics 2', 9, 'Atomic Models & Nuclear Physics', 'subj-physics', 'subj-physics-paper-2'),

  // Chemistry 1 (3)
  makeAssignment('asg-dec-chm1-3', 'dec-2026', 'December 2026', 'Chemistry 1', 3, 'Periodic Properties & Chemical Bonding', 'subj-chem', 'subj-chem-paper-1'),
  makeAssignment('asg-dec-chm1-4', 'dec-2026', 'December 2026', 'Chemistry 1', 4, 'Chemical Changes & Thermodynamics', 'subj-chem', 'subj-chem-paper-1'),
  makeAssignment('asg-dec-chm1-5', 'dec-2026', 'December 2026', 'Chemistry 1', 5, 'Work-oriented Industrial Chemistry', 'subj-chem', 'subj-chem-paper-1'),

  // Higher Mathematics 1 (2)
  makeAssignment('asg-dec-mth1-7', 'dec-2026', 'December 2026', 'Higher Mathematics 1', 7, 'Associated & Compound Angle Trigonometry', 'subj-math', 'subj-math-paper-1'),
  makeAssignment('asg-dec-mth1-9', 'dec-2026', 'December 2026', 'Higher Mathematics 1', 9, 'Indefinite & Definite Integration', 'subj-math', 'subj-math-paper-1'),

  // Higher Mathematics 2 (3)
  makeAssignment('asg-dec-mth2-1', 'dec-2026', 'December 2026', 'Higher Mathematics 2', 1, 'Real Numbers & Inequalities', 'subj-math', 'subj-math-paper-2'),
  makeAssignment('asg-dec-mth2-2', 'dec-2026', 'December 2026', 'Higher Mathematics 2', 2, 'Linear Programming Optimization', 'subj-math', 'subj-math-paper-2'),
  makeAssignment('asg-dec-mth2-4', 'dec-2026', 'December 2026', 'Higher Mathematics 2', 4, 'Polynomials & Quadratic Equations', 'subj-math', 'subj-math-paper-2'),

  // Biology 1 (3)
  makeAssignment('asg-dec-bio1-2', 'dec-2026', 'December 2026', 'Biology 1', 2, 'Cell Division (Mitosis & Meiosis)', 'subj-bio', 'subj-bio-paper-1'),
  makeAssignment('asg-dec-bio1-3', 'dec-2026', 'December 2026', 'Biology 1', 3, 'Cell Chemistry (Biomolecules)', 'subj-bio', 'subj-bio-paper-1'),
  makeAssignment('asg-dec-bio1-4', 'dec-2026', 'December 2026', 'Biology 1', 4, 'Microorganisms (Virus & Bacteria)', 'subj-bio', 'subj-bio-paper-1'),

  // Biology 2 (2)
  makeAssignment('asg-dec-bio2-1', 'dec-2026', 'December 2026', 'Biology 2', 1, 'Animal Diversity & Classification', 'subj-bio', 'subj-bio-paper-2'),
  makeAssignment('asg-dec-bio2-2', 'dec-2026', 'December 2026', 'Biology 2', 2, 'Animal Identity (Hydra, Grasshopper, Rohu)', 'subj-bio', 'subj-bio-paper-2'),

  // ICT (2)
  makeAssignment('asg-dec-ict-4', 'dec-2026', 'December 2026', 'ICT', 4, 'Web Design Fundamentals & HTML', 'subj-ict', 'subj-ict-paper-1'),
  makeAssignment('asg-dec-ict-5', 'dec-2026', 'December 2026', 'ICT', 5, 'Programming Language (C Programming)', 'subj-ict', 'subj-ict-paper-1'),

  // ==========================================
  // JANUARY 2027 — 16 ASSIGNMENTS
  // ==========================================
  // Physics 1 (4)
  makeAssignment('asg-jan-phy1-3', 'jan-2027', 'January 2027', 'Physics 1', 3, 'Dynamics & Newton\'s Laws', 'subj-physics', 'subj-physics-paper-1'),
  makeAssignment('asg-jan-phy1-4', 'jan-2027', 'January 2027', 'Physics 1', 4, 'Work, Energy & Power', 'subj-physics', 'subj-physics-paper-1'),
  makeAssignment('asg-jan-phy1-5', 'jan-2027', 'January 2027', 'Physics 1', 5, 'Circular Motion & Gravitation', 'subj-physics', 'subj-physics-paper-1'),
  makeAssignment('asg-jan-phy1-10', 'jan-2027', 'January 2027', 'Physics 1', 10, 'Thermodynamics & Heat Energy', 'subj-physics', 'subj-physics-paper-1'),

  // Chemistry 1 (3)
  makeAssignment('asg-jan-chm1-2', 'jan-2027', 'January 2027', 'Chemistry 1', 2, 'Qualitative Chemistry & Salt Analysis', 'subj-chem', 'subj-chem-paper-1'),
  makeAssignment('asg-jan-chm1-3', 'jan-2027', 'January 2027', 'Chemistry 1', 3, 'Periodic Properties & Chemical Bonding (Part 2)', 'subj-chem', 'subj-chem-paper-1'),
  makeAssignment('asg-jan-chm1-5', 'jan-2027', 'January 2027', 'Chemistry 1', 5, 'Industrial Reactions & Glass/Cement', 'subj-chem', 'subj-chem-paper-1'),

  // Higher Mathematics 1 (4)
  makeAssignment('asg-jan-mth1-1', 'jan-2027', 'January 2027', 'Higher Mathematics 1', 1, 'Matrices & Determinants', 'subj-math', 'subj-math-paper-1'),
  makeAssignment('asg-jan-mth1-3', 'jan-2027', 'January 2027', 'Higher Mathematics 1', 3, 'Straight Lines & Coordinate Geometry', 'subj-math', 'subj-math-paper-1'),
  makeAssignment('asg-jan-mth1-4', 'jan-2027', 'January 2027', 'Higher Mathematics 1', 4, 'Circles & Tangents', 'subj-math', 'subj-math-paper-1'),
  makeAssignment('asg-jan-mth1-10', 'jan-2027', 'January 2027', 'Higher Mathematics 1', 10, 'Definite Integration & Area Calculus', 'subj-math', 'subj-math-paper-1'),

  // Biology 1 (3)
  makeAssignment('asg-jan-bio1-9', 'jan-2027', 'January 2027', 'Biology 1', 9, 'Plant Physiology: Photosynthesis & Respiration', 'subj-bio', 'subj-bio-paper-1'),
  makeAssignment('asg-jan-bio1-10', 'jan-2027', 'January 2027', 'Biology 1', 10, 'Plant Reproduction & Pollination', 'subj-bio', 'subj-bio-paper-1'),
  makeAssignment('asg-jan-bio1-11', 'jan-2027', 'January 2027', 'Biology 1', 11, 'Biotechnology & Genetic Engineering', 'subj-bio', 'subj-bio-paper-1'),

  // Biology 2 (1)
  makeAssignment('asg-jan-bio2-11', 'jan-2027', 'January 2027', 'Biology 2', 11, 'Genetics & Darwinian Evolution', 'subj-bio', 'subj-bio-paper-2'),

  // ICT (1)
  makeAssignment('asg-jan-ict-6', 'jan-2027', 'January 2027', 'ICT', 6, 'Database Management System (DBMS)', 'subj-ict', 'subj-ict-paper-1'),

  // ==========================================
  // FEBRUARY 2027 — 15 ASSIGNMENTS
  // ==========================================
  // Physics 1 (3)
  makeAssignment('asg-feb-phy1-7', 'feb-2027', 'February 2027', 'Physics 1', 7, 'Periodic Motion & Oscillations', 'subj-physics', 'subj-physics-paper-1'),
  makeAssignment('asg-feb-phy1-8', 'feb-2027', 'February 2027', 'Physics 1', 8, 'Waves & Sound Mechanics', 'subj-physics', 'subj-physics-paper-1'),
  makeAssignment('asg-feb-phy1-9', 'feb-2027', 'February 2027', 'Physics 1', 9, 'Ideal Gases & Kinetic Theory', 'subj-physics', 'subj-physics-paper-1'),

  // Physics 2 (2)
  makeAssignment('asg-feb-phy2-5', 'feb-2027', 'February 2027', 'Physics 2', 5, 'Electromagnetic Induction & AC Circuits', 'subj-physics', 'subj-physics-paper-2'),
  makeAssignment('asg-feb-phy2-10', 'feb-2027', 'February 2027', 'Physics 2', 10, 'Semiconductor Physics & Electronics', 'subj-physics', 'subj-physics-paper-2'),

  // Chemistry 1 (2)
  makeAssignment('asg-feb-chm1-1', 'feb-2027', 'February 2027', 'Chemistry 1', 1, 'Safe Use of Laboratory & Hazard Signs', 'subj-chem', 'subj-chem-paper-1'),
  makeAssignment('asg-feb-chm1-4', 'feb-2027', 'February 2027', 'Chemistry 1', 4, 'Chemical Equilibrium & Le Chatelier\'s Principle', 'subj-chem', 'subj-chem-paper-1'),

  // Higher Mathematics 1 (2)
  makeAssignment('asg-feb-mth1-5', 'feb-2027', 'February 2027', 'Higher Mathematics 1', 5, 'Permutations & Combinations', 'subj-math', 'subj-math-paper-1'),
  makeAssignment('asg-feb-mth1-6', 'feb-2027', 'February 2027', 'Higher Mathematics 1', 6, 'Trigonometric Ratios & Graphs', 'subj-math', 'subj-math-paper-1'),

  // Higher Mathematics 2 (2)
  makeAssignment('asg-feb-mth2-5', 'feb-2027', 'February 2027', 'Higher Mathematics 2', 5, 'Conic Sections (Parabola, Ellipse, Hyperbola)', 'subj-math', 'subj-math-paper-2'),
  makeAssignment('asg-feb-mth2-10', 'feb-2027', 'February 2027', 'Higher Mathematics 2', 10, 'Measures of Dispersion & Probability', 'subj-math', 'subj-math-paper-2'),

  // Biology 1 (2)
  makeAssignment('asg-feb-bio1-6', 'feb-2027', 'February 2027', 'Biology 1', 6, 'Bryophyta & Pteridophyta', 'subj-bio', 'subj-bio-paper-1'),
  makeAssignment('asg-feb-bio1-7', 'feb-2027', 'February 2027', 'Biology 1', 7, 'Gymnosperms & Angiosperms', 'subj-bio', 'subj-bio-paper-1'),

  // Biology 2 (2)
  makeAssignment('asg-feb-bio2-8', 'feb-2027', 'February 2027', 'Biology 2', 8, 'Human Physiology: Coordination & Endocrine', 'subj-bio', 'subj-bio-paper-2'),
  makeAssignment('asg-feb-bio2-9', 'feb-2027', 'February 2027', 'Biology 2', 9, 'Human Physiology: Human Reproduction', 'subj-bio', 'subj-bio-paper-2'),

  // ==========================================
  // MARCH 2027 — 11 ASSIGNMENTS
  // ==========================================
  // Physics 1 (2)
  makeAssignment('asg-mar-phy1-1', 'mar-2027', 'March 2027', 'Physics 1', 1, 'Physical World & Measurement Precision', 'subj-physics', 'subj-physics-paper-1'),
  makeAssignment('asg-mar-phy1-6', 'mar-2027', 'March 2027', 'Physics 1', 6, 'Structural Properties of Matter & Elasticity', 'subj-physics', 'subj-physics-paper-1'),

  // Physics 2 (1)
  makeAssignment('asg-mar-phy2-11', 'mar-2027', 'March 2027', 'Physics 2', 11, 'Astronomy & Astrophysics Fundamentals', 'subj-physics', 'subj-physics-paper-2'),

  // Higher Mathematics 1 (2)
  makeAssignment('asg-mar-mth1-2', 'mar-2027', 'March 2027', 'Higher Mathematics 1', 2, 'Vectors in 2D & 3D Plane', 'subj-math', 'subj-math-paper-1'),
  makeAssignment('asg-mar-mth1-8', 'mar-2027', 'March 2027', 'Higher Mathematics 1', 8, 'Functions & Function Graphs', 'subj-math', 'subj-math-paper-1'),

  // Higher Mathematics 2 (1)
  makeAssignment('asg-mar-mth2-7', 'mar-2027', 'March 2027', 'Higher Mathematics 2', 7, 'Trigonometric Equations & Formulas', 'subj-math', 'subj-math-paper-2'),

  // Biology 1 (3)
  makeAssignment('asg-mar-bio1-1', 'mar-2027', 'March 2027', 'Biology 1', 1, 'Cell & Its Structure (Mastery)', 'subj-bio', 'subj-bio-paper-1'),
  makeAssignment('asg-mar-bio1-8', 'mar-2027', 'March 2027', 'Biology 1', 8, 'Tissue & Tissue Systems', 'subj-bio', 'subj-bio-paper-1'),
  makeAssignment('asg-mar-bio1-12', 'mar-2027', 'March 2027', 'Biology 1', 12, 'Organism & Ecosystem Environment', 'subj-bio', 'subj-bio-paper-1'),

  // Biology 2 (2)
  makeAssignment('asg-mar-bio2-10', 'mar-2027', 'March 2027', 'Biology 2', 10, 'Human Body Defense & Immunology', 'subj-bio', 'subj-bio-paper-2'),
  makeAssignment('asg-mar-bio2-12', 'mar-2027', 'March 2027', 'Biology 2', 12, 'Animal Behavior & Sociobiology', 'subj-bio', 'subj-bio-paper-2')
];

// Deduplicate unique chapters across the November–March roadmap for the April–May Revision System
export const generateInitialRevisionRecords = (): RevisionChapterRecord[] => {
  const map = new Map<string, RevisionChapterRecord>();

  INITIAL_MONTHLY_ASSIGNMENTS.forEach(asg => {
    const key = `${asg.subjectKey}-Ch${asg.chapterNumber}`;
    if (!map.has(key)) {
      map.set(key, {
        id: key,
        subjectKey: asg.subjectKey,
        chapterNumber: asg.chapterNumber,
        chapterName: asg.chapterName,
        revisionCompleted: false
      });
    }
  });

  return Array.from(map.values()).sort((a, b) => {
    if (a.subjectKey !== b.subjectKey) return a.subjectKey.localeCompare(b.subjectKey);
    return a.chapterNumber - b.chapterNumber;
  });
};

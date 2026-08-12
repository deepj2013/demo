const SCHOOLS = {
  keshav: {
    id: 'keshav',
    name: 'Keshav Vidya Mandir Model School',
    nameHindi: 'केशव विद्या मंदिर मॉडल स्कूल',
    type: 'CBSE School',
    tagline: 'Excellence in Education Since Inception',
    address: 'Vinod Nagar W, West Vinod Nagar, I.P.Extension, Mandawali, Delhi, 110092',
    phone: '011 2247 2248',
    email: 'info@keshavvidyamandir.edu.in',
    hours: 'Mon–Sat: 8:00 AM – 2:00 PM',
    grades: 'Nursery to Class XII',
    board: 'CBSE',
    established: '1995',
    principal: 'Dr. Rajesh Kumar Sharma',
    motto: 'विद्या ददाति विनयम् — Knowledge Bestows Humility',
    stats: { students: 2500, teachers: 120, years: 30, classrooms: 45 },
    colors: { primary: '#1a5276', secondary: '#f39c12', accent: '#27ae60' },
    images: {
      hero: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=1920&q=80',
      about: 'https://images.unsplash.com/photo-1503676260728-1c00da1a2fc4?w=800&q=80',
      // Unsplash URLs requested in the prompt:
      // - students: photo-1503676260728-1c00da1a2fc4
      students: 'https://images.unsplash.com/photo-1503676260728-1c00da1a2fc4?w=800&q=80',
      classroom: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=800&q=80',
      sports: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=80',
      lab: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&q=80',
      library: 'https://images.unsplash.com/photo-1524995997942-1c7eacadef95?w=800&q=80',
      event: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&q=80',
      // Some themes use data-bg="graduation"
      graduation: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&q=80'
    }
  },
  sunrise: {
    id: 'sunrise',
    name: 'Sunrise India Public School',
    nameHindi: 'सनराइज इंडिया पब्लिक स्कूल',
    type: 'General Education School',
    tagline: 'Nurturing Tomorrow\'s Leaders Today',
    address: 'F-68, Street Number 3, West Vinod Nagar, F Block, Mandawali, Delhi, 110092',
    phone: '092132 78158',
    email: 'info@sunriseindiaschool.edu.in',
    hours: 'Mon–Sat: 8:00 AM – 2:30 PM',
    grades: 'Nursery to Class XII',
    board: 'CBSE',
    established: '2008',
    principal: 'Mrs. Priya Verma',
    motto: 'Arise, Awake and Stop Not Till the Goal is Reached',
    stats: { students: 1800, teachers: 85, years: 18, classrooms: 38 },
    colors: { primary: '#e74c3c', secondary: '#3498db', accent: '#f1c40f' },
    images: {
      // School hero requested in the prompt:
      // - school: photo-1580582932707-520aed937b7b
      hero: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=1920&q=80',
      about: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&q=80',
      // - students: photo-1503676260728-1c00da1a2fc4
      students: 'https://images.unsplash.com/photo-1503676260728-1c00da1a2fc4?w=800&q=80',
      classroom: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=800&q=80',
      sports: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&q=80',
      lab: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&q=80',
      library: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&q=80',
      event: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&q=80',
      // - graduation: photo-1523050854058-8df90110c9f1
      graduation: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&q=80'
    }
  }
};

const THEMES = [
  { id: 'kadu', name: 'Kadu', style: 'Online Education Platform', color: '#6c5ce7' },
  { id: 'bornomala', name: 'Bornomala', style: 'Kindergarten & Primary', color: '#fd79a8' },
  { id: 'eduvision', name: 'EduVision', style: 'Multipurpose Education', color: '#0984e3' },
  { id: 'ischool', name: 'iSchool', style: 'University & Courses', color: '#00b894' },
  { id: 'edusion', name: 'Edusion', style: 'Modern Learning', color: '#e17055' },
  { id: 'eduall', name: 'EduAll', style: 'LMS & Online Courses', color: '#6c5ce7' },
  { id: 'kidso', name: 'Kidso', style: 'Childcare & Classes', color: '#fdcb6e' },
  { id: 'eginary', name: 'Eginary', style: 'Smart Learning', color: '#00cec9' },
  { id: 'wellearn', name: 'WellLearn', style: 'Education Hub', color: '#a29bfe' },
  { id: 'edrio', name: 'Edrio', style: 'Kindergarten Classic', color: '#ff7675' },
  { id: 'los-ninos', name: 'Los Niños', style: 'Playful Learning', color: '#55efc4' },
  { id: 'kidscholl', name: 'Kidscholl', style: 'Preschool & Kindergarten', color: '#74b9ff' },
  { id: 'ascen', name: 'Ascen', style: 'Childcare & Kids School', color: '#fab1a0' },
  { id: 'cutie', name: 'Cutie', style: 'Creative Education', color: '#ffeaa7' },
  { id: 'kiddoz', name: 'Kiddoz', style: 'School & Kindergarten', color: '#81ecec' }
];

const COURSES = [
  { title: 'Mathematics', category: 'Academic', lessons: 48, duration: 'Full Year', level: 'All Levels' },
  { title: 'Science & Technology', category: 'Academic', lessons: 42, duration: 'Full Year', level: 'All Levels' },
  { title: 'English Language', category: 'Language', lessons: 36, duration: 'Full Year', level: 'All Levels' },
  { title: 'Hindi & Sanskrit', category: 'Language', lessons: 30, duration: 'Full Year', level: 'All Levels' },
  { title: 'Computer Science', category: 'Technology', lessons: 24, duration: 'Semester', level: 'Class VI-XII' },
  { title: 'Physical Education', category: 'Sports', lessons: 20, duration: 'Full Year', level: 'All Levels' },
  { title: 'Art & Craft', category: 'Creative', lessons: 18, duration: 'Semester', level: 'All Levels' },
  { title: 'Social Studies', category: 'Academic', lessons: 40, duration: 'Full Year', level: 'All Levels' }
];

const TEACHERS = [
  { name: 'Mrs. Sunita Devi', role: 'Senior Mathematics Teacher', subject: 'Mathematics', experience: '15 years' },
  { name: 'Mr. Amit Singh', role: 'Science Department Head', subject: 'Physics & Chemistry', experience: '12 years' },
  { name: 'Mrs. Kavita Sharma', role: 'English Language Expert', subject: 'English', experience: '10 years' },
  { name: 'Mr. Ravi Kumar', role: 'Computer Science Instructor', subject: 'IT & Coding', experience: '8 years' },
  { name: 'Mrs. Meena Joshi', role: 'Primary Section Coordinator', subject: 'All Subjects', experience: '18 years' },
  { name: 'Mr. Vikram Patel', role: 'Sports Coach', subject: 'Physical Education', experience: '7 years' }
];

const EVENTS = [
  { date: '15 Aug 2026', title: 'Independence Day Celebration', time: '8:00 AM - 12:00 PM', location: 'School Ground' },
  { date: '05 Sep 2026', title: 'Teachers\' Day Program', time: '9:00 AM - 1:00 PM', location: 'Auditorium' },
  { date: '14 Nov 2026', title: 'Children\'s Day Fest', time: '8:30 AM - 3:00 PM', location: 'School Campus' },
  { date: '26 Jan 2027', title: 'Republic Day Parade', time: '8:00 AM - 11:00 AM', location: 'School Ground' }
];

const BLOG_POSTS = [
  { title: 'Annual Day 2026 — A Grand Success', date: '10 Mar 2026', category: 'Events', excerpt: 'Our annual day celebration showcased incredible talent from students across all grades.' },
  { title: 'CBSE Board Exam Preparation Tips', date: '01 Feb 2026', category: 'Academics', excerpt: 'Expert guidance for Class X and XII students preparing for board examinations.' },
  { title: 'Science Exhibition Highlights', date: '20 Jan 2026', category: 'Science', excerpt: 'Students presented innovative projects at our annual science fair.' }
];

if (typeof module !== 'undefined') module.exports = { SCHOOLS, THEMES, COURSES, TEACHERS, EVENTS, BLOG_POSTS };

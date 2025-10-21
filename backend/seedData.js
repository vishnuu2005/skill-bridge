const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Connect to MongoDB
const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/village-skill-portal';
    await mongoose.connect(uri);
    console.log('MongoDB Connected');
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
};

// Models
const User = require('./models/user');
const Job = require('./models/job');
const Resource = require('./models/resource');

// Sample Indian Users with Skills
const sampleUsers = [
  {
    name: 'Rajesh Kumar',
    email: 'rajesh.kumar@example.com',
    password: 'password123',
    village: 'Bangalore',
    phone: '9876543210',
    skills: [
      { name: 'Tailoring', level: 'Expert', description: '15 years of experience in traditional and modern tailoring' },
      { name: 'Embroidery', level: 'Advanced', description: 'Specialized in Zardozi and mirror work' }
    ]
  },
  {
    name: 'Priya Sharma',
    email: 'priya.sharma@example.com',
    password: 'password123',
    village: 'Pune',
    phone: '9876543211',
    skills: [
      { name: 'Web Development', level: 'Advanced', description: 'React, Node.js, MongoDB' },
      { name: 'Graphic Design', level: 'Intermediate', description: 'Adobe Creative Suite, Figma' }
    ]
  },
  {
    name: 'Amit Patel',
    email: 'amit.patel@example.com',
    password: 'password123',
    village: 'Ahmedabad',
    phone: '9876543212',
    skills: [
      { name: 'Carpentry', level: 'Expert', description: 'Furniture making and wood carving' },
      { name: 'Interior Design', level: 'Intermediate', description: 'Home decoration and space planning' }
    ]
  },
  {
    name: 'Sneha Reddy',
    email: 'sneha.reddy@example.com',
    password: 'password123',
    village: 'Hyderabad',
    phone: '9876543213',
    skills: [
      { name: 'Teaching', level: 'Advanced', description: 'Mathematics and Science for grades 8-12' },
      { name: 'Content Writing', level: 'Advanced', description: 'Educational content and blog posts' }
    ]
  },
  {
    name: 'Vikram Singh',
    email: 'vikram.singh@example.com',
    password: 'password123',
    village: 'Jaipur',
    phone: '9876543214',
    skills: [
      { name: 'Plumbing', level: 'Expert', description: '12 years experience in residential and commercial plumbing' },
      { name: 'Electrical Work', level: 'Intermediate', description: 'Basic electrical installations and repairs' }
    ]
  },
  {
    name: 'Anita Desai',
    email: 'anita.desai@example.com',
    password: 'password123',
    village: 'Mumbai',
    phone: '9876543215',
    skills: [
      { name: 'Cooking', level: 'Expert', description: 'North Indian and Continental cuisine' },
      { name: 'Catering Management', level: 'Advanced', description: 'Event catering and menu planning' }
    ]
  },
  {
    name: 'Arjun Menon',
    email: 'arjun.menon@example.com',
    password: 'password123',
    village: 'Kochi',
    phone: '9876543216',
    skills: [
      { name: 'Photography', level: 'Advanced', description: 'Wedding and event photography' },
      { name: 'Video Editing', level: 'Intermediate', description: 'Adobe Premiere Pro, After Effects' }
    ]
  },
  {
    name: 'Deepika Iyer',
    email: 'deepika.iyer@example.com',
    password: 'password123',
    village: 'Chennai',
    phone: '9876543217',
    skills: [
      { name: 'Beautician', level: 'Expert', description: 'Makeup, hair styling, and skin care' },
      { name: 'Mehendi Art', level: 'Advanced', description: 'Traditional and modern henna designs' }
    ]
  }
];

// Sample Jobs
const sampleJobs = [
  {
    title: 'Tailor Needed for Boutique',
    description: 'Looking for experienced tailor for our boutique. Should be skilled in traditional and contemporary designs.',
    skills: ['Tailoring', 'Embroidery', 'Stitching'],
    village: 'Bangalore',
    salary: '₹15,000 - ₹25,000/month',
    phone: '9876543210',
    positions: 2
  },
  {
    title: 'Full Stack Web Developer',
    description: 'Seeking web developer for developing village management system. Remote work possible.',
    skills: ['Web Development', 'React', 'Node.js', 'MongoDB'],
    village: 'Pune',
    salary: '₹30,000 - ₹50,000/month',
    phone: '9876543211',
    positions: 1
  },
  {
    title: 'Carpenter for Furniture Workshop',
    description: 'Experienced carpenter needed for custom furniture making. Must have own tools.',
    skills: ['Carpentry', 'Wood Work', 'Furniture Making'],
    village: 'Ahmedabad',
    salary: '₹20,000 - ₹35,000/month',
    phone: '9876543212',
    positions: 3
  },
  {
    title: 'Math and Science Tutor',
    description: 'Looking for qualified teacher for home tuition (grades 8-12). Flexible timings.',
    skills: ['Teaching', 'Mathematics', 'Science'],
    village: 'Hyderabad',
    salary: '₹12,000 - ₹20,000/month',
    phone: '9876543213',
    positions: 2
  },
  {
    title: 'Plumber for Residential Projects',
    description: 'Skilled plumber needed for ongoing residential projects. Good pay and benefits.',
    skills: ['Plumbing', 'Pipe Fitting', 'Maintenance'],
    village: 'Jaipur',
    salary: '₹18,000 - ₹30,000/month',
    phone: '9876543214',
    positions: 4
  },
  {
    title: 'Chef for Restaurant',
    description: 'Experienced chef needed for new restaurant. North Indian and Continental cuisine.',
    skills: ['Cooking', 'Food Preparation', 'Menu Planning'],
    village: 'Mumbai',
    salary: '₹25,000 - ₹40,000/month',
    phone: '9876543215',
    positions: 2
  },
  {
    title: 'Wedding Photographer',
    description: 'Professional photographer needed for wedding season. Own equipment required.',
    skills: ['Photography', 'Video Editing', 'Camera Operation'],
    village: 'Kochi',
    salary: '₹20,000 - ₹45,000/month',
    phone: '9876543216',
    positions: 3
  },
  {
    title: 'Beautician for Salon',
    description: 'Skilled beautician for busy salon. All beauty services and mehendi required.',
    skills: ['Beauty Services', 'Makeup', 'Hair Styling', 'Mehendi'],
    village: 'Chennai',
    salary: '₹15,000 - ₹28,000/month',
    phone: '9876543217',
    positions: 2
  },
  {
    title: 'Electrician for Building Projects',
    description: 'Licensed electrician needed for residential building projects.',
    skills: ['Electrical Work', 'Wiring', 'Installation'],
    village: 'Delhi',
    salary: '₹22,000 - ₹38,000/month',
    phone: '9876543218',
    positions: 3
  },
  {
    title: 'Content Writer for Education Platform',
    description: 'Create educational content for online learning platform. Work from home.',
    skills: ['Content Writing', 'Teaching', 'English'],
    village: 'Remote',
    salary: '₹18,000 - ₹32,000/month',
    phone: '9876543219',
    positions: 5
  }
];

// Sample Education Resources
const sampleResources = [
  {
    title: 'Tailoring and Fashion Design Course',
    description: 'Learn professional tailoring techniques, pattern making, and fashion design basics.',
    type: 'Course',
    skillsCovered: ['Tailoring', 'Fashion Design', 'Pattern Making'],
    provider: 'National Institute of Fashion Technology',
    url: 'https://nift.ac.in',
    village: 'Bangalore'
  },
  {
    title: 'Full Stack Web Development Bootcamp',
    description: 'Comprehensive web development course covering HTML, CSS, JavaScript, React, Node.js, and MongoDB.',
    type: 'Course',
    skillsCovered: ['Web Development', 'React', 'Node.js', 'MongoDB'],
    provider: 'Coding School India',
    url: 'https://example.com/webdev',
    village: 'Pune'
  },
  {
    title: 'Carpentry Skills Workshop',
    description: 'Hands-on workshop for learning carpentry basics and furniture making.',
    type: 'Workshop',
    skillsCovered: ['Carpentry', 'Wood Work', 'Furniture Making'],
    provider: 'Skill India',
    url: 'https://skillindia.gov.in',
    village: 'Ahmedabad'
  },
  {
    title: 'Teacher Training Program',
    description: 'Professional development program for aspiring and practicing teachers.',
    type: 'Program',
    skillsCovered: ['Teaching', 'Pedagogy', 'Classroom Management'],
    provider: 'National Council for Teacher Education',
    url: 'https://ncte.gov.in',
    village: 'Hyderabad'
  },
  {
    title: 'Plumbing and Pipe Fitting Training',
    description: 'Certified training in residential and commercial plumbing systems.',
    type: 'Course',
    skillsCovered: ['Plumbing', 'Pipe Fitting', 'Installation'],
    provider: 'ITI Training Center',
    url: 'https://dgt.gov.in',
    village: 'Jaipur'
  },
  {
    title: 'Professional Cooking Classes',
    description: 'Learn Indian and Continental cuisine from expert chefs.',
    type: 'Course',
    skillsCovered: ['Cooking', 'Baking', 'Food Presentation'],
    provider: 'Culinary Academy of India',
    url: 'https://example.com/cooking',
    village: 'Mumbai'
  },
  {
    title: 'Photography and Videography Workshop',
    description: 'Master the art of professional photography and video production.',
    type: 'Workshop',
    skillsCovered: ['Photography', 'Video Editing', 'Lighting'],
    provider: 'Creative Arts Institute',
    url: 'https://example.com/photo',
    village: 'Kochi'
  },
  {
    title: 'Beauty and Wellness Certification',
    description: 'Comprehensive beauty course covering makeup, hair, skin care, and spa treatments.',
    type: 'Course',
    skillsCovered: ['Beauty Services', 'Makeup', 'Hair Styling', 'Spa Therapy'],
    provider: 'VLCC Institute',
    url: 'https://vlccinstitute.com',
    village: 'Chennai'
  },
  {
    title: 'Electrical Wiring and Installation Course',
    description: 'Learn electrical installation, wiring, and safety procedures.',
    type: 'Course',
    skillsCovered: ['Electrical Work', 'Wiring', 'Safety'],
    provider: 'Central Board of Secondary Education',
    url: 'https://cbse.gov.in',
    village: 'Delhi'
  },
  {
    title: 'Digital Marketing Workshop',
    description: 'Learn SEO, social media marketing, and content strategy for online businesses.',
    type: 'Workshop',
    skillsCovered: ['Digital Marketing', 'SEO', 'Social Media'],
    provider: 'Google Digital Garage',
    url: 'https://learndigital.withgoogle.com',
    village: 'Remote'
  }
];

// Seed function
const seedDatabase = async () => {
  try {
    await connectDB();

    // Clear existing data
    console.log('Clearing existing data...');
    await User.deleteMany({});
    await Job.deleteMany({});
    await Resource.deleteMany({});

    // Hash passwords and create users
    console.log('Creating users...');
    const hashedUsers = await Promise.all(
      sampleUsers.map(async (user) => {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(user.password, salt);
        return { ...user, password: hashedPassword };
      })
    );
    const createdUsers = await User.insertMany(hashedUsers);
    console.log(`✓ Created ${createdUsers.length} users`);

    // Create jobs
    console.log('Creating jobs...');
    const createdJobs = await Job.insertMany(sampleJobs);
    console.log(`✓ Created ${createdJobs.length} jobs`);

    // Create resources
    console.log('Creating education resources...');
    const createdResources = await Resource.insertMany(sampleResources);
    console.log(`✓ Created ${createdResources.length} education resources`);

    console.log('\n✓ Database seeded successfully!');
    console.log('\n📝 Sample User Credentials:');
    console.log('Email: rajesh.kumar@example.com');
    console.log('Password: password123');
    console.log('\n(All users have password: password123)');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

// Run seed
seedDatabase();

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Brain, 
  Target, 
  TrendingUp, 
  User, 
  LayoutDashboard, 
  MessageSquare, 
  Settings, 
  ChevronRight, 
  CheckCircle2, 
  Circle, 
  ArrowRight,
  Code,
  Database,
  Shield,
  Cpu,
  Palette,
  Briefcase,
  X,
  Send,
  Activity,
  BarChart3,
  Users,
  Award,
  FileText,
  Download,
  Eye,
  Plus,
  Trash2,
  Printer,
  BookOpen,
  Mic,
  Search,
  Filter,
  ExternalLink,
  PieChart
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  RadialLinearScale,
} from 'chart.js';
import { Bar, Pie, Radar, Line } from 'react-chartjs-2';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  RadialLinearScale
);

// --- Types & Constants ---

type CareerField = 'Software Development' | 'Data Science' | 'Cybersecurity' | 'Artificial Intelligence' | 'UI/UX Design' | 'Entrepreneurship';

interface StudentProfile {
  name: string;
  department: string;
  yearOfStudy: string;
  skills: string[];
  interests: string[];
  gpa: number;
  preferredField: CareerField;
  completedSteps: number[];
}

interface CareerData {
  title: string;
  description: string;
  requiredSkills: string[];
  roadmap: string[];
  internships: string[];
  demandLevel: number; // 1-100
  avgLPA: string;
}

interface JobOpportunity {
  id: string;
  company: string;
  role: string;
  lpa: string;
  location: string;
  field: CareerField;
  type: 'Full-time' | 'Internship';
}

interface ResumeData {
  personalInfo: {
    name: string;
    email: string;
    phone: string;
    linkedin: string;
    summary: string;
  };
  education: {
    school: string;
    degree: string;
    year: string;
    gpa: string;
  }[];
  experience: {
    company: string;
    role: string;
    duration: string;
    description: string;
  }[];
  projects: {
    title: string;
    technologies: string;
    description: string;
  }[];
  skills: string[];
  certifications: string[];
  languages: string[];
  theme: 'modern' | 'classic' | 'minimal';
}

interface Resource {
  title: string;
  provider: string;
  type: 'Course' | 'Video' | 'Article' | 'Tool';
  link: string;
  category: CareerField;
}

const RESOURCES: Resource[] = [
  { title: 'Deep Learning Specialization', provider: 'Coursera', type: 'Course', link: 'https://www.coursera.org/specializations/deep-learning', category: 'Artificial Intelligence' },
  { title: 'React Documentation', provider: 'Meta', type: 'Tool', link: 'https://react.dev', category: 'Software Development' },
  { title: 'OWASP Top 10 Guide', provider: 'OWASP', type: 'Article', link: 'https://owasp.org/www-project-top-ten/', category: 'Cybersecurity' },
  { title: 'Data Science with Python', provider: 'DataCamp', type: 'Course', link: 'https://www.datacamp.com/tracks/data-scientist-with-python', category: 'Data Science' },
  { title: 'Figma Mastery', provider: 'YouTube', type: 'Video', link: 'https://www.youtube.com/results?search_query=figma+tutorial', category: 'UI/UX Design' },
  { title: 'System Design Interview', provider: 'GitHub', type: 'Article', link: 'https://github.com/donnemartin/system-design-primer', category: 'Software Development' },
  { title: 'Machine Learning Crash Course', provider: 'Google', type: 'Course', link: 'https://developers.google.com/machine-learning/crash-course', category: 'Artificial Intelligence' },
  { title: 'Ethical Hacking for Beginners', provider: 'Udemy', type: 'Course', link: 'https://www.udemy.com/topic/ethical-hacking/', category: 'Cybersecurity' },
];

interface InterviewQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number; // Index of correct option
  explanation: string;
}

const INTERVIEW_QUESTIONS: InterviewQuestion[] = [
  {
    id: 1,
    question: "What is the time complexity of searching for an element in a balanced Binary Search Tree (BST)?",
    options: ["O(n)", "O(log n)", "O(n log n)", "O(1)"],
    correctAnswer: 1,
    explanation: "In a balanced BST, each comparison eliminates half of the remaining nodes, leading to logarithmic time complexity."
  },
  {
    id: 2,
    question: "Which data structure follows the Last-In-First-Out (LIFO) principle?",
    options: ["Queue", "Linked List", "Stack", "Array"],
    correctAnswer: 2,
    explanation: "A Stack follows LIFO, where the last element added is the first one to be removed."
  },
  {
    id: 3,
    question: "What does the 'A' in ACID properties of a database stand for?",
    options: ["Availability", "Atomicity", "Accuracy", "Authority"],
    correctAnswer: 1,
    explanation: "Atomicity ensures that a transaction is treated as a single unit, which either completely succeeds or completely fails."
  },
  {
    id: 4,
    question: "In React, which hook is primarily used for handling side effects?",
    options: ["useState", "useContext", "useEffect", "useReducer"],
    correctAnswer: 2,
    explanation: "useEffect is used for side effects like data fetching, subscriptions, or manually changing the DOM."
  },
  {
    id: 5,
    question: "What is the main advantage of a Hash Map?",
    options: ["Ordered storage", "Memory efficiency", "Constant time average lookup", "Ease of implementation"],
    correctAnswer: 2,
    explanation: "Hash Maps provide O(1) average time complexity for insertion, deletion, and lookup operations."
  },
  {
    id: 6,
    question: "Which protocol is used for secure data transmission over the web?",
    options: ["HTTP", "FTP", "HTTPS", "SMTP"],
    correctAnswer: 2,
    explanation: "HTTPS (Hypertext Transfer Protocol Secure) encrypts the data sent between the browser and the server."
  },
  {
    id: 7,
    question: "What is a 'deadlock' in an Operating System?",
    options: ["A process that runs forever", "A state where processes are waiting for each other to release resources", "A system crash", "A memory leak"],
    correctAnswer: 1,
    explanation: "A deadlock occurs when two or more processes are unable to proceed because each is waiting for the other to release a resource."
  },
  {
    id: 8,
    question: "What is the primary purpose of Docker?",
    options: ["Version control", "Containerization", "Database management", "Code editing"],
    correctAnswer: 1,
    explanation: "Docker allows developers to package applications into containers, ensuring consistency across different environments."
  },
  {
    id: 9,
    question: "Which sorting algorithm has a worst-case time complexity of O(n log n)?",
    options: ["Bubble Sort", "Quick Sort", "Merge Sort", "Selection Sort"],
    correctAnswer: 2,
    explanation: "Merge Sort consistently performs at O(n log n) even in the worst case, unlike Quick Sort which can degrade to O(n²)."
  },
  {
    id: 10,
    question: "What is 'Polymorphism' in Object-Oriented Programming?",
    options: ["The ability of an object to take on many forms", "Hiding internal details", "Inheriting properties from a parent", "Creating multiple instances of a class"],
    correctAnswer: 0,
    explanation: "Polymorphism allows objects of different classes to be treated as objects of a common superclass."
  },
  {
    id: 11,
    question: "What is the role of a Load Balancer?",
    options: ["To store user data", "To distribute incoming network traffic across multiple servers", "To compile source code", "To encrypt database backups"],
    correctAnswer: 1,
    explanation: "A Load Balancer improves application availability and responsiveness by distributing traffic across several servers."
  },
  {
    id: 12,
    question: "What does 'Big O' notation represent in algorithm analysis?",
    options: ["The exact number of operations", "The upper bound of the runtime or space requirements", "The average case performance", "The code quality score"],
    correctAnswer: 1,
    explanation: "Big O notation describes the worst-case scenario or the upper limit of an algorithm's growth rate."
  },
  {
    id: 13,
    question: "Which of the following is a popular NoSQL database?",
    options: ["MySQL", "PostgreSQL", "MongoDB", "Oracle"],
    correctAnswer: 2,
    explanation: "MongoDB is a document-oriented NoSQL database that stores data in JSON-like format."
  },
  {
    id: 14,
    question: "What is the 'Virtual DOM' in the context of React?",
    options: ["A direct copy of the browser's DOM", "A lightweight, in-memory representation of the real DOM", "A server-side rendering engine", "A CSS-in-JS library"],
    correctAnswer: 1,
    explanation: "React uses the Virtual DOM to efficiently update the UI by only re-rendering parts that have changed."
  },
  {
    id: 15,
    question: "What is 'Dependency Injection'?",
    options: ["A security vulnerability", "A design pattern used to implement IoC (Inversion of Control)", "A method for database indexing", "A way to inject CSS into HTML"],
    correctAnswer: 1,
    explanation: "Dependency Injection allows a class to receive its dependencies from an external source rather than creating them itself."
  },
  {
    id: 16,
    question: "What is the primary function of Git?",
    options: ["Web hosting", "Distributed version control", "Project management", "Cloud storage"],
    correctAnswer: 1,
    explanation: "Git tracks changes in source code during software development, allowing multiple developers to collaborate."
  },
  {
    id: 17,
    question: "What is 'Responsive Web Design'?",
    options: ["Websites that load very fast", "Websites that adapt their layout to different screen sizes", "Websites with high interactivity", "Websites that are accessible to disabled users"],
    correctAnswer: 1,
    explanation: "Responsive design ensures that a website looks good and functions well on desktops, tablets, and smartphones."
  },
  {
    id: 18,
    question: "What is the core idea behind 'Machine Learning'?",
    options: ["Hardcoding every possible scenario", "Teaching computers to learn from data without being explicitly programmed", "Manually entering data into a database", "Designing faster computer hardware"],
    correctAnswer: 1,
    explanation: "Machine Learning uses statistical techniques to give computer systems the ability to 'learn' from data."
  },
  {
    id: 19,
    question: "What is 'Cloud Computing'?",
    options: ["Storing data on local hard drives", "On-demand delivery of computing power, database, and storage over the internet", "Using physical servers in your office", "Increasing the speed of your internet connection"],
    correctAnswer: 1,
    explanation: "Cloud computing provides access to servers, storage, and applications over the internet, typically on a pay-as-you-go basis."
  },
  {
    id: 20,
    question: "What is a 'REST API'?",
    options: ["A programming language for web development", "An architectural style for designing networked applications", "A type of relational database", "A software testing framework"],
    correctAnswer: 1,
    explanation: "REST (Representational State Transfer) is a set of constraints for creating web services that are scalable and easy to use."
  }
];

const JOB_OPPORTUNITIES: JobOpportunity[] = [
  { id: '1', company: 'Google', role: 'Junior Software Engineer', lpa: '18-24 LPA', location: 'Bangalore', field: 'Software Development', type: 'Full-time' },
  { id: '2', company: 'Microsoft', role: 'Data Scientist I', lpa: '15-20 LPA', location: 'Hyderabad', field: 'Data Science', type: 'Full-time' },
  { id: '3', company: 'Amazon', role: 'SDE Intern', lpa: '80k/mo (12 LPA equiv)', location: 'Chennai', field: 'Software Development', type: 'Internship' },
  { id: '4', company: 'NVIDIA', role: 'AI Research Intern', lpa: '1.2L/mo (18 LPA equiv)', location: 'Pune', field: 'Artificial Intelligence', type: 'Internship' },
  { id: '5', company: 'CrowdStrike', role: 'Cybersecurity Analyst', lpa: '12-16 LPA', location: 'Remote', field: 'Cybersecurity', type: 'Full-time' },
  { id: '6', company: 'Zomato', role: 'Product Designer', lpa: '10-14 LPA', location: 'Gurgaon', field: 'UI/UX Design', type: 'Full-time' },
  { id: '7', company: 'Flipkart', role: 'Machine Learning Engineer', lpa: '16-22 LPA', location: 'Bangalore', field: 'Artificial Intelligence', type: 'Full-time' },
  { id: '8', company: 'Adobe', role: 'UX Research Intern', lpa: '60k/mo (9 LPA equiv)', location: 'Noida', field: 'UI/UX Design', type: 'Internship' },
];

const CAREER_DATABASE: Record<CareerField, CareerData> = {
  'Software Development': {
    title: 'Software Developer',
    description: 'Build applications and systems that solve real-world problems.',
    requiredSkills: ['React', 'Node.js', 'Python', 'Data Structures', 'Git'],
    roadmap: [
      'Learn programming basics (JS/Python)',
      'Master Web Technologies (HTML/CSS/JS)',
      'Build 3 full-stack projects',
      'Apply for Junior Dev Internships',
      'Secure Job Placement'
    ],
    internships: ['Google - Openings: 12', 'Microsoft - Openings: 8', 'Meta - Openings: 5'],
    demandLevel: 95,
    avgLPA: '8-25 LPA'
  },
  'Data Science': {
    title: 'Data Scientist',
    description: 'Extract insights from data to drive decision-making.',
    requiredSkills: ['Python', 'SQL', 'Statistics', 'Machine Learning', 'Data Visualization'],
    roadmap: [
      'Learn Python and Statistics',
      'Master SQL and Data Wrangling',
      'Build Machine Learning Models',
      'Contribute to Kaggle Competitions',
      'Apply for Data Analyst Internships'
    ],
    internships: ['Amazon - Openings: 10', 'IBM - Openings: 6', 'Spotify - Openings: 4'],
    demandLevel: 90,
    avgLPA: '10-30 LPA'
  },
  'Cybersecurity': {
    title: 'Cybersecurity Analyst',
    description: 'Protect systems and networks from digital attacks.',
    requiredSkills: ['Networking', 'Linux', 'Ethical Hacking', 'Cloud Security', 'Cryptography'],
    roadmap: [
      'Understand Networking Fundamentals',
      'Learn Linux Administration',
      'Get CompTIA Security+ Certification',
      'Practice on TryHackMe/HackTheBox',
      'Apply for SOC Analyst Internships'
    ],
    internships: ['Cisco - Openings: 7', 'CrowdStrike - Openings: 5', 'Palo Alto Networks - Openings: 3'],
    demandLevel: 88,
    avgLPA: '7-20 LPA'
  },
  'Artificial Intelligence': {
    title: 'AI Engineer',
    description: 'Design and implement AI models and neural networks.',
    requiredSkills: ['PyTorch', 'Linear Algebra', 'Deep Learning', 'NLP', 'Computer Vision'],
    roadmap: [
      'Master Calculus and Linear Algebra',
      'Learn Neural Network Architectures',
      'Implement Research Papers',
      'Build AI-powered Applications',
      'Apply for AI Research Internships'
    ],
    internships: ['OpenAI - Openings: 3', 'NVIDIA - Openings: 15', 'DeepMind - Openings: 2'],
    demandLevel: 98,
    avgLPA: '12-45 LPA'
  },
  'UI/UX Design': {
    title: 'UI/UX Designer',
    description: 'Create intuitive and beautiful user experiences.',
    requiredSkills: ['Figma', 'User Research', 'Prototyping', 'Typography', 'Visual Design'],
    roadmap: [
      'Learn Design Principles',
      'Master Figma and Adobe XD',
      'Conduct User Research Case Studies',
      'Build a Design Portfolio',
      'Apply for Product Design Internships'
    ],
    internships: ['Adobe - Openings: 9', 'Airbnb - Openings: 4', 'Apple - Openings: 6'],
    demandLevel: 85,
    avgLPA: '6-18 LPA'
  },
  'Entrepreneurship': {
    title: 'Tech Entrepreneur',
    description: 'Build and scale your own technology startup.',
    requiredSkills: ['Product Management', 'Marketing', 'Financial Modeling', 'Leadership', 'Sales'],
    roadmap: [
      'Identify a Market Problem',
      'Build a Minimum Viable Product (MVP)',
      'Join a Startup Incubator',
      'Pitch to Angel Investors',
      'Scale the Business'
    ],
    internships: ['Y Combinator - Openings: 20', 'Sequoia Capital - Openings: 5', 'Techstars - Openings: 12'],
    demandLevel: 80,
    avgLPA: 'Variable (Equity based)'
  }
};

// --- Components ---

const ParticleBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let particles: any[] = [];
    const particleCount = 100;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    class Particle {
      x: number;
      y: number;
      size: number;
      speedY: number;
      opacity: number;

      constructor() {
        this.x = Math.random() * canvas!.width;
        this.y = canvas!.height + Math.random() * 100;
        this.size = Math.random() * 3 + 1;
        this.speedY = Math.random() * 1 + 0.5;
        this.opacity = Math.random() * 0.5 + 0.2;
      }

      update() {
        this.y -= this.speedY;
        if (this.y < -10) {
          this.y = canvas!.height + 10;
          this.x = Math.random() * canvas!.width;
        }
      }

      draw() {
        ctx!.fillStyle = `rgba(0, 242, 255, ${this.opacity})`;
        ctx!.shadowBlur = 10;
        ctx!.shadowColor = '#00f2ff';
        ctx!.beginPath();
        ctx!.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx!.fill();
      }
    }

    const init = () => {
      particles = [];
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.update();
        p.draw();
      });
      requestAnimationFrame(animate);
    };

    window.addEventListener('resize', resize);
    resize();
    init();
    animate();

    return () => window.removeEventListener('resize', resize);
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" />;
};

const Certificate = ({ name, score, field }: { name: string; score: number; field: string }) => {
  return (
    <div id="certificate-preview" className="bg-white p-12 text-slate-900 rounded-none border-[16px] border-double border-slate-900 relative overflow-hidden max-w-4xl mx-auto my-8 shadow-2xl">
      <div className="absolute top-0 left-0 w-32 h-32 border-t-8 border-l-8 border-slate-900" />
      <div className="absolute top-0 right-0 w-32 h-32 border-t-8 border-r-8 border-slate-900" />
      <div className="absolute bottom-0 left-0 w-32 h-32 border-b-8 border-l-8 border-slate-900" />
      <div className="absolute bottom-0 right-0 w-32 h-32 border-b-8 border-r-8 border-slate-900" />
      
      <div className="text-center space-y-8 relative z-10">
        <div className="flex justify-center mb-4">
          <Award className="w-20 h-20 text-slate-900" />
        </div>
        
        <h1 className="text-5xl font-serif font-black uppercase tracking-[0.2em] border-b-4 border-slate-900 pb-4 inline-block">Certificate of Achievement</h1>
        
        <div className="space-y-4">
          <p className="text-xl font-serif italic">This is to certify that</p>
          <h2 className="text-4xl font-bold underline decoration-2 underline-offset-8">{name}</h2>
          <p className="text-xl font-serif italic">has successfully completed the</p>
          <h3 className="text-3xl font-black uppercase tracking-widest">{field} Mock Interview</h3>
        </div>
        
        <div className="py-8 space-y-2">
          <p className="text-lg font-bold">Score Achieved</p>
          <div className="text-6xl font-black text-slate-900">{score}/100</div>
        </div>
        
        <div className="flex justify-between items-end pt-12">
          <div className="text-center w-48">
            <div className="border-b-2 border-slate-900 mb-2" />
            <p className="text-xs font-bold uppercase tracking-widest">AI Mentor Signature</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-24 h-24 bg-slate-900 rounded-full flex items-center justify-center text-white font-black text-2xl mb-2">SE</div>
            <p className="text-[10px] font-bold uppercase tracking-widest">Verified by SmartEdge</p>
          </div>
          <div className="text-center w-48">
            <div className="border-b-2 border-slate-900 mb-2" />
            <p className="text-xs font-bold uppercase tracking-widest">Date of Issue</p>
            <p className="text-xs">{new Date().toLocaleDateString()}</p>
          </div>
        </div>
      </div>
      
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03] pointer-events-none">
        <Award className="w-[600px] h-[600px]" />
      </div>
    </div>
  );
};

import { GoogleGenAI } from "@google/genai";

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Hello! I'm your AI Career Assistant. How can I help you today?", isBot: true }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    const userMessage = input;
    const newMessages = [...messages, { text: userMessage, isBot: false }];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: userMessage,
        config: {
          systemInstruction: "You are a helpful AI Career Assistant for a student placement portal called SmartEdge. Provide concise, encouraging, and accurate career advice. If asked about technical topics, explain them clearly.",
        }
      });
      
      const botResponse = response.text || "I'm sorry, I'm having trouble processing that right now.";
      setMessages([...newMessages, { text: botResponse, isBot: true }]);
    } catch (error) {
      console.error("Gemini Error:", error);
      setMessages([...newMessages, { text: "I'm having trouble connecting to my brain right now. Please try again later.", isBot: true }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="glass-card w-80 h-96 max-h-[calc(100dvh-6rem)] mb-4 flex flex-col p-0 overflow-hidden border-cyan-500/30"
          >
            <div className="bg-cyan-500/20 p-4 border-b border-white/10 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-cyan-400" />
                <span className="font-bold text-cyan-400">Career AI</span>
              </div>
              <button onClick={() => setIsOpen(false)}><X className="w-5 h-5" /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.isBot ? 'justify-start' : 'justify-end'}`}>
                  <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${m.isBot ? 'bg-white/10 rounded-tl-none' : 'bg-cyan-500/20 rounded-tr-none border border-cyan-500/30'}`}>
                    {m.text}
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 border-t border-white/10 flex gap-2">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask me anything..."
                className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-cyan-500/50"
              />
              <button onClick={handleSend} className="bg-cyan-500 hover:bg-cyan-400 p-2 rounded-lg transition-colors">
                <Send className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-cyan-500 rounded-full flex items-center justify-center shadow-lg shadow-cyan-500/50 hover:scale-110 transition-transform"
      >
        <MessageSquare className="w-6 h-6 text-white" />
      </button>
    </div>
  );
};

export default function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'profile' | 'dashboard' | 'resume' | 'resources' | 'interview' | 'admin'>('home');
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [learnedSkills, setLearnedSkills] = useState<string[]>([]);
  const [mockStudents, setMockStudents] = useState([
    { id: 1, name: 'Alex Johnson', dept: 'CS', gpa: 9.2, path: 'AI', status: 'Placed' },
    { id: 2, name: 'Sarah Williams', dept: 'IT', gpa: 8.5, path: 'Cybersecurity', status: 'Interning' },
    { id: 3, name: 'Michael Chen', dept: 'ECE', gpa: 7.8, path: 'Software Dev', status: 'Searching' },
    { id: 4, name: 'Priya Sharma', dept: 'CS', gpa: 9.5, path: 'Data Science', status: 'Placed' },
    { id: 5, name: 'David Miller', dept: 'ME', gpa: 8.2, path: 'UI/UX', status: 'Interning' },
  ]);
  const [stats, setStats] = useState({
    totalStudents: 1240,
    mostRecommended: 'Artificial Intelligence',
    skillGapAvg: 45,
    placementRate: 82
  });
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const [showChallengeModal, setShowChallengeModal] = useState(false);
  const [challengeAnswer, setChallengeAnswer] = useState('');
  const [challengeSubmitted, setChallengeSubmitted] = useState(false);
  const [nameHistory, setNameHistory] = useState<{name: string, timestamp: string}[]>([]);
  const [showStudyGuide, setShowStudyGuide] = useState(false);
  
  // Interview States
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [interviewScore, setInterviewScore] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [interviewFinished, setInterviewFinished] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const downloadAsPDF = async (elementId: string, filename: string) => {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    setIsDownloading(true);
    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        windowWidth: element.scrollWidth,
        windowHeight: element.scrollHeight
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: canvas.width > canvas.height ? 'landscape' : 'portrait',
        unit: 'px',
        format: [canvas.width, canvas.height]
      });
      
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      pdf.save(`${filename}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      // Fallback to print if html2canvas fails
      window.print();
    } finally {
      setIsDownloading(false);
    }
  };

  const handleOptionSelect = (index: number) => {
    if (showExplanation) return;
    setSelectedOption(index);
    const correct = index === INTERVIEW_QUESTIONS[currentQuestionIndex].correctAnswer;
    setIsCorrect(correct);
    if (correct) {
      setInterviewScore(prev => prev + 5);
    }
    setShowExplanation(true);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < INTERVIEW_QUESTIONS.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedOption(null);
      setShowExplanation(false);
      setIsCorrect(null);
    } else {
      setInterviewFinished(true);
    }
  };

  const resetInterview = () => {
    setCurrentQuestionIndex(0);
    setInterviewScore(0);
    setShowExplanation(false);
    setSelectedOption(null);
    setInterviewFinished(false);
    setIsCorrect(null);
  };

  const [resumeData, setResumeData] = useState<ResumeData>({
    personalInfo: {
      name: '',
      email: '',
      phone: '',
      linkedin: '',
      summary: ''
    },
    education: [],
    experience: [{
      company: 'Tech Solutions Corp',
      role: 'Software Intern',
      duration: '2025 - Present',
      description: 'Developed responsive UI components using React and Tailwind CSS. Collaborated with senior devs on backend API integration.'
    }],
    projects: [{
      title: 'AI Path Finder',
      technologies: 'Python, TensorFlow, React',
      description: 'Built a career recommendation engine using machine learning to analyze student skills and market trends.'
    }],
    skills: [],
    certifications: ['AWS Certified Cloud Practitioner', 'Google Data Analytics Professional'],
    languages: ['English (Fluent)', 'Hindi (Native)', 'German (Basic)'],
    theme: 'modern'
  });

  useEffect(() => {
    if (profile) {
      setResumeData(prev => ({
        ...prev,
        personalInfo: {
          ...prev.personalInfo,
          name: profile.name,
        },
        skills: [...profile.skills, ...learnedSkills],
        education: [{
          school: 'Your University Name',
          degree: profile.department,
          year: profile.yearOfStudy,
          gpa: profile.gpa.toString()
        }]
      }));
    }
  }, [profile, learnedSkills]);

  const updateResumePersonal = (field: keyof ResumeData['personalInfo'], value: string) => {
    setResumeData(prev => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, [field]: value }
    }));
  };

  const addResumeItem = (section: 'experience' | 'projects' | 'education' | 'certifications' | 'languages') => {
    setResumeData(prev => {
      const newData = { ...prev };
      if (section === 'experience') {
        newData.experience = [...prev.experience, { company: '', role: '', duration: '', description: '' }];
      } else if (section === 'projects') {
        newData.projects = [...prev.projects, { title: '', technologies: '', description: '' }];
      } else if (section === 'education') {
        newData.education = [...prev.education, { school: '', degree: '', year: '', gpa: '' }];
      } else if (section === 'certifications') {
        newData.certifications = [...prev.certifications, ''];
      } else if (section === 'languages') {
        newData.languages = [...prev.languages, ''];
      }
      return newData;
    });
  };

  const removeResumeItem = (section: 'experience' | 'projects' | 'education' | 'certifications' | 'languages', index: number) => {
    setResumeData(prev => {
      const newData = { ...prev };
      if (section === 'experience') newData.experience = prev.experience.filter((_, i) => i !== index);
      if (section === 'projects') newData.projects = prev.projects.filter((_, i) => i !== index);
      if (section === 'education') newData.education = prev.education.filter((_, i) => i !== index);
      if (section === 'certifications') newData.certifications = prev.certifications.filter((_, i) => i !== index);
      if (section === 'languages') newData.languages = prev.languages.filter((_, i) => i !== index);
      return newData;
    });
  };

  const updateResumeItem = (section: 'experience' | 'projects' | 'education', index: number, field: string, value: string) => {
    setResumeData(prev => {
      const newData = { ...prev };
      if (section === 'experience') {
        const items = [...prev.experience];
        items[index] = { ...items[index], [field]: value };
        newData.experience = items;
      } else if (section === 'projects') {
        const items = [...prev.projects];
        items[index] = { ...items[index], [field]: value };
        newData.projects = items;
      } else if (section === 'education') {
        const items = [...prev.education];
        items[index] = { ...items[index], [field]: value };
        newData.education = items;
      }
      return newData;
    });
  };

  const updateResumeList = (section: 'certifications' | 'languages', index: number, value: string) => {
    setResumeData(prev => {
      const newData = { ...prev };
      if (section === 'certifications') {
        const items = [...prev.certifications];
        items[index] = value;
        newData.certifications = items;
      } else if (section === 'languages') {
        const items = [...prev.languages];
        items[index] = value;
        newData.languages = items;
      }
      return newData;
    });
  };

  useEffect(() => {
    const savedProfile = localStorage.getItem('career_profile');
    if (savedProfile) {
      const parsed = JSON.parse(savedProfile);
      // Ensure completedSteps exists for legacy profiles
      if (!parsed.completedSteps) parsed.completedSteps = [];
      setProfile(parsed);
      setActiveTab('dashboard');
    }
    const savedSkills = localStorage.getItem('learned_skills');
    if (savedSkills) setLearnedSkills(JSON.parse(savedSkills));
    
    const savedHistory = localStorage.getItem('name_history');
    if (savedHistory) setNameHistory(JSON.parse(savedHistory));
  }, []);

  const handleProfileSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newProfile: StudentProfile = {
      name: formData.get('name') as string,
      department: formData.get('department') as string,
      yearOfStudy: formData.get('yearOfStudy') as string,
      skills: (formData.get('skills') as string).split(',').map(s => s.trim()).filter(Boolean),
      interests: (formData.get('interests') as string).split(',').map(s => s.trim()).filter(Boolean),
      gpa: parseFloat(formData.get('gpa') as string),
      preferredField: formData.get('preferredField') as CareerField,
      completedSteps: [],
    };
    setProfile(newProfile);
    
    // Update name history
    const historyItem = { name: newProfile.name, timestamp: new Date().toLocaleString() };
    const updatedHistory = [historyItem, ...nameHistory].slice(0, 10); // Keep last 10
    setNameHistory(updatedHistory);
    localStorage.setItem('name_history', JSON.stringify(updatedHistory));

    localStorage.setItem('career_profile', JSON.stringify(newProfile));
    setActiveTab('dashboard');
  };

  const toggleSkill = (skill: string) => {
    const newSkills = learnedSkills.includes(skill)
      ? learnedSkills.filter(s => s !== skill)
      : [...learnedSkills, skill];
    setLearnedSkills(newSkills);
    localStorage.setItem('learned_skills', JSON.stringify(newSkills));
  };

  const toggleStep = (index: number) => {
    if (!profile) return;
    const currentSteps = profile.completedSteps || [];
    const newSteps = currentSteps.includes(index)
      ? currentSteps.filter(i => i !== index)
      : [...currentSteps, index];
    const updatedProfile = { ...profile, completedSteps: newSteps };
    setProfile(updatedProfile);
    localStorage.setItem('career_profile', JSON.stringify(updatedProfile));
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPassword === 'admin123') {
      setIsAdminAuthenticated(true);
      setPasswordError(false);
    } else {
      setPasswordError(true);
    }
  };

  const recommendation = useMemo(() => {
    if (!profile) return null;
    // Simple logic: prefer preferredField but check skills
    return CAREER_DATABASE[profile.preferredField];
  }, [profile]);

  const readinessPercentage = useMemo(() => {
    if (!recommendation) return 0;
    const total = recommendation.requiredSkills.length;
    const learned = recommendation.requiredSkills.filter(s => 
      profile?.skills.includes(s) || learnedSkills.includes(s)
    ).length;
    return Math.round((learned / total) * 100);
  }, [recommendation, profile, learnedSkills]);

  return (
    <div className="min-h-[100dvh] font-sans bg-[#050505] text-white selection:bg-cyan-500/30">
      <ParticleBackground />
      
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-40 glass border-b border-white/10 w-full">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setActiveTab('home')}>
            <div className="w-10 h-10 bg-cyan-500 rounded-lg flex items-center justify-center neon-border">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tighter neon-text">CAREERPATH AI</span>
          </div>
          
          <div className="flex items-center gap-4 md:gap-8">
            <button 
              onClick={() => setActiveTab('home')}
              className={`text-xs md:text-sm font-medium transition-colors ${activeTab === 'home' ? 'text-cyan-400' : 'text-white/60 hover:text-white'}`}
            >
              Home
            </button>
            <button 
              onClick={() => setActiveTab(profile ? 'dashboard' : 'profile')}
              className={`text-xs md:text-sm font-medium transition-colors ${activeTab === 'dashboard' || activeTab === 'profile' ? 'text-cyan-400' : 'text-white/60 hover:text-white'}`}
            >
              Dashboard
            </button>
            <button 
              onClick={() => setActiveTab('resume')}
              className={`text-xs md:text-sm font-medium transition-colors ${activeTab === 'resume' ? 'text-cyan-400' : 'text-white/60 hover:text-white'}`}
            >
              Resume
            </button>
            <button 
              onClick={() => setActiveTab('resources')}
              className={`text-xs md:text-sm font-medium transition-colors ${activeTab === 'resources' ? 'text-cyan-400' : 'text-white/60 hover:text-white'}`}
            >
              Resources
            </button>
            <button 
              onClick={() => setActiveTab('interview')}
              className={`text-xs md:text-sm font-medium transition-colors ${activeTab === 'interview' ? 'text-cyan-400' : 'text-white/60 hover:text-white'}`}
            >
              Interview
            </button>
            <button 
              onClick={() => setActiveTab('admin')}
              className={`text-xs md:text-sm font-medium transition-colors ${activeTab === 'admin' ? 'text-cyan-400' : 'text-white/60 hover:text-white'}`}
            >
              Admin
            </button>
          </div>

          <button 
            onClick={() => setActiveTab('profile')}
            className="bg-white/10 hover:bg-white/20 px-5 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2"
          >
            <User className="w-4 h-4" />
            {profile ? profile.name : 'Get Started'}
          </button>
        </div>
      </nav>

      <main className="pt-32 pb-20 px-6 max-w-7xl mx-auto relative z-10">
        <AnimatePresence mode="wait">
          {activeTab === 'home' && (
            <motion.div 
              key="home"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-20"
            >
              {/* Hero Section */}
              <div className="text-center space-y-6 max-w-3xl mx-auto">
                <motion.div 
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  className="inline-block px-4 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold uppercase tracking-widest mb-4"
                >
                  AI-Powered Guidance
                </motion.div>
                <h1 className="text-4xl sm:text-6xl md:text-8xl font-bold tracking-tight leading-none">
                  Discover Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">Future</span> Path
                </h1>
                <p className="text-xl text-white/60 font-light max-w-2xl mx-auto">
                  CareerPath AI uses advanced algorithms to analyze your skills and interests, providing a personalized roadmap to your dream career.
                </p>
                <div className="flex flex-wrap justify-center gap-4 pt-6">
                  <button 
                    onClick={() => setActiveTab('profile')}
                    className="px-8 py-4 bg-cyan-500 hover:bg-cyan-400 rounded-xl font-bold transition-all flex items-center gap-2 neon-border"
                  >
                    Start Your Journey <ArrowRight className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => setActiveTab('admin')}
                    className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl font-bold transition-all"
                  >
                    Admin Dashboard
                  </button>
                </div>
              </div>

              {/* Feature Cards */}
              <div className="grid md:grid-cols-3 gap-6">
                {[
                  { icon: Target, title: 'Smart Recommendations', desc: 'AI-driven career matching based on your unique profile.' },
                  { icon: TrendingUp, title: 'Skill Gap Analysis', desc: 'Identify exactly what you need to learn to reach your goals.' },
                  { icon: LayoutDashboard, title: 'Interactive Roadmap', desc: 'Step-by-step guidance from learning to job placement.' }
                ].map((f, i) => (
                  <div key={i} className="glass-card group">
                    <div className="w-12 h-12 bg-cyan-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-cyan-500/20 transition-colors">
                      <f.icon className="w-6 h-6 text-cyan-400" />
                    </div>
                    <h3 className="text-xl font-bold mb-3">{f.title}</h3>
                    <p className="text-white/50 font-light leading-relaxed">{f.desc}</p>
                  </div>
                ))}
              </div>

              {/* Daily Challenge Section */}
              <div className="glass-card bg-gradient-to-br from-cyan-500/10 to-purple-500/10 border-white/10 overflow-hidden relative">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                  <Cpu className="w-48 h-48" />
                </div>
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                  <div className="space-y-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-500/20 text-yellow-400 text-[10px] font-bold uppercase tracking-widest">
                      <Activity className="w-3 h-3" /> Daily Challenge
                    </div>
                    <h3 className="text-3xl font-bold">Today's Tech Challenge</h3>
                    <p className="text-white/60 max-w-xl">
                      "Explain the concept of 'Event Delegation' in JavaScript and provide a code example where it would be beneficial."
                    </p>
                    <div className="flex gap-4">
                      <button 
                        onClick={() => setShowChallengeModal(true)}
                        className="px-6 py-2 bg-cyan-500 hover:bg-cyan-400 rounded-lg text-sm font-bold transition-all"
                      >
                        Submit Answer
                      </button>
                      <button className="px-6 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm font-bold transition-all">View Leaderboard</button>
                    </div>
                  </div>
                  <div className="text-center md:text-right">
                    <div className="text-4xl font-bold text-cyan-400">250 XP</div>
                    <div className="text-xs font-bold text-white/40 uppercase tracking-widest mt-1">Reward for completion</div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'profile' && (
            <motion.div 
              key="profile"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="max-w-2xl mx-auto"
            >
              <div className="glass-card p-8 border-cyan-500/20">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 bg-cyan-500/20 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-cyan-400" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">Student Profile</h2>
                    <p className="text-white/50 text-sm">Tell us about yourself to get started.</p>
                  </div>
                </div>

                <form onSubmit={handleProfileSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-white/40">Full Name</label>
                      <input required name="name" type="text" placeholder="John Doe" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-cyan-500/50 transition-colors" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-white/40">Department</label>
                      <input required name="department" type="text" placeholder="Computer Science" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-cyan-500/50 transition-colors" />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-white/40">Year of Study</label>
                      <select required name="yearOfStudy" className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-cyan-500/50 transition-colors">
                        <option value="1st Year">1st Year</option>
                        <option value="2nd Year">2nd Year</option>
                        <option value="3rd Year">3rd Year</option>
                        <option value="4th Year">4th Year</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-white/40">Current CGPA (Out of 10)</label>
                      <input required name="gpa" type="number" step="0.1" max="10.0" placeholder="8.5" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-cyan-500/50 transition-colors" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-white/40">Skills (Comma separated)</label>
                    <input required name="skills" type="text" placeholder="Python, Java, Design..." className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-cyan-500/50 transition-colors" />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-white/40">Interests (Comma separated)</label>
                    <input required name="interests" type="text" placeholder="AI, Gaming, Finance..." className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-cyan-500/50 transition-colors" />
                  </div>

                  <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-white/40">Preferred Field</label>
                      <select name="preferredField" className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-cyan-500/50 transition-colors">
                        {Object.keys(CAREER_DATABASE).map(field => (
                          <option key={field} value={field}>{field}</option>
                        ))}
                      </select>
                    </div>

                  <button type="submit" className="w-full py-4 bg-cyan-500 hover:bg-cyan-400 rounded-xl font-bold transition-all neon-border">
                    Generate My Career Path
                  </button>
                </form>
              </div>
            </motion.div>
          )}

          {activeTab === 'dashboard' && profile && recommendation && (
            <motion.div 
              key="dashboard"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col lg:flex-row gap-8"
            >
              {/* Sidebar Navigation */}
              <aside className="lg:w-64 flex-shrink-0 space-y-2">
                <div className="glass-card p-4 mb-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-cyan-500/20 flex items-center justify-center">
                      <User className="w-5 h-5 text-cyan-400" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm truncate">{profile.name}</h4>
                      <p className="text-[10px] text-white/40 uppercase font-bold tracking-widest">{profile.yearOfStudy} Year</p>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] font-bold text-white/40 uppercase mb-1">
                      <span>Readiness</span>
                      <span>{readinessPercentage}%</span>
                    </div>
                    <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-cyan-500" style={{ width: `${readinessPercentage}%` }} />
                    </div>
                  </div>
                </div>

                <button 
                  onClick={() => setActiveTab('dashboard')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'dashboard' ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/30' : 'text-white/40 hover:bg-white/5 hover:text-white'}`}
                >
                  <LayoutDashboard className="w-5 h-5" />
                  <span className="font-bold text-sm">Overview</span>
                </button>
                <button 
                  onClick={() => setActiveTab('resources')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'resources' ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/30' : 'text-white/40 hover:bg-white/5 hover:text-white'}`}
                >
                  <BookOpen className="w-5 h-5" />
                  <span className="font-bold text-sm">Learning Hub</span>
                </button>
                <button 
                  onClick={() => setActiveTab('interview')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'interview' ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/30' : 'text-white/40 hover:bg-white/5 hover:text-white'}`}
                >
                  <Mic className="w-5 h-5" />
                  <span className="font-bold text-sm">Mock Interview</span>
                </button>
                <button 
                  onClick={() => setActiveTab('resume')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'resume' ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/30' : 'text-white/40 hover:bg-white/5 hover:text-white'}`}
                >
                  <FileText className="w-5 h-5" />
                  <span className="font-bold text-sm">Resume Builder</span>
                </button>

                <div className="pt-4 mt-4 border-t border-white/10">
                  <button 
                    onClick={() => setShowChallengeModal(true)}
                    className="w-full p-4 bg-gradient-to-br from-cyan-500/10 to-purple-500/10 rounded-xl border border-white/10 hover:border-cyan-500/30 transition-all text-left group"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Activity className="w-4 h-4 text-yellow-400 animate-pulse" />
                      <span className="text-[10px] font-bold text-yellow-400 uppercase tracking-widest">Daily Challenge</span>
                    </div>
                    <p className="text-xs font-bold text-white group-hover:text-cyan-400 transition-colors">Today's Tech Challenge</p>
                    <p className="text-[10px] text-white/40 mt-1">Earn 250 XP & climb the leaderboard</p>
                  </button>
                </div>
              </aside>

              {/* Main Content Area */}
              <div className="flex-1 space-y-8">
                {/* Top Stats */}
                <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
                  <div className="glass-card p-4">
                    <p className="text-[10px] font-bold text-white/40 uppercase mb-1">Recommended Career</p>
                    <h3 className="text-lg font-bold text-cyan-400 truncate">{recommendation.title}</h3>
                  </div>
                  <div className="glass-card p-4">
                    <p className="text-[10px] font-bold text-white/40 uppercase mb-1">Market Demand</p>
                    <h3 className="text-lg font-bold text-purple-400">{recommendation.demandLevel}% High</h3>
                  </div>
                  <div className="glass-card p-4">
                    <p className="text-[10px] font-bold text-white/40 uppercase mb-1">Estimated LPA</p>
                    <h3 className="text-lg font-bold text-emerald-400">{recommendation.avgLPA}</h3>
                  </div>
                  <div className="glass-card p-4">
                    <p className="text-[10px] font-bold text-white/40 uppercase mb-1">Skills Mastered</p>
                    <h3 className="text-lg font-bold text-white">
                      {recommendation.requiredSkills.filter(s => profile.skills.includes(s) || learnedSkills.includes(s)).length} / {recommendation.requiredSkills.length}
                    </h3>
                  </div>
                  <div className="glass-card p-4">
                    <p className="text-[10px] font-bold text-white/40 uppercase mb-1">GPA Status</p>
                    <h3 className="text-lg font-bold text-yellow-400">{profile.gpa} / 10</h3>
                  </div>
                </div>

                <div className="grid lg:grid-cols-2 gap-8">
                  {/* Career Roadmap */}
                  <div className="glass-card">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-2xl font-bold flex items-center gap-3">
                        <TrendingUp className="w-6 h-6 text-cyan-400" />
                        Career Roadmap
                      </h3>
                      <div className="text-right">
                        <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Progress</p>
                        <p className="text-lg font-bold text-cyan-400">{(profile.completedSteps || []).length} / {recommendation.roadmap.length}</p>
                      </div>
                    </div>

                    <div className="w-full h-1.5 bg-white/5 rounded-full mb-8 overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${((profile.completedSteps || []).length / recommendation.roadmap.length) * 100}%` }}
                        className="h-full bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.5)]"
                      />
                    </div>
                    
                    <div className="space-y-6">
                      {recommendation.roadmap.map((step, i) => {
                        const isCompleted = (profile.completedSteps || []).includes(i);
                        return (
                          <div key={i} className="flex gap-6 group cursor-pointer" onClick={() => toggleStep(i)}>
                            <div className="flex flex-col items-center">
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${isCompleted ? 'bg-cyan-500 border-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.5)]' : 'border-white/20 hover:border-cyan-500/50'}`}>
                                {isCompleted ? <CheckCircle2 className="w-6 h-6 text-white" /> : <Circle className="w-6 h-6 text-white/20" />}
                              </div>
                              {i !== recommendation.roadmap.length - 1 && (
                                <div className={`w-0.5 h-16 transition-colors duration-300 ${isCompleted ? 'bg-cyan-500' : 'bg-white/10'}`} />
                              )}
                            </div>
                            <div className="pt-2">
                              <h4 className={`text-lg font-bold transition-colors ${isCompleted ? 'text-white' : 'text-white/40'}`}>Step {i + 1}: {step}</h4>
                              <p className="text-white/30 text-sm mt-1">
                                {isCompleted ? 'Completed' : `Estimated completion: ${i + 1} months`}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="space-y-8">
                    {/* CGPA Impact */}
                    <div className="glass-card">
                      <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
                        <BarChart3 className="w-6 h-6 text-yellow-400" />
                        Academic Standing
                      </h3>
                      <div className="p-6 bg-white/5 rounded-2xl border border-white/10">
                        <div className="flex items-center justify-between mb-6">
                          <div>
                            <p className="text-xs font-bold text-white/40 uppercase">Current CGPA</p>
                            <h4 className="text-3xl font-bold text-white">{profile.gpa} / 10.0</h4>
                          </div>
                          <div className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest ${
                            profile.gpa >= 8.5 ? 'bg-emerald-500/20 text-emerald-400' :
                            profile.gpa >= 7.5 ? 'bg-cyan-500/20 text-cyan-400' :
                            'bg-yellow-500/20 text-yellow-400'
                          }`}>
                            {profile.gpa >= 8.5 ? 'Excellent' : profile.gpa >= 7.5 ? 'Good' : 'Average'}
                          </div>
                        </div>
                        <p className="text-sm text-white/70 leading-relaxed">
                          {profile.gpa >= 8.5 
                            ? "Your profile is highly competitive for top-tier tech roles."
                            : profile.gpa >= 7.5
                            ? "You meet the criteria for most major recruitment drives."
                            : "Focus on projects to compensate for your academic score."
                          }
                        </p>
                      </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="glass-card">
                      <h3 className="text-xl font-bold mb-6">Quick Actions</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <button 
                          onClick={() => setActiveTab('resume')}
                          className="p-4 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 transition-all text-left group"
                        >
                          <FileText className="w-6 h-6 text-cyan-400 mb-2 group-hover:scale-110 transition-transform" />
                          <p className="font-bold text-sm">Update Resume</p>
                          <p className="text-[10px] text-white/40">ATS Score: 85%</p>
                        </button>
                        <button 
                          onClick={() => setActiveTab('interview')}
                          className="p-4 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 transition-all text-left group"
                        >
                          <Mic className="w-6 h-6 text-purple-400 mb-2 group-hover:scale-110 transition-transform" />
                          <p className="font-bold text-sm">Practice Interview</p>
                          <p className="text-[10px] text-white/40">Next: Technical Round</p>
                        </button>
                      </div>
                    </div>

                    {/* Login History */}
                    {nameHistory.length > 0 && (
                      <div className="glass-card">
                        <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
                          <Users className="w-6 h-6 text-cyan-400" />
                          Login History
                        </h3>
                        <div className="space-y-3">
                          {nameHistory.map((item, idx) => (
                            <div key={idx} className="flex justify-between items-center p-3 bg-white/5 rounded-xl border border-white/10">
                              <span className="font-bold text-sm text-white/80">{item.name}</span>
                              <span className="text-[10px] text-white/40 font-mono">{item.timestamp}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'resume' && (
            <motion.div 
              key="resume"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <h2 className="text-3xl font-bold">AI Resume Builder</h2>
                  <p className="text-white/40 mt-1">Craft an outstanding resume with real-time ATS scoring.</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex bg-white/5 p-1 rounded-xl border border-white/10">
                    {(['modern', 'classic', 'minimal'] as const).map(t => (
                      <button
                        key={t}
                        onClick={() => setResumeData(prev => ({ ...prev, theme: t }))}
                        className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${resumeData.theme === t ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/30' : 'text-white/40 hover:text-white'}`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                  <button 
                    onClick={() => downloadAsPDF('resume-preview', 'Resume')}
                    disabled={isDownloading}
                    className="bg-cyan-500 hover:bg-cyan-400 disabled:bg-cyan-500/50 px-6 py-2 rounded-xl font-bold transition-all flex items-center gap-2 shadow-lg shadow-cyan-500/30"
                  >
                    {isDownloading ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <Download className="w-4 h-4" />
                    )}
                    {isDownloading ? 'Generating...' : 'Download PDF'}
                  </button>
                </div>
              </div>

              <div className="grid lg:grid-cols-12 gap-8">
                {/* Editor */}
                <div className="lg:col-span-5 space-y-6">
                  {/* ATS Score Panel */}
                  <div className="glass-card border-cyan-500/30 bg-cyan-500/5">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-bold flex items-center gap-2">
                        <Target className="w-4 h-4 text-cyan-400" />
                        ATS Compatibility Score
                      </h3>
                      <span className="text-2xl font-black text-cyan-400">
                        {Math.min(100, 
                          (resumeData.personalInfo.summary ? 20 : 0) + 
                          (resumeData.experience.length * 15) + 
                          (resumeData.projects.length * 15) + 
                          (resumeData.certifications.length * 10) +
                          (resumeData.skills.length > 5 ? 20 : 10)
                        )}%
                      </span>
                    </div>
                    <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(100, (resumeData.personalInfo.summary ? 20 : 0) + (resumeData.experience.length * 15) + (resumeData.projects.length * 15) + (resumeData.certifications.length * 10) + (resumeData.skills.length > 5 ? 20 : 10))}%` }}
                        className="h-full bg-cyan-500"
                      />
                    </div>
                    <p className="text-[10px] text-white/40 mt-3 uppercase tracking-widest font-bold">
                      Tip: Add more projects and certifications to reach 90%+
                    </p>
                  </div>

                  <div className="glass-card">
                    <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                      <User className="w-5 h-5 text-cyan-400" />
                      Personal Info
                    </h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold uppercase text-white/40">Full Name</label>
                          <input 
                            value={resumeData.personalInfo.name} 
                            onChange={(e) => updateResumePersonal('name', e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-cyan-500/50" 
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold uppercase text-white/40">Email</label>
                          <input 
                            value={resumeData.personalInfo.email}
                            onChange={(e) => updateResumePersonal('email', e.target.value)}
                            placeholder="email@example.com"
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-cyan-500/50" 
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold uppercase text-white/40">Phone</label>
                          <input 
                            value={resumeData.personalInfo.phone}
                            onChange={(e) => updateResumePersonal('phone', e.target.value)}
                            placeholder="+91 98765 43210"
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-cyan-500/50" 
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold uppercase text-white/40">LinkedIn</label>
                          <input 
                            value={resumeData.personalInfo.linkedin}
                            onChange={(e) => updateResumePersonal('linkedin', e.target.value)}
                            placeholder="linkedin.com/in/user"
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-cyan-500/50" 
                          />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase text-white/40">Professional Summary</label>
                        <textarea 
                          rows={3}
                          value={resumeData.personalInfo.summary}
                          onChange={(e) => updateResumePersonal('summary', e.target.value)}
                          placeholder="Briefly describe your career goals and key strengths..."
                          className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-cyan-500/50 resize-none"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="glass-card">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-bold flex items-center gap-2">
                        <Briefcase className="w-5 h-5 text-emerald-400" />
                        Experience
                      </h3>
                      <button 
                        onClick={() => addResumeItem('experience')}
                        className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-bold uppercase tracking-widest"
                      >
                        <Plus className="w-3 h-3" /> Add
                      </button>
                    </div>
                    <div className="space-y-4">
                      {resumeData.experience.map((exp, i) => (
                        <div key={i} className="p-4 bg-white/5 rounded-xl border border-white/10 space-y-3 relative group">
                          <button 
                            onClick={() => removeResumeItem('experience', i)}
                            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300 transition-all"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                          <div className="grid grid-cols-2 gap-3">
                            <input 
                              value={exp.company}
                              onChange={(e) => updateResumeItem('experience', i, 'company', e.target.value)}
                              placeholder="Company" 
                              className="bg-transparent border-b border-white/10 py-1 text-sm focus:outline-none focus:border-cyan-500/50" 
                            />
                            <input 
                              value={exp.role}
                              onChange={(e) => updateResumeItem('experience', i, 'role', e.target.value)}
                              placeholder="Role" 
                              className="bg-transparent border-b border-white/10 py-1 text-sm focus:outline-none focus:border-cyan-500/50" 
                            />
                          </div>
                          <input 
                            value={exp.duration}
                            onChange={(e) => updateResumeItem('experience', i, 'duration', e.target.value)}
                            placeholder="Duration (e.g. 2023 - 2024)" 
                            className="w-full bg-transparent border-b border-white/10 py-1 text-xs focus:outline-none focus:border-cyan-500/50" 
                          />
                          <textarea 
                            value={exp.description}
                            onChange={(e) => updateResumeItem('experience', i, 'description', e.target.value)}
                            placeholder="Key responsibilities..." 
                            className="w-full bg-transparent text-xs focus:outline-none resize-none" 
                            rows={2} 
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="glass-card">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-bold flex items-center gap-2">
                        <Code className="w-5 h-5 text-purple-400" />
                        Projects
                      </h3>
                      <button 
                        onClick={() => addResumeItem('projects')}
                        className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-bold uppercase tracking-widest"
                      >
                        <Plus className="w-3 h-3" /> Add
                      </button>
                    </div>
                    <div className="space-y-4">
                      {resumeData.projects.map((proj, i) => (
                        <div key={i} className="p-4 bg-white/5 rounded-xl border border-white/10 space-y-3 relative group">
                          <button 
                            onClick={() => removeResumeItem('projects', i)}
                            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300 transition-all"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                          <input 
                            value={proj.title}
                            onChange={(e) => updateResumeItem('projects', i, 'title', e.target.value)}
                            placeholder="Project Title" 
                            className="w-full bg-transparent border-b border-white/10 py-1 text-sm focus:outline-none focus:border-cyan-500/50" 
                          />
                          <input 
                            value={proj.technologies}
                            onChange={(e) => updateResumeItem('projects', i, 'technologies', e.target.value)}
                            placeholder="Technologies used" 
                            className="w-full bg-transparent border-b border-white/10 py-1 text-xs focus:outline-none focus:border-cyan-500/50" 
                          />
                          <textarea 
                            value={proj.description}
                            onChange={(e) => updateResumeItem('projects', i, 'description', e.target.value)}
                            placeholder="Project description..." 
                            className="w-full bg-transparent text-xs focus:outline-none resize-none" 
                            rows={2} 
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="glass-card">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-bold flex items-center gap-2">
                        <Award className="w-5 h-5 text-yellow-400" />
                        Certifications
                      </h3>
                      <button 
                        onClick={() => addResumeItem('certifications')}
                        className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-bold uppercase tracking-widest"
                      >
                        <Plus className="w-3 h-3" /> Add
                      </button>
                    </div>
                    <div className="space-y-3">
                      {resumeData.certifications.map((cert, i) => (
                        <div key={i} className="flex gap-2">
                          <input 
                            value={cert}
                            onChange={(e) => updateResumeList('certifications', i, e.target.value)}
                            placeholder="Certification Name"
                            className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-cyan-500/50"
                          />
                          <button onClick={() => removeResumeItem('certifications', i)} className="text-red-400 p-2"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Preview */}
                <div className="lg:col-span-7 lg:sticky lg:top-24 h-fit print:static print:w-full">
                  <div className="bg-white/5 p-4 rounded-2xl border border-white/10 mb-4 print:hidden">
                    <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest flex items-center gap-2">
                      <Eye className="w-3 h-3" /> Live Preview
                    </p>
                  </div>
                  <div className="max-h-[80vh] overflow-y-auto custom-scrollbar rounded-sm shadow-2xl print:max-h-none print:overflow-visible print:shadow-none">
                    <div id="resume-preview" className={`bg-white text-slate-900 min-h-[842px] w-full flex flex-col print:p-0 print:shadow-none ${resumeData.theme === 'minimal' ? 'p-16' : 'p-0'}`}>
                    {resumeData.theme === 'modern' && (
                      <div className="bg-slate-900 text-white p-12 flex flex-col gap-4">
                        <h1 className="text-5xl font-black tracking-tighter uppercase leading-none">{resumeData.personalInfo.name || 'YOUR NAME'}</h1>
                        <div className="flex flex-wrap gap-4 text-xs font-bold text-cyan-400 uppercase tracking-widest">
                          <span>{profile?.department}</span>
                          <span>•</span>
                          <span>{resumeData.personalInfo.email || 'email@example.com'}</span>
                          {resumeData.personalInfo.phone && (
                            <><span>•</span><span>{resumeData.personalInfo.phone}</span></>
                          )}
                        </div>
                      </div>
                    )}

                    {resumeData.theme === 'classic' && (
                      <div className="p-12 pb-6 text-center border-b-4 border-slate-900">
                        <h1 className="text-4xl font-serif font-bold uppercase tracking-widest mb-2">{resumeData.personalInfo.name || 'YOUR NAME'}</h1>
                        <div className="flex justify-center gap-4 text-sm text-slate-600">
                          <span>{resumeData.personalInfo.email}</span>
                          <span>|</span>
                          <span>{resumeData.personalInfo.phone}</span>
                          <span>|</span>
                          <span>{resumeData.personalInfo.linkedin}</span>
                        </div>
                      </div>
                    )}

                    {resumeData.theme === 'minimal' && (
                      <div className="mb-12">
                        <h1 className="text-3xl font-light tracking-tight mb-2">{resumeData.personalInfo.name || 'YOUR NAME'}</h1>
                        <p className="text-slate-500 text-sm">{profile?.department} • {resumeData.personalInfo.email}</p>
                      </div>
                    )}

                    <div className={`${resumeData.theme === 'minimal' ? '' : 'p-12'} flex-1`}>
                      <div className="grid grid-cols-3 gap-12">
                        <div className="col-span-2 space-y-10">
                          {resumeData.personalInfo.summary && (
                            <section>
                              <h2 className={`text-sm font-black uppercase tracking-widest border-b-2 border-slate-900 pb-1 mb-4 ${resumeData.theme === 'classic' ? 'text-center' : ''}`}>Summary</h2>
                              <p className="text-xs leading-relaxed text-slate-700">{resumeData.personalInfo.summary}</p>
                            </section>
                          )}

                          <section>
                            <h2 className={`text-sm font-black uppercase tracking-widest border-b-2 border-slate-900 pb-1 mb-4 ${resumeData.theme === 'classic' ? 'text-center' : ''}`}>Experience</h2>
                            <div className="space-y-8">
                              {resumeData.experience.map((exp, i) => (
                                <div key={i}>
                                  <div className="flex justify-between items-baseline mb-1">
                                    <h3 className="font-bold text-sm">{exp.role || 'Role Name'}</h3>
                                    <span className="text-[10px] font-bold text-slate-500 uppercase">{exp.duration}</span>
                                  </div>
                                  <p className="text-xs font-bold text-cyan-600 mb-2">{exp.company || 'Company Name'}</p>
                                  <p className="text-xs text-slate-600 leading-relaxed">{exp.description}</p>
                                </div>
                              ))}
                            </div>
                          </section>

                          <section>
                            <h2 className={`text-sm font-black uppercase tracking-widest border-b-2 border-slate-900 pb-1 mb-4 ${resumeData.theme === 'classic' ? 'text-center' : ''}`}>Projects</h2>
                            <div className="space-y-8">
                              {resumeData.projects.map((proj, i) => (
                                <div key={i}>
                                  <div className="flex justify-between items-baseline mb-1">
                                    <h3 className="font-bold text-sm">{proj.title || 'Project Title'}</h3>
                                    <span className="text-[10px] font-bold text-slate-400 uppercase">{proj.technologies}</span>
                                  </div>
                                  <p className="text-xs text-slate-600 leading-relaxed">{proj.description}</p>
                                </div>
                              ))}
                            </div>
                          </section>
                        </div>

                        <div className="space-y-10">
                          <section>
                            <h2 className={`text-sm font-black uppercase tracking-widest border-b-2 border-slate-900 pb-1 mb-4 ${resumeData.theme === 'classic' ? 'text-center' : ''}`}>Skills</h2>
                            <div className="flex flex-wrap gap-2">
                              {resumeData.skills.map(skill => (
                                <span key={skill} className="text-[10px] font-bold bg-slate-100 text-slate-700 px-2 py-1 rounded border border-slate-200">
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </section>

                          <section>
                            <h2 className={`text-sm font-black uppercase tracking-widest border-b-2 border-slate-900 pb-1 mb-4 ${resumeData.theme === 'classic' ? 'text-center' : ''}`}>Education</h2>
                            <div className="space-y-4">
                              {resumeData.education.map((edu, i) => (
                                <div key={i}>
                                  <h3 className="font-bold text-xs">{edu.school}</h3>
                                  <p className="text-[10px] text-slate-600 font-medium">{edu.degree}</p>
                                  <div className="flex justify-between mt-1">
                                    <span className="text-[10px] text-slate-500">{edu.year}</span>
                                    <span className="text-[10px] font-bold text-cyan-600">GPA: {edu.gpa}</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </section>

                          {resumeData.certifications.length > 0 && (
                            <section>
                              <h2 className={`text-sm font-black uppercase tracking-widest border-b-2 border-slate-900 pb-1 mb-4 ${resumeData.theme === 'classic' ? 'text-center' : ''}`}>Certifications</h2>
                              <ul className="space-y-2">
                                {resumeData.certifications.map((cert, i) => (
                                  <li key={i} className="text-[10px] text-slate-600 flex gap-2">
                                    <span className="text-cyan-500">•</span>
                                    {cert}
                                  </li>
                                ))}
                              </ul>
                            </section>
                          )}

                          {resumeData.languages.length > 0 && (
                            <section>
                              <h2 className={`text-sm font-black uppercase tracking-widest border-b-2 border-slate-900 pb-1 mb-4 ${resumeData.theme === 'classic' ? 'text-center' : ''}`}>Languages</h2>
                              <div className="flex flex-wrap gap-x-4 gap-y-2">
                                {resumeData.languages.map((lang, i) => (
                                  <span key={i} className="text-[10px] font-bold text-slate-500">{lang}</span>
                                ))}
                              </div>
                            </section>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

          {activeTab === 'resources' && (
            <motion.div 
              key="resources"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {!profile ? (
                <div className="glass-card p-12 text-center max-w-2xl mx-auto">
                  <BookOpen className="w-16 h-16 text-cyan-500 mx-auto mb-6 opacity-20" />
                  <h2 className="text-3xl font-bold mb-4">Profile Required</h2>
                  <p className="text-white/50 mb-8">Please complete your profile first so we can curate the best learning resources for your career path.</p>
                  <button 
                    onClick={() => setActiveTab('profile')}
                    className="px-8 py-4 bg-cyan-500 hover:bg-cyan-400 rounded-xl font-bold transition-all neon-border"
                  >
                    Complete Profile
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-3xl font-bold">Learning Hub</h2>
                      <p className="text-white/40 mt-1">Curated resources to master your chosen career path.</p>
                    </div>
                    <div className="flex gap-2">
                      <span className="px-4 py-2 bg-cyan-500/10 border border-cyan-500/30 rounded-xl text-cyan-400 text-xs font-bold uppercase tracking-widest">
                        {profile.preferredField}
                      </span>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {RESOURCES.filter(r => r.category === profile.preferredField).map((res, i) => (
                      <div key={i} className="glass-card hover:border-cyan-500/50 transition-all group">
                        <div className="flex items-start justify-between mb-4">
                          <div className={`p-2 rounded-lg ${
                            res.type === 'Course' ? 'bg-blue-500/20 text-blue-400' :
                            res.type === 'Video' ? 'bg-red-500/20 text-red-400' :
                            res.type === 'Article' ? 'bg-emerald-500/20 text-emerald-400' :
                            'bg-purple-500/20 text-purple-400'
                          }`}>
                            {res.type === 'Course' && <Award className="w-5 h-5" />}
                            {res.type === 'Video' && <Mic className="w-5 h-5" />}
                            {res.type === 'Article' && <FileText className="w-5 h-5" />}
                            {res.type === 'Tool' && <Code className="w-5 h-5" />}
                          </div>
                          <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">{res.provider}</span>
                        </div>
                        <h4 className="font-bold mb-2 group-hover:text-cyan-400 transition-colors">{res.title}</h4>
                        <p className="text-xs text-white/40 mb-4">{res.type} • Free Access</p>
                        <a 
                          href={res.link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-xs font-bold text-cyan-400 hover:text-cyan-300 transition-colors"
                        >
                          Start Learning <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    ))}
                  </div>

                  {/* Learning Path Visualization */}
                  <div className="glass-card">
                    <h3 className="text-xl font-bold mb-6">Your Learning Journey</h3>
                    <div className="relative">
                      <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-white/10" />
                      <div className="space-y-8 relative">
                        {[
                          { title: 'Foundations', desc: 'Master the core concepts and basics of ' + profile.preferredField, status: 'Completed' },
                          { title: 'Intermediate Projects', desc: 'Build 3-5 portfolio-worthy projects using industry tools', status: 'In Progress' },
                          { title: 'Advanced Certification', desc: 'Get certified by recognized industry leaders', status: 'Upcoming' },
                          { title: 'Job Ready', desc: 'Mock interviews and resume optimization', status: 'Upcoming' }
                        ].map((step, i) => (
                          <div key={i} className="flex gap-8 items-start">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center z-10 ${
                              step.status === 'Completed' ? 'bg-emerald-500 text-white' :
                              step.status === 'In Progress' ? 'bg-cyan-500 text-white' :
                              'bg-white/10 text-white/40'
                            }`}>
                              {step.status === 'Completed' ? <CheckCircle2 className="w-4 h-4" /> : <span className="text-xs font-bold">{i + 1}</span>}
                            </div>
                            <div>
                              <h4 className="font-bold">{step.title}</h4>
                              <p className="text-sm text-white/40 mt-1">{step.desc}</p>
                              <span className={`inline-block mt-2 text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded ${
                                step.status === 'Completed' ? 'bg-emerald-500/20 text-emerald-400' :
                                step.status === 'In Progress' ? 'bg-cyan-500/20 text-cyan-400' :
                                'bg-white/5 text-white/40'
                              }`}>
                                {step.status}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </>
              )}
            </motion.div>
          )}

          {activeTab === 'interview' && (
            <motion.div 
              key="interview"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              {!profile ? (
                <div className="glass-card p-12 text-center max-w-2xl mx-auto">
                  <Mic className="w-16 h-16 text-cyan-500 mx-auto mb-6 opacity-20" />
                  <h2 className="text-3xl font-bold mb-4">Profile Required</h2>
                  <p className="text-white/50 mb-8">Please complete your profile first so our AI interviewer can tailor the questions to your background and interests.</p>
                  <button 
                    onClick={() => setActiveTab('profile')}
                    className="px-8 py-4 bg-cyan-500 hover:bg-cyan-400 rounded-xl font-bold transition-all neon-border"
                  >
                    Complete Profile
                  </button>
                </div>
              ) : interviewFinished ? (
                <div className="space-y-8">
                  <div className="glass-card p-12 text-center max-w-4xl mx-auto">
                    <Award className="w-20 h-20 text-yellow-400 mx-auto mb-6" />
                    <h2 className="text-4xl font-bold mb-4">Interview Completed!</h2>
                    <p className="text-xl text-white/60 mb-8">You've completed the technical assessment for {profile.preferredField}.</p>
                    
                    <div className="grid md:grid-cols-3 gap-8 mb-12">
                      <div className="p-6 bg-white/5 rounded-2xl border border-white/10">
                        <div className="text-4xl font-black text-cyan-400 mb-2">{interviewScore}</div>
                        <div className="text-xs font-bold uppercase tracking-widest text-white/40">Total Score</div>
                      </div>
                      <div className="p-6 bg-white/5 rounded-2xl border border-white/10">
                        <div className="text-4xl font-black text-emerald-400 mb-2">{(interviewScore / 100 * 100).toFixed(0)}%</div>
                        <div className="text-xs font-bold uppercase tracking-widest text-white/40">Accuracy</div>
                      </div>
                      <div className="p-6 bg-white/5 rounded-2xl border border-white/10">
                        <div className="text-4xl font-black text-purple-400 mb-2">{interviewScore >= 70 ? 'Pass' : 'Needs Practice'}</div>
                        <div className="text-xs font-bold uppercase tracking-widest text-white/40">Result</div>
                      </div>
                    </div>

                    <div className="flex flex-wrap justify-center gap-4">
                      <button 
                        onClick={resetInterview}
                        className="px-8 py-4 bg-white/10 hover:bg-white/20 rounded-xl font-bold transition-all"
                      >
                        Retake Interview
                      </button>
                      <button 
                        onClick={() => downloadAsPDF('certificate-preview', 'Certificate')}
                        disabled={isDownloading}
                        className="px-8 py-4 bg-cyan-500 hover:bg-cyan-400 disabled:bg-cyan-500/50 rounded-xl font-bold transition-all neon-border flex items-center gap-2"
                      >
                        {isDownloading ? (
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                          <Download className="w-5 h-5" />
                        )}
                        {isDownloading ? 'Generating...' : 'Download Certificate'}
                      </button>
                    </div>
                  </div>

                  {interviewScore >= 70 && (
                    <div className="print-section">
                      <Certificate name={profile.name} score={interviewScore} field={profile.preferredField} />
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-3xl font-bold">Technical MCQ Assessment</h2>
                      <p className="text-white/40 mt-1">Test your knowledge with 20 industry-standard questions.</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <button 
                        onClick={() => setShowStudyGuide(true)}
                        className="px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/30 rounded-xl text-purple-400 text-xs font-bold flex items-center gap-2 transition-all"
                      >
                        <BookOpen className="w-4 h-4" /> Study Guide
                      </button>
                      <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl">
                        <span className="text-xs font-bold text-white/40 uppercase tracking-widest mr-2">Score:</span>
                        <span className="text-cyan-400 font-bold">{interviewScore}</span>
                      </div>
                      <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl">
                        <span className="text-xs font-bold text-white/40 uppercase tracking-widest mr-2">Question:</span>
                        <span className="text-white font-bold">{currentQuestionIndex + 1}/20</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                      <div className="glass-card p-8">
                        <div className="flex items-center gap-3 mb-6">
                          <div className="w-10 h-10 bg-cyan-500/20 rounded-full flex items-center justify-center">
                            <Brain className="w-6 h-6 text-cyan-400" />
                          </div>
                          <div>
                            <h4 className="font-bold text-sm">Question {currentQuestionIndex + 1}</h4>
                            <p className="text-[10px] text-emerald-400 uppercase font-bold tracking-widest">MNC Standard</p>
                          </div>
                        </div>

                        <h3 className="text-xl font-bold mb-8 leading-relaxed">
                          {INTERVIEW_QUESTIONS[currentQuestionIndex].question}
                        </h3>

                        <div className="grid gap-4">
                          {INTERVIEW_QUESTIONS[currentQuestionIndex].options.map((option, idx) => (
                            <button
                              key={idx}
                              onClick={() => handleOptionSelect(idx)}
                              disabled={showExplanation}
                              className={`w-full p-4 rounded-xl text-left transition-all border ${
                                selectedOption === idx
                                  ? idx === INTERVIEW_QUESTIONS[currentQuestionIndex].correctAnswer
                                    ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
                                    : 'bg-red-500/20 border-red-500 text-red-400'
                                  : showExplanation && idx === INTERVIEW_QUESTIONS[currentQuestionIndex].correctAnswer
                                    ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
                                    : 'bg-white/5 border-white/10 hover:border-white/30'
                              }`}
                            >
                              <div className="flex items-center gap-4">
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold ${
                                  selectedOption === idx ? 'bg-white/20' : 'bg-white/5'
                                }`}>
                                  {String.fromCharCode(65 + idx)}
                                </div>
                                <span className="font-medium">{option}</span>
                                {showExplanation && idx === INTERVIEW_QUESTIONS[currentQuestionIndex].correctAnswer && (
                                  <CheckCircle2 className="w-5 h-5 ml-auto text-emerald-400" />
                                )}
                                {selectedOption === idx && idx !== INTERVIEW_QUESTIONS[currentQuestionIndex].correctAnswer && (
                                  <X className="w-5 h-5 ml-auto text-red-400" />
                                )}
                              </div>
                            </button>
                          ))}
                        </div>

                        <AnimatePresence>
                          {showExplanation && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              className="mt-8 p-6 bg-cyan-500/10 border border-cyan-500/30 rounded-2xl"
                            >
                              <div className="flex items-center gap-2 mb-2 text-cyan-400">
                                <Brain className="w-4 h-4" />
                                <span className="text-xs font-bold uppercase tracking-widest">AI Explanation</span>
                              </div>
                              <p className="text-sm text-white/80 leading-relaxed">
                                {INTERVIEW_QUESTIONS[currentQuestionIndex].explanation}
                              </p>
                              <button
                                onClick={handleNextQuestion}
                                className="mt-6 w-full py-3 bg-cyan-500 hover:bg-cyan-400 rounded-xl font-bold transition-all flex items-center justify-center gap-2"
                              >
                                {currentQuestionIndex === 19 ? 'Finish Assessment' : 'Next Question'} <ArrowRight className="w-4 h-4" />
                              </button>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="glass-card">
                        <h3 className="font-bold mb-4 flex items-center gap-2">
                          <TrendingUp className="w-4 h-4 text-cyan-400" />
                          Progress Tracker
                        </h3>
                        <div className="space-y-4">
                          <div className="flex justify-between text-xs mb-2">
                            <span className="text-white/40 font-bold uppercase tracking-widest">Completion</span>
                            <span className="font-bold">{((currentQuestionIndex + 1) / 20 * 100).toFixed(0)}%</span>
                          </div>
                          <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${(currentQuestionIndex + 1) / 20 * 100}%` }}
                              className="h-full bg-cyan-500"
                            />
                          </div>
                          <p className="text-[10px] text-white/40 leading-relaxed">
                            Complete all 20 questions to receive your SmartEdge E-Certificate. Minimum 70% required to pass.
                          </p>
                        </div>
                      </div>

                      <div className="glass-card bg-emerald-500/5 border-emerald-500/20">
                        <h3 className="font-bold mb-4 flex items-center gap-2 text-emerald-400">
                          <Award className="w-4 h-4" />
                          Scoring Rules
                        </h3>
                        <ul className="space-y-3 text-xs text-white/60">
                          <li className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                            Correct Answer: +5 Marks
                          </li>
                          <li className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-red-400" />
                            Incorrect Answer: 0 Marks
                          </li>
                          <li className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                            Total Questions: 20
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </motion.div>
          )}
          {activeTab === 'admin' && (
            <motion.div 
              key="admin"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {!isAdminAuthenticated ? (
                <div className="max-w-md mx-auto">
                  <div className="glass-card p-8 border-cyan-500/20 text-center">
                    <Shield className="w-12 h-12 text-cyan-400 mx-auto mb-6" />
                    <h2 className="text-2xl font-bold mb-2">Admin Authentication</h2>
                    <p className="text-white/50 text-sm mb-8">Please enter the administrator password to continue.</p>
                    
                    <form onSubmit={handleAdminLogin} className="space-y-4">
                      <div className="space-y-2 text-left">
                        <label className="text-xs font-bold uppercase tracking-wider text-white/40">Password</label>
                        <input 
                          required 
                          type="password" 
                          value={adminPassword}
                          onChange={(e) => setAdminPassword(e.target.value)}
                          placeholder="••••••••" 
                          className={`w-full bg-white/5 border ${passwordError ? 'border-red-500/50' : 'border-white/10'} rounded-xl px-4 py-3 focus:outline-none focus:border-cyan-500/50 transition-colors`} 
                        />
                        {passwordError && <p className="text-red-400 text-xs mt-1">Incorrect password. Please try again.</p>}
                      </div>
                      <button type="submit" className="w-full py-4 bg-cyan-500 hover:bg-cyan-400 rounded-xl font-bold transition-all neon-border">
                        Login to Portal
                      </button>
                    </form>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between">
                    <h2 className="text-3xl font-bold">Admin Dashboard</h2>
                    <button 
                      onClick={() => setIsAdminAuthenticated(false)}
                      className="text-xs font-bold uppercase tracking-widest text-white/40 hover:text-white transition-colors"
                    >
                      Logout
                    </button>
                  </div>

                  {/* Admin Stats */}
                  <div className="grid md:grid-cols-4 gap-6">
                    <div className="glass-card text-center">
                      <Users className="w-8 h-8 text-cyan-400 mx-auto mb-4" />
                      <div className="text-4xl font-bold mb-1">{stats.totalStudents.toLocaleString()}</div>
                      <div className="text-xs font-bold text-white/40 uppercase">Total Students</div>
                    </div>
                    <div className="glass-card text-center">
                      <Award className="w-8 h-8 text-purple-400 mx-auto mb-4" />
                      <div className="text-xl font-bold mb-1 leading-tight">{stats.mostRecommended}</div>
                      <div className="text-xs font-bold text-white/40 uppercase">Top Career Path</div>
                    </div>
                    <div className="glass-card text-center">
                      <TrendingUp className="w-8 h-8 text-emerald-400 mx-auto mb-4" />
                      <div className="text-4xl font-bold mb-1">{stats.placementRate}%</div>
                      <div className="text-xs font-bold text-white/40 uppercase">Placement Rate</div>
                    </div>
                    <div className="glass-card text-center">
                      <Activity className="w-8 h-8 text-yellow-400 mx-auto mb-4" />
                      <div className="text-4xl font-bold mb-1">{stats.skillGapAvg}%</div>
                      <div className="text-xs font-bold text-white/40 uppercase">Skill Gap Index</div>
                    </div>
                  </div>

                  <div className="grid lg:grid-cols-3 gap-8">
                    {/* Student Directory */}
                    <div className="lg:col-span-2 glass-card">
                      <div className="flex items-center justify-between mb-8">
                        <h3 className="text-xl font-bold flex items-center gap-2">
                          <Users className="w-5 h-5 text-cyan-400" />
                          Student Directory
                        </h3>
                        <div className="flex gap-2">
                          <div className="relative">
                            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-white/20" />
                            <input 
                              placeholder="Search students..."
                              className="bg-white/5 border border-white/10 rounded-lg pl-9 pr-4 py-2 text-xs focus:outline-none focus:border-cyan-500/50"
                            />
                          </div>
                          <button className="p-2 bg-white/5 border border-white/10 rounded-lg text-white/40 hover:text-white">
                            <Filter className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <div className="overflow-x-auto">
                        <table className="w-full text-left">
                          <thead>
                            <tr className="text-[10px] font-bold uppercase tracking-widest text-white/20 border-b border-white/5">
                              <th className="pb-4">Student Name</th>
                              <th className="pb-4">Dept</th>
                              <th className="pb-4">GPA</th>
                              <th className="pb-4">Career Path</th>
                              <th className="pb-4">Status</th>
                              <th className="pb-4">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="text-sm">
                            {mockStudents.map(student => (
                              <tr key={student.id} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                                <td className="py-4 font-bold">{student.name}</td>
                                <td className="py-4 text-white/40">{student.dept}</td>
                                <td className="py-4">
                                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${student.gpa >= 9 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-cyan-500/20 text-cyan-400'}`}>
                                    {student.gpa}
                                  </span>
                                </td>
                                <td className="py-4 text-white/60">{student.path}</td>
                                <td className="py-4">
                                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                    student.status === 'Placed' ? 'bg-emerald-500/20 text-emerald-400' :
                                    student.status === 'Interning' ? 'bg-cyan-500/20 text-cyan-400' :
                                    'bg-yellow-500/20 text-yellow-400'
                                  }`}>
                                    {student.status}
                                  </span>
                                </td>
                                <td className="py-4">
                                  <button className="text-xs text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity">View Profile</button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Skill Analytics */}
                    <div className="space-y-8">
                      <div className="glass-card">
                        <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                          <PieChart className="w-5 h-5 text-purple-400" />
                          Skill Demand
                        </h3>
                        <div className="h-64">
                          <Radar 
                            data={{
                              labels: ['Python', 'Cloud', 'React', 'AI/ML', 'Security', 'UI/UX'],
                              datasets: [{
                                label: 'Market Demand',
                                data: [95, 85, 90, 98, 80, 75],
                                backgroundColor: 'rgba(6, 182, 212, 0.2)',
                                borderColor: 'rgba(6, 182, 212, 1)',
                                borderWidth: 2,
                                pointBackgroundColor: 'rgba(6, 182, 212, 1)',
                              }]
                            }}
                            options={{
                              scales: {
                                r: {
                                  grid: { color: 'rgba(255,255,255,0.05)' },
                                  angleLines: { color: 'rgba(255,255,255,0.05)' },
                                  ticks: { display: false },
                                  pointLabels: { color: 'rgba(255,255,255,0.4)', font: { size: 10 } }
                                }
                              },
                              plugins: { legend: { display: false } }
                            }}
                          />
                        </div>
                      </div>

                      <div className="glass-card bg-cyan-500/5 border-cyan-500/20">
                        <h3 className="font-bold mb-4 flex items-center gap-2">
                          <TrendingUp className="w-4 h-4 text-cyan-400" />
                          Market Insights
                        </h3>
                        <div className="space-y-4">
                          <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                            <p className="text-xs font-bold text-cyan-400 mb-1">AI/ML Roles Up 45%</p>
                            <p className="text-[10px] text-white/40">Highest growth sector this quarter across all regions.</p>
                          </div>
                          <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                            <p className="text-xs font-bold text-purple-400 mb-1">Cloud Certifications</p>
                            <p className="text-[10px] text-white/40">80% of top-paying roles now require AWS or Azure certs.</p>
                          </div>
                        </div>
                      </div>

                      <div className="glass-card">
                        <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                          <Users className="w-5 h-5 text-cyan-400" />
                          Recent Logins
                        </h3>
                        <div className="space-y-4">
                          {nameHistory.length > 0 ? (
                            nameHistory.map((item, idx) => (
                              <div key={idx} className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/5">
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 bg-cyan-500/10 rounded-full flex items-center justify-center text-[10px] font-bold text-cyan-400">
                                    {item.name[0]}
                                  </div>
                                  <div>
                                    <p className="text-xs font-bold">{item.name}</p>
                                    <p className="text-[10px] text-white/40">User Login</p>
                                  </div>
                                </div>
                                <span className="text-[10px] text-white/20">{item.timestamp}</span>
                              </div>
                            ))
                          ) : (
                            <p className="text-xs text-white/40 text-center py-4 italic">No recent login data</p>
                          )}
                        </div>
                      </div>

                      <div className="glass-card">
                        <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                          <Activity className="w-5 h-5 text-emerald-400" />
                          Recent Activity
                        </h3>
                        <div className="space-y-4">
                          {[
                            { user: 'Alex J.', action: 'Completed AI Path', time: '2h ago' },
                            { user: 'Sarah W.', action: 'Updated Resume', time: '4h ago' },
                            { user: 'Michael C.', action: 'Applied to Google', time: '5h ago' },
                            { user: 'Priya S.', action: 'Aced Mock Interview', time: '1d ago' }
                          ].map((act, i) => (
                            <div key={i} className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/5">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center text-[10px] font-bold">
                                  {act.user.split(' ')[0][0]}
                                </div>
                                <div>
                                  <p className="text-xs font-bold">{act.user}</p>
                                  <p className="text-[10px] text-white/40">{act.action}</p>
                                </div>
                              </div>
                              <span className="text-[10px] text-white/20">{act.time}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="glass-card">
                    <h3 className="text-xl font-bold mb-8 flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-cyan-400" />
                      Placement Trends (Last 6 Months)
                    </h3>
                    <div className="h-64">
                      <Line 
                        data={{
                          labels: ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'],
                          datasets: [{
                            label: 'Placements',
                            data: [45, 52, 38, 65, 82, 95],
                            borderColor: '#06b6d4',
                            backgroundColor: 'rgba(6, 182, 212, 0.1)',
                            fill: true,
                            tension: 0.4,
                            pointRadius: 4,
                            pointBackgroundColor: '#06b6d4'
                          }]
                        }}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          scales: {
                            y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: 'rgba(255,255,255,0.4)', font: { size: 10 } } },
                            x: { grid: { display: false }, ticks: { color: 'rgba(255,255,255,0.4)', font: { size: 10 } } }
                          },
                          plugins: { legend: { display: false } }
                        }}
                      />
                    </div>
                  </div>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="border-t border-white/10 py-12 px-6 relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <Brain className="w-6 h-6 text-cyan-400" />
            <span className="font-bold tracking-tighter">CAREERPATH AI</span>
          </div>
          <div className="text-white/40 text-sm">
            © 2026 Intelligent Career Guidance System. All Rights Reserved.
          </div>
          <div className="flex gap-6">
            <button 
              onClick={() => setActiveTab('admin')}
              className="text-white/40 hover:text-cyan-400 transition-colors text-sm font-bold uppercase tracking-widest"
            >
              Admin Portal
            </button>
            <button className="text-white/40 hover:text-white transition-colors"><Settings className="w-5 h-5" /></button>
            <button className="text-white/40 hover:text-white transition-colors"><Briefcase className="w-5 h-5" /></button>
            <button className="text-white/40 hover:text-white transition-colors"><Users className="w-5 h-5" /></button>
          </div>
        </div>
      </footer>

      <Chatbot />

      {/* Study Guide Modal */}
      <AnimatePresence>
        {showStudyGuide && (
          <div className="fixed inset-0 z-[100] overflow-y-auto">
            <div className="min-h-full flex items-center justify-center p-4 md:p-8">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowStudyGuide(false)}
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative w-full max-w-5xl max-h-[90vh] bg-slate-900 border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col"
              >
              <div className="p-6 border-b border-white/10 flex items-center justify-between bg-slate-900/50 backdrop-blur-md sticky top-0 z-10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-purple-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">Interview Study Guide</h2>
                    <p className="text-xs text-white/40">Master the 20 core concepts for your technical assessment</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowStudyGuide(false)}
                  className="p-2 hover:bg-white/5 rounded-full transition-colors"
                >
                  <X className="w-6 h-6 text-white/40" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-12 custom-scrollbar">
                {/* Page 1: Data Structures & Algorithms */}
                <section className="space-y-8">
                  <div className="flex items-center gap-4 mb-6">
                    <span className="text-4xl font-black text-white/5">01</span>
                    <h3 className="text-2xl font-bold text-cyan-400">Data Structures & Algorithms</h3>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <h4 className="text-lg font-bold text-white">Binary Search Trees (BST)</h4>
                      <p className="text-white/60 text-sm leading-relaxed">
                        A Binary Search Tree is a node-based binary tree data structure which has the following properties:
                        The left subtree of a node contains only nodes with keys lesser than the node’s key.
                        The right subtree of a node contains only nodes with keys greater than the node’s key.
                        <br /><br />
                        <strong className="text-white">Time Complexity:</strong> In a balanced BST, searching, insertion, and deletion all take <code className="text-cyan-400">O(log n)</code> time. In the worst case (unbalanced), it can be <code className="text-red-400">O(n)</code>.
                      </p>
                    </div>
                    <div className="space-y-4">
                      <h4 className="text-lg font-bold text-white">Stacks & LIFO</h4>
                      <p className="text-white/60 text-sm leading-relaxed">
                        A Stack is a linear data structure which follows a particular order in which the operations are performed. The order is <strong className="text-white">LIFO (Last In First Out)</strong>.
                        <br /><br />
                        Think of a stack of plates; the last plate you put on top is the first one you take off. Common operations are <code className="text-cyan-400">push()</code> and <code className="text-cyan-400">pop()</code>.
                      </p>
                    </div>
                    <div className="space-y-4">
                      <h4 className="text-lg font-bold text-white">Big O Notation</h4>
                      <p className="text-white/60 text-sm leading-relaxed">
                        Big O notation is used to describe the performance or complexity of an algorithm. It specifically describes the <strong className="text-white">worst-case scenario</strong>, and can be used to describe the execution time required or the space used by an algorithm.
                        <br /><br />
                        Common complexities: <code className="text-emerald-400">O(1)</code> constant, <code className="text-cyan-400">O(log n)</code> logarithmic, <code className="text-yellow-400">O(n)</code> linear, <code className="text-orange-400">O(n log n)</code> linearithmic, <code className="text-red-400">O(n²)</code> quadratic.
                      </p>
                    </div>
                    <div className="space-y-4">
                      <h4 className="text-lg font-bold text-white">Sorting Algorithms</h4>
                      <p className="text-white/60 text-sm leading-relaxed">
                        <strong className="text-white">Merge Sort:</strong> A Divide and Conquer algorithm. It divides the input array into two halves, calls itself for the two halves, and then merges the two sorted halves. Worst-case complexity: <code className="text-cyan-400">O(n log n)</code>.
                        <br /><br />
                        <strong className="text-white">Hash Maps:</strong> Provide <code className="text-emerald-400">O(1)</code> average time complexity for search, insert, and delete operations by using a hash function to map keys to values.
                      </p>
                    </div>
                  </div>
                </section>

                {/* Page 2: Web Development & Frameworks */}
                <section className="space-y-8">
                  <div className="flex items-center gap-4 mb-6">
                    <span className="text-4xl font-black text-white/5">02</span>
                    <h3 className="text-2xl font-bold text-purple-400">Web Development & Frameworks</h3>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <h4 className="text-lg font-bold text-white">React Hooks: useEffect</h4>
                      <p className="text-white/60 text-sm leading-relaxed">
                        The <code className="text-cyan-400">useEffect</code> Hook lets you perform side effects in function components. Data fetching, setting up a subscription, and manually changing the DOM in React components are all examples of side effects.
                        <br /><br />
                        It serves the same purpose as <code className="text-white">componentDidMount</code>, <code className="text-white">componentDidUpdate</code>, and <code className="text-white">componentWillUnmount</code> in React classes.
                      </p>
                    </div>
                    <div className="space-y-4">
                      <h4 className="text-lg font-bold text-white">Virtual DOM</h4>
                      <p className="text-white/60 text-sm leading-relaxed">
                        The Virtual DOM (VDOM) is a programming concept where an ideal, or “virtual”, representation of a UI is kept in memory and synced with the “real” DOM by a library such as ReactDOM. This process is called <strong className="text-white">reconciliation</strong>.
                        <br /><br />
                        It allows React to update only the parts of the UI that have changed, significantly improving performance.
                      </p>
                    </div>
                    <div className="space-y-4">
                      <h4 className="text-lg font-bold text-white">REST APIs</h4>
                      <p className="text-white/60 text-sm leading-relaxed">
                        Representational State Transfer (REST) is an architectural style for providing standards between computer systems on the web, making it easier for systems to communicate with each other.
                        <br /><br />
                        It uses standard HTTP methods: <code className="text-emerald-400">GET</code> (read), <code className="text-cyan-400">POST</code> (create), <code className="text-yellow-400">PUT</code> (update), and <code className="text-red-400">DELETE</code>.
                      </p>
                    </div>
                    <div className="space-y-4">
                      <h4 className="text-lg font-bold text-white">Responsive Web Design</h4>
                      <p className="text-white/60 text-sm leading-relaxed">
                        Responsive web design (RWD) is an approach to web design that makes web pages render well on a variety of devices and window or screen sizes.
                        <br /><br />
                        It relies on <strong className="text-white">Fluid Grids</strong>, <strong className="text-white">Flexible Images</strong>, and <strong className="text-white">Media Queries</strong> to adapt the layout to the viewing environment.
                      </p>
                    </div>
                  </div>
                </section>

                {/* Page 3: Systems & Infrastructure */}
                <section className="space-y-8">
                  <div className="flex items-center gap-4 mb-6">
                    <span className="text-4xl font-black text-white/5">03</span>
                    <h3 className="text-2xl font-bold text-emerald-400">Systems & Infrastructure</h3>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <h4 className="text-lg font-bold text-white">Operating Systems: Deadlocks</h4>
                      <p className="text-white/60 text-sm leading-relaxed">
                        A deadlock is a situation where a set of processes are blocked because each process is holding a resource and waiting for another resource acquired by some other process.
                        <br /><br />
                        Four necessary conditions for deadlock: <strong className="text-white">Mutual Exclusion</strong>, <strong className="text-white">Hold and Wait</strong>, <strong className="text-white">No Preemption</strong>, and <strong className="text-white">Circular Wait</strong>.
                      </p>
                    </div>
                    <div className="space-y-4">
                      <h4 className="text-lg font-bold text-white">Docker & Containers</h4>
                      <p className="text-white/60 text-sm leading-relaxed">
                        Docker is a platform for developers and sysadmins to build, run, and share applications with containers. The use of containers to deploy applications is called <strong className="text-white">containerization</strong>.
                        <br /><br />
                        Containers are lightweight and contain everything needed to run the application, so you do not need to rely on what is currently installed on the host.
                      </p>
                    </div>
                    <div className="space-y-4">
                      <h4 className="text-lg font-bold text-white">Load Balancers</h4>
                      <p className="text-white/60 text-sm leading-relaxed">
                        A load balancer acts as the "traffic cop" sitting in front of your servers and routing client requests across all servers capable of fulfilling those requests in a manner that maximizes speed and capacity utilization.
                        <br /><br />
                        It ensures that no single server bears too much demand, improving responsiveness and availability.
                      </p>
                    </div>
                    <div className="space-y-4">
                      <h4 className="text-lg font-bold text-white">Cloud Computing</h4>
                      <p className="text-white/60 text-sm leading-relaxed">
                        Cloud computing is the on-demand availability of computer system resources, especially data storage and computing power, without direct active management by the user.
                        <br /><br />
                        Models: <strong className="text-white">IaaS</strong> (Infrastructure as a Service), <strong className="text-white">PaaS</strong> (Platform as a Service), and <strong className="text-white">SaaS</strong> (Software as a Service).
                      </p>
                    </div>
                  </div>
                </section>

                {/* Page 4: Databases & Software Principles */}
                <section className="space-y-8">
                  <div className="flex items-center gap-4 mb-6">
                    <span className="text-4xl font-black text-white/5">04</span>
                    <h3 className="text-2xl font-bold text-yellow-400">Databases & Software Principles</h3>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <h4 className="text-lg font-bold text-white">ACID Properties</h4>
                      <p className="text-white/60 text-sm leading-relaxed">
                        ACID is a set of properties of database transactions intended to guarantee data validity despite errors, power failures, and other mishaps.
                        <br /><br />
                        <strong className="text-white">A - Atomicity:</strong> Transactions are all or nothing.<br />
                        <strong className="text-white">C - Consistency:</strong> Data must meet all validation rules.<br />
                        <strong className="text-white">I - Isolation:</strong> Concurrent transactions don't interfere.<br />
                        <strong className="text-white">D - Durability:</strong> Once committed, data stays committed.
                      </p>
                    </div>
                    <div className="space-y-4">
                      <h4 className="text-lg font-bold text-white">NoSQL Databases</h4>
                      <p className="text-white/60 text-sm leading-relaxed">
                        NoSQL databases are non-tabular and store data differently than relational tables. They come in a variety of types based on their data model. The main types are document, graph, key-value, and wide-column.
                        <br /><br />
                        Example: <strong className="text-white">MongoDB</strong> is a popular document-oriented NoSQL database.
                      </p>
                    </div>
                    <div className="space-y-4">
                      <h4 className="text-lg font-bold text-white">OOP: Polymorphism</h4>
                      <p className="text-white/60 text-sm leading-relaxed">
                        Polymorphism is one of the core concepts of object-oriented programming (OOP) and describes situations in which something occurs in several different forms.
                        <br /><br />
                        In computer science, it describes the concept that different types can be accessed through the same interface. Each type can provide its own independent implementation of this interface.
                      </p>
                    </div>
                    <div className="space-y-4">
                      <h4 className="text-lg font-bold text-white">Dependency Injection</h4>
                      <p className="text-white/60 text-sm leading-relaxed">
                        Dependency Injection (DI) is a design pattern in which an object or function receives other objects or functions that it depends on.
                        <br /><br />
                        The intent is to separate the creation of a client's dependencies from the client's behavior, which allows program designs to be loosely coupled.
                      </p>
                    </div>
                  </div>
                </section>

                <div className="pt-8 border-t border-white/10 text-center">
                  <p className="text-white/40 text-xs italic mb-4">"Success is where preparation and opportunity meet."</p>
                  <button 
                    onClick={() => setShowStudyGuide(false)}
                    className="px-8 py-3 bg-purple-500 hover:bg-purple-400 rounded-xl font-bold transition-all shadow-lg shadow-purple-500/20"
                  >
                    I'm Ready for the Assessment
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>

      {/* Daily Challenge Modal */}
      <AnimatePresence>
        {showChallengeModal && (
          <div className="fixed inset-0 z-[100] overflow-y-auto">
            <div className="min-h-full flex items-center justify-center p-4 md:p-8">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowChallengeModal(false)}
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="glass-card w-full max-w-2xl max-h-[90vh] relative z-10 p-0 border-cyan-500/30 overflow-hidden flex flex-col"
              >
                <div className="p-8 border-b border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-cyan-500/20 rounded-xl flex items-center justify-center">
                      <Activity className="w-6 h-6 text-cyan-400" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">Daily Tech Challenge</h2>
                      <p className="text-white/40 text-sm">Earn 250 XP by solving today's problem</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setShowChallengeModal(false)}
                    className="p-2 hover:bg-white/10 rounded-full transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
                  <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                    <p className="text-lg font-medium text-white/90 leading-relaxed">
                      "Explain the concept of 'Event Delegation' in JavaScript and provide a code example where it would be beneficial."
                    </p>
                  </div>

                  {!challengeSubmitted ? (
                    <div className="space-y-6">
                      <div>
                        <label className="block text-xs font-bold text-white/40 uppercase tracking-widest mb-3">Your Explanation</label>
                        <textarea 
                          value={challengeAnswer}
                          onChange={(e) => setChallengeAnswer(e.target.value)}
                          placeholder="Type your answer here..."
                          className="w-full h-40 bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-cyan-500/50 transition-all resize-none"
                        />
                      </div>
                      <button 
                        onClick={() => {
                          if (challengeAnswer.trim()) {
                            setChallengeSubmitted(true);
                          }
                        }}
                        className="w-full py-4 bg-cyan-500 hover:bg-cyan-400 rounded-xl font-bold transition-all neon-border flex items-center justify-center gap-2"
                      >
                        <Send className="w-5 h-5" />
                        Submit for AI Review
                      </button>
                    </div>
                  ) : (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-center py-8"
                    >
                      <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle2 className="w-10 h-10 text-emerald-400" />
                      </div>
                      <h3 className="text-2xl font-bold mb-2">Challenge Submitted!</h3>
                      <p className="text-white/50 mb-8">Your answer is being reviewed by our AI. You'll receive your XP shortly.</p>
                      <button 
                        onClick={() => setShowChallengeModal(false)}
                        className="px-8 py-3 bg-white/10 hover:bg-white/20 rounded-xl font-bold transition-all"
                      >
                        Close
                      </button>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

import type {
  TNavLink,
  TService,
  TTechnology,
  TExperience,
  TTestimonial,
  TProject,
} from "../types";

import {
  mobile,
  backend,
  creator,
  web,
  javascript,
  typescript,
  html,
  css,
  reactjs,
  redux,
  tailwind,
  nodejs,
  mongodb,
  git,
  figma,
  docker,
  meta,
  starbucks,
  tesla,
  shopify,
  carrent,
  jobit,
  tripguide,
  threejs,
} from "../assets";

export const navLinks: TNavLink[] = [
  {
    id: "about",
    title: "About",
  },
  {
    id: "work",
    title: "Work",
  },
  {
    id: "contact",
    title: "Contact",
  },
];

const services: TService[] = [
  {
    title: "Backend Developer ",
    icon: web,
  },
  {
    title: "Data Scientist",
    icon: mobile,
  },
  {
    title: "ML & DL Model Developer",
    icon: backend,
  },
  {
    title: "Kaggler",
    icon: creator,
  },
];

const technologies: TTechnology[] = [
  {
    name: "HTML 5",
    icon: html,
  },
  {
    name: "CSS 3",
    icon: css,
  },
  {
    name: "JavaScript",
    icon: javascript,
  },
  {
    name: "TypeScript",
    icon: typescript,
  },
  {
    name: "React JS",
    icon: reactjs,
  },
  {
    name: "Redux Toolkit",
    icon: redux,
  },
  {
    name: "Tailwind CSS",
    icon: tailwind,
  },
  {
    name: "Node JS",
    icon: nodejs,
  },
  {
    name: "MongoDB",
    icon: mongodb,
  },
  {
    name: "Three JS",
    icon: threejs,
  },
  {
    name: "git",
    icon: git,
  },
  {
    name: "figma",
    icon: figma,
  },
  {
    name: "docker",
    icon: docker,
  },
];

const experiences: TExperience[] = [
  {
    title: "Python Developer",
    companyName: "Python",
    icon: starbucks,
    iconBg: "#383E56",
    date: "May 2021 -- March 2022",
    points: [
      "Initiated Python programming by developing foundational projects to establish a solid understanding of the language.",
      "Progressed to designing and implementing more sophisticated projects, mastering key Python libraries and advanced file handling techniques.",
      "Gained expertise in integrating databases with Python to create dynamic, real-time applications.",
      "Engaged in industry events and workshops to further enhance technical knowledge and stay informed on emerging trends and best practices.",
    ],
  },
  {
    title: "Backend Developer",
    companyName: "Python, Java",
    icon: tesla,
    iconBg: "#E6DEDD",
    date: "March 2022 -- Dec 2023",
    points: [
      "Developing and maintaining web applications utilizing Flask and FastAPI to deliver robust and scalable solutions.",
      "Collaborating with cross-functional teams, including frontend developers, associate engineers, and other stakeholders, to deliver high-quality products.",
      "Designing and deploying a range of applications tailored to address societal needs and improve user experience.  ",
      "Actively contributing to discussions on various platforms, offering solutions to complex challenges and fostering collaborative problem-solving.",
    ],
  },
  {
    title: "Data Scientist",
    companyName: "Data Science",
    icon: shopify,
    iconBg: "#383E56",
    date: "Dec 2023 -- Nov 2024",
    points: [
      "Utilizing a wide range of Python libraries to analyze and visualize data, transforming raw information into actionable insights.",
      "Applying advanced algorithms to preprocess data and extract meaningful patterns and insights.",
      "Implementing various machine learning models to uncover the underlying truth within datasets and drive data-driven decisions.",
      "Actively engaging in code reviews, offering constructive feedback to peers, and fostering a culture of continuous improvement across multiple platforms.",
    ],
  },
  {
    title: "ML and DL Developer",
    companyName: "Artificial Intelligence",
    icon: meta,
    iconBg: "#E6DEDD",
    date: "Nov 2024 -- Present Day",
    points: [
      "Developing and fine-tuning various predictive and classification models to address complex data challenges.",
      "Collaborating with data science professionals on platforms like Kaggle to discuss model strategies and identify the optimal solutions for specific problems.",
      "Implementing machine learning (ML) and deep learning (DL) models in various competitions on Kaggle and other platforms to showcase and refine skills.",
      "Actively participating in code reviews, offering constructive feedback, and contributing to the improvement of solutions, primarily on Kaggle.",
    ],
  },
];

const testimonials: TTestimonial[] = [
  {
    testimonial:
      "I thought it was impossible to make a website as beautiful as our product, but Rick proved me wrong.",
    name: "Sara Lee",
    designation: "CFO",
    company: "Acme Co",
    image: "https://randomuser.me/api/portraits/women/4.jpg",
  },
  {
    testimonial:
      "I've never met a web developer who truly cares about their clients' success like Rick does.",
    name: "Chris Brown",
    designation: "COO",
    company: "DEF Corp",
    image: "https://randomuser.me/api/portraits/men/5.jpg",
  },
  {
    testimonial:
      "After Rick optimized our website, our traffic increased by 50%. We can't thank them enough!",
    name: "Lisa Wang",
    designation: "CTO",
    company: "456 Enterprises",
    image: "https://randomuser.me/api/portraits/women/6.jpg",
  },
];

const projects: TProject[] = [
  {
    name: "CV Attendance System",
    description:
      "A CV-based attendance system that uses facial recognition to accurately and efficiently mark attendance, enhancing security and reducing manual effort in educational and workplace environments.",
    tags: [
      {
        name: "python",
        color: "blue-text-gradient",
      },
      {
        name: "flask",
        color: "green-text-gradient",
      },
      {
        name: "opencv",
        color: "pink-text-gradient",
      },
    ],
    image: carrent,
    sourceCodeLink: "https://github.com/YogiramV/CV_Attendance",
  },
  {
    name: "Spam Classifier",
    description:
      "An email and message spam classifier using machine learning to filter spam, enhance communication, and protect users from phishing, with continuous learning for better accuracy.",
    tags: [
      {
        name: "python",
        color: "blue-text-gradient",
      },
      {
        name: "datascience",
        color: "green-text-gradient",
      },
      {
        name: "machinelearning",
        color: "pink-text-gradient",
      },
    ],
    image: jobit,
    sourceCodeLink: "https://github.com/YusufDeesawala/Spam_Classification",
  },
  {
    name: "Platformer Game",
    description:
      "A simple yet fun Python platformer game built with Pygame and deployed on PyPI. It features engaging gameplay, vibrant graphics, and smooth controls, offering an enjoyable experience for players of all ages.",
    tags: [
      {
        name: "pyton",
        color: "blue-text-gradient",
      },
      {
        name: "pypi",
        color: "green-text-gradient",
      },
      {
        name: "pygames",
        color: "pink-text-gradient",
      },
    ],
    image: tripguide,
    sourceCodeLink: "https://pypi.org/project/TheOGPlatformer/",
  },
];

export { services, technologies, experiences, testimonials, projects };

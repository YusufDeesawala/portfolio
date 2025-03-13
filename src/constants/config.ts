type TSection = {
  p: string;
  h2: string;
  content?: string;
};

type TConfig = {
  html: {
    title: string;
    fullName: string;
    email: string;
  };
  hero: {
    name: string;
    p: string[];
  };
  contact: {
    form: {
      name: {
        span: string;
        placeholder: string;
      };
      email: {
        span: string;
        placeholder: string;
      };
      message: {
        span: string;
        placeholder: string;
      };
    };
  } & TSection;
  sections: {
    about: Required<TSection>;
    experience: TSection;
    feedbacks: TSection;
    works: Required<TSection>;
  };
};

export const config: TConfig = {
  html: {
    title: "Yusuf Deesawala - Portfolio",
    fullName: "Yusuf Deesawala",
    email: "yusufdeesawala72@hmail.com",
  },
  hero: {
    name: "Yusuf Deesawala",
    p: ["I develop ML and DL models,", "Datasciece algorithms and strategies."],
  },
  contact: {
    p: "Drop a line.",
    h2: "Contact.",
    form: {
      name: {
        span: "Your alias",
        placeholder: "What should I call you?",
      },
      email: { span: "Your inbox coordinates", placeholder: "What’s your inbox address?" },
      message: {
        span: "Your note",
        placeholder: "What’s on your mind?",
      },
    },
  },
  sections: {
    about: {
      p: "Introduction",
      h2: "Overview.",
      content: `I am a skilled Python AI, ML, and DL developer with a strong background 
      in data science, and I've had the opportunity to collaborate on many projects. 
      I also have a solid foundation in languages like JavaScript, Java, and Rust, 
      and I’m familiar with frameworks like Flask, Django, React, Node, and Express. 
      As an aspiring AI and ML developer, I'm always eager to grow my knowledge in this field.`,
    },
    experience: {
      p: "My journey.",
      h2: "Learning Experience.",
    },
    feedbacks: {
      p: "What others say",
      h2: "Testimonials.",
    },
    works: {
      p: "My work",
      h2: "Projects.",
      content: `Following projects showcases my skills and experience through
    real-world examples of my work. Each project is briefly described with
    links to code repositories. It reflects my ability to solve complex problems,
    work with different technologies, and manage projects effectively.`,
    },
  },
};

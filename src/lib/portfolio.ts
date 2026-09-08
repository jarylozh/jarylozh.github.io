import data from "../../content/portfolio.json";

export type Skill = {
  label: string;
  value: string;
};

export type Role = {
  title: string;
  bullets: string[];
};

export type Experience = {
  company: string;
  location: string;
  period: string;
  roles: Role[];
};

export type Module = {
  name: string;
  status: string;
};

export type Education = {
  institution: string;
  program: string;
  period: string;
  modules: Module[];
};

export type Certification = {
  name: string;
  issuer: string;
  period: string;
  credentialUrl: string | null;
};

export type Project = {
  name: string;
  context: string;
  role: string;
  link: string;
  description: string;
  stack: string[];
  bullets: string[];
};

export type Portfolio = {
  profile: {
    name: string;
    title: string;
    location: string;
    careerStartYear: number;
    summary: string;
    links: {
      email: string;
      linkedin: string;
      resume: string;
    };
  };
  skills: Skill[];
  experience: Experience[];
  education: Education[];
  certifications: Certification[];
  projects: Project[];
};

export const portfolio = data as Portfolio;

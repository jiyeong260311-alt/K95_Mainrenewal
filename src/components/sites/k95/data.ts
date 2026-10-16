import projectData from "./projects.json";
export const projects = projectData;
export type Project = (typeof projects)[number];
export const categories = ["All", "Branding", "Packaging", "Editorial", "Web Design", "Type Design"];
export const logo = "/sites/k95/Logo_286f9ecac6.svg";

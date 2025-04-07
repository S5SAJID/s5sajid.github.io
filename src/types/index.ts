export interface Project {
    type: string;
    title: string;
    description: string;
    skills: string[];
    previewUrl?: string;
    caseStudyUrl?: string;
}

export interface BlogPost {
    category: string;
    title: string;
    description: string;
    date: string;
    readTime: string;
    url?: string;
}

export interface TimelineItem {
    title: string;
    company: string;
    period: string;
    description: string;
}

export interface SocialLink {
    name: string;
    url: string;
    icon: string;
}

export interface NavLink {
    text: string;
    href: string;
    isExternal?: boolean;
}

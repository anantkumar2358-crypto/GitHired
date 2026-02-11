"use client";
import { motion } from 'motion/react';
import { ExternalLink, Github, ArrowRight } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import ThreeDCarousel from '../ThreeDCarousel';
import { getProjectBackgroundImage } from '@/lib/project-utils';

interface Project {
    title: string;
    description: string;
    image?: string;
    tags: string[];
    links: {
        demo?: string;
        repo?: string;
    };
    featured?: boolean;
}

interface FeaturedWorkProps {
    projects: Project[];
    username: string; // for image placeholder generation
}

export function FeaturedWork({ projects, username }: FeaturedWorkProps) {
    // Don't render if no projects
    if (!projects || projects.length === 0) return null;

    const displayProjects = projects;

    const carouselItems = projects.map((project, index) => ({
        id: index,
        title: project.title,
        brand: project.tags[0] || "Project", // Use first tag as "brand" or category
        description: project.description,
        tags: project.tags,
        imageUrl: project.image || getProjectBackgroundImage(project.tags),
        link: project.links.demo || project.links.repo || "#"
    }));

    return (
        <section id="work" className="relative px-6 py-24 bg-neutral-50 dark:bg-neutral-900 overflow-hidden">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-0"
                >
                    <h2 className="text-5xl mb-4 text-neutral-900 font-bold dark:text-white">
                        Featured Work
                    </h2>
                    <p className="text-neutral-600 text-lg dark:text-neutral-400">
                        Showcasing recent projects that solve real-world problems
                    </p>
                </motion.div>

                <div className="mt-8">
                    <ThreeDCarousel
                        items={carouselItems}
                        rotateInterval={3000} // Increased slightly for better viewing
                        title="My Projects"
                        subtitle="Featured Work"
                        tagline="Explore my latest work"
                    />
                </div>
            </div>
        </section>
    );
}

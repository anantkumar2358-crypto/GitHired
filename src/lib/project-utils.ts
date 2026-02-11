
export function getProjectBackgroundImage(tags: string[]): string {
    const lowerTags = tags.map(t => t.toLowerCase());

    if (lowerTags.some(t => ['react', 'next.js', 'vue', 'frontend', 'web', 'html', 'css', 'javascript', 'typescript'].includes(t))) {
        return '/images/projects/web.jpg';
    }
    if (lowerTags.some(t => ['node.js', 'express', 'backend', 'database', 'sql', 'mongodb', 'postgresql', 'api'].includes(t))) {
        return '/images/projects/backend.jpg';
    }
    if (lowerTags.some(t => ['cli', 'terminal', 'bash', 'shell', 'script'].includes(t))) {
        return '/images/projects/cli.jpg';
    }
    if (lowerTags.some(t => ['android', 'ios', 'flutter', 'react native', 'mobile'].includes(t))) {
        return '/images/projects/mobile.jpg';
    }
    if (lowerTags.some(t => ['ai', 'ml', 'machine learning', 'python', 'data science'].includes(t))) {
        return '/images/projects/ai.jpg';
    }

    return '/images/projects/generic.jpg';
}

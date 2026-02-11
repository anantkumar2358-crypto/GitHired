"use client";

import React from "react";
import { motion } from "framer-motion";
import { Globe2, MessageSquare, CornerDownRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ContactSectionProps {
    userData: any;
}

export const ContactSection = ({ userData }: ContactSectionProps) => {
    const contactString = userData?.personalInfo?.email || "hello@example.com";
    const location = userData?.personalInfo?.location || "Remote";

    // Extract actual email if contact string contains multiple items (like phone number)
    const emailMatch = contactString.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi);
    const validEmail = emailMatch ? emailMatch[0] : "hello@example.com";

    // Use the contact string for display if it's short enough, otherwise use the valid email
    // But for the link, always use the valid email.
    // The user screenshot showed "Number, Email", let's display that but link only email.

    const [name, setName] = React.useState("");
    const [userEmail, setUserEmail] = React.useState("");
    const [message, setMessage] = React.useState("");

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        const subject = `Contact from ${name}`;
        const body = `Name: ${name}%0D%0AEmail: ${userEmail}%0D%0A%0D%0A${message}`;
        window.location.href = `mailto:${validEmail}?subject=${encodeURIComponent(subject)}&body=${body}`;
    };

    return (
        <section className="py-24 bg-background px-4" id="contact">
            <div className="container mx-auto max-w-7xl">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-start">
                    {/* Content Section */}
                    <div>
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            className="mb-4"
                        >
                            <Badge variant="outline" className="text-primary border-primary/20 font-black uppercase tracking-[0.2em] text-[10px] px-3 py-1">
                                Contact Us
                            </Badge>
                        </motion.div>
                        <h2 className="text-5xl md:text-7xl font-black mb-12 tracking-tighter leading-[0.9]">
                            Let's build <br /> something <span className="text-primary italic">iconic.</span>
                        </h2>

                        <div className="space-y-12">
                            <div className="group cursor-pointer">
                                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-4 block group-hover:text-primary transition-colors">Start a conversation</span>
                                <div className="flex items-center gap-4">
                                    <MessageSquare className="w-6 h-6 text-primary" />
                                    <h3 className="text-2xl font-black tracking-tight border-b-2 border-border/40 pb-1 group-hover:border-primary transition-all">
                                        <a href={`mailto:${validEmail}`}>{contactString}</a>
                                    </h3>
                                </div>
                            </div>

                            <div className="group cursor-pointer">
                                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-4 block group-hover:text-primary transition-colors">Based in</span>
                                <div className="flex items-center gap-4">
                                    <Globe2 className="w-6 h-6 text-primary" />
                                    <h3 className="text-2xl font-black tracking-tight border-b-2 border-border/40 pb-1 group-hover:border-primary transition-all">{location}</h3>
                                </div>
                            </div>
                        </div>

                        <div className="mt-20 pt-20 border-t border-border/40">
                            <div className="flex items-center gap-4 text-muted-foreground italic">
                                <CornerDownRight className="w-5 h-5" />
                                <p className="text-sm">Response time: Usually within 24 hours.</p>
                            </div>
                        </div>
                    </div>

                    {/* Form Section */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                    >
                        <Card className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-[3rem] shadow-2xl overflow-hidden">
                            <CardContent className="p-10 lg:p-14">
                                <form className="space-y-8" onSubmit={handleSendMessage}>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-4">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Full Name</label>
                                            <Input
                                                type="text"
                                                placeholder="Your Name"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                className="w-full bg-white/5 border-white/10 text-white placeholder:text-gray-500 rounded-2xl px-6 h-14 outline-none focus-visible:ring-primary focus-visible:border-primary transition-all font-medium backdrop-blur-sm"
                                            />
                                        </div>
                                        <div className="space-y-4">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Email Address</label>
                                            <Input
                                                type="email"
                                                placeholder="john@example.com"
                                                value={userEmail}
                                                onChange={(e) => setUserEmail(e.target.value)}
                                                className="w-full bg-white/5 border-white/10 text-white placeholder:text-gray-500 rounded-2xl px-6 h-14 outline-none focus-visible:ring-primary focus-visible:border-primary transition-all font-medium backdrop-blur-sm"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">How can help?</label>
                                        <Textarea
                                            rows={4}
                                            placeholder="Tell me about your project..."
                                            value={message}
                                            onChange={(e) => setMessage(e.target.value)}
                                            className="w-full bg-white/5 border-white/10 text-white placeholder:text-gray-500 rounded-3xl px-6 py-4 outline-none focus-visible:ring-primary focus-visible:border-primary transition-all font-medium resize-none backdrop-blur-sm"
                                        />
                                    </div>
                                    <Button type="submit" className="w-full py-8 text-md bg-primary text-primary-foreground hover:bg-primary/90 font-black rounded-[2rem] transition-all active:scale-[0.98] uppercase tracking-[0.2em] shadow-xl shadow-primary/20">
                                        Send Message
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

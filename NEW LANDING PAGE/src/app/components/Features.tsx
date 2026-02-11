import { motion, useInView } from 'motion/react';
import { useRef } from 'react';
import { 
  Palette, 
  Zap, 
  Smartphone, 
  Code, 
  Lock, 
  Cloud,
  Sparkles,
  Layout
} from 'lucide-react';

const features = [
  {
    icon: Palette,
    title: 'Beautiful Templates',
    description: 'Choose from stunning, professionally designed templates that make your portfolio stand out.',
    gradient: 'from-blue-600 to-slate-700',
  },
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Optimized for performance with blazing fast load times and smooth animations.',
    gradient: 'from-slate-600 to-blue-600',
  },
  {
    icon: Smartphone,
    title: 'Fully Responsive',
    description: 'Your portfolio looks perfect on any device, from mobile phones to desktop screens.',
    gradient: 'from-blue-600 to-indigo-600',
  },
  {
    icon: Code,
    title: 'Easy Customization',
    description: 'Customize every aspect of your portfolio with our intuitive drag-and-drop editor.',
    gradient: 'from-emerald-600 to-teal-600',
  },
  {
    icon: Lock,
    title: 'Secure & Reliable',
    description: 'Enterprise-grade security ensures your data is always safe and protected.',
    gradient: 'from-slate-700 to-slate-600',
  },
  {
    icon: Cloud,
    title: 'Cloud Powered',
    description: 'Your portfolio is hosted on our global CDN for maximum availability and speed.',
    gradient: 'from-indigo-600 to-blue-600',
  },
  {
    icon: Sparkles,
    title: 'AI-Powered',
    description: 'Smart suggestions and automated optimizations powered by artificial intelligence.',
    gradient: 'from-blue-700 to-indigo-700',
  },
  {
    icon: Layout,
    title: 'Modern Design',
    description: 'Built with the latest design trends and best practices for a contemporary look.',
    gradient: 'from-slate-600 to-blue-700',
  },
];

export function Features() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="features" ref={ref} className="relative py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.h2
            className="text-4xl md:text-6xl font-bold mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Powerful{' '}
            <span className="bg-gradient-to-r from-blue-600 to-slate-700 bg-clip-text text-transparent">
              Features
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto"
          >
            Everything you need to create a stunning portfolio that showcases your work
            and attracts opportunities.
          </motion.p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ 
                  y: -10,
                  transition: { duration: 0.2 }
                }}
                className="relative group"
              >
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="relative h-full p-6 rounded-2xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-slate-200 dark:border-slate-700 shadow-lg overflow-hidden"
                >
                  {/* Gradient overlay on hover */}
                  <motion.div
                    className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
                  />

                  <motion.div
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 shadow-lg`}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </motion.div>

                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    {feature.description}
                  </p>

                  {/* Animated corner accent */}
                  <motion.div
                    className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 blur-2xl transition-opacity duration-300`}
                  />
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
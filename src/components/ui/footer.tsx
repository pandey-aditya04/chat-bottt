"use client"
import { motion } from "framer-motion"
import { Link } from "react-router-dom"

// Animation variants for reusability
const containerVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: "easeOut",
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
}

const linkVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
}

const socialVariants = {
  hidden: { opacity: 0, scale: 0 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 200,
      damping: 10,
    },
  },
}

const backgroundVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 2,
      ease: "easeOut",
    },
  },
}

// Footer data for better maintainability
const footerData = {
  sections: [
    { title: "Platform", links: ["Features", "Pricing", "Live Demo", "Chat Widget"] },
    { title: "Company", links: ["About Us", "Our Mission", "Careers", "Contact"] },
    { title: "Resources", links: ["Documentation", "API Reference", "System Status", "Blog"] },
    { title: "Legal", links: ["Privacy Policy", "Terms of Service", "Cookie Policy", "Security"] },
  ],
  social: [
    { href: "#", label: "Twitter", icon: "𝕏" },
    { href: "#", label: "GitHub", icon: "G" },
    { href: "#", label: "LinkedIn", icon: "in" },
  ],
  title: "ChatBot Builder",
  subtitle: "Elevating support with artificial intelligence",
  copyright: `©${new Date().getFullYear()} ChatBot Builder. All rights reserved.`,
}

// Reusable components
const NavSection = ({ title, links, index }: { title: string; links: string[]; index: number }) => (
  <motion.div variants={itemVariants} custom={index} className="flex flex-col gap-2">
    <motion.h3
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
      className="mb-2 uppercase text-text-secondary text-xs font-semibold tracking-widest border-b border-border pb-1 hover:text-text-primary transition-colors duration-300"
    >
      {title}
    </motion.h3>
    {links.map((link, linkIndex) => (
      <motion.a
        key={linkIndex}
        variants={linkVariants}
        custom={linkIndex}
        href={`#${link.toLowerCase().replace(/\s+/g, '-')}`}
        whileHover={{
          x: 8,
          transition: { type: "spring", stiffness: 300, damping: 20 },
        }}
        className="text-text-secondary hover:text-brand transition-colors duration-300 font-sans text-xs md:text-sm group relative w-fit"
      >
        <span className="relative">
          {link}
          <motion.span
            className="absolute bottom-0 left-0 h-0.5 bg-brand"
            initial={{ width: 0 }}
            whileHover={{ width: "100%" }}
            transition={{ duration: 0.3 }}
          />
        </span>
      </motion.a>
    ))}
  </motion.div>
)

const SocialLink = ({ href, label, icon, index }: { href: string; label: string; icon: string; index: number }) => (
  <motion.a
    variants={socialVariants}
    custom={index}
    href={href}
    whileHover={{
      scale: 1.2,
      rotate: 12,
      transition: { type: "spring", stiffness: 300, damping: 15 },
    }}
    whileTap={{ scale: 0.9 }}
    className="w-8 h-8 rounded-full bg-surface-raised border border-border hover:border-brand flex items-center justify-center transition-all duration-300 group"
    aria-label={label}
  >
    <motion.span
      className="text-xs md:text-sm font-bold text-text-secondary group-hover:text-brand"
      whileHover={{ scale: 1.1 }}
    >
      {icon}
    </motion.span>
  </motion.a>
)

export default function StickyFooter() {
  return (
    <div className="relative h-[800px] md:h-[550px] bg-surface" style={{ clipPath: "polygon(0% 0, 100% 0%, 100% 100%, 0 100%)" }}>
      <div className="relative h-[calc(100vh+800px)] md:h-[calc(100vh+550px)] -top-[100vh]">
        <div className="h-[800px] md:h-[550px] sticky top-[calc(100vh-800px)] md:top-[calc(100vh-550px)]">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
            className="bg-gradient-to-br from-surface via-surface-raised to-surface py-16 px-6 md:px-12 h-full w-full flex flex-col justify-between relative overflow-hidden border-t border-border"
          >
            {/* Animated Background Elements */}
            <div className="absolute inset-0 bg-gradient-to-t from-brand/5 to-transparent pointer-events-none" />

            <motion.div
              variants={backgroundVariants}
              className="absolute top-0 right-0 w-64 h-64 md:w-96 md:h-96 bg-brand/5 rounded-full blur-3xl"
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: 4,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            />

            {/* Navigation Section */}
            <motion.div variants={containerVariants} className="relative z-10">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
                {footerData.sections.map((section, index) => (
                  <NavSection key={section.title} title={section.title} links={section.links} index={index} />
                ))}
              </div>
            </motion.div>

            {/* Footer Bottom Section */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
              className="flex flex-col md:flex-row justify-between items-start md:items-end relative z-10 gap-8 md:gap-6 mt-8"
            >
              <div className="flex-1">
                <motion.h1
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7, duration: 0.8, ease: "easeOut" }}
                  whileHover={{
                    scale: 1.02,
                    transition: { type: "spring", stiffness: 300, damping: 20 },
                  }}
                  className="text-[12vw] md:text-[8vw] lg:text-[6vw] leading-[0.8] font-black bg-gradient-to-r from-brand via-text-primary to-brand/60 bg-clip-text text-transparent cursor-default tracking-tighter"
                >
                  {footerData.title}
                </motion.h1>

                <motion.div
                  initial={{ opacity: 0, width: 0 }}
                  whileInView={{ opacity: 1, width: "auto" }}
                  transition={{ delay: 1, duration: 0.6 }}
                  className="flex items-center gap-4 mt-6"
                >
                  <motion.div
                    className="w-12 h-0.5 bg-gradient-to-r from-brand to-accent"
                    animate={{
                      scaleX: [1, 1.2, 1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "easeInOut",
                    }}
                  />
                  <motion.p
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: 1.2, duration: 0.5 }}
                    className="text-text-secondary text-xs md:text-sm font-medium hover:text-text-primary transition-colors duration-300 uppercase tracking-widest"
                  >
                    {footerData.subtitle}
                  </motion.p>
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.4, duration: 0.6 }}
                className="text-left md:text-right"
              >
                <motion.p
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: 1.6, duration: 0.5 }}
                  className="text-text-secondary text-xs md:text-sm mb-4 hover:text-text-primary transition-colors duration-300"
                >
                  {footerData.copyright}
                </motion.p>

                <motion.div
                  variants={containerVariants}
                  className="flex gap-3 justify-start md:justify-end"
                >
                  {footerData.social.map((social, index) => (
                    <SocialLink
                      key={social.label}
                      href={social.href}
                      label={social.label}
                      icon={social.icon}
                      index={index}
                    />
                  ))}
                </motion.div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

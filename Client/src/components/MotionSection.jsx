import { motion } from "framer-motion";

const sectionVariants = {
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] }
  }
};

export default function MotionSection({ as = "section", className = "", children }) {
  const Component = motion[as] ?? motion.section;

  return (
    <Component
      className={className}
      variants={sectionVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
    >
      {children}
    </Component>
  );
}

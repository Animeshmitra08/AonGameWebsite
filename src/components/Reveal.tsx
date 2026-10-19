import { m, type HTMLMotionProps } from 'framer-motion';

type RevealProps = HTMLMotionProps<'div'> & {
  delay?: number;
  /** vertical travel in px before the element settles */
  y?: number;
};

/**
 * Fades and lifts its children into place the first time they scroll into view.
 * Transforms are dropped automatically for reduced-motion users via <MotionConfig>.
 */
export default function Reveal({ delay = 0, y = 28, children, ...rest }: RevealProps) {
  return (
    <m.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -60px 0px' }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      {...rest}
    >
      {children}
    </m.div>
  );
}

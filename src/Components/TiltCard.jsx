import React, { useRef } from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
} from "framer-motion";

const ROTATION_RANGE = 32.5; // اقصي زاويه ميل
const HALF_ROTATION_RANGE = ROTATION_RANGE / 2; // هنقسمها بالنص علشان الميل يبدا من النص

const TiltCard = ({ children, className = "" }) => {
  const ref = useRef(null); // create reference---> علشان تعرف ابعاد الكارد في الصفحه

  const x = useMotionValue(0); //زاويه الميل علي المحور X
  const y = useMotionValue(0); //زاويه الميل علي المحور y

  const xSpring = useSpring(x); // animation smooth on X
  const ySpring = useSpring(y);

  const transform = useMotionTemplate`rotateX(${xSpring}deg) rotateY(${ySpring}deg)`; // دا اللي هيتطبق كانيميشن علي الكارد

  // if mouse move
  const handleMouseMove = (e) => {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const mouseX = (e.clientX - rect.left) * ROTATION_RANGE;
    const mouseY = (e.clientY - rect.top) * ROTATION_RANGE;

    const rX = (mouseY / rect.height - HALF_ROTATION_RANGE) * -1;
    const rY = mouseX / rect.width - HALF_ROTATION_RANGE;

    x.set(rX);
    y.set(rY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transformStyle: "preserve-3d", // (3D) مهم علشان يتحول
        transform,
      }}
      className={`rounded-xl ${className}`}
    >
      {children}
    </motion.div>
  );
};

export default TiltCard;

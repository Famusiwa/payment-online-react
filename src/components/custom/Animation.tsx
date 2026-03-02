import { motion } from "framer-motion";

type Direction = "up" | "down" | "left" | "right";

export const FadeIn: React.FC<
  React.PropsWithChildren<{
    delay?: number;
    duration?: number;
    direction?: Direction;
    distance?: number;
  }>
> = ({
  children,
  delay = 0,
  duration = 0.5,
  direction = "up",
  distance = 30,
}) => {
  let initial = { opacity: 0 } as any;
  let exit = { opacity: 0 } as any;

  switch (direction) {
    case "up":
      initial.y = distance;
      exit.y = distance;
      break;
    case "down":
      initial.y = -distance;
      exit.y = -distance;
      break;
    case "left":
      initial.x = distance;
      exit.x = distance;
      break;
    case "right":
      initial.x = -distance;
      exit.x = -distance;
      break;
    default:
      initial.y = distance;
      exit.y = distance;
  }

  return (
    <motion.div
      initial={initial}
      animate={{ opacity: 1, x: 0, y: 0 }}
      exit={exit}
      transition={{ delay, duration }}
    >
      {children}
    </motion.div>
  );
};

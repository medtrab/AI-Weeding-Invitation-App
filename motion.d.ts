import React from "react";
import { MotionProps } from "framer-motion";

declare module "framer-motion" {
  interface MotionProps {
    children?: React.ReactNode;
  }
}

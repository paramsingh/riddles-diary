import { ReactNode } from "react";
import "animate.css";
import { FADE_IN_TIME } from "@/pages";

export default function FadeIn({
  children,
  ...props
}: {
  children: ReactNode;
}) {
  return (
    <div
      className="animate__animated animate__fadeIn"
      style={{
        animationDuration: (FADE_IN_TIME / 1000).toString() + "s",
        flex: "0 0 25%",
      }}
      {...props}
    >
      {children}
    </div>
  );
}

import { ReactNode } from "react";
import "animate.css";
import { FADE_OUT_TIME } from "@/pages";

export default function FadeOut({
  children,
  ...props
}: {
  children: ReactNode;
}) {
  return (
    <div
      className="animate__animated animate__fadeOut"
      style={{
        animationDuration: (FADE_OUT_TIME / 1000).toString() + "s",
        flex: "0 0 25%",
      }}
      {...props}
    >
      {children}
    </div>
  );
}

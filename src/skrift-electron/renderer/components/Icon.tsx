import React from "react";

// All icons are from Font Awesome

const icons = {
  "ellipsis-h": (
    <path
      fill="currentColor"
      d="M328 256c0 39.8-32.2 72-72 72s-72-32.2-72-72 32.2-72 72-72 72 32.2 72 72zm104-72c-39.8 0-72 32.2-72 72s32.2 72 72 72 72-32.2 72-72-32.2-72-72-72zm-352 0c-39.8 0-72 32.2-72 72s32.2 72 72 72 72-32.2 72-72-32.2-72-72-72z"
    ></path>
  ),
};

type Props = {
  name: keyof typeof icons;
  className?: string;
};

export const Icon: React.FC<Props> = ({ name, className }) => {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      data-prefix="fas"
      data-icon="ellipsis-h"
      className={className}
      role="img"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
    >
      {icons[name]}
    </svg>
  );
};

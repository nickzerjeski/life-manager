import React from "react";

type StatusType = "running" | "attention" | "not_started" | "failed";

interface StatusIndicatorProps {
  status: StatusType;
}

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({ status }) => {
  const config: Record<
    StatusType,
    { text: string; outer: string; dot: string }
  > = {
    running: {
      text: "Running",
      outer:
        "inline-flex items-center bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-green-900 dark:text-green-300 animate-pulse",
      dot: "w-2 h-2 me-1 bg-green-500 rounded-full",
    },
    attention: {
      text: "Needing Attention",
      outer:
        "inline-flex items-center bg-orange-100 text-orange-800 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-orange-900 dark:text-orange-300",
      dot: "w-2 h-2 me-1 bg-orange-500 rounded-full",
    },
    not_started: {
      text: "Not Started",
      outer:
        "inline-flex items-center bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-gray-900 dark:text-gray-300",
      dot: "w-2 h-2 me-1 bg-gray-500 rounded-full",
    },
    failed: {
      text: "Failed",
      outer:
        "inline-flex items-center bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-red-900 dark:text-red-300",
      dot: "w-2 h-2 me-1 bg-red-500 rounded-full",
    },
  };

  const { text, outer, dot } = config[status];

  return (
    <span className={outer}>
      <span className={dot}></span>
      {text}
    </span>
  );
};

import clsx from "clsx";
import React, { useCallback, useState } from "react";

export const Feedback: React.FC = () => {
  const [open, setOpen] = useState(false);

  const handleToggleOpen = useCallback(() => setOpen(!open), [setOpen, open]);

  return (
    <div className="absolute bottom-4 right-4 z-50">
      <div
        className={clsx("bg-white rounded-lg shadow w-80 mb-2 p-2", {
          hidden: !open,
        })}
      >
        <div>
          <label>
            Email
            <br />
            <input
              type="email"
              className="w-full border border-gray-200 rounded"
            ></input>
          </label>
        </div>

        <div>
          <label>
            Message
            <br />
            <textarea className="w-full border border-gray-200 rounded"></textarea>
          </label>
        </div>

        <div className="text-center">
          <input
            type="submit"
            value="Send feedback"
            className="rounded px-2 py-1"
          />
        </div>
      </div>

      <div className="text-right">
        <button
          onClick={handleToggleOpen}
          className={clsx(
            "rounded-lg px-2 py-1 shadow cursor-pointer",
            open ? "bg-gray-200" : "bg-white"
          )}
        >
          Feedback
        </button>
      </div>
    </div>
  );
};

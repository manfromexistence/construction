import { usePluginOption } from "platejs/react";
import React from "react";

import { DndPlugin } from "../../DndPlugin";
import { Scroller, type ScrollerProps } from "./Scroller";

export function DndScroller(props: Partial<ScrollerProps>) {
  const isDragging = usePluginOption(DndPlugin, "isDragging");

  const [show, setShow] = React.useState(false);

  React.useEffect(() => {
    if (isDragging) {
      const timeout = setTimeout(() => {
        setShow(true);
      }, 100);

      return () => clearTimeout(timeout);
    }

    setShow(false);
  }, [isDragging, show]);

  return <Scroller enabled={isDragging && show} {...props} />;
}

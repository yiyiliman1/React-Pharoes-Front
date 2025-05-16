import { Box, useScrollTrigger, Zoom } from "@mui/material";
import { forwardRef, useImperativeHandle } from "react";

interface FixedPosition {
  bottom: number;
  right: number;
}

interface Props {
  selector?: string;
  children: React.ReactElement;
  fixedPosition?: FixedPosition;
  toBottom?: boolean;
  threshold?: number;
}

export interface ScrollToRef {
  scroll: (behavior?: ScrollBehavior) => void;
}

export const ScrollTo = forwardRef((props: Props, ref) => {
  const { children, selector, threshold, fixedPosition, toBottom } = props;
  const scrollToBottom = toBottom ?? false;
  const scrollThreshold = threshold ?? 100;

  const target = !!selector ? document.querySelector(selector) : undefined;

  const trigger = useScrollTrigger({
    target: target || window,
    disableHysteresis: true,
    threshold: scrollThreshold,
  });

  const handleClick = (event?: React.MouseEvent<HTMLDivElement>, behavior?: ScrollBehavior) => {
    const amount = !!target 
      ? scrollToBottom 
        ? target.scrollHeight 
        : 0 
      : undefined;
    (target || window).scrollTo({
      behavior: behavior || "smooth",
      top: amount ?? document.body.scrollHeight
    });
  };

  useImperativeHandle(ref, () => ({
    scroll: (behavior?: ScrollBehavior) => handleClick(undefined, behavior),
  }));

  return (
    <Zoom in={trigger}>
      <Box
        onClick={handleClick}
        role="presentation"
        sx={
          !!fixedPosition ? { 
            position: 'fixed', 
            bottom: fixedPosition.bottom, 
            right: fixedPosition.right 
          } : undefined
        }>
        {children}
      </Box>
    </Zoom>
  );
})
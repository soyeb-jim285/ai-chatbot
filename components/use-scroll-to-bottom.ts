'use client';

import type React from 'react';

import { useCallback, useEffect, useRef } from 'react';

interface ScrollToBottomOptions {
  /**
   * The threshold in pixels from the bottom of the container
   * to trigger auto-scrolling.
   */
  threshold?: number;

  /**
   * Function that determines whether auto-scrolling should be enabled.
   * Return false to disable auto-scrolling.
   */
  shouldAutoScroll?: () => boolean;
}

export function useScrollToBottom<T extends HTMLElement>(
  options: ScrollToBottomOptions = {},
): [React.RefObject<T>, React.RefObject<HTMLDivElement>] {
  const { threshold = 100, shouldAutoScroll = () => true } = options;
  const containerRef = useRef<T>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const prevScrollHeightRef = useRef<number>(0);

  const scrollToBottom = useCallback(() => {
    if (!containerRef.current || !shouldAutoScroll()) return;

    const container = containerRef.current;
    const scrollHeight = container.scrollHeight;
    const clientHeight = container.clientHeight;
    const scrollTop = container.scrollTop;

    // Check if we're close to the bottom
    const isNearBottom = scrollHeight - (scrollTop + clientHeight) <= threshold;

    // If we're near the bottom, scroll to the bottom
    if (isNearBottom) {
      requestAnimationFrame(() => {
        if (containerRef.current) {
          containerRef.current.scrollTop = containerRef.current.scrollHeight;
        }
      });
    }
  }, [threshold, shouldAutoScroll]);

  // Scroll to bottom when new content is added
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new MutationObserver((mutations) => {
      // Check if we should auto-scroll
      if (!shouldAutoScroll()) return;

      const scrollHeight = container.scrollHeight;

      // Only scroll if content height has changed
      if (scrollHeight !== prevScrollHeightRef.current) {
        prevScrollHeightRef.current = scrollHeight;
        scrollToBottom();
      }
    });

    observer.observe(container, {
      childList: true,
      subtree: true,
      characterData: true,
    });

    return () => observer.disconnect();
  }, [scrollToBottom, shouldAutoScroll]);

  // Initial scroll to bottom
  useEffect(() => {
    if (!containerRef.current || !shouldAutoScroll()) return;

    const container = containerRef.current;
    container.scrollTop = container.scrollHeight;
    prevScrollHeightRef.current = container.scrollHeight;
  }, [shouldAutoScroll]);

  return [containerRef, bottomRef];
}

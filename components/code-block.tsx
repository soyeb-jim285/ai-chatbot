'use client';

import type React from 'react';

import { memo, useEffect, useMemo, useRef, useState } from 'react';
import { useTheme } from 'next-themes';
import { useCopyToClipboard } from 'usehooks-ts';
import { toast } from 'sonner';
import { EditorView } from '@codemirror/view';
import { EditorState, Transaction } from '@codemirror/state';
import { basicSetup } from 'codemirror';
import { oneDark } from '@codemirror/theme-one-dark';
import { javascript } from '@codemirror/lang-javascript';
import { python } from '@codemirror/lang-python';
import { html } from '@codemirror/lang-html';
import { css } from '@codemirror/lang-css';
import { json } from '@codemirror/lang-json';
import { markdown } from '@codemirror/lang-markdown';
import { cpp } from '@codemirror/lang-cpp';
import { java } from '@codemirror/lang-java';
import { rust } from '@codemirror/lang-rust';
import { sql } from '@codemirror/lang-sql';
import { php } from '@codemirror/lang-php';
import { xml } from '@codemirror/lang-xml';

// Simple, focused component that strictly differentiates between inline and block code
export const CodeBlock = memo(function CodeBlock({
  node,
  inline,
  className,
  children,
  ...props
}: {
  node?: any;
  inline?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  // If this is inline code (surrounded by backticks), render it with the specified styling
  // If this is inline code (surrounded by backticks), render it with the specified styling
  if (inline) {
    return (
      <code
        className="rounded-md bg-muted px-1 py-0.5 font-mono text-sm"
        {...props}
      >
        {children}
      </code>
    );
  }

  // For block code, use the enhanced block renderer
  return (
    <BlockCodeRenderer className={className} {...props}>
      {children}
    </BlockCodeRenderer>
  );
});

// Separate component for block code rendering
function BlockCodeRenderer({
  className,
  children,
  ...props
}: {
  className?: string;
  children: React.ReactNode;
}) {
  const [copied, setCopied] = useState(false);
  const [_, copyToClipboard] = useCopyToClipboard();
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<EditorView | null>(null);

  // Map of language identifiers to CodeMirror language support
  const languageMap = {
    js: javascript(),
    javascript: javascript(),
    jsx: javascript({ jsx: true }),
    ts: javascript({ typescript: true }),
    typescript: javascript({ typescript: true }),
    tsx: javascript({ jsx: true, typescript: true }),
    py: python(),
    python: python(),
    html: html(),
    css: css(),
    json: json(),
    md: markdown(),
    markdown: markdown(),
    cpp: cpp(),
    c: cpp(),
    'c++': cpp(),
    java: java(),
    rust: rust(),
    rs: rust(),
    sql: sql(),
    php: php(),
    xml: xml(),
    default: javascript(),
  };

  // Extract language from className
  const language = useMemo(() => {
    const match = /language-(\w+)/.exec(className || '');
    return match ? match[1] : 'text';
  }, [className]);

  // Process code content once
  const code = useMemo(() => {
    if (typeof children === 'string') return children;
    if (Array.isArray(children)) return children.join('');
    return '';
  }, [children]);

  // Mount detection
  useEffect(() => {
    setMounted(true);
    return () => {
      if (editorRef.current) {
        editorRef.current.destroy();
        editorRef.current = null;
      }
    };
  }, []);

  // Apply appropriate CSS variables based on theme
  useEffect(() => {
    const root = document.documentElement;
    if (resolvedTheme === 'dark') {
      root.style.setProperty('--code-bg', 'hsl(240, 10%, 5%)');
      root.style.setProperty('--code-border', 'hsl(240, 3.7%, 15.9%)');
      root.style.setProperty('--selection-bg', 'rgba(122, 162, 247, 0.3)');
      root.style.setProperty('--selection-text', 'hsl(0, 0%, 100%)');
    } else {
      root.style.setProperty('--code-bg', 'hsl(0, 0%, 97%)');
      root.style.setProperty('--code-border', 'hsl(240, 5.9%, 90%)');
      root.style.setProperty('--selection-bg', 'rgba(29, 84, 158, 0.4)');
      root.style.setProperty('--selection-text', 'hsl(0, 0%, 0%)');
    }
  }, [resolvedTheme]);

  // Enhanced theme extension for proper CodeMirror styling
  const cmTheme = EditorView.theme({
    '&': {
      height: '100%',
      width: '100%',
      flex: '1 1 auto',
      overflow: 'hidden',
      backgroundColor: 'var(--code-bg)',
      cursor: 'text',
      webkitUserSelect: 'text',
      userSelect: 'text',
    },
    '.cm-scroller': {
      overflow: 'auto',
      height: '100%',
      width: '100%',
      backgroundColor: 'inherit',
      fontFamily: 'var(--font-geist-mono, monospace)',
      webkitUserSelect: 'text',
      userSelect: 'text',
    },
    '.cm-content': {
      padding: '0.75rem 1rem',
      fontFamily: 'var(--font-geist-mono, monospace)',
      backgroundColor: 'inherit',
      fontSize: '0.9rem',
      lineHeight: '1.5',
      caretColor: 'transparent',
      webkitUserSelect: 'text',
      userSelect: 'text',
    },
    '.cm-cursor': {
      visibility: 'hidden',
    },
    '.cm-line': {
      backgroundColor: 'inherit',
      padding: '0 0.25rem',
      webkitUserSelect: 'text',
      userSelect: 'text',
    },
    '.cm-gutters': {
      backgroundColor: 'inherit',
      borderRight: '1px solid var(--code-border)',
      paddingRight: '8px',
    },
    '.cm-lineNumbers': {
      minWidth: '3em',
    },
    '&.cm-focused': {
      outline: 'none !important',
    },
    // Enhanced selection styling
    '.cm-selectionBackground, .cm-content ::selection': {
      background: 'var(--selection-bg) !important',
    },
    '.cm-selectionMatch': {
      backgroundColor: 'var(--selection-bg) !important',
    },
    // Global selection override to ensure proper styling
    '& ::selection': {
      backgroundColor: 'var(--selection-bg) !important',
      color: 'var(--selection-text) !important',
    },
    // Additional selection styles for proper highlighting
    '&.cm-editor .cm-line ::selection': {
      backgroundColor: 'var(--selection-bg) !important',
      color: 'var(--selection-text) !important',
    },
    '.cm-line span::selection': {
      backgroundColor: 'var(--selection-bg) !important',
      color: 'var(--selection-text) !important',
    },
  });
  // Initialize CodeMirror editor
  useEffect(() => {
    if (containerRef.current && !editorRef.current && mounted) {
      const languageSupport =
        languageMap[language as keyof typeof languageMap] ||
        languageMap.default;

      const startState = EditorState.create({
        doc: code,
        extensions: [
          basicSetup,
          languageSupport,
          resolvedTheme === 'dark' ? oneDark : [],
          EditorState.readOnly.of(true),
          EditorView.lineWrapping,
          cmTheme,
        ],
      });

      editorRef.current = new EditorView({
        state: startState,
        parent: containerRef.current,
      });

      // Add a class to the editor's parent element to enable selection
      if (containerRef.current.firstChild) {
        const editorElement = containerRef.current.firstChild as HTMLElement;
        editorElement.style.userSelect = 'text';
        editorElement.style.webkitUserSelect = 'text';
      }
    }
  }, [mounted, code, language, resolvedTheme]);

  // Update content when code changes
  useEffect(() => {
    if (editorRef.current && code) {
      const currentContent = editorRef.current.state.doc.toString();

      if (currentContent !== code) {
        const transaction = editorRef.current.state.update({
          changes: {
            from: 0,
            to: currentContent.length,
            insert: code,
          },
          annotations: [Transaction.remote.of(true)],
        });

        editorRef.current.dispatch(transaction);
      }
    }
  }, [code]);

  // Copy functionality
  const handleCopy = async () => {
    if (!code) {
      toast.error("There's no code to copy!");
      return;
    }

    await copyToClipboard(code);
    toast.success('Copied to clipboard!');
    setCopied(true);
    setTimeout(() => setCopied(false), 1000);
  };

  // Server-side or non-mounted rendering shows a simple placeholder
  if (typeof window === 'undefined' || !mounted) {
    return (
      <pre className="rounded-lg border border-zinc-200 dark:border-zinc-700 p-4 text-sm bg-zinc-50 dark:bg-zinc-900 my-4 overflow-x-auto">
        <code className="font-mono">{code}</code>
      </pre>
    );
  }

  return (
    <div className="not-prose relative my-4">
      <div
        className="rounded-lg border border-zinc-200 dark:border-zinc-700 w-full overflow-hidden bg-[var(--code-bg)] shadow-sm"
        style={{
          minHeight: '6rem',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div className="w-full flex items-center justify-between px-3 py-2 bg-[var(--code-bg)] border-b border-zinc-200 dark:border-zinc-700">
          {language !== 'text' && (
            <div className="text-xs px-2 py-1 font-mono rounded-md bg-zinc-200/80 dark:bg-zinc-700/80 text-zinc-600 dark:text-zinc-300">
              {language}
            </div>
          )}

          <button
            type="button"
            onClick={handleCopy}
            className="z-10 w-8 h-8 rounded-md bg-white/90 dark:bg-zinc-800/90 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 flex items-center justify-center ml-auto hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors"
            aria-label={copied ? 'Copied!' : 'Copy code'}
          >
            {copied ? (
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M20 6L9 17l-5-5" />
              </svg>
            ) : (
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
              </svg>
            )}
          </button>
        </div>

        <div
          ref={containerRef}
          className="w-full h-full bg-[var(--code-bg)] select-text"
          style={{
            flex: '1 1 auto',
            minHeight: '4rem',
            userSelect: 'text',
            WebkitUserSelect: 'text',
          }}
        />
      </div>
    </div>
  );
}

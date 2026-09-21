interface RichTextContentProps {
  html: string;
  className?: string;
}

export default function RichTextContent({ html, className = '' }: RichTextContentProps) {
  return (
    <div
      className={`prose-rupaiya text-sm text-secondary-text leading-relaxed ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

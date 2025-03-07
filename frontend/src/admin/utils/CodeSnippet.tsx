import { useState } from 'react';
import { Copy, ChevronDown, ChevronUp } from 'lucide-react';

interface CodeSnippetProps {
  data: any;
  title?: string;
}

const CodeSnippet: React.FC<CodeSnippetProps> = ({ data, title = "JSON Data" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(data, null, 2))
      .then(() => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000); // Reset after 2 seconds
      })
      .catch(err => console.error('Failed to copy:', err));
  };

  return (
    <div className="bg-white p-4 rounded-sm shadow-sm mb-6">
      <div 
        className="flex items-center justify-between cursor-pointer" 
        onClick={() => setIsOpen(!isOpen)}
      >
        <h3 className="text-xl font-medium text-gray-900">{title}</h3>
        <button className="bg-gray-200 p-1 rounded-sm hover:bg-gray-300 transition-colors">
          {isOpen ? <ChevronUp className="w-6 h-6" /> : <ChevronDown className="w-6 h-6" />}
        </button>
      </div>
      
      {isOpen && (
        <div className="mt-4 overflow-auto relative">
          <pre className="bg-gray-100 p-4 rounded-sm text-sm overflow-x-auto max-h-96">
            <button
              onClick={handleCopy}
              className="absolute top-2 right-2 sm:right-3 md:right-3 lg:right-4 xl:right-6 flex items-center gap-2 bg-gray-600 text-white px-3 py-1 rounded-sm hover:bg-gray-700 transition-colors"
              title='Copy to clipboard'
            >
              <Copy className="w-4 h-4" />
              {isCopied ? 'Copied!' : 'Copy'}
            </button>
            <code className="text-gray-800">
              {JSON.stringify(data, null, 2)}
            </code>
          </pre>
        </div>
      )}
    </div>
  );
};

export default CodeSnippet;
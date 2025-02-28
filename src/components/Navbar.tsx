import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="border-b">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold">
          Content Machine
        </Link>
        <div className="space-x-4">
          <Link 
            href="/guidelines" 
            className="px-4 py-2 hover:bg-gray-100 rounded-md"
          >
            Guidelines
          </Link>
          <Link 
            href="/library"
            className="px-4 py-2 hover:bg-gray-100 rounded-md"
          >
            Library
          </Link>
          <Link 
            href="/content"
            className="px-4 py-2 hover:bg-gray-100 rounded-md"
          >
            Content
          </Link>
        </div>
      </div>
    </nav>
  );
} 
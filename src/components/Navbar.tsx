import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="border-b border-border bg-white">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-xl font-semibold text-black hover:text-black/80">
            Kevon's Content Machine
          </Link>
          <div className="flex items-center space-x-1">
            <Link 
              href="/guidelines" 
              className="px-4 py-2 text-sm text-gray-600 hover:text-black rounded-lg hover:bg-gray-50"
            >
              Guidelines
            </Link>
            <Link 
              href="/library"
              className="px-4 py-2 text-sm text-gray-600 hover:text-black rounded-lg hover:bg-gray-50"
            >
              Library
            </Link>
            <Link 
              href="/content"
              className="px-4 py-2 text-sm text-gray-600 hover:text-black rounded-lg hover:bg-gray-50"
            >
              Content
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
} 
import { Link } from "@tanstack/react-router";
import { Github } from 'lucide-react';

export default function Header() {
  return (
    <>
      <header className="p-4 flex justify-between pr-8 items-center bg-gray-800 text-white shadow-lg">
        <h1 className="ml-4 text-xl font-semibold">
          <Link to="/">
           <h1 className="text-3xl">StartSmith</h1> 
          </Link>
        </h1>
        {/* TODO: add github repo link */}
        <span>
        <Github />
        </span>
      </header>
    </>
  );
}

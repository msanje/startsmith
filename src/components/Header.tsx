import { Link } from "@tanstack/react-router";
import { Github, Star } from "lucide-react";

export default function Header() {
	return (
		<header className="p-4 flex justify-between pr-8 items-center bg-gray-800 text-white shadow-lg">
			<h1 className="ml-4 text-xl font-semibold">
				<Link to="/">
					<h1 className="text-3xl">StartSmith</h1>
				</Link>
			</h1>
			{/* TODO: add github repo link */}

			<a
				target="_black"
				href="https://github.com/msanje/startsmith"
				rel="noopener noreferrer"
				className="cursor-pointer flex flex-row items-center gap-2"
			>
				{/* <Star className="w-4 h-4" /> */}
				<Github className="w-4 h-4" />
			</a>
		</header>
	);
}

"use client";

import { useEffect, useMemo, useState } from "react";

interface CodeViewProps {
	files: Record<string, string | undefined>;
}

export default function CodeView({ files }: CodeViewProps) {
	const fileNames = useMemo(() => Object.keys(files), [files]);
	const [active, setActive] = useState<string>(fileNames[0] ?? "");
	const [copied, setCopied] = useState<string | null>(null);

	useEffect(() => {
		if (fileNames.length === 0) {
			setActive("");
			return;
		}

		if (!fileNames.includes(active)) setActive(fileNames[0]);
	}, [fileNames, active]);

	if (fileNames.length === 0) {
		return (
			<div className="p-4 text-sm text-muted-foreground">
				No generated files yet — create a schema to see generated code.
			</div>
		);
	}

	const content = files[active] ?? "";
	const lineCount = content.split("\n").length;
	const byteSize = new Blob([content]).size;

	const handleCopy = async (text: string, fname: string) => {
		await navigator.clipboard.writeText(text);
		setCopied(fname);
		window.setTimeout(
			() => setCopied((cur) => (cur === fname ? null : cur)),
			2000,
		);
	};

	const handleDownload = (text: string, fname: string) => {
		const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = fname;
		document.body.appendChild(a);
		a.click();
		a.remove();
		URL.revokeObjectURL(url);
	};

	return (
		<div className="h-full flex flex-col">
			{/* Tabs */}
			<div className="flex items-center gap-2 border-b px-3">
				<div className="flex gap-1 py-2 overflow-x-auto">
					{fileNames.map((fn) => (
						<button
							type="button"
							key={fn}
							onClick={() => setActive(fn)}
							className={`px-3 py-1 rounded-t-md text-sm font-medium -mb-px ${
								fn === active
									? "bg-white border border-b-0"
									: "text-muted-foreground"
							}`}
						>
							{fn}
						</button>
					))}
				</div>

				<div className="ml-auto flex items-center gap-2">
					<div className="text-xs text-muted-foreground mr-2">
						{lineCount} lines • {byteSize} bytes
					</div>

					<button
						type="button"
						className="px-2 py-1 text-xs border rounded"
						onClick={() => handleCopy(content, active)}
						aria-label={`Copy ${active}`}
					>
						{copied === active ? "Copied!" : "Copy"}
					</button>

					<button
						type="button"
						className="px-2 py-1 text-xs border rounded"
						onClick={() => handleDownload(content, active)}
						aria-label={`Download ${active}`}
					>
						Download
					</button>
				</div>
			</div>

			{/* Code area */}
			<div className="flex-1 overflow-auto p-3 bg-white">
				{/* Simple code container; swap with Prism/Highlight if you want colorization */}
				<pre
					className="whitespace-pre-wrap text-sm font-mono leading-5"
					style={{ whiteSpace: "pre", wordBreak: "normal" }}
				>
					{content}
				</pre>
			</div>
		</div>
	);
}

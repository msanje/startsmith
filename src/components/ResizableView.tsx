"use client";

import { useLocalStorage } from "@uidotdev/usehooks";
import { useEffect, useState } from "react";
import {
	ResizableHandle,
	ResizablePanel,
	ResizablePanelGroup,
} from "@/components/ui/resizable";
import EditorView from "./Editor";
import Preview from "./Preview";

const initial = ``;

export function ResizableView() {
	const [storedText, setStoredText] = useLocalStorage(
		"typescript.text",
		initial,
	);
	const [text, setText] = useState(storedText);

	const handleOnchange = (val: string) => {
		setText(val);
	};

	useEffect(() => {
		setStoredText(text);
	}, [text]);

	return (
		<ResizablePanelGroup
			direction="horizontal"
			// className="min-h-[200px] max-w-md rounded-lg border md:min-w-[450px]"
			className="min-h-screen max-w-md rounded-lg border md:min-w-screen"
		>
			<ResizablePanel defaultSize={40}>
				<div className="flex h-full items-center justify-center p-6">
					{/* <Editor /> */}
					{/* <EditorView value={text} onChange={(val) => setText(val!)} />  */}
					<EditorView value={text} onChange={(val) => handleOnchange(val!)} />
				</div>
			</ResizablePanel>
			<ResizableHandle />
			<ResizablePanel defaultSize={60}>
				<div className="flex h-full items-center justify-center p-6">
					<Preview input={} />
				</div>
			</ResizablePanel>
		</ResizablePanelGroup>
	);
}

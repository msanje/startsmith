"use client";

import { useEffect, useState } from "react";
import { generateApiTs } from "@/lib/generators/generateApiTs";
import { generateFormTsx } from "@/lib/generators/generateFormTsx";
import { generateSchemaTs } from "@/lib/generators/generateSchemaTs";
import { parseFirstInterface } from "@/lib/parse";
import { NormalizedSchema } from "@/lib/types";
import CodeView from "./CodeView";
import { PreviewForm } from "./PreviewForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

interface Props {
	input: string;
}

export default function Preview({ input }: Props) {
	const [debounced, setDebounced] = useState(input);
	const [schema, setSchema] = useState<NormalizedSchema | null>(null);
	const [error, setError] = useState<string | null>(null);

	const generatedFiles = schema
		? {
				"schema.ts": generateSchemaTs(schema),
				"Form.tsx": generateFormTsx(schema),
				"api.ts": generateApiTs(schema),
			}
		: {};

	useEffect(() => {
		const id = setTimeout(() => setDebounced(input), 250);

		return () => clearTimeout(id);
	}, [input]);

	useEffect(() => {
		if (!debounced.trim()) {
			setSchema(null);
			setError(null);
			return;
		}

		try {
			const parsed = parseFirstInterface(debounced);
			setSchema(parsed);
			setError(null);
		} catch (error: any) {
			setSchema(null);
			setError(error.message || "Parse error");
		}
	}, [debounced]);

	return (
		<div className="w-full h-full p-4 overflow-auto">
			<h2 className="text-lg font-semibold mb-3">Preview</h2>

			{error && <div className="text-red-600 text-sm mb-4">{error}</div>}

			{!schema && !error && (
				<div className="text-sm text-muted-foreground">
					Type an interface on left to generate a form
				</div>
			)}

			{/* {schema && <PreviewForm schema={schema} />} */}

			<Tabs defaultValue="preview">
				<TabsList>
					<TabsTrigger value="preview">Preview</TabsTrigger>
					<TabsTrigger value="code">Code</TabsTrigger>
				</TabsList>

				<TabsContent value="preview">
					{schema ? (
						<PreviewForm schema={schema!} />
					) : (
						<div className="p-4 text-sm text-muted-foreground">
							Type an interface on the left to generate a form
						</div>
					)}
				</TabsContent>

				<TabsContent value="code">
					<CodeView files={generatedFiles} />
				</TabsContent>
			</Tabs>
		</div>
	);
}

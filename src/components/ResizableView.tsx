import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import Editor from "./Editor"
import Preview from "./Preview"

export function ResizableView() {
  return (
    <ResizablePanelGroup
      direction="horizontal"
      // className="min-h-[200px] max-w-md rounded-lg border md:min-w-[450px]"
      className="min-h-screen max-w-md rounded-lg border md:min-w-screen"
    >
      <ResizablePanel defaultSize={40}>
        <div className="flex h-full items-center justify-center p-6">
          <Editor />
        </div>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize={60}>
        <div className="flex h-full items-center justify-center p-6">
          <Preview />
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  )
}

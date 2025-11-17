import { ClientOnly } from '@/components/ClientOnly'
import { ResizableView } from '@/components/ResizableView'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/home')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <ClientOnly>
      <ResizableView />
    </ClientOnly>
  )
  // return <div className='flex flex-row min-h-screen min-w-screen'>
  //   <div className='flex-1 bg-red-400'></div>
  //   <div className='flex-1 bg-blue-400'></div>
  // </div>
}

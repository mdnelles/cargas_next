import { Loader2 } from "lucide-react";

export default function Loading({ text = "Loading..." }: { text?: string }) {
   return (
      <div className='flex flex-col items-center justify-center space-y-2 p-4'>
         <Loader2 className='h-8 w-8 animate-spin text-primary' />
         <p className='text-sm text-muted-foreground'>{text}</p>
      </div>
   );
}

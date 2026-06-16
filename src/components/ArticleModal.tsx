"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Article } from "@/lib/news/types"
import DOMPurify from "isomorphic-dompurify"

export function ArticleModal({ article }: {article:Article}) {

  const cleanHTML =  DOMPurify.sanitize(article.content ?? "")
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant='outline'>Read More</Button>
      </DialogTrigger>
      <DialogContent showCloseButton={true}>
        {article.source === "Guardian" ? <><DialogHeader className="bg-gray-800 p-4">
          <DialogTitle className="px-4 text-xl">{article.title}</DialogTitle>
          <DialogDescription className="px-4 flex gap-4 text-md">
            
            <span>{article.byline}</span>
            <span>{new Date(article.publishedAt).toLocaleString("en-IN")}</span>
       
            
          </DialogDescription>
        </DialogHeader>
        <div className="mx-4 no-scrollbar  overflow-y-auto p-4">
          
            <img src={article.thumbnail} className="mx-auto block mt-5 mb-10 w-full"></img>
            <div className="text-lg [&_p]:mb-6" dangerouslySetInnerHTML={{ __html:cleanHTML!}} />
        </div>
        </>: <iframe src={article.url} className="w-full h-full"></iframe>
        }
      </DialogContent>
    </Dialog>
  )
}

"use client"

import { checkIframe } from "@/app/actions/iframeCheck"
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
import { useState, useEffect } from "react"

export function ArticleModal({ article }: { article: Article }) {

  {/*if(article.source !== "Guardian"){
    return(
        <Button asChild variant='outline'>
            <a href={article.url} target='_blank' rel='noopener noreferrer'>
                Read more
            </a>
        </Button>
    )
   }*/}


  const [canEmbed, setCanEmbed] = useState<boolean | null>(null);

  const [open, setOpen] = useState(false);

  const [isLoading, setLoading] = useState(false)

  useEffect(() => {

    if (!open) return
    if (canEmbed !== null) return


    async function run() {
      setLoading(true)
      const { xfo, csp } = await checkIframe(article.url);

      const frameAncestors = csp?.match(
        /frame-ancestors\s+([^;]+)/i
      )?.[1];

      const frameAncestorsBlocked =
        frameAncestors !== undefined;

      const blocked =
        xfo?.toLowerCase() === "deny" ||
        xfo?.toLowerCase() === "sameorigin" ||
        frameAncestorsBlocked;

      console.log({
        xfo,
        csp,
        blocked,
        canEmbedWillBe: !blocked,
      });

      setCanEmbed(!blocked);
      setLoading(false)
    }

    run();

  }, [open, canEmbed, article.url]);

  const cleanHTML = DOMPurify.sanitize(article.content ?? "")



  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant='outline'>Read More</Button>
      </DialogTrigger>
      <DialogContent showCloseButton={true}>
        {article.source === "Guardian" ? <><DialogHeader className="bg-gray-800 p-4">
          <DialogTitle className=" text-xl">{article.title}</DialogTitle>
          <DialogDescription className="flex gap-4 text-md">

            <span>{article.byline}</span>
            <span>{new Date(article.publishedAt).toLocaleString("en-IN")}</span>


          </DialogDescription>
        </DialogHeader>
          <div className="mx-4 no-scrollbar overscroll-contain overflow-y-auto p-4">

            <img src={article.thumbnail} className="mx-auto block mt-5 mb-10 w-full"></img>
            <div className="text-lg [&_p]:mb-6" dangerouslySetInnerHTML={{ __html: cleanHTML! }} />
          </div>
        </> : isLoading ? <div
          className="bg-gray-900 rounded-lg shadow-md overflow-hidden animate-pulse"
        >
          <div className="h-48 bg-gray-800" />
          <div className="p-5 space-y-3">
            <div className="h-6 bg-gray-800 rounded w-full" />
            <div className="h-6 bg-gray-800 rounded w-2/3" />
            <div className="flex gap-4 pt-1">
              <div className="h-4 bg-gray-800 rounded w-24" />
              <div className="h-4 bg-gray-800 rounded w-16" />
            </div>
            <div className="space-y-2 pt-2">
              <div className="h-3 bg-gray-800 rounded w-full" />
              <div className="h-3 bg-gray-800 rounded w-5/6" />
            </div>
            <div className="h-4 bg-gray-800 rounded w-16 pt-1" />
          </div>
        </div> : canEmbed ? <iframe src={article.url} className="w-full h-full rounded-xl"></iframe> : <a href={article.url} className="text-xl p-5 pt-10 text-blue-500 underline" target='_blank' rel='noopener noreferrer'>This site does not allow cross site embedding, click here to go to external site</a>
        }
      </DialogContent>
    </Dialog>
  )
}

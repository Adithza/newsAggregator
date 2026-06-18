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

  useEffect(() => {
    async function run() {
      const { xfo, csp } = await checkIframe(article.url);

      const frameAncestorsBlocked =
        csp?.includes("frame-ancestors 'self'") ||
        csp?.includes("frame-ancestors 'none'");

      const blocked =
        xfo?.toLowerCase() === "deny" ||
        xfo?.toLowerCase() === "sameorigin";

      setCanEmbed(!blocked);
    }

    run();
  }, [article.url]);

  const cleanHTML = DOMPurify.sanitize(article.content ?? "")



  return (
    <Dialog>
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
        </> : canEmbed ? <iframe src={article.url} className="w-full h-full rounded-xl"></iframe> : <a href={article.url} className="text-xl p-5 pt-10 text-blue-500 underline">This site does not allow cross site embedding, click here to go to external site</a>
        }
      </DialogContent>
    </Dialog>
  )
}

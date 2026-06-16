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

export function ArticleModal({ article }: {article:Article}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant='outline'>Read More</Button>
      </DialogTrigger>
      <DialogContent showCloseButton={true}>
        {article.source === "Guardian" ? <><DialogHeader className="bg-gray-800 p-4">
          <DialogTitle className="px-4 text-2xl">{article.title}</DialogTitle>
          <DialogDescription className="px-4 ">
            <div className="flex gap-4 pb-2 text-lg">
            <span>{article.byline}</span>
            <span>{new Date(article.publishedAt).toLocaleString("en-IN")}</span>
            </div>
            
          </DialogDescription>
        </DialogHeader>
        <div className="mx-4 no-scrollbar  overflow-y-auto p-4">
          
            <img src={article.thumbnail} className="mx-auto block mt-5 mb-10 w-full"></img>
            <div className="text-xl [&_p]:mb-6" dangerouslySetInnerHTML={{ __html:article.content!}} />
        </div>
        </>: <iframe src={article.url} className="w-full h-full"></iframe>
        }
      </DialogContent>
    </Dialog>
  )
}

import Image from "next/image";
import PostTop from "@/components/PostTop";
import PostFooter from "@/components/PostFooter";
import { formatDate } from "@/lib/format";

export default function PostCard({ post, currentUserId }) {
  // The query loads newest-first; show oldest-first so conversations read naturally
  const comments = [...post.comments].reverse().map((c) => ({
    id: c.id,
    text: c.text,
    date: formatDate(c.createdAt),
    authorId: c.authorId,
    authorName: c.author.name,
    authorImage: c.author.image,
  }));

  return (
    <article className="-mx-4 overflow-hidden border-y border-gray-200 bg-white shadow-sm sm:mx-0 sm:rounded-2xl sm:border">
      <PostTop
        postId={post.id}
        authorId={post.author.id}
        authorName={post.author.name}
        authorImage={post.author.image}
        date={formatDate(post.createdAt)}
        caption={post.caption}
        canEdit={post.authorId === currentUserId}
      />

      <Image
        src={post.imageUrl}
        alt={post.caption || `Photo by ${post.author.name}`}
        width={800}
        height={800}
        unoptimized
        className="aspect-square w-full bg-gray-100 object-cover"
      />

      <PostFooter
        postId={post.id}
        postAuthorId={post.authorId}
        currentUserId={currentUserId}
        initialLiked={post.likes.length > 0}
        initialLikeCount={post._count.likes}
        initialComments={comments}
        initialCommentCount={post._count.comments}
      />
    </article>
  );
}

-- CreateTable
CREATE TABLE "post_like" (
    "userId" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "post_like_pkey" PRIMARY KEY ("userId","postId")
);

-- CreateIndex
CREATE INDEX "post_like_postId_idx" ON "post_like"("postId");

-- AddForeignKey
ALTER TABLE "post_like" ADD CONSTRAINT "post_like_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post_like" ADD CONSTRAINT "post_like_postId_fkey" FOREIGN KEY ("postId") REFERENCES "post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

"use client";
import { useUser } from "@clerk/nextjs";
import { useCallback, useEffect, useRef, useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";

export default function Feed() {
  const { isSignedIn, user, isLoaded } = useUser();
  const [postModalOpen, setPostModalOpen] = useState(false);
  const [postDraft, setPostDraft] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const posts = useQuery(api.posts.get);
  const createPost = useMutation(api.createPost.createPost);

  const closePostModal = useCallback(() => {
    setPostModalOpen(false);
  }, []);

  useEffect(() => {
    if (!postModalOpen) return;
    textareaRef.current?.focus();
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closePostModal();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [postModalOpen, closePostModal]);

  const makePost = () => {
    createPost({
      userId: user?.id || "",
      post: postDraft,
    });
    setPostDraft("");
    closePostModal();
  };

  if (!isLoaded) return <div>Loading...</div>;

  if (!isSignedIn) {
    return (
      <div className="flex flex-col items-center justify-center">
        <h1>sign in to access.</h1>
        <h1>or dont. probably better for you anyway.</h1>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col items-center justify-center">
        <h1>this is your feed.</h1>
        <h1>boring? that&apos;s what we want.</h1>
        <div>
          <div className="p-4 m-4 border-2 border-zinc-700">
            <h3 className="font-bold">user</h3>
            <p>most days aren&apos;t interesting</p>
          </div>
          {posts?.map((post) => (
            <div className="p-4 m-4 border-2 border-zinc-700" key={post._id}>
              <h3>{post.post}</h3>
            </div>
          ))}
        </div>
        <button
          type="button"
          className="fixed bottom-10 right-10 border-2 border-zinc-700 p-4 cursor-pointer bg-transparent text-left font-inherit text-foreground"
          onClick={() => setPostModalOpen(true)}
        >
          post something.
        </button>
      </div>

      {postModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          role="presentation"
          onClick={closePostModal}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="post-modal-title"
            className="w-full max-w-lg border-2 border-zinc-700 bg-background p-6 shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 id="post-modal-title" className="mb-4 text-lg font-bold">
              new post.
            </h2>
            <textarea
              ref={textareaRef}
              value={postDraft}
              maxLength={150}
              onChange={(e) => setPostDraft(e.target.value)}
              className="min-h-[120px] w-full resize-y border-2 border-zinc-700 bg-transparent p-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-500"
              placeholder="type something."
            />
            <p className="text-sm text-muted-foreground">
              {postDraft.length}/150
            </p>
            <div className="mt-4 flex justify-end gap-2">
              <button
                type="button"
                className="border-2 border-zinc-700 p-2 cursor-pointer"
                onClick={closePostModal}
              >
                cancel.
              </button>
              <button
                type="button"
                onClick={() => {
                  makePost();
                }}
                className="border-2 border-white p-2 cursor-pointer bg-black text-white"
              >
                post.
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

"use client";
import { Authenticated, Unauthenticated, AuthLoading } from "convex/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";

export default function Feed() {
  const [postModalOpen, setPostModalOpen] = useState(false);
  const [findModalOpen, setFindModalOpen] = useState(false);
  const [postDraft, setPostDraft] = useState("");
  const [feedMode, setFeedMode] = useState("everyone");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const posts = useQuery(api.posts.get);
  const createPost = useMutation(api.createPost.createPost);

  const closePostModal = useCallback(() => {
    setPostModalOpen(false);
  }, []);

  const closeFindModal = useCallback(() => {
    setFindModalOpen(false);
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
      post: postDraft,
    });
    setPostDraft("");
    closePostModal();
  };

  if (!AuthLoading) return <div>Loading...</div>;

  return (
    <>
      <Unauthenticated>
        <div className="flex flex-col items-center justify-center">
          <h1>sign in to access.</h1>
          <h1>or dont. probably better for you anyway.</h1>
        </div>
      </Unauthenticated>
      <Authenticated>
        <div className="flex flex-col items-center justify-center">
          <h1>this is your feed.</h1>
          <div className="flex gap-3">
            <button
              type="button"
              className={`cursor-pointer ${feedMode === "everyone" ? "font-bold" : ""}`}
              onClick={() => setFeedMode("everyone")}
            >
              everyone.
            </button>
            <button
              type="button"
              className={`cursor-pointer ${feedMode === "people" ? "font-bold" : ""}`}
              onClick={() => setFeedMode("people")}
            >
              just your people.
            </button>
          </div>
          <div>
            {feedMode === "everyone" &&
              posts?.map((post) => (
                <div
                  className="p-4 m-4 border-2 border-zinc-700"
                  key={post._id}
                >
                  <h3 className="font-bold">{post.userId}</h3>
                  <h3>{post.post}</h3>
                </div>
              ))}
          </div>
          <div className="flex fixed bottom-8 gap-8">
            <button
              type="button"
              className="border-2 border-zinc-700 p-4 cursor-pointer bg-transparent text-left font-inherit text-foreground"
              onClick={() => setFindModalOpen(true)}
            >
              find your people.
            </button>
            <button
              type="button"
              className="border-2 border-zinc-700 p-4 cursor-pointer bg-transparent text-left font-inherit text-foreground"
              onClick={() => setPostModalOpen(true)}
            >
              post something.
            </button>
          </div>
        </div>
        {findModalOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            role="presentation"
            onClick={closeFindModal}
          >
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby="find-modal-title"
              className="w-full max-w-lg border-2 border-zinc-700 bg-background p-6 shadow-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 id="find-modal-title" className="mb-4 text-lg font-bold">
                find people.
              </h2>
              <p className="pb-2">
                search for their username. only their exact username will do.
              </p>
              <input className="w-full resize-y border-2 border-zinc-700 bg-transparent p-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-500"></input>
            </div>
          </div>
        )}

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
      </Authenticated>
    </>
  );
}

import { mutation } from "./_generated/server";
import {v} from "convex/values";

export const createPost = mutation({
    args: {
        userId: v.string(),
        post: v.string(),
    },
    handler: async (ctx, args) => {
        return await ctx.db.insert("posts", {
            userId: args.userId,
            post: args.post,
        });
    }
})
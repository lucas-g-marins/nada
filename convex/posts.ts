import { query, mutation } from "./_generated/server";

export const get = query({
    args: {},
    handler: async (ctx) => {
        return await ctx.db.query("posts").collect();
    }
})
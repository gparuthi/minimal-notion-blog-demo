import { GetServerSideProps } from "next";
import { NextSeo } from "next-seo";
import Head from "next/head";
import * as React from "react";
import { BlockMapType, NotionRenderer } from "react-notion";
import { Footer } from "../components/sections/footer";
import { config } from "../config";
import { getBlogTable, getPageBlocks } from "../core/blog";
import { toNotionImageUrl } from "../core/notion";
import { dateFormatter } from "../core/utils";
import { Post } from "../types/blog";



interface PostProps {
  blocks: BlockMapType;
  post: Post;
}

export const getServerSideProps: GetServerSideProps<
  PostProps,
  { slug: string }
> = async ({ params }) => {
  const slug = params?.slug;

  if (!slug) {
    throw Error("No slug given");
  }
  const id = slug.split('--')[1]

  const table = await getBlogTable<Post>(config.notionBlogTableId);
  
  const post = table.find((t) => t.id === id);

  if (!post || (!post.published && process.env.NODE_ENV !== "development")) {
    throw Error(`Failed to find post for id: ${id}`);
  }

  const blocks = await getPageBlocks(post.id);

  return {
    props: {
      post,
      blocks,
    }
  };
};

const BlogPost: React.FC<PostProps> = ({ post, blocks }) => {
  if (!post) return null;

  return (
    <>
      <NextSeo
        title={post.title}
        description={post.preview}
        titleTemplate="%s – Gaurav Paruthi / Blog"
      />
      <Head>
        <meta name="date" content={new Date(post.date).toDateString()} />
      </Head>

      <div className="px-4 mt-8 mb-12 md:mt-12 md:mb-18">
        <h1 className="mb-2 text-2xl font-bold md:text-3xl sm:text-center">
          {post.title}
        </h1>
        <div className="text-gray-600 sm:text-center">
          <time dateTime={new Date(post.date).toISOString()}>
            {dateFormatter.format(new Date(post.date))}
          </time>
        </div>
      </div>
      <article className="flex-1 w-full max-w-3xl px-4 mx-auto">
        <NotionRenderer blockMap={blocks} mapImageUrl={toNotionImageUrl} />
      </article>
      <Footer />
    </>
  );
};
export default BlogPost;

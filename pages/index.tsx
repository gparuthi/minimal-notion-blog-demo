import { GetServerSideProps } from "next";
import { NextSeo } from "next-seo";
import { Blog } from "../components/sections/blog";
import { Footer } from "../components/sections/footer";
import { config } from "../config";
import { getBlogTable } from "../core/blog";
import { Post } from "../types/blog";


interface BlogProps {
  posts: Post[];
}

export const getServerSideProps: GetServerSideProps<BlogProps> = async () => {
  const posts = await getBlogTable<Post>(config.notionBlogTableId);
  const filteredPosts = posts
    .filter((post) => process.env.NODE_ENV === "development" || post.published)
    .sort((a, b) => Number(new Date(b.date)) - Number(new Date(a.date)));

  return {
    props: {
      posts: filteredPosts,
    }
  };
};

const App = ({ posts }: BlogProps) => (
  <>
    <NextSeo
      title={"My thoughts and musings"}
      description="My personal blog about startups, coding and everything else that is on my mind."
    />
    <div className="flex-1">
      <Blog posts={posts} />
    </div>
    <Footer />
  </>
);

export default App
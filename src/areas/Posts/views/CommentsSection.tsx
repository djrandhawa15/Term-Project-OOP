import { PropsWithChildren } from "hono/jsx";

type Props = PropsWithChildren<{
  postId?: number;
}>;

export function CommentsSection({ children, postId }: Props) {
  return (
    <section class="bg-white py-8 w-full">
      <div class="w-full px-4">{children}</div>
    </section>
  );
}

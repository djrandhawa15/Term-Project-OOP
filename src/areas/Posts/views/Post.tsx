"use client";

import React from "react";
import { TPost } from "../../../shared/dtos";
import { HighlightedContent } from "./HighlightedContent";

type Props = { post: TPost };

// Helper function to transform markdown-style code blocks to HTML
function parseContent(text: string) {
  const parts = text.split(/(```[\s\S]*?```)/g); // Split by code blocks

  return parts.map((part, index) => {
    if (part.startsWith("```") && part.endsWith("```")) {
      const code = part.slice(3, -3).trim(); // Remove backticks
      return (
        <pre key={index}>
          <code className="language-js">{code}</code>
        </pre>
      );
    } else {
      return <p key={index}>{part}</p>;
    }
  });
}

export function Post({ post }: Props) {
  return (
    <div
      key={post.id}
      className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md hover:bg-gray-50"
    >
      <div className="flex space-x-3">
        <div className="w-10 h-10 rounded-full bg-indigo-100 flex-shrink-0 flex items-center justify-center overflow-hidden">
          <img
            src="https://morgancarter.com.au/assets/images/blog/encouraging-upload/thumbnail.png"
            alt="User"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-grow">
          <HighlightedContent>{parseContent(post.text)}</HighlightedContent>
        </div>
      </div>
    </div>
  );
}

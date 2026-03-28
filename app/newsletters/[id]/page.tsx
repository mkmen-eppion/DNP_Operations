"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Loader2, ArrowLeft } from "lucide-react";

type Newsletter = {
  id: string;
  wp_title: string;
  wp_body: string;
  received_at: string;
};

export default function NewsletterArticlePage() {
  const { id } = useParams<{ id: string }>();
  const [newsletter, setNewsletter] = useState<Newsletter | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`/api/newsletters/${id}`)
      .then((r) => {
        if (!r.ok) throw new Error("Not found");
        return r.json();
      })
      .then((data) => {
        setNewsletter(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Newsletter not found.");
        setLoading(false);
      });
  }, [id]);

  return (
    <main
      className="min-h-screen p-6 py-10"
      style={{ background: "linear-gradient(135deg, #0a1530 0%, #0d1b3e 50%, #112050 100%)" }}
    >
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Logo */}
        <div className="flex justify-center">
          <Link href="/">
            <Image
              src="/logo.png"
              alt="Diaspora Property Network"
              width={200}
              height={0}
              style={{ height: "auto" }}
              className="object-contain"
              priority
            />
          </Link>
        </div>

        {/* Back link */}
        <Link
          href="/newsletters"
          className="inline-flex items-center gap-1.5 text-sm transition-colors hover:text-[#c9a84c]"
          style={{ color: "#9aa3b8" }}
        >
          <ArrowLeft className="size-4" />
          Back to newsletters
        </Link>

        {loading && (
          <div className="flex justify-center py-16">
            <Loader2 className="size-8 animate-spin" style={{ color: "#c9a84c" }} />
          </div>
        )}

        {error && (
          <p className="text-center text-sm py-16" style={{ color: "#9aa3b8" }}>
            {error}
          </p>
        )}

        {!loading && newsletter && (
          <article
            className="rounded-xl border shadow-2xl overflow-hidden"
            style={{ backgroundColor: "#ffffff", borderColor: "rgba(201,168,76,0.3)" }}
          >
            {/* Article header */}
            <div
              className="px-8 py-6 border-b"
              style={{
                background: "linear-gradient(135deg, #0d1b3e, #112050)",
                borderColor: "rgba(201,168,76,0.2)",
              }}
            >
              <div
                className="h-0.5 w-16 mb-4 rounded"
                style={{ background: "linear-gradient(90deg, #c9a84c, #e6c97a)" }}
              />
              <h1
                className="text-2xl font-bold tracking-tight leading-snug"
                style={{ color: "#c9a84c" }}
              >
                {newsletter.wp_title}
              </h1>
              <p className="text-xs mt-2" style={{ color: "#9aa3b8" }}>
                {new Date(newsletter.received_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>

            {/* Article body — rendered as HTML */}
            <div
              className="px-8 py-8 newsletter-body"
              dangerouslySetInnerHTML={{ __html: newsletter.wp_body }}
            />
          </article>
        )}
      </div>
    </main>
  );
}

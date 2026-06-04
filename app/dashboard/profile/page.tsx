import { getServerSession } from "@/lib/auth/session";
import { getUserById } from "@/services/user.service";
import { getUserBlogs } from "@/services/blog.service";
import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getCloudinaryUrl } from "@/lib/utils";

export const dynamic = "force-dynamic";

const STATUS_CONFIG: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline"; color: string }> = {
  published: { label: "Published", variant: "default", color: "bg-emerald-500" },
  pending: { label: "Pending Review", variant: "secondary", color: "bg-amber-500" },
  changes_requested: { label: "Changes Requested", variant: "outline", color: "border-orange-500 text-orange-600" },
  draft: { label: "Draft", variant: "secondary", color: "bg-gray-500" },
  rejected: { label: "Rejected", variant: "destructive", color: "bg-red-500" },
};

export default async function ProfilePage() {
  const session = await getServerSession();
  if (!session) redirect("/");

  const [user, blogs] = await Promise.all([
    getUserById(session.userId),
    getUserBlogs(session.userId),
  ]);

  if (!user) redirect("/");

  return (
    <div className="space-y-12 max-w-4xl mx-auto py-10">
      {/* Centered User Info Section */}
      <div className="flex flex-col items-center text-center space-y-6">
        <div className="relative group">
          <Avatar className="w-40 h-40 border-4 border-emerald-500/10 shadow-2xl rounded-full overflow-hidden transition-transform hover:scale-105">
            <AvatarImage src={getCloudinaryUrl(user.avatar, 320)} className="object-cover" />
            <AvatarFallback className="text-5xl font-bold bg-emerald-100 text-emerald-600">
              {user.name?.[0]?.toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <Link 
            href="/dashboard/profile/edit" 
            className="absolute bottom-2 right-2 p-2 bg-white border border-gray-200 rounded-full shadow-lg hover:border-emerald-500 hover:text-emerald-600 transition-all"
            title="Edit Profile"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-pencil"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
          </Link>
        </div>

        <div className="space-y-2">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">{user.name}</h1>
          <p className="text-xl text-emerald-600 font-semibold">@{user.username || "username"}</p>
          <div className="flex items-center justify-center gap-2 text-gray-500 font-medium">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-mail"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
            <span>{user.email}</span>
          </div>
        </div>

        {user.bio && (
          <p className="max-w-md text-gray-600 text-lg leading-relaxed italic">
            "{user.bio}"
          </p>
        )}

        <div className="pt-4">
          <Link 
            href="/dashboard/write" 
            className="inline-flex items-center gap-2 px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl text-lg font-bold transition-all shadow-xl shadow-emerald-200 active:scale-95"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-plus-circle"><circle cx="12" cy="12" r="10"/><path d="M8 12h8"/><path d="M12 8v8"/></svg>
            Write Your Own Blog
          </Link>
        </div>
      </div>

      <hr className="border-gray-100" />

      {/* Blogs Status Section */}
      <div className="space-y-8">
        <div className="flex items-center justify-between px-4">
          <h2 className="text-3xl font-bold text-gray-900">Blog History</h2>
          <Badge variant="outline" className="px-4 py-1.5 rounded-full bg-emerald-50 text-emerald-700 border-emerald-100 font-bold">
            {blogs.length} Uploaded
          </Badge>
        </div>

        {blogs.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 px-4">
            {blogs.map((blog: any) => {
              const status = STATUS_CONFIG[blog.status as string] || STATUS_CONFIG.draft;
              return (
                <Card key={String(blog._id)} className="border border-gray-100 shadow-sm hover:shadow-xl transition-all rounded-3xl overflow-hidden bg-white group">
                  <div className="flex flex-col sm:flex-row h-full">
                    {blog.thumbnail && (
                      <div className="relative w-full sm:w-64 h-48 sm:h-auto overflow-hidden">
                        <Image
                          src={getCloudinaryUrl(blog.thumbnail, 640)}
                          alt={blog.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      </div>
                    )}
                    <CardContent className="flex-1 p-8 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <span className="text-xs font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1 rounded-lg">
                            {blog.category}
                          </span>
                          <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest text-white ${status.color}`}>
                            {status.label}
                          </div>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 line-clamp-1 mb-2 group-hover:text-emerald-600 transition-colors">{blog.title}</h3>
                        <p className="text-gray-500 line-clamp-2 leading-relaxed">{blog.excerpt}</p>
                      </div>
                      
                      <div className="mt-8 flex items-center justify-between pt-6 border-t border-gray-50">
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-calendar-days"><path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/><path d="M8 14h.01"/><path d="M12 14h.01"/><path d="M16 14h.01"/><path d="M8 18h.01"/><path d="M12 18h.01"/><path d="M16 18h.01"/></svg>
                          <span>{new Date(blog.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</span>
                        </div>
                        <div className="flex gap-4">
                          {blog.status === "published" && (
                            <Link href={`/blog/${blog.slug}`} className="text-sm font-black text-emerald-600 hover:text-emerald-700 uppercase tracking-tighter">
                              VIEW LIVE
                            </Link>
                          )}
                          {(blog.status === "draft" || blog.status === "changes_requested") && (
                            <Link href={`/dashboard/blogs/${String(blog._id)}/edit`} className="text-sm font-black text-orange-600 hover:text-orange-700 uppercase tracking-tighter">
                              EDIT CONTENT
                            </Link>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </div>
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-24 bg-gray-50/50 rounded-[3rem] border-2 border-dashed border-gray-200 mx-4">
            <div className="text-7xl mb-6">✍️</div>
            <h3 className="text-2xl font-extrabold text-gray-900">Your Story Starts Here</h3>
            <p className="text-gray-500 text-lg mt-4 max-w-sm mx-auto leading-relaxed">
              You haven't written any blogs yet. Share your financial insights with the world!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

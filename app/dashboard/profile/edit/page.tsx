"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { Loader2, Camera } from "lucide-react";
import { getCloudinaryUrl } from "@/lib/utils";
import { api } from "@/lib/api";

export default function EditProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [form, setForm] = useState({ name: "", bio: "", avatar: "" });
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    api.get("/api/auth/me")
      .then(({ data: d }) => {
        if (d.success) {
          setUser(d.data);
          setForm({
            name: d.data.name || "",
            bio: d.data.bio || "",
            avatar: d.data.avatar || "",
          });
        } else {
          router.push("/login");
        }
      })
      .finally(() => setLoading(false));
  }, [router]);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("thumbnail", file); // Reusing thumbnail upload API
      const { data } = await api.post("/api/upload/thumbnail", fd);
      if (data.success) {
        setForm({ ...form, avatar: data.data.url });
        toast.success("Avatar uploaded!");
      } else {
        toast.error(data.error || "Upload failed");
      }
    } catch {
      toast.error("Upload error");
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const { data } = await api.patch("/api/user/profile", form);
      if (data.success) {
        toast.success("Profile updated successfully!");
        router.push("/dashboard/profile");
        router.refresh();
      } else {
        toast.error(data.error || "Update failed");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Edit Profile</h1>
        <Button variant="ghost" onClick={() => router.back()} className="text-gray-500">Cancel</Button>
      </div>

      <Card className="border-none shadow-xl rounded-3xl overflow-hidden">
        <CardContent className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Avatar Upload */}
            <div className="flex flex-col items-center gap-4 mb-8">
              <div className="relative group">
                <Avatar className="w-32 h-32 border-4 border-white shadow-xl rounded-3xl overflow-hidden">
                  <AvatarImage src={getCloudinaryUrl(form.avatar, 256)} className="object-cover" />
                  <AvatarFallback className="text-4xl font-bold bg-indigo-100 text-indigo-600">
                    {form.name?.[0]?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <label className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer rounded-3xl">
                  <Camera className="w-8 h-8 text-white" />
                  <input type="file" className="hidden" accept="image/*" onChange={handleUpload} disabled={uploading} />
                </label>
                {uploading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-white/60 rounded-3xl">
                    <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
                  </div>
                )}
              </div>
              <p className="text-xs text-gray-400 font-medium">Click image to change profile picture</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
                placeholder="Your full name"
                className="rounded-xl h-12"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={form.bio}
                onChange={(e) => setForm({ ...form, bio: e.target.value })}
                placeholder="Tell us a bit about yourself..."
                className="rounded-xl min-h-[100px]"
                maxLength={200}
              />
              <p className="text-[10px] text-gray-400 text-right">{form.bio.length}/200</p>
            </div>

            <Button type="submit" disabled={saving || uploading} className="w-full h-12 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition-all shadow-lg shadow-indigo-100">
              {saving ? "Saving Changes..." : "Update Profile"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

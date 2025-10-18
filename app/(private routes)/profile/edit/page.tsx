"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { getMe, updateMe } from "@/lib/api/clientApi";
import { useAuthStore } from "@/lib/store/authStore";
import css from "./EditProfilePage.module.css";

export default function EditProfilePage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const localUser = useAuthStore((s) => s.user);

  const {
    data: user,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["me"],
    queryFn: getMe,
    initialData: localUser || undefined,

    enabled: !!localUser || typeof window !== "undefined",
  });

  const [username, setUsername] = useState(user?.username || "");

  useEffect(() => {
    if (user && user.username && !username) {
      setUsername(user.username);
    }
  }, [user, username]);

  const updateMutation = useMutation({
    mutationFn: (newUsername: string) => updateMe({ username: newUsername }),
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(["me"], updatedUser);

      useAuthStore.getState().setUser(updatedUser);
      router.push("/profile");
    },
    onError: (error: Error) => {
      console.error("Update failed:", error);
      alert(`Update failed: ${error.message}`);
    },
  });

  if (isLoading)
    return <main className={css.mainContent}>Loading user data...</main>;
  if (isError || !user)
    return <main className={css.mainContent}>Error loading user profile.</main>;

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmedUsername = username.trim();

    if (trimmedUsername === user.username) {
      router.back();
      return;
    }

    if (trimmedUsername.length === 0) {
      alert("Username cannot be empty.");
      return;
    }

    updateMutation.mutate(trimmedUsername);
  };

  return (
    <main className={css.mainContent}>
      <div className={css.profileCard}>
        <h1 className={css.formTitle}>Edit Profile</h1>

        <Image
          src={
            user.avatar || "https://ac.goit.global/fullstack/default-avatar.jpg"
          }
          alt="User Avatar"
          width={120}
          height={120}
          className={css.avatar}
          priority
        />

        <form className={css.profileInfo} onSubmit={handleSave}>
          <div className={css.usernameWrapper}>
            <label htmlFor="username">Username:</label>
            <input
              id="username"
              type="text"
              className={css.input}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={updateMutation.isPending}
            />
          </div>

          <p>Email: {user.email}</p>

          <div className={css.actions}>
            <button
              type="submit"
              className={css.saveButton}
              disabled={updateMutation.isPending}
            >
              {updateMutation.isPending ? "Saving..." : "Save"}
            </button>
            <button
              type="button"
              className={css.cancelButton}
              onClick={() => router.back()}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}

import Image from "next/image";
import Link from "next/link";
import { getMe } from "@/lib/api/serverApi";
import { Metadata } from "next";
import css from "./ProfilePage.module.css";

export const metadata: Metadata = {
  title: "User Profile | NoteHub",
  description: "View and manage your NoteHub profile.",
};

export default async function ProfilePage() {
  let user = null;
  try {
    user = await getMe();
  } catch (error) {
    console.error("Failed to fetch user profile:", error);
  }

  if (!user) {
    return (
      <main className={css.mainContent}>
        <div className={css.profileCard}>
          <h1 className={css.formTitle}>Profile</h1>
          <p>User data not available. Please try logging in again.</p>
        </div>
      </main>
    );
  }

  return (
    <main className={css.mainContent}>
      <div className={css.profileCard}>
        <div className={css.header}>
          <h1 className={css.formTitle}>Profile Page</h1>
          <Link href="/profile/edit" className={css.editProfileButton}>
            Edit Profile
          </Link>
        </div>
        <div className={css.avatarWrapper}>
          <Image
            src={
              user.avatar ||
              "https://ac.goit.global/fullstack/default-avatar.jpg"
            }
            alt="User Avatar"
            width={120}
            height={120}
            className={css.avatar}
            priority
          />
        </div>
        <div className={css.profileInfo}>
          <p>Username: **{user.username}**</p>
          <p>Email: **{user.email}**</p>
        </div>
      </div>
    </main>
  );
}

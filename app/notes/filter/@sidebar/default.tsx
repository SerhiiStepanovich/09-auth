import Link from "next/link";
import styles from "./SidebarNotes.module.css";

const tags = ["All", "Todo", "Work", "Personal", "Meeting", "Shopping"];

const Sidebar = () => {
  return (
    <>
      <Link href="/notes/action/create">Create note</Link>
      <ul className={styles.menuList}>
        {tags.map((tag) => (
          <li key={tag} className={styles.menuItem}>
            <Link href={`/notes/filter/${tag}`} className={styles.menuLink}>
              {tag === "All" ? "All Notes" : tag}
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
};

export default Sidebar;

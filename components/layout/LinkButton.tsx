import Link from "next/link";
import { ILinkButtonProps } from "types";
import styles from "@styles/layout/LinkButton.module.css";

export default function LinkButton({ href, linkText }: ILinkButtonProps) {
  return (
    <Link href={href}>
      <a className={styles.link_button}>{linkText}</a>
    </Link>
  );
}

import styles from "../styles/Inner.module.css";
import { useRouter } from "next/router";
import React from "react";
import Image from "next/image";

const sanitizeLink = (directLink) => {
	// prevent XSS (replace case insensitive `javascript` recursively in the URL)
	let searchMask = "javascript";
	let regEx = new RegExp(searchMask, "ig");

	while (directLink !== String(directLink).replace(regEx, "")) {
		directLink = String(directLink).replace(regEx, "");
	}

	return directLink;
};

export default function Home() {
	const router = useRouter();
	const [isMounted, setIsMounted] = React.useState(false);

	React.useEffect(() => {
		setIsMounted(true);
	}, []);

	let { directLink } = router.query;
	const isDirectLink = typeof directLink === "string" && directLink.length > 0;

	React.useEffect(() => {
		if (isMounted && router.isReady && isDirectLink) {
			directLink = sanitizeLink(directLink);
			router.push(directLink);
		}
	}, [isMounted, router.isReady, isDirectLink]);

	if (!isMounted) return null; // prevent SSR

	return (
		<main className="text-center mt-5">
			<h3 className="h3 mb-3 fw-normal">Where do you want to go next?</h3>
			<h5
				className="h5 mb-2 fw-normal"
				style={{ cursor: "pointer" }}
				onClick={() => {
					router.push("/users");
				}}
			>
				List of Users
			</h5>
			<h5
				className="h5 mb-2 fw-normal"
				style={{ cursor: "pointer" }}
				onClick={() => {
					router.push("/groups");
				}}
			>
				List of Groups
			</h5>
			<h5
				className="h5 mb-2 fw-normal"
				style={{ cursor: "pointer" }}
				onClick={() => {
					router.push("/profile");
				}}
			>
				Your Profile
			</h5>
			<div className={styles.footer}>
				Powered by <Image src="/wizer.svg" alt="Wizer" width={200} height={100} className={styles.logo} />
			</div>
		</main>
	);
}

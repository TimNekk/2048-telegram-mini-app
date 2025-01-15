import { useNavigate } from "react-router-dom";
import { backButton } from "@telegram-apps/sdk-react";
import { swipeBehavior } from "@telegram-apps/sdk";
import { PropsWithChildren, useEffect } from "react";
import BottomNavBar from "./BottomNavBar";
import { Stack } from "@mui/material";

export function Page({
    children,
    back = true,
    swipeable = true,
}: PropsWithChildren<{
    back?: boolean;
    swipeable?: boolean;
}>) {
    const navigate = useNavigate();

    useEffect(() => {
        if (back) {
            backButton.show();
            return backButton.onClick(() => {
                navigate(-1);
            });
        }
        backButton.hide();
    }, [back]);

    useEffect(() => {
        if (swipeable) {
            swipeBehavior.enableVertical.ifAvailable();
        } else {
            swipeBehavior.disableVertical.ifAvailable();
        }
    }, [swipeBehavior]);

    return (
        <Stack
            style={{
                height: "var(--tg-viewport-height)",
                width: "var(--tg-viewport-width)",
            }}
        >
            <header
                style={{
                    display: "flex",
                    justifyContent: "center",
                    width: "100%",
                    padding: "0.9rem 0",
                    color: "#ff462d",
                }}
            >
                <svg
                    style={{ width: "100px" }}
                    viewBox="0 0 96 34"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M80.1367 4.83406L76.8245 13.9056L80.9667 13.5443L84.2789 4.4732L87.927 4.15353L89.261 0.5L77.4517 1.53039L76.1171 5.18417L80.1367 4.83406Z"
                        fill="currentColor"
                    ></path>
                    <path
                        d="M84.1921 14.4588L96.0014 13.4289L94.6681 17.0805L91.02 17.4002L87.7078 26.4727L83.565 26.834L86.8778 17.7611L82.8588 18.1112L84.1921 14.4588Z"
                        fill="currentColor"
                    ></path>
                    <path
                        d="M81.7244 18.2146L83.0602 14.557L72.293 15.4964L67.6457 28.2234L78.5956 27.2684L79.9356 23.5969L73.128 24.1936L73.6472 22.7707L78.8261 22.3361L79.8081 19.597L74.647 20.0334L75.1001 18.792L81.7244 18.2146Z"
                        fill="currentColor"
                    ></path>
                    <path
                        d="M65.9611 16.0498L71.1246 15.5995L64.2691 22.5649L67.2589 28.2572L62.8702 28.6398L60.5195 23.9203L59.4876 24.0129L57.631 29.0968L53.4885 29.4581L58.1354 16.7323L62.278 16.371L60.6352 20.8699L61.6576 20.7775L65.9611 16.0498Z"
                        fill="currentColor"
                    ></path>
                    <path
                        d="M55.0338 22.4101C55.9798 18.9075 54.4734 17.0517 51.2098 17.336L44.274 17.9412L39.6277 30.6671L43.7702 30.3057L44.9756 26.9905L49.4931 26.5863C52.3117 26.3361 54.223 25.3547 55.0338 22.4101ZM49.5703 23.2569L46.2304 23.5649L47.0799 21.2362L50.053 20.986C50.9217 20.909 51.2885 21.1592 51.192 21.9097C51.0955 22.6988 50.5935 23.1607 49.5703 23.2569Z"
                        fill="currentColor"
                    ></path>
                    <path
                        d="M24.4777 31.9884L32.5674 18.9622L38.5836 18.4375L39.1121 30.7121L35.0782 31.0638L35.0056 29.3774L30.1729 29.7917L29.114 31.584L24.4777 31.9884ZM34.694 22.1396L31.9907 26.715L34.8802 26.4659L34.694 22.1396Z"
                        fill="currentColor"
                    ></path>
                    <path
                        d="M22.0278 19.8814L28.1762 19.3452L23.5302 32.0701L19.3874 32.4319L22.2417 24.6144L17.1568 32.6268L13.6495 32.9327L14.1422 25.3196L11.2874 33.1388L7.14483 33.5L11.7911 20.7742L17.3593 20.2886L16.9936 27.8277L22.0278 19.8814Z"
                        fill="currentColor"
                    ></path>
                    <path
                        d="M69.7202 7.8576L62.8598 15.1235L58.5897 15.4959L63.2362 2.77016L67.3784 2.40887L65.1022 8.64294L71.2172 2.07392L75.9945 1.65726L71.3484 14.3832L67.2055 14.7445L69.7202 7.8576Z"
                        fill="currentColor"
                    ></path>
                    <path
                        d="M48.8677 16.3442L50.5579 11.7152L54.4108 11.3848L52.7228 16.0079L56.8654 15.6466L61.5117 2.92092L57.3692 3.28215L55.7503 7.71606L51.8966 8.04826L53.5141 3.61838L49.3715 3.97967L44.7252 16.7054L48.8677 16.3442Z"
                        fill="currentColor"
                    ></path>
                    <path
                        d="M46.4775 7.77033L40.4765 8.29228L37.1614 17.3648L33.0188 17.7261L37.6652 5.00041L47.8093 4.11564L46.4775 7.77033Z"
                        fill="currentColor"
                    ></path>
                    <path
                        d="M17.5109 19.0787L22.1472 18.6743L23.2059 16.8825L28.0386 16.4682L28.1112 18.1541L32.1451 17.8023L31.6166 5.52786L25.6007 6.05256L17.5109 19.0787ZM27.727 9.23033L27.9133 13.5566L25.0238 13.8057L27.727 9.23033Z"
                        fill="currentColor"
                    ></path>
                    <path
                        d="M14.8832 6.98725L21.0307 6.45112L16.385 19.1768L12.2425 19.5381L15.0967 11.7207L10.0121 19.7326L6.50458 20.0385L6.99727 12.4259L4.14259 20.2445L0 20.6059L4.64638 7.88002L10.2144 7.39444L9.84865 14.9339L14.8832 6.98725Z"
                        fill="currentColor"
                    ></path>
                </svg>
            </header>
            <main
                style={{
                    paddingBottom: "82px",
                }}
            >
                {children}
            </main>
            <BottomNavBar />
        </Stack>
    );
}

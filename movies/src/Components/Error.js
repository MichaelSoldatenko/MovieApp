import TopBar from "./TopBar";
import { useTheme } from "./SwitchTheme";

export default function Error() {
  const { theme } = useTheme();

  return (
    <div>
      <TopBar />

      <h1
        style={{
          position: "absolute",
          color: `${theme === "light-theme" ? "black" : "white"}`,
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      >
        Page not found!
      </h1>
    </div>
  );
}

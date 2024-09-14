import { useSelector } from "react-redux";
import { selectSettings } from "./mongoSlice/selector";

type Props = {
  children: React.ReactNode;
};
export const ThemeProvider = ({ children }: Props) => {
  const settings = useSelector(selectSettings);
  return (
    <div className={`${settings.theme === "vs-dark" ? "dark" : ""}`}>
      {children}
    </div>
  );
};

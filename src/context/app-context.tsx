"use client";

import {
  createContext,
  FC,
  ReactNode,
  useContext,
  useMemo,
  useState,
} from "react";
import { createTheme, PaletteMode, ThemeProvider } from "@mui/material";
import Cookies from "js-cookie";

type AppContextType = {
  mode: PaletteMode;
  toggleTheme: () => void;
};

const AppContext = createContext<AppContextType | null>(null);

export const useApp = () => {
  return useContext(AppContext);
};

type AppProviderProps = {
  children: ReactNode;
  initialMode: PaletteMode;
};

export const AppProvider: FC<AppProviderProps> = ({
  children,
  initialMode,
}) => {
  const [mode, setMode] = useState<PaletteMode>(initialMode || "light");

  const toggleTheme = () => {
    const newMode = mode === "light" ? "dark" : "light";
    setMode(newMode);
    // เก็บค่าใน cookies ให้หมดอายุ 7 วัน
    Cookies.set("color-mode", newMode, { expires: 7 });
  };

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: {
            main: "#ffc107",
          },
        },
        typography: {
          fontFamily: "Prompt,  sans-serif", // เปลี่ยนฟอนต์ถ้าต้องการ
        },
      }),
    [mode]
  );

  return (
    <AppContext.Provider value={{ toggleTheme, mode }}>
      <ThemeProvider theme={theme} noSsr>
        {children}
      </ThemeProvider>
    </AppContext.Provider>
  );
};

export default AppContext;

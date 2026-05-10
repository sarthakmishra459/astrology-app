import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useState,
} from "react";
import type { ReactNode } from "react";

type Kundli = {
  dob: string;
  time: string;
  place: string;
};

type KundliContextValue = {
  kundli: Kundli;
  setKundli: Dispatch<SetStateAction<Kundli>>;
};

const initialKundli: Kundli = {
  dob: "",
  time: "",
  place: "",
};

const KundliContext = createContext<KundliContextValue | null>(null);

export function KundliProvider({ children }: { children: ReactNode }) {
  const [kundli, setKundli] = useState<Kundli>(initialKundli);

  return (
    <KundliContext.Provider
      value={{
        kundli,
        setKundli,
      }}
    >
      {children}
    </KundliContext.Provider>
  );
}

export function useKundli() {
  const context = useContext(KundliContext);

  if (!context) {
    throw new Error("useKundli must be used inside KundliProvider");
  }

  return context;
}

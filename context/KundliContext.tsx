import {
  createContext,
  useContext,
  useState,
} from "react";

const KundliContext = createContext<any>(null);

export function KundliProvider({ children }: any) {

  const [kundli, setKundli] = useState({
    dob: "",
    time: "",
    place: "",
  });

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
  return useContext(KundliContext);
}
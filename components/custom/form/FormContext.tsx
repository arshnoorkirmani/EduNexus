"use client";

import { createContext, useContext } from "react";
import { UseFormReturn, FieldValues } from "react-hook-form";

type AppFormContextType<T extends FieldValues> = {
  form: UseFormReturn<T>;
};

const AppFormContext = createContext<AppFormContextType<any> | null>(null);

export function AppFormProvider<T extends FieldValues>({
  form,
  children,
}: {
  form: UseFormReturn<T>;
  children: React.ReactNode;
}) {
  return (
    <AppFormContext.Provider value={{ form }}>
      {children}
    </AppFormContext.Provider>
  );
}

export function useAppForm<T extends FieldValues>() {
  const ctx = useContext(AppFormContext);
  if (!ctx) {
    throw new Error("useAppForm must be used inside AppFormProvider");
  }
  return ctx as AppFormContextType<T>;
}

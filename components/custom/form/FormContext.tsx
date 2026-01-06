"use client";

import { createContext, useContext, useState } from "react";
import { UseFormReturn, FieldValues } from "react-hook-form";

type AppFormContextType<T extends FieldValues> = {
  form: UseFormReturn<T>;
  formId: string;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
};

const AppFormContext = createContext<AppFormContextType<any> | null>(null);

export function AppFormProvider<T extends FieldValues>({
  form,
  formId,
  children,
}: {
  form: UseFormReturn<T>;
  formId: string;
  children: React.ReactNode;
}) {
  const [isLoading, setIsLoading] = useState(false);
  return (
    <AppFormContext.Provider value={{ form, formId, isLoading, setIsLoading }}>
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

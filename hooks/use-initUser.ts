"use client";

import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useAppDispatch } from "@/store";
import { fetchInstitute } from "@/store/thunks/institute.thunks";
import { promiseToast } from "@/components/custom/utils/Toast";

export function useInitUser() {
  const dispatch = useAppDispatch();
  const { user, role, loading, isLoggedIn } = useAuth();

  useEffect(() => {
    if (loading) return;
    if (!user) return;

    console.log("User Session →", user); //remove
    console.log("User Role →", role); //remove

    if (role === "institute") {
      console.log("Fetching institute data…"); //remove

      promiseToast(dispatch(fetchInstitute(user.id)).unwrap(), {
        loading: "Fetching institute data…",
        success: "Institute data fetched successfully",
        error: (err) => err?.message || "Error fetching institute data",
      });
    }
  }, [user, role, loading, isLoggedIn]);
}

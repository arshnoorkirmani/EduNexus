"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useAuth } from "@/hooks/useAuth";

// import { setUser } from "@/store/slices/userSlice";
// import { setStudent } from "@/store/slices/studentSlice";
// import { setTeacher } from "@/store/slices/teacherSlice";
// import { setInstitute } from "@/store/slices/instituteSlice";

export function useInitUser() {
  const dispatch = useDispatch();
  const { user, role, loading, isLoggedIn, isStudent, isTeacher, isInstitute } =
    useAuth();

  useEffect(() => {
    if (loading) return; // wait for session
    if (!user) return; // no user session

    console.log("User Session →", user);
    console.log("User Role →", role);
    console.log("Is New User →", user.new);

    // OPTIONAL REDUX SYNC
    /*
    if (role === "student") dispatch(setStudent(user));
    if (role === "teacher") dispatch(setTeacher(user));
    if (role === "institute") dispatch(setInstitute(user));
    dispatch(setUser(user));
    */
  }, [user, role, loading, isLoggedIn]);
}

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export type Role = "admin" | "teacher" | "student";

export type User = {
  id: string;
  name: string;
  email: string;
  role: Role;
  school_id: string;
};

export default function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: authData } = await supabase.auth.getUser();
      if (!authData.user) {
        setUser(null);
        setLoading(false);
        return;
      }

      const { data: userData } = await supabase
        .from<User>("users")
        .select("*")
        .eq("id", authData.user.id)
        .single();

      setUser(userData);
      setLoading(false);
    };

    fetchUser();
  }, []);

  return { user, loading };
}

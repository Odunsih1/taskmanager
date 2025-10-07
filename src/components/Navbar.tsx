"use client";

import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { supabase } from "@/integration/supabase/client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface NavbarProps {
  showLogout?: boolean;
}

const Navbar = ({ showLogout = false }: NavbarProps) => {
  const router = useRouter();
  const [supabaseClient, setSupabaseClient] = useState<ReturnType<
    typeof supabase
  > | null>(null);

  // Initialize Supabase client on mount
  useEffect(() => {
    setSupabaseClient(supabase());
  }, []);

  const handleLogout = async () => {
    if (!supabaseClient) {
      toast.error("Supabase client not initialized");
      return;
    }

    const { error } = await supabaseClient.auth.signOut();
    if (error) {
      toast.error("Failed to log out");
    } else {
      toast.success("Logged out successfully");
      router.push("/");
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-foreground">Task Pro</h1>
        {showLogout && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            disabled={!supabaseClient}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

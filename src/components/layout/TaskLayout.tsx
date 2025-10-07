"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/integration/supabase/client";
import { User } from "@supabase/supabase-js";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import TaskCard from "@/components/TaskCard";
import AddTaskDialog from "@/components/AddTaskDialog";
import { useRouter } from "next/navigation";

interface Task {
  id: string;
  title: string;
  description: string;
  created_at: string;
}

const TaskLayout = () => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [supabaseClient, setSupabaseClient] = useState<ReturnType<typeof supabase> | null>(null);

  // Initialize Supabase client
  useEffect(() => {
    setSupabaseClient(supabase());
  }, []);

  useEffect(() => {
    if (!supabaseClient) return;

    // Set up auth state listener
    const {
      data: { subscription },
    } = supabaseClient.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      if (!session?.user) {
        router.push("/");
      }
    });

    // Check for existing session
    supabaseClient.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (!session?.user) {
        router.push("/");
      }
    });

    return () => subscription.unsubscribe();
  }, [supabaseClient, router]);

  useEffect(() => {
    if (user && supabaseClient) {
      fetchTasks();
    }
  }, [user, supabaseClient]);

  const fetchTasks = async () => {
    if (!supabaseClient) return;

    try {
      setIsLoading(true);
      const { data, error } = await supabaseClient
        .from("tasks")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setTasks(data || []);
    } catch (error: unknown) {
      toast.error("Failed to load tasks");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddTask = async (title: string, description: string) => {
    if (!user || !supabaseClient) return;

    try {
      const { error } = await supabaseClient.from("tasks").insert({
        user_id: user.id,
        title,
        description,
      });

      if (error) throw error;
      toast.success("Task created successfully");
      fetchTasks();
    } catch (error: unknown) {
      toast.error("Failed to create task");
      throw error;
    }
  };

  const handleDeleteTask = async (id: string) => {
    if (!supabaseClient) return;

    try {
      const { error } = await supabaseClient.from("tasks").delete().eq("id", id);

      if (error) throw error;
      toast.success("Task deleted");
      setTasks(tasks.filter((task) => task.id !== id));
    } catch (error: unknown) {
      toast.error("Failed to delete task");
    }
  };

  if (!user || !supabaseClient) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar showLogout />
      <main className="container mx-auto px-4 pt-24 pb-16">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-semibold text-foreground mb-1">
                Your Tasks
              </h1>
              <p className="text-muted-foreground">
                Manage your daily tasks and stay organized
              </p>
            </div>
            <AddTaskDialog onAdd={handleAddTask} />
          </div>

          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading tasks...</p>
            </div>
          ) : tasks.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-border rounded-lg">
              <p className="text-muted-foreground mb-4">
                No tasks yet. Add your first task!
              </p>
              <AddTaskDialog onAdd={handleAddTask} />
            </div>
          ) : (
            <div className="grid gap-4">
              {tasks.map((task) => (
                <TaskCard
                  key={task.id}
                  id={task.id}
                  title={task.title}
                  description={task.description}
                  onDelete={handleDeleteTask}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default TaskLayout;
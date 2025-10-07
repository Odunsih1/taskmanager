"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/integration/supabase/client";
import { User } from "@supabase/supabase-js";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useTaskStore } from "@/store/taskStore";
import Navbar from "@/components/Navbar";
import TaskCard from "@/components/TaskCard";
import TaskSkeleton from "@/components/TaskSkeleton";
import AddTaskDialog from "@/components/AddTaskDialog";
import SearchBar from "@/components/SearchBar";
import EmptyState from "@/components/EmptyState";

const TaskLayout = () => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [supabaseClient, setSupabaseClient] = useState<ReturnType<
    typeof supabase
  > | null>(null);

  // Zustand store selectors
  const tasks = useTaskStore((state) => state.tasks);
  const isLoading = useTaskStore((state) => state.isLoading);
  const searchQuery = useTaskStore((state) => state.searchQuery);
  const setTasks = useTaskStore((state) => state.setTasks);
  const setLoading = useTaskStore((state) => state.setLoading);
  const setSearchQuery = useTaskStore((state) => state.setSearchQuery);
  const addTask = useTaskStore((state) => state.addTask);
  const updateTask = useTaskStore((state) => state.updateTask);
  const deleteTask = useTaskStore((state) => state.deleteTask);
  const getFilteredTasks = useTaskStore((state) => state.getFilteredTasks);

  // Initialize Supabase client
  useEffect(() => {
    setSupabaseClient(supabase());
  }, []);

  // Auth state listener
  useEffect(() => {
    if (!supabaseClient) return;

    const {
      data: { subscription },
    } = supabaseClient.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      if (!session?.user) {
        router.push("/");
      }
    });

    supabaseClient.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (!session?.user) {
        router.push("/");
      }
    });

    return () => subscription.unsubscribe();
  }, [supabaseClient, router]);

  // Fetch tasks when user is authenticated
  useEffect(() => {
    if (user && supabaseClient) {
      fetchTasks();
    }
  }, [user, supabaseClient]);

  const fetchTasks = async () => {
    if (!supabaseClient) return;

    try {
      setLoading(true);
      const { data, error } = await supabaseClient
        .from("tasks")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setTasks(data || []);
    } catch (error: unknown) {
      toast.error("Failed to load tasks");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTask = async (title: string, description: string) => {
    if (!user || !supabaseClient) return;

    try {
      const newTask = {
        user_id: user.id,
        title,
        description,
      };

      const { data, error } = await supabaseClient
        .from("tasks")
        .insert(newTask)
        .select()
        .single();

      if (error) throw error;

      // Optimistically add to store
      addTask(data);
      toast.success("Task created successfully");
    } catch (error: unknown) {
      toast.error("Failed to create task");
      throw error;
    }
  };

  const handleEditTask = async (
    id: string,
    updates: { title: string; description: string }
  ) => {
    if (!supabaseClient) return;

    try {
      const { error } = await supabaseClient
        .from("tasks")
        .update(updates)
        .eq("id", id);

      if (error) throw error;

      // Update store
      updateTask(id, updates);
      toast.success("Task updated successfully");
    } catch (error: unknown) {
      toast.error("Failed to update task");
      console.error(error);
    }
  };

  const handleDeleteTask = async (id: string) => {
    if (!supabaseClient) return;

    // const confirmed = window.confirm(
    //   "Are you sure you want to delete this task?"
    // );
    // if (!confirmed) return;

    try {
      const { error } = await supabaseClient
        .from("tasks")
        .delete()
        .eq("id", id);

      if (error) throw error;

      // Remove from store
      deleteTask(id);
      toast.success("Task deleted");
    } catch (error: unknown) {
      toast.error("Failed to delete task");
      console.error(error);
    }
  };

  const handleLogout = async () => {
    if (!supabaseClient) return;

    await supabaseClient.auth.signOut();
    router.push("/");
  };

  // Show loading state before authentication
  if (!user || !supabaseClient) {
    return null;
  }

  const filteredTasks = getFilteredTasks();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar showLogout />

      <main className="container mx-auto px-4 pt-24 pb-16">
        <div className="max-w-4xl mx-auto">
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">
                  Your Tasks
                </h1>
                <p className="text-gray-600">
                  Manage your daily tasks and stay organized
                </p>
              </div>
              <AddTaskDialog onAdd={handleAddTask} />
            </div>

            {/* Search Bar */}
            <SearchBar value={searchQuery} onChange={setSearchQuery} />
          </div>

          {/* Tasks Grid */}
          {isLoading ? (
            <div className="grid gap-4">
              {[1, 2, 3].map((i) => (
                <TaskSkeleton key={i} />
              ))}
            </div>
          ) : filteredTasks.length === 0 ? (
            <EmptyState hasSearchQuery={!!searchQuery} />
          ) : (
            <div className="grid gap-4">
              {filteredTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onDelete={handleDeleteTask}
                  onEdit={handleEditTask}
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

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/app/utils/api";
import { User } from "@/app/types";

export const useUsers = (search: string) => {
  return useQuery({
    queryKey: ["users", search],
    queryFn: async () => {
      const { data } = await api.get("/users", {
        params: { search },
      });
      return data;
    },
  });
};

export const useUser = (id: string) => {
  return useQuery({
    queryKey: ["user", id],
    queryFn: async () => {
      const { data } = await api.get(`/users/${id}`);
      return data;
    },
  });
};

// create user mutation
export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userData: User) => {
      const { data } = await api.post("/users/signup", userData);
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(["users"]);
      queryClient.invalidateQueries(["user", data.id]);
    },
  });
};

// update user mutation
export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id, ...userData) => {
      const { data } = await api.put(`/users/${id}`, userData);
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(["users"]);
      queryClient.invalidateQueries(["user", data.id]);
    },
  });
};

// delete user mutation
export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      const { data } = await api.delete(`/users/${id}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["users"]);
    },
  });
};

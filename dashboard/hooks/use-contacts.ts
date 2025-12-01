import { Contact } from "@/app/dashboard/contacts/columns";
import api from "@/app/utils/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useContacts = (
  search: string,
  customerType?: string,
  status?: string
) => {
  return useQuery({
    queryKey: ["contacts", search, customerType, status],
    queryFn: async () => {
      const { data } = await api.get("/contacts", {
        params: { search, customerType },
      });
      return data;
    },
  });
};

export const useContact = (id: string) => {
  return useQuery({
    queryKey: ["contact", id],
    queryFn: async () => {
      const { data } = await api.get(`/contacts/${id}`);
      return data;
    },
  });
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userData: Contact) => {
      const { data } = await api.post("/contacts", userData);
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(["users"]);
      queryClient.invalidateQueries(["user", data.id]);
    },
  });
};

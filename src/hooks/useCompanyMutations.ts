import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createCompany, updateCompany, deleteCompany } from "@/api/company"
import { CompanyData } from "@/types/interfaces"

interface CompanyResponse {
  data: any // Define the response structure if known
}

export const useCompanyMutations = () => {
  const queryClient = useQueryClient()

  const createCompanyMutation = useMutation<CompanyResponse, Error, CompanyData>({
    mutationFn: createCompany,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["companies"] })
    },
    onError: (error: Error) => {
      console.error("Error creating company:", error.message)
    },
    onSettled: () => {
      console.log("Create company mutation settled")
    }
  })

  const updateCompanyMutation = useMutation<
    CompanyResponse,
    Error,
    { id: string; updates: CompanyData }
  >({
    mutationFn: ({ id, updates }) => updateCompany(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["companies"] })
    },
    onError: (error: Error) => {
      console.error("Error updating company:", error.message)
    },
    onSettled: () => {
      console.log("Update company mutation settled")
    }
  })

  const deleteCompanyMutation = useMutation<CompanyResponse, Error, string>({
    mutationFn: (id) => deleteCompany(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["companies"] })
    },
    onError: (error: Error) => {
      console.error("Error deleting company:", error.message)
    },
    onSettled: () => {
      console.log("Delete company mutation settled")
    }
  })

  return { createCompanyMutation, updateCompanyMutation, deleteCompanyMutation }
}

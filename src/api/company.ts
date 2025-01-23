import api from "@/api"
import { CompanyData } from "@/types"

// Create a new company
export const createCompany = async (data: CompanyData) => {
  const response = await api.post("/companies", data)
  return response.data.data
}

// Update an existing company
export const updateCompany = async (id: string, data: CompanyData) => {
  const response = await api.put(`/companies/${id}`, data)
  return response.data.data
}

// Delete a company
export const deleteCompany = async (id: string) => {
  const response = await api.delete(`/companies/${id}`)
  return response.data
}

// Get details of a specific company
export const getCompanyDetails = async (companyId: string) => {
  const response = await api.get(`/companies/${companyId}`)
  return response.data.data
}

// Fetch all companies owned by the current user
export const getMyCompanies = async () => {
  const response = await api.get("/companies/my-companies")
  return response.data.data
}

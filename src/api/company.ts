import api from "@/api"
import { CompanyData } from "@/types"

export const createCompany = async (data: CompanyData) => {
  const response = await api.post("/companies", data)
  return response.data.data
}

export const updateCompany = async (id: string, data: CompanyData) => {
  const response = await api.put(`/companies/${id}`, data)
  return response.data.data
}

export const deleteCompany = async (id: string) => {
  const response = await api.delete(`/companies/${id}`)
  return response.data
}

export const getCompanyDetails = async (companyId: string) => {
  const response = await api.get(`/companies/${companyId}`)
  return response.data.data
}

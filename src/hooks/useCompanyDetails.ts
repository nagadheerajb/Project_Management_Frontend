import { useQuery } from "@tanstack/react-query"
import api from "@/api"

export const useCompanyDetails = (companyId: string | null) => {
  return useQuery(
    ["companyDetails", companyId],
    () => api.get(`/companies/${companyId}`).then((res) => res.data.data),
    { enabled: !!companyId }
  )
}

"use client"

import type React from "react"
import { useState, useEffect, useCallback, useRef } from "react"
import { useQuery } from "@tanstack/react-query"
import { fetchAllUsers } from "@/api/user"
import type { UserReadDTO } from "@/types/interfaces"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { debounce } from "lodash"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface UserSearchProps {
  onUserSelect: (userId: string, userName: string) => void
  initialUserId?: string
  initialUserName?: string
}

export const UserSearch: React.FC<UserSearchProps> = ({
  onUserSelect,
  initialUserId,
  initialUserName
}) => {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedUser, setSelectedUser] = useState<{ id: string; name: string } | null>(
    initialUserId && initialUserName ? { id: initialUserId, name: initialUserName } : null
  )
  const [isOpen, setIsOpen] = useState(false)

  const {
    data: users = [],
    isLoading,
    error
  } = useQuery<UserReadDTO[]>({
    queryKey: ["users"],
    queryFn: fetchAllUsers,
    staleTime: 30000
  })

  const debouncedSearch = useCallback(
    debounce((term: string) => {
      setSearchTerm(term)
    }, 300),
    []
  )

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    debouncedSearch(e.target.value)
  }

  const filteredUsers = users.filter((user) => {
    if (!user || !user.id) return false
    const fullName = `${user.firstName} ${user.lastName}`.toLowerCase()
    const email = (user.email || "").toLowerCase()
    const term = searchTerm.toLowerCase()
    return fullName.includes(term) || email.includes(term)
  })

  const handleUserSelect = (user: UserReadDTO) => {
    if (!user.id) return
    const userName = `${user.firstName} ${user.lastName}`
    setSelectedUser({ id: user.id, name: userName })
    onUserSelect(user.id, userName)
    setIsOpen(false)
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={isOpen}
          className="w-full justify-between"
        >
          {selectedUser ? selectedUser.name : "Click to assign user"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Input
          placeholder="Search users..."
          className="border-0 focus-visible:ring-0"
          onChange={handleInputChange}
        />
        <ScrollArea className="h-[300px]">
          {filteredUsers.map((user) => (
            <div
              key={user.id}
              className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
              onClick={() => handleUserSelect(user)}
            >
              {user.firstName} {user.lastName} ({user.email})
            </div>
          ))}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  )
}

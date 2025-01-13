import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff } from "lucide-react"

interface PasswordInputProps {
  password: string
  setPassword: React.Dispatch<React.SetStateAction<string>>
  showPassword: boolean
  setShowPassword: React.Dispatch<React.SetStateAction<boolean>>
  disabled?: boolean // Add the disabled prop
}

const PasswordInput: React.FC<PasswordInputProps> = ({
  password,
  setPassword,
  showPassword,
  setShowPassword,
  disabled
}) => (
  <div className="space-y-2">
    <Label htmlFor="password" className="text-sm font-medium leading-none">
      Password
    </Label>
    <div className="relative">
      <Input
        id="password"
        type={showPassword ? "text" : "password"}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        disabled={disabled} // Apply the disabled prop
        className={`w-full px-3 py-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
          disabled ? "bg-gray-200 cursor-not-allowed" : ""
        }`}
      />
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        disabled={disabled} // Disable the button if the input is disabled
        className={`absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-500 ${
          disabled ? "cursor-not-allowed" : ""
        }`}
      >
        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
      </button>
    </div>
  </div>
)

export default PasswordInput

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface EmailInputProps {
  email: string
  setEmail: React.Dispatch<React.SetStateAction<string>>
  disabled?: boolean // Add the disabled prop
}

const EmailInput: React.FC<EmailInputProps> = ({ email, setEmail, disabled }) => (
  <div className="space-y-2">
    <Label htmlFor="email" className="text-sm font-medium leading-none">
      Email
    </Label>
    <Input
      id="email"
      type="email"
      placeholder="name@example.com"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      disabled={disabled} // Apply the disabled prop
      className={`w-full px-3 py-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
        disabled ? "bg-gray-200 cursor-not-allowed" : ""
      }`}
    />
  </div>
)

export default EmailInput
